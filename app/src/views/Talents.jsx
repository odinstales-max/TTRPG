import React, { useMemo, useState } from 'react'
import { talents, talentsById, TALENT_TAGS, SOURCES } from '../data.js'
import { ATTR_LABEL, TALENT_LEVELS, costLabel } from '../rules.js'

export function TalentCard({ t, children, className = '' }) {
  const chain = (t.tags || []).find((x) => x.startsWith('chain:'))
  const prereqs = (t.prereq_ids || []).map((id) => talentsById[id]?.name || id)
  return (
    <article className={`card ${className}`}>
      <div className="row">
        <h3>{t.name}</h3>
        <span className="tag">{costLabel(t)}</span>
      </div>
      <p className="meta">
        Level {t.level_req}
        {t.attr_req && ` · ${t.attr_req.attr === 'any' ? 'any Attribute' : ATTR_LABEL[t.attr_req.attr]} ${t.attr_req.die}+`}
        {prereqs.length > 0 && ` · after ${prereqs.join(', ')}`}
      </p>
      <p className="text">{t.text}</p>
      <div style={{ marginTop: 6 }}>
        {(t.tags || []).filter((x) => !x.startsWith('chain:')).map((x) => (
          <span className="tag" key={x}>{x}</span>
        ))}
        {chain && <span className="tag">{chain.replace('chain:', '').replace(/-/g, ' ')}</span>}
      </div>
      {children}
    </article>
  )
}

export default function Talents() {
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('')
  const [tag, setTag] = useState('')
  const [source, setSource] = useState('')

  const shown = useMemo(() => talents.filter((t) => {
    if (level && t.level_req !== Number(level)) return false
    if (tag && !(t.tags || []).includes(tag)) return false
    if (source && !t.source_class.includes(source)) return false
    if (q) {
      const hay = `${t.name} ${t.text} ${t.source_class} ${(t.tags || []).join(' ')}`.toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    return true
  }), [q, level, tag, source])

  return (
    <>
      <h1>Talents</h1>
      <p className="lede">
        The power-progression axis: one Talent at each of levels {TALENT_LEVELS.join(', ')}.
        Any Talent whose gates you meet is available — the web is fully open.
      </p>
      <div className="controls">
        <input type="text" placeholder="Search name, text, source…" value={q}
               onChange={(e) => setQ(e.target.value)} />
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Any level</option>
          {TALENT_LEVELS.map((l) => <option key={l} value={l}>Level {l}</option>)}
        </select>
        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">Any tag</option>
          {TALENT_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">Any source</option>
          {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="count">{shown.length} of {talents.length}</span>
      </div>
      <div className="grid">
        {shown.map((t) => <TalentCard key={t.id} t={t} />)}
      </div>
      {!shown.length && <p className="empty">Nothing matches those filters.</p>}
    </>
  )
}
