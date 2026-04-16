import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { RootState } from '@/store/store'
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import Landing from '@/pages/Landing'
import StudentDashboard from '@/pages/Dashboard/StudentDashboard'
import OAuthCallback from '@/pages/Auth/OAuthCallback'
import OnboardingFlow from '@/pages/Onboarding/OnboardingFlow'
import Terms from '@/pages/Legal/Terms'
import Privacy from '@/pages/Legal/Privacy'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const appContent = (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      
      {/* Test routes - for development only */}
      <Route path="/onboarding-test" element={<OnboardingFlow />} />
      <Route path="/dashboard-test" element={<StudentDashboard />} />
      <Route path="/dashboard-test/:tab" element={<StudentDashboard />} />

      {/* Protected routes */}
      <Route
        path="/onboarding"
        element={isAuthenticated ? <OnboardingFlow /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <StudentDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard/:tab"
        element={isAuthenticated ? <StudentDashboard /> : <Navigate to="/login" />}
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )

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
