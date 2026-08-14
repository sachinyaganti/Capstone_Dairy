const TABS = [
  { key: 'diary', label: 'Diary' },
  { key: 'milestones', label: 'Milestones' },
  { key: 'dashboard', label: 'Dashboard' },
]

export default function TabNav({ active, onChange }) {
  return (
    <nav className="tab-nav" role="tablist" aria-label="Sections">
      {TABS.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={active === t.key}
          className={`tab-nav__item ${active === t.key ? 'is-active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
