import React, { useMemo, useState } from 'react'
import { talents, traits, spells } from '../data.js'

const FILES = {
  'talents.json': talents,
  'traits.json': traits,
  'spells.json': spells,
}

const TEMPLATES = {
  'talents.json': {
    id: 'new-talent', name: 'New Talent', level_req: 2, attr_req: null,
    prereq_ids: [], momentum_cost: 0, reserve_cost: null, ap_cost: 1,
    tags: [], source_class: 'general', text: '',
  },
  'traits.json': {
    id: 'new-trait', name: 'New Trait', flavor: 'social',
    attr_req: { attr: 'resolve', die: 'd6', op: 'min' },
    paired_with: null, tags: [], text: '',
  },
  'spells.json': {
    id: 'new-spell', name: 'New Spell', school: 'evocation', tier: 0,
    focus_cost: 0, target: 'Agility Defense', range: '60ft', tags: [],
    action: '1AP', channeled: false, text: '',
  },
}

export default function Admin() {
  const [file, setFile] = useState('talents.json')
  const [rows, setRows] = useState(() => JSON.parse(JSON.stringify(FILES['talents.json'])))
  const [sel, setSel] = useState(0)
  const [draft, setDraft] = useState(() => JSON.stringify(FILES['talents.json'][0], null, 2))
  const [q, setQ] = useState('')
  const [status, setStatus] = useState(null)
  const [dirty, setDirty] = useState(false)

  const switchFile = (f) => {
    const copy = JSON.parse(JSON.stringify(FILES[f]))
    setFile(f); setRows(copy); setSel(0)
    setDraft(JSON.stringify(copy[0] ?? {}, null, 2))
    setStatus(null); setDirty(false); setQ('')
  }

  const select = (i) => {
    setSel(i)
    setDraft(JSON.stringify(rows[i], null, 2))
    setStatus(null)
  }

  const applyDraft = () => {
    try {
      const parsed = JSON.parse(draft)
      if (!parsed.id || !parsed.name) throw new Error('id and name are required')
      const clash = rows.some((r, i) => i !== sel && r.id === parsed.id)
      if (clash) throw new Error(`another entry already uses id "${parsed.id}"`)
      const nameClash = rows.some((r, i) => i !== sel &&
        r.name.trim().toLowerCase() === String(parsed.name).trim().toLowerCase())
      if (nameClash) throw new Error(`another entry already uses the name "${parsed.name}"`)
      const next = rows.slice()
      next[sel] = parsed
      setRows(next); setDirty(true)
      setStatus({ ok: true, msg: `Applied "${parsed.name}" — not written to disk yet.` })
    } catch (err) {
      setStatus({ ok: false, msg: String(err.message || err) })
    }
  }

  const addRow = () => {
    const tpl = { ...TEMPLATES[file] }
    let n = 1
    while (rows.some((r) => r.id === tpl.id)) { tpl.id = `${TEMPLATES[file].id}-${++n}`; tpl.name = `${TEMPLATES[file].name} ${n}` }
    const next = [...rows, tpl]
    setRows(next); setSel(next.length - 1)
    setDraft(JSON.stringify(tpl, null, 2)); setDirty(true)
    setStatus({ ok: true, msg: 'New entry added to the working copy.' })
  }

  const removeRow = () => {
    if (!confirm(`Delete "${rows[sel]?.name}" from the working copy?`)) return
    const next = rows.filter((_, i) => i !== sel)
    const at = Math.max(0, sel - 1)
    setRows(next); setSel(at)
    setDraft(JSON.stringify(next[at] ?? {}, null, 2)); setDirty(true)
    setStatus({ ok: true, msg: 'Removed. Save to write the change to disk.' })
  }

  const save = async () => {
    try {
      const res = await fetch('/__api/save', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ file, content: rows }),
      })
      const out = await res.json()
      if (!out.ok) throw new Error(out.error)
      setDirty(false)
      setStatus({ ok: true, msg: `Wrote ${out.count} entries to data/${file}. Reload to pick up the change.` })
    } catch (err) {
      setStatus({
        ok: false,
        msg: `Could not write to disk (${err.message}). The write-back endpoint only exists in \`npm run dev\` — use Download instead.`,
      })
    }
  }

  const download = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2) + '\n'], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = file
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const shown = useMemo(() => rows
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => !q || `${r.name} ${r.id}`.toLowerCase().includes(q.toLowerCase())),
  [rows, q])

  return (
    <>
      <h1>Admin Editor</h1>
      <p className="lede">
        Edits the working copy in memory, then writes whole files back to <code>data/</code>.
        Writing needs the dev server (<code>npm run dev</code>); on a static host, download the
        file and commit it yourself.
      </p>

      <div className="controls">
        <div className="chips">
          {Object.keys(FILES).map((f) => (
            <button key={f} className={`chip ${file === f ? 'on' : ''}`}
                    onClick={() => (!dirty || confirm('Discard unsaved edits?')) && switchFile(f)}>
              {f}
            </button>
          ))}
        </div>
        <button className="primary" onClick={save} disabled={!dirty}>
          {dirty ? 'Save to data/' : 'Saved'}
        </button>
        <button onClick={download}>Download</button>
        <button onClick={addRow}>+ New</button>
        <button className="ghost" onClick={removeRow} disabled={!rows.length}>Delete</button>
        <span className="count">{rows.length} entries{dirty ? ' · unsaved' : ''}</span>
      </div>

      {status && (
        <p className={status.ok ? 'ok-text' : 'warn-text'} style={{ marginTop: -6 }}>{status.msg}</p>
      )}

      <div className="builder">
        <div className="panel">
          <h2>Editing: {rows[sel]?.name ?? '—'}</h2>
          <textarea value={draft} spellCheck={false} style={{ minHeight: 420, fontFamily: 'ui-monospace, monospace', fontSize: 12.5 }}
                    onChange={(e) => setDraft(e.target.value)} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="primary" onClick={applyDraft}>Apply to working copy</button>
            <button className="ghost" onClick={() => select(sel)}>Revert entry</button>
          </div>
          <p className="meta" style={{ marginBottom: 0 }}>
            Duplicate ids and names are rejected here, the same rule
            <code> scripts/check_dupes.py </code> enforces before a commit.
          </p>
        </div>

        <div className="panel sticky">
          <h2>Entries</h2>
          <input type="text" placeholder="Filter…" value={q} style={{ width: '100%', marginBottom: 8 }}
                 onChange={(e) => setQ(e.target.value)} />
          <div style={{ maxHeight: 460, overflowY: 'auto' }}>
            {shown.map(({ r, i }) => (
              <div className="stat" key={r.id + i}
                   style={{ cursor: 'pointer', color: i === sel ? 'var(--accent)' : undefined }}
                   onClick={() => select(i)}>
                <span>{r.name}</span>
                <b style={{ fontSize: 11, color: 'var(--faint)' }}>
                  {file === 'spells.json' ? `T${r.tier}` : file === 'talents.json' ? `L${r.level_req}` : r.flavor}
                </b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
