from pydantic import BaseModel
from typing import List

class UserRoleDetailSchema(BaseModel):
    user_id: str
    role_id: List[int]

    class Config:
        from_attributes = True