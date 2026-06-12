import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'

type Step = 'boot' | 'register' | 'avatrade' | 'pending' | 'granted'

const bootLines = [
  '> inizializzazione sistema HTT...',
  '> connessione neurale: OK',
  '> mercati online: OK',
  '> HACK_THE_TRADING — accesso richiesto',
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('boot')
  const [bootIndex, setBootIndex] = useState(0)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [avaTradeName, setAvaTradeName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState('')

  // Boot sequence
  useEffect(() => {
    if (step !== 'boot') return
    if (bootIndex < bootLines.length) {
      const t = setTimeout(() => setBootIndex((i) => i + 1), 700)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setStep('register'), 800)
      return () => clearTimeout(t)
    }
  }, [bootIndex, step])

  const handleGoogle = async () => {
    setError('')
    setLoadingGoogle(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/chat` },
    })
    if (error) {
      setError(error.message)
      setLoadingGoogle(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) throw authError
      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          username,
          avatrade_verified: false,
          ruolo: 'viewer',
        })
        if (profileError) throw profileError
      }
      setStep('avatrade')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore registrazione'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatrade = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Sessione non trovata')
      const { error } = await supabase
        .from('users')
        .update({ avatrade_account_id: avaTradeName })
        .eq('id', user.id)
      if (error) throw error
      setStep('pending')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {/* BOOT */}
        {step === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-lg font-mono text-[#00FF41] space-y-2"
          >
            <div className="text-center mb-6">
              <p className="text-4xl font-display glow-green-text tracking-widest">HTT</p>
              <p className="text-xs text-gray-500 mt-1">SISTEMA DI AVVIO</p>
            </div>
            {bootLines.slice(0, bootIndex).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm"
              >
                {line}
              </motion.div>
            ))}
            {bootIndex < bootLines.length && (
              <span className="inline-block w-2 h-4 bg-[#00FF41] animate-pulse" />
            )}
          </motion.div>
        )}

        {/* REGISTER */}
        {step === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-6">
              <h1 className="font-display text-3xl text-[#00FF41] glow-green-text tracking-widest">HACK_THE_TRADING</h1>
              <p className="text-gray-500 font-mono text-xs mt-1">RICHIESTA ACCESSO NUOVO OPERATORE</p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#00FF41]/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#00FF41]/20">
                <div className="w-3 h-3 rounded-full bg-[#FF0033]" />
                <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
                <div className="w-3 h-3 rounded-full bg-[#00FF41]" />
                <span className="ml-2 font-mono text-xs text-gray-500">register.sh — step 1/3</span>
              </div>

              {/* Google button */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loadingGoogle}
                className="w-full flex items-center justify-center gap-3 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#00FF41]/40 text-white font-mono text-sm py-3 rounded transition-all disabled:opacity-50 mb-4"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loadingGoogle ? '> connessione...' : 'Registrati con Google'}
              </button>

              {/* Divisore */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#2A2A2A]" />
                <span className="font-mono text-xs text-gray-600">oppure</span>
                <div className="flex-1 h-px bg-[#2A2A2A]" />
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs text-gray-400 mb-1 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="user@htt.io"
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2.5 text-sm font-mono text-[#E5E5E5] placeholder-gray-600 focus:outline-none focus:border-[#00FF41]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-400 mb-1 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                    required
                    placeholder="null_trader"
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2.5 text-sm font-mono text-[#E5E5E5] placeholder-gray-600 focus:outline-none focus:border-[#00FF41]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-400 mb-1 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="min. 8 caratteri"
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2.5 pr-10 text-sm font-mono text-[#E5E5E5] placeholder-gray-600 focus:outline-none focus:border-[#00FF41]/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00FF41] transition-colors">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-[#FF0033]/10 border border-[#FF0033]/40 rounded px-3 py-2 font-mono text-xs text-[#FF0033]">
                    {`> ERRORE: ${error}`}
                  </div>
                )}

                <Button type="submit" variant="primary" loading={loading} className="w-full">
                  CONTINUA
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="font-mono text-xs text-gray-600">
                  Hai già un account?{' '}
                  <Link to="/login" className="text-[#00FF41] hover:underline">ACCEDI</Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* AVATRADE */}
        {step === 'avatrade' && (
          <motion.div
            key="avatrade"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <div className="bg-[#0D0D0D] border border-[#FFB800]/40 rounded-lg p-6 shadow-[0_0_20px_rgba(255,184,0,0.1)]">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#FFB800]/20">
                <div className="w-3 h-3 rounded-full bg-[#FF0033]" />
                <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
                <div className="w-3 h-3 rounded-full bg-[#00FF41]" />
                <span className="ml-2 font-mono text-xs text-gray-500">avatrade.sh — step 2/3</span>
              </div>

              <div className="font-mono text-sm space-y-2 mb-6">
                <p className="text-[#FFB800]">{`> REQUISITO: account AvaTrade`}</p>
                <p className="text-gray-400 text-xs">{`> Per accedere alla community HTT è necessario`}</p>
                <p className="text-gray-400 text-xs">{`> avere un account AvaTrade attivo.`}</p>
              </div>

              <a
                href="https://www.avatrade.com/?tag=YOUR_IB_TAG"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#FFB800]/10 border border-[#FFB800] text-[#FFB800] font-mono text-sm py-2.5 rounded uppercase tracking-widest hover:bg-[#FFB800]/20 transition-all mb-6"
              >
                APRI CONTO AVATRADE
              </a>

              <form onSubmit={handleAvatrade} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs text-gray-400 mb-1 uppercase tracking-wider">
                    Username / Account ID AvaTrade
                  </label>
                  <input
                    type="text"
                    value={avaTradeName}
                    onChange={(e) => setAvaTradeName(e.target.value)}
                    required
                    placeholder="es. 12345678 o username"
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2.5 text-sm font-mono text-[#E5E5E5] placeholder-gray-600 focus:outline-none focus:border-[#FFB800]/50 transition-all"
                  />
                </div>

                {error && (
                  <div className="bg-[#FF0033]/10 border border-[#FF0033]/40 rounded px-3 py-2 font-mono text-xs text-[#FF0033]">
                    {`> ERRORE: ${error}`}
                  </div>
                )}

                <Button type="submit" variant="secondary" loading={loading} className="w-full">
                  INVIA PER VERIFICA
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {/* PENDING */}
        {step === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md text-center"
          >
            <div className="bg-[#0D0D0D] border border-[#00FF41]/30 rounded-lg p-8">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#00FF41]/20">
                <div className="w-3 h-3 rounded-full bg-[#FF0033]" />
                <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
                <div className="w-3 h-3 rounded-full bg-[#00FF41]" />
                <span className="ml-2 font-mono text-xs text-gray-500">status.sh — step 3/3</span>
              </div>

              <div className="mb-6">
                <div className="text-[#FFB800] font-mono text-sm space-y-2">
                  {['> richiesta ricevuta: OK', '> dati AvaTrade: in verifica', '> accesso: IN ATTESA'].map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.4 }}
                    >
                      {line}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="border border-[#FFB800]/30 rounded p-4 bg-[#FFB800]/5">
                <p className="font-mono text-xs text-[#FFB800] uppercase tracking-wider mb-2">
                  VERIFICA IN CORSO
                </p>
                <p className="text-gray-400 text-sm">
                  Il team sta verificando il tuo account AvaTrade. Riceverai accesso entro 24-48 ore.
                </p>
              </div>

              <div className="mt-4 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#FFB800]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>

              <Link to="/login" className="mt-6 block">
                <Button variant="ghost" size="sm" className="w-full">
                  TORNA AL LOGIN
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* GRANTED */}
        {step === 'granted' && (
          <motion.div
            key="granted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.h1
              className="font-display text-6xl text-[#00FF41] tracking-widest"
              animate={{ textShadow: ['0 0 10px #00FF41', '0 0 40px #00FF41', '0 0 10px #00FF41'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ACCESS GRANTED
            </motion.h1>
            <p className="font-mono text-[#00FF41] text-sm mt-4">{`> benvenuto nel sistema`}</p>
            <Button
              variant="primary"
              className="mt-6"
              onClick={() => navigate('/chat')}
            >
              ENTRA NEL SISTEMA
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
