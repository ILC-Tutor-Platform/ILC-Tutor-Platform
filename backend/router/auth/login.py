from fastapi import APIRouter, HTTPException
from constants.supabase_client import supabase
from pydantic import BaseModel
from typing import List
from constants.logger import logger

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    uid: str
    role: List[str]
    name: str

class RefreshRequest(BaseModel):
    refresh_token: str

class RefreshResponse(BaseModel):
    access_token: str
    refresh_token: str
    uid: str
    
@router.post("/auth/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email, 
            "password": credentials.password
        })
        user = auth_response.user
        print("Login response:", user)

        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials.")
        
        role_data = auth_response.user.user_metadata.get("role", [])
        role = role_data if isinstance(role_data, list) else [role_data]
        name = auth_response.user.user_metadata.get("name")

        return LoginResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            uid=auth_response.user.id,
            role=role,
            name=name
        )
    
    except HTTPException: 
        raise

    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

@router.post("/auth/login/admin", response_model=LoginResponse)
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
        if "2" not in role:
            raise HTTPException(status_code=403, detail="User is not a tutor")

        return LoginResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            uid=auth_response.user.id
        )
    
    except HTTPException:
        raise
    
    except Exception as e:
        logger.error(f"Login failed: {e}")
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
    
    except HTTPException:
        raise
    
    except Exception as e:
        logger.error(f"Refresh failed: {e}")
        raise HTTPException(status_code=401, detail="Token refresh failed")
    
