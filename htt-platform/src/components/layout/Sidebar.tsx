import { NavLink } from 'react-router-dom'
import { MessageSquare, Swords, Trophy, Radio, User, Shield, Zap } from 'lucide-react'

const navItems = [
  { to: '/chat', icon: MessageSquare, label: 'CHAT' },
  { to: '/sfide', icon: Swords, label: 'SFIDE' },
  { to: '/classifica', icon: Trophy, label: 'CLASSIFICA' },
  { to: '/segnali', icon: Radio, label: 'SEGNALI' },
  { to: '/profilo', icon: User, label: 'PROFILO' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0D0D0D] border-r border-[#00FF41]/20 z-50">
      <div className="p-6 border-b border-[#00FF41]/20">
        <div className="flex items-center gap-2">
          <Zap className="text-[#00FF41]" size={24} />
          <div>
            <h1 className="font-anton text-[#00FF41] text-lg leading-tight glow-green-text">HACK_THE</h1>
            <h1 className="font-anton text-[#00FF41] text-lg leading-tight glow-green-text">TRADING</h1>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-1 font-mono">v2.0.1 — SISTEMA ATTIVO</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded border transition-all font-mono text-sm ${
                isActive
                  ? 'border-[#00FF41]/50 bg-[#00FF41]/10 text-[#00FF41] glow-green'
                  : 'border-transparent text-gray-400 hover:text-[#00FF41] hover:border-[#00FF41]/20'
              }`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded border transition-all font-mono text-sm ${
              isActive
                ? 'border-[#FFB800]/50 bg-[#FFB800]/10 text-[#FFB800]'
                : 'border-transparent text-gray-600 hover:text-[#FFB800] hover:border-[#FFB800]/20'
            }`
          }
        >
          <Shield size={16} />
          <span>ADMIN</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-[#00FF41]/20">
        <div className="text-[10px] font-mono text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            <span>MERCATI ONLINE</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
