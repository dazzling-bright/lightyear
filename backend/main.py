from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from config import get_settings
from supabase_client import get_supabase
from routers import consultations, projects, ai_chat, calculators, users
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── Scheduled Jobs ──────────────────────────────────────────────────────────

async def send_daily_project_updates():
    """Every day at 8 AM WAT — post an automated daily-report stub for active projects."""
    logger.info("Running daily project update job...")
    sb = get_supabase()
    active = sb.table("projects").select("id, title, progress_percent").in_(
        "status", ["in_progress", "planning"]
    ).execute()

    today = datetime.utcnow().strftime("%A, %d %B %Y")
    for project in (active.data or []):
        sb.table("project_updates").insert({
            "project_id": project["id"],
            "author_id": None,            # system-generated
            "title": f"Daily Report — {today}",
            "content": (
                f"Automated daily summary for **{project['title']}**.\n\n"
                f"Current progress: **{project['progress_percent']}%**.\n"
                "Your project manager will update detailed activities shortly. "
                "Log in to your dashboard for the latest status and to send messages."
            ),
            "update_type": "daily_report",
        }).execute()
    logger.info(f"Daily updates posted for {len(active.data or [])} projects.")

scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Schedule daily reports at 07:00 UTC (08:00 WAT)
    scheduler.add_job(
        send_daily_project_updates,
        CronTrigger(hour=7, minute=0),
        id="daily_project_updates",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Scheduler started.")
    yield
    scheduler.shutdown()
    logger.info("Scheduler stopped.")

# ─── App ─────────────────────────────────────────────────────────────────────

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Backend API for Lightyear Stellar Solutions — construction management platform.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://localhost:4173",
        "https://lightyear.onrender.com",
        "https://lightyear-solutions.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ──────────────────────────────────────────────────────────────────

app.include_router(consultations.router)
app.include_router(projects.router)
app.include_router(ai_chat.router)
app.include_router(calculators.router)
app.include_router(users.router)

@app.get("/", tags=["Health"])
async def root():
    return {
        "service": settings.app_name,
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs",
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}
