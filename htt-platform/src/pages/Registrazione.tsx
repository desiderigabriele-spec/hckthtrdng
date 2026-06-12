import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import MatrixRain from '../components/layout/MatrixRain'

const BOOT_LINES = [
  '> inizializzazione sistema HTT...',
  '> connessione neurale: OK',
  '> mercati online: OK',
  '> HACK_THE_TRADING — registrazione',
]

export default function Registrazione() {
  const [step, setStep] = useState<'boot' | 'form' | 'avatrade' | 'attesa'>('boot')
  const [bootLine, setBootLine] = useState(0)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [avatradeId, setAvatradeId] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleBoot = () => {
    if (bootLine < BOOT_LINES.length - 1) {
      setBootLine(b => b + 1)
    } else {
      setStep('form')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) throw authError
      if (data.user) {
        const { error: dbError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          username,
          avatrade_verified: false,
          ruolo: 'viewer',
        })
        if (dbError) throw dbError
      }
      setStep('avatrade')
    } catch (err: any) {
      setError(err.message || 'Errore registrazione')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatrade = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await supabase.from('users').update({ avatrade_account_id: avatradeId }).eq('id', session.user.id)
      }
      setStep('attesa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4 relative overflow-hidden">
      <MatrixRain />
      <div className="w-full max-w-md relative z-10">

        <AnimatePresence mode="wait">
          {step === 'boot' && (
            <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <h1 className="font-display text-5xl text-[#00FF41] mb-8" style={{ textShadow: '0 0 20px rgba(0,255,65,0.6)' }}>
                HACK_THE<br />TRADING
              </h1>
              <div className="text-left bg-black/60 border border-[#00FF41]/20 rounded p-6 mb-6 font-mono text-sm">
                {BOOT_LINES.slice(0, bootLine + 1).map((line, i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[#00FF41] mb-1">{line}</motion.p>
                ))}
                <span className="text-[#00FF41] cursor-blink">▮</span>
              </div>
              <button onClick={handleBoot} className="w-full bg-[#00FF41] text-[#0D0D0D] font-display text-xl py-3 rounded hover:shadow-[0_0_20px_rgba(0,255,65,0.5)] transition-all">
                {bootLine < BOOT_LINES.length - 1 ? '> CONTINUA' : '> INIZIA REGISTRAZIONE'}
              </button>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-[#0D0D0D] border border-[#00FF41]/30 rounded p-6">
                <p className="font-mono text-xs text-[#00FF41] mb-5">&gt; crea il tuo accesso_</p>
                {error && <p className="font-mono text-xs text-[#FF0033] bg-[#FF0033]/10 border border-[#FF0033]/30 p-2 rounded mb-4">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="font-mono text-xs text-gray-400 block mb-1">USERNAME</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-black/50 border border-[#2A2A2A] focus:border-[#00FF41] text-white font-mono text-sm px-3 py-2 rounded outline-none" placeholder="null_trader" />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-gray-400 block mb-1">EMAIL</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-black/50 border border-[#2A2A2A] focus:border-[#00FF41] text-white font-mono text-sm px-3 py-2 rounded outline-none" placeholder="trader@htt.io" />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-gray-400 block mb-1">PASSWORD</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full bg-black/50 border border-[#2A2A2A] focus:border-[#00FF41] text-white font-mono text-sm px-3 py-2 pr-10 rounded outline-none" placeholder="min. 6 caratteri" />
                      <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00FF41] transition-colors">
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#00FF41] text-[#0D0D0D] font-display text-lg py-3 rounded disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all">
                    {loading ? '> elaborazione...' : 'CONTINUA'}
                  </button>
                </form>
                <p className="text-center font-mono text-xs text-gray-500 mt-4">
                  Hai già un account? <Link to="/login" className="text-[#00FF41] hover:underline">Accedi</Link>
                </p>
              </div>
            </motion.div>
          )}

          {step === 'avatrade' && (
            <motion.div key="avatrade" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-[#0D0D0D] border border-[#FFB800]/30 rounded p-6">
                <p className="font-mono text-xs text-[#FFB800] mb-2">&gt; step 2/2 — collegamento AvaTrade_</p>
                <h2 className="font-display text-2xl text-white mb-3">APRI IL TUO CONTO</h2>
                <p className="font-mono text-xs text-gray-400 mb-4">Per partecipare alle sfide hai bisogno di un conto demo AvaTrade. <strong className="text-white">Il tuo deposito (250€) resta tuo</strong>, sul tuo conto personale.</p>
                <a href="https://www.avatrade.it" target="_blank" rel="noreferrer" className="block w-full bg-[#FFB800] text-[#0D0D0D] font-display text-lg py-3 rounded text-center hover:shadow-[0_0_20px_rgba(255,184,0,0.4)] transition-all mb-6">
                  APRI CONTO AVATRADE →
                </a>
                <form onSubmit={handleAvatrade} className="space-y-4">
                  <div>
                    <label className="font-mono text-xs text-gray-400 block mb-1">IL TUO USERNAME AVATRADE</label>
                    <input value={avatradeId} onChange={e => setAvatradeId(e.target.value)} required className="w-full bg-black/50 border border-[#2A2A2A] focus:border-[#FFB800] text-white font-mono text-sm px-3 py-2 rounded outline-none" placeholder="es. JohnTrader92" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#00FF41] text-[#0D0D0D] font-display text-lg py-3 rounded disabled:opacity-50">
                    {loading ? '> invio...' : 'INVIA RICHIESTA VERIFICA'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {step === 'attesa' && (
            <motion.div key="attesa" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="bg-[#0D0D0D] border border-[#00FF41]/30 rounded p-8">
                <div className="text-5xl mb-4">⏳</div>
                <h2 className="font-display text-3xl text-[#00FF41] mb-3">VERIFICA IN CORSO</h2>
                <div className="font-mono text-xs text-gray-400 space-y-1 mb-6 text-left bg-black/50 p-4 rounded border border-[#2A2A2A]">
                  <p className="text-[#00FF41]">&gt; richiesta ricevuta: OK</p>
                  <p className="text-[#00FF41]">&gt; dati AvaTrade: in verifica...</p>
                  <p className="text-gray-500">&gt; attendi conferma dal team HTT</p>
                  <span className="text-[#FFB800] cursor-blink">▮</span>
                </div>
                <p className="font-mono text-xs text-gray-500">Riceverai conferma a breve. Nel frattempo puoi esplorare la classifica pubblica.</p>
                <button onClick={() => navigate('/classifica')} className="mt-4 font-mono text-xs text-[#00FF41] hover:underline">&gt; vai alla classifica →</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
