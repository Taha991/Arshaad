import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { register, clearError } from '../../store/slices/authSlice'
import { AppDispatch, RootState } from '../../store/store'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Input'
import GoogleLogin from '../../components/organisms/GoogleLogin'

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, error, user } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    name: '',
  })

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    password_confirm: '',
    name: '',
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      // New users should go through onboarding
      if (!user.onboarding_completed) {
        navigate('/onboarding')
      } else {
        navigate('/dashboard')
      }
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const validate = () => {
    const errors = { email: '', password: '', password_confirm: '', name: '' }
    let isValid = true

    if (!formData.name.trim()) {
      errors.name = 'الاسم مطلوب'
      isValid = false
    }

    if (!formData.email) {
      errors.email = 'البريد الإلكتروني مطلوب'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح'
      isValid = false
    }

    if (!formData.password) {
      errors.password = 'كلمة المرور مطلوبة'
      isValid = false
    } else if (formData.password.length < 8) {
      errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
      isValid = false
    }

    if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'كلمات المرور غير متطابقة'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    try {
      await dispatch(register(formData)).unwrap()
      navigate('/dashboard')
    } catch (err) {
      // Error is handled by Redux
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              تسجيل الدخول
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="الاسم"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              placeholder="أدخل اسمك"
              required
              autoComplete="name"
            />

            <Input
              label="البريد الإلكتروني"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              placeholder="example@email.com"
              required
              autoComplete="email"
            />

            <Input
              label="كلمة المرور"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            <Input
              label="تأكيد كلمة المرور"
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              error={formErrors.password_confirm}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              إنشاء حساب
            </Button>
          </div>

          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">أو</span>
              </div>
            </div>
            <div className="mt-4">
              <GoogleLogin
                onError={(error) => {
                  console.error('Google login error:', error)
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register

