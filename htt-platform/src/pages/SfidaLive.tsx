import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ArrowLeft, Clock } from 'lucide-react'
import { mockChallenges } from '../lib/mockData'
import type { User } from '../types'

export default function SfidaLive({ user: _user }: { user: User }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const challenge = mockChallenges.find(c => c.id === id)

  const [pips1, setPips1] = useState(challenge?.challenger_pips || 0)
  const [pips2, setPips2] = useState(challenge?.opponent_pips || 0)
  const [winner, setWinner] = useState('')
  const [timeLeft, setTimeLeft] = useState(43200)

  useEffect(() => {
    if (!challenge || challenge.stato !== 'active') return
    const interval = setInterval(() => {
      setPips1(p => Math.max(0, p + Math.floor(Math.random() * 5 - 1)))
      setPips2(p => Math.max(0, p + Math.floor(Math.random() * 5 - 1)))
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval)
          setWinner(pips1 > pips2 ? challenge.challenger?.username || 'Trader 1' : challenge.opponent?.username || 'Trader 2')
          return 0
        }
        return t - 1
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [challenge])

  if (!challenge) return (
    <div className="flex items-center justify-center h-screen">
      <p className="font-mono text-gray-500">&gt; sfida non trovata</p>
    </div>
  )

  const total = pips1 + pips2 + 0.01
  const hours = Math.floor(timeLeft / 3600)
  const mins = Math.floor((timeLeft % 3600) / 60)
  const secs = timeLeft % 60

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen p-4 max-w-2xl mx-auto">
      <button onClick={() => navigate('/sfide')} className="flex items-center gap-2 font-mono text-xs text-gray-500 hover:text-[#00FF41] mb-4 transition-colors">
        <ArrowLeft size={14} /> TORNA ALLE SFIDE
      </button>

      <div className="text-center mb-6">
        <div className="font-display text-3xl text-white">{challenge.asset}</div>
        <div className="flex items-center justify-center gap-2 font-mono text-xs text-gray-500">
          <Clock size={12} />
          <span className="text-[#FFB800]">{String(hours).padStart(2,'0')}:{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</span>
          <span>rimanenti</span>
        </div>
      </div>

      {/* Schermata VS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { name: challenge.challenger?.username, pips: pips1, color: '#00FF41', isLeading: pips1 >= pips2 },
          { name: challenge.opponent?.username, pips: pips2, color: '#FFB800', isLeading: pips2 > pips1 },
        ].map((t, idx) => (
          <motion.div key={idx} animate={{ scale: t.isLeading ? 1.02 : 1 }}
            className={`bg-[#1A1A1A] border rounded p-4 text-center transition-all`}
            style={{ borderColor: t.isLeading ? t.color : '#2A2A2A', boxShadow: t.isLeading ? `0 0 20px ${t.color}30` : undefined }}>
            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center border-2" style={{ borderColor: t.color, background: `${t.color}15` }}>
              <span className="font-mono text-xs" style={{ color: t.color }}>{(t.name || 'U').slice(0,2).toUpperCase()}</span>
            </div>
            <div className="font-mono text-xs mb-2 truncate" style={{ color: t.color }}>{t.name}</div>
            <div className="font-mono text-4xl font-bold text-white flex items-center justify-center gap-1">
              <Zap size={20} style={{ color: t.color }} />
              <motion.span key={t.pips} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>{t.pips}</motion.span>
            </div>
            <div className="font-mono text-[10px] text-gray-500">pips</div>
            {t.isLeading && <div className="font-mono text-[10px] mt-2" style={{ color: t.color }}>▲ IN VANTAGGIO</div>}
          </motion.div>
        ))}
      </div>

      {/* Barra progresso */}
      <div className="w-full h-3 bg-[#2A2A2A] rounded-full overflow-hidden mb-2">
        <motion.div animate={{ width: `${(pips1 / total) * 100}%` }} transition={{ duration: 0.5 }}
          className="h-full rounded-full" style={{ background: 'linear-gradient(to right, #00FF41, #00CC33)' }} />
      </div>
      <div className="flex justify-between font-mono text-[10px] text-gray-500 mb-6">
        <span className="text-[#00FF41]">{Math.round((pips1/total)*100)}%</span>
        <span className="text-[#FFB800]">{Math.round((pips2/total)*100)}%</span>
      </div>

      {/* Winner */}
      <AnimatePresence>
        {winner && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="text-center">
              <motion.div animate={{ opacity: [1,0,1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="font-mono text-[#00FF41] text-xs mb-4">
                &gt; ANALISI COMPLETATA...
              </motion.div>
              <div className="font-display text-5xl text-[#00FF41] mb-2" style={{ textShadow: '0 0 30px rgba(0,255,65,0.8)' }}>
                WINNER DETECTED
              </div>
              <div className="font-display text-3xl text-white mb-6">{winner}</div>
              <button onClick={() => navigate('/sfide')} className="bg-[#00FF41] text-[#0D0D0D] font-display text-lg px-8 py-3 rounded">
                TORNA ALLE SFIDE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
