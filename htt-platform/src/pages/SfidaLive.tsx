import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { mockChallenges } from '../lib/mockData'
import type { Challenge } from '../types'
import Button from '../components/ui/Button'

function CountdownTimer({ endTime }: { endTime: string }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const diff = new Date(endTime).getTime() - Date.now()
      if (diff <= 0) { setTime('00:00:00'); return }
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0')
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')
      setTime(`${h}:${m}:${s}`)
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [endTime])

  return <span className="font-mono text-2xl text-[#FFB800]">{time}</span>
}

export default function SfidaLive() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [challengerPips, setChallengerPips] = useState(0)
  const [opponentPips, setOpponentPips] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) return
      const { data, error } = await supabase
        .from('challenges')
        .select('*, challenger:challenger_id(id,username,ruolo,avatrade_verified,email,created_at), opponent:opponent_id(id,username,ruolo,avatrade_verified,email,created_at)')
        .eq('id', id)
        .single()

      if (!error && data) {
        const c = data as Challenge
        setChallenge(c)
        setChallengerPips(c.challenger_pips)
        setOpponentPips(c.opponent_pips)
      } else {
        // fallback to mock
        const mock = mockChallenges.find((c) => c.id === id)
        if (mock) {
          setChallenge(mock)
          setChallengerPips(mock.challenger_pips)
          setOpponentPips(mock.opponent_pips)
        }
      }
      setLoading(false)
    }
    fetchChallenge()
  }, [id])

  // Simulate live pip updates
  useEffect(() => {
    if (!challenge || challenge.stato !== 'active') return
    const interval = setInterval(() => {
      setChallengerPips((p) => Math.max(0, p + Math.floor(Math.random() * 7 - 2)))
      setOpponentPips((p) => Math.max(0, p + Math.floor(Math.random() * 7 - 2)))
    }, 3000)
    return () => clearInterval(interval)
  }, [challenge])

  // Check for winner when timer ends
  useEffect(() => {
    if (!challenge?.fine) return
    const diff = new Date(challenge.fine).getTime() - Date.now()
    if (diff <= 0) {
      const w = challengerPips >= opponentPips
        ? challenge.challenger?.username
        : challenge.opponent?.username
      setWinner(w || null)
    }
  }, [challenge, challengerPips, opponentPips])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="font-mono text-[#00FF41] animate-pulse">{`> caricamento sfida...`}</div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-[#FF0033] mb-4">{`> sfida non trovata`}</p>
          <Button variant="ghost" onClick={() => navigate('/sfide')}>TORNA ALLE SFIDE</Button>
        </div>
      </div>
    )
  }

  const total = challengerPips + opponentPips || 1
  const challengerPct = Math.round((challengerPips / total) * 100)
  const opponentPct = 100 - challengerPct
  const challengerLeading = challengerPips >= opponentPips

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0D0D0D] p-4"
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/sfide')}
        className="flex items-center gap-2 font-mono text-xs text-gray-500 hover:text-[#00FF41] transition-colors mb-4"
      >
        <ArrowLeft size={14} />
        TORNA ALLE SFIDE
      </button>

      {/* Winner overlay */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-[#0D0D0D]/90 z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ textShadow: ['0 0 10px #00FF41', '0 0 60px #00FF41', '0 0 10px #00FF41'] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="font-display text-5xl text-[#00FF41] mb-4 tracking-widest"
              >
                WINNER DETECTED
              </motion.div>
              {['> analisi completata: OK', `> vincitore: ${winner}`, '> aggiornamento classifica...'].map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.4 }}
                  className="font-mono text-sm text-[#00FF41] mb-1"
                >
                  {line}
                </motion.p>
              ))}
              <Button
                variant="primary"
                className="mt-6"
                onClick={() => { setWinner(null); navigate('/sfide') }}
              >
                TORNA ALLE SFIDE
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center mb-6">
        <p className="font-mono text-xs text-gray-500 mb-1">{`> SFIDA LIVE — ${challenge.asset}`}</p>
        <h1 className="font-display text-2xl text-[#00FF41] tracking-widest glow-green-text">
          1 VS 1
        </h1>
        {challenge.fine && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <Clock size={14} className="text-[#FFB800]" />
            <CountdownTimer endTime={challenge.fine} />
          </div>
        )}
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
        <span className="font-mono text-xs text-[#00FF41] uppercase">LIVE</span>
      </div>

      {/* VS Layout */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Challenger */}
        <motion.div
          className={`p-4 rounded-lg border transition-all ${
            challengerLeading
              ? 'border-[#00FF41]/60 bg-[#00FF41]/5 shadow-[0_0_20px_rgba(0,255,65,0.2)]'
              : 'border-[#2A2A2A] bg-[#1A1A1A]'
          }`}
          animate={challengerLeading ? { scale: [1, 1.02, 1] } : { scale: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto mb-2 border-2 flex items-center justify-center ${
              challengerLeading ? 'border-[#00FF41] bg-[#00FF41]/10' : 'border-[#2A2A2A] bg-[#1A1A1A]'
            }`}>
              <span className="font-mono text-sm font-bold text-[#00FF41]">
                {challenge.challenger?.username?.slice(0, 2).toUpperCase() || '??'}
              </span>
            </div>
            <p className="font-mono text-xs text-[#E5E5E5] mb-1">{challenge.challenger?.username}</p>
            <motion.p
              key={challengerPips}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className={`font-display text-3xl ${challengerLeading ? 'text-[#00FF41] glow-green-text' : 'text-gray-400'}`}
            >
              {challengerPips}
            </motion.p>
            <p className="font-mono text-xs text-gray-500">pips</p>
            {challengerLeading && (
              <p className="font-mono text-[10px] text-[#00FF41] mt-1 animate-pulse">▲ IN VANTAGGIO</p>
            )}
          </div>
        </motion.div>

        {/* Opponent */}
        <motion.div
          className={`p-4 rounded-lg border transition-all ${
            !challengerLeading
              ? 'border-[#00FF41]/60 bg-[#00FF41]/5 shadow-[0_0_20px_rgba(0,255,65,0.2)]'
              : 'border-[#2A2A2A] bg-[#1A1A1A]'
          }`}
          animate={!challengerLeading ? { scale: [1, 1.02, 1] } : { scale: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto mb-2 border-2 flex items-center justify-center ${
              !challengerLeading ? 'border-[#00FF41] bg-[#00FF41]/10' : 'border-[#2A2A2A] bg-[#1A1A1A]'
            }`}>
              <span className="font-mono text-sm font-bold text-[#00FF41]">
                {challenge.opponent?.username?.slice(0, 2).toUpperCase() || '??'}
              </span>
            </div>
            <p className="font-mono text-xs text-[#E5E5E5] mb-1">{challenge.opponent?.username || 'TBD'}</p>
            <motion.p
              key={opponentPips}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className={`font-display text-3xl ${!challengerLeading ? 'text-[#00FF41] glow-green-text' : 'text-gray-400'}`}
            >
              {opponentPips}
            </motion.p>
            <p className="font-mono text-xs text-gray-500">pips</p>
            {!challengerLeading && (
              <p className="font-mono text-[10px] text-[#00FF41] mt-1 animate-pulse">▲ IN VANTAGGIO</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between font-mono text-[10px] text-gray-500 mb-1">
          <span>{challenge.challenger?.username}</span>
          <span>{challenge.opponent?.username || 'TBD'}</span>
        </div>
        <div className="h-3 bg-[#1A1A1A] rounded-full border border-[#2A2A2A] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00FF41] to-[#00FF41]/60"
            animate={{ width: `${challengerPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between font-mono text-[10px] text-gray-600 mt-1">
          <span>{challengerPct}%</span>
          <span>{opponentPct}%</span>
        </div>
      </div>

      {/* Asset & Duration info */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 font-mono text-xs space-y-1.5">
        <div className="flex justify-between">
          <span className="text-gray-500">ASSET</span>
          <span className="text-[#E5E5E5]">{challenge.asset}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">DURATA</span>
          <span className="text-[#E5E5E5]">{challenge.durata_ore}h</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">STATO</span>
          <span className="text-[#00FF41] uppercase">{challenge.stato}</span>
        </div>
      </div>
    </motion.div>
  )
}
