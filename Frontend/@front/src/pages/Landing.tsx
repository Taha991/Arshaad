import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/atoms/Button'

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">أرشاد</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">تسجيل الدخول</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">إنشاء حساب</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            منصّة توجيه مهني وتعليمي
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            لطلبة حاسبات/علوم حاسب في مصر ومنطقة مينا
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  ابدأ الآن
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:mr-3">
              <Link to="/login">
                <Button variant="outline" size="lg">
                  استكشف كزائر
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-2">تحديد التخصص</h3>
              <p className="text-gray-600">
                اختبار ذكي يساعدك في تحديد التخصص الأنسب لك
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-2">Roadmap مخصّصة</h3>
              <p className="text-gray-600">
                خطة تعليمية مخصصة حسب تخصصك وأهدافك
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-2">المنتورينج</h3>
              <p className="text-gray-600">
                تواصل مع منتورين متخصصين في مجالك
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing

