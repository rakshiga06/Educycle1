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
    paper_saved = total_reused * 0.8  # kg estimate per book
    money_saved = books_received * 450  # average INR per book saved for requester
    trees_protected = round(paper_saved / 15.0, 2) # 1 tree ~ 15kg paper
    co2_saved = paper_saved * 2.1 # kg CO2 per kg paper

    return {
        "books_shared": books_shared,
        "books_received": books_received,
        "total_reused": total_reused,
        "edu_credits": edu_credits,
        "money_saved_inr": money_saved,
        "paper_saved_kg": paper_saved,
        "trees_protected": trees_protected,
        "co2_saved_kg": co2_saved
    }
