interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'amber' | 'red' | 'gray'
  className?: string
}

export default function Badge({ children, variant = 'green', className = '' }: BadgeProps) {
  const variants = {
    green: 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30',
    amber: 'bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/30',
    red: 'bg-[#FF0033]/10 text-[#FF0033] border-[#FF0033]/30',
    gray: 'bg-gray-800 text-gray-400 border-gray-600',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
