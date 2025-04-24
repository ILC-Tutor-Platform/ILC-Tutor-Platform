from fastapi import FastAPI
from models import *
from router import auth_login, auth_signup, user_router

app = FastAPI()

app.include_router(auth_login)
app.include_router(auth_signup)
app.include_router(user_router)

print("🚀 Initializing backend... ")