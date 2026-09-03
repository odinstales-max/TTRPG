import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const DATA_DIR = path.resolve(__dirname, '..', 'data')
const WRITABLE = new Set(['talents.json', 'traits.json', 'spells.json'])

/**
 * Dev-only write-back endpoint for the admin editor.
 * Deliberately absent from production builds: a static host has no server to
 * write with, so the editor falls back to downloading the edited file.
 */
function adminWriteBack() {
  return {
    name: 'admin-write-back',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__api/save', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('POST only')
        }
        let body = ''
        req.on('data', (c) => { body += c })
        req.on('end', () => {
          try {
            const { file, content } = JSON.parse(body)
            if (!WRITABLE.has(file)) throw new Error(`refusing to write ${file}`)
            if (!Array.isArray(content)) throw new Error('content must be an array')
            const ids = content.map((r) => r.id)
            const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
            if (dupes.length) throw new Error(`duplicate ids: ${dupes.join(', ')}`)
            fs.writeFileSync(
              path.join(DATA_DIR, file),
              JSON.stringify(content, null, 2) + '\n',
              'utf8'
            )
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ ok: true, file, count: content.length }))
          } catch (err) {
            res.statusCode = 400
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: String(err.message || err) }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  root: __dirname,
  base: './',
  plugins: [react(), adminWriteBack()],
  server: { fs: { allow: ['..'] } },
  build: { outDir: 'dist', emptyOutDir: true },
})
