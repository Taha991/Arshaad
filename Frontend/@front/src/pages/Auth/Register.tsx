import { Navigate } from 'react-router-dom'

// Sign-up is handled inside the unified Login/Auth page via ?tab=signup
export default function Register() {
  return <Navigate to="/login?tab=signup" replace />
}
