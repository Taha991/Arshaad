import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelAr?: string
  error?: string
  helperText?: string
}

const Input: React.FC<InputProps> = ({
  label,
  labelAr,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="w-full">
      {(label || labelAr) && (
        <label htmlFor={inputId} className="block text-sm font-medium text-white/70 mb-1.5">
          {label}
          {labelAr && <span className="text-white/40 ml-1 font-arabic"> / {labelAr}</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-white/5 border text-white
          placeholder:text-white/30
          focus:outline-none focus:ring-0
          transition-all duration-200
          ${error ? 'border-red-500/70 focus:border-red-400' : 'border-white/15 focus:border-cyan-400 focus:shadow-neon-cyan'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-sm text-white/40">{helperText}</p>}
    </div>
  )
}

export default Input
