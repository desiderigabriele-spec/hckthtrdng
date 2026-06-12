import type { ReactNode, MouseEventHandler } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: boolean
  amber?: boolean
  red?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

export default function Card({ children, className = '', glow = false, amber = false, red = false, onClick }: CardProps) {
  let borderClass = 'border-[#00FF41]/20'
  let shadowClass = ''

  if (glow) {
    borderClass = 'border-[#00FF41]/60'
    shadowClass = 'shadow-[0_0_15px_rgba(0,255,65,0.2)]'
  }
  if (amber) {
    borderClass = 'border-[#FFB800]/40'
    shadowClass = 'shadow-[0_0_15px_rgba(255,184,0,0.2)]'
  }
  if (red) {
    borderClass = 'border-[#FF0033]/40'
    shadowClass = 'shadow-[0_0_15px_rgba(255,0,51,0.2)]'
  }

  return (
    <div
      className={`bg-[#0D0D0D] border rounded-lg ${borderClass} ${shadowClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
