import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'
import MatrixRain from '../components/layout/MatrixRain'

const bootLines = [
  '> inizializzazione sistema HTT...',
  '> connessione neurale: OK',
  '> mercati online: OK',
  '> HACK_THE_TRADING — accesso richiesto',
]

type Step = 'boot' | 'register' | 'avatrade' | 'pending'

export default function Onboarding() {
  const [step, setStep] = useState<Step>('boot')
  const [bootIndex, setBootIndex] = useState(0)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [avtradeUsername, setAvtradeUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (step === 'boot') {
      if (bootIndex < bootLines.length) {
        const timer = setTimeout(() => setBootIndex(i => i + 1), 600)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setStep('register'), 800)
        return () => clearTimeout(timer)
      }
    }
  }, [step, bootIndex])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: authData.user.id,
          email,
          username,
          avatrade_verified: false,
          ruolo: 'viewer',
        })
        if (profileError) throw profileError
      }

      setStep('avatrade')
    } catch (err: any) {
      setError(err.message || 'Errore registrazione')
    } finally {
      setLoading(false)
    }
  }

  const handleAvaTrade = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non autenticato')

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatrade_account_id: avtradeUsername })
        .eq('id', user.id)

      if (updateError) throw updateError
      setStep('pending')
    } catch (err: any) {
      setError(err.message || 'Errore')
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
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[#00FF41] space-y-2"
            >
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
                <span className="animate-pulse">_</span>
              )}
            </motion.div>
          )}

          {step === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-6">
                <h1 className="font-anton text-4xl text-[#00FF41] glow-green-text">REGISTRAZIONE</h1>
                <p className="text-gray-500 font-mono text-xs mt-1">{'>'} crea le tue credenziali</p>
              </div>

              <div className="bg-[#0D0D0D] border border-[#00FF41]/30 rounded-lg p-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">{'>'} EMAIL</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-black/50 border border-[#00FF41]/20 rounded px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00FF41]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">{'>'} USERNAME</label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-black/50 border border-[#00FF41]/20 rounded px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00FF41]"
                      placeholder="hack_trader"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">{'>'} PASSWORD</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-black/50 border border-[#00FF41]/20 rounded px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00FF41]"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-[#FF0033] text-xs font-mono bg-[#FF0033]/10 border border-[#FF0033]/30 rounded p-2">
                      {'>'} ERRORE: {error}
                    </div>
                  )}

                  <Button type="submit" loading={loading} fullWidth>
                    {'>'} CREA ACCOUNT
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {step === 'avatrade' && (
            <motion.div
              key="avatrade"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-6">
                <h1 className="font-anton text-3xl text-[#FFB800]">VERIFICA AVATRADE</h1>
                <p className="text-gray-500 font-mono text-xs mt-1">{'>'} step 2/2 — collegamento broker</p>
              </div>

              <div className="bg-[#0D0D0D] border border-[#FFB800]/30 rounded-lg p-6 space-y-4">
                <div className="text-sm font-mono text-gray-300 bg-[#FFB800]/5 border border-[#FFB800]/20 rounded p-3">
                  <p className="text-[#FFB800] font-bold mb-2">{'>'} PERCHE&apos; AVATRADE?</p>
                  <p className="text-gray-400 text-xs">
                    HTT verifica le tue performance reali tramite il tuo conto AvaTrade.
                    Questo garantisce che tutti i trader siano reali e le sfide siano oneste.
                  </p>
                </div>

                <a
                  href="https://www.avatrade.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 bg-[#FFB800]/10 border border-[#FFB800]/40 text-[#FFB800] font-mono text-sm rounded hover:bg-[#FFB800]/20 transition-all"
                >
                  {'>'} APRI CONTO AVATRADE →
                </a>

                <form onSubmit={handleAvaTrade} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      {'>'} USERNAME AVATRADE
                    </label>
                    <input
                      type="text"
                      value={avtradeUsername}
                      onChange={e => setAvtradeUsername(e.target.value)}
                      className="w-full bg-black/50 border border-[#FFB800]/20 rounded px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#FFB800]"
                      placeholder="il tuo username su AvaTrade"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-[#FF0033] text-xs font-mono bg-[#FF0033]/10 border border-[#FF0033]/30 rounded p-2">
                      {'>'} ERRORE: {error}
                    </div>
                  )}

                  <Button type="submit" loading={loading} variant="amber" fullWidth>
                    {'>'} INVIA PER VERIFICA
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {step === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-2 border-[#00FF41] border-t-transparent rounded-full mx-auto"
              />
              <div className="font-mono text-[#00FF41] space-y-2">
                <p className="text-lg">{'>'} RICHIESTA INVIATA</p>
                <p className="text-xs text-gray-400">Il team sta verificando il tuo accesso</p>
                <p className="text-xs text-gray-500">Riceverai una notifica entro 24-48 ore</p>
              </div>
              <Button
                onClick={() => navigate('/login')}
                variant="secondary"
                fullWidth
              >
                {'>'} VAI AL LOGIN
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
