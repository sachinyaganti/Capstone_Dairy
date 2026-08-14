import { useMemo, useState } from 'react'
import { STATUSES } from '../../data/statusConfig'
import { detectStatus } from '../../utils/statusDetector'
import { today } from '../../utils/dateHelpers'
import StatusStamp from '../StatusStamp'

export default function EntryForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(today())
  const [manualStatus, setManualStatus] = useState(null)

  const suggestion = useMemo(() => detectStatus(content), [content])
  const effectiveStatus = manualStatus || suggestion.status

  function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return
    onAdd({
      title: title.trim() || 'Untitled entry',
      content: content.trim(),
      date,
      status: effectiveStatus,
      statusSource: manualStatus ? 'manual' : 'auto',
    })
    setTitle('')
    setContent('')
    setManualStatus(null)
    setDate(today())
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <div className="entry-form__row">
        <input
          className="entry-form__title"
          type="text"
          placeholder="Entry title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="entry-form__date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <textarea
        className="entry-form__body"
        placeholder="What happened today? Progress, blockers, decisions..."
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="entry-form__status-row">
        <div className="entry-form__suggestion">
          <span className="eyebrow">Suggested status</span>
          <StatusStamp statusKey={effectiveStatus} size="sm" tilt={0} />
          {!manualStatus && content.trim() && (
            <span className="entry-form__confidence">
              {Math.round(suggestion.confidence * 100)}% confidence
            </span>
          )}
          {manualStatus && (
            <button
              type="button"
              className="link-btn"
              onClick={() => setManualStatus(null)}
            >
              use suggestion instead
            </button>
          )}
        </div>

        <select
          className="entry-form__select"
          value={manualStatus || ''}
          onChange={(e) => setManualStatus(e.target.value || null)}
        >
          <option value="">Override status…</option>
          {STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="primary-btn">
        Stamp entry
      </button>
    </form>
  )
}
