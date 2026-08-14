import MilestoneForm from './MilestoneForm'
import MilestoneList from './MilestoneList'

const CYCLE = ['todo', 'in-progress', 'done']

export default function MilestonesTab({ milestones, onAdd, onUpdate, onDelete }) {
  function cycleStatus(id) {
    const m = milestones.find((x) => x.id === id)
    if (!m) return
    const next = CYCLE[(CYCLE.indexOf(m.status) + 1) % CYCLE.length]
    onUpdate(id, { status: next })
  }

  return (
    <section>
      <MilestoneForm onAdd={onAdd} />
      <MilestoneList
        milestones={milestones}
        onCycleStatus={cycleStatus}
        onDelete={onDelete}
      />
    </section>
  )
}
