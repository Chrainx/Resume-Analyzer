from fastapi import FastAPI, UploadFile, File
import fitz  # PyMuPDF
import spacy
from section_extractor import extract_sections
from skills import SKILL_LIST

app = FastAPI()

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")


def extract_skills(text: str):
    doc = nlp(text.lower())
    found = set()

    # Single-word matching
    for token in doc:
        if token.text in SKILL_LIST:
            found.add(token.text)

    # Multi-word matching
    for skill in SKILL_LIST:
        if skill in text.lower():
            found.add(skill)

    return list(found)


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    content = await file.read()

    # Extract text from PDF
    text = ""
    with fitz.open(stream=content, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()

    # Detect sections
    sections = extract_sections(text)

    # Detect skills
    skills = extract_skills(text)

    return {
        "filename": file.filename,
        "sections": sections,
        "skills_detected": skills,
        "text_preview": text[:500]
    }
