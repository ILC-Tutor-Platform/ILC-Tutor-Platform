from .user_route.py import require_role, verify_token, get_authorization_token
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database.config import get_db
from models import Session, StatusDetail
from constants.logger import logger
from pydantic import BaseModel
from constants.supabase_client import supabase

router = APIRouter()
 
