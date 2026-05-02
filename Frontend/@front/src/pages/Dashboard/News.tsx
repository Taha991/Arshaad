import { useState, useMemo } from 'react'
import GlassCard from '@/components/atoms/GlassCard'
import NewsCard from '@/components/organisms/NewsCard'
import { mockNewsItems, newsTrackFilters, NewsItem } from '@/data/newsData'
import { mockDashboardStats } from '@/data/mockData'

type CategoryFilter = 'All' | NewsItem['category']
type SortOption = 'newest' | 'oldest' | 'hot'

const categoryFilters: { id: CategoryFilter; labelAr: string; icon: string }[] = [
  { id: 'All',               labelAr: 'الكل',                icon: '🌐' },
  { id: 'Framework Update',  labelAr: 'فريمووركس',           icon: '🔧' },
  { id: 'Language Release',  labelAr: 'إصدار لغات',         icon: '📦' },
  { id: 'AI & ML',           labelAr: 'ذكاء اصطناعي',       icon: '🧠' },
  { id: 'Job Market',        labelAr: 'سوق العمل',           icon: '💼' },
  { id: 'Security',          labelAr: 'أمن معلومات',         icon: '🔐' },
  { id: 'Tech Update',       labelAr: 'تحديثات',             icon: '⚡' },
  { id: 'Community',         labelAr: 'مجتمع',               icon: '🤝' },
]

const statCards = [
  { icon: '📰', value: '12', label: 'New This Week', labelAr: 'جديد الأسبوع', color: 'text-cyan-400' },
  { icon: '🔥', value: '5',  label: 'Trending Now',  labelAr: 'ترند الآن',    color: 'text-orange-400' },
  { icon: '🎯', value: '3',  label: 'For Your Track',labelAr: 'تراكك',         color: 'text-violet-400' },
  { icon: '💼', value: '+18%',label: 'Salary Growth', labelAr: 'نمو الرواتب', color: 'text-green-400' },
]

export default function News() {
  const [activeTrack, setActiveTrack] = useState<string>('all')
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarked, setBookmarked] = useState<number[]>([])

  // Derived: user's track for "my track" highlight
  const userTrack = mockDashboardStats.selectedTrack // e.g. "Frontend Development"
  const userTrackShort = userTrack.replace(' Development', '').replace(' Engineering', '')

  const filtered = useMemo(() => {
    let items = [...mockNewsItems]

    // Track filter
    if (activeTrack !== 'all') {
      items = items.filter(i => i.track.includes(activeTrack))
    }

    // Category filter
    if (activeCategory !== 'All') {
      items = items.filter(i => i.category === activeCategory)
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.titleAr.includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q)) ||
        i.summary.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'newest') items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (sortBy === 'oldest') items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    if (sortBy === 'hot') items.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0))

    return items
  }, [activeTrack, activeCategory, sortBy, searchQuery])

  const featured = useMemo(() =>
    mockNewsItems.filter(i => i.isFeatured).slice(0, 2),
    []
  )

  const myTrackNews = useMemo(() =>
    mockNewsItems.filter(i => i.track.some(t => userTrackShort.includes(t) || t.includes(userTrackShort))).slice(0, 3),
    [userTrackShort]
  )

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Tech News</h2>
          <p className="text-white/40 text-sm mt-1 font-arabic">أخبار التقنية والتحديثات التقنية</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 font-arabic">آخر تحديث · just now</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      {/* ── Quick stats ───────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map(s => (
          <GlassCard key={s.label} hover className="flex flex-col items-center text-center gap-1 py-4">
            <span className="text-3xl">{s.icon}</span>
            <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-white/50 text-xs">{s.label}</span>
            <span className="text-white/25 text-xs font-arabic">{s.labelAr}</span>
          </GlassCard>
        ))}
      </div>

      {/* ── Featured ──────────────────────────────────── */}
      <section>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="text-lg">⭐</span>
          Featured Stories
          <span className="text-white/30 text-sm font-arabic">/ الأخبار المميزة</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featured.map(item => (
            <div key={item.id} className="relative">
              <NewsCard item={item} featured />
              <button
                onClick={() => toggleBookmark(item.id)}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all z-10 ${
                  bookmarked.includes(item.id)
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/40'
                    : 'bg-white/5 text-white/30 border border-white/10 hover:text-white/60'
                }`}
              >
                {bookmarked.includes(item.id) ? '🔖' : '📌'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── My Track news ─────────────────────────────── */}
      <section>
        <GlassCard padding={false} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Your Track Updates
              <span className="text-cyan-400 text-xs px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 font-arabic">
                {userTrack}
              </span>
            </h3>
            <span className="text-white/30 text-xs font-arabic">تحديثات تراكك</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {myTrackNews.length > 0 ? myTrackNews.map(item => (
              <div key={item.id} className="glass-card p-4 flex flex-col gap-2 rounded-xl border border-white/5 hover:border-cyan-400/20 transition-colors">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    item.category === 'Framework Update' ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20' :
                    item.category === 'Language Release' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' :
                    'bg-violet-400/10 text-violet-400 border-violet-400/20'
                  }`}>{item.category}</span>
                  {item.isHot && <span className="text-orange-400 text-xs">🔥</span>}
                </div>
                <p className="text-white text-sm font-medium leading-snug line-clamp-2">{item.title}</p>
                <p className="text-white/30 text-xs font-arabic line-clamp-1">{item.titleAr}</p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 text-xs text-white/30">
                  <span>{item.source}</span>
                  <a href={item.sourceUrl} className="text-cyan-400 hover:text-cyan-300 transition-colors">Read →</a>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-8 text-white/30">
                <p>No updates for your track yet. Check back soon!</p>
              </div>
            )}
          </div>
        </GlassCard>
      </section>

      {/* ── All News ──────────────────────────────────── */}
      <section>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="text-lg">📰</span>
          All News
          <span className="text-white/30 text-sm font-arabic">/ جميع الأخبار</span>
          <span className="text-xs text-white/30 ml-auto">{filtered.length} articles</span>
        </h3>

        {/* ── Search & Sort ──────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search articles, tags, topics… / ابحث هنا"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.07] transition-all"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-cyan-400/40 transition-all cursor-pointer appearance-none sm:w-40"
          >
            <option value="newest" className="bg-[#0B1120]">Newest First</option>
            <option value="oldest" className="bg-[#0B1120]">Oldest First</option>
            <option value="hot"    className="bg-[#0B1120]">🔥 Trending</option>
          </select>
        </div>

        {/* ── Track filter pills ─────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-4">
          {newsTrackFilters.map(tf => (
            <button
              key={tf.id}
              onClick={() => setActiveTrack(tf.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                activeTrack === tf.id
                  ? 'bg-cyan-400/15 border-cyan-400/50 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
              }`}
            >
              <span>{tf.icon}</span>
              <span>{tf.label}</span>
              <span className="text-white/25 font-arabic text-[10px]">{tf.labelAr}</span>
            </button>
          ))}
        </div>

        {/* ── Category chips ─────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categoryFilters.map(cf => (
            <button
              key={cf.id}
              onClick={() => setActiveCategory(cf.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                activeCategory === cf.id
                  ? 'bg-violet-400/15 border-violet-400/50 text-violet-400'
                  : 'bg-white/4 border-white/8 text-white/40 hover:border-white/15'
              }`}
            >
              <span className="text-[11px]">{cf.icon}</span>
              <span>{cf.id === 'All' ? 'All' : cf.id}</span>
              <span className="text-white/20 font-arabic text-[9px]">{cf.labelAr}</span>
            </button>
          ))}
        </div>

        {/* ── News Grid ──────────────────────────────── */}
        {filtered.length === 0 ? (
          <GlassCard className="text-center py-14">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white/50 font-medium">No articles match your filters</p>
            <p className="text-white/25 text-sm mt-1 font-arabic">لا توجد مقالات تطابق الفلاتر المحددة</p>
            <button
              onClick={() => { setActiveTrack('all'); setActiveCategory('All'); setSearchQuery('') }}
              className="mt-4 px-4 py-2 text-xs text-cyan-400 border border-cyan-400/30 rounded-lg hover:bg-cyan-400/10 transition-all"
            >
              Clear Filters · مسح الفلاتر
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="relative">
                <NewsCard item={item} />
                <button
                  onClick={() => toggleBookmark(item.id)}
                  className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all z-10 ${
                    bookmarked.includes(item.id)
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/40'
                      : 'bg-white/5 text-white/20 border border-white/8 hover:text-white/50'
                  }`}
                >
                  {bookmarked.includes(item.id) ? '🔖' : '📌'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Bookmarks strip ───────────────────────────── */}
      {bookmarked.length > 0 && (
        <section>
          <GlassCard padding={false} className="p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🔖</span>
              Bookmarked Articles
              <span className="text-white/30 text-sm font-arabic">/ المحفوظات</span>
              <span className="ml-auto text-xs bg-cyan-400/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-400/20">
                {bookmarked.length}
              </span>
            </h3>
            <div className="space-y-2">
              {mockNewsItems.filter(i => bookmarked.includes(i.id)).map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6 hover:border-white/12 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-white/35">
                      <span>{item.source}</span>
                      <span>·</span>
                      <span>{item.readTime}m read</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={item.sourceUrl} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors px-2">Read →</a>
                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className="text-xs text-white/30 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>
      )}

    </div>
  )
}
