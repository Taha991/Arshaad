import { GroupMember } from '@/data/mockData'
import ProgressRing from '@/components/atoms/ProgressRing'

interface Props {
  member: GroupMember
}

export default function GroupMemberCard({ member }: Props) {
  return (
    <div className="glass-card p-4 flex flex-col items-center gap-3 text-center glass-card-hover">
      <div className="relative">
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.avatarColor} flex items-center justify-center text-white font-bold text-lg shadow-glass`}>
          {member.initials}
        </div>
        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0B1120] ${member.isOnline ? 'bg-green-400' : 'bg-gray-600'}`} />
      </div>

      <div>
        <p className="text-white font-semibold text-sm leading-tight">{member.name}</p>
        <p className="text-white/40 text-xs font-arabic">{member.nameAr}</p>
      </div>

      <div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
          {member.track}
        </span>
      </div>

      <ProgressRing percent={member.progressPercent} size={52} strokeWidth={4} color="gradient" showPercent />

      <p className="text-white/40 text-xs">{member.role}</p>
    </div>
  )
}
