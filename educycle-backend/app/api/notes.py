from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
import json
from app.api.deps import student_only
from app.services.note_service import upload_note, list_notes
from app.db.storage import upload_file

router = APIRouter()


@router.post("/")
async def upload(
    payload: str = Form(...),
    file: UploadFile = File(...),
    user=Depends(student_only),
):
    try:
        payload_dict = json.loads(payload)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid payload JSON")
    
    url = await upload_file(
        await file.read(),
        "notes",
        file.content_type,
    )
    note_id = await upload_note(user["uid"], payload_dict, url)
    return {"note_id": note_id}


@router.get("/")
async def list_all(subject: str = None, class_level: str = None):
    filters = {}
    if subject:
        filters["subject"] = subject
    if class_level:
        filters["class_level"] = class_level
    return await list_notes(filters)
