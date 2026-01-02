import asyncio
from app.db.firestore import db
from app.services.impact_service import calculate_user_impact
from firebase_admin import auth

async def main():
    email = "contact@techforall.org"
    try:
        user = auth.get_user_by_email(email)
        uid = user.uid
        print(f"Testing impact for user: {email} ({uid})")
        
        impact = await calculate_user_impact(uid)
        print("Success! Impact data:")
        print(impact)
    except Exception as e:
        print(f"Error caught: {e}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
