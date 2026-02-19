import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import GlassCard from '@/components/atoms/GlassCard'
import ProgressRing from '@/components/atoms/ProgressRing'
import { mockTrackRecommendations, mockRoadmapStages } from '@/data/mockData'

type Step = 'welcome' | 'year' | 'assessment' | 'loading' | 'recommendations' | 'roadmap-preview'

const yearOptions = [
  { value: 1, label: 'Year 1', labelAr: 'السنة الأولى', emoji: '🌱' },
  { value: 2, label: 'Year 2', labelAr: 'السنة الثانية', emoji: '📚' },
  { value: 3, label: 'Year 3', labelAr: 'السنة الثالثة', emoji: '💡' },
  { value: 4, label: 'Year 4', labelAr: 'السنة الرابعة', emoji: '🚀' },
  { value: 5, label: 'Year 5', labelAr: 'السنة الخامسة', emoji: '⭐' },
  { value: 6, label: 'Graduate', labelAr: 'خريج', emoji: '🎓' },
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

const loadingMessages = [
  { en: 'Analyzing your responses...',    ar: 'جاري تحليل إجاباتك...' },
  { en: 'Training recommendation model...', ar: 'تدريب نموذج التوصيات...' },
  { en: 'Matching career paths...',       ar: 'مطابقة المسارات المهنية...' },
  { en: 'Calculating confidence scores...', ar: 'حساب درجات الثقة...' },
  { en: 'Almost ready!',                  ar: 'اكتمل التحليل!' },
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
  const { user } = useSelector((s: RootState) => s.auth)

  const [step, setStep] = useState<Step>('welcome')
  const [studyYear, setStudyYear] = useState<number | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedRec, setSelectedRec] = useState<number | null>(null)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)

  // Auto-advance through loading messages
  useEffect(() => {
    if (step !== 'loading') return
    const interval = setInterval(() => {
      setLoadingMsgIdx(i => {
        if (i >= loadingMessages.length - 1) {
          clearInterval(interval)
          setTimeout(() => setStep('recommendations'), 700)
          return i
        }
        return i + 1
      })
    }, 900)
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
      await api.post('/onboarding/complete/', {
        selected_track: mockTrackRecommendations[selectedRec].track,
        study_year: studyYear,
        answers,
      })
    } catch { /* navigate anyway if backend not ready */ }
    navigate('/dashboard')
  }

  // ── Step: Welcome ────────────────────────────────────────────────
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4">
        <DarkBg />
        <div className="relative z-10 text-center animate-fade-in max-w-lg w-full">
          <div className="text-7xl mb-6 animate-float">🧭</div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            Welcome, <span className="gradient-text">{user?.name?.split(' ')[0] ?? 'Friend'}</span>!
          </h1>
          <p className="text-white/40 text-lg font-arabic mb-2">
            أهلاً وسهلاً، {user?.name?.split(' ')[0] ?? 'صديقي'}!
          </p>
          <p className="text-white/50 text-base mb-10 leading-relaxed">
            We'll ask you 10 quick questions to find your perfect career path.
            <br />
            <span className="text-white/30 text-sm font-arabic">سنسألك 10 أسئلة لاكتشاف مسارك المهني الأمثل.</span>
          </p>
          <button
            onClick={() => setStep('year')}
            className="btn-neon text-white text-lg font-semibold px-10 py-4 rounded-2xl"
          >
            Let's Start · هيا نبدأ 🚀
          </button>
        </div>
      </div>
    )
  }

  // ── Step: Year ───────────────────────────────────────────────────
  if (step === 'year') {
    return (
      <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-10">
        <DarkBg />
        <div className="relative z-10 w-full max-w-2xl animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">What year are you in?</h2>
            <p className="text-white/40 text-base font-arabic mt-1">في أي سنة دراسية أنت؟</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {yearOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  setStudyYear(opt.value)
                  setTimeout(() => setStep('assessment'), 200)
                }}
                className={`glass-card p-5 text-center transition-all cursor-pointer hover:scale-105 ${
                  studyYear === opt.value ? 'neon-border' : 'hover:border-white/20'
                }`}
              >
                <div className="text-3xl mb-2">{opt.emoji}</div>
                <p className="text-white font-semibold text-sm">{opt.label}</p>
                <p className="text-white/40 text-xs font-arabic">{opt.labelAr}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Step: Assessment ─────────────────────────────────────────────
  if (step === 'assessment') {
    const q = questions[currentQ]
    const progressPercent = Math.round((answeredCount / questions.length) * 100)

    return (
      <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-10">
        <DarkBg />
        <div className="relative z-10 w-full max-w-xl animate-scale-in">
          {/* Progress header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/50 text-sm">Question {currentQ + 1} of {questions.length}</p>
              <p className="text-white/30 text-xs font-arabic">السؤال {currentQ + 1} من {questions.length}</p>
            </div>
            <ProgressRing percent={progressPercent} size={64} strokeWidth={5} color="gradient" />
          </div>

          <GlassCard className="mb-5">
            <p className="text-white text-xl font-semibold leading-relaxed mb-2">{q.en}</p>
            <p className="text-white/40 text-sm font-arabic leading-relaxed">{q.ar}</p>
          </GlassCard>

          {/* 5-point scale */}
          <div className="flex gap-2">
            {scaleLabels.map(s => (
              <button
                key={s.value}
                onClick={() => handleAnswer(q.id, s.value)}
                className={`flex-1 py-4 rounded-xl border text-center transition-all text-sm font-bold
                  ${answers[q.id] === s.value
                    ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400 shadow-neon-cyan'
                    : 'glass-card border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                  }`}
              >
                {s.value}
                <div className="text-xs font-normal mt-1 leading-tight hidden sm:block text-current opacity-60">
                  {s.value === 1 ? 'No' : s.value === 5 ? 'Yes!' : ''}
                </div>
              </button>
            ))}
          </div>

          {/* Scale labels */}
          <div className="flex justify-between text-xs text-white/30 mt-1 px-1">
            <span>Strongly Disagree</span>
            <span>Strongly Agree</span>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6 gap-3">
            <button
              onClick={() => currentQ > 0 && setCurrentQ(i => i - 1)}
              disabled={currentQ === 0}
              className="btn-glass text-white/60 px-4 py-2 rounded-xl text-sm disabled:opacity-30"
            >
              ← Back
            </button>
            {currentQ < questions.length - 1 && answers[q.id] && (
              <button
                onClick={() => setCurrentQ(i => i + 1)}
                className="btn-glass text-cyan-400 px-4 py-2 rounded-xl text-sm ml-auto"
              >
                Next →
              </button>
            )}
            {allAnswered && (
              <button
                onClick={() => { setLoadingMsgIdx(0); setStep('loading') }}
                className="btn-neon text-white px-6 py-2 rounded-xl text-sm font-semibold ml-auto"
              >
                Get My Results 🎯
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Step: Loading ────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4">
        <DarkBg />
        {/* Floating particles */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-30 animate-ping-slow"
            style={{
              left: `${10 + (i * 7.5)}%`,
              top: `${20 + Math.sin(i) * 40}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${1.5 + (i % 3) * 0.5}s`,
            }}
          />
        ))}
        <div className="relative z-10 text-center animate-fade-in">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 rounded-full border-2 border-cyan-400/30 animate-spin-slow" />
            <div className="absolute inset-2 rounded-full border-2 border-violet-400/30 animate-spin" style={{ animationDirection: 'reverse' }} />
            <div className="absolute inset-0 flex items-center justify-center text-3xl">🧠</div>
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-3">Analyzing Your Profile</h2>
          <p className="text-white/40 font-arabic mb-6">جاري تحليل ملفك الشخصي</p>
          <div className="h-8 flex items-center justify-center">
            <p className="text-white/70 text-sm animate-fade-in" key={loadingMsgIdx}>
              {loadingMessages[loadingMsgIdx].en}
            </p>
          </div>
          <p className="text-white/30 text-xs mt-1 font-arabic" key={`ar-${loadingMsgIdx}`}>
            {loadingMessages[loadingMsgIdx].ar}
          </p>
        </div>
      </div>
    )
  }

  // ── Step: Recommendations ────────────────────────────────────────
  if (step === 'recommendations') {
    return (
      <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-10">
        <DarkBg />
        <div className="relative z-10 w-full max-w-4xl animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text">Your Career Paths 🎯</h2>
            <p className="text-white/40 mt-2 font-arabic">مساراتك المهنية المقترحة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {mockTrackRecommendations.map((rec, i) => (
              <GlassCard
                key={i}
                hover
                neonBorder={selectedRec === i}
                onClick={() => setSelectedRec(i)}
                className={`cursor-pointer transition-all ${selectedRec === i ? '' : 'hover:border-white/20'}`}
              >
                {i === 0 && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-400 border border-cyan-400/30 text-xs font-semibold mb-3">
                    ⭐ Best Match · الأفضل لك
                  </div>
                )}
                <div className="text-3xl mb-3">{rec.icon}</div>
                <h3 className="text-white font-bold text-lg mb-1">{rec.track}</h3>
                <p className="text-white/40 text-xs font-arabic mb-3">{rec.trackAr}</p>

                <div className="flex items-center gap-3 mb-3">
                  <ProgressRing percent={rec.confidence} size={52} strokeWidth={4} color="gradient" />
                  <div>
                    <p className="text-white/50 text-xs">Match Score</p>
                    <p className="text-cyan-400 font-bold">{rec.confidence}%</p>
                  </div>
                </div>

                <p className="text-white/50 text-xs leading-relaxed mb-3">{rec.description}</p>
                <p className="text-white/30 text-xs font-arabic leading-relaxed mb-3">{rec.descriptionAr}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {rec.skills.map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">{s}</span>
                  ))}
                </div>

                <div className="text-xs text-white/40 border-t border-white/5 pt-3 mt-2">
                  💰 {rec.salaryRange}
                </div>
              </GlassCard>
            ))}
          </div>

          {selectedRec !== null && (
            <div className="text-center animate-scale-in">
              <button
                onClick={() => setStep('roadmap-preview')}
                className="btn-neon text-white px-10 py-4 rounded-2xl text-lg font-semibold"
              >
                Preview My Roadmap · عرض خارطة الطريق →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Step: Roadmap Preview ────────────────────────────────────────
  if (step === 'roadmap-preview') {
    const rec = selectedRec !== null ? mockTrackRecommendations[selectedRec] : mockTrackRecommendations[0]

    return (
      <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center px-4 py-10">
        <DarkBg />
        <div className="relative z-10 w-full max-w-2xl animate-slide-up">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">{rec.icon}</div>
            <h2 className="text-3xl font-bold gradient-text">{rec.track}</h2>
            <p className="text-white/40 font-arabic mt-1">{rec.trackAr}</p>
            <p className="text-white/50 text-sm mt-2">Your 5-stage learning journey · رحلتك التعليمية من 5 مراحل</p>
          </div>

          <div className="space-y-3 mb-8">
            {mockRoadmapStages.slice(0, 3).map((stage, i) => (
              <GlassCard key={stage.id} padding={false} className="p-4 flex items-center gap-4">
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
            <GlassCard padding={false} className="p-4 text-center text-white/30 text-sm">
              + 2 more stages unlocked as you progress · +2 مراحل إضافية تُفتح تدريجياً
            </GlassCard>
          </div>

          <div className="text-center">
            <button
              onClick={handleFinish}
              className="btn-neon text-white px-12 py-4 rounded-2xl text-lg font-bold shadow-neon-cyan"
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
