from fastapi import APIRouter, HTTPException, Depends
from supabase_client import get_supabase
from models import ChatRequest
from config import get_settings
from auth_middleware import get_current_user
import httpx
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai", tags=["AI Chat"])

SYSTEM_PROMPT = """You are Stella, an expert AI assistant for Lightyear Stellar Solutions — a premier Nigerian engineering and construction firm with 18+ years of experience.

Your role:
- Answer questions about construction, engineering, architecture, and building regulations in Nigeria
- Help clients understand construction processes, materials, costs, and timelines
- Explain technical concepts in simple, accessible language
- Provide guidance on building codes, permits, and best practices in Nigeria
- Help users understand our services: Feasibility Studies, Design & Engineering, Project Management, Construction Services, Advisory & Consulting
- Discuss waterproofing, foundations, structural integrity, MEP systems, and other construction topics
- Provide rough cost estimates based on Nigerian market rates when asked (2024/2025 rates)
- Guide engineers on structural calculations, rebar design, concrete mix design, load analysis

Tone: Professional, warm, knowledgeable. Always encourage users to consult with our engineers for specific project needs.

Contact: +234 703 208 2725 | info@lightyear.ng | 179A, Maccido Royal Estate, Galadimawa, Abuja
LinkedIn: linkedin.com/company/lightyear-stellar-solutions
WhatsApp: +234 703 208 2725

Important: For specific quotes, permits, or official advice — always recommend booking a consultation."""

@router.post("/chat")
async def chat(body: ChatRequest):
    """AI chat — works for both guests and logged-in users."""
    settings = get_settings()

    if not settings.groq_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured")

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += [{"role": m.role, "content": m.content} for m in body.messages[-20:]]

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.groq_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": messages,
                    "max_tokens": 1024,
                    "temperature": 0.7,
                    "stream": False,
                },
            )
            logger.info(f"Groq response status: {response.status_code}")

            if response.status_code == 401:
                raise HTTPException(status_code=503, detail="Invalid Groq API key — check GROQ_API_KEY in .env")
            if response.status_code == 429:
                raise HTTPException(status_code=429, detail="AI rate limit reached — please try again shortly")

            response.raise_for_status()
            result = response.json()
            reply  = result["choices"][0]["message"]["content"]

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="AI service timed out — please try again")
    except httpx.HTTPStatusError as e:
        logger.error(f"Groq HTTP error: {e.response.status_code} — {e.response.text}")
        raise HTTPException(status_code=502, detail=f"AI service error: {e.response.status_code}")
    except (KeyError, IndexError) as e:
        logger.error(f"Groq response parse error: {e}")
        raise HTTPException(status_code=502, detail="Unexpected AI response format")

    # Persist to DB if user is logged in
    if body.user_id and body.session_id:
        try:
            sb = get_supabase()
            last_user = next((m for m in reversed(body.messages) if m.role == "user"), None)
            if last_user:
                sb.table("ai_chat_messages").insert({
                    "session_id": body.session_id,
                    "role": "user",
                    "content": last_user.content,
                }).execute()
            sb.table("ai_chat_messages").insert({
                "session_id": body.session_id,
                "role": "assistant",
                "content": reply,
            }).execute()
        except Exception as e:
            logger.warning(f"Failed to persist chat: {e}")  # non-fatal

    return {"reply": reply}


@router.post("/sessions")
async def create_session(user=Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("ai_chat_sessions").insert({
        "user_id": user.id,
        "session_name": "New Chat",
    }).execute()
    return result.data[0]


@router.get("/sessions")
async def get_sessions(user=Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("ai_chat_sessions").select(
        "*, ai_chat_messages(id, content, role, created_at)"
    ).eq("user_id", user.id).order("created_at", desc=True).execute()
    return result.data


@router.get("/sessions/{session_id}/messages")
async def get_messages(session_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("ai_chat_messages").select("*").eq(
        "session_id", session_id
    ).order("created_at", asc=True).execute()
    return result.data
