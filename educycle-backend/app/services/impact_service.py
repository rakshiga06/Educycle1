from app.db.firestore import db


async def calculate_user_impact(uid: str):
    # Books shared (donated)
    donated_docs = db.collection("books").where("donor_uid", "==", uid).stream()
    books_shared = len(list(donated_docs))
    
    # Books received (completed requests)
    received_docs = db.collection("requests")\
                      .where("requester_uid", "==", uid)\
                      .where("status", "==", "completed")\
                      .stream()
    books_received = len(list(received_docs))

    # EduCredits from profile
    from app.db.firestore import get_user_by_uid
    profile = await get_user_by_uid(uid)
    edu_credits = profile.get("edu_credits", 0) if profile else 0

    total_reused = books_shared + books_received
    
    # Impact calculations
    # NGO Stats: Requests received as donor
    donor_requests_docs = db.collection("requests").where("donor_uid", "==", uid).stream()
    donor_requests = list(donor_requests_docs)
    
    total_requests_received = len(donor_requests)
    pending_requests_received = sum(1 for r in donor_requests if r.to_dict().get("status") == "pending")
    completed_requests_received = sum(1 for r in donor_requests if r.to_dict().get("status") == "completed")
    
    # Impact calculations
    # For NGOs, impact is largely based on books they redistributed (completed requests received)
    # plus any books they personally donated elsewhere (books_shared)
    total_books_circulated = books_shared + completed_requests_received
    
    paper_saved = total_books_circulated * 0.8  # kg estimate per book
    money_saved = total_books_circulated * 450  # average INR per book saved for community
    trees_protected = round(paper_saved / 15.0, 2) # 1 tree ~ 15kg paper
    co2_saved = paper_saved * 2.1 # kg CO2 per kg paper

    return {
        "books_shared": books_shared,
        "books_received": books_received,
        "total_requests_received": total_requests_received,
        "pending_requests_received": pending_requests_received,
        "completed_requests_received": completed_requests_received,
        "total_reused": total_reused,
        "edu_credits": edu_credits,
        "money_saved_inr": money_saved,
        "paper_saved_kg": paper_saved,
        "trees_protected": trees_protected,
        "co2_saved_kg": co2_saved
    }
