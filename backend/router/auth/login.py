from fastapi import APIRouter, HTTPException
from supabase_client import supabase
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    uid: str

class RefreshRequest(BaseModel):
    refresh_token: str

class RefreshResponse(BaseModel):
    access_token: str
    refresh_token: str
    uid: str
    
@router.post("/auth/login/student", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email, 
            "password": credentials.password
        })

        user = auth_response.user
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials.")
        
        role = auth_response.user.user_metadata.get("role", [])
        if "0" not in role:
            raise HTTPException(status_code=403, detail="User is not a student.")

        return LoginResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            uid=auth_response.user.id
        )
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")
    
@router.post("/auth/login/tutor", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email, 
            "password": credentials.password
        })

        user = auth_response.user
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        role = auth_response.user.user_metadata.get("role", [])
        if "1" not in role:
            raise HTTPException(status_code=403, detail="User is not a tutor")

        return LoginResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            uid=auth_response.user.id
        )
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")


@router.post("/auth/login/refresh", response_model=RefreshResponse)
async def refresh_token(payload: RefreshRequest):
    try:
        response = supabase.auth.refresh_session(payload.refresh_token)
        session = response.session

        if not session:
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
        
        return RefreshResponse(
            access_token=session.access_token,
            refresh_token=session.refresh_token,
            uid=session.user.id
        )
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token refresh failed")
    