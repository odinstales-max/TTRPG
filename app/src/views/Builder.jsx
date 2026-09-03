import React, { useMemo, useState } from 'react'
import { talents, traits, spells, talentsById, traitsById } from '../data.js'
import { TalentCard } from './Talents.jsx'
import { TraitCard } from './Traits.jsx'
import { SpellCard } from './Spells.jsx'
import {
  ATTRS, ATTR_LABEL, DICE, dieIndex, dieMax, stepUp, defenseOf,
  HEALTH_TIERS, TALENT_LEVELS, INCREASE_LEVELS, TRAIT_LEVELS,
  talentSlots, increaseSlots, traitSlots, reserveBudget, momentumCap,
  talentGate, meetsAttrReq, expectedHp, apNote, tierUnlockLevel,
  NATURAL_DIE_CAP, AP_PER_TURN,
} from '../rules.js'

const KEY = 'gamename-v4-character'

const BLANK = {
  name: '',
  level: 1,
  tier: 'frontline',
  base: { vigor: 'd6', agility: 'd4', focus: 'd6', resolve: 'd4' },
  increases: { vigor: 0, agility: 0, focus: 0, resolve: 0 },
  legendaryAttr: '',
  talents: [],
  traits: [],
  spells: [],
  reserves: { vigor: 0, agility: 0, focus: 0, resolve: 0 },
  hpOverride: '',
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...BLANK, ...JSON.parse(raw) } : { ...BLANK }
  } catch {
    return { ...BLANK }
  }
}

function effectiveDice(c) {
  const out = {}
  for (const a of ATTRS) {
    let die = c.base[a]
    for (let i = 0; i < (c.increases[a] || 0); i++) {
      if (dieIndex(die) >= dieIndex(NATURAL_DIE_CAP)) break
      die = stepUp(die)
    }
    out[a] = die
  }
  // The one road past d10 that leveling provides: the level-10 capstone Talent.
  if (c.talents.includes('legendary-attribute') && c.legendaryAttr &&
      out[c.legendaryAttr] === NATURAL_DIE_CAP) {
    out[c.legendaryAttr] = 'd12'
  }
  return out
}

function Section({ title, right, children }) {
  return (
    <section className="panel">
      <div className="row">
        <h2>{title}</h2>
        {right}
      </div>
      {children}
    </section>
  )
}

export default function Builder() {
  const [c, setC] = useState(load)
  const [tab, setTab] = useState('talents')
  const [q, setQ] = useState('')

  const set = (patch) => setC((prev) => {
    const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode */ }
    return next
  })

  const dice = useMemo(() => effectiveDice(c), [c])
  const chosenTraits = c.traits.map((id) => traitsById[id]).filter(Boolean)
  const chosenTalents = c.talents.map((id) => talentsById[id]).filter(Boolean)

  const slots = {
    talents: talentSlots(c.level),
    increases: increaseSlots(c.level),
    traits: traitSlots(c.level, chosenTraits),
    reserve: reserveBudget(c.level),
  }
  const used = {
    increases: ATTRS.reduce((n, a) => n + (c.increases[a] || 0), 0),
    reserve: ATTRS.reduce((n, a) => n + (c.reserves[a] || 0), 0),
  }

  const startingOk = useMemo(() => {
    const counts = ATTRS.map((a) => c.base[a])
    return counts.filter((d) => d === 'd6').length === 2 &&
           counts.filter((d) => d === 'd4').length === 2
  }, [c.base])

  const unlockedSchools = chosenTalents
    .filter((t) => (t.tags || []).includes('school-access'))
    .map((t) => t.id.replace('school-of-', ''))
  const maxTier = [0, 1, 2, 3].filter((t) => tierUnlockLevel(t) <= c.level).pop() ?? 0

  // Anything that stopped being legal after a level or die change.
  const violations = []
  chosenTalents.forEach((t) => {
    const g = talentGate(t, { level: c.level, dice, chosenIds: c.talents.filter((x) => x !== t.id) })
    if (!g.ok) {
      violations.push(`${t.name}: needs ${[...g.reasons,
        ...g.missing.map((m) => talentsById[m]?.name || m)].join(', ')}`)
    }
  })
  chosenTraits.forEach((t) => {
    if (!meetsAttrReq(t.attr_req, dice)) violations.push(`${t.name}: attribute gate no longer met`)
  })
  if (c.talents.length > slots.talents) violations.push(`${c.talents.length} Talents chosen, ${slots.talents} earned`)
  if (c.traits.length > slots.traits) violations.push(`${c.traits.length} Traits chosen, ${slots.traits} earned`)
  if (used.increases > slots.increases) violations.push(`${used.increases} die increases spent, ${slots.increases} earned`)
  if (used.reserve > slots.reserve) violations.push(`${used.reserve} Reserve points allocated, ${slots.reserve} available`)
  if (!startingOk) violations.push('Starting array should be two d6 and two d4')

  const hp = c.hpOverride !== '' ? Number(c.hpOverride) : expectedHp({ tier: c.tier, dice, level: c.level })

  const toggle = (field, id, limit) => set((prev) => {
    const has = prev[field].includes(id)
    if (!has && limit != null && prev[field].length >= limit) return prev
    return { ...prev, [field]: has ? prev[field].filter((x) => x !== id) : [...prev[field], id] }
  })

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ ...c, derived: { dice, hp } }, null, 2)],
                          { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${(c.name || 'character').replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const matches = (text) => !q || text.toLowerCase().includes(q.toLowerCase())

  return (
    <>
      <h1>Character Builder</h1>
      <p className="lede">
        Every gate in the Talent web is checked against this character as you build.
        Saved to this browser automatically.
      </p>

      <div className="builder">
        <div>
          <Section title="Identity">
            <div className="controls" style={{ margin: 0, border: 0, padding: 0, background: 'none' }}>
              <label className="field">Name
                <input type="text" value={c.name} onChange={(e) => set({ name: e.target.value })}
                       placeholder="Unnamed" />
              </label>
              <label className="field">Level
                <select value={c.level} onChange={(e) => set({ level: Number(e.target.value) })}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </label>
              <label className="field">Health Tier
                <select value={c.tier} onChange={(e) => set({ tier: e.target.value })}>
                  {HEALTH_TIERS.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.base} + Vigor max)</option>
                  ))}
                </select>
              </label>
              <label className="field">HP override
                <input type="number" value={c.hpOverride} placeholder={String(hp)}
                       onChange={(e) => set({ hpOverride: e.target.value })} />
              </label>
            </div>
            <p className="meta" style={{ marginBottom: 0 }}>
              {HEALTH_TIERS.find((t) => t.id === c.tier)?.blurb}
            </p>
          </Section>

          <Section
            title="Attributes"
            right={<span className="count">
              {used.increases}/{slots.increases} increases · levels {INCREASE_LEVELS.join(', ')}
            </span>}
          >
            {ATTRS.map((a) => {
              const atCap = dieIndex(dice[a]) >= dieIndex(NATURAL_DIE_CAP)
              return (
                <div className="dice-row" key={a}>
                  <span className="name">{ATTR_LABEL[a]}</span>
                  <select value={c.base[a]}
                          onChange={(e) => set({ base: { ...c.base, [a]: e.target.value } })}>
                    {['d4', 'd6'].map((d) => <option key={d} value={d}>start {d}</option>)}
                  </select>
                  <button className="sm" disabled={!c.increases[a]}
                          onClick={() => set({ increases: { ...c.increases, [a]: c.increases[a] - 1 } })}>−</button>
                  <span className="die">{dice[a]}</span>
                  <button className="sm"
                          disabled={atCap || used.increases >= slots.increases}
                          onClick={() => set({ increases: { ...c.increases, [a]: (c.increases[a] || 0) + 1 } })}>+</button>
                  <span className="count" style={{ marginLeft: 0 }}>
                    Defense {defenseOf(dice[a])} · Reserve {dieMax(c.base[a]) + (c.reserves[a] || 0)}
                  </span>
                  <input type="number" min="0" style={{ width: 62 }} value={c.reserves[a] || 0}
                         onChange={(e) => set({ reserves: { ...c.reserves, [a]: Math.max(0, Number(e.target.value)) } })} />
                </div>
              )
            })}
            <p className="meta" style={{ margin: '6px 0 0' }}>
              Natural progression caps at {NATURAL_DIE_CAP}. Reserve points allocated:{' '}
              {used.reserve}/{slots.reserve} (+4 per level, split as you like).
            </p>
            {c.talents.includes('legendary-attribute') && (
              <div className="dice-row" style={{ marginTop: 8 }}>
                <span className="name">d12 via capstone</span>
                <select value={c.legendaryAttr} onChange={(e) => set({ legendaryAttr: e.target.value })}>
                  <option value="">— choose an Attribute at d10 —</option>
                  {ATTRS.filter((a) => {
                    let d = c.base[a]
                    for (let i = 0; i < (c.increases[a] || 0); i++) d = dieIndex(d) >= dieIndex(NATURAL_DIE_CAP) ? d : stepUp(d)
                    return d === NATURAL_DIE_CAP
                  }).map((a) => <option key={a} value={a}>{ATTR_LABEL[a]}</option>)}
                </select>
              </div>
            )}
          </Section>

          <Section
            title="Choices"
            right={
              <div className="chips">
                {[['talents', `Talents ${c.talents.length}/${slots.talents}`],
                  ['traits', `Traits ${c.traits.length}/${slots.traits}`],
                  ['spells', `Spells ${c.spells.length}`]].map(([v, label]) => (
                  <button key={v} className={`chip ${tab === v ? 'on' : ''}`}
                          onClick={() => setTab(v)}>{label}</button>
                ))}
              </div>
            }
          >
            <div className="controls" style={{ margin: '0 0 10px' }}>
              <input type="text" placeholder={`Search ${tab}…`} value={q}
                     onChange={(e) => setQ(e.target.value)} />
              {tab === 'spells' && (
                <span className="count">
                  {unlockedSchools.length
                    ? `Schools: ${unlockedSchools.join(', ')} · up to Tier ${maxTier}`
                    : 'Take a School-access Talent to unlock spells'}
                </span>
              )}
            </div>

            {tab === 'talents' && (
              <div className="grid">
                {talents
                  .filter((t) => matches(`${t.name} ${t.text}`))
                  .map((t) => {
                    const taken = c.talents.includes(t.id)
                    const gate = talentGate(t, {
                      level: c.level, dice,
                      chosenIds: c.talents.filter((x) => x !== t.id),
                    })
                    const full = !taken && c.talents.length >= slots.talents
                    return (
                      <TalentCard key={t.id} t={t}
                                  className={taken ? 'taken' : gate.ok ? '' : 'locked'}>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button className={taken ? '' : 'primary'}
                                  disabled={!taken && (!gate.ok || full)}
                                  onClick={() => toggle('talents', t.id, slots.talents)}>
                            {taken ? 'Remove' : 'Take'}
                          </button>
                          {!taken && !gate.ok && (
                            <span className="warn-text">
                              needs {[...gate.reasons,
                                ...gate.missing.map((m) => talentsById[m]?.name || m)].join(', ')}
                            </span>
                          )}
                          {!taken && gate.ok && full && <span className="warn-text">no slots left</span>}
                        </div>
                      </TalentCard>
                    )
                  })}
              </div>
            )}

            {tab === 'traits' && (
              <div className="grid">
                {traits
                  .filter((t) => matches(`${t.name} ${t.text}`))
                  .map((t) => {
                    const taken = c.traits.includes(t.id)
                    const ok = meetsAttrReq(t.attr_req, dice)
                    const full = !taken && c.traits.length >= slots.traits
                    return (
                      <TraitCard key={t.id} t={t}
                                 className={taken ? 'taken' : ok ? '' : 'locked'}>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button className={taken ? '' : 'primary'}
                                  disabled={!taken && (!ok || full)}
                                  onClick={() => toggle('traits', t.id, slots.traits)}>
                            {taken ? 'Remove' : 'Choose'}
                          </button>
                          {!taken && !ok && <span className="warn-text">attribute gate not met</span>}
                          {!taken && ok && full && <span className="warn-text">no slots left</span>}
                        </div>
                      </TraitCard>
                    )
                  })}
              </div>
            )}

            {tab === 'spells' && (
              <div className="grid">
                {spells
                  .filter((s) => unlockedSchools.includes(s.school))
                  .filter((s) => s.tier <= maxTier)
                  .filter((s) => matches(`${s.name} ${s.text}`))
                  .map((s) => {
                    const taken = c.spells.includes(s.id)
                    return (
                      <SpellCard key={s.id} s={s} className={taken ? 'taken' : ''}>
                        <div style={{ marginTop: 8 }}>
                          <button className={taken ? '' : 'primary'}
                                  onClick={() => toggle('spells', s.id)}>
                            {taken ? 'Remove' : 'Learn'}
                          </button>
                        </div>
                      </SpellCard>
                    )
                  })}
                {!unlockedSchools.length && (
                  <p className="empty">
                    No Schools unlocked yet — take a School-access Talent (level 2, Focus d6+).
                  </p>
                )}
              </div>
            )}
          </Section>
        </div>

        <aside className="sticky">
          <section className="panel">
            <h2>{c.name || 'Unnamed'} · Level {c.level}</h2>
            {ATTRS.map((a) => (
              <div className="stat" key={a}>
                <span>{ATTR_LABEL[a]}</span>
                <b>{dice[a]} · Def {defenseOf(dice[a])} · Res {dieMax(c.base[a]) + (c.reserves[a] || 0)}</b>
              </div>
            ))}
            <div className="stat"><span>Hit Points</span><b>{hp}{c.hpOverride !== '' ? '' : ' (avg)'}</b></div>
            <div className="stat"><span>Momentum cap</span><b>{momentumCap(c.talents)}</b></div>
            <div className="stat"><span>Action Points</span><b>{AP_PER_TURN}{c.talents.includes('blur-of-motion') ? ' +1*' : ''}</b></div>
            <div className="stat"><span>Readied slots</span><b>{dieMax(dice.agility)}</b></div>
            <p className="meta" style={{ margin: '8px 0 0' }}>{apNote(c.talents)}</p>
          </section>

          <section className="panel">
            <h2>Build sheet</h2>
            <div className="stat"><span>Talents</span><b>{c.talents.length}/{slots.talents}</b></div>
            {chosenTalents.length
              ? <p className="text">{chosenTalents.map((t) => t.name).join(' · ')}</p>
              : <p className="empty">None yet (first at level {TALENT_LEVELS[0]}).</p>}
            <div className="stat" style={{ marginTop: 8 }}><span>Traits</span><b>{c.traits.length}/{slots.traits}</b></div>
            {chosenTraits.length
              ? <p className="text">{chosenTraits.map((t) => t.name).join(' · ')}</p>
              : <p className="empty">None yet (choose 2 at creation).</p>}
            <div className="stat" style={{ marginTop: 8 }}><span>Spells</span><b>{c.spells.length}</b></div>
            {c.spells.length
              ? <p className="text">{c.spells.map((id) => spells.find((s) => s.id === id)?.name).join(' · ')}</p>
              : <p className="empty">None learned.</p>}
          </section>

          <section className="panel">
            <h2>Validation</h2>
            {violations.length === 0
              ? <p className="ok-text">Legal build — every gate satisfied.</p>
              : violations.map((v, i) => <p className="warn-text" key={i}>• {v}</p>)}
          </section>

          <section className="panel">
            <h2>Sheet</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={exportJson}>Export JSON</button>
              <button onClick={() => window.print()}>Print</button>
              <button className="ghost" onClick={() => { if (confirm('Clear this character?')) set({ ...BLANK }) }}>
                Reset
              </button>
            </div>
            <p className="meta" style={{ margin: '8px 0 0' }}>
              Trait slots: 2 at creation, +1 at {TRAIT_LEVELS.join(' & ')}, +1 per weakness taken.
            </p>
          </section>
        </aside>
      </div>
    </>
  )
}
