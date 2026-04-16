import { MentorProfile } from '@/data/mockData'
import GlassCard from '@/components/atoms/GlassCard'

interface Props {
  mentor: MentorProfile
}

export default function MentorCard({ mentor }: Props) {
  const groupSlots = Array.from({ length: mentor.maxGroups }, (_, i) => i < mentor.groupsCount)

  return (
    <GlassCard neonBorder className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mentor.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-neon-blue flex-shrink-0`}>
          {mentor.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight">{mentor.name}</h3>
          <p className="text-white/40 text-sm font-arabic">{mentor.nameAr}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-400 text-sm">{'★'.repeat(Math.round(mentor.rating))}</span>
            <span className="text-white/50 text-sm">{mentor.rating} · {mentor.yearsExperience}y exp</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-xs px-2 py-1 rounded-full bg-green-400/10 text-green-400 border border-green-400/20">
            {mentor.sessionRate}
          </span>
        </div>
      </div>

      <p className="text-white/60 text-sm leading-relaxed">{mentor.bio}</p>

      <div className="flex flex-wrap gap-2">
        {mentor.expertise.map(skill => (
          <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
            {skill}
          </span>
        ))}
      </div>

      <div>
        <p className="text-white/50 text-xs mb-2">
          Groups ({mentor.groupsCount}/{mentor.maxGroups}) — مجموعات ({mentor.groupsCount}/{mentor.maxGroups})
        </p>
        <div className="flex gap-1.5">
          {groupSlots.map((filled, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all ${filled ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      <button className="w-full py-2.5 rounded-xl btn-glass text-white text-sm font-medium hover:neon-border transition-all">
        Book a Session · احجز جلسة
      </button>
    </GlassCard>
  )
}
