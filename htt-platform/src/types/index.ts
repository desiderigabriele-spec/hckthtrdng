export interface User {
  id: string
  email: string
  username: string
  avatrade_account_id?: string
  avatrade_verified: boolean
  ruolo: 'viewer' | 'trader' | 'admin'
  avatar_url?: string
  created_at: string
}

export interface Message {
  id: string
  user_id: string
  room_id: string
  content: string
  moderazione_status: 'ok' | 'blocked'
  created_at: string
  users?: User
}

export interface Signal {
  id: string
  user_id: string
  asset: string
  direzione: 'BUY' | 'SELL'
  entry_min: number
  entry_max: number
  tp1: number
  tp2: number
  tp3: number
  sl: number
  timeframe: string
  status: 'open' | 'win' | 'loss'
  pips_result?: number
  created_at: string
  closed_at?: string
  users?: User
}

export interface Challenge {
  id: string
  tipo: '1v1'
  challenger_id: string
  opponent_id?: string
  asset: string
  durata_ore: number
  stato: 'pending' | 'active' | 'completed'
  challenger_pips: number
  opponent_pips: number
  winner_id?: string
  inizio?: string
  fine?: string
  created_at: string
  challenger?: User
  opponent?: User
}

export interface LeaderboardEntry {
  id: string
  user_id: string
  sfide_totali: number
  vittorie: number
  sconfitte: number
  win_rate: number
  pips_totali: number
  streak_attuale: number
  rank: number
  periodo: 'weekly' | 'monthly' | 'alltime'
  updated_at: string
  users?: User
}
