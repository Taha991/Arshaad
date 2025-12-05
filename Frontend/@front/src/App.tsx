import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Landing from './pages/Landing'
import StudentDashboard from './pages/Dashboard/StudentDashboard'

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <StudentDashboard /> : <Navigate to="/login" />}
      />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App

