import { useApi } from '@/hooks/useApi'
import { roadmapsAPI, ApiStage } from '@/services/api/roadmaps'
import { mockRoadmapStages, mockDashboardStats } from '@/data/mockData'
import GlassCard from '@/components/atoms/GlassCard'
import ProgressRing from '@/components/atoms/ProgressRing'

const statusConfig: Record<string, { badge: string; label: string }> = {
  completed:   { badge: 'bg-green-400/10 text-green-400 border-green-400/20',  label: 'Completed · مكتمل'  },
  in_progress: { badge: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',     label: 'In Progress · جاري' },
  locked:      { badge: 'bg-white/5 text-white/30 border-white/10',            label: 'Locked · مقفل'      },
}

function SkeletonStage() {
  return (
    <div className="flex gap-4 animate-pulse">
      <div className="hidden sm:block w-12 h-12 rounded-full bg-white/10 flex-shrink-0" />
      <div className="flex-1 bg-white/5 rounded-2xl p-5 space-y-3">
        <div className="h-3 w-1/4 bg-white/10 rounded" />
        <div className="h-4 w-1/2 bg-white/10 rounded" />
        <div className="h-3 w-3/4 bg-white/10 rounded" />
      </div>
    </div>
  )
}

export default function MyRoadmap() {
  const { data: roadmap, loading, error } = useApi(() => roadmapsAPI.myRoadmap())

  const rawStages: ApiStage[] =
    roadmap?.stages?.length
      ? roadmap.stages
      : (mockRoadmapStages as unknown as ApiStage[])

  const overallProgress = roadmap?.progress_percentage ?? mockDashboardStats.overallProgress
  const selectedTrack = roadmap?.track ?? mockDashboardStats.selectedTrack
  const completedCount = rawStages.filter(
    (s) => s.status === 'completed' || s.progress_percentage === 100
  ).length

  const nextStage = rawStages.find(
    (s) => s.status === 'in_progress' || (s.status !== 'completed' && s.progress_percentage !== 100)
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold gradient-text">{selectedTrack}</h2>
          <p className="text-white/40 text-sm font-arabic">{mockDashboardStats.selectedTrackAr}</p>
        </div>
        <ProgressRing percent={overallProgress} size={80} color="gradient" label="Progress" />
      </div>

      {error && !loading && (
        <div className="text-xs text-yellow-400/70 bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-4 py-2">
          ⚠️ Could not load live data — showing cached data · تعذّر تحميل البيانات الحية
        </div>
      )}

      <GlassCard padding={false} className="bg-[#0B1120] p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/60">Overall Progress · التقدم الكلي</span>
          <span className="text-cyan-400 font-bold">{completedCount}/{rawStages.length} stages</span>
        </div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full progress-gradient transition-all duration-700" style={{ width: `${overallProgress}%` }} />
        </div>
        {nextStage && (
          <p className="text-white/30 text-xs mt-2">Next: {nextStage.title}</p>
        )}
      </GlassCard>

      <div className="relative">
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-400 via-cyan-400/50 to-white/10 hidden sm:block" />
        <div className="space-y-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonStage key={i} />)
            : rawStages.map((stage, idx) => {
                const status = stage.status ?? 'locked'
                const cfg = statusConfig[status] ?? statusConfig.locked
                const isLocked = status === 'locked'
                const progress = (stage as any).progressPercent ?? stage.progress_percentage ?? 0
                const stageOrder = stage.stage_order ?? idx + 1
                const skills: string[] = (stage as any).skills ?? []
                const titleAr: string = (stage as any).titleAr ?? ''
                const description: string = stage.description ?? ''
                const estimatedHours: number = stage.estimated_hours ?? 0

                return (
                  <div key={stage.id} className={`flex gap-4 ${isLocked ? 'opacity-50' : ''}`}>
                    <div className="relative flex-shrink-0 hidden sm:flex">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold z-10 border
                        ${status === 'completed' ? 'bg-green-400 text-black border-green-400' :
                          status === 'in_progress' ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400 shadow-neon-cyan' :
                          'bg-white/5 text-white/30 border-white/15'}`}>
                        {status === 'completed' ? '✓' : stageOrder}
                      </div>
                    </div>

                    <GlassCard hover={!isLocked} neonBorder={status === 'in_progress'} className="bg-[#0B1120] flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-white/30 text-xs sm:hidden">Stage {stageOrder}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.badge}`}>{cfg.label}</span>
                            {estimatedHours > 0 && <span className="text-white/30 text-xs">{estimatedHours}h</span>}
                          </div>
                          <h3 className="text-white font-semibold text-base">{stage.title}</h3>
                          {titleAr && <p className="text-white/40 text-xs font-arabic">{titleAr}</p>}
                          {description && <p className="text-white/50 text-sm mt-2 leading-relaxed">{description}</p>}
                        </div>
                        {!isLocked && (
                          <ProgressRing percent={progress} size={60} strokeWidth={5}
                            color={status === 'completed' ? 'cyan' : 'gradient'}
                            className="flex-shrink-0 self-center sm:self-start" />
                        )}
                      </div>
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                          {skills.map((skill) => (
                            <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">{skill}</span>
                          ))}
                        </div>
                      )}
                      {!isLocked && (
                        <div className="mt-4 flex gap-2">
                          {status === 'in_progress' && (
                            <button className="px-4 py-1.5 rounded-lg btn-neon text-white text-xs font-medium">Continue · أكمل التعلم</button>
                          )}
                          {status === 'completed' && (
                            <button className="px-4 py-1.5 rounded-lg btn-glass text-white/60 text-xs font-medium">Review · مراجعة</button>
                          )}
                        </div>
                      )}
                    </GlassCard>
                  </div>
                )
              })}
        </div>
      </div>
    </div>
  )
}
