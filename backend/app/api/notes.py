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
async def list_all(
    subject: str = None,
    class_level: str = None,
    type: str = None,
):
    filters = {
        "subject": subject,
        "class_level": class_level,
        "type": type,
    }
    # Remove None values
    filters = {k: v for k, v in filters.items() if v is not None}
    return await list_notes(filters)


@router.get("/{note_id}/download")
async def download_note(note_id: str):
    from app.services.note_service import get_note_by_id
    from fastapi.responses import FileResponse
    import os
    
    note = await get_note_by_id(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    file_url = note.get("file_url", "")
    if "/static/uploads/" not in file_url:
        # If it's an external URL (e.g. firebase storage proper), we might just redirect
        # But for now we assume local storage based on previous fixes
        from fastapi.responses import RedirectResponse
        return RedirectResponse(url=file_url)

    # Extract local path from URL
    # URL is http://localhost:8000/static/uploads/filename
    filename = file_url.split("/static/uploads/")[-1]
    
    # Sanitize title for filename
    title = note.get("title", "download").replace("/", "-").replace("\\", "-")
    ext = filename.split(".")[-1] if "." in filename else "pdf"
    download_filename = f"{title}.{ext}"
    
    file_path = f"app/static/uploads/{filename}"
    
    if not os.path.exists(file_path):
         raise HTTPException(status_code=404, detail="File not found on server")
         
    return FileResponse(
        path=file_path,
        filename=download_filename,
        media_type='application/octet-stream'
    )
