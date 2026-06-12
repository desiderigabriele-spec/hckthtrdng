import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Swords, Radio } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { mockLeaderboard, mockChallenges, mockSignals } from '../lib/mockData'
import type { LeaderboardEntry, Challenge, Signal } from '../types'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'

function StatBox({ label, value, color = 'text-[#00FF41]' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded p-3 text-center">
      <p className={`font-mono text-xl font-bold ${color}`}>{value}</p>
      <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  )
}

export default function Profilo() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<LeaderboardEntry | null>(null)
  const [recentChallenges, setRecentChallenges] = useState<Challenge[]>([])
  const [mySignals, setMySignals] = useState<Signal[]>([])

  useEffect(() => {
    if (!user) return

    // Try to fetch real stats
    const fetchStats = async () => {
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .eq('periodo', 'alltime')
        .single()
      if (data) setStats(data as LeaderboardEntry)
      else {
        // Use mock data
        const mock = mockLeaderboard.find((e) => e.user_id === user.id)
        setStats(mock || null)
      }
    }

    const fetchChallenges = async () => {
      const { data } = await supabase
        .from('challenges')
        .select('*, challenger:challenger_id(id,username,ruolo,avatrade_verified,email,created_at), opponent:opponent_id(id,username,ruolo,avatrade_verified,email,created_at)')
        .or(`challenger_id.eq.${user.id},opponent_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(5)
      if (data && data.length > 0) setRecentChallenges(data as Challenge[])
      else setRecentChallenges(mockChallenges.slice(0, 3))
    }

    const fetchSignals = async () => {
      const { data } = await supabase
        .from('signals')
        .select('*, users(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      if (data && data.length > 0) setMySignals(data as Signal[])
      else setMySignals(mockSignals.filter((s) => s.user_id === user.id))
    }

    fetchStats()
    fetchChallenges()
    fetchSignals()
  }, [user])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="font-mono text-[#FF0033]">{`> accesso non autorizzato`}</div>
      </div>
    )
  }

  const initials = user.username.slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0D0D0D] p-4"
    >
      {/* Profile header */}
      <Card className="p-5 mb-5" glow>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#00FF41]/10 border-2 border-[#00FF41]/60 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.3)]">
            <span className="font-mono text-xl font-bold text-[#00FF41]">{initials}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display text-xl text-[#E5E5E5] tracking-wider">{user.username}</h2>
              <Badge role={user.ruolo} />
            </div>
            <p className="font-mono text-xs text-gray-500">{user.email}</p>
            {stats && (
              <p className="font-mono text-xs text-[#00FF41] mt-0.5">
                #{stats.rank} in classifica
              </p>
            )}
          </div>

          <div className={`w-3 h-3 rounded-full ${user.avatrade_verified ? 'bg-[#00FF41]' : 'bg-[#FFB800]'}`} title={user.avatrade_verified ? 'AvaTrade verificato' : 'In verifica'} />
        </div>

        {!user.avatrade_verified && (
          <div className="mt-3 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded px-3 py-2">
            <p className="font-mono text-xs text-[#FFB800]">{`> verifica AvaTrade in corso...`}</p>
          </div>
        )}
      </Card>

      {/* Stats */}
      {stats ? (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
          <StatBox label="Sfide" value={stats.sfide_totali} />
          <StatBox label="Vittorie" value={stats.vittorie} color="text-[#00FF41]" />
          <StatBox label="Sconfitte" value={stats.sconfitte} color="text-[#FF0033]" />
          <StatBox label="Win Rate" value={`${stats.win_rate.toFixed(1)}%`} color="text-[#FFB800]" />
          <StatBox label="Pips" value={stats.pips_totali} />
          <StatBox label="Streak" value={stats.streak_attuale > 0 ? `${stats.streak_attuale}x` : '-'} color="text-[#FFB800]" />
        </div>
      ) : (
        <div className="mb-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 font-mono text-xs text-gray-500 text-center">
          {`> statistiche non disponibili`}
        </div>
      )}

      {/* Recent Challenges */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Swords size={14} className="text-[#00FF41]" />
          <h3 className="font-mono text-xs text-[#00FF41] uppercase tracking-wider">Sfide Recenti</h3>
        </div>
        <div className="space-y-2">
          {recentChallenges.length > 0 ? recentChallenges.map((c) => (
            <div key={c.id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-[#E5E5E5]">{c.asset}</span>
                <span className="font-mono text-xs text-gray-600 ml-2">{c.challenger?.username} vs {c.opponent?.username || 'TBD'}</span>
              </div>
              <span className={`font-mono text-xs uppercase ${
                c.stato === 'active' ? 'text-[#00FF41]' :
                c.stato === 'pending' ? 'text-[#FFB800]' : 'text-gray-500'
              }`}>{c.stato}</span>
            </div>
          )) : (
            <p className="font-mono text-xs text-gray-600">{`> nessuna sfida recente`}</p>
          )}
        </div>
      </div>

      {/* Published Signals */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Radio size={14} className="text-[#00FF41]" />
          <h3 className="font-mono text-xs text-[#00FF41] uppercase tracking-wider">Segnali Pubblicati</h3>
        </div>
        <div className="space-y-2">
          {mySignals.length > 0 ? mySignals.map((s) => (
            <div key={s.id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs ${s.direzione === 'BUY' ? 'text-[#00FF41]' : 'text-[#FF0033]'}`}>
                  {s.direzione === 'BUY' ? '▲' : '▼'}
                </span>
                <span className="font-mono text-xs text-[#E5E5E5]">{s.asset}</span>
                <span className="font-mono text-xs text-gray-600">{s.timeframe}</span>
              </div>
              <span className={`font-mono text-xs uppercase ${
                s.status === 'open' ? 'text-[#00FF41]' :
                s.status === 'win' ? 'text-[#FFB800]' : 'text-[#FF0033]'
              }`}>{s.status}</span>
            </div>
          )) : (
            <p className="font-mono text-xs text-gray-600">{`> nessun segnale pubblicato`}</p>
          )}
        </div>
      </div>

      {/* Logout */}
      <Button variant="danger" size="sm" className="w-full" onClick={handleLogout}>
        <LogOut size={14} />
        DISCONNETTI
      </Button>
    </motion.div>
  )
}
