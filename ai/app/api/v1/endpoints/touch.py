from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def touch():
    return {"status": "ok"}
