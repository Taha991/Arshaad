import { useRef } from 'react'
import GlassCard from '@/components/atoms/GlassCard'
import ProgressRing from '@/components/atoms/ProgressRing'
import { mockDashboardStats, mockRoadmapStages } from '@/data/mockData'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

function printReport() {
  window.print()
}

export default function Reports() {
  const reportRef = useRef<HTMLDivElement>(null)
  const user = useSelector((s: RootState) => s.auth.user)
  const completedStages = mockRoadmapStages.filter(s => s.status === 'completed').length
  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Progress Report</h2>
          <p className="text-white/40 text-sm font-arabic">تقرير التقدم</p>
        </div>
        <button
          onClick={printReport}
          className="no-print px-4 py-2 rounded-xl btn-neon text-white text-sm font-medium flex items-center gap-2"
        >
          <span>🖨️</span> Print / طباعة
        </button>
      </div>

      {/* Report Card */}
      <div ref={reportRef} className="space-y-5">
        {/* Header card */}
        <GlassCard neonBorder className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-2xl shadow-neon-blue`}>
            {user?.name?.[0]?.toUpperCase() ?? 'S'}
          </div>
          <div className="flex-1">
            <h3 className="text-white text-xl font-bold">{user?.name ?? 'Student'}</h3>
            <p className="text-white/50 text-sm">{user?.email}</p>
            <p className="text-white/30 text-xs mt-1">
              {mockDashboardStats.selectedTrack} · Generated {today}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs px-2.5 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
              {mockDashboardStats.rank} · {mockDashboardStats.rankAr}
            </div>
          </div>
        </GlassCard>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Overall Progress', labelAr: 'التقدم الكلي', value: mockDashboardStats.overallProgress, isPercent: true, color: 'gradient' as const },
            { label: 'Learning Streak', labelAr: 'سلسلة التعلم', value: mockDashboardStats.streakDays, suffix: 'd', color: 'cyan' as const },
            { label: 'Hours Completed', labelAr: 'ساعات منجزة', value: mockDashboardStats.totalHoursLearned, suffix: 'h', color: 'blue' as const },
            { label: 'Stages Done', labelAr: 'مراحل منتهية', value: completedStages, suffix: `/${mockRoadmapStages.length}`, color: 'violet' as const },
          ].map((item, i) => (
            <GlassCard key={i} className="flex flex-col items-center text-center gap-2">
              {item.isPercent ? (
                <ProgressRing percent={item.value} size={70} color="gradient" />
              ) : (
                <div className={`text-3xl font-bold ${item.color === 'cyan' ? 'text-cyan-400' : item.color === 'blue' ? 'text-blue-400' : 'text-violet-400'}`}>
                  {item.value}{item.suffix}
                </div>
              )}
              <div>
                <p className="text-white text-xs font-medium">{item.label}</p>
                <p className="text-white/30 text-xs font-arabic">{item.labelAr}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Roadmap progress */}
        <GlassCard padding={false} className="p-5">
          <h4 className="text-white font-semibold mb-4">Roadmap Progress · تقدم خارطة الطريق</h4>
          <div className="space-y-3">
            {mockRoadmapStages.map(stage => (
              <div key={stage.id} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                  ${stage.status === 'completed' ? 'bg-green-400 text-black' :
                    stage.status === 'in_progress' ? 'bg-cyan-400 text-black' :
                    'bg-white/10 text-white/30'}`}>
                  {stage.status === 'completed' ? '✓' : stage.stage_order}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <span className={`text-sm font-medium truncate ${stage.status === 'locked' ? 'text-white/30' : 'text-white'}`}>
                      {stage.title}
                    </span>
                    <span className="text-xs text-white/40 flex-shrink-0">{stage.progressPercent}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        stage.status === 'completed' ? 'bg-green-400' :
                        stage.status === 'in_progress' ? 'progress-gradient' : ''
                      }`}
                      style={{ width: `${stage.progressPercent}%` }}
                    />
                  </div>
                </div>
                <span className="text-white/30 text-xs flex-shrink-0">{stage.estimated_hours}h</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Weekly goal */}
        <GlassCard padding={false} className="p-5">
          <h4 className="text-white font-semibold mb-3">Weekly Goal · الهدف الأسبوعي</h4>
          <div className="flex items-center gap-4">
            <ProgressRing
              percent={Math.round((mockDashboardStats.weeklyCompletedHours / mockDashboardStats.weeklyGoalHours) * 100)}
              size={72}
              color="gradient"
            />
            <div>
              <p className="text-white text-lg font-bold">
                {mockDashboardStats.weeklyCompletedHours}h <span className="text-white/40 text-base">/ {mockDashboardStats.weeklyGoalHours}h</span>
              </p>
              <p className="text-white/50 text-sm">This week · هذا الأسبوع</p>
              <p className="text-cyan-400 text-xs mt-1">
                {mockDashboardStats.weeklyGoalHours - mockDashboardStats.weeklyCompletedHours}h remaining
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
