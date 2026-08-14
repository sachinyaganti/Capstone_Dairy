import { useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import TabNav from './components/TabNav'
import DiaryTab from './components/diary/DiaryTab'
import MilestonesTab from './components/milestones/MilestonesTab'
import DashboardTab from './components/dashboard/DashboardTab'
import {
  loadEntries, saveEntries, loadMilestones, saveMilestones,
  loadTimeLog, saveTimeLog, uid, hydrateFromServer,
} from './utils/storage'
import { currentStreak, today } from './utils/dateHelpers'
import './App.css'

// How often the ticker fires. If more than this many seconds pass between
// ticks (laptop sleep, backgrounded tab reawakening) the gap is dropped
// rather than credited as active time.
const TICK_MS = 5000
const MAX_CREDIBLE_GAP_S = 20

export default function App() {
  const [tab, setTab] = useState('diary')
  const [entries, setEntries] = useState(() => loadEntries())
  const [milestones, setMilestones] = useState(() => loadMilestones())
  const [timeLog, setTimeLog] = useState(() => loadTimeLog())

  useEffect(() => {
    let ignore = false

    hydrateFromServer().then((payload) => {
      if (ignore || !payload) return
      setEntries(payload.entries)
      setMilestones(payload.milestones)
      setTimeLog(payload.timeLog)
    })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => saveEntries(entries), [entries])
  useEffect(() => saveMilestones(milestones), [milestones])
  useEffect(() => saveTimeLog(timeLog), [timeLog])

  // Automatic time tracking: while the tab is visible, credit elapsed
  // seconds to today's date. Runs for the life of the app, independent
  // of which tab (diary/milestones/dashboard) is open.
  const lastTickRef = useRef(Date.now())
  useEffect(() => {
    const creditElapsed = () => {
      const now = Date.now()
      const deltaS = Math.round((now - lastTickRef.current) / 1000)
      lastTickRef.current = now
      if (document.visibilityState === 'visible' && deltaS > 0 && deltaS <= MAX_CREDIBLE_GAP_S) {
        const day = today()
        setTimeLog((prev) => ({ ...prev, [day]: (prev[day] || 0) + deltaS }))
      }
    }
    const interval = setInterval(creditElapsed, TICK_MS)
    const onVisibility = () => { lastTickRef.current = Date.now() }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', onVisibility)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', onVisibility)
    }
  }, [])

  function addEntry(entry) {
    setEntries((prev) => [...prev, { ...entry, id: uid(), createdAt: Date.now(), documents: [] }])
  }

  function updateEntry(id, patch) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  function deleteEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  function addMilestone(milestone) {
    setMilestones((prev) => [...prev, { ...milestone, id: uid(), createdAt: Date.now() }])
  }

  function updateMilestone(id, patch) {
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  function deleteMilestone(id) {
    setMilestones((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="app-shell">
      <div className="app-page">
        <Header streak={currentStreak(entries)} />
        <TabNav active={tab} onChange={setTab} />

        <main className="app-main">
          {tab === 'diary' && (
            <DiaryTab
              entries={entries}
              timeLog={timeLog}
              onAdd={addEntry}
              onUpdate={updateEntry}
              onDelete={deleteEntry}
            />
          )}
          {tab === 'milestones' && (
            <MilestonesTab
              milestones={milestones}
              onAdd={addMilestone}
              onUpdate={updateMilestone}
              onDelete={deleteMilestone}
            />
          )}
          {tab === 'dashboard' && (
            <DashboardTab entries={entries} milestones={milestones} timeLog={timeLog} />
          )}
        </main>
      </div>
    </div>
  )
}
