import os
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()

class Settings:
    supabase_url:         str = os.environ["SUPABASE_URL"]
    supabase_service_key: str = os.environ["SUPABASE_SERVICE_KEY"]
    supabase_anon_key:    str = os.environ["SUPABASE_ANON_KEY"]
    groq_api_key:         str = os.environ["GROQ_API_KEY"]

    # Optional — email via Resend (free: resend.com)
    resend_api_key: str = os.getenv("RESEND_API_KEY", "")

    app_name:     str = os.getenv("APP_NAME",     "Lightyear Stellar Solutions API")
    frontend_url: str = os.getenv("FRONTEND_URL", "https://lightyear.onrender.com")
    environment:  str = os.getenv("ENVIRONMENT",  "production")

@lru_cache()
def get_settings() -> Settings:
    return Settings()
