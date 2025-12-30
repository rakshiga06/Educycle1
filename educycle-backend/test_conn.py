
import asyncio
from app.core.firebase import get_firestore, get_storage_bucket
from datetime import datetime

async def test_firebase():
    print("Testing Firestore...")
    try:
        db = get_firestore()
        ref = db.collection("test_connection").document("status")
        ref.set({"connected": True, "at": datetime.utcnow()})
        doc = ref.get()
        if doc.exists:
            print(f"Firestore OK: {doc.to_dict()}")
        else:
            print("Firestore failed: document not found after set")
    except Exception as e:
        print(f"Firestore Error: {e}")

    print("\nTesting Storage...")
    try:
        bucket = get_storage_bucket()
        blob = bucket.blob("test_connection.txt")
        blob.upload_from_string("OK", content_type="text/plain")
        print(f"Storage OK: {blob.public_url}")
    except Exception as e:
        print(f"Storage Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_firebase())
