import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const sourceRoot = path.join(root, 'src')
const publicSrcRoot = path.join(root, 'public', 'src')

async function syncDirectory(name) {
  const from = path.join(sourceRoot, name)
  const to = path.join(publicSrcRoot, name)
  await rm(to, { recursive: true, force: true })
  await mkdir(path.dirname(to), { recursive: true })
  await cp(from, to, { recursive: true })
  console.log(`[sync-static] copied ${name} -> public/src/${name}`)
}

await syncDirectory('templates')
await syncDirectory('assets')
