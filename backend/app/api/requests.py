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
    )
    return {"request_id": req_id}


@router.post("/{request_id}/approve")
async def approve(request_id: str, user=Depends(get_current_user)):
    await update_request_status(request_id, "approved")
    req = await get_request(request_id)

    await create_chat(request_id, [
        req["requester_uid"],
        req["donor_uid"],
    ])

    return {"status": "approved"}


@router.post("/{request_id}/complete")
async def complete(request_id: str):
    await update_request_status(request_id, "completed")
    return {"status": "completed"}
