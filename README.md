# Lightyear Stellar Solutions — Full-Stack Web App

> Construction management platform built with React + FastAPI + Supabase

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Chakra UI v2, Framer Motion |
| Backend | FastAPI (Python), APScheduler |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| AI | Groq (free tier) — `llama-3.1-8b-instant` |
| Hosting | Render (free tier) |

---

## Features

- **Public site** — Home, Who We Are, Experience, Services, Project Studies, Contact
- **Consultation Drawer** — 3-step form reachable from every CTA button
- **Stella AI** — Floating chat widget powered by Groq (free)
- **Auth** — Supabase email/password with role selection (homeowner / engineer / admin)
- **Client Dashboard** — Project tracking, progress bars, daily updates, payment status
- **Admin Dashboard** — Full project + consultation management, revenue summary
- **Calculators** — Concrete, blocks, paint, roofing (₦ cost estimates)
- **Daily Reports** — Automated daily project update at 08:00 WAT via APScheduler

---

## Project Structure

```
lightyear-stellar/
├── src/                        ← Frontend (React + TypeScript)
│   ├── components/             ← Navbar, Footer, HeroSection, ConsultationDrawer, AIChatWidget, …
│   ├── pages/                  ← Home, Login, Dashboard, AdminDashboard, Calculators, …
│   ├── context/AuthContext.tsx ← Global auth state
│   ├── lib/supabase.ts         ← Supabase client + apiCall helper
│   └── theme/index.ts          ← Chakra UI theme (colors, fonts, variants)
│
├── backend/                    ← FastAPI (Python)
│   ├── main.py                 ← App entry point + scheduler
│   ├── models.py               ← Pydantic schemas
│   ├── config.py               ← Settings from .env
│   ├── supabase_client.py      ← Supabase service-role client
│   ├── auth_middleware.py      ← JWT auth + role guards
│   ├── requirements.txt
│   ├── .env.example
│   └── routers/
│       ├── consultations.py
│       ├── projects.py
│       ├── ai_chat.py
│       ├── calculators.py
│       └── users.py
│
├── supabase/
│   └── schema.sql              ← Full DB schema + RLS policies
│
├── render.yaml                 ← One-file Render deployment
├── .gitignore
└── README.md
```

---

## Local Development Setup

### Prerequisites
- Node.js v18+
- Python 3.11+
- A free [Supabase](https://supabase.com) account
- A free [Groq](https://console.groq.com) API key

---

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste + run the contents of `supabase/schema.sql`
3. Copy your keys from **Project Settings → API**:
   - `Project URL` → `SUPABASE_URL`
   - `anon / public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY` *(keep this secret)*

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env from example
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY, GROQ_API_KEY

# Run dev server
uvicorn main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
# From project root
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL=http://localhost:8000

npm install
npm run dev
```

Site available at: `http://localhost:5173`

---

### 4. Create Your Admin Account

1. Register at `http://localhost:5173/login` as any role
2. Go to Supabase **Table Editor → profiles**
3. Find your row and set `role` to `admin`
4. Log out and log back in — you'll now see the Admin Dashboard

---

## Deployment on Render (Free)

### One-click deploy
The `render.yaml` at the root configures both services automatically.

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New → Blueprint**
3. Connect your GitHub repo — Render reads `render.yaml` automatically
4. Set the environment variables in the Render dashboard for each service:

**Backend service (`lightyear-api`):**
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...
GROQ_API_KEY=gsk_...
FRONTEND_URL=https://lightyear.onrender.com
```

**Frontend service (`lightyear`):**
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://lightyear-api.onrender.com
```

> **Note on free tier:** Render free services spin down after 15 minutes of inactivity.
> The first request after idle takes ~30s. Upgrade to Starter ($7/mo) for always-on.

---

## Environment Variables Reference

### Frontend (`.env`)
| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_API_URL` | FastAPI backend URL |

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service_role key (never expose) |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `GROQ_API_KEY` | Groq API key (free at console.groq.com) |
| `FRONTEND_URL` | Your deployed frontend URL (for CORS) |

---

## API Reference

Full interactive docs at `/docs` (Swagger UI) when backend is running.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/consultations/` | None | Submit consultation form |
| GET | `/consultations/` | Admin | List all consultations |
| GET | `/projects/` | User | List projects (filtered by role) |
| POST | `/projects/` | Engineer/Admin | Create project |
| PATCH | `/projects/{id}` | Engineer/Admin | Update project |
| GET | `/projects/{id}/updates` | User | Get project updates |
| POST | `/ai/chat` | None | Chat with Stella AI |
| POST | `/calculators/concrete` | None | Concrete calculator |
| POST | `/calculators/blocks` | None | Block calculator |
| POST | `/calculators/paint` | None | Paint calculator |
| POST | `/calculators/roof` | None | Roof calculator |
| GET | `/users/me` | User | Get own profile |

---

## License

Private — Lightyear Stellar Solutions Ltd. © 2024–present
