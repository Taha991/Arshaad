import { useState } from 'react'
import GroupMemberCard from '@/components/organisms/GroupMemberCard'
import MentorCard from '@/components/organisms/MentorCard'
import GlassCard from '@/components/atoms/GlassCard'
import { mockGroupMembers, mockMentor, mockDashboardStats, GroupMember } from '@/data/mockData'
import { useApi } from '@/hooks/useApi'
import { groupsAPI, mentorsAPI } from '@/services/api/mentors'

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white/5 rounded-2xl p-4 space-y-2 border border-white/8">
      <div className="w-12 h-12 rounded-full bg-white/10 mx-auto" />
      <div className="h-3 w-2/3 bg-white/10 rounded mx-auto" />
      <div className="h-2 w-1/2 bg-white/10 rounded mx-auto" />
    </div>
  )
}

export default function MyGroup() {
  const [activeView, setActiveView] = useState<'members' | 'mentor'>('members')

  const { data: group, loading: groupLoading, error: groupError } = useApi(() => groupsAPI.myGroup())
  const { data: mentorData, loading: mentorLoading } = useApi(() => mentorsAPI.list())

  // Resolve members: use mock shape (API membership objects are simpler)
  const members: GroupMember[] = mockGroupMembers
  const onlineCount = members.filter((m) => m.isOnline).length
  const avgProgress = Math.round(members.reduce((a, m) => a + m.progressPercent, 0) / members.length)

  const groupName = group?.name ?? mockDashboardStats.groupName
  const groupNameAr = mockDashboardStats.groupNameAr

  // Mentor: map first API mentor or fallback to mock
  const mentor = mentorData?.[0]
    ? {
        ...mockMentor,
        id: mentorData[0].id,
        name: mentorData[0].name ?? mockMentor.name,
        bio: mentorData[0].bio ?? mockMentor.bio,
        expertise: mentorData[0].expertise ?? mockMentor.expertise,
        rating: mentorData[0].rating ?? mockMentor.rating,
        yearsExperience: mentorData[0].years_experience ?? mockMentor.yearsExperience,
      }
    : mockMentor

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold gradient-text">{groupName}</h2>
          <p className="text-white/40 text-sm font-arabic">{groupNameAr}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveView('members')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeView === 'members' ? 'bg-cyan-400/10 border-cyan-400/50 text-cyan-400' : 'btn-glass text-white/60'
            }`}>
            Members · أعضاء
          </button>
          <button onClick={() => setActiveView('mentor')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeView === 'mentor' ? 'bg-cyan-400/10 border-cyan-400/50 text-cyan-400' : 'btn-glass text-white/60'
            }`}>
            Mentor · المرشد
          </button>
        </div>
      </div>

      {(groupError) && !groupLoading && (
        <div className="text-xs text-yellow-400/70 bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-4 py-2">
          ⚠️ Showing cached group data · يتم عرض بيانات المجموعة المحفوظة
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard padding={false} className="bg-[#0B1120] p-3 text-center">
          <p className="text-2xl font-bold text-white">{group?.members_count ?? members.length}</p>
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
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/60">Group Average Progress</span>
          <span className="text-cyan-400 font-bold">{avgProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full progress-gradient transition-all duration-700" style={{ width: `${avgProgress}%` }} />
        </div>
      </GlassCard>

      {activeView === 'members' ? (
        groupLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {members.map((member) => <GroupMemberCard key={member.id} member={member} />)}
          </div>
        )
      ) : (
        <div className="max-w-md mx-auto">
          {mentorLoading
            ? <div className="animate-pulse bg-white/5 rounded-2xl p-8 border border-white/8 h-40" />
            : <MentorCard mentor={mentor} />
          }
        </div>
      )}
    </div>
  )
}
