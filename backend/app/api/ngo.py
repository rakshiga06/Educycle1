from fastapi import APIRouter, Depends
from app.api.deps import ngo_only
from app.services.ngo_service import create_bulk_request, list_ngo_requests

router = APIRouter()


@router.get("/bulk-request")
async def list_bulk_requests(ngo=Depends(ngo_only)):
    """List all bulk requests for the NGO"""
    requests = await list_ngo_requests(ngo["uid"])
    return requests


@router.post("/bulk-request")
async def bulk(payload: dict, ngo=Depends(ngo_only)):
    req_id = await create_bulk_request(ngo["uid"], payload)
    return {"request_id": req_id}
