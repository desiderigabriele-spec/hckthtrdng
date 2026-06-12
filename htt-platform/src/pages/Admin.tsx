import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { User } from '../types'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pending, setPending] = useState<User[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [tab, setTab] = useState<'pending' | 'all'>('pending')

  useEffect(() => {
    if (user && user.ruolo !== 'admin') {
      navigate('/')
      return
    }

    const fetchUsers = async () => {
      setLoading(true)
      const { data: pendingData } = await supabase
        .from('users')
        .select('*')
        .eq('avatrade_verified', false)
        .order('created_at', { ascending: false })
      if (pendingData) setPending(pendingData as User[])

      const { data: allData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      if (allData) setAllUsers(allData as User[])

      setLoading(false)
    }

    if (user?.ruolo === 'admin') fetchUsers()
  }, [user, navigate])

  const handleVerify = async (userId: string) => {
    setVerifyingId(userId)
    try {
      const { error } = await supabase
        .from('users')
        .update({ avatrade_verified: true, ruolo: 'trader' })
        .eq('id', userId)
      if (!error) {
        setPending((prev) => prev.filter((u) => u.id !== userId))
        setAllUsers((prev) =>
          prev.map((u) => u.id === userId ? { ...u, avatrade_verified: true, ruolo: 'trader' } : u)
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setVerifyingId(null)
    }
  }

  const handleReject = async (userId: string) => {
    setVerifyingId(userId)
    try {
      await supabase.from('users').delete().eq('id', userId)
      setPending((prev) => prev.filter((u) => u.id !== userId))
      setAllUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (err) {
      console.error(err)
    } finally {
      setVerifyingId(null)
    }
  }

  if (!user || user.ruolo !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="font-mono text-[#FF0033] text-center">
          <p>{`> ACCESSO NEGATO`}</p>
          <p className="text-gray-500 text-xs mt-2">{`> ruolo insufficiente`}</p>
        </div>
      </div>
    )
  }

  const displayedUsers = tab === 'pending' ? pending : allUsers

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0D0D0D] p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-[#FFB800]" size={20} />
        <div>
          <h1 className="font-display text-3xl text-[#FFB800] tracking-widest">ADMIN PANEL</h1>
          <p className="font-mono text-xs text-gray-500 mt-0.5">{`> gestione accessi e utenti`}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded p-3 text-center">
          <p className="font-mono text-xl font-bold text-[#FFB800]">{pending.length}</p>
          <p className="font-mono text-[10px] text-gray-500 uppercase">In attesa</p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded p-3 text-center">
          <p className="font-mono text-xl font-bold text-[#00FF41]">
            {allUsers.filter((u) => u.avatrade_verified).length}
          </p>
          <p className="font-mono text-[10px] text-gray-500 uppercase">Verificati</p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded p-3 text-center">
          <p className="font-mono text-xl font-bold text-[#E5E5E5]">{allUsers.length}</p>
          <p className="font-mono text-[10px] text-gray-500 uppercase">Totale</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('pending')}
          className={`font-mono text-xs px-4 py-2 rounded border uppercase tracking-wider transition-all ${
            tab === 'pending'
              ? 'bg-[#FFB800]/10 border-[#FFB800]/60 text-[#FFB800]'
              : 'bg-transparent border-[#2A2A2A] text-gray-500'
          }`}
        >
          IN ATTESA ({pending.length})
        </button>
        <button
          onClick={() => setTab('all')}
          className={`font-mono text-xs px-4 py-2 rounded border uppercase tracking-wider transition-all ${
            tab === 'all'
              ? 'bg-[#FFB800]/10 border-[#FFB800]/60 text-[#FFB800]'
              : 'bg-transparent border-[#2A2A2A] text-gray-500'
          }`}
        >
          TUTTI ({allUsers.length})
        </button>
      </div>

      {loading ? (
        <div className="font-mono text-[#FFB800] text-sm text-center py-8 animate-pulse">
          {`> caricamento utenti...`}
        </div>
      ) : displayedUsers.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle size={32} className="text-[#00FF41] mx-auto mb-3" />
          <p className="font-mono text-sm text-gray-500">{`> nessun utente in attesa`}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedUsers.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`p-4 ${!u.avatrade_verified ? 'border-[#FFB800]/30' : ''}`} amber={!u.avatrade_verified}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
                        <span className="font-mono text-xs text-[#00FF41] font-bold">
                          {u.username?.slice(0, 2).toUpperCase() || '??'}
                        </span>
                      </div>
                      <div>
                        <p className="font-mono text-sm text-[#E5E5E5]">{u.username}</p>
                        <p className="font-mono text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>

                    <div className="font-mono text-xs space-y-1 mt-2 ml-10">
                      {u.avatrade_account_id && (
                        <div className="flex gap-2">
                          <span className="text-gray-500">AvaTrade:</span>
                          <span className="text-[#FFB800]">{u.avatrade_account_id}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <span className="text-gray-500">Ruolo:</span>
                        <span className={u.ruolo === 'admin' ? 'text-[#FFB800]' : u.ruolo === 'trader' ? 'text-[#00FF41]' : 'text-gray-400'}>
                          {u.ruolo}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500">Verificato:</span>
                        <span className={u.avatrade_verified ? 'text-[#00FF41]' : 'text-[#FFB800]'}>
                          {u.avatrade_verified ? 'SI' : 'IN ATTESA'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!u.avatrade_verified && (
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        loading={verifyingId === u.id}
                        onClick={() => handleVerify(u.id)}
                      >
                        <CheckCircle size={12} />
                        VERIFICA
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={verifyingId === u.id}
                        onClick={() => handleReject(u.id)}
                      >
                        <XCircle size={12} />
                        RIFIUTA
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
