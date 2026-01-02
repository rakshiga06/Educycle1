from fastapi import APIRouter, Depends
from app.services.auth_service import bootstrap_user
from app.core.security import verify_firebase_token
from app.db.firestore import get_user_by_uid
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class BootstrapRequest(BaseModel):
    role: str = "student"
    metadata: Optional[dict] = None

class SendOtpRequest(BaseModel):
    email: str

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

class RegisterOtpRequest(BaseModel):
    email: str
    otp: str
    password: str
    role: str = "student"
    metadata: Optional[dict] = None

class LoginOtpRequest(BaseModel):
    email: str
    otp: str


@router.post("/bootstrap")
async def bootstrap(
    request: BootstrapRequest,
    token=Depends(verify_firebase_token),
):
    extra = {}
    if request.metadata:
        # Extract metadata fields
        if request.metadata.get("organization_name"):
            extra["organization_name"] = request.metadata.get("organization_name")
        if request.metadata.get("fullName"):
            extra["display_name"] = request.metadata.get("fullName")
        if request.metadata.get("city"):
            extra["city"] = request.metadata.get("city")
        if request.metadata.get("area"):
            extra["area"] = request.metadata.get("area")
    
    # Use display_name from metadata if provided, else use from token
    final_display_name = extra.get("display_name") or token.get("name")
    
    await bootstrap_user(
        uid=token["uid"],
        email=token["email"],
        role=request.role,
        display_name=final_display_name,
        extra=extra if extra else None,
    )
    return {"status": "ok"}

@router.post("/otp/send")
async def send_otp(request: SendOtpRequest):
    from app.services.email_service import send_otp_email
    await send_otp_email(request.email)
    return {"status": "ok", "message": "OTP sent"}

@router.post("/otp/register")
async def register_with_otp(request: RegisterOtpRequest):
    from app.services.email_service import verify_otp, delete_otp
    from firebase_admin import auth as firebase_auth
    
    # Don't delete immediately so if registration fails (e.g. weak password), OTP stays valid
    success, message = await verify_otp(request.email, request.otp, delete_on_success=False)
    if not success:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=message)
    
    # Create user in Firebase
    try:
        user_record = firebase_auth.create_user(
            email=request.email,
            password=request.password
        )
        uid = user_record.uid
        
        # Bootstrap
        extra = request.metadata or {}
        await bootstrap_user(
            uid=uid,
            email=request.email,
            role=request.role,
            display_name=extra.get("fullName") or extra.get("organization_name"),
            extra=extra
        )
        
        # SUCCESS! Delete OTP now
        await delete_otp(request.email)
        
        # Create custom token
        custom_token = firebase_auth.create_custom_token(uid)
        # Handle bytes vs str
        if isinstance(custom_token, bytes):
            custom_token = custom_token.decode("utf-8")
        
        return {"status": "ok", "uid": uid, "custom_token": custom_token}
        
    except Exception as e:
        # If user already exists, maybe they tried to register instead of login?
        error_msg = str(e)
        if "EMAIL_EXISTS" in error_msg:
            error_msg = "An account with this email already exists. Please sign in instead."
            
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=error_msg)

class LoginPasswordRequest(BaseModel):
    email: str
    password: str

@router.post("/otp/login")
async def login_with_otp(request: LoginOtpRequest):
    from app.services.email_service import verify_otp, delete_otp
    from firebase_admin import auth as firebase_auth
    
    # Verify but don't delete yet
    success, message = await verify_otp(request.email, request.otp, delete_on_success=False)
    if not success:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=message)
    
    try:
        user = firebase_auth.get_user_by_email(request.email)
        
        # SUCCESS! Delete OTP
        await delete_otp(request.email)
        
        custom_token = firebase_auth.create_custom_token(user.uid)
        if isinstance(custom_token, bytes):
            custom_token = custom_token.decode("utf-8")
            
        return {"status": "ok", "custom_token": custom_token}
    except Exception as e:
        from fastapi import HTTPException
        if "no user record found" in str(e).lower():
            raise HTTPException(status_code=404, detail="No account found with this email. Please create an account first.")
        raise HTTPException(status_code=404, detail="User not found")

@router.post("/login")
async def login_with_password(request: LoginPasswordRequest):
    """Login with email and password for returning users - Optimized"""
    from firebase_admin import auth as firebase_auth
    from fastapi import HTTPException
    import httpx
    import time
    from app.core.config import settings
    
    start_time = time.time()
    
    # Get Firebase API key from settings
    FIREBASE_API_KEY = settings.FIREBASE_API_KEY
    
    if not FIREBASE_API_KEY:
        print("CRITICAL ERROR: FIREBASE_API_KEY is not set.")
        raise HTTPException(status_code=500, detail="Server configuration error")
        
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    
    payload = {
        "email": request.email.strip().lower(),
        "password": request.password,
        "returnSecureToken": True
    }
    
    try:
        # 1. Verify credentials via REST API (Async)
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=10.0)
            
        data = response.json()
        
        if response.status_code != 200:
            error_message = data.get("error", {}).get("message", "Invalid credentials")
            print(f"Firebase Auth Error: {error_message}")
            
            if "INVALID_PASSWORD" in error_message or "INVALID_LOGIN_CREDENTIALS" in error_message:
                raise HTTPException(status_code=401, detail="Invalid email or password")
            elif "EMAIL_NOT_FOUND" in error_message:
                raise HTTPException(status_code=401, detail="No account found with this email")
            elif "USER_DISABLED" in error_message:
                raise HTTPException(status_code=403, detail="This account has been disabled")
            else:
                raise HTTPException(status_code=400, detail=f"Authentication failed: {error_message}")
        
        # 2. Extract UID directly from response (Avoids extra DB call)
        uid = data.get("localId")
        
        # 3. Create Custom Token
        custom_token = firebase_auth.create_custom_token(uid)
        
        if isinstance(custom_token, bytes):
            custom_token = custom_token.decode("utf-8")
            
        elapsed = time.time() - start_time
        print(f"DEBUG: Login completed in {elapsed:.4f}s")
            
        return {"status": "ok", "custom_token": custom_token}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error during login: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@router.get("/me")
async def get_current_user_profile(token=Depends(verify_firebase_token)):
    """Get current user profile"""
    user = await get_user_by_uid(token["uid"])
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    return user
