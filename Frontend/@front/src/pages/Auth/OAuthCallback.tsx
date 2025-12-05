import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { oauthLogin } from '../../store/slices/authSlice'
import { oauthAPI } from '../../services/api/oauth'

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      console.error('OAuth error:', error)
      navigate('/login?error=oauth_failed')
      return
    }

    if (code) {
      handleOAuthCallback(code)
    } else {
      navigate('/login')
    }
  }, [searchParams, navigate, dispatch])

  const handleOAuthCallback = async (code: string) => {
    try {
      const authResponse = await oauthAPI.handleOAuthCallback(code, 'google')
      
      // Update Redux state
      await dispatch(oauthLogin(authResponse)).unwrap()
      
      navigate('/dashboard')
    } catch (error: any) {
      console.error('OAuth callback error:', error)
      navigate('/login?error=oauth_failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">جارٍ تسجيل الدخول...</p>
      </div>
    </div>
  )
}

export default OAuthCallback

