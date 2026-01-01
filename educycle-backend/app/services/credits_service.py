from app.db.firestore import db
from datetime import datetime
from google.cloud.firestore_v1.base_query import FieldFilter

async def add_edu_credits(uid: str, amount: int, reason: str):
    """Add EduCredits to a user and log the transaction"""
    user_ref = db.collection("users").document(uid)
    doc = user_ref.get()
    
    if not doc.exists:
        return False
        
    current_credits = doc.to_dict().get("edu_credits", 0)
    new_credits = current_credits + amount
    
    user_ref.update({
        "edu_credits": new_credits,
        "last_credit_update": datetime.utcnow()
    })
    
    # Log transaction
    db.collection("credit_transactions").add({
        "user_uid": uid,
        "amount": amount,
        "reason": reason,
        "timestamp": datetime.utcnow()
    })
    
    return True

async def get_leaderboard(limit: int = 10):
    """Get top users by EduCredits"""
    # Only get students for the leaderboard
    docs = db.collection("users")\
             .where(filter=FieldFilter("role", "==", "student"))\
             .order_by("edu_credits", direction="DESCENDING")\
             .limit(limit)\
             .stream()
    
    leaderboard = []
    for doc in docs:
        data = doc.to_dict()
        leaderboard.append({
            "uid": doc.id,
            "name": data.get("display_name") or data.get("email", "Anonymous"),
            "edu_credits": data.get("edu_credits", 0),
            "area": data.get("area", ""),
            "city": data.get("city", "")
        })
        
    return leaderboard
