# Lightyear Engineering Solutions — Full-Stack Platform

---

## Overview

Lightyear Engineering is a comprehensive construction and engineering management
web application that unifies design, construction, and consultancy services under one
smart platform. Built on core values of **integrity, honesty, dependability,
compliance, and safety**.

---

## Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, Chakra UI v2, Framer Motion |
| Routing  | React Router v6 (createBrowserRouter)                   |
| Backend  | FastAPI (Python 3.11+), APScheduler                     |
| Database | Supabase (PostgreSQL + Auth + RLS)                      |
| AI       | Groq                                                    |
| Email    | Resend                                                  |
| Hosting  | Render                                                  |

---

## Features

### Public Site

- Marketing pages: Home, Who We Are, Experience, Services, Project Studies, Contact
- Dark / Light mode toggle (Chakra UI `useColorMode`)
- Stella AI floating chat widget (Groq-powered, construction-focused)
- Consultation drawer — 3-step form with email confirmation + admin notification
- Contact links: WhatsApp (+234 703 208 2725), LinkedIn, Phone

### Authentication

- Supabase email/password auth
- Role selection on registration: Homeowner · Engineer · Admin
- Protected routes with role-based dashboard routing

### Client Dashboard

- Project tracking with progress bars and payment status
- Daily automated project updates (08:00 WAT via APScheduler)
- Unread update badges
- Quick links to calculators and resources

### Admin Dashboard

- Full project and consultation management
- Revenue summary and client count
- Consultation status workflow (pending → reviewed → contacted → converted)

### Construction Calculators (General)

- Concrete mix design (cement bags, sand, aggregate)
- Block / sandcrete wall estimation
- Paint quantity
- Roofing sheets
- Floor tiles

### Engineer Calculations (Structural)

- RC Beam design (EC2/BS8110 — moment, reinforcement, lever arm)
- RC Column design (axial, slenderness, minimum steel)
- Rebar / Bar Bending Schedule weight calculator
- Pad foundation sizing (bearing capacity)
- Wind load estimation (EC1-1-4)

### Certificates

- Printable internship/programme completion certificate (PDF via browser print)
- Customisable: name, programme, period, supervisor, certificate ID

### Education & Outreach

- Internship applications for civil/structural engineering students
- University partnership target: ABUAD, Nile University, University of Ibadan

---

## Project Structure

```
lightyear-fullstack/
├── src/                              Frontend (React + TypeScript)
│   ├── components/
│   │   ├── Navbar.tsx                Auth-aware, dark/light adaptive
│   │   ├── Footer.tsx                Dynamic year, social links
│   │   ├── ColorModeToggle.tsx       Sun/Moon icon toggle
│   │   ├── ConsultationDrawer.tsx    3-step form + email + WhatsApp/LinkedIn
│   │   ├── AIChatWidget.tsx          Stella AI floating chat
│   │   ├── Certificate.tsx           Printable PDF certificate
│   │   ├── HeroSection.tsx
│   │   ├── FoundationSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── CtaSection.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── WhoWeAre.tsx
│   │   ├── Experience.tsx
│   │   ├── Services.tsx
│   │   ├── ProjectStudies.tsx
│   │   ├── Contact.tsx
│   │   ├── Login.tsx                 Role selector → register/login
│   │   ├── Dashboard.tsx             Client view
│   │   ├── AdminDashboard.tsx        Admin/engineer view
│   │   ├── Calculators.tsx           General construction calcs
│   │   └── EngineerCalculations.tsx  Structural engineering calcs
│   ├── context/AuthContext.tsx       Global auth state
│   ├── lib/supabase.ts               Supabase client + apiCall helper
│   ├── theme/index.ts                Chakra theme + semantic tokens
│   └── vite-env.d.ts
│
├── backend/
│   ├── main.py                       App entry + CORS + scheduler
│   ├── config.py                     Settings from .env
│   ├── models.py                     Pydantic schemas
│   ├── supabase_client.py
│   ├── auth_middleware.py
│   ├── requirements.txt
│   ├── Procfile
│   ├── runtime.txt                   python-3.11.9
│   └── routers/
│       ├── consultations.py
│       ├── projects.py
│       ├── ai_chat.py                Fixed Groq integration
│       ├── calculators.py
│       ├── email.py                  Resend HTML email templates
│       └── users.py
│
├── supabase/schema.sql               Idempotent DB schema + RLS
├── render.yaml                       One-click Render deploy
├── .gitignore
└── README.md
```

---

## Environment Variables

### Frontend (`.env`)

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...          # service_role key — keep secret
SUPABASE_ANON_KEY=eyJ...
GROQ_API_KEY=gsk_...                  # free at console.groq.com
RESEND_API_KEY=re_...                 # free at resend.com (3000 emails/month)
FRONTEND_URL=http://localhost:5173
ENVIRONMENT=development
```

---

## Local Setup

### 1 — Supabase

1. Create project at supabase.com
2. SQL Editor → run `supabase/schema.sql`
3. Copy Project URL, anon key, service_role key

### 2 — Groq (free AI)

Sign up at console.groq.com → create API key

### 3 — Resend (free email)

Sign up at resend.com → create API key → verify a sending domain

### 4 — Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in all values
uvicorn main:app --reload --port 8000
# Docs: http://localhost:8000/docs
```

### 5 — Frontend

```bash
# project root
cp .env.example .env            # fill in values
npm install
npm run dev
# Site: http://localhost:5173
```

### 6 — Make yourself admin

```sql
-- Run in Supabase SQL Editor AFTER registering:
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Render Deployment

1. Push to GitHub
2. render.com → New → Blueprint → connect repo
3. Set env vars for both services (lightyear + lightyear-api)
4. URLs: https://lightyear.onrender.com · https://lightyear-api.onrender.com

**Free tier note:** Services sleep after 15 min idle. First request ~30s cold start.

---

## API Reference

| Method | Endpoint                | Auth      | Description                |
| ------ | ----------------------- | --------- | -------------------------- |
| POST   | /consultations/         | None      | Submit consultation        |
| GET    | /consultations/         | Admin     | List all consultations     |
| PATCH  | /consultations/{id}     | Admin     | Update consultation status |
| GET    | /projects/              | User      | List projects (by role)    |
| POST   | /projects/              | Eng/Admin | Create project             |
| PATCH  | /projects/{id}          | Eng/Admin | Update project             |
| GET    | /projects/{id}/updates  | User      | Get project updates        |
| POST   | /projects/{id}/updates  | User      | Add project update         |
| GET    | /projects/admin/summary | Admin     | Dashboard summary stats    |
| POST   | /ai/chat                | None      | Chat with Stella AI        |
| POST   | /calculators/concrete   | None      | Concrete calculator        |
| POST   | /calculators/blocks     | None      | Block wall calculator      |
| POST   | /calculators/paint      | None      | Paint calculator           |
| POST   | /calculators/roof       | None      | Roofing calculator         |
| POST   | /calculators/tiles      | None      | Tiles calculator           |
| POST   | /email/contact          | None      | Send contact email         |
| POST   | /email/consultation     | None      | Send consultation email    |
| GET    | /users/me               | User      | Get own profile            |
| PATCH  | /users/me               | User      | Update own profile         |
| PATCH  | /users/{id}/role        | Admin     | Change user role           |

---

## Contact

**Lightyear Stellar Solutions Ltd**  
179A, Maccido Royal Estate, Galadimawa, Abuja  
📞 +234 703 208 2725  
📧 info@lightyear.ng  
🔗 linkedin.com/company/lightyear-consult  
💬 wa.me/2347032082725

© 2026 Lightyear Stellar Solutions Ltd. All rights reserved.
