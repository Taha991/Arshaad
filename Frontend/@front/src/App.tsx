import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { RootState } from './store/store'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Landing from './pages/Landing'
import StudentDashboard from './pages/Dashboard/StudentDashboard'
import OAuthCallback from './pages/Auth/OAuthCallback'
import OnboardingFlow from './pages/Onboarding/OnboardingFlow'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  // Only wrap with GoogleOAuthProvider if client ID is provided
  const appContent = (
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        
        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={isAuthenticated ? <OnboardingFlow /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <StudentDashboard /> : <Navigate to="/login" />}
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  )

  // If Google Client ID is not set, render without OAuth provider
  if (!GOOGLE_CLIENT_ID) {
    return appContent
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {appContent}
    </GoogleOAuthProvider>
  )
}

export default App
