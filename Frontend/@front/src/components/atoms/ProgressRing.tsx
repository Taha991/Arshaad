import { useId } from 'react'

interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  color?: 'cyan' | 'blue' | 'violet' | 'gradient'
  label?: string
  showPercent?: boolean
  className?: string
}

const colorMap = {
  cyan:   '#22D3EE',
  blue:   '#3B82F6',
  violet: '#8B5CF6',
}

export default function ProgressRing({
  percent,
  size = 80,
  strokeWidth = 6,
  color = 'gradient',
  label,
  showPercent = true,
  className = '',
}: ProgressRingProps) {
  const gradientId = useId()
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(percent, 100) / 100)

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {color === 'gradient' && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#3B82F6" />
              <stop offset="50%"  stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        )}
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color === 'gradient' ? `url(#${gradientId})` : colorMap[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.7s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {showPercent && (
          <span className="text-white font-bold" style={{ fontSize: size * 0.18 }}>
            {Math.round(percent)}%
          </span>
        )}
        {label && (
          <span className="text-white/50" style={{ fontSize: size * 0.13, lineHeight: 1.2 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
