from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int

class Entity(BaseModel):
    entity_type: str = Field(..., description="The type of entity (e.g., 'URL', 'Email', 'Date', 'Price')")
    value: str = Field(..., description="The extracted value")
    bounding_box: Optional[BoundingBox] = None

class AnalysisResponse(BaseModel):
    category: str = Field(..., description="The primary category of the screenshot (e.g., 'receipt', 'error', 'document')")
    confidence: float = Field(..., description="Confidence score from 0.0 to 1.0")
    summary: str = Field(..., description="A concise summary of what the screenshot contains")
    entities: List[Entity] = Field(default_factory=list, description="Extracted entities")
    analysis: Dict[str, Any] = Field(default_factory=dict, description="Detailed category-specific analysis (e.g., error causes, receipt items)")
    actions: List[str] = Field(default_factory=list, description="List of context-aware actions suggested for the user (e.g., 'explain', 'suggest_fix', 'copy')")
    extracted_text: str = Field(..., description="The full OCR text extracted from the screenshot")

class AnswerResponse(BaseModel):
    answer: str = Field(..., description="The answer to the user's question, grounded strictly in the screenshot")
    supporting_entities: List[str] = Field(default_factory=list, description="Any entities referenced in the answer")
