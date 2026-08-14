import { formatDateLong } from '../../utils/dateHelpers'
import StatusStamp from '../StatusStamp'
import { today } from '../../utils/dateHelpers'

export default function StatsCards({ entries }) {
  const todayKey = today()
  const todayEntry = [...entries]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .find((entry) => entry.date === todayKey)

  const latest = todayEntry || [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))[0]

  return (
    <div className="stats-grid">
      <div className="stat-card stat-card--wide">
        <span className="eyebrow">What is done today</span>

        {latest ? (
          <>
            <div className="day-detail__top" style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>
              <div>
                <h3 className="day-detail__title" style={{ margin: 0 }}>{latest.title}</h3>
                <span className="stat-card__muted">{formatDateLong(latest.date)}</span>
              </div>
              <StatusStamp statusKey={latest.status} size="lg" tilt={-2} />
            </div>
            <p className="day-detail__content" style={{ margin: 0 }}>
              {latest.content.length > 140 ? `${latest.content.slice(0, 140).trim()}...` : latest.content}
            </p>
          </>
        ) : (
          <span className="stat-card__muted">No work has been recorded for today yet.</span>
        )}
      </div>
    </div>
  )
}
