import EntryCard from './EntryCard'

export default function EntryTimeline({ entries, onDelete, onOpen }) {
  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <p className="eyebrow">No entries yet</p>
        <p>Write your first log above — the timeline fills in here.</p>
      </div>
    )
  }

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="timeline">
      {sorted.map((entry) => (
        <EntryCard key={entry.id} entry={entry} onDelete={onDelete} onOpen={onOpen} />
      ))}
    </div>
  )
}
