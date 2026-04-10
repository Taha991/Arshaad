import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/store/slices/authSlice'
import { AppDispatch, RootState } from '@/store/store'
import GlassCard from '@/components/atoms/GlassCard'
import ProgressRing from '@/components/atoms/ProgressRing'
import MyRoadmap from './MyRoadmap'
import MarketInsights from './MarketInsights'
import MyGroup from './MyGroup'
import Events from './Events'
import Reports from './Reports'
import { mockDashboardStats, mockGroupMembers } from '@/data/mockData'

type Tab = 'overview' | 'roadmap' | 'market' | 'group' | 'events' | 'reports'

const tabs: { id: Tab; label: string; labelAr: string; icon: string }[] = [
  { id: 'overview',  label: 'Overview',  labelAr: 'نظرة عامة',  icon: '⊞' },
  { id: 'roadmap',   label: 'Roadmap',   labelAr: 'خارطة الطريق', icon: '🗺' },
  { id: 'market',    label: 'Market',    labelAr: 'السوق',       icon: '📈' },
  { id: 'group',     label: 'Group',     labelAr: 'مجموعتي',    icon: '👥' },
  { id: 'events',    label: 'Events',    labelAr: 'الفعاليات',   icon: '🎯' },
  { id: 'reports',   label: 'Reports',   labelAr: 'التقارير',    icon: '📊' },
]

function OverviewPanel({ userName }: { userName: string }) {
  const onlineCount = mockGroupMembers.filter(m => m.isOnline).length
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <GlassCard neonBorder className='bg-[#0B1120]'>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className=" text-2xl font-bold text-white">
              Welcome back, <span className="gradient-text">{userName}</span>! 👋
            </h2>
            <p className="text-white/40 mt-1 font-arabic">أهلاً بك مرة أخرى، {userName}</p>
            <p className="text-white/50 text-sm mt-2">
              Track: <span className="text-cyan-400">{mockDashboardStats.selectedTrack}</span>
              <span className="text-white/20 mx-2">·</span>
              <span className="font-arabic text-white/40">{mockDashboardStats.selectedTrackAr}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing percent={mockDashboardStats.overallProgress} size={80} color="gradient" label="Overall" />
          </div>
        </div>
      </GlassCard>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: '🔥', value: `${mockDashboardStats.streakDays}d`, label: 'Streak', labelAr: 'أيام متتالية', color: 'text-orange-400' },
          { icon: '⏱', value: `${mockDashboardStats.totalHoursLearned}h`, label: 'Hours Learned', labelAr: 'ساعات تعلم', color: 'text-cyan-400' },
          { icon: '🏆', value: mockDashboardStats.rank, label: 'Rank', labelAr: 'المرتبة', color: 'text-yellow-400' },
          { icon: '👥', value: `${onlineCount}/10`, label: 'Group Online', labelAr: 'متصل من مجموعتك', color: 'text-green-400' },
        ].map(s => (
          <GlassCard key={s.label} hover className="bg-[#0B1120] flex flex-col items-center text-center gap-1">
            <span className="text-3xl">{s.icon}</span>
            <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-white/50 text-xs">{s.label}</span>
            <span className="text-white/25 text-xs font-arabic">{s.labelAr}</span>
          </GlassCard>
        ))}
      </div>

      {/* Next milestone */}
      <GlassCard padding={false} className="bg-[#0B1120] p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
            🎯
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/50 text-xs mb-0.5">Next Milestone · الهدف القادم</p>
            <p className="text-white text-sm font-medium truncate">{mockDashboardStats.nextMilestone}</p>
            <p className="text-white/30 text-xs font-arabic truncate">{mockDashboardStats.nextMilestoneAr}</p>
          </div>
          <div className="flex-shrink-0">
            <div className="h-12 w-12">
              <ProgressRing
                percent={Math.round((mockDashboardStats.weeklyCompletedHours / mockDashboardStats.weeklyGoalHours) * 100)}
                size={48}
                strokeWidth={4}
                color="cyan"
                label="wk"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Group preview */}
      <GlassCard padding={false} className="bg-[#0B1120] p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-medium text-sm">{mockDashboardStats.groupName} · <span className="font-arabic text-white/40">{mockDashboardStats.groupNameAr}</span></p>
          <span className="text-xs text-green-400">{onlineCount} online</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {mockGroupMembers.map(m => (
            <div key={m.id} className="relative">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                {m.initials}
              </div>
              {m.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0B1120]" />
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

export default function StudentDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((s: RootState) => s.auth)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <span className="gradient-text text-xl font-bold flex-shrink-0">Arshaad | أرشاد</span>

          {/* Desktop tabs */}
          <nav className="hidden md:flex gap-0.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/30'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* User area */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-white text-xs font-medium leading-tight">{user?.name || user?.email}</p>
              <p className="text-white/30 text-xs">{user?.email && user?.name ? user.email : ''}</p>
            </div>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold`}>
              {user?.name?.[0]?.toUpperCase() ?? 'S'}
            </div>
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-white/70 text-xs transition-colors hidden sm:block"
            >
              Logout · خروج
            </button>
            {/* Mobile menu button */}
            <button
              className="md:hidden text-white/60 hover:text-white transition-colors ml-1"
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile tab dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 px-4 pb-3 pt-2 grid grid-cols-3 gap-1.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false) }}
                className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-all ${
                  activeTab === tab.id ? 'bg-cyan-400/10 text-cyan-400' : 'text-white/50'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview'  && <OverviewPanel userName={user?.name ?? 'Student'} />}
        {activeTab === 'roadmap'   && <MyRoadmap />}
        {activeTab === 'market'    && <MarketInsights />}
        {activeTab === 'group'     && <MyGroup />}
        {activeTab === 'events'    && <Events />}
        {activeTab === 'reports'   && <Reports />}
      </main>
    </div>
  )
}
