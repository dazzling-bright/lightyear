from fastapi import APIRouter, HTTPException, Depends
from supabase_client import get_supabase
from models import ChatRequest
from config import get_settings
from auth_middleware import get_current_user
import httpx

router = APIRouter(prefix="/ai", tags=["AI Chat"])

SYSTEM_PROMPT = """You are Stella, an expert AI assistant for Lightyear Stellar Solutions — a premier Nigerian engineering and construction firm with 18+ years of experience.

Your role:
- Answer questions about construction, engineering, architecture, and building regulations in Nigeria
- Help clients understand construction processes, materials, costs, and timelines
- Explain technical concepts in simple, accessible language
- Provide guidance on building codes, permits, and best practices in Nigeria
- Help users understand our services: Feasibility Studies, Design & Engineering, Project Management, Construction Services, Advisory & Consulting
- Discuss waterproofing, foundations, structural integrity, MEP systems, and other construction topics
- Provide rough cost estimates based on Nigerian market rates when asked

Tone: Professional, warm, knowledgeable. Always encourage users to consult with our engineers for specific project needs.

Important: For specific quotes, permits, or official advice — always recommend booking a consultation with our team.
Do not discuss topics unrelated to construction, engineering, or our services."""

@router.post("/chat")
async def chat(body: ChatRequest):
    """AI chat — works for both guests and logged-in users."""
    settings = get_settings()
    
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += [{"role": m.role, "content": m.content} for m in body.messages[-20:]]  # last 20 messages

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.groq_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": messages,
                    "max_tokens": 800,
                    "temperature": 0.7,
                },
            )
            response.raise_for_status()
            result = response.json()
            reply = result["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {e.response.status_code}")
    except Exception as e:
        raise HTTPException(status_code=502, detail="AI service temporarily unavailable")

    # Persist chat to DB if user is logged in and session provided
    if body.user_id and body.session_id:
        sb = get_supabase()
        # Save user message
        last_user_msg = next((m for m in reversed(body.messages) if m.role == "user"), None)
        if last_user_msg:
            sb.table("ai_chat_messages").insert({
                "session_id": body.session_id,
                "role": "user",
                "content": last_user_msg.content,
            }).execute()
        # Save assistant reply
        sb.table("ai_chat_messages").insert({
            "session_id": body.session_id,
            "role": "assistant",
            "content": reply,
        }).execute()

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
