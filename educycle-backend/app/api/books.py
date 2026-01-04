from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form, Request
import json
from app.api.deps import student_only, get_current_user
from app.services.book_service import donate_book, search_books, get_book, get_my_books, delete_book
from app.db.storage import upload_file
from app.db.firestore import get_blocked_uids

router = APIRouter()


@router.get("/search")
async def search(request: Request, user=Depends(get_current_user)):
    filters = dict(request.query_params)
    blocked_uids = []
    if user:
        blocked_uids = await get_blocked_uids(user["uid"])
        
    return await search_books(
        filters, 
        exclude_uid=user["uid"] if user else None,
        blocked_uids=blocked_uids
    )


@router.get("/{book_id}")
async def get_book_detail(book_id: str):
    """Get a specific book by ID"""
    book = await get_book(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.get("/user/me")
async def list_my_books(user=Depends(student_only)):
    return await get_my_books(user["uid"])


@router.delete("/{book_id}")
async def delete(book_id: str, user=Depends(student_only)):
    success = await delete_book(book_id, user["uid"])
    if not success:
        raise HTTPException(status_code=404, detail="Book not found or unauthorized")
    return {"status": "success"}


@router.post("/donate")
async def donate(
    payload: str = Form(...),
    images: list[UploadFile] = File(...),
    user=Depends(student_only),
):
    try:
        try:
            payload_dict = json.loads(payload)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid payload JSON")
        
        urls = []
        for img in images:
            # Mock upload if in test mode (optional, but let's debug the real one first)
            try:
                url = await upload_file(
                    await img.read(),
                    "books",
                    img.content_type,
                )
                urls.append(url)
            except Exception as upload_err:
                print(f"Upload error: {str(upload_err)}")
                raise HTTPException(status_code=500, detail=f"Storage upload failed: {str(upload_err)}")

        book_id = await donate_book(user["uid"], payload_dict, urls)
        return {"book_id": book_id}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Donate error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


