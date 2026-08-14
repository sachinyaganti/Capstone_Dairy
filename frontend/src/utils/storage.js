const ENTRIES_KEY = 'capstone-diary:entries'
const MILESTONES_KEY = 'capstone-diary:milestones'
const TIME_LOG_KEY = 'capstone-diary:timelog'
const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  '/api'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable — fail silently, app still works in-memory.
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

export const loadEntries = () => load(ENTRIES_KEY, [])
export const saveEntries = (entries) => {
  save(ENTRIES_KEY, entries)

  if (typeof fetch !== 'undefined') {
    apiRequest('/entries', {
      method: 'PUT',
      body: JSON.stringify(entries),
    }).catch(() => {})
  }
}

export const loadMilestones = () => load(MILESTONES_KEY, [])
export const saveMilestones = (milestones) => {
  save(MILESTONES_KEY, milestones)

  if (typeof fetch !== 'undefined') {
    apiRequest('/milestones', {
      method: 'PUT',
      body: JSON.stringify(milestones),
    }).catch(() => {})
  }
}

// Time log shape: { "2025-06-01": 4820, "2025-06-02": 1200, ... } — seconds
// of app-open time attributed to each calendar day.
export const loadTimeLog = () => load(TIME_LOG_KEY, {})
export const saveTimeLog = (log) => {
  save(TIME_LOG_KEY, log)

  if (typeof fetch !== 'undefined') {
    apiRequest('/time-log', {
      method: 'PUT',
      body: JSON.stringify(log),
    }).catch(() => {})
  }
}

export async function hydrateFromServer() {
  try {
    const payload = await apiRequest('/data')
    return {
      entries: Array.isArray(payload?.entries) ? payload.entries : loadEntries(),
      milestones: Array.isArray(payload?.milestones) ? payload.milestones : loadMilestones(),
      timeLog: payload?.timeLog && typeof payload.timeLog === 'object' ? payload.timeLog : loadTimeLog(),
    }
  } catch {
    return null
  }
}

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

// Rough estimate (in bytes) of everything this app has written to
// localStorage — used to warn before document attachments fill the quota.
export function estimateStorageBytes() {
  try {
    let total = 0
    for (const key of [ENTRIES_KEY, MILESTONES_KEY, TIME_LOG_KEY]) {
      const raw = localStorage.getItem(key)
      if (raw) total += raw.length
    }
    return total
  } catch {
    return 0
  }
}
