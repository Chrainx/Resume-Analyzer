from fastapi import FastAPI, UploadFile, File
import fitz
from semantic_sections import semantic_section_detection
from matching import compute_match, extract_resume_skills

app = FastAPI()


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    content = await file.read()

    text = ""
    with fitz.open(stream=content, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()

    semantic_sections = semantic_section_detection(text)
    skills = extract_resume_skills(text)

    return {
        "filename": file.filename,
        "semantic_sections": semantic_sections,
        "skills_detected": skills,
        "text_preview": text[:400]
    }


@app.post("/match-job")
async def match_resume(file: UploadFile = File(...), job_description: str = ""):
    content = await file.read()

    text = ""
    with fitz.open(stream=content, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()

    score = compute_match(text, job_description)

    return {
        "match_score": score,
        "job_description": job_description,
    }
