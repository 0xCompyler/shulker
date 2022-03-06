from fastapi import APIRouter

from app.api.v1.endpoints import touch
from app.api.v1.endpoints import transcription

api_router = APIRouter()

api_router.include_router(touch.router, prefix="/touch")
api_router.include_router(transcription.router, prefix="/transcribe")
