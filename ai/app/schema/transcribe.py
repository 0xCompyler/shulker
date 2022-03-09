from lib2to3.pytree import Base
from pydantic import BaseModel


class TranscribeBody(BaseModel):
    youtube_url: str
