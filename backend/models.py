from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID

# ─── Auth ───────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "homeowner"   # homeowner | engineer | admin
    phone: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ─── Consultations ──────────────────────────────────────────
class ConsultationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    service_type: Optional[str] = None
    project_type: Optional[str] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    location: Optional[str] = None
    message: str
    user_id: Optional[str] = None

class ConsultationStatusUpdate(BaseModel):
    status: str
    admin_notes: Optional[str] = None

# ─── Projects ───────────────────────────────────────────────
class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: str = "residential"
    location: Optional[str] = None
    budget: Optional[float] = None
    start_date: Optional[date] = None
    estimated_end_date: Optional[date] = None
    client_id: str

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    progress_percent: Optional[int] = None
    assigned_engineer_id: Optional[str] = None
    notes: Optional[str] = None
    budget: Optional[float] = None
    amount_paid: Optional[float] = None

class ProjectUpdateCreate(BaseModel):
    project_id: str
    author_id: str
    title: str
    content: str
    update_type: str = "general"

# ─── Payments ───────────────────────────────────────────────
class PaymentCreate(BaseModel):
    project_id: str
    amount: float
    description: Optional[str] = None
    due_date: Optional[date] = None
    status: str = "pending"

# ─── AI Chat ────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str   # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    session_id: Optional[str] = None
    user_id: Optional[str] = None

# ─── Calculators ────────────────────────────────────────────
class ConcreteCalcRequest(BaseModel):
    length_m: float
    width_m: float
    depth_m: float
    mix_ratio: str = "1:2:4"   # cement:sand:aggregate

class BlockCalcRequest(BaseModel):
    wall_length_m: float
    wall_height_m: float
    block_size: str = "9inch"   # 6inch | 9inch
    num_openings: int = 0
    opening_width_m: float = 0.9
    opening_height_m: float = 2.1

class PaintCalcRequest(BaseModel):
    area_sqm: float
    coats: int = 2
    coverage_per_litre: float = 10.0   # sqm per litre

class RoofCalcRequest(BaseModel):
    length_m: float
    width_m: float
    roof_pitch_degrees: float = 25.0
    sheet_width_m: float = 0.86
    sheet_length_m: float = 3.0
