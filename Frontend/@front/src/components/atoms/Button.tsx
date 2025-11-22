import { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

export function Button({ loading, children, className = '', ...rest }: Props) {
  return (
    <button aria-busy={loading} className={`btn-primary ${className}`} {...rest}>
      {children}
    </button>
  )
}