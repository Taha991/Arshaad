import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Input'

type Step = 'year' | 'choice' | 'assessment' | 'recommendations' | 'selection'

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [step, setStep] = useState<Step>('year')
  const [studyYear, setStudyYear] = useState<number | ''>('')
  const [hasRoadmap, setHasRoadmap] = useState<boolean | null>(null)
  const [answers, setAnswers] = useState<Record<number, 'agree' | 'disagree' | null>>({})
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [selectedTrack, setSelectedTrack] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const assessmentQuestions = [
    { id: 1, question: 'أحب العمل على مشاريع تتطلب تفكيرًا إبداعيًا وحلولًا مبتكرة' },
    { id: 2, question: 'أفضل العمل في فريق والتعاون مع الآخرين' },
    { id: 3, question: 'أهتم ببناء تطبيقات وتجارب مستخدم جميلة وسهلة الاستخدام' },
    { id: 4, question: 'أحب تحليل البيانات واستخراج رؤى منها' },
    { id: 5, question: 'أهتم بأمان المعلومات وحماية الأنظمة من الاختراقات' },
    { id: 6, question: 'أفضل العمل على مشاريع كبيرة ومعقدة' },
    { id: 7, question: 'أحب التعلم المستمر ومواكبة أحدث التقنيات' },
    { id: 8, question: 'أفضل العمل على تطبيقات الموبايل' },
    { id: 9, question: 'أهتم بتحسين أداء الأنظمة وجعلها أسرع' },
    { id: 10, question: 'أحب العمل على مشاريع تتعلق بالذكاء الاصطناعي والتعلم الآلي' },
  ]

  const handleYearSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (studyYear) {
      setStep('choice')
    }
  }

  const handleChoice = (hasRoadmap: boolean) => {
    setHasRoadmap(hasRoadmap)
    if (hasRoadmap) {
      // Skip to roadmap selection
      navigate('/dashboard')
    } else {
      setStep('assessment')
    }
  }

  const handleAnswer = (questionId: number, answer: 'agree' | 'disagree') => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if all questions are answered
    if (Object.keys(answers).length !== assessmentQuestions.length) {
      alert('يرجى الإجابة على جميع الأسئلة')
      return
    }

    setIsLoading(true)
    try {
      // Create assessment
      const assessmentData = {
        version: '1.0',
        answers_json: {
          study_year: studyYear,
          answers: answers,
          question_ids: assessmentQuestions.map(q => q.id),
        },
        completion_time_seconds: 0, // You can track this
      }

      // Import API service
      const api = (await import('../../services/api/auth')).default
      
      // Create assessment
      const assessmentResponse = await api.post('/assessments/', assessmentData)
      const assessment = assessmentResponse.data

      // Generate recommendations
      const recResponse = await api.post(`/assessments/${assessment.id}/generate_recommendation/`, {})
      const recommendation = recResponse.data
      
      // Get top 3 tracks (main + 2 alternatives)
      const tracks = [
        {
          track: recommendation.track,
          confidence: recommendation.confidence,
          explanation: recommendation.explanation,
        },
        ...(recommendation.alternative_tracks || []).slice(0, 2).map((alt: any) => ({
          track: alt.track,
          confidence: alt.score,
          explanation: `مسار بديل مناسب لك`,
        })),
      ]

      setRecommendations(tracks)
      setStep('recommendations')
    } catch (error) {
      console.error('Assessment error:', error)
      alert('حدث خطأ أثناء معالجة التقييم. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrackSelection = async (track: string) => {
    setSelectedTrack(track)
    
    try {
      // Mark onboarding as complete
      const api = (await import('../../services/api/auth')).default
      const response = await api.post('/onboarding/complete/', { selected_track: track })

      navigate('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      // Navigate anyway
      navigate('/dashboard')
    }
  }

  // Year Selection Step
  if (step === 'year') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              مرحباً بك في أرشاد! 👋
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              لنبدأ بمعرفة المزيد عنك
            </p>
          </div>
          
          <form onSubmit={handleYearSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                في أي سنة دراسية أنت؟
              </label>
              <select
                value={studyYear}
                onChange={(e) => setStudyYear(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">اختر السنة الدراسية</option>
                <option value="1">السنة الأولى</option>
                <option value="2">السنة الثانية</option>
                <option value="3">السنة الثالثة</option>
                <option value="4">السنة الرابعة</option>
                <option value="5">السنة الخامسة</option>
                <option value="6">خريج</option>
              </select>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              التالي
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // Choice Step
  if (step === 'choice') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              هل لديك مسار محدد؟
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              اختر ما يناسبك
            </p>
          </div>
          
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full h-24 flex flex-col items-center justify-center"
              onClick={() => handleChoice(false)}
            >
              <span className="text-lg font-semibold">لا، أريد استكشاف المسارات</span>
              <span className="text-sm text-gray-500 mt-1">سأساعدك في اختيار المسار الأنسب</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full h-24 flex flex-col items-center justify-center"
              onClick={() => handleChoice(true)}
            >
              <span className="text-lg font-semibold">نعم، لدي مسار محدد</span>
              <span className="text-sm text-white/80 mt-1">سأختار المسار مباشرة</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Assessment Step
  if (step === 'assessment') {
    const allAnswered = Object.keys(answers).length === assessmentQuestions.length
    const currentQuestionIndex = assessmentQuestions.findIndex(q => !answers[q.id])
    const currentQuestion = currentQuestionIndex >= 0 
      ? assessmentQuestions[currentQuestionIndex] 
      : assessmentQuestions[assessmentQuestions.length - 1]

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                السؤال {Object.keys(answers).length + 1} من {assessmentQuestions.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round((Object.keys(answers).length / assessmentQuestions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${(Object.keys(answers).length / assessmentQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleAnswer(currentQuestion.id, 'agree')}
                className={`w-full p-6 rounded-lg border-2 transition-all ${
                  answers[currentQuestion.id] === 'agree'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                }`}
              >
                <span className="text-lg font-semibold">أوافق 👍</span>
              </button>

              <button
                type="button"
                onClick={() => handleAnswer(currentQuestion.id, 'disagree')}
                className={`w-full p-6 rounded-lg border-2 transition-all ${
                  answers[currentQuestion.id] === 'disagree'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                }`}
              >
                <span className="text-lg font-semibold">لا أوافق 👎</span>
              </button>
            </div>

            {allAnswered && (
              <div className="mt-8">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleAssessmentSubmit}
                  isLoading={isLoading}
                >
                  احصل على التوصيات
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Recommendations Step
  if (step === 'recommendations') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🎯 المسارات المقترحة لك
            </h2>
            <p className="text-gray-600">
              بناءً على إجاباتك، هذه أفضل 3 مسارات تناسبك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedTrack === rec.track ? 'ring-2 ring-primary-600' : ''
                } ${index === 0 ? 'border-2 border-primary-500' : ''}`}
                onClick={() => handleTrackSelection(rec.track)}
              >
                {index === 0 && (
                  <div className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded mb-3 inline-block">
                    الأفضل لك
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {rec.track}
                </h3>
                <div className="text-sm text-gray-600 mb-3">
                  نسبة التوافق: {rec.confidence}%
                </div>
                <p className="text-sm text-gray-500">
                  {rec.explanation}
                </p>
              </div>
            ))}
          </div>

          {selectedTrack && (
            <div className="text-center">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => handleTrackSelection(selectedTrack)}
                className="w-full md:w-auto"
              >
                تأكيد الاختيار والبدء
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default OnboardingFlow

