import { useRef, useState } from 'react'
import { ArrowLeft, Download, FileText, Paperclip, Trash2 } from 'lucide-react'
import StatusStamp from '../StatusStamp'
import { formatDateLong, formatDuration, formatBytes } from '../../utils/dateHelpers'
import { fileToDocument } from '../../utils/documents'
import { exportDayPdf } from '../../utils/pdfExport'

export default function DayDetail({ entry, timeSeconds, onBack, onUpdate, onDelete }) {
  const fileInputRef = useRef(null)
  const [uploadError, setUploadError] = useState('')
  const [busy, setBusy] = useState(false)
  const docs = entry.documents || []

  async function handleFiles(fileList) {
    setUploadError('')
    setBusy(true)
    const files = Array.from(fileList || [])
    const added = []
    for (const file of files) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const record = await fileToDocument(file)
        added.push(record)
      } catch (err) {
        setUploadError(err.message)
      }
    }
    if (added.length) {
      onUpdate({ documents: [...docs, ...added] })
    }
    setBusy(false)
  }

  function removeDoc(id) {
    onUpdate({ documents: docs.filter((d) => d.id !== id) })
  }

  return (
    <section className="day-detail">
      <button type="button" className="link-btn day-detail__back" onClick={onBack}>
        <ArrowLeft size={13} strokeWidth={2} /> Back to timeline
      </button>

      <div className="day-detail__card">
        <div className="day-detail__top">
          <div>
            <h2 className="day-detail__title">{entry.title}</h2>
            <span className="eyebrow">{formatDateLong(entry.date)}</span>
          </div>
          <StatusStamp statusKey={entry.status} size="lg" tilt={-2} />
        </div>

        <p className="day-detail__content">{entry.content}</p>

        <div className="day-detail__meta-row">
          <div className="day-detail__meta">
            <span className="eyebrow">Time tracked</span>
            <span className="day-detail__meta-value">
              {timeSeconds > 0 ? formatDuration(timeSeconds) : '—'}
            </span>
            <span className="stat-card__muted">auto-tracked while app is open</span>
          </div>
          <div className="day-detail__meta">
            <span className="eyebrow">Status source</span>
            <span className="day-detail__meta-value">
              {entry.statusSource === 'manual' ? 'Manual' : 'Auto-detected'}
            </span>
          </div>
        </div>

        <div className="day-detail__section">
          <div className="day-detail__section-head">
            <span className="eyebrow">Documents for this day ({docs.length})</span>
            <button
              type="button"
              className="link-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
            >
              <Paperclip size={13} strokeWidth={2} /> {busy ? 'Adding…' : 'Add files'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={(e) => {
                handleFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </div>

          {uploadError && <p className="day-detail__error">{uploadError}</p>}
          <p className="stat-card__muted">
            Files are stored in your browser (localStorage) — keep them under ~4MB each.
          </p>

          {docs.length === 0 ? (
            <p className="empty-state__inline">No documents attached yet.</p>
          ) : (
            <ul className="doc-list">
              {docs.map((d) => (
                <li key={d.id} className="doc-list__item">
                  {d.type.startsWith('image/') ? (
                    <img src={d.dataUrl} alt={d.name} className="doc-list__thumb" />
                  ) : (
                    <div className="doc-list__icon">
                      <FileText size={16} strokeWidth={1.75} />
                    </div>
                  )}
                  <div className="doc-list__body">
                    <span className="doc-list__name">{d.name}</span>
                    <span className="stat-card__muted">{formatBytes(d.size)}</span>
                  </div>
                  <a
                    className="icon-btn"
                    href={d.dataUrl}
                    download={d.name}
                    aria-label={`Download ${d.name}`}
                  >
                    <Download size={15} strokeWidth={1.75} />
                  </a>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Remove ${d.name}`}
                    onClick={() => removeDoc(d.id)}
                  >
                    <Trash2 size={15} strokeWidth={1.75} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="day-detail__actions">
          <button
            type="button"
            className="primary-btn"
            onClick={() => exportDayPdf(entry, timeSeconds)}
          >
            <Download size={14} strokeWidth={2} /> Download day report (PDF)
          </button>
          <button type="button" className="link-btn day-detail__delete" onClick={onDelete}>
            <Trash2 size={13} strokeWidth={2} /> Delete this entry
          </button>
        </div>
      </div>
    </section>
  )
}
