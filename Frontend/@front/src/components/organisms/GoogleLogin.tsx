import React, { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../store/store'
import { oauthLogin } from '../../store/slices/authSlice'
import { oauthAPI } from '../../services/api/oauth'
import Button from '../atoms/Button'

interface GoogleLoginProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onSuccess, onError }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  // If Google Client ID is not configured, show a placeholder button
  if (!googleClientId) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className="w-full flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed"
        title="Google login is not configured. Add VITE_GOOGLE_CLIENT_ID to .env file"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>تسجيل الدخول بـ Google</span>
      </Button>
    )
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true)
      try {
        // Exchange Google access token with backend
        const authResponse = await oauthAPI.exchangeToken(tokenResponse.access_token, 'google')
        
        // Update Redux state - this saves user info (name, email, etc.)
        await dispatch(oauthLogin(authResponse)).unwrap()
        
        if (onSuccess) {
          onSuccess()
        } else {
          navigate('/dashboard')
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || 'Google login failed'
        if (onError) {
          onError(errorMessage)
        } else {
          console.error('Google login error:', errorMessage)
          alert(`خطأ في تسجيل الدخول: ${errorMessage}`)
        }
      } finally {
        setIsLoading(false)
      }
    },
    onError: (error) => {
      setIsLoading(false)
      const errorMessage = 'Google login failed. Please try again.'
      if (onError) {
        onError(errorMessage)
      } else {
        console.error('Google OAuth error:', error)
        alert('فشل تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.')
      }
    },
  })

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => handleGoogleLogin()}
      isLoading={isLoading}
      className="w-full flex items-center justify-center space-x-2"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span>تسجيل الدخول بـ Google</span>
    </Button>
  )
}

export default GoogleLogin
