import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/store/slices/authSlice'
import { AppDispatch, RootState } from '@/store/store'
import { mockDashboardStats } from '@/data/mockData'
 
// ── Types ─────────────────────────────────────────────────────────
interface Achievement {
  icon: string
  name: string
  rarity: 'epic' | 'rare' | 'common'
}
 
// ── Mock achievements (replace with API data later) ───────────────
const achievements: Achievement[] = [
  { icon: '🧠', name: 'AI Pioneer',    rarity: 'epic'   },
  { icon: '⚡', name: 'Speed Learner', rarity: 'rare'   },
  { icon: '🔥', name: 'On Fire',       rarity: 'rare'   },
  { icon: '🎓', name: 'First Step',    rarity: 'common' },
]
 
// ── Badge chip ────────────────────────────────────────────────────
function BadgeChip({ badge }: { badge: Achievement }) {
  const styles = {
    epic:   'bg-violet-500/10 border border-violet-500/25 text-violet-400',
    rare:   'bg-cyan-400/8  border border-cyan-400/20   text-cyan-400',
    common: 'bg-white/5     border border-white/8       text-white/40',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${styles[badge.rarity]}`}>
      {badge.icon} {badge.name}
    </span>
  )
}
 
// ── Stat cell ─────────────────────────────────────────────────────
function StatCell({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="text-center py-2 rounded-lg bg-white/[0.025]">
      <p className={`text-sm font-bold ${color}`}>{value}</p>
      <p className="text-[9px] text-white/30 mt-0.5">{label}</p>
    </div>
  )
}
 
// ── Main Component ────────────────────────────────────────────────
export default function ProfileDropdown() {
  const dispatch   = useDispatch<AppDispatch>()
  const navigate   = useNavigate()
  const { user }   = useSelector((s: RootState) => s.auth)
  const [open, setOpen]         = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editName, setEditName] = useState(user?.name ?? '')
  const containerRef = useRef<HTMLDivElement>(null)
 
  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setEditMode(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
 
  const handleLogout = async () => {
    setOpen(false)
    await dispatch(logout())
    navigate('/login')
  }
 
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'S'
 
  const weeklyPct = Math.round(
    (mockDashboardStats.weeklyCompletedHours / mockDashboardStats.weeklyGoalHours) * 100
  )
 
  return (
    <div ref={containerRef} className="relative">
 
      {/* ── Avatar button ──────────────────────────── */}
      <button
        onClick={() => { setOpen(v => !v); setEditMode(false) }}
        className={`w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500
          flex items-center justify-center text-white text-sm font-bold
          border-2 transition-all duration-200
          ${open
            ? 'border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
            : 'border-transparent hover:border-cyan-400/30'}`}
      >
        {user?.avatar
          ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
          : initials}
      </button>
 
      {/* ── Dropdown ───────────────────────────────── */}
      <div className={`absolute right-0 top-[calc(100%+10px)] w-[300px] z-50
        bg-[#0F1729] border border-white/10 rounded-2xl overflow-hidden
        shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(34,211,238,0.06)]
        transition-all duration-200 origin-top-right
        ${open
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
      >
 
        {/* ── Header ──────────────────────────────── */}
        <div className="px-5 pt-5 pb-4 bg-white/[0.02] border-b border-white/5 relative">
 
          {/* Avatar + edit photo */}
          <div className="relative inline-block mb-3">
            <div className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 opacity-60 -z-10" />
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold">
              {user?.avatar
                ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                : initials}
            </div>
            <button
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#0F1729] border border-white/15
                flex items-center justify-center text-[9px] text-white/50
                hover:border-cyan-400/40 hover:text-cyan-400 transition-colors"
              title="Change photo"
            >
              ✎
            </button>
          </div>
 
          {/* Name — normal / edit mode */}
          {editMode ? (
            <div className="flex items-center gap-2 mb-1">
              <input
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setEditMode(false)}
                className="flex-1 bg-white/5 border border-cyan-400/30 rounded-lg px-2 py-1
                  text-sm text-white outline-none focus:border-cyan-400/60 transition-colors"
              />
              <button
                onClick={() => setEditMode(false)}
                className="text-[10px] px-2 py-1 rounded-lg bg-cyan-400/10 text-cyan-400
                  border border-cyan-400/25 hover:bg-cyan-400/20 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-[15px] font-semibold text-white/90 mb-0.5">{editName || user?.name}</p>
          )}
 
          <p className="text-[11px] text-white/35">{user?.email}</p>
 
          {/* Track pill */}
          <div className="inline-flex items-center gap-1.5 mt-2.5 bg-cyan-400/8 border border-cyan-400/20 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[10px] font-medium text-cyan-400">{mockDashboardStats.selectedTrack}</span>
          </div>
 
          {/* Edit name button */}
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="absolute top-4 right-4 text-[10px] text-white/30 bg-white/5
                border border-white/8 rounded-md px-2 py-1
                hover:text-cyan-400 hover:border-cyan-400/25 transition-all"
            >
              ✎ Edit
            </button>
          )}
        </div>
 
        {/* ── Progress ────────────────────────────── */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] text-white/40">Roadmap Progress</span>
            <span className="text-[13px] font-bold text-cyan-400">{mockDashboardStats.overallProgress}%</span>
          </div>
          <div className="h-[5px] rounded-full bg-white/6 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 transition-all duration-700"
              style={{ width: `${mockDashboardStats.overallProgress}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <StatCell value={`${mockDashboardStats.streakDays}d`}          label="Streak 🔥"     color="text-orange-400" />
            <StatCell value={`${mockDashboardStats.totalHoursLearned}h`}   label="Hours"         color="text-cyan-400"   />
            <StatCell value={mockDashboardStats.rank}                       label="Rank 🏆"       color="text-yellow-400" />
          </div>
        </div>
 
        {/* ── Achievements ────────────────────────── */}
        <div className="px-5 py-3.5 border-b border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2 font-medium">Achievements</p>
          <div className="flex flex-wrap gap-1.5">
            {achievements.map(b => <BadgeChip key={b.name} badge={b} />)}
          </div>
        </div>
 
        {/* ── Actions ─────────────────────────────── */}
        <div className="p-2">
          <button
            onClick={() => { setEditMode(true); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
              text-left text-[12px] text-white/60
              hover:bg-white/5 hover:text-white/90 transition-all"
          >
            <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-sm">✎</span>
            <div>
              <p>Edit Profile</p>
              <p className="text-[9px] text-white/25 mt-0.5">تعديل الاسم والصورة</p>
            </div>
          </button>
 
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
              text-left text-[12px] text-red-400/70
              hover:bg-red-500/8 hover:text-red-400 transition-all"
          >
            <span className="w-7 h-7 rounded-lg bg-red-500/8 flex items-center justify-center text-sm">⏻</span>
            <div>
              <p>Logout · خروج</p>
              <p className="text-[9px] text-white/25 mt-0.5">تسجيل الخروج</p>
            </div>
          </button>
        </div>
 
      </div>
    </div>
  )
}