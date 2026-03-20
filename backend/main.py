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

class Pulse(BaseModel):
    id: str
    user_id: str
    content: str
    category: str
    building_tag: str
    created_at: str

# Mock Pulse Data (Fallback)
MOCK_PULSES = [
    {"id": "1", "user_id": "u1", "content": "Looking for a study buddy for Prof. Kim's CS101 class!", "category": "Academic", "building_tag": "Library", "created_at": "2026-03-21T00:00:00Z"},
    {"id": "2", "user_id": "u2", "content": "Best coffee at the Student Union today! ☕️", "category": "Social", "building_tag": "Student Union", "created_at": "2026-03-21T01:00:00Z"},
]

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

@app.post("/api/advisor/query")
async def advisor_query(query: str):
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://github.com/UsmanovMahmudkhan/SejongPulse",
                "X-Title": "Sejong Pulse",
            },
            model="google/gemini-2.0-flash-001",
            messages=[
                {"role": "system", "content": "You are Sejong University's AI Academic Advisor. Answer queries based on general academic knowledge. If you don't know the exact 2026 rule, provide a helpful general response for a Sejong University student. Keep it professional but accessible."},
                {"role": "user", "content": query},
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
