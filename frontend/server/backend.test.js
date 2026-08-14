import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createDatabase } from './database.js'

test('database initializes the app collections', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'capstone-diary-'))
  const db = await createDatabase(path.join(dir, 'db.json'))

  assert.deepEqual(db.data.entries, [])
  assert.deepEqual(db.data.milestones, [])
  assert.deepEqual(db.data.timeLog, {})
})

test('database persists collection updates', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'capstone-diary-'))
  const db = await createDatabase(path.join(dir, 'db.json'))

  await db.setCollection('entries', [{ id: 'entry-1', title: 'Prototype run' }])
  await db.setCollection('milestones', [{ id: 'milestone-1', title: 'Demo', status: 'done' }])

  const reloaded = await createDatabase(path.join(dir, 'db.json'))
  assert.equal(reloaded.data.entries[0].id, 'entry-1')
  assert.equal(reloaded.data.milestones[0].title, 'Demo')
})
