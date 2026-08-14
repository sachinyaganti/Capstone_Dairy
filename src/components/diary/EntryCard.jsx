import { Trash2, FileText, ArrowUpRight } from 'lucide-react'
import { formatDate } from '../../utils/dateHelpers'
import StatusStamp from '../StatusStamp'

export default function EntryCard({ entry, onDelete, onOpen }) {
  const docCount = (entry.documents || []).length

  return (
    <article className="entry-card">
      <div className="entry-card__spine" />
      <div
        className="entry-card__body entry-card__body--clickable"
        onClick={() => onOpen?.(entry.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' ? onOpen?.(entry.id) : null)}
      >
        <div className="entry-card__top">
          <div>
            <h3 className="entry-card__title">{entry.title}</h3>
            <span className="eyebrow">{formatDate(entry.date)}</span>
          </div>
          <StatusStamp statusKey={entry.status} size="md" />
        </div>
        <p className="entry-card__content">{entry.content}</p>
        <div className="entry-card__footer">
          <span className="entry-card__source">
            {entry.statusSource === 'manual' ? 'status set manually' : 'status auto-detected'}
            {docCount > 0 && (
              <span className="entry-card__docs">
                <FileText size={12} strokeWidth={1.75} /> {docCount}
              </span>
            )}
          </span>
          <span className="entry-card__actions">
            <button
              type="button"
              className="link-btn entry-card__open"
              onClick={(e) => {
                e.stopPropagation()
                onOpen?.(entry.id)
              }}
            >
              Open day <ArrowUpRight size={12} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Delete entry"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(entry.id)
              }}
            >
              <Trash2 size={15} strokeWidth={1.75} />
            </button>
          </span>
        </div>
      </div>
    </article>
  )
}
