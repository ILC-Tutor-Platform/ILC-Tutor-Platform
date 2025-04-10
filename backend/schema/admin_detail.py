from pydantic import BaseModel

class AdminDetailSchema(BaseModel):
    admin_role: str

    class Config:
        from_attributes = True