import { useState } from 'react'
import EntryForm from './EntryForm'
import EntryTimeline from './EntryTimeline'
import DayDetail from './DayDetail'

export default function DiaryTab({ entries, timeLog, onAdd, onUpdate, onDelete }) {
  const [openEntryId, setOpenEntryId] = useState(null)
  const openEntry = entries.find((e) => e.id === openEntryId) || null

  if (openEntry) {
    return (
      <DayDetail
        entry={openEntry}
        timeSeconds={timeLog[openEntry.date] || 0}
        onBack={() => setOpenEntryId(null)}
        onUpdate={(patch) => onUpdate(openEntry.id, patch)}
        onDelete={() => {
          onDelete(openEntry.id)
          setOpenEntryId(null)
        }}
      />
    )
  }

  return (
    <section>
      <EntryForm onAdd={onAdd} />
      <EntryTimeline entries={entries} onDelete={onDelete} onOpen={setOpenEntryId} />
    </section>
  )
}
