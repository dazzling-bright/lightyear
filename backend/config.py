from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_service_key: str          # service_role key (never exposed to frontend)
    supabase_anon_key: str             # anon key (safe to expose)

    # Groq AI (free tier: groq.com)
    groq_api_key: str

    # App
    app_name: str = "Lightyear Stellar Solutions API"
    frontend_url: str = "https://lightyear.onrender.com"
    environment: str = "production"

    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    return Settings()
