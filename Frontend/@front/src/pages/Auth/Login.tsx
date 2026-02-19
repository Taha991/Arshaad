import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { login, register, clearError, oauthLogin } from '../../store/slices/authSlice'
import { AppDispatch, RootState } from '../../store/store'
import { oauthAPI } from '../../services/api/oauth'
import { useGoogleLogin } from '@react-oauth/google'

// ── Google button — must live inside GoogleOAuthProvider ──────────
// This component is only rendered when VITE_GOOGLE_CLIENT_ID is set,
// which is also when App.tsx wraps the tree with GoogleOAuthProvider.
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
        await dispatch(oauthLogin(authResponse) as any).unwrap()
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
      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', color: 'white', cursor: 'pointer' }}
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
      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', cursor: 'not-allowed' }}
    >
      <GoogleIcon />
      <span>{label}</span>
      <span className="ml-auto text-xs text-white/20">Not configured</span>
    </button>
  )
}

// ── Eye icons ────────────────────────────────────────────────────
function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

// ── Google SVG ────────────────────────────────────────────────────
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

// ── Dark glass input with show/hide for password ─────────────────
interface DarkInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  labelAr: string
  error?: string
  showToggle?: boolean
}

function DarkInput({ label, labelAr, error, showToggle, ...props }: DarkInputProps) {
  const [show, setShow] = useState(false)
  const inputId = `inp-${label.toLowerCase().replace(/\s/g, '-')}`
  const type = showToggle ? (show ? 'text' : 'password') : props.type

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-white/70 mb-1.5">
        {label} <span className="text-white/35 font-arabic">/ {labelAr}</span>
      </label>
      <div className="relative">
        <input
          {...props}
          id={inputId}
          type={type}
          className={[
            'w-full px-4 py-3 pr-11 rounded-xl text-white text-sm',
            'bg-white/8 border transition-all duration-200',
            'placeholder:text-white/25 outline-none',
            error
              ? 'border-red-500/60 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
              : 'border-white/12 focus:border-cyan-400 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12)]',
            props.className ?? '',
          ].join(' ')}
          style={{ caretColor: '#22D3EE', WebkitTextFillColor: 'white', background: 'rgba(255,255,255,0.06)' }}
        />
        {showToggle && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ── Main Auth Page ────────────────────────────────────────────────
type AuthTab = 'signin' | 'signup'

export default function AuthPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, error, user } = useSelector((s: RootState) => s.auth)

  // Read ?tab=signup from URL (Register.tsx redirects here)
  const defaultTab: AuthTab = location.search.includes('signup') ? 'signup' : 'signin'
  const [tab, setTab] = useState<AuthTab>(defaultTab)
  const [googleError, setGoogleError] = useState('')

  // Sign-in state
  const [signIn, setSignIn] = useState({ email: '', password: '' })
  const [signInErrors, setSignInErrors] = useState({ email: '', password: '' })

  // Sign-up state
  const [signUp, setSignUp] = useState({ name: '', email: '', password: '', password_confirm: '' })
  const [signUpErrors, setSignUpErrors] = useState({ name: '', email: '', password: '', password_confirm: '' })

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.onboarding_completed ? '/dashboard' : '/onboarding')
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => () => { dispatch(clearError()) }, [dispatch])

  const hasGoogle = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

  // ── Sign-in submit ──────────────────────────────────────────────
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

  // ── Sign-up submit ──────────────────────────────────────────────
  const validateSignUp = () => {
    const e = { name: '', email: '', password: '', password_confirm: '' }
    let ok = true
    if (!signUp.name.trim()) { e.name = 'Full name is required'; ok = false }
    if (!signUp.email) { e.email = 'Email is required'; ok = false }
    else if (!/\S+@\S+\.\S+/.test(signUp.email)) { e.email = 'Invalid email format'; ok = false }
    if (!signUp.password) { e.password = 'Password is required'; ok = false }
    else if (signUp.password.length < 8) { e.password = 'Minimum 8 characters'; ok = false }
    if (signUp.password !== signUp.password_confirm) { e.password_confirm = "Passwords don't match"; ok = false }
    setSignUpErrors(e)
    return ok
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateSignUp()) return
    try { await dispatch(register(signUp)).unwrap() } catch { }
  }

  const anyError = error || googleError

  return (
    <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Animated blobs */}
      <div className="blob w-[450px] h-[450px] bg-blue-700 top-[-15%] left-[-10%] animate-blob" />
      <div className="blob w-[380px] h-[380px] bg-violet-700 bottom-[-15%] right-[-10%] animate-blob-delayed" />
      <div className="blob w-[280px] h-[280px] bg-cyan-600 top-[50%] right-[5%] animate-blob-slow" />

      <div
        className="relative z-10 w-full max-w-[420px] animate-slide-up"
        style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '1.25rem', padding: '2rem' }}
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-1">
            <span
              className="text-2xl font-extrabold"
              style={{ background: 'linear-gradient(to right, #60A5FA, #A78BFA, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Arshaad
            </span>
            <span className="text-white/30 text-xl">|</span>
            <span
              className="text-2xl font-extrabold font-arabic"
              style={{ background: 'linear-gradient(to right, #60A5FA, #A78BFA, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              أرشاد
            </span>
          </div>
          <p className="text-white/35 text-xs">Career guidance for MENA CS students</p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl p-0.5 mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {(['signin', 'signup'] as AuthTab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); dispatch(clearError()) }}
              className="flex-1 py-2.5 rounded-[10px] text-sm font-semibold transition-all duration-200"
              style={tab === t
                ? { background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #22D3EE)', color: 'white', boxShadow: '0 2px 12px rgba(34,211,238,0.25)' }
                : { color: 'rgba(255,255,255,0.4)', background: 'transparent' }
              }
            >
              {t === 'signin' ? 'Sign In / دخول' : 'Sign Up / تسجيل'}
            </button>
          ))}
        </div>

        {/* Google button — always shown at top */}
        <div className="mb-4">
          {hasGoogle
            ? <GoogleButton
                label={tab === 'signin' ? 'Continue with Google' : 'Sign up with Google'}
                onStart={() => {}}
                onError={setGoogleError}
              />
            : <DisabledGoogleButton
                label={tab === 'signin' ? 'Continue with Google' : 'Sign up with Google'}
              />
          }
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>or continue with email</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Error banner */}
        {anyError && (
          <div className="mb-4 flex items-start gap-2 px-3.5 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}>
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <span>{anyError}</span>
          </div>
        )}

        {/* ── Sign In form ── */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <DarkInput
              label="Email"
              labelAr="البريد الإلكتروني"
              type="email"
              name="email"
              value={signIn.email}
              placeholder="you@example.com"
              autoComplete="email"
              error={signInErrors.email}
              onChange={e => setSignIn(p => ({ ...p, email: e.target.value }))}
            />
            <DarkInput
              label="Password"
              labelAr="كلمة المرور"
              showToggle
              name="password"
              value={signIn.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={signInErrors.password}
              onChange={e => setSignIn(p => ({ ...p, password: e.target.value }))}
            />

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <input type="checkbox" className="w-3.5 h-3.5 accent-cyan-400 rounded" />
                Remember me
              </label>
              <button type="button" className="transition-colors" style={{ color: '#22D3EE' }}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 mt-1 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #22D3EE)', boxShadow: '0 0 20px rgba(34,211,238,0.25)' }}
            >
              {isLoading
                ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in…</span>
                : 'Sign In / تسجيل الدخول'
              }
            </button>

            <p className="text-center text-xs pt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              No account?{' '}
              <button type="button" onClick={() => setTab('signup')} style={{ color: '#22D3EE' }} className="font-semibold">
                Create one free →
              </button>
            </p>
          </form>
        )}

        {/* ── Sign Up form ── */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <DarkInput
              label="Full Name"
              labelAr="الاسم الكامل"
              type="text"
              name="name"
              value={signUp.name}
              placeholder="Ahmed Hassan"
              autoComplete="name"
              error={signUpErrors.name}
              onChange={e => setSignUp(p => ({ ...p, name: e.target.value }))}
            />
            <DarkInput
              label="Email"
              labelAr="البريد الإلكتروني"
              type="email"
              name="email"
              value={signUp.email}
              placeholder="you@example.com"
              autoComplete="email"
              error={signUpErrors.email}
              onChange={e => setSignUp(p => ({ ...p, email: e.target.value }))}
            />
            <DarkInput
              label="Password"
              labelAr="كلمة المرور"
              showToggle
              name="password"
              value={signUp.password}
              placeholder="Min 8 characters"
              autoComplete="new-password"
              error={signUpErrors.password}
              onChange={e => setSignUp(p => ({ ...p, password: e.target.value }))}
            />
            <DarkInput
              label="Confirm Password"
              labelAr="تأكيد كلمة المرور"
              showToggle
              name="password_confirm"
              value={signUp.password_confirm}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              error={signUpErrors.password_confirm}
              onChange={e => setSignUp(p => ({ ...p, password_confirm: e.target.value }))}
            />

            {/* Password strength hint */}
            {signUp.password && (
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => {
                  const strength = signUp.password.length >= 12 ? 4 : signUp.password.length >= 10 ? 3 : signUp.password.length >= 8 ? 2 : 1
                  return (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all"
                      style={{
                        background: i < strength
                          ? strength >= 3 ? '#22D3EE' : strength === 2 ? '#F59E0B' : '#EF4444'
                          : 'rgba(255,255,255,0.08)'
                      }}
                    />
                  )
                })}
                <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {signUp.password.length >= 12 ? 'Strong' : signUp.password.length >= 8 ? 'Fair' : 'Weak'}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #22D3EE)', boxShadow: '0 0 20px rgba(34,211,238,0.25)' }}
            >
              {isLoading
                ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating account…</span>
                : 'Create Account / إنشاء حساب'
              }
            </button>

            <p className="text-center text-xs pt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Already have an account?{' '}
              <button type="button" onClick={() => setTab('signin')} style={{ color: '#22D3EE' }} className="font-semibold">
                Sign in →
              </button>
            </p>
          </form>
        )}

        {/* Terms */}
        <p className="text-center text-xs mt-5" style={{ color: 'rgba(255,255,255,0.2)' }}>
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}
