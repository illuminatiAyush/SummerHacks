from pydantic import BaseModel
from typing import Optional

class UserOnboardRequest(BaseModel):
    name: str
    email: str
    wallet_address: str
    stipend: float
    selected_goal: str

class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    wallet_address: str
    stipend: float
    selected_goal: str
    community_name: str = "SummerHacks 2026"
    created_at: str = "2026-04-17T00:00:00Z"
