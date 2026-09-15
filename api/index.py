from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from api.services.ai_service import analyze_image_with_gemini, answer_question_with_gemini
import os

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Screenshot Intelligence API is running"}

@app.post("/api/analyze")
async def analyze_screenshot(image: UploadFile = File(...)):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")
    
    try:
        content = await image.read()
        analysis = await analyze_image_with_gemini(content, image.content_type)
        return analysis.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ask")
async def ask_question(
    image: UploadFile = File(...),
    question: str = Form(...),
    previous_analysis: str = Form(...)
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")
        
    try:
        content = await image.read()
        answer = await answer_question_with_gemini(content, image.content_type, question, previous_analysis)
        return answer.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
