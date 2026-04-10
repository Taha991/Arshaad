import { useState } from 'react'
import GroupMemberCard from '@/components/organisms/GroupMemberCard'
import MentorCard from '@/components/organisms/MentorCard'
import GlassCard from '@/components/atoms/GlassCard'
import { mockGroupMembers, mockMentor, mockDashboardStats } from '@/data/mockData'

export default function MyGroup() {
  const [activeView, setActiveView] = useState<'members' | 'mentor'>('members')
  const onlineCount = mockGroupMembers.filter(m => m.isOnline).length
  const avgProgress = Math.round(mockGroupMembers.reduce((a, m) => a + m.progressPercent, 0) / mockGroupMembers.length)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold gradient-text">{mockDashboardStats.groupName}</h2>
          <p className="text-white/40 text-sm font-arabic">{mockDashboardStats.groupNameAr}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('members')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeView === 'members'
                ? 'bg-cyan-400/10 border-cyan-400/50 text-cyan-400'
                : 'btn-glass text-white/60'
            }`}
          >
            Members · أعضاء
          </button>
          <button
            onClick={() => setActiveView('mentor')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeView === 'mentor'
                ? 'bg-cyan-400/10 border-cyan-400/50 text-cyan-400'
                : 'btn-glass text-white/60'
            }`}
          >
            Mentor · المرشد
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard padding={false} className="bg-[#0B1120] p-3 text-center">
          <p className="text-2xl font-bold text-white">{mockGroupMembers.length}</p>
          <p className="text-white/40 text-xs">Members · أعضاء</p>
        </GlassCard>
        <GlassCard padding={false} className="bg-[#0B1120] p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{onlineCount}</p>
          <p className="text-white/40 text-xs">Online Now · متصل الآن</p>
        </GlassCard>
        <GlassCard padding={false} className="bg-[#0B1120] p-3 text-center">
          <p className="text-2xl font-bold text-cyan-400">{avgProgress}%</p>
          <p className="text-white/40 text-xs">Avg Progress · متوسط التقدم</p>
        </GlassCard>
      </div>

      {/* Group progress bar */}
      <GlassCard padding={false} className="bg-[#0B1120] p-4">
        <div className=" flex justify-between text-sm mb-2">
          <span className="text-white/60">Group Average Progress</span>
          <span className="text-cyan-400 font-bold">{avgProgress}%</span>
        </div>
        <div className=" h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full progress-gradient transition-all duration-700" style={{ width: `${avgProgress}%` }} />
        </div>
      </GlassCard>

      {activeView === 'members' ? (
        <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {mockGroupMembers.map(member => (
            <GroupMemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className=" max-w-md mx-auto">
          <MentorCard mentor={mockMentor} />
        </div>
      )}
    </div>
  )
}
