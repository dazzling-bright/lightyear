-- ============================================================
-- LIGHTYEAR STELLAR SOLUTIONS — SUPABASE SCHEMA

-- ============================================================

-- ── 1. PROFILES ─────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  email       text unique,
  phone       text,
  role        text check (role in ('homeowner', 'engineer', 'admin')) default 'homeowner',
  avatar_url  text,
  company     text,
  location    text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'homeowner')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. PROJECTS ─────────────────────────────────────────────
create table if not exists public.projects (
  id                    uuid primary key default gen_random_uuid(),
  client_id             uuid references public.profiles(id) on delete cascade not null,
  assigned_engineer_id  uuid references public.profiles(id),
  title                 text not null,
  description           text,
  type                  text check (type in ('residential','commercial','industrial','infrastructure','renovation')) default 'residential',
  status                text check (status in ('pending','planning','in_progress','on_hold','review','completed','cancelled')) default 'pending',
  location              text,
  budget                numeric(15,2),
  amount_paid           numeric(15,2) default 0,
  progress_percent      int default 0 check (progress_percent between 0 and 100),
  start_date            date,
  estimated_end_date    date,
  actual_end_date       date,
  notes                 text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ── 3. PROJECT UPDATES ──────────────────────────────────────
create table if not exists public.project_updates (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid references public.projects(id) on delete cascade not null,
  author_id    uuid references public.profiles(id),
  title        text not null,
  content      text not null,
  update_type  text check (update_type in ('daily_report','milestone','issue','payment','material','general')) default 'general',
  is_read      boolean default false,
  created_at   timestamptz default now()
);

-- ── 4. CONSULTATIONS ────────────────────────────────────────
create table if not exists public.consultations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id),
  full_name     text not null,
  email         text not null,
  phone         text,
  service_type  text,
  project_type  text,
  budget_range  text,
  timeline      text,
  location      text,
  message       text not null,
  status        text check (status in ('pending','reviewed','contacted','converted','closed')) default 'pending',
  admin_notes   text,
  created_at    timestamptz default now()
);

-- ── 5. PAYMENTS ─────────────────────────────────────────────
create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid references public.projects(id) on delete cascade not null,
  amount       numeric(15,2) not null,
  description  text,
  status       text check (status in ('pending','paid','overdue','cancelled')) default 'pending',
  due_date     date,
  paid_date    date,
  receipt_url  text,
  created_at   timestamptz default now()
);

-- ── 6. AI CHAT ──────────────────────────────────────────────
create table if not exists public.ai_chat_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete cascade,
  session_name  text default 'New Chat',
  created_at    timestamptz default now()
);

create table if not exists public.ai_chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid references public.ai_chat_sessions(id) on delete cascade not null,
  role        text check (role in ('user','assistant')) not null,
  content     text not null,
  created_at  timestamptz default now()
);

-- ── 7. ENABLE RLS ───────────────────────────────────────────
alter table public.profiles         enable row level security;
alter table public.projects         enable row level security;
alter table public.project_updates  enable row level security;
alter table public.consultations    enable row level security;
alter table public.payments         enable row level security;
alter table public.ai_chat_sessions enable row level security;
alter table public.ai_chat_messages enable row level security;

-- ── 8. POLICIES (drop first so re-runs never fail) ───────────

-- profiles
drop policy if exists "profiles_own"   on public.profiles;
drop policy if exists "profiles_admin" on public.profiles;

create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id);

create policy "profiles_admin" on public.profiles
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- projects
drop policy if exists "projects_client"        on public.projects;
drop policy if exists "projects_engineer"      on public.projects;
drop policy if exists "projects_admin"         on public.projects;
drop policy if exists "projects_client_insert" on public.projects;

create policy "projects_client" on public.projects
  for select using (client_id = auth.uid());

create policy "projects_engineer" on public.projects
  for select using (assigned_engineer_id = auth.uid());

create policy "projects_admin" on public.projects
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','engineer'))
  );

create policy "projects_client_insert" on public.projects
  for insert with check (client_id = auth.uid());

-- project_updates
drop policy if exists "updates_read"  on public.project_updates;
drop policy if exists "updates_write" on public.project_updates;

create policy "updates_read" on public.project_updates
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (p.client_id = auth.uid() or p.assigned_engineer_id = auth.uid())
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "updates_write" on public.project_updates
  for insert with check (
    author_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','engineer'))
  );

-- consultations
drop policy if exists "consultations_anon"  on public.consultations;
drop policy if exists "consultations_own"   on public.consultations;
drop policy if exists "consultations_admin" on public.consultations;

create policy "consultations_anon" on public.consultations
  for insert with check (true);

create policy "consultations_own" on public.consultations
  for select using (user_id = auth.uid());

create policy "consultations_admin" on public.consultations
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- payments
drop policy if exists "payments_read"  on public.payments;
drop policy if exists "payments_admin" on public.payments;

create policy "payments_read" on public.payments
  for select using (
    exists (select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid())
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','engineer'))
  );

create policy "payments_admin" on public.payments
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','engineer'))
  );

-- ai_chat_sessions
drop policy if exists "chat_sessions_own" on public.ai_chat_sessions;

create policy "chat_sessions_own" on public.ai_chat_sessions
  for all using (user_id = auth.uid());

-- ai_chat_messages
drop policy if exists "chat_messages_own" on public.ai_chat_messages;

create policy "chat_messages_own" on public.ai_chat_messages
  for all using (
    exists (
      select 1 from public.ai_chat_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

-- ── 9. MAKE YOURSELF ADMIN ──────────────────────────────────

update public.profiles set role = 'admin' where email = 'brightudoette@gmail.com';