import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { User } from '../types'

export default function Admin() {
  const [pending, setPending] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('users').select('*').eq('avatrade_verified', false).then(({ data }) => {
      if (data) setPending(data)
      setLoading(false)
    })
  }, [])

  const verify = async (userId: string) => {
    setVerifying(userId)
    const { error } = await supabase.from('users').update({ avatrade_verified: true, ruolo: 'trader' }).eq('id', userId)
    if (!error) setPending(prev => prev.filter(u => u.id !== userId))
    setVerifying(null)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pt-4">
        <Shield className="text-[#FFB800]" size={24} />
        <h1 className="font-display text-3xl text-white">PANNELLO ADMIN</h1>
      </div>

      <div className="bg-[#FFB800]/10 border border-[#FFB800]/30 rounded p-3 mb-6">
        <p className="font-mono text-xs text-[#FFB800]">&gt; utenti in attesa di verifica: <strong>{pending.length}</strong></p>
      </div>

      {loading && <p className="font-mono text-xs text-gray-500">&gt; caricamento...</p>}

      {!loading && pending.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle size={40} className="text-[#00FF41] mx-auto mb-3" />
          <p className="font-mono text-sm text-gray-400">&gt; nessun utente in attesa di verifica</p>
        </div>
      )}

      <div className="space-y-3">
        {pending.map((u, idx) => (
          <motion.div key={u.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.07 }}
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-xs text-[#FFB800]">{u.username.slice(0,2).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm text-white font-bold">{u.username}</div>
              <div className="font-mono text-xs text-gray-500">{u.email}</div>
              {u.avatrade_account_id && (
                <div className="font-mono text-[10px] text-[#FFB800] flex items-center gap-1 mt-0.5">
                  <Clock size={10} /> AvaTrade: {u.avatrade_account_id}
                </div>
              )}
            </div>
            <button
              onClick={() => verify(u.id)}
              disabled={verifying === u.id}
              className="bg-[#00FF41] text-[#0D0D0D] font-mono text-xs px-4 py-2 rounded disabled:opacity-50 hover:shadow-[0_0_12px_rgba(0,255,65,0.4)] transition-all flex-shrink-0"
            >
              {verifying === u.id ? '...' : 'VERIFICA'}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
