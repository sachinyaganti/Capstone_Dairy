import { getStatus } from '../data/statusConfig'
import './StatusStamp.css'

// The signature visual motif of the app: every status reads like it was
// stamped onto the page, echoing the "status identification" brief.
export default function StatusStamp({ statusKey, size = 'md', tilt = -3 }) {
  const status = getStatus(statusKey)
  return (
    <span
      className={`status-stamp status-stamp--${size}`}
      style={{
        '--stamp-color': status.color,
        transform: `rotate(${tilt}deg)`,
      }}
    >
      {status.label}
    </span>
  )
}
