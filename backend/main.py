from fastapi import FastAPI, UploadFile, File
import fitz  # PyMuPDF

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Resume Analyzer Backend Running!"}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    # read the file
    content = await file.read()

    # extract text from PDF
    text = ""
    with fitz.open(stream=content, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()

    return {
        "filename": file.filename,
        "extracted_text": text[:500]  # preview output
    }
