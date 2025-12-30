from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "EduCycle"

    FIREBASE_PROJECT_ID: str
    FIREBASE_STORAGE_BUCKET: str
    FIREBASE_SERVICE_ACCOUNT: str  # path to serviceAccountKey.json

    class Config:
        env_file = ".env"


settings = Settings()
