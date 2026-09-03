import React, { useMemo, useState } from 'react'
import { traits, traitsById } from '../data.js'
import { ATTR_LABEL, BASE_TRAITS, TRAIT_LEVELS } from '../rules.js'

export function TraitCard({ t, children, className = '' }) {
  const req = t.attr_req
  const gate = req
    ? `${ATTR_LABEL[req.attr]} ${req.die}${req.op === 'max' ? ' or lower' : '+'}`
    : 'no gate'
  const pair = t.paired_with ? traitsById[t.paired_with]?.name : null
  return (
    <article className={`card ${className}`}>
      <div className="row">
        <h3>{t.name}</h3>
        <span className="tag">{t.flavor === 'social' ? 'Social' : 'Good/Bad'}</span>
      </div>
      <p className="meta">
        {gate}
        {pair && ` · mirrors ${pair}`}
      </p>
      <p className="text">{t.text}</p>
      <div style={{ marginTop: 6 }}>
        {(t.tags || []).map((x) => (
          <span className={`tag ${x === 'weakness' ? 'warn' : ''}`} key={x}>{x}</span>
        ))}
      </div>
      {children}
    </article>
  )
}

export default function Traits() {
  const [q, setQ] = useState('')
  const [flavor, setFlavor] = useState('')

  const shown = useMemo(() => traits.filter((t) => {
    if (flavor && t.flavor !== flavor) return false
    if (q && !`${t.name} ${t.text}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  }), [q, flavor])

  return (
    <>
      <h1>Traits</h1>
      <p className="lede">
        The characterization axis: choose {BASE_TRAITS} at creation and one more at
        level {TRAIT_LEVELS.join(' and ')}. Gated by Attribute Die, never by level.
        Taking a weakness grants an extra choice.
      </p>
      <div className="controls">
        <input type="text" placeholder="Search traits…" value={q}
               onChange={(e) => setQ(e.target.value)} />
        <div className="chips">
          {[['', 'All'], ['social', 'Social'], ['good_bad', 'Good/Bad']].map(([v, label]) => (
            <button key={v} className={`chip ${flavor === v ? 'on' : ''}`}
                    onClick={() => setFlavor(v)}>{label}</button>
          ))}
        </div>
        <span className="count">{shown.length} of {traits.length}</span>
      </div>
      <div className="grid">
        {shown.map((t) => <TraitCard key={t.id} t={t} />)}
      </div>
      {!shown.length && <p className="empty">Nothing matches those filters.</p>}
    </>
  )
}
