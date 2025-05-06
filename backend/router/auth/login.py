from fastapi import APIRouter, HTTPException
from constants.supabase_client import supabase
from pydantic import BaseModel
from typing import List
from fastapi import Header

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
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials.")
        
        role = auth_response.user.user_metadata.get("role", [])
        name = auth_response.user.user_metadata.get("name")

        return LoginResponse(
            access_token=True,
            refresh_token=True,
            uid=auth_response.user.id,
            role=role,
            name=name
        )
    
    except HTTPException: 
        raise

    except Exception:
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
        name = auth_response.user_metadata.get("name")
        print(name)
        if "2" not in role:
            raise HTTPException(status_code=403, detail="User is not a tutor")

        return LoginResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            uid=auth_response.user.id,
            role=role,
            name=name
        )
    
    except HTTPException: 
        raise

    except Exception:
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

    except Exception:
        raise HTTPException(status_code=401, detail="Token refresh failed")
   

@router.get("/auth/me")
async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    access_token = authorization.replace("Bearer ", "")

    try:
        user_response = supabase.auth.get_user(access_token)
        user = user_response.user

        if not user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        return {
            "id": user.id,
            "email": user.email,
            "name": user.user_metadata.get("name"),
            "role": user.user_metadata.get("role"),

        }

    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed")

