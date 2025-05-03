from fastapi import FastAPI
from models import *
from router import auth_login, auth_signup, user_router
from mangum import Mangum

app = FastAPI()
handler = Mangum(app)

app.include_router(auth_login)
app.include_router(auth_signup)
app.include_router(user_router)

print("🚀 Initializing backend... ")
