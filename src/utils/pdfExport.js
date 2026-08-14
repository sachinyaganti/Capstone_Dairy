import { jsPDF } from 'jspdf'
import { getStatus } from '../data/statusConfig'
import { formatDateLong, formatDuration, formatBytes } from './dateHelpers'

const PAGE_W = 595.28 // A4 pt
const MARGIN = 48
const CONTENT_W = PAGE_W - MARGIN * 2

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

// Builds and downloads a one-day report PDF: status, entry text, time
// tracked that day, and a list of any attached documents (images are
// embedded as thumbnails; other file types are listed by name/size).
export function exportDayPdf(entry, timeSeconds) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const status = getStatus(entry.status)
  let y = MARGIN

  // Header
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(20)
  doc.text('Field Log', MARGIN, y)
  y += 18
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(110, 105, 95)
  doc.text('Capstone status journal — daily report', MARGIN, y)
  y += 22

  doc.setDrawColor(30, 27, 22)
  doc.setLineWidth(1.2)
  doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  y += 26

  // Date + title
  doc.setTextColor(30, 27, 22)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(entry.title || 'Untitled entry', MARGIN, y)
  y += 18
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.setTextColor(90, 85, 75)
  doc.text(formatDateLong(entry.date), MARGIN, y)
  y += 24

  // Status stamp
  const [r, g, b] = hexToRgb(status.color)
  doc.setDrawColor(r, g, b)
  doc.setLineWidth(1.3)
  const label = status.label.toUpperCase()
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  const labelW = doc.getTextWidth(label) + 20
  doc.roundedRect(MARGIN, y - 12, labelW, 20, 3, 3)
  doc.setTextColor(r, g, b)
  doc.text(label, MARGIN + 10, y + 2)
  doc.setTextColor(120, 114, 102)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(
    entry.statusSource === 'manual' ? 'status set manually' : 'status auto-detected',
    MARGIN + labelW + 12,
    y + 2,
  )
  y += 34

  // Time tracked
  doc.setTextColor(30, 27, 22)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.text('Time tracked this day', MARGIN, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(70, 65, 58)
  doc.text(
    timeSeconds > 0 ? formatDuration(timeSeconds) + ' (app open, auto-tracked)' : 'No time tracked yet',
    MARGIN,
    y,
  )
  y += 26

  // Entry content
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(30, 27, 22)
  doc.text('Log entry', MARGIN, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.setTextColor(50, 46, 40)
  const lines = doc.splitTextToSize(entry.content || '(no notes written)', CONTENT_W)
  for (const line of lines) {
    if (y > 780) {
      doc.addPage()
      y = MARGIN
    }
    doc.text(line, MARGIN, y)
    y += 14
  }
  y += 16

  // Documents
  const docs = entry.documents || []
  if (y > 740) {
    doc.addPage()
    y = MARGIN
  }
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(30, 27, 22)
  doc.text(`Attached documents (${docs.length})`, MARGIN, y)
  y += 18

  if (docs.length === 0) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(120, 114, 102)
    doc.text('None attached for this day.', MARGIN, y)
    y += 20
  }

  for (const d of docs) {
    if (y > 740) {
      doc.addPage()
      y = MARGIN
    }
    const isImage = (d.type || '').startsWith('image/')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(50, 46, 40)
    doc.text(`• ${d.name}  (${formatBytes(d.size)})`, MARGIN, y)
    y += 12

    if (isImage) {
      try {
        const maxW = 220
        const maxH = 150
        let w = d.width || maxW
        let h = d.height || maxH
        const ratio = Math.min(maxW / w, maxH / h, 1)
        w = w * ratio
        h = h * ratio
        if (y + h > 780) {
          doc.addPage()
          y = MARGIN
        }
        doc.addImage(d.dataUrl, d.name.split('.').pop()?.toUpperCase() || 'JPEG', MARGIN, y, w, h)
        y += h + 14
      } catch {
        y += 6
      }
    } else {
      y += 6
    }
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(150, 145, 132)
    doc.text(`Field Log · generated ${new Date().toLocaleDateString()}`, MARGIN, 812)
    doc.text(`Page ${i} of ${pageCount}`, PAGE_W - MARGIN - 60, 812)
  }

  doc.save(`field-log-${entry.date}.pdf`)
}
