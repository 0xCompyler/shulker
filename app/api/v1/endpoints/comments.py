from fastapi import APIRouter

from app.core.sentiment_scores import SentimentScore
from app.schema.comments import CommentsAnalysis


router = APIRouter()


@router.post("/analyze")
def _analyse_commens(request_body: CommentsAnalysis):
    sc = SentimentScore(request_body.comment_url)
    return sc.analyze()
