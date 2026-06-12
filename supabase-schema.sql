-- HACK_THE_TRADING — Supabase Schema
-- Run this in your Supabase SQL editor

-- ============================================================
-- TABLES
-- ============================================================

-- Users (extends auth.users)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  username text unique not null,
  avatrade_account_id text,
  avatrade_verified boolean default false,
  ruolo text default 'viewer' check (ruolo in ('viewer', 'trader', 'admin')),
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Rooms (chat rooms)
create table if not exists public.rooms (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  tipo text default 'chat' check (tipo in ('chat', 'vip', 'announcements')),
  created_at timestamp with time zone default now()
);

-- Insert default room
insert into public.rooms (id, nome, tipo) values
  ('00000000-0000-0000-0000-000000000001', 'Sala Operativa', 'chat')
on conflict (id) do nothing;

-- Messages
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  room_id uuid references public.rooms(id) on delete cascade not null,
  content text not null,
  moderazione_status text default 'ok' check (moderazione_status in ('ok', 'blocked')),
  created_at timestamp with time zone default now()
);

-- Signals
create table if not exists public.signals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  asset text not null,
  direzione text not null check (direzione in ('BUY', 'SELL')),
  entry_min numeric not null,
  entry_max numeric not null,
  tp1 numeric not null,
  tp2 numeric,
  tp3 numeric,
  sl numeric not null,
  timeframe text not null,
  status text default 'open' check (status in ('open', 'win', 'loss')),
  pips_result numeric,
  created_at timestamp with time zone default now(),
  closed_at timestamp with time zone
);

-- Challenges
create table if not exists public.challenges (
  id uuid default gen_random_uuid() primary key,
  tipo text default '1v1' check (tipo in ('1v1', 'group')),
  challenger_id uuid references public.users(id) on delete cascade not null,
  opponent_id uuid references public.users(id) on delete set null,
  asset text not null,
  durata_ore integer not null check (durata_ore > 0),
  stato text default 'pending' check (stato in ('pending', 'active', 'completed')),
  challenger_pips numeric default 0,
  opponent_pips numeric default 0,
  winner_id uuid references public.users(id) on delete set null,
  inizio timestamp with time zone,
  fine timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Leaderboard
create table if not exists public.leaderboard (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  sfide_totali integer default 0,
  vittorie integer default 0,
  sconfitte integer default 0,
  win_rate numeric default 0,
  pips_totali numeric default 0,
  streak_attuale integer default 0,
  rank integer,
  periodo text default 'alltime' check (periodo in ('weekly', 'monthly', 'alltime')),
  updated_at timestamp with time zone default now(),
  unique(user_id, periodo)
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_messages_room_id on public.messages(room_id);
create index if not exists idx_messages_created_at on public.messages(created_at desc);
create index if not exists idx_signals_user_id on public.signals(user_id);
create index if not exists idx_challenges_challenger on public.challenges(challenger_id);
create index if not exists idx_challenges_opponent on public.challenges(opponent_id);
create index if not exists idx_leaderboard_periodo on public.leaderboard(periodo);
create index if not exists idx_leaderboard_rank on public.leaderboard(rank);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users enable row level security;
alter table public.rooms enable row level security;
alter table public.messages enable row level security;
alter table public.signals enable row level security;
alter table public.challenges enable row level security;
alter table public.leaderboard enable row level security;

-- Users policies
create policy "Users can read all profiles" on public.users
  for select using (true);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- Rooms policies
create policy "Anyone can read rooms" on public.rooms
  for select using (true);

-- Messages policies
create policy "Authenticated users can read messages" on public.messages
  for select using (auth.uid() is not null);

create policy "Verified users can send messages" on public.messages
  for insert with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.users
      where id = auth.uid()
      and avatrade_verified = true
    )
  );

-- Signals policies
create policy "Anyone can read signals" on public.signals
  for select using (true);

create policy "Traders can publish signals" on public.signals
  for insert with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.users
      where id = auth.uid()
      and ruolo in ('trader', 'admin')
      and avatrade_verified = true
    )
  );

create policy "Traders can update own signals" on public.signals
  for update using (auth.uid() = user_id);

-- Challenges policies
create policy "Anyone can read challenges" on public.challenges
  for select using (true);

create policy "Verified users can create challenges" on public.challenges
  for insert with check (
    auth.uid() = challenger_id and
    exists (
      select 1 from public.users
      where id = auth.uid()
      and avatrade_verified = true
    )
  );

create policy "Participants can update challenges" on public.challenges
  for update using (
    auth.uid() = challenger_id or auth.uid() = opponent_id
  );

-- Leaderboard policies
create policy "Anyone can read leaderboard" on public.leaderboard
  for select using (true);

create policy "System can update leaderboard" on public.leaderboard
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and ruolo = 'admin'
    )
  );

-- ============================================================
-- REALTIME
-- ============================================================

-- Enable realtime for messages
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.challenges;

-- ============================================================
-- TRIGGER: auto-create user profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
