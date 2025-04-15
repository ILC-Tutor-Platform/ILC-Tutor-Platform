from pydantic import BaseModel

class UserRoleDetailSchema(BaseModel):
    user_id: str
    role_id: int

    class Config:
        from_attributes = True