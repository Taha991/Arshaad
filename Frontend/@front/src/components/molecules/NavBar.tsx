import { NavLink } from 'react-router-dom'

export function NavBar() {
  const base = 'text-sm font-medium px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
  const active = 'bg-brand-600 text-white'
  const inactive = 'text-gray-700 hover:bg-gray-100'

  return (
    <nav aria-label="Main navigation" className="flex gap-2">
      <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Home</NavLink>
      <NavLink to="/market" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>See Market</NavLink>
      <NavLink to="/roadmaps" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Our Roadmaps</NavLink>
      <NavLink to="/path" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Know Your Path</NavLink>
      <NavLink to="/login" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Login</NavLink>
    </nav>
  )
}