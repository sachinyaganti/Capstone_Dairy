export function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateShort(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatDateLong(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

// Seconds -> "3h 24m" / "12m" / "45s". Used for the auto-tracked time log.
export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds || 0))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m`
  return `${s}s`
}

export function formatBytes(bytes) {
  if (!bytes) return '0 KB'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function daysBetween(a, b) {
  const ms = new Date(b) - new Date(a)
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export function isOverdue(dueDate, status) {
  if (status === 'done') return false
  return new Date(dueDate) < new Date(today())
}

// Longest run of distinct calendar days with at least one entry,
// counting backward from today.
export function currentStreak(entries) {
  const days = new Set(entries.map((e) => e.date))
  let streak = 0
  const cursor = new Date()
  for (;;) {
    const key = cursor.toISOString().slice(0, 10)
    if (days.has(key)) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}
