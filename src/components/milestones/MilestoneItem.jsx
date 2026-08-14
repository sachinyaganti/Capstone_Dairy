import { Trash2 } from 'lucide-react'
import { MILESTONE_STATES } from '../../data/statusConfig'
import { formatDate, isOverdue } from '../../utils/dateHelpers'

export default function MilestoneItem({ milestone, onCycleStatus, onDelete }) {
  const state = MILESTONE_STATES.find((s) => s.key === milestone.status)
  const overdue = isOverdue(milestone.dueDate, milestone.status)

  return (
    <li className={`milestone-item ${milestone.status === 'done' ? 'is-done' : ''}`}>
      <button
        type="button"
        className="milestone-item__toggle"
        style={{ '--state-color': state.color }}
        onClick={() => onCycleStatus(milestone.id)}
        title="Click to advance status"
      >
        {milestone.status === 'done' ? '✓' : ''}
      </button>

      <div className="milestone-item__body">
        <span className="milestone-item__title">{milestone.title}</span>
        <span className={`eyebrow ${overdue ? 'is-overdue' : ''}`}>
          due {formatDate(milestone.dueDate)}
          {overdue ? ' · overdue' : ''}
        </span>
      </div>

      <span className="milestone-item__state" style={{ color: state.color }}>
        {state.label}
      </span>

      <button
        type="button"
        className="icon-btn"
        aria-label="Delete milestone"
        onClick={() => onDelete(milestone.id)}
      >
        <Trash2 size={15} strokeWidth={1.75} />
      </button>
    </li>
  )
}
