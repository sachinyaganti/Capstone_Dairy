import StatsCards from './StatsCards'
import StatusDistributionChart from './StatusDistributionChart'
import StatusTrendChart from './StatusTrendChart'

export default function DashboardTab({ entries, milestones }) {
  return (
    <section>
      <StatsCards entries={entries} milestones={milestones} />
      <div className="chart-grid">
        <StatusTrendChart entries={entries} />
        <StatusDistributionChart entries={entries} />
      </div>
    </section>
  )
}
