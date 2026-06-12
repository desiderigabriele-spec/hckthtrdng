import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Message } from '../types'

const ROOM_ID = '00000000-0000-0000-0000-000000000001'

const MODERATION_PATTERNS = [
  /\b\d{3}[\s.-]?\d{3,4}[\s.-]?\d{4}\b/, // phone numbers
  /\b\d{10,11}\b/, // long digit sequences
  /https?:\/\/[^\s]+/, // URLs
  /www\.[^\s]+/, // www links
  /t\.me\/[^\s]+/, // telegram links
  /wa\.me\/[^\s]+/, // whatsapp links
]

function containsBlockedContent(text: string): boolean {
  return MODERATION_PATTERNS.some((pattern) => pattern.test(text))
}

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}

export default function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*, users(*)')
        .eq('room_id', ROOM_ID)
        .order('created_at', { ascending: true })
        .limit(100)
      if (!error && data) {
        setMessages(data as Message[])
        setTimeout(scrollToBottom, 100)
      }
    }
    loadMessages()

    // Subscribe to realtime
    const channel = supabase
      .channel('room:' + ROOM_ID)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${ROOM_ID}`,
        },
        async (payload) => {
          // Fetch user data for the new message
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', payload.new.user_id)
            .single()
          const newMsg = { ...payload.new, users: userData } as Message
          setMessages((prev) => [...prev, newMsg])
          setTimeout(scrollToBottom, 100)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user) return
    setError('')
    setSending(true)

    const content = input.trim()
    setInput('')

    const isBlocked = containsBlockedContent(content)

    try {
      const { error } = await supabase.from('messages').insert({
        user_id: user.id,
        room_id: ROOM_ID,
        content: isBlocked ? '[BLOCKED]' : content,
        moderazione_status: isBlocked ? 'blocked' : 'ok',
      })
      if (error) throw error
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore invio'
      setError(message)
      setInput(content)
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen bg-[#0D0D0D]"
    >
      {/* Header */}
      <div className="border-b border-[#00FF41]/20 px-4 py-3 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
        <span className="font-mono text-xs text-[#00FF41] uppercase tracking-widest">
          CHAT — SALA OPERATIVA
        </span>
        <span className="font-mono text-xs text-gray-600 ml-auto">
          {messages.length} messaggi
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.user_id === user?.id
          const isBlocked = msg.moderazione_status === 'blocked'
          const msgUser = msg.users
          const username = msgUser?.username || 'unknown'

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-xs text-[#00FF41] font-bold">
                  {getInitials(username)}
                </span>
              </div>

              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-gray-400">{username}</span>
                  <span className="font-mono text-[10px] text-gray-600">
                    {formatTime(msg.created_at)}
                  </span>
                </div>
                <div
                  className={`px-3 py-2 rounded text-sm font-mono ${
                    isBlocked
                      ? 'bg-[#FF0033]/10 border border-[#FF0033]/30 text-[#FF0033]'
                      : isMe
                      ? 'bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#E5E5E5]'
                      : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#E5E5E5]'
                  }`}
                >
                  {isBlocked ? '> messaggio non consentito' : msg.content}
                </div>
              </div>
            </motion.div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#00FF41]/20 px-4 py-3">
        {error && (
          <div className="mb-2 font-mono text-xs text-[#FF0033]">{`> ERRORE: ${error}`}</div>
        )}
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <span className="font-mono text-[#00FF41] text-sm hidden sm:block">{`>`}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="messaggio..."
            disabled={sending || !user}
            className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-sm font-mono text-[#E5E5E5] placeholder-gray-600 focus:outline-none focus:border-[#00FF41]/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={sending || !input.trim() || !user}
            className="w-9 h-9 flex items-center justify-center bg-[#00FF41]/10 border border-[#00FF41]/40 rounded text-[#00FF41] hover:bg-[#00FF41]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? (
              <span className="text-xs animate-pulse">...</span>
            ) : (
              <Send size={15} />
            )}
          </button>
        </form>
        {sending && (
          <p className="font-mono text-[10px] text-gray-600 mt-1 ml-6">verifica in corso...</p>
        )}
      </div>
    </motion.div>
  )
}
