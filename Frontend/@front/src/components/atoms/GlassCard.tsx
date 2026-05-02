import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  neonBorder?: boolean
  onClick?: () => void
  padding?: boolean
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
  neonBorder = false,
  onClick,
  padding = true,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        hover ? 'glass-card-hover' : 'glass-card',
        neonBorder ? 'neon-border' : '',
        padding ? 'p-6' : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  )
}
