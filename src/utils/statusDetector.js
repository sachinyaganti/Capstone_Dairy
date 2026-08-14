// Lightweight keyword-scoring classifier used to *suggest* a status from
// free-text diary entries. It never overrides the writer — the UI always
// lets a manual pick win — it just gives a fast first guess.

const KEYWORDS = {
  BLOCKED: [
    'blocked', 'stuck', "can't proceed", 'cannot proceed', 'stalled',
    'waiting on', 'no progress', 'dependency', 'roadblock', 'held up',
  ],
  AT_RISK: [
    'behind schedule', 'delayed', 'worried', 'at risk', 'concerned',
    'struggling', 'struggle', 'problem', 'issue', 'bug', 'failing',
    'running out of time', 'overwhelmed', 'confused',
  ],
  COMPLETED: [
    'completed', 'finished', 'submitted', 'defended', 'wrapped up',
    'finalized', 'finalised', 'shipped', 'done', 'turned in', 'presented',
  ],
  ON_TRACK: [
    'on track', 'on schedule', 'going well', 'smooth', 'confident',
    'ahead of schedule', 'good progress', 'great progress', 'productive',
  ],
  IN_PROGRESS: [
    'working on', 'started coding', 'began', 'continuing', 'developing',
    'building', 'writing', 'coding', 'drafting', 'implementing',
    'testing', 'debugging', 'iterating',
  ],
  PLANNING: [
    'planning', 'outline', 'proposal', 'brainstorm', 'designing',
    'scoping', 'researching', 'literature review', 'meeting with advisor',
    'requirements',
  ],
}

// Tie-break priority: more urgent/definitive signals win when scores tie.
const PRIORITY = ['BLOCKED', 'RESEARCH', 'COMPLETED', 'ON_TRACK', 'IN_PROGRESS', 'PLANNING']

export function detectStatus(text) {
  const clean = (text || '').toLowerCase()
  if (!clean.trim()) return { status: 'NOT_STARTED', confidence: 0, matches: [] }

  const scores = {}
  const matchedTerms = {}

  for (const [status, terms] of Object.entries(KEYWORDS)) {
    let count = 0
    const hits = []
    for (const term of terms) {
      if (clean.includes(term)) {
        count += 1
        hits.push(term)
      }
    }
    if (count > 0) {
      scores[status] = count
      matchedTerms[status] = hits
    }
  }

  const entries = Object.entries(scores)
  if (entries.length === 0) {
    return { status: 'IN_PROGRESS', confidence: 0.2, matches: [] }
  }

  const maxScore = Math.max(...entries.map(([, v]) => v))
  const tied = entries.filter(([, v]) => v === maxScore).map(([k]) => k)
  const winner = PRIORITY.find((p) => tied.includes(p)) || tied[0]

  const totalHits = entries.reduce((sum, [, v]) => sum + v, 0)
  const confidence = Math.min(0.95, 0.35 + maxScore / (totalHits + 2))

  return { status: winner, confidence, matches: matchedTerms[winner] }
}
