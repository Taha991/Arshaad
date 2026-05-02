import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authAPI } from '@/services/api/auth'
import Button from '@/components/atoms/Button'

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

interface DarkInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  showToggle?: boolean
}

function DarkInput({ label, error, showToggle, ...props }: DarkInputProps) {
  const [show, setShow] = useState(false)
  const type = showToggle ? (show ? 'text' : 'password') : props.type

  return (
    <div className="mb-4">
      <div className="relative">
        <input
          {...props}
          type={type}
          placeholder={label}
          className={[
            'w-full px-5 py-4 pr-12 rounded-lg text-white text-sm',
            'bg-white/10 border transition-all duration-200',
            'placeholder:text-white/30 outline-none',
            error
              ? 'border-red-500/60 focus:border-red-400'
              : 'border-white/15 focus:border-cyan-400/40',
            props.className ?? '',
          ].join(' ')}
          style={{ 
            caretColor: '#06B6D4', 
            WebkitTextFillColor: 'rgba(255,255,255,0.8)',
            fontFamily: 'Inter',
          }}
        />
        {showToggle && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80"
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-400" style={{ fontFamily: 'Inter' }}>{error}</p>}
    </div>
  )
}

type Mode = 'forgot' | 'reset' | 'verify'

export default function PasswordRecovery() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<Mode>('forgot')
  
  // Forgot password state
  const [email, setEmail] = useState('')
  
  // Reset password state
  const [resetData, setResetData] = useState({ password: '', password_confirm: '' })
  const [resetErrors, setResetErrors] = useState({ password: '', password_confirm: '' })
  
  // Shared state
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const token = searchParams.get('token')
  const type = searchParams.get('type') || 'forgot'

  const handleVerifyEmail = async (verifyToken: string) => {
    try {
      const response = await authAPI.verifyEmail(verifyToken)
      setSuccess(response.detail || 'تم التحقق من بريدك الإلكتروني بنجاح')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.token?.[0] || 'فشل التحقق من البريد الإلكتروني')
    } finally {
      setIsLoading(false)
    }
  }

  const validateForgotPassword = () => {
    let ok = true
    if (!email) {
      setError('البريد الإلكتروني مطلوب')
      ok = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('البريد الإلكتروني غير صحيح')
      ok = false
    }
    return ok
  }

  const validateResetPassword = () => {
    const e = { password: '', password_confirm: '' }
    let ok = true
    
    if (!resetData.password) {
      e.password = 'كلمة المرور مطلوبة'
      ok = false
    } else if (resetData.password.length < 8) {
      e.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
      ok = false
    }
    
    if (!resetData.password_confirm) {
      e.password_confirm = 'تأكيد كلمة المرور مطلوب'
      ok = false
    } else if (resetData.password !== resetData.password_confirm) {
      e.password_confirm = 'كلمات المرور لا تتطابق'
      ok = false
    }
    
    setResetErrors(e)
    return ok
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForgotPassword()) return

    setIsLoading(true)
    try {
      const response = await authAPI.forgotPassword(email)
      setSuccess(response.detail || 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني')
      setEmail('')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'حدث خطأ. حاول مجددا')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('رابط غير صحيح أو منتهي')
      return
    }

    if (!validateResetPassword()) return

    setIsLoading(true)
    try {
      const response = await authAPI.resetPassword(token, resetData.password, resetData.password_confirm)
      setSuccess(response.detail || 'تم تحديث كلمة المرور بنجاح')
      setResetData({ password: '', password_confirm: '' })
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.token?.[0] || 'حدث خطأ. حاول مجددا')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Determine mode based on URL type parameter
    if (type === 'verify' && token) {
      setMode('verify')
      setIsLoading(true)
      handleVerifyEmail(token)
    } else if (type === 'reset' && token) {
      setMode('reset')
    } else {
      setMode('forgot')
    }
  }, [type, token])

  const renderTitle = () => {
    switch (mode) {
      case 'verify':
        return { en: 'Verify Email', ar: 'التحقق من البريد الإلكتروني' }
      case 'reset':
        return { en: 'Reset Password', ar: 'إعادة تعيين كلمة المرور' }
      default:
        return { en: 'Forgot Password', ar: 'هل نسيت كلمة المرور' }
    }
  }

  const title = renderTitle()

  // Check if token is missing for reset and verify
  if ((mode === 'reset' || mode === 'verify') && !token) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10" style={{ background: '#0B1120' }}>
        <div className="blob w-96 h-96 bg-violet-600 top-[-10%] right-[-5%] animate-blob" style={{ opacity: 0.12 }} />
        <div className="blob w-80 h-80 bg-blue-600 bottom-[-10%] left-[-5%] animate-blob-delayed" style={{ opacity: 0.12 }} />
        
        <div
          className="relative z-10 w-full max-w-[400px] rounded-2xl border border-white/10 p-8 text-center"
          style={{ 
            background: 'rgba(17, 24, 39, 0.5)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <p className="text-white mb-4">رابط غير صحيح أو منتهي</p>
          <Button onClick={() => navigate('/login')} variant="neon" size="lg" className="w-full">
            العودة للدخول
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10" style={{ background: '#0B1120' }}>
      {/* Back button */}
      <button 
        onClick={() => navigate('/login')}
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors z-20"
        style={{ fontFamily: 'Inter' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Login
      </button>

      {/* Glows */}
      <div className="blob w-96 h-96 bg-violet-600 top-[-10%] right-[-5%] animate-blob" style={{ opacity: 0.12 }} />
      <div className="blob w-80 h-80 bg-blue-600 bottom-[-10%] left-[-5%] animate-blob-delayed" style={{ opacity: 0.12 }} />
      <div className="blob w-64 h-64 bg-cyan-500 top-[30%] left-[5%] animate-blob-slow" style={{ opacity: 0.12 }} />
      
      <div
        className="relative z-10 w-full max-w-[400px] rounded-2xl border border-white/10 p-8"
        style={{ 
          background: 'rgba(17, 24, 39, 0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        {/* Title */}
        <h1 style={{ fontFamily: 'Inter', fontSize: '28px', fontWeight: '700' }} className="text-center mb-2 text-white">
          {title.en}
        </h1>
        <p className="text-center text-white/50 text-sm mb-6" style={{ fontFamily: 'Inter' }}>
          {mode === 'verify' ? 'جارٍ التحقق من بريدك...' : title.ar}
        </p>

        {/* Success message */}
        {success && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-green-500/20 border border-green-500/30 text-green-400">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 flex items-start gap-2 px-4 py-3 rounded-lg text-sm bg-red-500/20 border border-red-500/30">
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <span style={{ color: '#F87171', fontFamily: 'Inter' }}>{error}</span>
          </div>
        )}

        {/* Loading spinner for verify */}
        {mode === 'verify' && isLoading && (
          <div className="flex justify-center mb-4">
            <svg className="animate-spin w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {/* Forgot Password Form */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPasswordSubmit}>
            <DarkInput
              label="البريد الإلكتروني"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
            />
            <Button 
              type="submit" 
              variant="neon" 
              size="lg" 
              isLoading={isLoading} 
              className="w-full mt-6"
            >
              إرسال رابط الاستعادة
            </Button>
          </form>
        )}

        {/* Reset Password Form */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPasswordSubmit}>
            <DarkInput
              label="كلمة المرور الجديدة"
              showToggle
              type="password"
              name="password"
              value={resetData.password}
              error={resetErrors.password}
              onChange={(e) => {
                setResetData(p => ({ ...p, password: e.target.value }))
                if (resetErrors.password) setResetErrors(p => ({ ...p, password: '' }))
                setError('')
              }}
            />
            <DarkInput
              label="تأكيد كلمة المرور"
              showToggle
              type="password"
              name="password_confirm"
              value={resetData.password_confirm}
              error={resetErrors.password_confirm}
              onChange={(e) => {
                setResetData(p => ({ ...p, password_confirm: e.target.value }))
                if (resetErrors.password_confirm) setResetErrors(p => ({ ...p, password_confirm: '' }))
                setError('')
              }}
            />
            <Button 
              type="submit" 
              variant="neon" 
              size="lg" 
              isLoading={isLoading} 
              className="w-full mt-6"
            >
              تحديث كلمة المرور
            </Button>
          </form>
        )}

        {/* Back to login link */}
        {mode !== 'verify' && (
          <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter', fontWeight: '400' }}>
            <button 
              type="button" 
              onClick={() => navigate('/login')} 
              style={{ color: '#06B6D4', fontFamily: 'Inter', fontWeight: '600' }} 
              className="hover:opacity-80"
            >
              العودة للدخول →
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
