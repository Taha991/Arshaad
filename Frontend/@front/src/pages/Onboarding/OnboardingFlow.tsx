import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { getCurrentUser } from '@/store/slices/authSlice'
import GlassCard from '@/components/atoms/GlassCard'
import ProgressRing from '@/components/atoms/ProgressRing'
import { mockTrackRecommendations, mockRoadmapStages } from '@/data/mockData'
import { assessmentsAPI } from '@/services/api/assessments'
import { Assessment, Recommendation } from '@/types/assessment'

// Map API track names to display properties
const TRACK_DISPLAY_MAP: Record<string, any> = {
  'Frontend Development': {
    icon: '🎨',
    description: 'You have strong creativity and UI/UX interest. React, TypeScript, and design systems await you.',
    descriptionAr: 'لديك إبداع قوي واهتمام بتجربة المستخدم. مسار React وTypeScript ينتظرك.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
    salaryRange: '$45K – $160K',
  },
  'Full Stack Development': {
    icon: '⚡',
    description: 'Balance of frontend and backend. Node.js, databases, and REST APIs.',
    descriptionAr: 'توازن بين الواجهات والخوادم. Node.js وقواعد البيانات وAPIs.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    salaryRange: '$50K – $170K',
  },
  'UI/UX Design': {
    icon: '✨',
    description: 'Your creativity and user empathy make you a natural designer. Figma and design systems.',
    descriptionAr: 'إبداعك وتعاطفك مع المستخدم يجعلانك مصمماً طبيعياً.',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    salaryRange: '$40K – $140K',
  },
  'Backend Development': {
    icon: '🔧',
    description: 'Build robust APIs and services. Node.js, Python, databases, and microservices.',
    descriptionAr: 'بناء APIs قوية وخدمات موثوقة. Node.js وPython والخوادم.',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs'],
    salaryRange: '$55K – $180K',
  },
  'Data Science': {
    icon: '📊',
    description: 'Extract insights from data. Python, machine learning, and statistical analysis.',
    descriptionAr: 'استخلاص الحكايات من البيانات. Python والتعلم الآلي والتحليل.',
    skills: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
    salaryRange: '$60K – $200K',
  },
  'AI/ML': {
    icon: '🤖',
    description: 'Build intelligent systems. Deep learning, neural networks, and AI models.',
    descriptionAr: 'بناء أنظمة ذكية. التعلم العميق والشبكات العصبية.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'ML Algorithms'],
    salaryRange: '$70K – $220K',
  },
  'Mobile Development': {
    icon: '📱',
    description: 'Create apps for iOS and Android. Flutter, React Native, and native development.',
    descriptionAr: 'إنشاء تطبيقات الهاتف. Flutter وReact Native والتطوير الأصلي.',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    salaryRange: '$48K – $175K',
  },
  'Cybersecurity': {
    icon: '🔐',
    description: 'Protect systems from threats. Network security, penetration testing, and encryption.',
    descriptionAr: 'حماية الأنظمة من التهديدات. الأمان والاختبار والتشفير.',
    skills: ['Linux', 'Network Security', 'Penetration Testing', 'Cryptography'],
    salaryRange: '$65K – $210K',
  },
  'Cloud/DevOps': {
    icon: '☁️',
    description: 'Deploy and scale applications. Docker, Kubernetes, AWS, and CI/CD pipelines.',
    descriptionAr: 'نشر وتوسيع التطبيقات. Docker وKubernetes وAWS.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    salaryRange: '$60K – $200K',
  },
  'Game Development': {
    icon: '🎮',
    description: 'Create interactive games. Unity, Unreal Engine, and game design.',
    descriptionAr: 'إنشاء ألعاب تفاعلية. Unity وUnreal Engine.',
    skills: ['Unity', 'C#', 'Game Design', 'Graphics'],
    salaryRange: '$50K – $180K',
  },
  'Blockchain': {
    icon: '⛓️',
    description: 'Build decentralized applications. Smart contracts, Web3, and cryptocurrency.',
    descriptionAr: 'بناء تطبيقات لا مركزية. العقود الذكية والويب3.',
    skills: ['Solidity', 'Web3.js', 'Smart Contracts', 'Ethereum'],
    salaryRange: '$55K – $200K',
  },
}

// Function to enrich API recommendation with display data
function enrichRecommendation(rec: any): any {
  const displayData = TRACK_DISPLAY_MAP[rec.track] || {
    icon: '🎯',
    description: rec.explanation || 'A great career path for you!',
    descriptionAr: 'مسار مهني رائع لك!',
    skills: [],
    salaryRange: '$50K – $150K',
  }
  
  return {
    ...rec,
    ...displayData,
    trackAr: rec.trackAr || translateTrackName(rec.track),
    confidence: typeof rec.confidence === 'number' ? rec.confidence : parseInt(rec.confidence) || 75,
  }
}

// Translate track names to Arabic
function translateTrackName(track: string): string {
  const trackTranslations: Record<string, string> = {
    'Frontend Development': 'تطوير الواجهات',
    'Full Stack Development': 'تطوير متكامل',
    'UI/UX Design': 'تصميم تجربة المستخدم',
    'Backend Development': 'تطوير الخادم',
    'Data Science': 'علم البيانات',
    'AI/ML': 'الذكاء الاصطناعي',
    'Mobile Development': 'طوير الموبايل',
    'Cybersecurity': 'الأمن السيبراني',
    'Cloud/DevOps': 'السحابة والعمليات',
    'Game Development': 'تطوير الألعاب',
    'Blockchain': 'تقنية البلوك تشين',
  }
  return trackTranslations[track] || track
}

type Step = 'welcome' | 'year' | 'assessment' | 'loading' | 'recommendations' | 'roadmap-preview'

const yearOptions = [
  { value: 1, label: 'High School - Year 1' },
  { value: 2, label: 'High School - Year 2' },
  { value: 3, label: 'High School - Year 3' },
  { value: 4, label: 'University - Year 1' },
  { value: 5, label: 'University - Year 2' },
  { value: 6, label: 'University - Year 3' },
  { value: 7, label: 'University - Year 4' },
  { value: 8, label: 'Graduate' },
]

const questions = [
  { id: 1, en: 'I enjoy creative thinking and designing unique visual experiences.',           ar: 'أستمتع بالتفكير الإبداعي وتصميم تجارب بصرية فريدة.' },
  { id: 2, en: 'I prefer working collaboratively in a team over working alone.',              ar: 'أفضل العمل التعاوني في فريق على العمل منفرداً.' },
  { id: 3, en: 'I love building beautiful, accessible user interfaces.',                      ar: 'أحب بناء واجهات مستخدم جميلة وسهلة الوصول.' },
  { id: 4, en: 'I am drawn to analyzing data and discovering hidden patterns.',               ar: 'أنجذب لتحليل البيانات واكتشاف الأنماط المخفية.' },
  { id: 5, en: 'I find cybersecurity and protecting systems from threats fascinating.',       ar: 'أجد الأمن السيبراني وحماية الأنظمة من التهديدات رائعاً.' },
  { id: 6, en: 'I enjoy breaking down and solving complex, large-scale problems.',            ar: 'أستمتع بتحليل وحل المشكلات المعقدة على نطاق واسع.' },
  { id: 7, en: 'I am passionate about continuously learning new technologies and tools.',    ar: 'أتحمس للتعلم المستمر للتقنيات والأدوات الجديدة.' },
  { id: 8, en: 'I am interested in building mobile applications for iOS and Android.',       ar: 'أهتم ببناء تطبيقات الموبايل لنظامَي iOS وAndroid.' },
  { id: 9, en: 'I care deeply about performance optimization and making systems faster.',    ar: 'أهتم كثيراً بتحسين الأداء وجعل الأنظمة أسرع.' },
  { id: 10, en: 'I am excited about artificial intelligence and machine learning projects.', ar: 'أتحمس للمشاريع المتعلقة بالذكاء الاصطناعي والتعلم الآلي.' },
]

const scaleLabels = [
  { value: 1, label: 'Strongly Disagree', labelAr: 'لا أوافق بشدة' },
  { value: 2, label: 'Disagree',          labelAr: 'لا أوافق'       },
  { value: 3, label: 'Neutral',           labelAr: 'محايد'          },
  { value: 4, label: 'Agree',             labelAr: 'أوافق'          },
  { value: 5, label: 'Strongly Agree',    labelAr: 'أوافق بشدة'     },
]

const loadingSteps = [
  { icon: '✓', label: 'Analyzing your responses...', labelAr: 'جاري تحليل إجاباتك...' },
  { icon: '✓', label: 'Mapping to career database...', labelAr: 'جاري ربط قاعدة البيانات...' },
  { icon: '✓', label: 'Calculating compatibility scores...', labelAr: 'جاري حساب درجات التوافق...' },
  { icon: '✓', label: 'Researching market trends...', labelAr: 'جاري البحث عن اتجاهات السوق...' },
  { icon: '✓', label: 'Generating personalized roadmap...', labelAr: 'جاري إنشاء خارطة طريق شخصية...' },
]

// Shared dark background with blobs
function DarkBg() {
  return (
    <>
      <div className="blob w-96 h-96 bg-blue-600 top-[-10%] left-[-5%] animate-blob" />
      <div className="blob w-80 h-80 bg-violet-600 bottom-[-10%] right-[-5%] animate-blob-delayed" />
      <div className="blob w-72 h-72 bg-cyan-500 top-[50%] right-[10%] animate-blob-slow" />
    </>
  )
}

export default function OnboardingFlow() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((s: RootState) => s.auth)

  const [step, setStep] = useState<Step>('welcome')
  const [studyYear, setStudyYear] = useState<number | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedRec, setSelectedRec] = useState<number | null>(null)
  const [loadingStepIdx, setLoadingStepIdx] = useState(0)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const blurOnMouseDown = (e: any) => {
    try { (e.currentTarget as HTMLButtonElement).blur() } catch { /* ignore */ }
  }

  // Auto-advance through loading steps
  useEffect(() => {
    if (step !== 'loading') return
    const interval = setInterval(() => {
      setLoadingStepIdx(i => {
        if (i >= loadingSteps.length - 1) {
          clearInterval(interval)
          setTimeout(() => setStep('recommendations'), 700)
          return i
        }
        return i + 1
      })
    }, 700)
    return () => clearInterval(interval)
  }, [step])

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length

  function handleAnswer(qId: number, val: number) {
    setAnswers(prev => ({ ...prev, [qId]: val }))
    setTimeout(() => {
      if (currentQ < questions.length - 1) setCurrentQ(i => i + 1)
    }, 350)
  }

  async function handleFinish() {
    if (selectedRec === null) return
    try {
      const api = (await import('@/services/api/auth')).default
      
      const selectedTrack: any = recommendations.length > selectedRec 
        ? recommendations[selectedRec]
        : mockTrackRecommendations[selectedRec]
      
      const trackName = selectedTrack?.track || ''
      const recommendationId = selectedTrack?.id
      
      await api.post('/onboarding/complete/', {
        selected_track: trackName,
        study_year: studyYear,
        assessment_id: assessment?.id,
        recommendation_id: recommendationId,
        answers,
      })
      
      try {
        await dispatch(getCurrentUser()).unwrap()
      } catch {

        console.warn('Could not refresh user data, but proceeding to dashboard')
      }
    } catch (err) {

      console.warn('Onboarding completion failed, but user is authenticated, proceeding to dashboard')
    }
    navigate('/dashboard')
  }

  // Convert numeric answers (1-5) to 'agree'/'disagree' format for API
  function convertAnswersForAPI() {
    const convertedAnswers: Record<number, 'agree' | 'disagree'> = {}
    for (const [qId, value] of Object.entries(answers)) {
      // Convert: 1-2 = disagree, 3 = neutral, 4-5 = agree
      convertedAnswers[parseInt(qId)] = value >= 4 ? 'agree' : 'disagree'
    }
    return convertedAnswers
  }

  async function submitAssessmentAndGetRecommendations() {
    if (!allAnswered || !studyYear) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Create assessment
      const assessmentData = await assessmentsAPI.createAssessment({
        version: '1.0',
        answers_json: {
          study_year: studyYear,
          answers: convertAnswersForAPI(),
        },
      })
      setAssessment(assessmentData)
      
      // Generate recommendations
      const recs = await assessmentsAPI.generateRecommendation(assessmentData.id)
      
      // Handle both single recommendation and array of recommendations
      let recsArray = Array.isArray(recs) ? recs : recs && 'track' in recs ? [recs] : []
      
      // Enrich recommendations with display data (icons, descriptions, etc.)
      recsArray = recsArray.map(rec => enrichRecommendation(rec))
      
      setRecommendations(recsArray)
      
      // Auto-select first recommendation if we have it
      if (recsArray.length > 0) {
        setSelectedRec(0)
      }
    } catch (err) {
      console.error('Error submitting assessment:', err)
      setError('Failed to generate recommendations. Please try again.')
      // Fall back to mock data on error
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4">
        <DarkBg />

        {/* الكارت */}
        <div className="relative z-10 w-full max-w-2xl animate-fade-in">
          <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 sm:p-14 text-center shadow-[0_0_80px_rgba(59,130,246,0.15)]">
            <div className="text-7xl mb-6 animate-float">🧭</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">
              Welcome, <span className="gradient-text">
                {user?.name?.split(' ')[0] ?? 'Friend'}
              </span>!
            </h1>

            <p className="text-white/40 text-lg font-arabic mb-2">
              أهلاً وسهلاً، {user?.name?.split(' ')[0] ?? 'صديقي'}!
            </p>

            <p className="text-white/50 text-base mb-10 leading-relaxed">
              We'll ask you 10 quick questions to find your perfect career path.
              <br />
              <span className="text-white/30 text-sm font-arabic">
                سنسألك 10 أسئلة لاكتشاف مسارك المهني الأمثل.
              </span>
            </p>

            <button
              onClick={() => setStep('year')}
              onMouseDown={blurOnMouseDown}
              className="btn-neon text-white text-lg font-semibold px-10 py-4 rounded-2xl outline-none hover:opacity-90 transition-opacity"
              style={{ boxShadow: 'none' }}
            >
              Let's Start · هيا نبدأ 🚀
            </button>

          </div>
        </div>
      </div>
    )
  }

  if (step === 'year') {
    return (
      <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-10">
        <DarkBg />
        <div className="relative z-10 w-full max-w-3xl">
          {/* Card */}
          <div className="bg-[#071020]/80 backdrop-blur-md border border-white/5 rounded-3xl p-10 shadow-[0_30px_80px_rgba(12,18,30,0.6)]">
            {/* Header with gradient square icon */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md"
                style={{ background: 'linear-gradient(135deg,#6b5bf8 0%, #7ad3ff 100%)' }}
              >
                🎓
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white leading-tight">What's your current study year?</h2>
                <p className="text-white/40 text-sm font-arabic mt-1">في أي سنة دراسية أنت؟</p>
              </div>
            </div>

            {/* Grid of year buttons (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {yearOptions.map(opt => {
                const selected = studyYear === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setStudyYear(opt.value)
                      // keep original behavior: auto-advance after selection
                      setTimeout(() => setStep('assessment'), 200)
                    }}
                    onMouseDown={blurOnMouseDown}
                    aria-pressed={selected}
                    className={`w-full text-left px-6 py-4 rounded-xl transition-all shadow-sm outline-none hover:opacity-90
                      ${selected
                        ? 'bg-cyan-400/20 border border-cyan-400/50 ring-1 ring-cyan-400/20'
                        : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    style={{ boxShadow: selected ? '0 0 15px rgba(34,211,238,0.15)' : undefined }}
                  >
                    <span className={`text-white ${selected ? 'font-semibold text-cyan-400' : 'text-white/70'}`}>{opt.label}</span>
                  </button>
                )
              })}
            </div>

            {/* (Optional) small note row aligned right - visually matches layout in design */}
            <div className="flex justify-end">
              <span className="text-xs text-white/30">Choose one to continue</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'assessment') {
    const q = questions[currentQ]
    const progressPercent = Math.round((answeredCount / questions.length) * 100)

    return (
      <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-10">
        <DarkBg />
        <div className="relative z-10 w-full max-w-2xl animate-scale-in">
          
          {/* Unified Main Card Wrapper (Matches Year Step) */}
          <div className="bg-[#071020]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 sm:p-10 shadow-[0_30px_80px_rgba(12,18,30,0.6)]">
            
            {/* Progress header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-white/50 text-sm font-medium">Question {currentQ + 1} of {questions.length}</p>
                <p className="text-white/30 text-xs font-arabic mt-1">السؤال {currentQ + 1} من {questions.length}</p>
              </div>
              <ProgressRing percent={progressPercent} size={64} strokeWidth={5} color="gradient" />
            </div>

            {/* Question Card (Lighter glass effect) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 shadow-sm">
              <p className="text-white text-xl font-semibold leading-relaxed mb-3">{q.en}</p>
              <p className="text-white/50 text-sm font-arabic leading-relaxed">{q.ar}</p>
            </div>

            {/* 5-point scale (Lighter glass effect) */}
            <div className="flex gap-2">
              {scaleLabels.map(s => {
                const isSelected = answers[q.id] === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => handleAnswer(q.id, s.value)}
                    className={`flex-1 py-4 rounded-xl text-center transition-all duration-300 outline-none
                      ${isSelected
                        ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-400 ring-1 ring-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.15)] transform -translate-y-1'
                        : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span className="text-lg font-bold block mb-1">{s.value}</span>
                    <span className="text-[10px] sm:text-xs font-medium leading-tight hidden sm:block opacity-70">
                      {s.value === 1 ? 'No' : s.value === 5 ? 'Yes!' : ''}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Scale labels */}
            <div className="flex justify-between text-xs text-white/40 mt-3 px-2 font-medium">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-10 gap-3">
              <button
                onClick={() => currentQ > 0 && setCurrentQ(i => i - 1)}
                disabled={currentQ === 0}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none
                  bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              
              {currentQ < questions.length - 1 && answers[q.id] && (
                <button
                  onClick={() => setCurrentQ(i => i + 1)}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none
                    bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 hover:text-cyan-300 ml-auto"
                >
                  Next →
                </button>
              )}
              
              {allAnswered && (
                <button
                  onClick={() => {
                    setLoadingStepIdx(0)
                    setStep('loading')
                    // Submit assessment when entering loading step
                    submitAssessmentAndGetRecommendations()
                  }}
                  onMouseDown={blurOnMouseDown}
                  disabled={isLoading}
                  className="btn-neon text-white px-8 py-2.5 rounded-xl text-sm font-semibold ml-auto disabled:opacity-50 outline-none hover:opacity-90 transition-opacity"
                  style={{ boxShadow: 'none' }}
                >
                  {isLoading ? 'Submitting...' : 'Get My Results 🎯'}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    )
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#1a2847] to-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-12">
        <DarkBg />
        
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl">
            {/* Spinner with Brain Icon from teammate */}
            <div className="flex justify-center mb-8 relative">
              <div className="relative w-28 h-28">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-violet-400 animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-blue-400 border-l-cyan-400 animate-spin-slow" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30" />
                <div className="absolute inset-0 flex items-center justify-center text-3xl">🧠</div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-center text-2xl md:text-3xl font-bold text-white mb-2">
              Analyzing Your Profile
            </h1>
            <p className="text-center text-sm text-white/40 mb-10 font-arabic">
              جاري تحليل ملفك الشخصي
            </p>

            {/* Steps */}
            <div className="space-y-4">
              {loadingSteps.map((loadStep, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl border transition-all ${
                    index <= loadingStepIdx
                      ? 'bg-emerald-500/10 border-emerald-500/30 animate-fade-in'
                      : 'bg-white/5 border-white/10'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 text-sm font-bold ${
                    index <= loadingStepIdx
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                      : 'bg-white/5 border border-white/10 text-white/30'
                  }`}>
                    {index <= loadingStepIdx ? loadStep.icon : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      index <= loadingStepIdx ? 'text-white' : 'text-white/50'
                    }`}>
                      {loadStep.label}
                    </p>
                    <p className={`text-xs ${
                      index <= loadingStepIdx ? 'text-white/50' : 'text-white/20'
                    }`}>
                      {loadStep.labelAr}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-8 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-300"
                style={{ width: `${((loadingStepIdx + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    )
  }

  if (step === 'recommendations') {
    // Use real recommendations if available, otherwise fall back to mock
    const isMockData = recommendations.length === 0
    const displayRecs: any[] = recommendations.length > 0 ? recommendations : mockTrackRecommendations
    
    return (
      <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-10">
        <DarkBg />
        <div className="relative z-10 w-full max-w-4xl animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
              <span className="gradient-text">Your Career Paths</span>
              <span>🎯</span>
            </h2>
            <p className="text-white/40 mt-2 font-arabic">مساراتك المهنية المقترحة</p>
            {isMockData && (
              <p className="text-yellow-400/60 text-sm mt-2">Using sample recommendations</p>
            )}
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {displayRecs.map((rec: any, i: number) => {
              const confidence = rec.confidence || 0
              const trackName = rec.track || ''
              const icon = rec.icon || '🎯'
              const description = rec.description || ''
              const descriptionAr = rec.descriptionAr || ''
              const skills = rec.skills || []
              const salaryRange = rec.salaryRange || ''
              
              return (
                <GlassCard
                  key={i}
                  hover
                  neonBorder={selectedRec === i}
                  onClick={() => setSelectedRec(i)}
                  className={`bg-[#0B1120] cursor-pointer transition-all duration-300 
                    hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.15)]
                    ${selectedRec === i ? 'border-cyan-400/40 shadow-[0_0_35px_rgba(34,211,238,0.15)]' : ''}`}
                >
                  {i === 0 && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-400 border border-cyan-400/30 text-xs font-semibold mb-3">
                      ⭐ Best Match · الأفضل لك
                    </div>
                  )}
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="text-white font-bold text-lg mb-1">{trackName}</h3>
                  <p className="text-white/40 text-xs font-arabic mb-3">{descriptionAr}</p>

                  <div className="flex items-center gap-3 mb-3">
                    <ProgressRing percent={confidence} size={52} strokeWidth={4} color="gradient" />
                    <div>
                      <p className="text-white/50 text-xs">Match Score</p>
                      <p className="text-cyan-400 font-bold">{confidence}%</p>
                    </div>
                  </div>

                  <p className="text-white/50 text-xs leading-relaxed mb-3">{description}</p>
                  <p className="text-white/30 text-xs font-arabic leading-relaxed mb-3">{descriptionAr}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {(skills || []).map((s: string) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">{s}</span>
                    ))}
                  </div>

                  {salaryRange && (
                    <div className="text-xs text-white/40 border-t border-white/5 pt-3 mt-2">
                      💰 {salaryRange}
                    </div>
                  )}
                </GlassCard>
              )
            })}
          </div>

          {selectedRec !== null && (
            <div className="text-center animate-scale-in">
              <button
                onClick={() => setStep('roadmap-preview')}
                onMouseDown={blurOnMouseDown}
                className="btn-neon text-white px-10 py-4 rounded-2xl text-lg font-semibold outline-none hover:opacity-90 transition-opacity"
                style={{ boxShadow: 'none' }}
              >
                Preview My Roadmap · عرض خارطة الطريق →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (step === 'roadmap-preview') {
    const displayRecs: any[] = recommendations.length > 0 ? recommendations : mockTrackRecommendations
    const rec = selectedRec !== null ? displayRecs[selectedRec] : displayRecs[0]
    
    const trackName = rec?.track || ''
    const icon = rec?.icon || '🎯'
    const trackNameAr = rec?.trackAr || 'المسار'

    return (
      <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-10">
        <DarkBg />
        <div className="relative z-10 w-full max-w-2xl animate-slide-up">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">{icon}</div>
            <h2 className="text-3xl font-bold gradient-text">{trackName}</h2>
            <p className="text-white/40 font-arabic mt-1">{trackNameAr}</p>
            <p className="text-white/50 text-sm mt-2">Your 5-stage learning journey · رحلتك التعليمية من 5 مراحل</p>
          </div>

          <div className="space-y-3 mb-8">
            {mockRoadmapStages.slice(0, 3).map((stage, i) => (
              <GlassCard key={stage.id} padding={false} className="bg-[#0B1120] p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border
                  ${i === 0 ? 'bg-green-400 text-black border-green-400' :
                    i === 1 ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400' :
                    'bg-white/5 text-white/30 border-white/15'}`}>
                  {i === 0 ? '✓' : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{stage.title} · <span className="font-arabic text-white/40">{stage.titleAr}</span></p>
                  <p className="text-white/40 text-xs mt-0.5">{stage.estimated_hours}h · {stage.skills.slice(0,3).join(', ')}</p>
                </div>
              </GlassCard>
            ))}
            <GlassCard padding={false} className="bg-[#0B1120] p-4 text-center text-white/30 text-sm">
              + 2 more stages unlocked as you progress · +2 مراحل إضافية تُفتح تدريجياً
            </GlassCard>
          </div>

          <div className="text-center">
            <button
              onClick={handleFinish}
              onMouseDown={blurOnMouseDown}
              className="btn-neon text-white px-12 py-4 rounded-2xl text-lg font-bold outline-none hover:opacity-90 transition-opacity"
              style={{ boxShadow: 'none' }}
            >
              Start My Journey! · ابدأ رحلتي 🚀
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}