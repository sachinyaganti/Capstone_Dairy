import { useState } from 'react'
import { today } from '../../utils/dateHelpers'

export default function MilestoneForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState(today())

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), dueDate, status: 'todo' })
    setTitle('')
  }

  return (
    <form className="milestone-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Milestone, e.g. 'Submit literature review'"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="milestone-form__title"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="milestone-form__date"
      />
      <button type="submit" className="primary-btn">
        Add
      </button>
    </form>
  )
}
