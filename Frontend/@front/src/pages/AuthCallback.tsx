import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '../store/store'
import { setUser } from '../store/authSlice'
import { setAccessToken, setRefreshToken } from '../services/tokenService'
import { meApi } from '../services/authService'

export function AuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const at = params.get('accessToken')
    const rt = params.get('refreshToken')
    if (at) setAccessToken(at)
    if (rt) setRefreshToken(rt)
    ;(async () => {
      try {
        const me = await meApi()
        dispatch(setUser(me))
        navigate('/')
      } catch {
        navigate('/login')
      }
    })()
  }, [params, dispatch, navigate])

  return (
    <div className="container-xl py-12">
      <h1 className="text-2xl font-bold">Signing you in…</h1>
      <p className="mt-4 text-gray-700">Completing authentication.</p>
    </div>
  )
}