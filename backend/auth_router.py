from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Dict, Any

from . import better_auth_client

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
class SoftwareBackground(BaseModel):
    experience_level: str
    programming_languages: list[str]
    ai_experience: str

class HardwareBackground(BaseModel):
    gpu_availability: str
    electronics_knowledge: str
    microcontroller_experience: list[str]

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    software_background: SoftwareBackground
    hardware_background: HardwareBackground

class User(BaseModel):
    id: str
    email: EmailStr
    metadata: Dict[str, Any]

# Endpoints
@router.post("/auth/signup", response_model=User)
def signup(user: UserCreate):
    metadata = {
        "software_background": user.software_background.dict(),
        "hardware_background": user.hardware_background.dict(),
    }
    created_user = better_auth_client.create_user(
        email=user.email,
        password=user.password,
        metadata=metadata
    )
    if not created_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not create user.")
    return created_user

@router.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    token_data = better_auth_client.login_user(
        email=form_data.username,
        password=form_data.password
    )
    if not token_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    return token_data

@router.get("/auth/me", response_model=User)
def get_current_user(token: str = Depends(oauth2_scheme)):
    user = better_auth_client.get_user(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    return user
