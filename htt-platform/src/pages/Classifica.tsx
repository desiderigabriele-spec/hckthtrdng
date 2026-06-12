import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, TrendingUp, Flame } from 'lucide-react'
import { mockLeaderboard } from '../lib/mockData'
import type { LeaderboardEntry, User } from '../types'

const BADGES: Record<string, string> = { 1: 'TOP_TRADER', 2: 'ELITE', 3: 'RISING_STAR' }
const PERIODS = ['alltime', 'monthly', 'weekly'] as const

function CountUp({ value, decimals = 1 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const step = value / 40
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(timer) } else { setDisplay(start) }
    }, 20)
    return () => clearInterval(timer)
  }, [value])
  return <span>{display.toFixed(decimals)}</span>
}

export default function Classifica({ user }: { user: User | null }) {
  const [period, setPeriod] = useState<typeof PERIODS[number]>('alltime')
  const data: LeaderboardEntry[] = mockLeaderboard

  const top3 = data.slice(0, 3)
  const rest = data.slice(3)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pt-4">
        <Trophy className="text-[#FFB800]" size={24} />
        <h1 className="font-display text-3xl text-white">CLASSIFICA</h1>
        <div className="flex-1" />
        <div className="flex gap-1">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`font-mono text-[10px] px-3 py-1 rounded border transition-all ${period === p ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10' : 'border-[#2A2A2A] text-gray-500 hover:border-[#00FF41]/30'}`}>
              {p === 'alltime' ? 'ALL TIME' : p === 'monthly' ? 'MESE' : 'SETTIMANA'}
            </button>
          ))}
        </div>
      </div>

      {/* Podio top 3 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[top3[1], top3[0], top3[2]].map((entry, idx) => {
          if (!entry) return null
          const positions = [2, 1, 3]
          const pos = positions[idx]
          const colors = { 1: '#FFB800', 2: '#888888', 3: '#CD7F32' }
          const color = colors[pos as 1 | 2 | 3]
          return (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: pos === 1 ? -10 : 0 }} transition={{ delay: idx * 0.1 }}
              className={`bg-[#1A1A1A] border rounded p-3 text-center ${pos === 1 ? 'border-[#FFB800]/50' : 'border-[#2A2A2A]'}`}
              style={{ boxShadow: pos === 1 ? '0 0 20px rgba(255,184,0,0.2)' : undefined }}>
              <div className="font-display text-2xl mb-1" style={{ color }}>{pos === 1 ? '🥇' : pos === 2 ? '🥈' : '🥉'}</div>
              <div className="font-mono text-xs text-white font-bold truncate">{entry.users?.username}</div>
              <div className="font-mono text-xs mt-1" style={{ color }}><CountUp value={entry.win_rate} />%</div>
              <div className="font-mono text-[10px] text-gray-500"><CountUp value={entry.pips_totali} decimals={0} /> pips</div>
            </motion.div>
          )
        })}
      </div>

      {/* Lista resto */}
      <div className="space-y-2">
        {rest.map((entry, idx) => {
          const isMe = user && entry.user_id === user.id
          return (
            <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded border transition-all ${isMe ? 'border-[#00FF41]/50 bg-[#00FF41]/5' : 'border-[#2A2A2A] bg-[#1A1A1A]'}`}>
              <span className="font-mono text-sm text-gray-500 w-6 text-center">#{entry.rank}</span>
              <div className="w-8 h-8 rounded bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-center">
                <span className="font-mono text-xs text-[#00FF41]">{(entry.users?.username || 'U').slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-sm font-bold ${isMe ? 'text-[#00FF41]' : 'text-white'}`}>{entry.users?.username}</span>
                  {BADGES[entry.rank] && <span className="font-mono text-[9px] text-[#FFB800] border border-[#FFB800]/30 px-1 rounded">{BADGES[entry.rank]}</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-[#00FF41] flex items-center gap-1 justify-end">
                  <TrendingUp size={12} /><CountUp value={entry.win_rate} />%
                </div>
                <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1 justify-end">
                  <Zap size={10} /><CountUp value={entry.pips_totali} decimals={0} />p
                  {entry.streak_attuale > 0 && <><Flame size={10} className="text-[#FF0033] ml-1" />{entry.streak_attuale}</>}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
