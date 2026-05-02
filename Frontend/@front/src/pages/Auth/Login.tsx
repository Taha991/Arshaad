import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { login, register, clearError, oauthLogin } from '../../store/slices/authSlice'
import { AppDispatch, RootState } from '../../store/store'
import { oauthAPI } from '../../services/api/oauth'
import { authAPI } from '../../services/api/auth'
import { useGoogleLogin } from '@react-oauth/google'

// ════════════════════════════════════════════════════════════════════════════
// ICONS COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

function EyeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// PASSWORD STRENGTH CALCULATOR
// ════════════════════════════════════════════════════════════════════════════

function getPasswordStrength(password: string): { score: 0 | 1 | 2 | 3; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'rgba(255,255,255,0.08)' }
  if (password.length < 8) return { score: 1, label: 'Weak', color: '#EF4444' }
  if (password.length < 10) return { score: 2, label: 'Fair', color: '#F59E0B' }
  return { score: 3, label: 'Strong', color: '#22D3EE' }
}

// ═════════════════════════════════════════════════════════���══════════════════
// PASSWORD STRENGTH INDICATOR COMPONENT
// ════════════════════════════════════════════════════════════════════════════

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getPasswordStrength(password)
  if (!password) return null

  return (
    <div className="mt-2 mb-3">
      <div className="flex gap-1 h-1 rounded-full overflow-hidden mb-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="flex-1 rounded-full transition-colors duration-200"
            style={{ backgroundColor: i < strength.score ? strength.color : 'rgba(255,255,255,0.08)' }}
          />
        ))}
      </div>
      {strength.label && (
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Password strength: <span style={{ color: strength.color, fontWeight: '500' }}>{strength.label}</span>
        </p>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// AUTH INPUT COMPONENT
// ════════════════════════════════════════════════════════════════════════════

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  showPasswordToggle?: boolean
  isPassword?: boolean
}

function AuthInput({
  label,
  error,
  showPasswordToggle,
  isPassword,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`
  const type = showPasswordToggle && isPassword
    ? showPassword ? 'text' : 'password'
    : props.type || 'text'

  return (
    <div className="mb-4">
      <div className="relative">
        <input
          {...props}
          id={inputId}
          type={type}
          className="w-full px-4 py-3 rounded-xl text-sm font-normal transition-all duration-200 outline-none placeholder:opacity-80"
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderColor: error ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.12)',
            borderStyle: 'solid',
            borderWidth: '1px',
            color: 'rgba(255,255,255,0.9)',
            caretColor: '#22D3EE',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.6)' : '#22D3EE'
            e.currentTarget.style.boxShadow = error
              ? '0 0 0 3px rgba(239,68,68,0.12)'
              : '0 0 0 3px rgba(34,211,238,0.12)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? 'rgba(239,68,68,0.6)'
              : 'rgba(255,255,255,0.12)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          placeholder={label}
        />
        {/* Password Visibility Toggle */}
        {showPasswordToggle && isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
            style={{
              color: 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)'
            }}
          >
            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs" style={{ color: '#F87171' }}>
          {error}
        </p>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// GOOGLE BUTTON COMPONENT
// ════════��═══════════════════════════════════════════════════════════════════

function GoogleButton({ label, onStart, onError }: {
  label: string
  onStart: () => void
  onError: (msg: string) => void
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      onStart()
      setLoading(true)
      try {
        const authResponse = await oauthAPI.exchangeToken(tokenResponse.access_token, 'google')
        await dispatch(oauthLogin({ authResponse }) as any).unwrap()
      } catch {
        onError('Google sign-in failed. Please try email instead.')
      } finally {
        setLoading(false)
      }
    },
    onError: () => {
      setLoading(false)
      onError('Google sign-in was cancelled or failed.')
    },
  })

  return (
    <button
      type="button"
      onClick={() => handleLogin()}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90"
      style={{ background: '#FFFFFF', color: '#000000', cursor: 'pointer' }}
    >
      {loading ? (
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : <GoogleIcon />}
      <span>{label}</span>
    </button>
  )
}

function DisabledGoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      title="Set VITE_GOOGLE_CLIENT_ID in .env to enable Google sign-in"
      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium cursor-not-allowed"
      style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.13)',
        color: 'rgba(255,255,255,0.5)',
      }}
    >
      <GoogleIcon />
      <span>{label}</span>
    </button>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN AUTH PAGE COMPONENT
// ════════════════════════════════════════════════════════════════════════════

type AuthTab = 'signin' | 'signup' | 'forgot' | 'reset'

export default function AuthPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, error, user } = useSelector((s: RootState) => s.auth)

  const defaultTab: AuthTab = location.search.includes('signup') ? 'signup' : 
                              location.search.includes('reset') ? 'reset' : 'signin'
  const [tab, setTab] = useState<AuthTab>(defaultTab)
  const [googleError, setGoogleError] = useState('')

  const [signIn, setSignIn] = useState({ email: '', password: '', rememberMe: false })
  const [signInErrors, setSignInErrors] = useState({ email: '', password: '' })

  const [signUp, setSignUp] = useState({ name: '', email: '', password: '', password_confirm: '', role: 'student', agreeToTerms: false })
  const [signUpErrors, setSignUpErrors] = useState({ name: '', email: '', password: '', password_confirm: '', agreeToTerms: '' })

  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotMessage, setForgotMessage] = useState({ type: '', text: '' })
  
  const [resetState, setResetState] = useState({ token: '', password: '', password_confirm: '' })
  const [resetErrors, setResetErrors] = useState({ token: '', password: '', password_confirm: '' })
  const [resetMessage, setResetMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.onboarding_completed ? '/dashboard' : '/onboarding')
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => () => { dispatch(clearError()) }, [dispatch])

  const hasGoogle = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

  // Validation
  const validateSignIn = () => {
    const e = { email: '', password: '' }
    let ok = true
    if (!signIn.email) { e.email = 'Email is required'; ok = false }
    else if (!/\S+@\S+\.\S+/.test(signIn.email)) { e.email = 'Invalid email format'; ok = false }
    if (!signIn.password) { e.password = 'Password is required'; ok = false }
    setSignInErrors(e)
    return ok
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateSignIn()) return
    try { await dispatch(login(signIn)).unwrap() } catch { }
  }

  const validateSignUp = () => {
    const e = { name: '', email: '', password: '', password_confirm: '', agreeToTerms: '' }
    let ok = true
    if (!signUp.name.trim()) { e.name = 'Full name is required'; ok = false }
    if (!signUp.email) { e.email = 'Email is required'; ok = false }
    else if (!/\S+@\S+\.\S+/.test(signUp.email)) { e.email = 'Invalid email format'; ok = false }
    if (!signUp.password) { e.password = 'Password is required'; ok = false }
    else if (signUp.password.length < 8) { e.password = 'Minimum 8 characters'; ok = false }
    if (signUp.password !== signUp.password_confirm) { e.password_confirm = "Passwords don't match"; ok = false }
    if (!signUp.agreeToTerms) { e.agreeToTerms = 'You must agree to Terms & Privacy'; ok = false }
    setSignUpErrors(e)
    return ok
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateSignUp()) return
    try { await dispatch(register(signUp)).unwrap() } catch { }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail) { setForgotMessage({ type: 'error', text: 'Email is required' }); return }
    try {
      await authAPI.forgotPassword(forgotEmail)
      setForgotMessage({ type: 'success', text: 'Check your email for the reset code.' })
      setTimeout(() => { setTab('reset'); setForgotMessage({ type: '', text: '' }) }, 2000)
    } catch {
      setForgotMessage({ type: 'error', text: 'Failed to send reset email' })
    }
  }

  const validateReset = () => {
    const e = { token: '', password: '', password_confirm: '' }
    let ok = true
    if (!resetState.token) { e.token = 'Reset code is required'; ok = false }
    if (!resetState.password) { e.password = 'New password is required'; ok = false }
    if (resetState.password !== resetState.password_confirm) { e.password_confirm = "Passwords don't match"; ok = false }
    setResetErrors(e)
    return ok
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateReset()) return
    try {
      await authAPI.resetPassword(resetState.token, resetState.password, resetState.password_confirm)
      setResetMessage({ type: 'success', text: 'Password reset completely! You can now sign in.' })
      setTimeout(() => { setTab('signin'); setResetMessage({ type: '', text: '' }) }, 2000)
    } catch {
      setResetMessage({ type: 'error', text: 'Failed to reset password. Invalid or expired token.' })
    }
  }

  const anyError = error || googleError

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10" style={{ background: '#0B1120' }}>
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors z-20"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Home
      </button>

      {/* Animated Blob Background */}
      <div className="blob w-96 h-96 bg-violet-600 top-[-10%] right-[-5%] animate-blob absolute" style={{ opacity: 0.12 }} />
      <div className="blob w-80 h-80 bg-blue-600 bottom-[-10%] left-[-5%] animate-blob absolute" style={{ opacity: 0.12, animationDelay: '2s' }} />
      <div className="blob w-64 h-64 bg-cyan-500 top-[30%] left-[5%] animate-blob absolute" style={{ opacity: 0.12, animationDelay: '4s' }} />

      {/* Main Container - Glass Morphism */}
      <div
        className="relative z-10 w-full max-w-[420px] rounded-[20px] border p-8"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Logo Section */}
        <h1 className="text-center mb-6 font-extrabold" style={{
          fontSize: '26px',
          background: 'linear-gradient(to right, #60A5FA, #A78BFA, #22D3EE)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {tab === 'signin' ? 'Welcome Back' : 
           tab === 'signup' ? 'Create Account' : 
           tab === 'forgot' ? 'Forgot Password' : 'Reset Password'}
        </h1>

        {/* Tab Switcher */}
        {(tab === 'signin' || tab === 'signup') && (
          <div className="flex gap-0 rounded-xl p-0.5 mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {(['signin', 'signup'] as AuthTab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setGoogleError(''); dispatch(clearError()) }}
                className="flex-1 py-2.5 rounded-[10px] text-center text-sm font-semibold transition-all duration-200 outline-none"
                style={
                  t === tab
                    ? {
                      background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #22D3EE)',
                      color: 'white',}
                    : {
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.4)',
                    }
                }
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
        )}

        {/* Google Button */}
        {(tab === 'signin' || tab === 'signup') && (
          <>
            <div className="mb-4">
              {hasGoogle
                ? <GoogleButton
                  label="Continue with Google"
                  onStart={() => { }}
                  onError={setGoogleError}
                />
                : <DisabledGoogleButton label="Continue with Google" />
              }
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>or email</span>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
          </>
        )}

        {/* Error Banner */}
        {anyError && (
          <div className="flex items-start gap-2 mb-4 px-3.5 py-3 rounded-xl" style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
          }}>
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <span className="text-sm" style={{ color: '#F87171' }}>{anyError}</span>
          </div>
        )}

        {/* ═══ SIGN IN FORM ═══ */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <AuthInput
              label="Email"
              type="email"
              value={signIn.email}
              error={signInErrors.email}
              onChange={e => setSignIn(p => ({ ...p, email: e.target.value }))}
              autoComplete="email"
            />

            <AuthInput
              label="Password"
              type="password"
              isPassword
              showPasswordToggle
              value={signIn.password}
              error={signInErrors.password}
              onChange={e => setSignIn(p => ({ ...p, password: e.target.value }))}
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <input
                  type="checkbox"
                  checked={signIn.rememberMe}
                  onChange={(e) => setSignIn(p => ({ ...p, rememberMe: e.target.checked }))}
                  className="w-3.5 h-3.5 rounded cursor-pointer"
                  style={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    backgroundColor: 'transparent',
                    accentColor: '#22D3EE',
                  }}
                />
                <span>Remember me</span>
              </label>
              <button 
                type="button" 
                onClick={() => { setTab('forgot'); dispatch(clearError()) }}
                className="transition-colors hover:text-cyan-300" 
                style={{ color: '#06B6D4', fontWeight: '500' }}
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 cursor-pointer outline-none hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #22D3EE)',
                opacity: isLoading ? 0.6 : 1,
                marginTop: '4px', }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              No account?{' '}
              <button type="button" onClick={() => setTab('signup')} style={{ color: '#06B6D4', fontWeight: '500' }} className="hover:opacity-80">
                Create one free →
              </button>
            </p>
          </form>
        )}

        {/* ═══ SIGN UP FORM ═══ */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <AuthInput
              label="Full Name"
              type="text"
              value={signUp.name}
              error={signUpErrors.name}
              onChange={e => setSignUp(p => ({ ...p, name: e.target.value }))}
              autoComplete="name"
            />

            <AuthInput
              label="Email"
              type="email"
              value={signUp.email}
              error={signUpErrors.email}
              onChange={e => setSignUp(p => ({ ...p, email: e.target.value }))}
              autoComplete="email"
            />

            <div>
              <AuthInput
                label="Password"
                type="password"
                isPassword
                showPasswordToggle
                value={signUp.password}
                error={signUpErrors.password}
                onChange={e => setSignUp(p => ({ ...p, password: e.target.value }))}
                autoComplete="new-password"
              />
              <PasswordStrengthBar password={signUp.password} />
            </div>

            <AuthInput
              label="Confirm Password"
              type="password"
              isPassword
              showPasswordToggle
              value={signUp.password_confirm}
              error={signUpErrors.password_confirm}
              onChange={e => setSignUp(p => ({ ...p, password_confirm: e.target.value }))}
              autoComplete="new-password"
            />

            {/* Agree to Terms Checkbox */}
            <div className="mb-4">
              <label className="flex items-start gap-2 cursor-pointer" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <input
                  type="checkbox"
                  checked={signUp.agreeToTerms}
                  onChange={e => {
                    setSignUp(p => ({ ...p, agreeToTerms: e.target.checked }))
                    if (signUpErrors.agreeToTerms) setSignUpErrors(p => ({ ...p, agreeToTerms: '' }))
                  }}
                  className="w-4 h-4 rounded cursor-pointer mt-0.5 flex-shrink-0"
                  style={{
                    border: signUpErrors.agreeToTerms ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.3)',
                    backgroundColor: 'transparent',
                    accentColor: '#22D3EE',
                  }}
                />
                <span className="text-xs leading-relaxed">
                  I agree to the{' '}
                  <Link to="/legal/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors" style={{ fontWeight: '500' }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/legal/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors" style={{ fontWeight: '500' }}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {signUpErrors.agreeToTerms && (
                <p className="mt-1.5 text-xs" style={{ color: '#F87171' }}>
                  {signUpErrors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 cursor-pointer outline-none hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #22D3EE)',
                opacity: isLoading ? 0.6 : 1,
                marginTop: '4px', }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Already have an account?{' '}
              <button type="button" onClick={() => setTab('signin')} style={{ color: '#06B6D4', fontWeight: '500' }} className="hover:opacity-80">
                Sign in →
              </button>
            </p>
          </form>
        )}
        {/* ═══ FORGOT PASSWORD FORM ═══ */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            {forgotMessage.text && (
              <div className={`p-3 rounded-xl text-sm ${forgotMessage.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                {forgotMessage.text}
              </div>
            )}
            <AuthInput
              label="Email Address"
              type="email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 cursor-pointer outline-none hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #22D3EE)',
                opacity: isLoading ? 0.6 : 1,
                marginTop: '4px', }}
            >
              Send Reset Code
            </button>
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Remembered your password?{' '}
              <button type="button" onClick={() => setTab('signin')} style={{ color: '#06B6D4', fontWeight: '500' }} className="hover:opacity-80">
                Sign in →
              </button>
            </p>
          </form>
        )}

        {/* ═══ RESET PASSWORD FORM ═══ */}
        {tab === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            {resetMessage.text && (
              <div className={`p-3 rounded-xl text-sm ${resetMessage.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                {resetMessage.text}
              </div>
            )}
            <AuthInput
              label="Reset Token/Code"
              type="text"
              value={resetState.token}
              error={resetErrors.token}
              onChange={e => setResetState(p => ({ ...p, token: e.target.value }))}
            />
            <AuthInput
              label="New Password"
              type="password"
              isPassword
              showPasswordToggle
              value={resetState.password}
              error={resetErrors.password}
              onChange={e => setResetState(p => ({ ...p, password: e.target.value }))}
            />
            <PasswordStrengthBar password={resetState.password} />
            <AuthInput
              label="Confirm New Password"
              type="password"
              isPassword
              showPasswordToggle
              value={resetState.password_confirm}
              error={resetErrors.password_confirm}
              onChange={e => setResetState(p => ({ ...p, password_confirm: e.target.value }))}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 cursor-pointer outline-none hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #22D3EE)',
                opacity: isLoading ? 0.6 : 1,
                marginTop: '4px', }}
            >
              Reset Password
            </button>
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <button type="button" onClick={() => setTab('signin')} style={{ color: '#06B6D4', fontWeight: '500' }} className="hover:opacity-80">
                Back to Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}