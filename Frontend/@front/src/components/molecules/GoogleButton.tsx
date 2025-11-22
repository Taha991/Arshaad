import { GoogleLogin } from '@react-oauth/google'
import { useAppDispatch } from '../../store/store'
import { oauthLogin } from '../../store/authSlice'

type Props = {
  className?: string
}

export function GoogleButton({ className = '' }: Props) {
  const dispatch = useAppDispatch()
  return (
    <div className={className}>
      <GoogleLogin
        onSuccess={(cred) => {
          const idToken = cred.credential
          if (idToken) {
            dispatch(oauthLogin({ provider: 'google', idToken }))
          }
        }}
        onError={() => {
          // noop: error surfaced by thunk to UI on failure
        }}
        useOneTap
      />
    </div>
  )
}