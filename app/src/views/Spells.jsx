import React, { useMemo, useState } from 'react'
import { spells, SCHOOLS } from '../data.js'
import { SPELL_TIER_TABLE } from '../rules.js'

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export function SpellCard({ s, children, className = '' }) {
  return (
    <article className={`card ${className}`}>
      <div className="row">
        <h3>{s.name}</h3>
        <span className="tag">Tier {s.tier}</span>
      </div>
      <p className="meta">
        {cap(s.school)} · {s.focus_cost === 0 ? 'free' : `${s.focus_cost} Focus`} ·{' '}
        {s.action === '1AP' ? '1 AP' : s.action} · {s.range} · vs {s.target}
        {s.channeled && ' · Channeled'}
      </p>
      <p className="text">{s.text}</p>
      <div style={{ marginTop: 6 }}>
        {(s.tags || []).map((x) => <span className="tag" key={x}>{x}</span>)}
      </div>
      {children}
    </article>
  )
}

export default function Spells() {
  const [q, setQ] = useState('')
  const [school, setSchool] = useState('')
  const [tier, setTier] = useState('')

  const shown = useMemo(() => spells.filter((s) => {
    if (school && s.school !== school) return false
    if (tier !== '' && s.tier !== Number(tier)) return false
    if (q && !`${s.name} ${s.text} ${(s.tags || []).join(' ')}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  }), [q, school, tier])

  return (
    <>
      <h1>Spells</h1>
      <p className="lede">
        Access is granted by Talents, one School at a time. Casting costs 1 AP plus the
        spell's Reserve cost; Reaction and Free spells keep those tags.
      </p>
      <div className="controls">
        <input type="text" placeholder="Search spells…" value={q}
               onChange={(e) => setQ(e.target.value)} />
        <select value={school} onChange={(e) => setSchool(e.target.value)}>
          <option value="">All schools</option>
          {SCHOOLS.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
        </select>
        <div className="chips">
          {['', 0, 1, 2, 3].map((t) => (
            <button key={String(t)} className={`chip ${String(tier) === String(t) ? 'on' : ''}`}
                    onClick={() => setTier(t)}>{t === '' ? 'All tiers' : `T${t}`}</button>
          ))}
        </div>
        <span className="count">{shown.length} of {spells.length}</span>
      </div>
      {tier !== '' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Tier</th><th>Reserve</th><th>Impact Dice</th><th>Default Save Difficulty</th></tr></thead>
            <tbody>
              {SPELL_TIER_TABLE.filter((r) => r.tier === Number(tier)).map((r) => (
                <tr key={r.tier}>
                  <td>{r.tier}</td><td>{r.reserve}</td><td>{r.dice}</td><td>{r.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="grid">
        {shown.map((s) => <SpellCard key={s.id} s={s} />)}
      </div>
      {!shown.length && <p className="empty">Nothing matches those filters.</p>}
    </>
  )
}
