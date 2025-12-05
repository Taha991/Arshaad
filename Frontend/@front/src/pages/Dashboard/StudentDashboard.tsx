import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { AppDispatch, RootState } from '../../store/store'
import Button from '../../components/atoms/Button'

const StudentDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">أرشاد</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">مرحباً، {user?.name || user?.email}</span>
              <Button variant="outline" onClick={handleLogout}>
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">لوحة التحكم</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-2">My Roadmap</h3>
            <p className="text-gray-600">عرض خطة التعلم الخاصة بك</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-2">Resources Hub</h3>
            <p className="text-gray-600">الموارد التعليمية</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-2">Mentorship</h3>
            <p className="text-gray-600">المنتورينج والمجموعات</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard

