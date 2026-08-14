# Field Log — Capstone Status Journal

An enhanced diary for tracking your capstone project's status over time.
Write daily log entries, get an automatic status suggestion based on your
own words (which you can always override), track milestones, and watch
your project's health trend on a dashboard.

## Features

- **Diary** — timestamped entries with a keyword-based status auto-detector
  (Not Started, Planning, In Progress, On Track, At Risk, Blocked, Completed).
  Every suggestion can be overridden manually.
- **Milestones** — a checklist of due-dated checkpoints you click through
  To Do → In Progress → Done, with overdue flags.
- **Dashboard** — current status, entry count, logging streak, milestone
  completion rate, a status-distribution pie chart, and a health-over-time
  trend chart.
- All data is saved to your browser's `localStorage` — nothing leaves your
  machine, and nothing is lost on refresh.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  data/statusConfig.js      status catalogue: labels, colors, health score
  utils/statusDetector.js   keyword-scoring auto-status classifier
  utils/storage.js          localStorage read/write helpers
  utils/dateHelpers.js      date formatting, streaks, overdue checks
  components/
    Header.jsx, TabNav.jsx, StatusStamp.jsx
    diary/                  entry form + timeline
    milestones/             milestone form + checklist
    dashboard/               stats + charts
```

## Customizing status detection

Edit the keyword lists in `src/utils/statusDetector.js` to match your own
vocabulary (advisor names, course terms, tech stack) — the detector is a
simple, transparent scoring function, easy to tune without a backend.
