from pydantic import BaseModel

class RoleDetailSchema(BaseModel):
    role_name: str

    class Config:
        from_attributes = True