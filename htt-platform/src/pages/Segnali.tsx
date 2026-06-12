import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { mockSignals } from '../lib/mockData'
import type { Signal } from '../types'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

type FilterStatus = 'all' | 'open' | 'win' | 'loss'

function SignalCard({ signal, index }: { signal: Signal; index: number }) {
  const statusColors = {
    open: 'text-[#00FF41] border-[#00FF41]/40 bg-[#00FF41]/10',
    win: 'text-[#FFB800] border-[#FFB800]/40 bg-[#FFB800]/10',
    loss: 'text-[#FF0033] border-[#FF0033]/40 bg-[#FF0033]/10',
  }

  const directionColor = signal.direzione === 'BUY' ? 'text-[#00FF41]' : 'text-[#FF0033]'
  const user = signal.users
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return h > 0 ? `${h}h fa` : `${m}m fa`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Card className="p-4 hover:border-[#00FF41]/40 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-gray-500">{`> SIGNAL_DECODE`}</span>
            <span className="font-display text-base text-[#E5E5E5]">{signal.asset}</span>
          </div>
          <span className={`font-mono text-xs px-2 py-0.5 rounded border ${statusColors[signal.status]} uppercase`}>
            {signal.status}
          </span>
        </div>

        {/* Terminal content */}
        <div className="font-mono text-xs space-y-1.5 bg-[#1A1A1A] rounded p-3 border border-[#2A2A2A]">
          <div className="flex gap-2">
            <span className="text-gray-500 w-20">DIREZIONE</span>
            <span className={`font-bold ${directionColor}`}>
              {signal.direzione === 'BUY' ? '▲' : '▼'} {signal.direzione}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-20">TIMEFRAME</span>
            <span className="text-[#E5E5E5]">{signal.timeframe}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-20">ENTRY</span>
            <span className="text-[#FFB800]">
              {signal.entry_min} — {signal.entry_max}
            </span>
          </div>
          <div className="border-t border-[#2A2A2A] pt-1.5">
            <div className="flex gap-2">
              <span className="text-[#00FF41] w-20">TP1</span>
              <span className="text-[#E5E5E5]">{signal.tp1}</span>
              {signal.tp2 && (
                <>
                  <span className="text-[#00FF41] ml-2">TP2</span>
                  <span className="text-[#E5E5E5]">{signal.tp2}</span>
                </>
              )}
              {signal.tp3 && (
                <>
                  <span className="text-[#00FF41] ml-2">TP3</span>
                  <span className="text-[#E5E5E5]">{signal.tp3}</span>
                </>
              )}
            </div>
            <div className="flex gap-2 mt-1">
              <span className="text-[#FF0033] w-20">SL</span>
              <span className="text-[#E5E5E5]">{signal.sl}</span>
            </div>
          </div>
          {signal.pips_result !== undefined && (
            <div className="border-t border-[#2A2A2A] pt-1.5 flex gap-2">
              <span className="text-gray-500 w-20">RISULTATO</span>
              <span className={signal.pips_result >= 0 ? 'text-[#00FF41]' : 'text-[#FF0033]'}>
                {signal.pips_result > 0 ? '+' : ''}{signal.pips_result} pips
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center">
              <span className="font-mono text-[10px] text-[#00FF41] font-bold">
                {user?.username?.slice(0, 2).toUpperCase() || '??'}
              </span>
            </div>
            <span className="font-mono text-xs text-gray-400">{user?.username || 'unknown'}</span>
          </div>
          <span className="font-mono text-[10px] text-gray-600">{timeAgo(signal.created_at)}</span>
        </div>
      </Card>
    </motion.div>
  )
}

export default function Segnali() {
  const { user } = useAuth()
  const [signals, setSignals] = useState<Signal[]>(mockSignals)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    asset: '',
    direzione: 'BUY' as 'BUY' | 'SELL',
    entry_min: '',
    entry_max: '',
    tp1: '',
    tp2: '',
    tp3: '',
    sl: '',
    timeframe: 'H4',
  })

  useEffect(() => {
    const fetchSignals = async () => {
      const { data, error } = await supabase
        .from('signals')
        .select('*, users(*)')
        .order('created_at', { ascending: false })
        .limit(50)
      if (!error && data && data.length > 0) {
        setSignals(data as Signal[])
      }
    }
    fetchSignals()
  }, [])

  const filtered = filter === 'all' ? signals : signals.filter((s) => s.status === filter)

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      const { error } = await supabase.from('signals').insert({
        user_id: user.id,
        asset: form.asset,
        direzione: form.direzione,
        entry_min: parseFloat(form.entry_min),
        entry_max: parseFloat(form.entry_max),
        tp1: parseFloat(form.tp1),
        tp2: form.tp2 ? parseFloat(form.tp2) : null,
        tp3: form.tp3 ? parseFloat(form.tp3) : null,
        sl: parseFloat(form.sl),
        timeframe: form.timeframe,
        status: 'open',
      })
      if (error) throw error
      setShowForm(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const isTrader = user?.ruolo === 'trader' || user?.ruolo === 'admin'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0D0D0D] p-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-[#00FF41] tracking-widest glow-green-text">
            SEGNALI
          </h1>
          <p className="font-mono text-xs text-gray-500 mt-1">{`> feed segnali operativi`}</p>
        </div>
        {isTrader && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            + PUBBLICA
          </Button>
        )}
      </div>

      {/* Publish form */}
      {showForm && isTrader && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          <Card className="p-4">
            <h3 className="font-mono text-sm text-[#00FF41] mb-4">{`> NUOVO SEGNALE`}</h3>
            <form onSubmit={handlePublish} className="grid grid-cols-2 gap-3">
              {[
                { key: 'asset', label: 'Asset', placeholder: 'EUR/USD', type: 'text' },
                { key: 'timeframe', label: 'Timeframe', placeholder: 'H4', type: 'text' },
                { key: 'entry_min', label: 'Entry Min', placeholder: '1.0850', type: 'number' },
                { key: 'entry_max', label: 'Entry Max', placeholder: '1.0870', type: 'number' },
                { key: 'tp1', label: 'TP1', placeholder: '1.0920', type: 'number' },
                { key: 'sl', label: 'SL', placeholder: '1.0800', type: 'number' },
                { key: 'tp2', label: 'TP2 (opt)', placeholder: '1.0970', type: 'number' },
                { key: 'tp3', label: 'TP3 (opt)', placeholder: '1.1020', type: 'number' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block font-mono text-[10px] text-gray-500 mb-1 uppercase">{label}</label>
                  <input
                    type={type}
                    step="any"
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required={!['tp2', 'tp3'].includes(key)}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2 py-1.5 text-xs font-mono text-[#E5E5E5] placeholder-gray-700 focus:outline-none focus:border-[#00FF41]/40"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block font-mono text-[10px] text-gray-500 mb-1 uppercase">Direzione</label>
                <div className="flex gap-2">
                  {(['BUY', 'SELL'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, direzione: d }))}
                      className={`flex-1 py-1.5 font-mono text-xs rounded border uppercase tracking-wider transition-all ${
                        form.direzione === d
                          ? d === 'BUY'
                            ? 'bg-[#00FF41]/20 border-[#00FF41] text-[#00FF41]'
                            : 'bg-[#FF0033]/20 border-[#FF0033] text-[#FF0033]'
                          : 'border-[#2A2A2A] text-gray-500 hover:border-gray-500'
                      }`}
                    >
                      {d === 'BUY' ? '▲ BUY' : '▼ SELL'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2 flex gap-2">
                <Button type="submit" variant="primary" size="sm" loading={loading} className="flex-1">
                  PUBBLICA SEGNALE
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  ANNULLA
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'open', 'win', 'loss'] as FilterStatus[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-xs px-3 py-1.5 rounded border uppercase tracking-wider transition-all ${
              filter === f
                ? f === 'open' ? 'bg-[#00FF41]/10 border-[#00FF41]/60 text-[#00FF41]'
                : f === 'win' ? 'bg-[#FFB800]/10 border-[#FFB800]/60 text-[#FFB800]'
                : f === 'loss' ? 'bg-[#FF0033]/10 border-[#FF0033]/60 text-[#FF0033]'
                : 'bg-[#00FF41]/10 border-[#00FF41]/60 text-[#00FF41]'
                : 'bg-transparent border-[#2A2A2A] text-gray-500 hover:border-[#00FF41]/20 hover:text-gray-300'
            }`}
          >
            {f === 'all' ? 'TUTTI' : f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Signal grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((signal, i) => (
          <SignalCard key={signal.id} signal={signal} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 font-mono text-gray-600">
          {`> nessun segnale trovato`}
        </div>
      )}
    </motion.div>
  )
}
