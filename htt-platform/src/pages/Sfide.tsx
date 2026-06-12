import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Plus, X, Clock, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { mockChallenges } from '../lib/mockData'
import type { Challenge, User } from '../types'

const STATO_STYLE: Record<string, string> = {
  pending: 'text-[#FFB800] border-[#FFB800]/30',
  active: 'text-[#00FF41] border-[#00FF41]/30',
  completed: 'text-gray-500 border-gray-600',
}

export default function Sfide({ user }: { user: User }) {
  const [challenges] = useState<Challenge[]>(mockChallenges)
  const [showNew, setShowNew] = useState(false)
  const navigate = useNavigate()

  if (!user.avatrade_verified) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-screen gap-4 px-6 text-center">
        <Swords size={40} className="text-[#FFB800]" />
        <h2 className="font-display text-3xl text-[#FFB800]">VERIFICA RICHIESTA</h2>
        <p className="font-mono text-xs text-gray-400 max-w-xs">&gt; le sfide sono riservate ai trader verificati AvaTrade.</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pt-4">
        <Swords className="text-[#00FF41]" size={24} />
        <h1 className="font-display text-3xl text-white">SFIDE</h1>
      </div>

      {/* CTA principale */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        onClick={() => setShowNew(true)}
        className="w-full bg-[#00FF41]/10 border border-[#00FF41]/40 hover:border-[#00FF41] rounded p-5 mb-6 text-left transition-all group hover:shadow-[0_0_20px_rgba(0,255,65,0.15)]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#00FF41]/20 border border-[#00FF41]/40 flex items-center justify-center group-hover:bg-[#00FF41]/30 transition-colors">
            <Plus size={20} className="text-[#00FF41]" />
          </div>
          <div>
            <div className="font-display text-xl text-[#00FF41]">+ NUOVA SFIDA</div>
            <div className="font-mono text-xs text-gray-400">sfida un trader — vince chi fa più pips</div>
          </div>
        </div>
      </motion.button>

      {/* Lista sfide */}
      <div className="space-y-3">
        <p className="font-mono text-xs text-gray-500">&gt; sfide in corso ({challenges.filter(c => c.stato === 'active').length})</p>
        {challenges.map((ch, idx) => (
          <motion.div key={ch.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
            className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#00FF41]/30 rounded p-4 cursor-pointer transition-all"
            onClick={() => ch.stato === 'active' && navigate(`/sfide/${ch.id}`)}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg text-white">{ch.asset}</span>
                <span className={`font-mono text-[10px] border px-2 py-0.5 rounded ${STATO_STYLE[ch.stato]}`}>{ch.stato.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 font-mono text-xs">
                <Clock size={12} />{ch.durata_ore}h
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 text-center">
                <div className="font-mono text-xs text-[#00FF41] mb-0.5">{ch.challenger?.username}</div>
                <div className="font-mono text-2xl text-white flex items-center justify-center gap-1">
                  <Zap size={14} className="text-[#00FF41]" />{ch.challenger_pips}
                </div>
                <div className="font-mono text-[10px] text-gray-500">pips</div>
              </div>
              <div className="font-display text-xl text-gray-600">VS</div>
              <div className="flex-1 text-center">
                <div className="font-mono text-xs text-[#FFB800] mb-0.5">{ch.opponent?.username || '???'}</div>
                <div className="font-mono text-2xl text-white flex items-center justify-center gap-1">
                  <Zap size={14} className="text-[#FFB800]" />{ch.opponent_pips}
                </div>
                <div className="font-mono text-[10px] text-gray-500">pips</div>
              </div>
            </div>

            {ch.stato === 'active' && (
              <div className="mt-3">
                <div className="w-full h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div className="h-full bg-[#00FF41] rounded-full transition-all"
                    style={{ width: `${(ch.challenger_pips / (ch.challenger_pips + ch.opponent_pips + 0.01)) * 100}%` }} />
                </div>
                <p className="font-mono text-[10px] text-gray-600 text-center mt-1">&gt; tocca per seguire la sfida live</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal nuova sfida */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center p-4">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} className="bg-[#1A1A1A] border border-[#00FF41]/30 rounded p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl text-[#00FF41]">NUOVA SFIDA</h3>
                <button onClick={() => setShowNew(false)}><X size={18} className="text-gray-500" /></button>
              </div>
              <p className="font-mono text-xs text-gray-400 text-center py-4">&gt; funzione in sviluppo — disponibile a breve_<span className="cursor-blink">▮</span></p>
              <p className="font-mono text-[10px] text-gray-600 text-center">connessione AvaTrade API in corso...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
