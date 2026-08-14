import { NotebookPen } from 'lucide-react'

export default function Header({ streak }) {
  return (
    <header className="app-header">
      <div className="app-header__mark">
        <NotebookPen size={22} strokeWidth={1.75} />
      </div>
      <div>
        <h1 className="app-header__title">Field Log</h1>
        <p className="app-header__subtitle eyebrow">Capstone status journal</p>
      </div>
      {streak > 0 && (
        <div className="app-header__streak" title="Consecutive days logged">
          <span className="app-header__streak-num">{streak}</span>
          <span className="eyebrow">day{streak === 1 ? '' : 's'} running</span>
        </div>
      )}
    </header>
  )
}
