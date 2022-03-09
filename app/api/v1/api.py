from fastapi import APIRouter

from app.api.v1.endpoints import touch
from app.api.v1.endpoints import transcription
from app.api.v1.endpoints import quiz
from app.api.v1.endpoints import comments


api_router = APIRouter()

api_router.include_router(touch.router, prefix="/touch")
api_router.include_router(transcription.router, prefix="/transcribe")
api_router.include_router(quiz.router, prefix="/quiz")
api_router.include_router(comments.router, prefix="/comments")
