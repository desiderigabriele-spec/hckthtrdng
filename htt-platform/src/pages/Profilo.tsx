import { motion } from 'framer-motion'
import { LogOut, User as UserIcon, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { User } from '../types'
import { mockLeaderboard } from '../lib/mockData'

export default function Profilo({ user, setUser }: { user: User; setUser: (u: User | null) => void }) {
  const entry = mockLeaderboard.find(e => e.rank <= 10) || mockLeaderboard[0]

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6 pt-4">
        <UserIcon className="text-[#00FF41]" size={24} />
        <h1 className="font-display text-3xl text-white">PROFILO</h1>
      </div>

      {/* Header profilo */}
      <div className="bg-[#1A1A1A] border border-[#00FF41]/30 rounded p-6 mb-4 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center bg-[#00FF41]/10 border-2 border-[#00FF41]/40">
          <span className="font-display text-3xl text-[#00FF41]">{user.username.slice(0,2).toUpperCase()}</span>
        </div>
        <h2 className="font-display text-2xl text-white mb-1">{user.username}</h2>
        <div className="flex items-center justify-center gap-2">
          {user.avatrade_verified
            ? <span className="font-mono text-[10px] text-[#00FF41] border border-[#00FF41]/30 px-2 py-0.5 rounded">✓ VERIFICATO AVATRADE</span>
            : <span className="font-mono text-[10px] text-[#FFB800] border border-[#FFB800]/30 px-2 py-0.5 rounded">⏳ IN ATTESA VERIFICA</span>
          }
          {user.ruolo === 'admin' && (
            <span className="font-mono text-[10px] text-[#FF0033] border border-[#FF0033]/30 px-2 py-0.5 rounded flex items-center gap-1">
              <Shield size={10} /> ADMIN
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      {user.avatrade_verified && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'SFIDE', value: entry.sfide_totali, color: 'text-white' },
            { label: 'WIN RATE', value: `${entry.win_rate}%`, color: 'text-[#00FF41]' },
            { label: 'PIPS', value: entry.pips_totali, color: 'text-[#FFB800]' },
            { label: 'VITTORIE', value: entry.vittorie, color: 'text-[#00FF41]' },
            { label: 'STREAK', value: entry.streak_attuale, color: 'text-[#FF0033]' },
            { label: 'RANK', value: `#${entry.rank}`, color: 'text-white' },
          ].map(s => (
            <div key={s.label} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded p-3 text-center">
              <div className={`font-mono text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="font-mono text-[10px] text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {!user.avatrade_verified && (
        <div className="bg-[#FFB800]/10 border border-[#FFB800]/30 rounded p-4 mb-4">
          <p className="font-mono text-xs text-[#FFB800]">&gt; il tuo profilo è in attesa di verifica.</p>
          <p className="font-mono text-xs text-gray-400 mt-1">Una volta verificato avrai accesso completo a chat, sfide e segnali.</p>
        </div>
      )}

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded p-4 mb-4">
        <p className="font-mono text-xs text-gray-500 mb-1">EMAIL</p>
        <p className="font-mono text-sm text-white">{user.email}</p>
      </div>

      <button onClick={logout} className="w-full flex items-center justify-center gap-2 border border-[#FF0033]/40 text-[#FF0033] font-mono text-sm py-3 rounded hover:bg-[#FF0033]/10 transition-all">
        <LogOut size={16} /> DISCONNETTI
      </button>
    </motion.div>
  )
}
