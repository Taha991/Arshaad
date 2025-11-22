import { FormEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store'
import { login } from '../store/authSlice'
import { GoogleButton } from '../components/molecules/GoogleButton'

export function Login() {
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector(s => s.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    dispatch(login({ email, password }))
  }


  return (
    <div className="container-xl py-12">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={onSubmit} className="mt-6 max-w-md" aria-describedby="login-help">
        <p id="login-help" className="text-sm text-gray-600">Sign in to access personalized guidance and save your progress.</p>
        <div className="mt-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required className="mt-1 w-full rounded-lg border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1 w-full rounded-lg border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mt-6">
          <button className="btn-primary w-full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
        <div className="mt-3">
          <GoogleButton />
        </div>
        {error && (
          <div role="alert" aria-live="assertive" className="mt-4 text-red-700">{error}</div>
        )}
      </form>
    </div>
  )
}