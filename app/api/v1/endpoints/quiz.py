from fastapi import APIRouter

from app.schema.quiz import Quiz
from app.core.quiz import QG


router = APIRouter()


@router.post("/generate")
def _generate_quiz(request_body: Quiz):
    questions = QG(request_body.content)
    return questions
