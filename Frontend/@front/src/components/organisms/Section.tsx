type Props = {
  id?: string
  title: string
  children: React.ReactNode
}

export function Section({ id, title, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section">
      <div className="container-xl">
        <h2 id={`${id}-title`} className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>
        <div className="text-gray-700">
          {children}
        </div>
      </div>
    </section>
  )
}