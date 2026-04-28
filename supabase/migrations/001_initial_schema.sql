-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text,
  avatar_url  text,
  plan        text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── workspaces ───────────────────────────────────────────────────────────────
create table if not exists public.workspaces (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  slug        text not null unique,
  settings    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

alter table public.workspaces enable row level security;

drop policy if exists "Owners can manage workspace" on public.workspaces;
create policy "Owners can manage workspace"
  on public.workspaces for all
  using (auth.uid() = owner_id);

-- ─── workspace_members ────────────────────────────────────────────────────────
create table if not exists public.workspace_members (
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  role          text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at    timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

alter table public.workspace_members enable row level security;

drop policy if exists "Members can view workspace membership" on public.workspace_members;
create policy "Members can view workspace membership"
  on public.workspace_members for select
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.workspaces
      where id = workspace_members.workspace_id and owner_id = auth.uid()
    )
  );

-- Now that workspace_members exists, add the member-visibility policy on workspaces
drop policy if exists "Workspace members can view workspace" on public.workspaces;
create policy "Workspace members can view workspace"
  on public.workspaces for select
  using (
    auth.uid() = owner_id or
    exists (
      select 1 from public.workspace_members
      where workspace_id = workspaces.id and user_id = auth.uid()
    )
  );

-- ─── integrations ─────────────────────────────────────────────────────────────
create table if not exists public.integrations (
  id                      uuid primary key default uuid_generate_v4(),
  workspace_id            uuid not null references public.workspaces(id) on delete cascade,
  provider                text not null,
  credentials_encrypted   text not null,
  status                  text not null default 'active' check (status in ('active', 'error', 'disconnected')),
  created_at              timestamptz not null default now()
);

alter table public.integrations enable row level security;

drop policy if exists "Workspace members can view integrations" on public.integrations;
create policy "Workspace members can view integrations"
  on public.integrations for select
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = integrations.workspace_id and user_id = auth.uid()
    ) or
    exists (
      select 1 from public.workspaces
      where id = integrations.workspace_id and owner_id = auth.uid()
    )
  );

-- ─── documents ────────────────────────────────────────────────────────────────
create table if not exists public.documents (
  id            uuid primary key default uuid_generate_v4(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  created_by    uuid not null references public.profiles(id),
  module_type   text not null check (module_type in ('roadmap', 'spec-writer', 'metrics', 'research', 'sprint-planner', 'stakeholder-updates')),
  title         text not null,
  content       jsonb not null default '{}',
  metadata      jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.documents enable row level security;

drop policy if exists "Workspace members can view documents" on public.documents;
create policy "Workspace members can view documents"
  on public.documents for select
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = documents.workspace_id and user_id = auth.uid()
    ) or
    exists (
      select 1 from public.workspaces
      where id = documents.workspace_id and owner_id = auth.uid()
    )
  );

drop policy if exists "Workspace members can create documents" on public.documents;
create policy "Workspace members can create documents"
  on public.documents for insert
  with check (
    auth.uid() = created_by and (
      exists (
        select 1 from public.workspace_members
        where workspace_id = documents.workspace_id and user_id = auth.uid()
      ) or
      exists (
        select 1 from public.workspaces
        where id = documents.workspace_id and owner_id = auth.uid()
      )
    )
  );

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists documents_updated_at on public.documents;
create trigger documents_updated_at
  before update on public.documents
  for each row execute procedure public.set_updated_at();

-- ─── agent_runs ───────────────────────────────────────────────────────────────
create table if not exists public.agent_runs (
  id            uuid primary key default uuid_generate_v4(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  module        text not null check (module in ('roadmap', 'spec-writer', 'metrics', 'research', 'sprint-planner', 'stakeholder-updates')),
  status        text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  input         jsonb not null default '{}',
  output        jsonb,
  token_usage   integer,
  created_at    timestamptz not null default now()
);

alter table public.agent_runs enable row level security;

drop policy if exists "Workspace members can view agent runs" on public.agent_runs;
create policy "Workspace members can view agent runs"
  on public.agent_runs for select
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = agent_runs.workspace_id and user_id = auth.uid()
    ) or
    exists (
      select 1 from public.workspaces
      where id = agent_runs.workspace_id and owner_id = auth.uid()
    )
  );
