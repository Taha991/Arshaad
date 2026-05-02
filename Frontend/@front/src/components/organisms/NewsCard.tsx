import { NewsItem } from '@/data/newsData'
import GlassCard from '@/components/atoms/GlassCard'

interface Props {
  item: NewsItem
  featured?: boolean
}

const categoryConfig: Record<string, { color: string; bg: string; border: string }> = {
  'Framework Update': { color: 'text-cyan-400',   bg: 'bg-cyan-400/10',   border: 'border-cyan-400/20'   },
  'Language Release': { color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/20'   },
  'AI & ML':          { color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
  'Job Market':       { color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/20'  },
  'Security':         { color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/20'    },
  'Tech Update':      { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  'Community':        { color: 'text-pink-400',   bg: 'bg-pink-400/10',   border: 'border-pink-400/20'   },
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 3600)  return `${Math.round(diff / 60)}m ago`
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.round(diff / 86400)}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function NewsCard({ item, featured = false }: Props) {
  const cfg = categoryConfig[item.category] ?? categoryConfig['Tech Update']

  if (featured) {
    return (
      <GlassCard neonBorder hover className="flex flex-col gap-4 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-cyan-400/5 blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.bg} ${cfg.color} ${cfg.border}`}>
            {item.category}
          </span>
          {item.isHot && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-orange-400/10 text-orange-400 border border-orange-400/20 animate-pulse">
              🔥 Trending
            </span>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 ml-auto">
            ⭐ Featured
          </span>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg leading-snug mb-1">{item.title}</h3>
          <p className="text-white/40 text-xs font-arabic">{item.titleAr}</p>
        </div>

        <p className="text-white/60 text-sm leading-relaxed">{item.summary}</p>
        <p className="text-white/30 text-xs font-arabic leading-relaxed">{item.summaryAr}</p>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">📰 {item.source}</span>
            <span className="flex items-center gap-1">⏱ {item.readTime} min read</span>
            <span>{timeAgo(item.date)}</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {item.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">
              #{tag}
            </span>
          ))}
        </div>

        <a
          href={item.sourceUrl}
          className="block w-full text-center py-2.5 rounded-xl btn-neon text-white text-sm font-medium"
        >
          Read Full Article · اقرأ المقال
        </a>
      </GlassCard>
    )
  }

  return (
    <GlassCard hover className="flex flex-col gap-3">
      <div className="flex items-start gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
          {item.category}
        </span>
        {item.isHot && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-400/10 text-orange-400 border border-orange-400/20">
            🔥 Hot
          </span>
        )}
      </div>

      <div>
        <h3 className="text-white font-semibold text-sm leading-snug mb-0.5">{item.title}</h3>
        <p className="text-white/35 text-xs font-arabic">{item.titleAr}</p>
      </div>

      <p className="text-white/55 text-xs leading-relaxed line-clamp-3">{item.summary}</p>

      <div className="flex gap-2 flex-wrap">
        {item.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-white/35">
          <span>{item.source}</span>
          <span>·</span>
          <span>{timeAgo(item.date)}</span>
          <span>·</span>
          <span>{item.readTime}m read</span>
        </div>
        <a
          href={item.sourceUrl}
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          Read <span className="text-base leading-none">→</span>
        </a>
      </div>
    </GlassCard>
  )
}
