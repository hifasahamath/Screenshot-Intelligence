import os
from google import genai
from google.genai import types
from pydantic import BaseModel
from api.schemas.analysis import AnalysisResponse, AnswerResponse

# Assuming GEMINI_API_KEY is in the environment
client = genai.Client()
MODEL_ID = "gemini-3.6-flash"

async def analyze_image_with_gemini(image_bytes: bytes, mime_type: str) -> AnalysisResponse:
    prompt = """
    You are Screenshot Intelligence, an expert AI designed to turn screenshots into actionable information.
    Analyze the uploaded screenshot carefully.
    
    1. Determine the category (e.g., error, receipt, document, code, event, product, conversation, website, chart, form, general).
    2. Provide a confidence score.
    3. Summarize the content.
    4. Extract any useful entities (Text, URLs, Emails, Prices, Dates, etc.).
    5. Provide a detailed analysis based on the category (e.g., if it's an error, what's the cause?).
    6. Suggest a list of actionable steps the user could take based on the extracted info (e.g., "explain", "copy", "open_url").
    7. Extract all visible text exactly as it appears.
    
    Output strictly as JSON matching the schema.
    """
    
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            prompt
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AnalysisResponse,
            temperature=0.2,
        ),
    )
    
    return response.parsed

async def answer_question_with_gemini(image_bytes: bytes, mime_type: str, question: str, previous_analysis: str) -> AnswerResponse:
    prompt = f"""
    Answer the user's question based STRICTLY on the provided screenshot. Do not invent information.
    If you cannot determine the answer from the screenshot, say "I can't determine that from this screenshot."
    
    Previous Analysis Context:
    {previous_analysis}
    
    User Question:
    {question}
    """
    
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            prompt
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AnswerResponse,
            temperature=0.2,
        ),
    )
    
    return response.parsed
