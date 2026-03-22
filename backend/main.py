from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import json
import logging
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.requests import Request
import sentry_sdk
from openai import OpenAI

# Import new service layer
from services.chat import upsert_user
from services.upload import generate_upload_signature
from services.email import send_welcome_email
from services.search import index_pulse, update_pulse, soft_delete_pulse

load_dotenv()

# Sentry initialization
sentry_dsn = os.getenv("SENTRY_DSN")
if sentry_dsn:
    sentry_sdk.init(
        dsn=sentry_dsn,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

# Structured JSON Logging
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_obj = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module
        }
        return json.dumps(log_obj)

handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())
logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(handler)

# Rate Limiter Configuration
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Sejong Pulse API", version="0.1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Supabase Configuration
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# OpenAI Client for OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Profile(BaseModel):
    id: str
    pseudonym: str
    major: str
    year: int
    gpa: float = Field(..., ge=0, le=4.5)
    skills: List[str] = []
    current_building: Optional[str] = None
    avatar_url: Optional[str] = None

class Comment(BaseModel):
    id: str
    pulse_id: str
    user_id: str
    content: str
    created_at: str

class Pulse(BaseModel):
    id: str
    user_id: str
    content: str
    category: str
    building_tag: str
    created_at: str
    likes: int = 0
    comments_count: int = 0

class LikeRequest(BaseModel):
    user_id: str

class CreatePulseRequest(BaseModel):
    user_id: str
    content: str
    category: str = "Global"
    building_tag: str = "Campus"

class CommentRequest(BaseModel):
    user_id: str
    content: str

class MessageData(BaseModel):
    role: str
    content: str

class AdvisorRequest(BaseModel):
    query: str
    user_id: Optional[str] = None
    history: List[MessageData] = []
    content: str

class TranslationRequest(BaseModel):
    content: str
    target_lang: str = "ko"

def get_user_client(authorization: Optional[str] = Header(None)) -> Client:
    client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        client.postgrest.auth(token)
    return client

# Endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to Sejong Pulse API"}

class WelcomeRequest(BaseModel):
    to_email: str
    pseudonym: str
    user_id: str

@app.post("/api/auth/send-welcome")
async def send_welcome(request: Request, payload: WelcomeRequest):
    """Called after successful Supabase signup. Sends email + creates Sendbird user."""
    # 1. Send welcome email via SendGrid
    send_welcome_email(payload.to_email, payload.pseudonym)
    
    # 2. Create/upsert Sendbird user
    try:
        upsert_user(payload.user_id, payload.pseudonym)
    except Exception as e:
        logger.error(f"Failed to upsert Sendbird user {payload.user_id}: {e}")
        
    logger.info(f"User signed up: {payload.user_id} ({payload.to_email})")
    return {"status": "success"}

@app.get("/api/upload/sign")
@limiter.limit("10/minute")
async def get_upload_signature(request: Request):
    """Rate-limited endpoint for secure Cloudinary image uploads."""
    return generate_upload_signature(folder="pulses")

@app.post("/api/chat/create-user")
@limiter.limit("10/minute")
async def create_chat_user(request: Request, user_id: str, pseudonym: str):
    """Rate-limited manual creation of Sendbird user."""
    result = upsert_user(user_id, pseudonym)
    return result

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/pulses", response_model=List[Pulse])
async def list_pulses():
    # Only return non-deleted pulses
    response = supabase.table("pulses").select("*").is_("deleted_at", "null").order("created_at", desc=True).execute()
    # Map Supabase columns to Pulse model field names if different
    pulses = []
    for row in response.data:
        pulses.append(Pulse(
            id=row["id"],
            user_id=row.get("author_id", "anonymous"),
            content=row["content"],
            category=row.get("category", "Global"),
            building_tag=row.get("building_tag", "Campus"),
            created_at=row["created_at"],
            likes=row.get("likes_count", 0),
            comments_count=row.get("comments_count", 0)
        ))
    return pulses

@app.post("/api/pulses", response_model=Pulse)
async def create_pulse(request: CreatePulseRequest, db: Client = Depends(get_user_client)):
    try:
        new_pulse = {
            "author_id": request.user_id,
            "content": request.content,
            "category": request.category,
            "building_tag": request.building_tag
        }
        response = db.table("pulses").insert(new_pulse).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create pulse")
        
        row = response.data[0]
        pulse_id = row["id"]
        
        # 2. Fetch author pseudonym for Algolia indexing
        author_pseudonym = "Anonymous"
        try:
            prof_res = db.table("profiles").select("pseudonym").eq("id", request.user_id).single().execute()
            if prof_res.data:
                author_pseudonym = prof_res.data.get("pseudonym", "Anonymous")
        except Exception:
            pass

        # 3. Index to Algolia
        index_pulse(
            pulse_id=pulse_id,
            content=request.content,
            category=request.category,
            building_tag=request.building_tag,
            author_pseudonym=author_pseudonym,
            created_at=row["created_at"]
        )
        
        return Pulse(
            id=pulse_id,
            user_id=row.get("author_id", "anonymous"),
            content=row["content"],
            category=row.get("category", "Global"),
            building_tag=row.get("building_tag", "Campus"),
            created_at=row["created_at"],
            likes=0,
            comments_count=0
        )
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        raise HTTPException(status_code=500, detail=str(error_msg))
    logger.info(f"Pulse created: {pulse_id} by {request.user_id}")
    
    return Pulse(
        id=row["id"],
        user_id=row.get("author_id", "anonymous"),
        content=row["content"],
        category=row.get("category", "Global"),
        building_tag=row.get("building_tag", "Campus"),
        created_at=row["created_at"],
        likes=0,
        comments_count=0
    )

@app.post("/api/pulses/{pulse_id}/like")
async def like_pulse(pulse_id: str, request: LikeRequest, db: Client = Depends(get_user_client)):
    # In a real app, you'd check if the user already liked it in a join table
    # For now, we'll just increment the count in the pulse table
    pulse_data = db.table("pulses").select("likes_count").eq("id", pulse_id).single().execute()
    if not pulse_data.data:
        raise HTTPException(status_code=404, detail="Pulse not found")
    
    new_likes = pulse_data.data["likes_count"] + 1
    update_res = db.table("pulses").update({"likes_count": new_likes}).eq("id", pulse_id).execute()
    
    return {"status": "success", "likes": new_likes}

@app.delete("/api/pulses/{pulse_id}")
async def delete_pulse(pulse_id: str, user_id: str, db: Client = Depends(get_user_client)):
    """Soft delete a pulse"""
    # 1. Update DB with deleted_at
    now_iso = datetime.utcnow().isoformat()
    response = db.table("pulses").update({"deleted_at": now_iso}).eq("id", pulse_id).eq("author_id", user_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=403, detail="Not authorized or pulse not found")
        
    # 2. Soft delete in Algolia
    soft_delete_pulse(pulse_id)
    
    logger.info(f"Pulse soft-deleted: {pulse_id} by {user_id}")
    return {"status": "success"}

@app.get("/api/pulses/{pulse_id}/comments", response_model=List[Comment])
async def get_comments(pulse_id: str):
    response = supabase.table("comments").select("*").eq("pulse_id", pulse_id).order("created_at").execute()
    return [Comment(
        id=c["id"],
        pulse_id=c["pulse_id"],
        user_id=c.get("author_id", "anonymous"),
        content=c["content"],
        created_at=c["created_at"]
    ) for c in response.data]

@app.post("/api/pulses/{pulse_id}/comment")
async def add_comment(pulse_id: str, request: CommentRequest, db: Client = Depends(get_user_client)):
    new_comment = {
        "pulse_id": pulse_id,
        "author_id": request.user_id,
        "content": request.content
    }
    response = db.table("comments").insert(new_comment).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to add comment")
    
    # Update comment count
    pulse_data = db.table("pulses").select("comments_count").eq("id", pulse_id).single().execute()
    if pulse_data.data:
        new_count = pulse_data.data["comments_count"] + 1
        db.table("pulses").update({"comments_count": new_count}).eq("id", pulse_id).execute()
        
    comment = response.data[0]
    return Comment(
        id=comment["id"],
        pulse_id=pulse_id,
        user_id=comment["author_id"],
        content=comment["content"],
        created_at=comment["created_at"]
    )

@app.post("/api/pulses/translate")
async def translate_pulse(request: TranslationRequest):
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://github.com/UsmanovMahmudkhan/SejongPulse",
                "X-Title": "Sejong Pulse",
            },
            model="google/gemini-2.0-flash-001",
            messages=[
                {"role": "system", "content": f"You are a translation agent for Sejong University. Translate the following student post to {request.target_lang}. Keep emojis and informal student tone. Provide ONLY the translation."},
                {"role": "user", "content": request.content},
            ],
        )
        return {"translated_content": completion.choices[0].message.content}
    except Exception as e:
        return {"translated_content": f"[AI Error: {str(e)}] {request.content}"}

@app.get("/api/recommendations/{user_id}", response_model=List[Profile])
async def get_recommendations(user_id: str):
    # Fetch all profiles except the current user for discovery
    response = supabase.table("profiles").select("*").neq("id", user_id).limit(10).execute()
    
    recs = []
    for p in response.data:
        recs.append(Profile(
            id=p["id"],
            pseudonym=p["pseudonym"],
            major=p["major"],
            year=p.get("year", 2026),
            gpa=float(p.get("gpa", 4.0)),
            skills=p.get("skills", []),
            current_building=p.get("current_building", "Main")
        ))
    return recs

import json

KNOWLEDGE_INDEX_PATH = os.path.join(os.path.dirname(__file__), "knowledge_index.json")

def load_knowledge():
    if os.path.exists(KNOWLEDGE_INDEX_PATH):
        with open(KNOWLEDGE_INDEX_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"courses": [], "professors": []}

knowledge_base = load_knowledge()

def search_knowledge(query: str, limit: int = 5):
    query = query.lower()
    relevant_courses = []
    
    # Simple keyword search in courses
    for course in knowledge_base.get("courses", []):
        if (query in course["course_name"].lower() or 
            query in course["course_code"].lower() or 
            query in course["professor"].lower()):
            relevant_courses.append(course)
        if len(relevant_courses) >= limit:
            break
            
    return relevant_courses

@app.post("/api/advisor/query")
async def advisor_query(request: AdvisorRequest):
    query = request.query
    user_id = request.user_id
    history = request.history
    
    relevant_data = search_knowledge(query)
    
    # Fetch User Profile Context
    user_context = ""
    if user_id:
        try:
            profile_res = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
            if profile_res.data:
                p = profile_res.data
                user_context = f"Student Profile: Major in {p['major']}, Building: {p['current_building']}."
        except Exception:
            pass

    context = ""
    if relevant_data:
        context = "Relevant Sejong University 2026 Spring schedule facts:\n"
        for item in relevant_data:
            context += f"- {item['course_name']} ({item['course_code']}) taught by {item['professor']}. {item['syllabus_summary']}\n"
    
    system_prompt = (
        f"You are the official Sejong University AI Academic Advisor. {user_context} "
        "Your role is to strictly provide academic information (courses, professors, graduation requirements). "
        "Be extremely direct, factual, and concise. Do NOT ask clarifying questions to get more inputs; just answer the user's question directly. "
        "If a user asks 'who teaches X', just give the professor's name instantly based on the context. "
        "If the context doesn't cover the query, use your general knowledge about Sejong University."
    )
    
    if context:
        user_message = f"Search Context:\n{context}\n\nUser Question: {query}"
    else:
        user_message = query
        
    messages = [{"role": "system", "content": system_prompt}]
    
    # Append history
    for msg in history[-10:]:  # Keep last 10 messages for memory
        # Make sure role is either 'user' or 'assistant'
        role = 'assistant' if msg.role == 'advisor' else 'user'
        messages.append({"role": role, "content": msg.content})
        
    messages.append({"role": "user", "content": user_message})

    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://github.com/UsmanovMahmudkhan/SejongPulse",
                "X-Title": "Sejong Pulse",
            },
            model="google/gemini-2.0-flash-001",
            messages=messages,
        )
        return {"answer": completion.choices[0].message.content}
    except Exception as e:
        return {"answer": f"I encountered an error processing your query: {str(e)}"}

@app.get("/api/profiles/{user_id}", response_model=Profile)
async def get_profile(user_id: str):
    response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    p = response.data
    return Profile(
        id=p["id"],
        pseudonym=p["pseudonym"],
        major=p["major"],
        year=p.get("year", 2026),
        gpa=float(p.get("gpa", 4.0)),
        skills=p.get("skills", []),
        current_building=p.get("current_building", "Main"),
        avatar_url=p.get("avatar_url")
    )

@app.put("/api/profiles/{user_id}", response_model=Profile)
async def update_profile(user_id: str, profile_data: dict, db: Client = Depends(get_user_client)):
    # Extract only editable fields
    editable_fields = ["pseudonym", "major", "current_building", "avatar_url"]
    updates = {}
    
    for key in editable_fields:
        if key in profile_data:
            updates[key] = profile_data[key]
            
    if not updates:
        raise HTTPException(status_code=400, detail="No editable fields provided")
        
    try:
        # Update supabase
        res = db.table("profiles").update(updates).eq("id", user_id).execute()
        
        if not res.data:
            raise HTTPException(status_code=404, detail="Profile not found or update failed")
            
        # Try syncing to sendbird, ignore if it fails
        try:
            upsert_user(
                user_id=user_id,
                nickname=updates.get("pseudonym", res.data[0].get("pseudonym", "Student")),
                profile_url=updates.get("avatar_url", "")
            )
        except Exception as e:
            logger.error(f"Failed to sync profile update to Sendbird: {e}")
            
        row = res.data[0]
        return Profile(
            id=row["id"],
            pseudonym=row["pseudonym"],
            major=row.get("major", ""),
            year=row.get("year", 1),
            gpa=row.get("gpa", 0.0),
            skills=row.get("skills", []),
            current_building=row.get("current_building", ""),
            avatar_url=row.get("avatar_url", "")
        )
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        raise HTTPException(status_code=500, detail=str(error_msg))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
