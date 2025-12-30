from app.core.firebase import get_storage_bucket
import uuid


async def upload_file(file_bytes: bytes, path: str, content_type: str):
    try:
        bucket = get_storage_bucket()
        filename = f"{path}/{uuid.uuid4()}"
        blob = bucket.blob(filename)
    
        blob.upload_from_string(file_bytes, content_type=content_type)
        blob.make_public()
    
        return blob.public_url
    except Exception as e:
        print(f"Firebase Storage failed ({e}), falling back to local storage.")
        # Local storage fallback
        filename = f"{uuid.uuid4()}_{path.replace('/', '_')}.{content_type.split('/')[-1] if '/' in content_type else 'bin'}"
        local_path = f"app/static/uploads/{filename}"
        
        # Ensure dir exists (redundant but safe)
        import os
        os.makedirs("app/static/uploads", exist_ok=True)
        
        with open(local_path, "wb") as f:
            f.write(file_bytes)
            
        import os
        base_url = os.getenv("API_BASE_URL", "http://localhost:8000")
        return f"{base_url}/static/uploads/{filename}"
