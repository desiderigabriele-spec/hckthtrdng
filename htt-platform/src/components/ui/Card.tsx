import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: boolean
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', glow = false, hover = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.01 } : undefined}
      onClick={onClick}
      className={`
        bg-[#0D0D0D] border border-[#00FF41]/20 rounded-lg p-4
        ${glow ? 'shadow-[0_0_15px_rgba(0,255,65,0.2)]' : ''}
        ${hover ? 'cursor-pointer hover:border-[#00FF41]/50 transition-all' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
