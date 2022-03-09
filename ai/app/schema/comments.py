from pydantic import BaseModel


class CommentsAnalysis(BaseModel):
    comment_url: str
