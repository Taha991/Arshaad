import { mockRoadmapStages, mockDashboardStats } from '@/data/mockData'
import GlassCard from '@/components/atoms/GlassCard'
import ProgressRing from '@/components/atoms/ProgressRing'

const statusConfig = {
  completed:   { badge: 'bg-green-400/10 text-green-400 border-green-400/20',  label: 'Completed · مكتمل'  },
  in_progress: { badge: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',     label: 'In Progress · جاري' },
  locked:      { badge: 'bg-white/5 text-white/30 border-white/10',            label: 'Locked · مقفل'      },
}

export default function MyRoadmap() {
  const completedCount = mockRoadmapStages.filter(s => s.status === 'completed').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold gradient-text">{mockDashboardStats.selectedTrack}</h2>
          <p className="text-white/40 text-sm font-arabic">{mockDashboardStats.selectedTrackAr}</p>
        </div>
        <ProgressRing
          percent={mockDashboardStats.overallProgress}
          size={80}
          color="gradient"
          label="Progress"
        />
      </div>

      {/* Progress bar */}
      <GlassCard padding={false} className="bg-[#0B1120] p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/60">Overall Progress · التقدم الكلي</span>
          <span className="text-cyan-400 font-bold">{completedCount}/{mockRoadmapStages.length} stages</span>
        </div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full progress-gradient transition-all duration-700" style={{ width: `${mockDashboardStats.overallProgress}%` }} />
        </div>
        <p className="text-white/30 text-xs mt-2">
          Next: {mockDashboardStats.nextMilestone} · <span className="font-arabic">{mockDashboardStats.nextMilestoneAr}</span>
        </p>
      </GlassCard>

      {/* Stages timeline */}
      <div className="relative">
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-400 via-cyan-400/50 to-white/10 hidden sm:block" />
        <div className="space-y-4">
          {mockRoadmapStages.map(stage => {
            const cfg = statusConfig[stage.status]
            const isLocked = stage.status === 'locked'
            return (
              <div key={stage.id} className={`flex gap-4 ${isLocked ? 'opacity-50' : ''}`}>
                {/* Step circle */}
                <div className="relative flex-shrink-0 hidden sm:flex">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold z-10 border
                    ${stage.status === 'completed' ? 'bg-green-400 text-black border-green-400' :
                      stage.status === 'in_progress' ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400 shadow-neon-cyan' :
                      'bg-white/5 text-white/30 border-white/15'}`}>
                    {stage.status === 'completed' ? '✓' : stage.stage_order}
                  </div>
                </div>

                <GlassCard
                  hover={!isLocked}
                  neonBorder={stage.status === 'in_progress'}
                  className="bg-[#0B1120] flex-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-white/30 text-xs sm:hidden">Stage {stage.stage_order}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.badge}`}>{cfg.label}</span>
                        <span className="text-white/30 text-xs">{stage.estimated_hours}h</span>
                      </div>
                      <h3 className="text-white font-semibold text-base">{stage.title}</h3>
                      <p className="text-white/40 text-xs font-arabic">{stage.titleAr}</p>
                      <p className="text-white/50 text-sm mt-2 leading-relaxed">{stage.description}</p>
                    </div>
                    {!isLocked && (
                      <ProgressRing
                        percent={stage.progressPercent}
                        size={60}
                        strokeWidth={5}
                        color={stage.status === 'completed' ? 'cyan' : 'gradient'}
                        className="flex-shrink-0 self-center sm:self-start"
                      />
                    )}
                  </div>

                  {stage.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                      {stage.skills.map(skill => (
                        <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {!isLocked && (
                    <div className="mt-4 flex gap-2">
                      {stage.status === 'in_progress' && (
                        <button className="px-4 py-1.5 rounded-lg btn-neon text-white text-xs font-medium">
                          Continue · أكمل التعلم
                        </button>
                      )}
                      {stage.status === 'completed' && (
                        <button className="px-4 py-1.5 rounded-lg btn-glass text-white/60 text-xs font-medium">
                          Review · مراجعة
                        </button>
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
