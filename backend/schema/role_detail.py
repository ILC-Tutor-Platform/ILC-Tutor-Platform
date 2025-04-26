from pydantic import BaseModel
from typing import List

class RoleDetailSchema(BaseModel):
    role_name: List[str]

    class Config:
        from_attributes = True