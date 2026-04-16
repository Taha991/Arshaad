import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { mockSalaryData, TrackSalaryData } from '@/data/mockData'
import GlassCard from '@/components/atoms/GlassCard'

const barColors = ['#3B82F6', '#8B5CF6', '#22D3EE']

function formatK(v: number) {
  return `$${(v / 1000).toFixed(0)}K`
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card p-3 text-xs text-white min-w-[120px]">
      <p className="text-white/60 mb-2 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-cyan-400">{entry.name}: {formatK(entry.value)}</p>
      ))}
    </div>
  )
}

export default function SalaryChart() {
  const [selected, setSelected] = useState<TrackSalaryData>(mockSalaryData[0])

  return (
    <div className="flex flex-col gap-5">
      {/* Track selector */}
      <div className="flex flex-wrap gap-2">
        {mockSalaryData.map(t => (
          <button
            key={t.track}
            onClick={() => setSelected(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              selected.track === t.track
                ? 'bg-cyan-400/15 border-cyan-400/50 text-cyan-400'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
            }`}
          >
            {t.track}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Demand Score', labelAr: 'مؤشر الطلب', value: `${selected.demandScore}/100`, color: 'text-cyan-400' },
          { label: 'Open Positions', labelAr: 'وظائف متاحة', value: `${(selected.jobCount / 1000).toFixed(1)}K`, color: 'text-violet-400' },
          { label: 'YoY Growth', labelAr: 'نمو سنوي', value: `+${selected.growthPercent}%`, color: 'text-green-400' },
        ].map(s => (
          <GlassCard key={s.label} padding={false} className="p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
            <p className="text-white/30 text-xs font-arabic">{s.labelAr}</p>
          </GlassCard>
        ))}
      </div>

      {/* Chart */}
      <GlassCard padding={false} className="p-4">
        <p className="text-white/60 text-sm mb-4">
          Average Salary by Seniority — {selected.trackAr}
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={selected.data} barCategoryGap="30%">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="seniority" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatK} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="avg" name="Avg Salary" radius={[6, 6, 0, 0]} fill="url(#barGrad)">
              {selected.data.map((_, i) => (
                <Cell key={i} fill={barColors[i % barColors.length]} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  )
}
