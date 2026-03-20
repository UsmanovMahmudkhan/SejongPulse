from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Sejong Pulse API", version="0.1.0")

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

# Mock Pulse Data
MOCK_PULSES = [
    {"id": "1", "user_id": "u1", "content": "Looking for a study buddy for Prof. Kim's CS101 class!", "category": "Academic", "building_tag": "Library", "created_at": "2026-03-21T00:00:00Z"},
    {"id": "2", "user_id": "u2", "content": "Best coffee at the Student Union today! ☕️", "category": "Social", "building_tag": "Student Union", "created_at": "2026-03-21T01:00:00Z"},
]

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
async def translate_pulse(content: str, target_lang: str = "ko"):
    # Mimicking Gemini 1.5 Flash translation
    # In reality: client = genai.GenerativeModel('gemini-1.5-flash')
    mock_translations = {
        "ko": f"[Translated to Korean] {content}",
        "en": f"[Translated to English] {content}"
    }
    return {"translated_content": mock_translations.get(target_lang, content)}

@app.get("/api/recommendations/{user_id}", response_model=List[Profile])
async def get_recommendations(user_id: str):
    # Mocked ranking algorithm (DNA: 1. Same Prof, 2. Complementary Skills, 3. Proximity)
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
    # Mocking RAG autonomous agent for natural language queries
    # In a real scenario, we'd query Supabase Vector Store
    responses = {
        "prerequisites": "The prerequisites for Deep Learning (CS402) include Linear Algebra and Probability & Statistics.",
        "credits": "To complete a CS minor, you need a minimum of 21 credits from the core CS curriculum.",
        "default": "I'm looking into that for you. Based on the 2026 Sejong Course Catalog, it seems most students combine that with the AI track electives."
    }
    
    response_text = responses.get("default")
    for key in responses:
        if key in query.lower():
            response_text = responses[key]
            break
            
    return {"answer": response_text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
