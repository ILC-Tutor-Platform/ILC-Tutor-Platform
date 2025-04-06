#   Description: This file contains the schema for the UserDetail model used 
#   for data serialization and validation for CRUD operations. 
from . import BaseModel
from . import date
from typing import Optional

class UserDetailSchema(BaseModel):
    name: Optional[str] = None
    email: str
    role: Optional[str] = None
    datejoined: date

    class Config:
        from_attributes = True  
