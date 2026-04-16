import { useState } from 'react'
import EventCard from '@/components/organisms/EventCard'
import { mockEvents, EventItem } from '@/data/mockData'

type Category = 'All' | EventItem['category']

const categories: Category[] = ['All', 'Workshop', 'Webinar', 'Hackathon', 'Conference', 'Meetup']

export default function Events() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [onlineOnly, setOnlineOnly] = useState(false)

  const filtered = mockEvents.filter(e => {
    if (activeCategory !== 'All' && e.category !== activeCategory) return false
    if (onlineOnly && !e.isOnline) return false
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold gradient-text">Events</h2>
        <p className="text-white/40 text-sm mt-1 font-arabic">الفعاليات والأحداث القادمة</p>
      </div>

      {/* Filters */}
      <div className=" flex flex-wrap items-center gap-3">
        <div className=" flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                activeCategory === cat
                  ? 'bg-cyan-400/15 border-cyan-400/50 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={() => setOnlineOnly(v => !v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ml-auto ${
            onlineOnly
              ? 'bg-green-400/15 border-green-400/50 text-green-400'
              : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
          }`}
        >
          🌐 Online Only
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-white/40">No events match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
