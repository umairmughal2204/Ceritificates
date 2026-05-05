import cors from 'cors'
import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'data', 'companies.json')
const PORT = Number(process.env.PORT) || 3001

function isCompany(value) {
  if (!value || typeof value !== 'object') return false
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.logoUrl === 'string' &&
    value.id.length > 0 &&
    value.name.trim().length > 0 &&
    value.logoUrl.length > 0
  )
}

async function readCompanies() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isCompany)
  } catch (err) {
    if (err && err.code === 'ENOENT') return []
    throw err
  }
}

async function writeCompanies(companies) {
  if (!Array.isArray(companies) || !companies.every(isCompany)) {
    throw new Error('Invalid companies payload')
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  const tmp = `${DATA_FILE}.${Date.now()}.tmp`
  await fs.writeFile(tmp, JSON.stringify(companies, null, 2), 'utf8')
  await fs.rename(tmp, DATA_FILE)
}

const app = express()
app.use(cors({ origin: true }))
app.use(express.json({ limit: '6mb' }))

app.get('/api/companies', async (_req, res) => {
  try {
    const companies = await readCompanies()
    res.json({ companies })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not read companies file.' })
  }
})

app.post('/api/companies', async (req, res) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
    const logoUrl = typeof req.body?.logoUrl === 'string' ? req.body.logoUrl : ''
    if (!name || !logoUrl) {
      res.status(400).json({ error: 'name and logoUrl are required.' })
      return
    }
    const companies = await readCompanies()
    const company = { id: randomUUID(), name, logoUrl }
    companies.push(company)
    await writeCompanies(companies)
    res.status(201).json({ company })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not save company.' })
  }
})

app.put('/api/companies/:id', async (req, res) => {
  try {
    const { id } = req.params
    const companies = await readCompanies()
    const idx = companies.findIndex((c) => c.id === id)
    if (idx === -1) {
      res.status(404).json({ error: 'Company not found.' })
      return
    }
    const prev = companies[idx]
    const name =
      typeof req.body?.name === 'string' ? req.body.name.trim() : prev.name
    const logoUrl =
      typeof req.body?.logoUrl === 'string' ? req.body.logoUrl : prev.logoUrl
    if (!name || !logoUrl) {
      res.status(400).json({ error: 'name and logoUrl must be non-empty when provided.' })
      return
    }
    const company = { id, name, logoUrl }
    companies[idx] = company
    await writeCompanies(companies)
    res.json({ company })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not update company.' })
  }
})

app.delete('/api/companies/:id', async (req, res) => {
  try {
    const { id } = req.params
    const companies = await readCompanies()
    const next = companies.filter((c) => c.id !== id)
    if (next.length === companies.length) {
      res.status(404).json({ error: 'Company not found.' })
      return
    }
    await writeCompanies(next)
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not delete company.' })
  }
})

const server = app.listen(PORT, () => {
  console.log(`Companies API listening on http://localhost:${PORT}`)
  console.log(`Data file: ${DATA_FILE}`)
})

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${PORT} is already in use (another Certificates API or app is running).\n\n` +
        `Fix one of:\n` +
        `  • Stop the other process, then run npm run dev again.\n` +
        `  • Or use another port (PowerShell):  $env:PORT=3002; npm run dev\n` +
        `    (match that port in frontend/vite.config.ts → server.proxy / preview.proxy.)\n\n` +
        `Windows — find what is using ${PORT}:\n` +
        `  netstat -ano | findstr :${PORT}\n` +
        `  taskkill /PID <pid_from_last_column> /F\n`,
    )
    process.exit(1)
  }
  console.error(err)
  process.exit(1)
})
