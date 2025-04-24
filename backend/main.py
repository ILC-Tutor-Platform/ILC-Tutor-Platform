# This file initializes the FastAPI App
from fastapi import FastAPI
from router.auth import router as auth
from models import *
from router.user_route import router as user_router

app = FastAPI()
app.include_router(user_router)
app.include_router(auth)

print("🚀 Initializing backend... ")