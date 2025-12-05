import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { AppDispatch, RootState } from '../../store/store'
import Button from '../../components/atoms/Button'
import MyRoadmap from './MyRoadmap'

const StudentDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const [activeTab, setActiveTab] = useState<'roadmap' | 'resources' | 'mentorship'>('roadmap')

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">أرشاد</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  مرحباً، {user?.name || user?.email}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 space-x-reverse">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roadmap'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Roadmap
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resources'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resources Hub
            </button>
            <button
              onClick={() => setActiveTab('mentorship')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mentorship'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mentorship
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main>
        {activeTab === 'roadmap' && <MyRoadmap />}
        {activeTab === 'resources' && (
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources Hub</h2>
            <p className="text-gray-600">الموارد التعليمية - قريباً</p>
          </div>
        )}
        {activeTab === 'mentorship' && (
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mentorship</h2>
            <p className="text-gray-600">المنتورينج والمجموعات - قريباً</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentDashboard

