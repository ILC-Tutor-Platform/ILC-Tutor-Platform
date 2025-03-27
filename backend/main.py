from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from supabase_client import supabase

app = FastAPI()

# Dependency to get a session
def get_db():
    db = SessionLocal()
    try:
        yield db  # Provide session to request
    finally:
        db.close()  # Ensure session is closed after request

with Session(engine) as session:
    print(session)

@app.get("/")
def get_details(db: Session = Depends(get_db)):
    response = supabase.table("user_detail").select("*").execute()
    return response.data
