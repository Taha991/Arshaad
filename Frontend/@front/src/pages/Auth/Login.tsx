import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login, clearError } from '../../store/slices/authSlice'
import { AppDispatch, RootState } from '../../store/store'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Input'
import GoogleLogin from '../../components/organisms/GoogleLogin'

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const validate = () => {
    const errors = { email: '', password: '' }
    let isValid = true

    if (!formData.email) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
      isValid = false
    }

    if (!formData.password) {
      errors.password = 'Password is required'
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
      await dispatch(login(formData)).unwrap()
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
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              إنشاء حساب جديد
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
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-900">
                تذكرني
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              تسجيل الدخول
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
                  // Handle error - you can show a toast or set error state
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

export default Login

