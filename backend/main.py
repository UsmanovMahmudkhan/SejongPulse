from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI(title="Sejong Pulse API", version="0.1.0")

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

class TranslationRequest(BaseModel):
    content: str
    target_lang: str = "ko"

# Endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to Sejong Pulse API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/pulses", response_model=List[Pulse])
async def list_pulses():
    response = supabase.table("pulses").select("*").order("created_at", desc=True).execute()
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
async def create_pulse(request: CreatePulseRequest):
    new_pulse = {
        "author_id": request.user_id,
        "content": request.content,
        "category": request.category,
        "building_tag": request.building_tag
    }
    response = supabase.table("pulses").insert(new_pulse).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create pulse")
    
    row = response.data[0]
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
async def like_pulse(pulse_id: str, request: LikeRequest):
    # In a real app, you'd check if the user already liked it in a join table
    # For now, we'll just increment the count in the pulse table
    pulse_data = supabase.table("pulses").select("likes_count").eq("id", pulse_id).single().execute()
    if not pulse_data.data:
        raise HTTPException(status_code=404, detail="Pulse not found")
    
    new_likes = pulse_data.data["likes_count"] + 1
    update_res = supabase.table("pulses").update({"likes_count": new_likes}).eq("id", pulse_id).execute()
    
    return {"status": "success", "likes": new_likes}

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
async def add_comment(pulse_id: str, request: CommentRequest):
    new_comment = {
        "pulse_id": pulse_id,
        "author_id": request.user_id,
        "content": request.content
    }
    response = supabase.table("comments").insert(new_comment).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to add comment")
    
    # Update comment count
    pulse_data = supabase.table("pulses").select("comments_count").eq("id", pulse_id).single().execute()
    if pulse_data.data:
        new_count = pulse_data.data["comments_count"] + 1
        supabase.table("pulses").update({"comments_count": new_count}).eq("id", pulse_id).execute()
        
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
async def advisor_query(query: str, user_id: Optional[str] = None):
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
        context = "Here are some relevant courses I found in the 2026 Spring schedule:\n"
        for item in relevant_data:
            context += f"- {item['course_name']} ({item['course_code']}) taught by {item['professor']}. {item['syllabus_summary']}\n"
    
    system_prompt = (
        f"You are Sejong University's AI Academic Advisor. {user_context} "
        "Answer queries based on the provided context if available. "
        "If the context doesn't cover the query, use your general knowledge about Sejong University. "
        "Keep it professional but accessible."
    )
    
    if context:
        user_message = f"Context:\n{context}\n\nQuestion: {query}"
    else:
        user_message = query

    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://github.com/UsmanovMahmudkhan/SejongPulse",
                "X-Title": "Sejong Pulse",
            },
            model="google/gemini-2.0-flash-001",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
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
        current_building=p.get("current_building", "Main")
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
