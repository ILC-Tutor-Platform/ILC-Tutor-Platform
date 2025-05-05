from fastapi import FastAPI
from models import *
from router import auth_login, auth_signup, user_router
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
handler = Mangum(app)

app.include_router(auth_login)
app.include_router(auth_signup)
app.include_router(user_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

print("🚀 Initializing backend... ")
