from app.db.firestore import db, get_user_by_uid


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

    # Bulk requests fulfilled count
    bulk_docs = db.collection("ngo_requests").where("ngo_uid", "==", uid).stream()
    bulk_fulfilled = sum(doc.to_dict().get("fulfilled", 0) for doc in bulk_docs)

    # EduCredits from profile
    profile = await get_user_by_uid(uid)
    edu_credits = profile.get("edu_credits", 0) if profile else 0
    role = profile.get("role", "student") if profile else "student"

    # Total books circulated depend on role
    # For NGOs, it's bulk collections + individual requests completed by them
    # For students, it's books they donated
    if role == "ngo":
        total_books_circulated = bulk_fulfilled + books_received
    else:
        total_books_circulated = books_shared + books_received

    total_reused = total_books_circulated
    
    # Impact calculations
    paper_saved = total_reused * 0.8  # kg estimate per book
    money_saved = total_reused * 450  # average INR per book saved for community
    trees_protected = round(paper_saved / 15.0, 2) # 1 tree ~ 15kg paper
    co2_saved = round(paper_saved * 2.1, 1) # kg CO2 per kg paper

    # Unique students helped (approximated for NGOs)
    students_helped = total_reused if role == "ngo" else books_shared

    return {
        "books_shared": books_shared,
        "books_received": books_received,
        "bulk_fulfilled": bulk_fulfilled,
        "total_reused": total_reused,
        "edu_credits": edu_credits,
        "money_saved_inr": money_saved,
        "paper_saved_kg": paper_saved,
        "trees_protected": trees_protected,
        "co2_saved_kg": co2_saved,
        "students_helped": students_helped
    }
