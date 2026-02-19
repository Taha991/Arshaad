import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login, clearError } from '@/store/slices/authSlice'
import { AppDispatch, RootState } from '@/store/store'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import GoogleLogin from '@/components/organisms/GoogleLogin'

export default function Login() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, error, user } = useSelector((s: RootState) => s.auth)

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState({ email: '', password: '' })

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.onboarding_completed ? '/dashboard' : '/onboarding')
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => () => { dispatch(clearError()) }, [dispatch])

  const validate = () => {
    const errors = { email: '', password: '' }
    let ok = true
    if (!formData.email) { errors.email = 'Email is required'; ok = false }
    else if (!/S+@S+.S+/.test(formData.email)) { errors.email = 'Invalid email'; ok = false }
    if (!formData.password) { errors.password = 'Password is required'; ok = false }
    setFormErrors(errors)
    return ok
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try { await dispatch(login(formData)).unwrap() } catch { }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name as keyof typeof formErrors]) setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-12">
      <div className="blob w-96 h-96 bg-blue-600 top-[-10%] left-[-5%] animate-blob" />
      <div className="blob w-80 h-80 bg-violet-600 bottom-[-10%] right-[-5%] animate-blob-delayed" />
      <div className="blob w-64 h-64 bg-cyan-500 top-[40%] right-[5%] animate-blob-slow" />
      <div className="glass-card relative z-10 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="gradient-text text-3xl font-bold">Arshaad | ارشاد</h1>
          <p className="text-white/40 mt-1 text-sm">Sign In / تسجيل الدخول</p>
        </div>
        <GoogleLogin onError={(e) => console.error(e)} />
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-sm">or / او</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" labelAr="البريد الالكتروني" type="email" name="email" value={formData.email} onChange={handleChange} error={formErrors.email} placeholder="you@example.com" autoComplete="email" />
          <Input label="Password" labelAr="كلمة المرور" type="password" name="password" value={formData.password} onChange={handleChange} error={formErrors.password} placeholder="••••••••" autoComplete="current-password" />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/50 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-cyan-400" />
              Remember me / تذكرني
            </label>
            <Link to="/forgot-password" className="text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</Link>
          </div>
          <Button type="submit" variant="neon" size="lg" isLoading={isLoading} className="w-full mt-2">
            Sign In / تسجيل الدخول
          </Button>
        </form>
        <p className="text-center text-white/40 text-sm mt-6">
          New here?{' '}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
            Create an account / انشاء حساب
          </Link>
        </p>
      </div>
    </div>
  )
}
