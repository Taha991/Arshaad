import { useState } from 'react'
import EventCard from '@/components/organisms/EventCard'
import { mockEvents, EventItem } from '@/data/mockData'
import { useApi } from '@/hooks/useApi'
import { eventsAPI, ApiEvent } from '@/services/api/events'

type Category = 'All' | EventItem['category']
const categories: Category[] = ['All', 'Workshop', 'Webinar', 'Hackathon', 'Conference', 'Meetup']

// Map API event → EventItem shape used by EventCard
function toEventItem(e: ApiEvent): EventItem {
  return {
    id: e.id,
    title: e.title,
    titleAr: e.title,
    description: e.description ?? '',
    descriptionAr: e.description ?? '',
    category: (e.category as EventItem['category']) ?? 'Workshop',
    categoryAr: e.category ?? 'Workshop',
    date: e.event_date ?? '',
    location: e.location ?? 'Online',
    locationAr: e.location ?? 'أونلاين',
    isOnline: e.is_online ?? false,
    registrationUrl: e.registration_url ?? '#',
    speaker: e.speaker ?? '',
    speakerAr: e.speaker ?? '',
    tags: e.tags ?? [],
    spotsLeft: e.spots_left ?? 0,
    totalSpots: e.total_spots ?? 0,
  }
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white/5 rounded-2xl p-5 space-y-3 border border-white/8">
      <div className="h-3 w-1/4 bg-white/10 rounded" />
      <div className="h-5 w-3/4 bg-white/10 rounded" />
      <div className="h-3 w-full bg-white/10 rounded" />
      <div className="h-3 w-2/3 bg-white/10 rounded" />
    </div>
  )
}

export default function Events() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [onlineOnly, setOnlineOnly] = useState(false)

  const { data: apiEvents, loading, error } = useApi(() => eventsAPI.list())

  // Use real data if available, fallback to mock
  const source: EventItem[] = apiEvents?.length
    ? apiEvents.map(toEventItem)
    : mockEvents

  const filtered = source.filter((e) => {
    if (activeCategory !== 'All' && e.category !== activeCategory) return false
    if (onlineOnly && !e.isOnline) return false
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Events</h2>
        <p className="text-white/40 text-sm mt-1 font-arabic">الفعاليات والأحداث القادمة</p>
      </div>

      {error && !loading && (
        <div className="text-xs text-yellow-400/70 bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-4 py-2">
          ⚠️ Showing cached events · يتم عرض الفعاليات المحفوظة
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                activeCategory === cat
                  ? 'bg-cyan-400/15 border-cyan-400/50 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
              }`}>
              {cat}
            </button>
          ))}
        </div>
        <button onClick={() => setOnlineOnly((v) => !v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ml-auto ${
            onlineOnly
              ? 'bg-green-400/15 border-green-400/50 text-green-400'
              : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
          }`}>
          🌐 Online Only
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-white/40">No events match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  )
}
