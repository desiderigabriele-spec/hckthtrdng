import { NavLink } from 'react-router-dom'
import { MessageSquare, Swords, Trophy, Radio, User } from 'lucide-react'

const navItems = [
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/sfide', icon: Swords, label: 'Sfide' },
  { to: '/classifica', icon: Trophy, label: 'Rank' },
  { to: '/segnali', icon: Radio, label: 'Segnali' },
  { to: '/profilo', icon: User, label: 'Profilo' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0D0D0D] border-t border-[#00FF41]/20">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 transition-all ${
                isActive ? 'text-[#00FF41]' : 'text-gray-500'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-mono">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
