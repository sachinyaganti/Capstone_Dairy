import { formatDuration, formatDateShort } from '../../utils/dateHelpers'

export default function TimeTrackedCard({ totalSeconds, todaySeconds, timeLog }) {
  const days = Object.entries(timeLog)
    .filter(([, s]) => s > 0)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .slice(0, 7)

  return (
    <div className="chart-card time-card">
      <h3 className="chart-card__title">Time on the project</h3>

      <div className="time-card__totals">
        <div>
          <span className="eyebrow">Total tracked</span>
          <span className="stat-card__number">{formatDuration(totalSeconds)}</span>
        </div>
        <div>
          <span className="eyebrow">Today</span>
          <span className="stat-card__number">{formatDuration(todaySeconds)}</span>
        </div>
      </div>

      {days.length > 0 ? (
        <ul className="time-card__days">
          {days.map(([date, seconds]) => (
            <li key={date} className="time-card__day">
              <span className="eyebrow">{formatDateShort(date)}</span>
              <span className="time-card__day-value">{formatDuration(seconds)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state__inline">
          Keep the app open while you work — time is tracked automatically.
        </p>
      )}
    </div>
  )
}
