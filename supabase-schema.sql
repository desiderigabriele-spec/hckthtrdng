-- Schema HTT Platform

create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  username text unique not null,
  avatrade_account_id text,
  avatrade_verified boolean default false,
  ruolo text default 'viewer',
  avatar_url text,
  created_at timestamp with time zone default now()
);

create table if not exists public.rooms (
  id text primary key,
  nome text not null,
  tipo text default 'chat',
  created_at timestamp with time zone default now()
);

insert into public.rooms (id, nome, tipo) values
  ('main-room', 'Community HTT', 'chat')
on conflict do nothing;

create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  room_id text default 'main-room' references public.rooms(id),
  content text not null,
  moderazione_status text default 'ok',
  moderazione_reason text,
  created_at timestamp with time zone default now()
);

create table if not exists public.signals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  asset text not null,
  direzione text not null,
  entry_min numeric,
  entry_max numeric,
  tp1 numeric, tp2 numeric, tp3 numeric,
  sl numeric,
  timeframe text,
  status text default 'open',
  pips_result numeric,
  created_at timestamp with time zone default now(),
  closed_at timestamp with time zone
);

create table if not exists public.challenges (
  id uuid default gen_random_uuid() primary key,
  tipo text default '1v1',
  challenger_id uuid references public.users(id),
  opponent_id uuid references public.users(id),
  asset text,
  durata_ore integer,
  stato text default 'pending',
  challenger_pips numeric default 0,
  opponent_pips numeric default 0,
  winner_id uuid,
  inizio timestamp with time zone,
  fine timestamp with time zone,
  created_at timestamp with time zone default now()
);

create table if not exists public.leaderboard (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade unique,
  sfide_totali integer default 0,
  vittorie integer default 0,
  sconfitte integer default 0,
  win_rate numeric default 0,
  pips_totali numeric default 0,
  streak_attuale integer default 0,
  rank integer,
  periodo text default 'alltime',
  updated_at timestamp with time zone default now()
);

-- RLS
alter table public.users enable row level security;
alter table public.messages enable row level security;
alter table public.signals enable row level security;
alter table public.challenges enable row level security;
alter table public.leaderboard enable row level security;
alter table public.rooms enable row level security;

-- users: tutti leggono, ognuno aggiorna il proprio
create policy "public read users" on public.users for select using (true);
create policy "users insert own" on public.users for insert with check (auth.uid() = id);
create policy "users update own" on public.users for update using (auth.uid() = id);

-- rooms: tutti leggono
create policy "public read rooms" on public.rooms for select using (true);

-- messages: solo verificati leggono e scrivono
create policy "verified read messages" on public.messages for select using (
  exists (select 1 from public.users where id = auth.uid() and avatrade_verified = true)
);
create policy "verified insert messages" on public.messages for insert with check (
  exists (select 1 from public.users where id = auth.uid() and avatrade_verified = true)
  and auth.uid() = user_id
);

-- leaderboard: tutti leggono
create policy "public read leaderboard" on public.leaderboard for select using (true);

-- signals: tutti leggono, solo verificati scrivono
create policy "public read signals" on public.signals for select using (true);
create policy "verified insert signals" on public.signals for insert with check (
  exists (select 1 from public.users where id = auth.uid() and avatrade_verified = true)
);

-- challenges: tutti leggono, solo verificati creano
create policy "public read challenges" on public.challenges for select using (true);
create policy "verified insert challenges" on public.challenges for insert with check (
  exists (select 1 from public.users where id = auth.uid() and avatrade_verified = true)
);

-- admin può aggiornare users
create policy "admin update users" on public.users for update using (
  exists (select 1 from public.users where id = auth.uid() and ruolo = 'admin')
);

-- realtime per messages
alter publication supabase_realtime add table public.messages;
