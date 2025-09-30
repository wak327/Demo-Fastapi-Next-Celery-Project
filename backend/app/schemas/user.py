from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserInDBBase(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class User(UserInDBBase):
    pass
