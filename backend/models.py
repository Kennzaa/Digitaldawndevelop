from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid


def _now():
    return datetime.now(timezone.utc)


def _uuid():
    return str(uuid.uuid4())


# ---------- Auth ----------
class UserRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    role: str = "customer"
    created_at: datetime


class AuthResponse(BaseModel):
    token: str
    user: UserPublic


# ---------- Orders ----------
class OrderCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default="", max_length=40)
    company: Optional[str] = Field(default="", max_length=120)
    services: List[str] = Field(default_factory=list)
    budget: Optional[str] = Field(default="", max_length=60)
    deadline: Optional[str] = Field(default="", max_length=60)
    message: Optional[str] = Field(default="", max_length=4000)


class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(new|in_progress|done|cancelled)$")


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uuid)
    user_id: Optional[str] = None
    name: str
    email: str
    phone: str = ""
    company: str = ""
    services: List[str] = Field(default_factory=list)
    budget: str = ""
    deadline: str = ""
    message: str = ""
    status: str = "new"
    created_at: datetime = Field(default_factory=_now)
# Guest Email Verification
class GuestVerifyRequest(BaseModel):
    email: str

class OrderItem(BaseModel):
    service_id: str
    service_name: str
    quantity: int = 1
    notes: Optional[str] = None

class GuestOrderRequest(BaseModel):
    email: str
    name: str
    phone: Optional[str] = None
    items: List[OrderItem]
    notes: Optional[str] = None
