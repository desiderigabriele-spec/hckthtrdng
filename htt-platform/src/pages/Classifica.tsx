import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { mockLeaderboard } from '../lib/mockData'
import type { LeaderboardEntry } from '../types'
import Badge from '../components/ui/Badge'

type Periodo = 'weekly' | 'monthly' | 'alltime'

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) { setValue(0); return }
    const duration = 1200
    const start = Date.now()
    const frame = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.round(target * progress))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [target, active])
  return value
}

const medalColors: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-gray-300',
  3: 'text-orange-400',
}

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: number }) {
  const [active, setActive] = useState(false)
  const pips = useCountUp(entry.pips_totali, active)
  const winRate = useCountUp(Math.round(entry.win_rate * 10), active) / 10

  useEffect(() => {
    const t = setTimeout(() => setActive(true), position * 200)
    return () => clearTimeout(t)
  }, [position])

  const colors = ['border-yellow-400/60 shadow-[0_0_20px_rgba(255,215,0,0.3)]', 'border-gray-400/40', 'border-orange-400/40']
  const heights = ['h-24', 'h-16', 'h-12']

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.15 }}
      className={`flex flex-col items-center gap-2`}
    >
      {/* Avatar */}
      <div className={`w-14 h-14 rounded-full border-2 ${colors[position - 1]} bg-[#1A1A1A] flex items-center justify-center`}>
        <span className={`font-mono text-lg font-bold ${medalColors[position]}`}>
          {entry.users?.username?.slice(0, 2).toUpperCase()}
        </span>
      </div>

      {/* Username */}
      <span className={`font-mono text-xs ${medalColors[position]} uppercase tracking-wider`}>
        {entry.users?.username}
      </span>

      {/* Stats */}
      <div className="text-center">
        <p className="font-mono text-sm text-[#00FF41] font-bold">{pips} pips</p>
        <p className="font-mono text-xs text-gray-500">{winRate.toFixed(1)}% WR</p>
      </div>

      {/* Podium block */}
      <div className={`w-20 ${heights[position - 1]} bg-gradient-to-t ${
        position === 1 ? 'from-yellow-600/30 to-yellow-400/10 border-t-2 border-yellow-400/60' :
        position === 2 ? 'from-gray-600/20 to-gray-400/5 border-t-2 border-gray-400/40' :
        'from-orange-700/20 to-orange-400/5 border-t-2 border-orange-400/40'
      } flex items-center justify-center rounded-t`}>
        <span className={`font-display text-2xl ${medalColors[position]}`}>
          {position === 1 ? '1' : position === 2 ? '2' : '3'}
        </span>
      </div>
    </motion.div>
  )
}

function LeaderboardRow({ entry, index, isMe }: { entry: LeaderboardEntry; index: number; isMe: boolean }) {
  const [active, setActive] = useState(false)
  const pips = useCountUp(entry.pips_totali, active)

  useEffect(() => {
    const t = setTimeout(() => setActive(true), index * 60)
    return () => clearTimeout(t)
  }, [index])

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50 transition-colors ${
        isMe ? 'border-l-2 border-l-[#00FF41] bg-[#00FF41]/5' : ''
      }`}
    >
      <td className="px-4 py-3">
        <Badge rank={entry.rank} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#00FF41]/20 flex items-center justify-center">
            <span className="font-mono text-xs text-[#00FF41]">
              {entry.users?.username?.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className={`font-mono text-sm ${isMe ? 'text-[#00FF41]' : 'text-[#E5E5E5]'}`}>
            {entry.users?.username}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <Badge winRate={entry.win_rate} />
      </td>
      <td className="px-4 py-3">
        <span className="font-mono text-sm text-[#00FF41]">{pips}</span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className={`font-mono text-sm ${entry.streak_attuale > 0 ? 'text-[#FFB800]' : 'text-gray-500'}`}>
          {entry.streak_attuale > 0 ? `${entry.streak_attuale}x` : '-'}
        </span>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <Badge role={entry.users?.ruolo} />
      </td>
    </motion.tr>
  )
}

export default function Classifica() {
  const { user } = useAuth()
  const [periodo, setPeriodo] = useState<Periodo>('alltime')
  const [entries, setEntries] = useState<LeaderboardEntry[]>(mockLeaderboard)
  const [loading, setLoading] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*, users(*)')
          .eq('periodo', periodo)
          .order('rank', { ascending: true })
          .limit(50)
        if (!error && data && data.length > 0) {
          setEntries(data as LeaderboardEntry[])
        }
      } catch {
        // Use mock data on error
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [periodo])

  const top3 = entries.slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0D0D0D] p-4"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl text-[#00FF41] tracking-widest glow-green-text">
          CLASSIFICA
        </h1>
        <p className="font-mono text-xs text-gray-500 mt-1">{`> leaderboard globale — top traders`}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['weekly', 'monthly', 'alltime'] as Periodo[]).map((p) => (
          <button
            key={p}
            onClick={() => { setPeriodo(p); fetchedRef.current = false }}
            className={`font-mono text-xs px-4 py-2 rounded border uppercase tracking-wider transition-all ${
              periodo === p
                ? 'bg-[#00FF41]/10 border-[#00FF41]/60 text-[#00FF41]'
                : 'bg-transparent border-[#2A2A2A] text-gray-500 hover:border-[#00FF41]/30 hover:text-[#00FF41]'
            }`}
          >
            {p === 'weekly' ? 'Settimanale' : p === 'monthly' ? 'Mensile' : 'All Time'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="font-mono text-[#00FF41] text-sm text-center py-8 animate-pulse">
          {`> caricamento classifica...`}
        </div>
      ) : (
        <>
          {/* Podium */}
          {top3.length === 3 && (
            <div className="mb-8 flex items-end justify-center gap-4">
              {/* 2nd */}
              <PodiumCard entry={top3[1]} position={2} />
              {/* 1st */}
              <PodiumCard entry={top3[0]} position={1} />
              {/* 3rd */}
              <PodiumCard entry={top3[2]} position={3} />
            </div>
          )}

          {/* Full table */}
          <div className="bg-[#0D0D0D] border border-[#00FF41]/20 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#00FF41]/20 text-left">
                    <th className="px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">Trader</th>
                    <th className="px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider hidden sm:table-cell">Win Rate</th>
                    <th className="px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">Pips</th>
                    <th className="px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider hidden md:table-cell">Streak</th>
                    <th className="px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ruolo</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => (
                    <LeaderboardRow
                      key={entry.id}
                      entry={entry}
                      index={i}
                      isMe={entry.user_id === user?.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
