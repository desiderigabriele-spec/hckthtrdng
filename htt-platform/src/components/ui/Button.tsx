import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-mono font-semibold uppercase tracking-widest transition-all duration-200 rounded border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  }

  const variants = {
    primary:
      'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41]/20 hover:shadow-[0_0_20px_rgba(0,255,65,0.5)]',
    secondary:
      'bg-[#FFB800]/10 border-[#FFB800] text-[#FFB800] hover:bg-[#FFB800]/20 hover:shadow-[0_0_20px_rgba(255,184,0,0.5)]',
    danger:
      'bg-[#FF0033]/10 border-[#FF0033] text-[#FF0033] hover:bg-[#FF0033]/20 hover:shadow-[0_0_20px_rgba(255,0,51,0.5)]',
    ghost:
      'bg-transparent border-[#2A2A2A] text-gray-400 hover:border-[#00FF41]/40 hover:text-[#00FF41]',
  }

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className="inline-flex"
    >
      <button
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="animate-pulse">{'>'}</span>
            <span className="animate-pulse">...</span>
          </>
        ) : (
          children
        )}
      </button>
    </motion.div>
  )
}
