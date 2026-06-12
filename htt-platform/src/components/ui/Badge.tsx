interface BadgeProps {
  rank?: number
  role?: 'viewer' | 'trader' | 'admin'
  winRate?: number
  className?: string
}

export default function Badge({ rank, role, winRate, className = '' }: BadgeProps) {
  if (rank !== undefined) {
    const colors: Record<number, string> = {
      1: 'bg-yellow-500/20 border-yellow-400 text-yellow-400',
      2: 'bg-gray-400/20 border-gray-300 text-gray-300',
      3: 'bg-orange-600/20 border-orange-400 text-orange-400',
    }
    const color = colors[rank] || 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]'
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded border font-mono text-xs font-bold ${color} ${className}`}>
        #{rank}
      </span>
    )
  }

  if (role) {
    const roleMap = {
      admin: { color: 'bg-[#FFB800]/20 border-[#FFB800]/60 text-[#FFB800]', label: 'ADMIN' },
      trader: { color: 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]', label: 'TRADER' },
      viewer: { color: 'bg-gray-800 border-gray-600 text-gray-400', label: 'VIEWER' },
    }
    const { color, label } = roleMap[role]
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded border font-mono text-xs font-bold ${color} ${className}`}>
        {label}
      </span>
    )
  }

  if (winRate !== undefined) {
    const color =
      winRate >= 70
        ? 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]'
        : winRate >= 55
        ? 'bg-[#FFB800]/10 border-[#FFB800]/40 text-[#FFB800]'
        : 'bg-[#FF0033]/10 border-[#FF0033]/40 text-[#FF0033]'
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded border font-mono text-xs ${color} ${className}`}>
        {winRate.toFixed(1)}%
      </span>
    )
  }

  return null
}
