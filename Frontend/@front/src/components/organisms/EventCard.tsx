import { EventItem } from '@/data/mockData'
import GlassCard from '@/components/atoms/GlassCard'

interface Props {
  event: EventItem
}

const categoryColors: Record<string, string> = {
  Workshop:    'bg-blue-400/10 text-blue-400 border-blue-400/20',
  Webinar:     'bg-violet-400/10 text-violet-400 border-violet-400/20',
  Hackathon:   'bg-orange-400/10 text-orange-400 border-orange-400/20',
  Conference:  'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
  Meetup:      'bg-green-400/10 text-green-400 border-green-400/20',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function EventCard({ event }: Props) {
  const spotsPercent = Math.round((event.spotsLeft / event.totalSpots) * 100)
  const isUrgent = event.spotsLeft < 30

  return (
    <GlassCard hover className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[event.category] || categoryColors.Workshop}`}>
              {event.category}
            </span>
            {event.isOnline && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20">
                Online
              </span>
            )}
            {isUrgent && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 border border-red-400/20 animate-pulse">
                Almost Full!
              </span>
            )}
          </div>
          <h3 className="text-white font-semibold text-base leading-snug">{event.title}</h3>
          <p className="text-white/40 text-xs font-arabic mt-0.5">{event.titleAr}</p>
        </div>
      </div>

      <p className="text-white/55 text-sm leading-relaxed line-clamp-2">{event.description}</p>

      <div className="grid grid-cols-2 gap-2 text-xs text-white/50">
        <div className="flex items-center gap-1.5">
          <span>📅</span>
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>📍</span>
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🎤</span>
          <span>{event.speaker}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🪑</span>
          <span className={isUrgent ? 'text-red-400' : ''}>{event.spotsLeft} spots left</span>
        </div>
      </div>

      {/* Spots bar */}
      <div>
        <div className="flex justify-between text-xs text-white/40 mb-1">
          <span>Spots remaining</span>
          <span>{spotsPercent}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${spotsPercent < 20 ? 'bg-red-500' : 'progress-gradient'}`}
            style={{ width: `${spotsPercent}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {event.tags.map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
            #{tag}
          </span>
        ))}
      </div>

      <a
        href={event.registrationUrl}
        className="block w-full text-center py-2.5 rounded-xl btn-neon text-white text-sm font-medium transition-all"
      >
        Register Now · سجّل الآن
      </a>
    </GlassCard>
  )
}
