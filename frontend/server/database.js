import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_DATA = {
  entries: [],
  milestones: [],
  timeLog: {},
}

export async function createDatabase(filePath = path.join(process.cwd(), 'server', 'data.json')) {
  const storagePath = filePath
  const dir = path.dirname(storagePath)

  await fs.mkdir(dir, { recursive: true })

  let data
  try {
    const raw = await fs.readFile(storagePath, 'utf8')
    data = JSON.parse(raw)
  } catch {
    data = { ...DEFAULT_DATA }
    await fs.writeFile(storagePath, JSON.stringify(data, null, 2), 'utf8')
  }

  const normalized = {
    ...DEFAULT_DATA,
    ...data,
    entries: Array.isArray(data?.entries) ? data.entries : [],
    milestones: Array.isArray(data?.milestones) ? data.milestones : [],
    timeLog: data?.timeLog && typeof data.timeLog === 'object' ? data.timeLog : {},
  }

  await fs.writeFile(storagePath, JSON.stringify(normalized, null, 2), 'utf8')

  return {
    filePath: storagePath,
    data: normalized,
    async save() {
      await fs.writeFile(storagePath, JSON.stringify(this.data, null, 2), 'utf8')
    },
    async setCollection(name, value) {
      if (!['entries', 'milestones', 'timeLog'].includes(name)) {
        throw new Error(`Unsupported collection: ${name}`)
      }
      this.data[name] = name === 'timeLog' ? { ...(value || {}) } : Array.isArray(value) ? value : []
      await this.save()
      return this.data[name]
    },
    async getAll() {
      return { ...this.data }
    },
    async replaceState(newState) {
      this.data = {
        ...DEFAULT_DATA,
        ...newState,
        entries: Array.isArray(newState?.entries) ? newState.entries : [],
        milestones: Array.isArray(newState?.milestones) ? newState.milestones : [],
        timeLog: newState?.timeLog && typeof newState.timeLog === 'object' ? newState.timeLog : {},
      }
      await this.save()
      return this.data
    },
  }
}
