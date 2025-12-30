from app.db.firestore import db


async def calculate_user_impact(uid: str):
    donated = db.collection("books").where("donor_uid", "==", uid).stream()
    reused = len(list(donated))

    students_helped = reused
    paper_saved = reused * 1.5  # kg estimate
    money_saved = reused * 300  # INR estimate

    return {
        "books_reused": reused,
        "students_helped": students_helped,
        "paper_saved_kg": paper_saved,
        "money_saved_inr": money_saved,
    }
