import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { createDatabase } from './database.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json({ limit: '10mb' }))

const dbPromise = createDatabase(path.join(process.cwd(), 'server', 'data.json'))

app.get('/api/health', async (_req, res) => {
  const db = await dbPromise
  res.json({ ok: true, dataFile: db.filePath, collections: Object.keys(db.data) })
})

app.get('/api/data', async (_req, res) => {
  const db = await dbPromise
  res.json({
    entries: db.data.entries,
    milestones: db.data.milestones,
    timeLog: db.data.timeLog,
  })
})

app.put('/api/entries', async (req, res) => {
  const db = await dbPromise
  const entries = Array.isArray(req.body) ? req.body : []
  db.data.entries = entries
  await db.save()
  res.json({ ok: true, entries })
})

app.put('/api/milestones', async (req, res) => {
  const db = await dbPromise
  const milestones = Array.isArray(req.body) ? req.body : []
  db.data.milestones = milestones
  await db.save()
  res.json({ ok: true, milestones })
})

app.put('/api/time-log', async (req, res) => {
  const db = await dbPromise
  const timeLog = req.body && typeof req.body === 'object' ? req.body : {}
  db.data.timeLog = timeLog
  await db.save()
  res.json({ ok: true, timeLog })
})

app.listen(PORT, () => {
  console.log(`Capstone diary backend running on http://localhost:${PORT}`)
})
