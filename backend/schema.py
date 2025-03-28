from pydantic import BaseModel
from datetime import date

class UserDetailSchema(BaseModel):
    name: str
    email: str
    role: str
    datejoined: date

    class Config:
        from_attributes = True  
