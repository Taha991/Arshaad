import SalaryChart from '@/components/organisms/SalaryChart'
import GlassCard from '@/components/atoms/GlassCard'
import { mockTopSkills } from '@/data/mockData'
import { useApi } from '@/hooks/useApi'
import { marketAPI, ApiMarketAnalytics } from '@/services/api/jobs'

function buildSkillsFromAnalytics(analytics: ApiMarketAnalytics[]) {
  const skills: { skill: string; demandScore: number; category: string }[] = []
  analytics.forEach((a) => {
    ;(a.top_skills ?? []).forEach((s) => {
      if (!skills.find((x) => x.skill === s)) {
        skills.push({ skill: s, demandScore: a.demand_score ?? 70, category: a.track })
      }
    })
  })
  return skills.sort((a, b) => b.demandScore - a.demandScore).slice(0, 10)
}

export default function MarketInsights() {
  const { data: analytics, loading, error } = useApi(() => marketAPI.analytics())

  const topSkills =
    analytics?.length ? buildSkillsFromAnalytics(analytics) : mockTopSkills

  // Summary stats from API or hardcoded fallback
  const totalJobs = analytics?.reduce((a, x) => a + (x.job_count ?? 0), 0) ?? 0
  const avgGrowth = analytics?.length
    ? Math.round(analytics.reduce((a, x) => a + (x.growth_percent ?? 0), 0) / analytics.length)
    : 28

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Market Insights</h2>
        <p className="text-white/40 text-sm mt-1 font-arabic">رؤى سوق العمل التقني</p>
      </div>

      {error && !loading && (
        <div className="text-xs text-yellow-400/70 bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-4 py-2">
          ⚠️ Showing cached market data · يتم عرض بيانات السوق المحفوظة
        </div>
      )}

      {/* Salary Chart */}
      <GlassCard padding={false} className="bg-[#0B1120] p-6">
        <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
          <span className="text-xl">💰</span>
          Salary Benchmarks <span className="text-white/30 text-sm font-arabic">/ معايير الرواتب</span>
        </h3>
        <SalaryChart />
      </GlassCard>

      {/* Top Skills */}
      <GlassCard padding={false} className="bg-[#0B1120] p-6">
        <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
          <span className="text-xl">🔥</span>
          Top In-Demand Skills <span className="text-white/30 text-sm font-arabic">/ المهارات الأكثر طلباً</span>
        </h3>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-3 bg-white/10 rounded" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-1/2 bg-white/10 rounded" />
                  <div className="h-1.5 rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {topSkills.map((s, i) => (
              <div key={s.skill} className="flex items-center gap-3">
                <span className="text-white/30 text-xs w-4 text-right">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-white text-sm font-medium">{s.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">{s.category}</span>
                      <span className="text-cyan-400 text-xs font-bold">{s.demandScore}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full progress-gradient transition-all duration-700" style={{ width: `${s.demandScore}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            emoji: '📈', title: 'Tech Jobs Growth', titleAr: 'نمو وظائف التقنية',
            value: `+${avgGrowth}%`, sub: 'Year over Year', color: 'text-green-400',
          },
          {
            emoji: '💼', title: 'Total Tech Jobs', titleAr: 'إجمالي وظائف التقنية',
            value: totalJobs > 0 ? totalJobs.toLocaleString() : '54K+', sub: 'active listings', color: 'text-cyan-400',
          },
          {
            emoji: '🎓', title: 'Hiring CS Grads', titleAr: 'توظيف خريجي الحاسبات',
            value: '3.2x', sub: 'vs 5 years ago', color: 'text-violet-400',
          },
        ].map((card) => (
          <GlassCard key={card.title} hover className="bg-[#0B1120] text-center">
            <div className="text-4xl mb-3">{card.emoji}</div>
            <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
            <p className="text-white font-medium mt-1 text-sm">{card.title}</p>
            <p className="text-white/30 text-xs font-arabic">{card.titleAr}</p>
            <p className="text-white/40 text-xs mt-1">{card.sub}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
