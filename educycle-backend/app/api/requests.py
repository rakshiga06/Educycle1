from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.services.request_service import (
    create_request,
    update_request_status,
    get_request,
    list_user_requests,
)
from app.services.chat_service import create_chat

router = APIRouter()


@router.get("/")
async def list_requests(user=Depends(get_current_user)):
    """Get all requests for the current user"""
    requests = await list_user_requests(user["uid"])
    return requests


@router.get("/{request_id}")
async def get_request_detail(request_id: str, user=Depends(get_current_user)):
    """Get a specific request"""
    req = await get_request(request_id)
    if not req:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Request not found")
    return req


@router.post("/")
async def request_book(payload: dict, user=Depends(get_current_user)):
    req_id = await create_request(
        payload["book_id"],
        user["uid"],
        payload["donor_uid"],
        payload.get("pickup_location", ""),
        payload.get("reason", ""),
        payload.get("quantity", 1),
    )
    return {"request_id": req_id}


@router.post("/{request_id}/approve")
async def approve(request_id: str, user=Depends(get_current_user)):
    await update_request_status(request_id, "approved")
    req = await get_request(request_id)
    # Fetch book info to get the title
    # Fetch book info to get the title
    from app.services.book_service import get_book, mark_book_unavailable
    book = await get_book(req["book_id"])
    book_title = book.get("title", "Book Chat") if book else "Book Chat"

    # Mark book unavailable immediately
    await mark_book_unavailable(req["book_id"])

    await create_chat(request_id, [
        req["requester_uid"],
        req["donor_uid"],
    ], book_title=book_title)

    return {"status": "approved"}


@router.patch("/{request_id}/status")
async def update_status(request_id: str, payload: dict, user=Depends(get_current_user)):
    status = payload.get("status")
    await update_request_status(request_id, status)
    return {"status": status}


@router.post("/{request_id}/complete")
async def complete(request_id: str):
    await update_request_status(request_id, "completed")
    req = await get_request(request_id)
    if req:
        from app.services.book_service import mark_book_unavailable, get_book
        from app.services.credits_service import add_edu_credits
        
        await mark_book_unavailable(req["book_id"])
        
        # Award credits to donor
        book = await get_book(req["book_id"])
        is_set = book.get("is_set", False) if book else False
        points = 200 if is_set else 50
        reason = f"Successfully donated {'a book set' if is_set else 'a book'}: {book.get('title', 'Unknown') if book else 'Unknown'}"
        
        await add_edu_credits(req["donor_uid"], points, reason)
        
    return {"status": "completed"}
