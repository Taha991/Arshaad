import { NavBar } from '../molecules/NavBar'

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container-xl flex items-center justify-between py-4" role="banner">
        <a href="/" className="text-lg font-bold text-brand-700">Know Your Path</a>
        <NavBar />
      </div>
    </header>
  )
}