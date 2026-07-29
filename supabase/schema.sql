-- =====================================================================
-- Premier League Survivor Pool - Supabase schema
-- Run this in the Supabase SQL editor against a fresh project.
-- =====================================================================

-- Extensions
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- profiles: 1:1 with auth.users
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamptz not null default now()
);

-- Auto-create profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- teams: the 20 Premier League sides
-- ---------------------------------------------------------------------
create table if not exists public.teams (
  id serial primary key,
  name text unique not null,
  short_name text unique not null
);

insert into public.teams (name, short_name) values
  ('Arsenal','ARS'), ('Aston Villa','AVL'), ('Bournemouth','BOU'),
  ('Brentford','BRE'), ('Brighton','BHA'), ('Chelsea','CHE'),
  ('Crystal Palace','CRY'), ('Everton','EVE'), ('Fulham','FUL'),
  ('Ipswich','IPS'), ('Leicester','LEI'), ('Liverpool','LIV'),
  ('Manchester City','MCI'), ('Manchester United','MUN'),
  ('Newcastle','NEW'), ('Nottingham Forest','NFO'),
  ('Southampton','SOU'), ('Tottenham','TOT'),
  ('West Ham','WHU'), ('Wolves','WOL')
on conflict do nothing;

-- ---------------------------------------------------------------------
-- fixtures: scheduled matches with optional final scores
-- ---------------------------------------------------------------------
create table if not exists public.fixtures (
  id uuid primary key default gen_random_uuid(),
  gameweek int not null check (gameweek between 1 and 38),
  home_team_id int not null references public.teams(id),
  away_team_id int not null references public.teams(id),
  kickoff timestamptz,
  home_score int,
  away_score int,
  status text not null default 'scheduled' check (status in ('scheduled','live','finished')),
  created_at timestamptz not null default now(),
  check (home_team_id <> away_team_id)
);

create index if not exists fixtures_gw_idx on public.fixtures(gameweek);

-- ---------------------------------------------------------------------
-- leagues: one survivor pool
-- ---------------------------------------------------------------------
create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  current_gameweek int not null default 1,
  status text not null default 'active' check (status in ('active','completed')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- league_members
-- ---------------------------------------------------------------------
create table if not exists public.league_members (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'alive' check (status in ('alive','eliminated')),
  eliminated_gameweek int,
  joined_at timestamptz not null default now(),
  unique (league_id, user_id)
);

create index if not exists league_members_league_idx on public.league_members(league_id);

-- ---------------------------------------------------------------------
-- picks: a user's chosen team for one gameweek in one league
-- ---------------------------------------------------------------------
create table if not exists public.picks (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  gameweek int not null,
  team_id int not null references public.teams(id),
  result text check (result in ('win','draw','loss','pending')) default 'pending',
  created_at timestamptz not null default now(),
  -- one pick per user per gameweek per league
  unique (league_id, user_id, gameweek),
  -- can't pick the same team twice in one league
  unique (league_id, user_id, team_id)
);

create index if not exists picks_league_gw_idx on public.picks(league_id, gameweek);

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles        enable row level security;
alter table public.leagues         enable row level security;
alter table public.league_members  enable row level security;
alter table public.picks           enable row level security;
alter table public.teams           enable row level security;
alter table public.fixtures        enable row level security;

-- Anyone signed in can read teams & fixtures
create policy "teams readable" on public.teams
  for select using (auth.role() = 'authenticated');

create policy "fixtures readable" on public.fixtures
  for select using (auth.role() = 'authenticated');

-- profiles: read all (so you can see opponents' names), update own
create policy "profiles readable" on public.profiles
  for select using (auth.role() = 'authenticated');
create policy "profiles update self" on public.profiles
  for update using (auth.uid() = id);

-- leagues: members can read their leagues; anyone authed can create
create policy "leagues readable to members" on public.leagues
  for select using (
    exists (
      select 1 from public.league_members lm
      where lm.league_id = leagues.id and lm.user_id = auth.uid()
    )
    or owner_id = auth.uid()
  );
create policy "leagues insert" on public.leagues
  for insert with check (owner_id = auth.uid());
create policy "leagues owner can update" on public.leagues
  for update using (owner_id = auth.uid());

-- league_members: visible to fellow members; users insert themselves
create policy "members readable to co-members" on public.league_members
  for select using (
    exists (
      select 1 from public.league_members lm
      where lm.league_id = league_members.league_id and lm.user_id = auth.uid()
    )
  );
create policy "members can join" on public.league_members
  for insert with check (user_id = auth.uid());
create policy "members can leave" on public.league_members
  for delete using (user_id = auth.uid());

-- picks: a user can see picks for leagues they belong to (only AFTER deadline ideally;
-- for the MVP we keep it simple: members can read each other's picks once made).
create policy "picks readable to co-members" on public.picks
  for select using (
    exists (
      select 1 from public.league_members lm
      where lm.league_id = picks.league_id and lm.user_id = auth.uid()
    )
  );
create policy "picks insert own" on public.picks
  for insert with check (user_id = auth.uid());
create policy "picks update own (before scoring)" on public.picks
  for update using (user_id = auth.uid() and result = 'pending');
