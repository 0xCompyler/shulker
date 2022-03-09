from pydantic import BaseModel


class Quiz(BaseModel):
    content: str
