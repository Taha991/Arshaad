import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { register, clearError } from '@/store/slices/authSlice'
import { AppDispatch, RootState } from '@/store/store'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import GoogleLogin from '@/components/organisms/GoogleLogin'

export default function Register() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, error, user } = useSelector((s: RootState) => s.auth)

  const [formData, setFormData] = useState({ email: '', password: '', password_confirm: '', name: '' })
  const [formErrors, setFormErrors] = useState({ email: '', password: '', password_confirm: '', name: '' })

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.onboarding_completed ? '/dashboard' : '/onboarding')
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => () => { dispatch(clearError()) }, [dispatch])

  const validate = () => {
    const errors = { email: '', password: '', password_confirm: '', name: '' }
    let ok = true
    if (!formData.name.trim()) { errors.name = 'Name is required'; ok = false }
    if (!formData.email) { errors.email = 'Email is required'; ok = false }
    else if (!/S+@S+.S+/.test(formData.email)) { errors.email = 'Invalid email'; ok = false }
    if (!formData.password) { errors.password = 'Password is required'; ok = false }
    else if (formData.password.length < 8) { errors.password = 'Min 8 characters'; ok = false }
    if (formData.password !== formData.password_confirm) { errors.password_confirm = 'Passwords do not match'; ok = false }
    setFormErrors(errors)
    return ok
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try { await dispatch(register(formData)).unwrap() } catch { }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name as keyof typeof formErrors]) setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-12">
      <div className="blob w-96 h-96 bg-violet-600 top-[-10%] right-[-5%] animate-blob" />
      <div className="blob w-80 h-80 bg-blue-600 bottom-[-10%] left-[-5%] animate-blob-delayed" />
      <div className="blob w-64 h-64 bg-cyan-500 top-[30%] left-[5%] animate-blob-slow" />
      <div className="glass-card relative z-10 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="gradient-text text-3xl font-bold">Arshaad | ارشاد</h1>
          <p className="text-white/40 mt-1 text-sm">Create Account / انشاء حساب</p>
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
          <Input label="Full Name" labelAr="الاسم الكامل" type="text" name="name" value={formData.name} onChange={handleChange} error={formErrors.name} placeholder="Ahmed Hassan" autoComplete="name" />
          <Input label="Email" labelAr="البريد الالكتروني" type="email" name="email" value={formData.email} onChange={handleChange} error={formErrors.email} placeholder="you@example.com" autoComplete="email" />
          <Input label="Password" labelAr="كلمة المرور" type="password" name="password" value={formData.password} onChange={handleChange} error={formErrors.password} placeholder="Min 8 characters" autoComplete="new-password" />
          <Input label="Confirm Password" labelAr="تاكيد كلمة المرور" type="password" name="password_confirm" value={formData.password_confirm} onChange={handleChange} error={formErrors.password_confirm} placeholder="••••••••" autoComplete="new-password" />
          <Button type="submit" variant="neon" size="lg" isLoading={isLoading} className="w-full mt-2">
            Create Account / انشاء حساب
          </Button>
        </form>
        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
            Sign In / تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  )
}
