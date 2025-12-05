import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import api from '../../services/api/auth'
import Button from '../../components/atoms/Button'

interface RoadmapStage {
  id: number
  title: string
  description: string
  stage_order: number
  estimated_hours: number
  resources: Array<{
    id: number
    resource: {
      id: number
      title: string
      type: string
      url: string
    }
    order_in_stage: number
    is_required: boolean
  }>
}

interface Roadmap {
  id: number
  title: string
  description: string
  track: string
  stages: RoadmapStage[]
  created_at: string
}

const MyRoadmap: React.FC = () => {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRoadmap()
  }, [])

  const fetchRoadmap = async () => {
    try {
      setLoading(true)
      const response = await api.get('/roadmaps/my_roadmap/')
      setRoadmap(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching roadmap:', err)
      setError('فشل تحميل خطة التعلم. يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل خطة التعلم...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchRoadmap}>إعادة المحاولة</Button>
        </div>
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">لا توجد خطة تعلم</h2>
          <p className="text-gray-600 mb-4">لم يتم إنشاء خطة تعلم بعد. يرجى إكمال عملية التسجيل.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{roadmap.title}</h1>
              <p className="text-gray-600">{roadmap.description}</p>
              <div className="mt-4">
                <span className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {roadmap.track}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">عدد المراحل</p>
              <p className="text-2xl font-bold text-primary-600">{roadmap.stages?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">نظرة عامة على التقدم</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-primary-600 h-4 rounded-full" style={{ width: '0%' }}>
              {/* Progress will be calculated based on completed stages */}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">0% مكتمل</p>
        </div>

        {/* Stages */}
        <div className="space-y-6">
          {roadmap.stages?.map((stage, index) => (
            <div key={stage.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                        {stage.stage_order}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">{stage.title}</h3>
                    </div>
                    <p className="text-gray-600 mt-2">{stage.description}</p>
                    {stage.estimated_hours > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        الوقت المقدر: {stage.estimated_hours} ساعة
                      </p>
                    )}
                  </div>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    قيد الانتظار
                  </span>
                </div>
              </div>

              {/* Resources */}
              {stage.resources && stage.resources.length > 0 && (
                <div className="p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-4">الموارد التعليمية</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stage.resources
                      .sort((a, b) => a.order_in_stage - b.order_in_stage)
                      .map((roadmapResource) => {
                        const resource = roadmapResource.resource
                        return (
                          <a
                            key={roadmapResource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                                    {resource.type}
                                  </span>
                                  {roadmapResource.is_required && (
                                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                                      مطلوب
                                    </span>
                                  )}
                                </div>
                                <h5 className="font-semibold text-gray-900 mb-1">{resource.title}</h5>
                                <p className="text-sm text-gray-500 truncate">{resource.url}</p>
                              </div>
                              <svg
                                className="w-5 h-5 text-gray-400 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </div>
                          </a>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <Button variant="primary" size="sm">
                    ابدأ هذه المرحلة
                  </Button>
                  <Button variant="outline" size="sm">
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* External Link */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">استكشف المزيد على roadmap.sh</h3>
              <p className="text-blue-700 text-sm">
                احصل على موارد إضافية ومراجعات تفصيلية لمسار {roadmap.track}
              </p>
            </div>
            <a
              href={`https://roadmap.sh/${roadmap.track.toLowerCase().replace(' ', '-')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              زيارة roadmap.sh
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyRoadmap

