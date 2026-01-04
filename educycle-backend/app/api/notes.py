from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
import json
from app.api.deps import student_only
from app.services.note_service import upload_note, list_notes, delete_note
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
async def list_all(subject: str = None, class_level: str = None, owner_uid: str = None):
    filters = {}
    if subject:
        filters["subject"] = subject
    if class_level:
        filters["class_level"] = class_level
    if owner_uid:
        filters["owner_uid"] = owner_uid
    return await list_notes(filters)



@router.delete("/{note_id}")
async def delete(note_id: str, user=Depends(student_only)):
    # In a real app, verify ownership here:
    # note = await get_note(note_id)
    # if note.owner_uid != user['uid']: raise HTTPException(403)
    await delete_note(note_id)
    return {"status": "deleted"}

@router.get("/me")
async def list_my_notes(user=Depends(student_only)):
    return await list_notes({"owner_uid": user["uid"]})


@router.delete("/{note_id}")
async def delete(note_id: str, user=Depends(student_only)):
    success = await delete_note(note_id, user["uid"])
    if not success:
        raise HTTPException(status_code=404, detail="Note not found or unauthorized")
    return {"status": "success"}

