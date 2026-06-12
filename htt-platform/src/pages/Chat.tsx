import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { User, Message } from '../types'

const ROOM_ID = 'main-room'

const BLOCKLIST = [/\d{9,}/g, /t\.me\//i, /whatsapp/i, /telegram/i, /https?:\/\//i, /@\w+/g]
function modera(text: string): { ok: boolean; reason?: string } {
  if (BLOCKLIST.some(r => r.test(text))) return { ok: false, reason: 'messaggio non consentito dalla community' }
  return { ok: true }
}

export default function Chat({ user }: { user: User }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [checking, setChecking] = useState(false)
  const [blocked, setBlocked] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user.avatrade_verified) return
    supabase.from('messages').select('*, users(username)').eq('room_id', ROOM_ID).order('created_at', { ascending: true }).limit(50).then(({ data }) => {
      if (data) setMessages(data as Message[])
    })
    const channel = supabase.channel('chat').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${ROOM_ID}` }, payload => {
      supabase.from('messages').select('*, users(username)').eq('id', payload.new.id).single().then(({ data }) => {
        if (data) setMessages(prev => [...prev, data as Message])
      })
    }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setBlocked('')
    const result = modera(input)
    if (!result.ok) {
      setBlocked(result.reason || 'messaggio bloccato')
      setInput('')
      return
    }
    setChecking(true)
    await supabase.from('messages').insert({ user_id: user.id, room_id: ROOM_ID, content: input, moderazione_status: 'ok' })
    setInput('')
    setChecking(false)
  }

  if (!user.avatrade_verified) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-screen gap-4 px-6 text-center">
        <Lock size={40} className="text-[#FFB800]" />
        <h2 className="font-display text-3xl text-[#FFB800]">ACCESSO LIMITATO</h2>
        <p className="font-mono text-xs text-gray-400 max-w-xs">&gt; la chat è riservata ai trader verificati AvaTrade. La tua verifica è in corso.</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-screen">
      <div className="border-b border-[#00FF41]/20 px-4 py-3 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
        <span className="font-mono text-xs text-[#00FF41]">CHAT COMMUNITY — {messages.length} messaggi</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <div className="w-8 h-8 rounded bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-xs text-[#00FF41]">{(msg.users?.username || 'U').slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-xs text-[#00FF41]">{msg.users?.username}</span>
                <span className="font-mono text-[10px] text-gray-600">{new Date(msg.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="font-mono text-sm text-gray-300 break-words">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {checking && <p className="font-mono text-xs text-gray-500 pl-11">&gt; verifica in corso...</p>}
        {blocked && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs text-[#FF0033] bg-[#FF0033]/10 border border-[#FF0033]/20 p-2 rounded">
            &gt; messaggio bloccato: {blocked}
          </motion.p>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="border-t border-[#00FF41]/20 p-3 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="> scrivi un messaggio..."
          className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#00FF41] text-white font-mono text-sm px-3 py-2 rounded outline-none transition-colors"
        />
        <button type="submit" disabled={!input.trim() || checking} className="bg-[#00FF41] text-[#0D0D0D] px-4 py-2 rounded disabled:opacity-40 hover:shadow-[0_0_12px_rgba(0,255,65,0.4)] transition-all">
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  )
}
