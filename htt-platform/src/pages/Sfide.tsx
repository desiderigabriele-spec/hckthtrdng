import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swords, Clock, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { mockChallenges } from '../lib/mockData'
import type { Challenge } from '../types'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

type Tab = 'mine' | 'all'

function ChallengeCard({ challenge, index }: { challenge: Challenge; index: number }) {
  const navigate = useNavigate()

  const statusColor = {
    pending: 'text-[#FFB800] border-[#FFB800]/40 bg-[#FFB800]/10',
    active: 'text-[#00FF41] border-[#00FF41]/40 bg-[#00FF41]/10',
    completed: 'text-gray-400 border-gray-600 bg-gray-800/30',
  }

  const timeLeft = () => {
    if (!challenge.fine) return null
    const diff = new Date(challenge.fine).getTime() - Date.now()
    if (diff <= 0) return 'SCADUTA'
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return `${h}h ${m}m`
  }

  const lead =
    challenge.challenger_pips > challenge.opponent_pips
      ? challenge.challenger
      : challenge.opponent

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className="p-4 hover:border-[#00FF41]/40 transition-all cursor-pointer"
        onClick={() => challenge.stato === 'active' && navigate(`/sfide/${challenge.id}`)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Swords size={14} className="text-[#00FF41]" />
            <span className="font-display text-sm text-[#E5E5E5]">{challenge.asset}</span>
            <span className="font-mono text-xs text-gray-600">{challenge.durata_ore}h</span>
          </div>
          <span className={`font-mono text-xs px-2 py-0.5 rounded border uppercase ${statusColor[challenge.stato]}`}>
            {challenge.stato}
          </span>
        </div>

        {/* Players */}
        <div className="flex items-center gap-2 mb-3">
          {/* Challenger */}
          <div className={`flex-1 flex items-center gap-2 p-2 rounded border ${
            challenge.stato === 'active' && lead?.id === challenge.challenger_id
              ? 'border-[#00FF41]/40 bg-[#00FF41]/5 shadow-[0_0_8px_rgba(0,255,65,0.2)]'
              : 'border-[#2A2A2A]'
          }`}>
            <div className="w-7 h-7 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center">
              <span className="font-mono text-xs text-[#00FF41] font-bold">
                {challenge.challenger?.username?.slice(0, 2).toUpperCase() || '??'}
              </span>
            </div>
            <div>
              <p className="font-mono text-xs text-[#E5E5E5]">{challenge.challenger?.username}</p>
              {challenge.stato === 'active' && (
                <p className="font-mono text-xs text-[#00FF41]">{challenge.challenger_pips} pips</p>
              )}
            </div>
          </div>

          <span className="font-display text-sm text-[#FFB800] mx-1">VS</span>

          {/* Opponent */}
          {challenge.opponent ? (
            <div className={`flex-1 flex items-center gap-2 p-2 rounded border ${
              challenge.stato === 'active' && lead?.id === challenge.opponent_id
                ? 'border-[#00FF41]/40 bg-[#00FF41]/5 shadow-[0_0_8px_rgba(0,255,65,0.2)]'
                : 'border-[#2A2A2A]'
            }`}>
              <div className="w-7 h-7 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center">
                <span className="font-mono text-xs text-[#00FF41] font-bold">
                  {challenge.opponent?.username?.slice(0, 2).toUpperCase() || '??'}
                </span>
              </div>
              <div>
                <p className="font-mono text-xs text-[#E5E5E5]">{challenge.opponent?.username}</p>
                {challenge.stato === 'active' && (
                  <p className="font-mono text-xs text-[#00FF41]">{challenge.opponent_pips} pips</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 p-2 rounded border border-dashed border-[#2A2A2A]">
              <User size={14} className="text-gray-600" />
              <span className="font-mono text-xs text-gray-600">In attesa...</span>
            </div>
          )}
        </div>

        {/* Time left */}
        {challenge.stato === 'active' && challenge.fine && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
            <Clock size={10} />
            <span>Termina in: <span className="text-[#FFB800]">{timeLeft()}</span></span>
          </div>
        )}

        {challenge.stato === 'active' && (
          <p className="font-mono text-[10px] text-[#00FF41] mt-2 text-right">
            {'> GUARDA LIVE →'}
          </p>
        )}
      </Card>
    </motion.div>
  )
}

export default function Sfide() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('all')
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ asset: 'EUR/USD', durata_ore: '24' })

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*, challenger:challenger_id(id,username,ruolo,avatrade_verified,email,created_at), opponent:opponent_id(id,username,ruolo,avatrade_verified,email,created_at)')
        .order('created_at', { ascending: false })
        .limit(30)
      if (!error && data && data.length > 0) {
        setChallenges(data as Challenge[])
      }
    }
    fetchChallenges()
  }, [])

  const handleNewChallenge = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      const { error } = await supabase.from('challenges').insert({
        tipo: '1v1',
        challenger_id: user.id,
        asset: form.asset,
        durata_ore: parseInt(form.durata_ore),
        stato: 'pending',
        challenger_pips: 0,
        opponent_pips: 0,
      })
      if (error) throw error
      setShowForm(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const myChallenges = challenges.filter(
    (c) => c.challenger_id === user?.id || c.opponent_id === user?.id
  )
  const displayed = tab === 'mine' ? myChallenges : challenges

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
          SFIDE
        </h1>
        <p className="font-mono text-xs text-gray-500 mt-1">{`> arena competitiva 1v1`}</p>
      </div>

      {/* New challenge CTA */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => setShowForm(!showForm)}
        className="mb-6 cursor-pointer bg-[#00FF41]/5 border border-[#00FF41]/40 rounded-lg p-5 flex items-center justify-between hover:bg-[#00FF41]/10 hover:shadow-[0_0_20px_rgba(0,255,65,0.2)] transition-all"
      >
        <div>
          <p className="font-display text-xl text-[#00FF41] tracking-widest">+ NUOVA SFIDA</p>
          <p className="font-mono text-xs text-gray-500 mt-0.5">sfida un altro trader 1vs1</p>
        </div>
        <Swords size={32} className="text-[#00FF41]" />
      </motion.div>

      {/* New challenge form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          <Card className="p-4">
            <h3 className="font-mono text-sm text-[#00FF41] mb-4">{`> CONFIGURA SFIDA`}</h3>
            <form onSubmit={handleNewChallenge} className="space-y-3">
              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1 uppercase">Asset</label>
                <select
                  value={form.asset}
                  onChange={(e) => setForm((f) => ({ ...f, asset: e.target.value }))}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-sm font-mono text-[#E5E5E5] focus:outline-none focus:border-[#00FF41]/50"
                >
                  {['EUR/USD', 'GBP/USD', 'BTC/USD', 'GOLD', 'US30', 'USD/JPY'].map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1 uppercase">Durata (ore)</label>
                <select
                  value={form.durata_ore}
                  onChange={(e) => setForm((f) => ({ ...f, durata_ore: e.target.value }))}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-sm font-mono text-[#E5E5E5] focus:outline-none focus:border-[#00FF41]/50"
                >
                  {['6', '12', '24', '48', '72'].map((h) => (
                    <option key={h} value={h}>{h} ore</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="sm" loading={loading} className="flex-1">
                  CREA SFIDA
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  ANNULLA
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'mine'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-xs px-4 py-2 rounded border uppercase tracking-wider transition-all ${
              tab === t
                ? 'bg-[#00FF41]/10 border-[#00FF41]/60 text-[#00FF41]'
                : 'bg-transparent border-[#2A2A2A] text-gray-500 hover:border-[#00FF41]/30'
            }`}
          >
            {t === 'all' ? 'TUTTE LE SFIDE' : 'LE MIE SFIDE'}
          </button>
        ))}
      </div>

      {/* Challenge list */}
      <div className="space-y-3">
        {displayed.map((challenge, i) => (
          <ChallengeCard key={challenge.id} challenge={challenge} index={i} />
        ))}
      </div>

      {displayed.length === 0 && (
        <div className="text-center py-16 font-mono text-gray-600">
          {tab === 'mine' ? '> nessuna sfida personale' : '> nessuna sfida disponibile'}
        </div>
      )}
    </motion.div>
  )
}
