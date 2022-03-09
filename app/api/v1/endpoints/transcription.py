from fastapi import APIRouter

from app.core.azure_utils import speech_utils
from app.schema.transcribe import TranscribeBody

router = APIRouter()


@router.post("/word_level")
def _transcribe_video(request_body: TranscribeBody):
    url = request_body.youtube_url
    try:
        speech_utils.download_audio(url)
    except Exception as e:
        return {"Error": f"Download error {e}"}

    transcription = speech_utils.transcribe()
    return transcription
