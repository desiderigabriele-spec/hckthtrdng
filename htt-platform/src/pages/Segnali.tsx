import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Plus, X } from 'lucide-react'
import { mockSignals } from '../lib/mockData'
import type { Signal, User } from '../types'

const STATUS_STYLE: Record<string, string> = {
  open: 'text-[#00FF41] border-[#00FF41]/40',
  win: 'text-[#FFB800] border-[#FFB800]/40',
  loss: 'text-[#FF0033] border-[#FF0033]/40',
}

export default function Segnali({ user }: { user: User | null }) {
  const [signals] = useState<Signal[]>(mockSignals)
  const [showForm, setShowForm] = useState(false)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pt-4">
        <Radio className="text-[#00FF41]" size={24} />
        <h1 className="font-display text-3xl text-white">SEGNALI</h1>
        <div className="flex-1" />
        {user?.avatrade_verified && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#00FF41] text-[#0D0D0D] font-mono text-xs px-4 py-2 rounded hover:shadow-[0_0_12px_rgba(0,255,65,0.4)] transition-all">
            <Plus size={14} /> PUBBLICA
          </button>
        )}
      </div>

      <div className="space-y-4">
        {signals.map((sig, idx) => (
          <motion.div key={sig.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
            className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#00FF41]/30 rounded p-4 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-xl text-white">{sig.asset}</span>
                  <span className={`font-display text-lg ${sig.direzione === 'BUY' ? 'text-[#00FF41]' : 'text-[#FF0033]'}`}>{sig.direzione}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-gray-500">da</span>
                  <span className="font-mono text-xs text-[#00FF41]">{sig.users?.username}</span>
                  <span className="font-mono text-[10px] text-gray-600">#{mockSignals.findIndex(s => s.user_id === sig.user_id) + 4}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-mono text-[10px] border px-2 py-0.5 rounded ${STATUS_STYLE[sig.status]}`}>{sig.status.toUpperCase()}</span>
                <div className="font-mono text-[10px] text-gray-600 mt-1">{sig.timeframe}</div>
              </div>
            </div>

            <div className="font-mono text-xs space-y-1 bg-black/40 p-3 rounded border border-[#2A2A2A]">
              <p className="text-gray-400">📡 SIGNAL_DECODE — <span className="text-white">{sig.asset}</span></p>
              <p className="text-gray-400">📈 DIREZIONE : <span className={sig.direzione === 'BUY' ? 'text-[#00FF41]' : 'text-[#FF0033]'}>{sig.direzione}</span></p>
              <p className="text-gray-400">⏱ TIMEFRAME  : <span className="text-white">{sig.timeframe}</span></p>
              <p className="text-gray-400">🎯 ENTRY      : <span className="text-white">{sig.entry_min} — {sig.entry_max}</span></p>
              <p className="text-gray-400">✅ TP1: <span className="text-[#00FF41]">{sig.tp1}</span>  TP2: <span className="text-[#00FF41]">{sig.tp2}</span>  TP3: <span className="text-[#00FF41]">{sig.tp3}</span></p>
              <p className="text-gray-400">❌ SL: <span className="text-[#FF0033]">{sig.sl}</span></p>
              {sig.pips_result !== undefined && (
                <p className={`mt-2 font-bold ${sig.pips_result >= 0 ? 'text-[#00FF41]' : 'text-[#FF0033]'}`}>
                  RESULT: {sig.pips_result >= 0 ? '+' : ''}{sig.pips_result} pips
                </p>
              )}
            </div>

            <div className="font-mono text-[10px] text-gray-600 mt-2 text-right">
              {new Date(sig.created_at).toLocaleString('it-IT')}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal pubblica segnale */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1A1A1A] border border-[#00FF41]/30 rounded p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl text-[#00FF41]">NUOVO SEGNALE</h3>
                <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-500" /></button>
              </div>
              <p className="font-mono text-xs text-gray-400 text-center py-4">&gt; funzione disponibile prossimamente_<span className="cursor-blink">▮</span></p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
