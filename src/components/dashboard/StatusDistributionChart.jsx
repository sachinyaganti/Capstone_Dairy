import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { STATUSES } from '../../data/statusConfig'

export default function StatusDistributionChart({ entries }) {
  const data = STATUSES.map((s) => ({
    name: s.label,
    value: entries.filter((e) => e.status === s.key).length,
    color: s.color,
  })).filter((d) => d.value > 0)

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-card__title">Status distribution</h3>
        <p className="empty-state__inline">Log an entry to see the breakdown.</p>
      </div>
    )
  }

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Status distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} stroke="var(--paper-card)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              border: '1px solid var(--line-strong)',
              borderRadius: 3,
              background: 'var(--paper-card)',
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
            iconSize={9}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
