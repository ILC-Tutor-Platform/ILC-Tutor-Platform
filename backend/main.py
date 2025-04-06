# This file initializes the FastAPI App
from fastapi import FastAPI
from router import user, auth

app = FastAPI()
app.include_router(user)
app.include_router(auth)
