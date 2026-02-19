import { Link } from 'react-router-dom'
import GlassCard from '@/components/atoms/GlassCard'

const features = [
  {
    icon: '🧠',
    title: 'Smart Assessment',
    titleAr: 'تقييم ذكي',
    desc: '10 personalized questions to discover your ideal tech career path.',
    descAr: '10 أسئلة مخصصة لاكتشاف مسارك التقني الأمثل.',
  },
  {
    icon: '🗺️',
    title: 'Custom Roadmap',
    titleAr: 'خارطة طريق مخصصة',
    desc: 'Stage-by-stage learning plan tailored to your track and goals.',
    descAr: 'خطة تعلم مرحلة بمرحلة مصممة خصيصاً لمسارك.',
  },
  {
    icon: '👥',
    title: 'Study Groups',
    titleAr: 'مجموعات الدراسة',
    desc: '10-member study groups with shared interests and one dedicated mentor.',
    descAr: 'مجموعات من 10 أعضاء بنفس الاهتمامات ومرشد متخصص.',
  },
  {
    icon: '🎓',
    title: 'Expert Mentorship',
    titleAr: 'إرشاد الخبراء',
    desc: 'Connect with industry professionals from top tech companies.',
    descAr: 'تواصل مع محترفين من كبرى شركات التقنية.',
  },
  {
    icon: '📈',
    title: 'Market Insights',
    titleAr: 'رؤى سوق العمل',
    desc: 'Live salary benchmarks, job trends, and top in-demand skills.',
    descAr: 'معايير الرواتب الحية، واتجاهات الوظائف، والمهارات الأكثر طلباً.',
  },
  {
    icon: '🎯',
    title: 'Events & Networking',
    titleAr: 'الفعاليات والتواصل',
    desc: 'Hackathons, webinars, meetups — grow your network while you learn.',
    descAr: 'هاكاثونات، ندوات، لقاءات — وسّع شبكتك المهنية أثناء التعلم.',
  },
]

const stats = [
  { value: '5K+', label: 'Students', labelAr: 'طالب' },
  { value: '50+', label: 'Mentors', labelAr: 'مرشد' },
  { value: '10+', label: 'Career Tracks', labelAr: 'مسار مهني' },
  { value: '95%', label: 'Satisfaction', labelAr: 'رضا المستخدمين' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B1120] relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob w-[500px] h-[500px] bg-blue-700 top-[-15%] left-[-10%] animate-blob" />
      <div className="blob w-[400px] h-[400px] bg-violet-700 bottom-[-10%] right-[-10%] animate-blob-delayed" />
      <div className="blob w-[300px] h-[300px] bg-cyan-600 top-[40%] right-[15%] animate-blob-slow" />

      {/* Nav */}
      <nav className="relative z-20 glass-card rounded-none border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <span className="gradient-text text-2xl font-bold">Arshaad | أرشاد</span>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-glass text-white text-sm font-medium px-4 py-2 rounded-xl">
              Sign In · دخول
            </Link>
            <Link to="/login?tab=signup" className="btn-neon text-white text-sm font-semibold px-4 py-2 rounded-xl">
              Get Started · ابدأ
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-8 text-xs text-cyan-400 border border-cyan-400/20">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Now available for MENA CS students · متاح الآن لطلبة الحاسبات في مينا
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
          Your Career,<br />
          <span className="gradient-text-animated">Guided by AI</span>
        </h1>
        <p className="text-white/40 font-arabic text-xl mb-4">مسارك المهني، موجّه بالذكاء الاصطناعي</p>

        <p className="text-white/55 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Arshaad helps CS students in Egypt and MENA discover the right career path, get a personalized roadmap, join a study group, and land their dream job.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login?tab=signup"
            className="btn-neon text-white text-lg font-bold px-10 py-4 rounded-2xl"
          >
            Start For Free · ابدأ مجاناً 🚀
          </Link>
          <Link
            to="/login"
            className="btn-glass text-white/70 text-base px-8 py-4 rounded-2xl"
          >
            Sign In · تسجيل الدخول
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
          {stats.map(s => (
            <GlassCard key={s.label} className="text-center" padding={false}>
              <div className="p-4">
                <div className="gradient-text text-3xl font-extrabold">{s.value}</div>
                <div className="text-white/50 text-sm mt-1">{s.label}</div>
                <div className="text-white/25 text-xs font-arabic">{s.labelAr}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Everything you need to succeed</h2>
          <p className="text-white/40 font-arabic mt-2">كل ما تحتاجه لتحقيق النجاح المهني</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <GlassCard key={i} hover className="flex flex-col gap-3">
              <div className="text-4xl">{f.icon}</div>
              <div>
                <h3 className="text-white font-bold text-lg">{f.title}</h3>
                <p className="text-white/40 text-xs font-arabic">{f.titleAr}</p>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
              <p className="text-white/25 text-xs font-arabic leading-relaxed">{f.descAr}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <GlassCard neonBorder>
          <h2 className="text-3xl font-bold gradient-text mb-3">Ready to start your journey?</h2>
          <p className="text-white/40 font-arabic mb-6">هل أنت مستعد لبدء رحلتك المهنية؟</p>
          <Link to="/login?tab=signup" className="inline-block btn-neon text-white font-bold px-10 py-4 rounded-2xl text-lg">
            Join Arshaad Free · انضم مجاناً
          </Link>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center">
        <p className="text-white/20 text-sm">© 2026 Arshaad · أرشاد — Built for MENA CS Students</p>
      </footer>
    </div>
  )
}
