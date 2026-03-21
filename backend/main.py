from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI(title="Sejong Pulse API", version="0.1.0")

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

# Mock Data Stores
MOCK_PULSES = [
    {"id": "1", "user_id": "u1", "content": "Looking for a study buddy for Prof. Kim's CS101 class!", "category": "Academic", "building_tag": "Library", "created_at": "2026-03-21T00:00:00Z", "likes": 24, "comments_count": 8},
    {"id": "2", "user_id": "u2", "content": "Best coffee at the Student Union today! ☕️", "category": "Social", "building_tag": "Student Union", "created_at": "2026-03-21T01:00:00Z", "likes": 42, "comments_count": 12},
]

MOCK_COMMENTS = {
    "1": [
        {"id": "c1", "pulse_id": "1", "user_id": "u3", "content": "I'm interested! When do you want to meet?", "created_at": "2026-03-21T02:00:00Z"},
    ],
    "2": []
}

class LikeRequest(BaseModel):
    user_id: str

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
    return MOCK_PULSES

@app.post("/api/pulses/{pulse_id}/like")
async def like_pulse(pulse_id: str, request: LikeRequest):
    for pulse in MOCK_PULSES:
        if pulse["id"] == pulse_id:
            pulse["likes"] += 1
            return {"status": "success", "likes": pulse["likes"]}
    raise HTTPException(status_code=404, detail="Pulse not found")

@app.get("/api/pulses/{pulse_id}/comments", response_model=List[Comment])
async def get_comments(pulse_id: str):
    return MOCK_COMMENTS.get(pulse_id, [])

@app.post("/api/pulses/{pulse_id}/comment")
async def add_comment(pulse_id: str, request: CommentRequest):
    if pulse_id not in MOCK_COMMENTS:
        MOCK_COMMENTS[pulse_id] = []
    
    new_comment = {
        "id": f"c{len(MOCK_COMMENTS[pulse_id]) + 1}",
        "pulse_id": pulse_id,
        "user_id": request.user_id,
        "content": request.content,
        "created_at": "2026-03-22T00:00:00Z"
    }
    MOCK_COMMENTS[pulse_id].append(new_comment)
    
    for pulse in MOCK_PULSES:
        if pulse["id"] == pulse_id:
            pulse["comments_count"] += 1
            break
            
    return new_comment

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
    # Mocked ranking algorithm
    return [
        Profile(
            id="rec1",
            pseudonym="CodeMaster",
            major="AI Engineering",
            year=2025,
            gpa=4.4,
            skills=["Machine Learning", "C++"],
            current_building="Gwanggaeto"
        ),
        Profile(
            id="rec2",
            pseudonym="DesignQueen",
            major="Digital Arts",
            year=2026,
            gpa=3.9,
            skills=["UI/UX", "Figma"],
            current_building="Student Union"
        )
    ]

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
async def advisor_query(query: str):
    relevant_data = search_knowledge(query)
    
    context = ""
    if relevant_data:
        context = "Here are some relevant courses I found in the 2026 Spring schedule:\n"
        for item in relevant_data:
            context += f"- {item['course_name']} ({item['course_code']}) taught by {item['professor']}. {item['syllabus_summary']}\n"
    
    system_prompt = (
        "You are Sejong University's AI Academic Advisor. "
        "Answer queries based on the provided context if available. "
        "If the context doesn't cover the query, use your general knowledge about Sejong University. "
        "Keep it professional but accessible. "
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
    return Profile(
        id=user_id,
        pseudonym="CrimsonKnight",
        major="Computer Science",
        year=2024,
        gpa=4.2,
        skills=["Python", "Next.js", "AI"],
        current_building="Gwanggaeto"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
