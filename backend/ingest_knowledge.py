import csv
import json
import os
from typing import List

# This script will eventually use Gemini/OpenAI embeddings and Supabase Vector
# For now, it creates a local JSON search index for the AcademicBot

KNOWLEDGE_DIR = "knowledge"
INDEX_FILE = "knowledge_index.json"

def ingest_csv(filename: str):
    path = os.path.join(KNOWLEDGE_DIR, filename)
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return []
    
    with open(path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def build_index():
    print("🚀 Starting knowledge ingestion...")
    courses = ingest_csv("courses.csv")
    professors = ingest_csv("professors.csv")
    
    index = {
        "courses": courses,
        "professors": professors
    }
    
    with open(INDEX_FILE, "w", encoding='utf-8') as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Ingestion complete! {len(courses)} courses and {len(professors)} professors indexed.")

if __name__ == "__main__":
    if not os.path.exists(KNOWLEDGE_DIR):
        os.makedirs(KNOWLEDGE_DIR)
    build_index()
