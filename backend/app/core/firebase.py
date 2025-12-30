import firebase_admin
from firebase_admin import credentials, firestore, storage
from app.core.config import settings

_firebase_app = None


def init_firebase():
    global _firebase_app

    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT)
        _firebase_app = firebase_admin.initialize_app(
            cred,
            {
                "projectId": settings.FIREBASE_PROJECT_ID,
                "storageBucket": settings.FIREBASE_STORAGE_BUCKET,
            },
        )
    return _firebase_app


def get_firestore():
    init_firebase()
    return firestore.client()


def get_storage_bucket():
    init_firebase()
    return storage.bucket()
