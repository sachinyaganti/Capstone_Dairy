import MilestoneItem from './MilestoneItem'

export default function MilestoneList({ milestones, onCycleStatus, onDelete }) {
  if (milestones.length === 0) {
    return (
      <div className="empty-state">
        <p className="eyebrow">No milestones yet</p>
        <p>Add the checkpoints your capstone needs to hit.</p>
      </div>
    )
  }

  const sorted = [...milestones].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  )

  return (
    <ul className="milestone-list">
      {sorted.map((m) => (
        <MilestoneItem
          key={m.id}
          milestone={m}
          onCycleStatus={onCycleStatus}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
