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
import ProfileDropdown from "@/pages/Dashboard/ProfileDropdown"
import News from "@/pages/Dashboard/News"
 
type Tab = 'overview' | 'roadmap' | 'market' | 'group' |'news'| 'events' | 'reports'
 
const tabs: { id: Tab; label: string; labelAr: string; icon: string }[] = [
  { id: 'overview',  label: 'Overview',  labelAr: 'نظرة عامة',    icon: '⊞' },
  { id: 'roadmap',   label: 'Roadmap',   labelAr: 'خارطة الطريق', icon: '🗺' },
  { id: 'market',    label: 'Market',    labelAr: 'السوق',         icon: '📈' },
  { id: 'group',     label: 'Group',     labelAr: 'مجموعتي',      icon: '👥' },
   { id: 'news', label: 'News', labelAr: 'الأخبار', icon: '📰' },
  { id: 'events',    label: 'Events',    labelAr: 'الفعاليات',     icon: '🎯' },
  { id: 'reports',   label: 'Reports',   labelAr: 'التقارير',      icon: '📊' },
]
 
// ── Activity heatmap data (mock — replace with API later) ─────────
const activityLevels = [0,0,1,2,3,4,2,1,3,4,3,2,1,0,2,3,4,3,2,1,3,4,3,2,1,2,3,1]
 
// ── Stage list (mock — replace with roadmap API later) ────────────
const mockStages = [
  { order: 1, title: 'Python Fundamentals',  titleAr: 'أساسيات بايثون',       hours: 20, status: 'done',     progress: 100 },
  { order: 2, title: 'Math for ML',           titleAr: 'رياضيات التعلم الآلي', hours: 24, status: 'done',     progress: 100 },
  { order: 3, title: 'Data Wrangling',        titleAr: 'معالجة البيانات',      hours: 18, status: 'done',     progress: 100 },
  { order: 4, title: 'Machine Learning Core', titleAr: 'أساسيات التعلم الآلي', hours: 32, status: 'active',   progress: 68  },
  { order: 5, title: 'Deep Learning',         titleAr: 'التعلم العميق',        hours: 40, status: 'upcoming', progress: 0   },
  { order: 6, title: 'Capstone Project',      titleAr: 'مشروع التخرج',         hours: 20, status: 'upcoming', progress: 0   },
]
 
// ── Mock achievements (replace with API later) ────────────────────
const mockAchievements = [
  { icon: '🧠', name: 'AI Pioneer',    nameAr: 'رائد الذكاء',   desc: 'Completed 3 ML projects', rarity: 'epic'   },
  { icon: '⚡', name: 'Speed Learner', nameAr: 'متعلم سريع',   desc: '20h in a single week',    rarity: 'rare'   },
  { icon: '🔥', name: 'On Fire',       nameAr: 'مشتعل',         desc: '21-day streak',           rarity: 'rare'   },
  { icon: '🎓', name: 'First Step',    nameAr: 'الخطوة الأولى', desc: 'Completed stage 1',       rarity: 'common' },
]
 
// ── Sub-components ────────────────────────────────────────────────
 
function StatCard({ icon, value, label, labelAr, color }: {
  icon: string; value: string; label: string; labelAr: string; color: string
}) {
  return (
    <GlassCard hover className="flex flex-col items-center text-center gap-1 py-5">
      <span className="text-3xl">{icon}</span>
      <span className={`text-xl font-bold ${color}`}>{value}</span>
      <span className="text-white/50 text-xs">{label}</span>
      <span className="text-white/25 text-xs font-arabic">{labelAr}</span>
    </GlassCard>
  )
}
 
function StageRow({ stage }: { stage: typeof mockStages[0] }) {
  const isDone     = stage.status === 'done'
  const isActive   = stage.status === 'active'
  const isUpcoming = stage.status === 'upcoming'
 
  const dotClass = isDone
    ? 'bg-green-400/15 text-green-400 border border-green-400/30'
    : isActive
    ? 'bg-cyan-400/12 text-cyan-400 border border-cyan-400/35'
    : 'bg-white/4 text-white/30 border border-white/8'
 
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors
      ${isActive
        ? 'border-cyan-400/20 bg-cyan-400/3'
        : 'border-white/5 bg-white/[0.02] hover:border-cyan-400/10'}
      ${isUpcoming ? 'opacity-50' : ''}`}
    >
      {/* Dot */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${dotClass}`}>
        {isDone ? '✓' : stage.order}
      </div>
 
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-cyan-400' : 'text-white/80'}`}>
          {stage.title}
        </p>
        <p className="text-xs text-white/30 font-arabic truncate">{stage.titleAr}</p>
        <p className="text-xs text-white/25 mt-0.5">{stage.hours}h</p>
      </div>
 
      {/* Progress or badge */}
      {isDone ? (
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20 flex-shrink-0">
          Done ✓
        </span>
      ) : !isUpcoming ? (
        <div className="w-20 flex-shrink-0">
          <p className="text-xs text-white/30 text-right mb-1">{stage.progress}%</p>
          <div className="h-1 rounded-full bg-white/6 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              style={{ width: `${stage.progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="w-20 flex-shrink-0">
          <p className="text-xs text-white/20 text-right mb-1">0%</p>
          <div className="h-1 rounded-full bg-white/4" />
        </div>
      )}
    </div>
  )
}
 
function ActivityHeatmap() {
  const colorMap: Record<number, string> = {
    0: 'bg-white/4',
    1: 'bg-cyan-400/15',
    2: 'bg-cyan-400/30',
    3: 'bg-cyan-400/55',
    4: 'bg-cyan-400/85',
  }
  return (
    <div>
      <p className="text-xs text-white/25 mb-2">Last 4 weeks</p>
      <div className="grid grid-cols-7 gap-1">
        {activityLevels.map((lvl, i) => (
          <div
            key={i}
            title={lvl === 0 ? 'No activity' : `Level ${lvl}`}
            className={`aspect-square rounded-sm ${colorMap[lvl]}`}
          />
        ))}
      </div>
    </div>
  )
}
 
function AchievementBadge({ badge }: { badge: typeof mockAchievements[0] }) {
  const iconBg = badge.rarity === 'epic'
    ? 'bg-violet-500/15 border-violet-500/30'
    : badge.rarity === 'rare'
    ? 'bg-cyan-400/10 border-cyan-400/25'
    : 'bg-white/5 border-white/8'
 
  const rarityStyle = badge.rarity === 'epic'
    ? 'bg-violet-500/15 text-violet-400'
    : badge.rarity === 'rare'
    ? 'bg-cyan-400/10 text-cyan-400'
    : 'bg-white/5 text-white/40'
 
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.025] border border-white/5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border ${iconBg}`}>
        {badge.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white/90">{badge.name}</p>
        <p className="text-xs text-white/30 font-arabic">{badge.nameAr}</p>
      </div>
      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${rarityStyle}`}>
        {badge.rarity}
      </span>
    </div>
  )
}
 
// ── Main OverviewPanel ────────────────────────────────────────────
 
function OverviewPanel({ userName }: { userName: string }) {
  const onlineCount = mockGroupMembers.filter(m => m.isOnline).length
  const weeklyPct   = Math.round((mockDashboardStats.weeklyCompletedHours / mockDashboardStats.weeklyGoalHours) * 100)
 
  return (
    <div className="space-y-4 animate-fade-in">
 
      {/* ── Welcome ───────────────────────────────── */}
      <GlassCard neonBorder padding={false} className="px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Welcome back, <span className="gradient-text">{userName}</span>! 👋
            </h2>
            <p className="text-white/35 mt-1 text-sm font-arabic">أهلاً بك مرة أخرى، {userName}</p>
            <p className="text-white/40 text-xs mt-2">
              Track: <span className="text-cyan-400">{mockDashboardStats.selectedTrack}</span>
              <span className="text-white/15 mx-2">·</span>
              <span className="font-arabic text-white/30">{mockDashboardStats.selectedTrackAr}</span>
            </p>
          </div>
          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="text-center">
              <ProgressRing percent={mockDashboardStats.overallProgress} size={80} color="gradient" />
              <p className="text-white/35 text-xs mt-1">Overall</p>
            </div>
            <div className="text-center">
              <ProgressRing percent={weeklyPct} size={80} color="cyan" />
              <p className="text-white/35 text-xs mt-1">This week</p>
            </div>
          </div>
        </div>
      </GlassCard>
 
      {/* ── Stats grid ────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon="🔥" value={`${mockDashboardStats.streakDays}d`}          label="Streak"       labelAr="أيام متتالية"    color="text-orange-400" />
        <StatCard icon="⏱" value={`${mockDashboardStats.totalHoursLearned}h`}   label="Hours Learned" labelAr="ساعات تعلم"     color="text-cyan-400"   />
        <StatCard icon="🏆" value={mockDashboardStats.rank}                       label="Rank"          labelAr="المرتبة"        color="text-yellow-400" />
        <StatCard icon="👥" value={`${onlineCount}/10`}                           label="Group Online"  labelAr="متصل من مجموعتك" color="text-green-400" />
      </div>
 
      {/* ── Two-column layout ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
 
        {/* LEFT: roadmap + group ──────────────────── */}
        <div className="space-y-4">
 
          {/* Roadmap card */}
          <GlassCard padding={false} className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-white/35 uppercase tracking-widest mb-1 font-medium">My Roadmap</p>
                <p className="text-base font-semibold text-white">{mockDashboardStats.selectedTrack} Path</p>
                <p className="text-xs text-white/30 mt-0.5">12 weeks · 6 stages · Intermediate</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold gradient-text">{mockDashboardStats.overallProgress}%</p>
                <p className="text-xs text-white/30">Complete</p>
              </div>
            </div>
 
            {/* Overall bar */}
            <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-1">
              <div
                className="h-full rounded-full progress-gradient transition-all duration-700"
                style={{ width: `${mockDashboardStats.overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/25 mb-5">
              <span>Stage 4 of 6</span>
              <span>Est. 5 weeks left</span>
            </div>
 
            {/* Stages */}
            <div className="space-y-2">
              {mockStages.map(s => <StageRow key={s.order} stage={s} />)}
            </div>
          </GlassCard>
 
          {/* Group card */}
          <GlassCard padding={false} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  {mockDashboardStats.groupName}
                  <span className="text-white/30 mx-1">·</span>
                  <span className="font-arabic text-white/35 text-xs">{mockDashboardStats.groupNameAr}</span>
                </p>
                <p className="text-xs text-white/25 mt-0.5">Cohort 12 · Started March 2025</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                {onlineCount} online
              </span>
            </div>
 
            <div className="space-y-1.5">
              {mockGroupMembers.slice(0, 6).map(m => (
                <div key={m.id} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="relative flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${m.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                      {m.initials}
                    </div>
                    {m.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-[#0B1120]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/80 truncate">{m.name}</p>
                    <p className="text-xs text-white/25 font-arabic truncate">{m.nameAr}</p>
                  </div>
                  <div className="flex-shrink-0 w-16">
                    <div className="h-1 rounded-full bg-white/6 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: `${m.progressPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/25 text-right mt-0.5">{m.progressPercent}%</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
 
        </div>{/* /left */}
 
        {/* RIGHT column ───────────────────────────── */}
        <div className="space-y-4">
 
          {/* Next milestone */}
          <GlassCard neonBorder padding={false} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-400/8 border border-cyan-400/20 flex items-center justify-center text-xl flex-shrink-0">
                🎯
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/35 text-xs mb-0.5">Next Milestone · الهدف القادم</p>
                <p className="text-white text-sm font-medium truncate">{mockDashboardStats.nextMilestone}</p>
                <p className="text-white/30 text-xs font-arabic truncate">{mockDashboardStats.nextMilestoneAr}</p>
              </div>
              <ProgressRing
                percent={weeklyPct}
                size={48}
                strokeWidth={4}
                color="cyan"
                label="wk"
                className="flex-shrink-0"
              />
            </div>
          </GlassCard>
 
          {/* Streak */}
          <GlassCard padding={false} className="p-5">
            <p className="text-xs text-white/35 uppercase tracking-widest mb-4 font-medium">Learning Streak</p>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">🔥</span>
              <div>
                <p className="text-3xl font-bold text-orange-400 leading-none">{mockDashboardStats.streakDays}</p>
                <p className="text-xs text-white/50 mt-0.5">Day streak</p>
                <p className="text-xs text-white/25 font-arabic">أيام متتالية</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-center py-3 rounded-xl bg-white/[0.025] border border-white/5">
                <p className="text-lg font-bold text-orange-400">42</p>
                <p className="text-xs text-white/30">Longest streak</p>
              </div>
              <div className="text-center py-3 rounded-xl bg-white/[0.025] border border-white/5">
                <p className="text-lg font-bold text-cyan-400">68</p>
                <p className="text-xs text-white/30">Total study days</p>
              </div>
            </div>
            <ActivityHeatmap />
          </GlassCard>
 
          {/* Achievements */}
          <GlassCard padding={false} className="p-5">
            <p className="text-xs text-white/35 uppercase tracking-widest mb-3 font-medium">Achievements</p>
            <div className="space-y-2">
              {mockAchievements.map(b => <AchievementBadge key={b.name} badge={b} />)}
            </div>
          </GlassCard>
 
        </div>{/* /right */}
      </div>{/* /two-col */}
 
    </div>
  )
}
 
// ── StudentDashboard (unchanged) ──────────────────────────────────
 
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
          <ProfileDropdown />
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
        {activeTab === 'news' && <News />}
      </main>
    </div>
  )
}
