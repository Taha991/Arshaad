type Props = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
}

export function Heading({ level = 2, children, className = '' }: Props) {
  const Tag = (`h${level}` as unknown) as keyof JSX.IntrinsicElements
  return <Tag className={`font-semibold text-gray-900 ${className}`}>{children}</Tag>
}