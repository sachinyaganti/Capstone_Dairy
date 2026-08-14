// Status catalogue for capstone project identification.
// Order matters: it doubles as the "severity/priority" order used for
// tie-breaking in the auto-detector, and as the health score for charts.
export const STATUSES = [
  { key: 'NOT_STARTED', label: 'Not Started', color: '#9A9384', score: 0 },
  { key: 'BLOCKED', label: 'Blocked', color: '#A8432E', score: 1 },
  { key: 'RESEARCH', label: 'Research', color: '#C1852B', score: 2 },
  { key: 'PLANNING', label: 'Planning', color: '#5C6F8C', score: 3 },
  { key: 'IN_PROGRESS', label: 'In Progress', color: '#3B6E5E', score: 4 },
  { key: 'ON_TRACK', label: 'On Track', color: '#4F7942', score: 5 },
  { key: 'COMPLETED', label: 'Completed', color: '#7A5C1E', score: 6 },
]

export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.key, s]))

export function getStatus(key) {
  return STATUS_MAP[key] || STATUS_MAP.NOT_STARTED
}

// Blends the most recent diary status (40%) with milestone completion (60%)
// into a single "how done is this project" percentage for the dashboard.
// Falls back gracefully when one signal is missing.
export function projectCompletion(entries, milestones) {
  const maxScore = Math.max(...STATUSES.map((s) => s.score))
  const latest = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  const statusFrac = latest ? getStatus(latest.status).score / maxScore : null

  const milestoneFrac = milestones.length
    ? milestones.filter((m) => m.status === 'done').length / milestones.length
    : null

  if (statusFrac === null && milestoneFrac === null) return 0
  if (statusFrac === null) return Math.round(milestoneFrac * 100)
  if (milestoneFrac === null) return Math.round(statusFrac * 100)

  return Math.round((statusFrac * 0.4 + milestoneFrac * 0.6) * 100)
}

export const MILESTONE_STATES = [
  { key: 'todo', label: 'To Do', color: '#9A9384' },
  { key: 'in-progress', label: 'In Progress', color: '#3B6E5E' },
  { key: 'done', label: 'Done', color: '#7A5C1E' },
]
