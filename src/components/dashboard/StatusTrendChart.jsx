import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { getStatus, STATUSES } from '../../data/statusConfig'
import { formatDateShort } from '../../utils/dateHelpers'

export default function StatusTrendChart({ entries }) {
  if (entries.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-card__title">Health over time</h3>
        <p className="empty-state__inline">Your trend line appears after a couple of entries.</p>
      </div>
    )
  }

  const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date))
  const data = sorted.map((e) => ({
    date: formatDateShort(e.date),
    score: getStatus(e.status).score,
    label: getStatus(e.status).label,
  }))
  const maxScore = Math.max(...STATUSES.map((s) => s.score))

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Health over time</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B6E5E" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#3B6E5E" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--line)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--ink-soft)' }}
            axisLine={{ stroke: 'var(--line-strong)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, maxScore]}
            tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--ink-soft)' }}
            axisLine={false}
            tickLine={false}
            width={20}
          />
          <Tooltip
            formatter={(_, __, props) => [props.payload.label, 'Status']}
            contentStyle={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              border: '1px solid var(--line-strong)',
              borderRadius: 3,
              background: 'var(--paper-card)',
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#3B6E5E"
            strokeWidth={2}
            fill="url(#healthFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
