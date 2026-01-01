from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, books, requests, chats, notes, ngo, feedback, impact, notifications, credits

app = FastAPI(
    title="EduCycle Backend",
    version="1.0.0",
    description="Backend APIs for EduCycle platform"
)

# CORS (frontend will call this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

# Create static dir if not exists
os.makedirs("app/static/uploads", exist_ok=True)

# Health check
@app.get("/health")
async def health():
    return {"status": "ok"}

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# API routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(books.router, prefix="/books", tags=["Books"])
app.include_router(requests.router, prefix="/requests", tags=["Requests"])
app.include_router(chats.router, prefix="/chats", tags=["Chats"])
app.include_router(notes.router, prefix="/notes", tags=["Notes"])
app.include_router(ngo.router, prefix="/ngo", tags=["NGO"])
app.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])
app.include_router(impact.router, prefix="/impact", tags=["Impact"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(credits.router, prefix="/credits", tags=["Credits"])
