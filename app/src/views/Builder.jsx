import React, { useEffect, useMemo, useState } from 'react'
import { talents, traits, spells, talentsById, traitsById, creation, creationBy, SCHOOLS } from '../data.js'
import { TalentCard } from './Talents.jsx'
import { TraitCard } from './Traits.jsx'
import { SpellCard } from './Spells.jsx'
import { useAccount } from '../account.jsx'
import {
  loadDraft, saveDraft, listCharacters, createCharacter,
  updateCharacter, deleteCharacter,
} from '../characters.js'
import {
  ATTRS, ATTR_LABEL, DICE, dieIndex, dieMax, stepUp, defenseOf,
  HEALTH_TIERS, TALENT_LEVELS, INCREASE_LEVELS, TRAIT_LEVELS,
  talentSlots, increaseSlots, traitSlots, reserveBudget, momentumCap,
  talentGate, meetsAttrReq, expectedHp, apNote, tierUnlockLevel,
  NATURAL_DIE_CAP, AP_PER_TURN, CREATION_POINTS, CREATION_START_DIE,
  DIE_STEP_COST, CREATION_LIMITS, RESERVE_PER_PURCHASE, dieCost, creationSpend,
} from '../rules.js'

const BLANK = {
  name: '',
  level: 1,
  tier: 'adept',
  base: { vigor: 'd4', agility: 'd4', focus: 'd4', resolve: 'd4' },
  increases: { vigor: 0, agility: 0, focus: 0, resolve: 0 },
  legendaryAttr: '',
  creation: { reserve: 0, trait: 0, wealth: 0 },
  creationSchools: [],
  specialties: [],
  access: [],
  feature: '',
  talents: [],
  traits: [],
  spells: [],
  reserves: { vigor: 0, agility: 0, focus: 0, resolve: 0 },
  hpOverride: '',
}

function load() {
  // Characters built before point-buy started at d6/d4; merging onto BLANK
  // migrates them to the new baseline rather than silently mispricing them.
  const saved = loadDraft(null)
  if (!saved) return { ...BLANK }
  return { ...BLANK, ...saved, creation: { ...BLANK.creation, ...(saved.creation || {}) } }
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
    saveDraft(next)
    return next
  })

  const { user, ready } = useAccount()
  const [library, setLibrary] = useState([])
  const [savedId, setSavedId] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [syncNote, setSyncNote] = useState('')

  const refreshLibrary = async (uid) => {
    try {
      setLibrary(await listCharacters(uid))
    } catch (err) {
      setSyncNote(`Could not load your characters: ${err.message}`)
    }
  }

  useEffect(() => {
    if (!user) { setLibrary([]); setSavedId(null); return }
    refreshLibrary(user.uid)
  }, [user])

  const saveToCloud = async () => {
    if (!user) return
    setSyncing(true); setSyncNote('')
    try {
      if (savedId) {
        await updateCharacter(user.uid, savedId, c)
        setSyncNote(`Saved "${c.name || 'Unnamed'}".`)
      } else {
        const id = await createCharacter(user.uid, c)
        setSavedId(id)
        setSyncNote(`Saved "${c.name || 'Unnamed'}" to your account.`)
      }
      await refreshLibrary(user.uid)
    } catch (err) {
      setSyncNote(`Save failed: ${err.message}`)
    } finally { setSyncing(false) }
  }

  const openCharacter = (row) => {
    set({ ...BLANK, ...row.sheet, creation: { ...BLANK.creation, ...(row.sheet?.creation || {}) } })
    setSavedId(row.id)
    setSyncNote(`Opened "${row.name}".`)
  }

  const removeCharacter = async (row) => {
    if (!user || !confirm(`Delete "${row.name}" from your account?`)) return
    setSyncing(true)
    try {
      await deleteCharacter(user.uid, row.id)
      if (savedId === row.id) setSavedId(null)
      await refreshLibrary(user.uid)
      setSyncNote(`Deleted "${row.name}".`)
    } catch (err) {
      setSyncNote(`Delete failed: ${err.message}`)
    } finally { setSyncing(false) }
  }

  const dice = useMemo(() => effectiveDice(c), [c])
  const chosenTraits = c.traits.map((id) => traitsById[id]).filter(Boolean)
  const chosenTalents = c.talents.map((id) => talentsById[id]).filter(Boolean)
  const spend = useMemo(() => creationSpend(c, creation), [c])
  const cpLeft = CREATION_POINTS - spend.total

  const slots = {
    talents: talentSlots(c.level),
    increases: increaseSlots(c.level),
    traits: traitSlots(c.level, chosenTraits) + (c.creation.trait || 0),
    reserve: reserveBudget(c.level),
  }
  const used = {
    increases: ATTRS.reduce((n, a) => n + (c.increases[a] || 0), 0),
    reserve: ATTRS.reduce((n, a) => n + (c.reserves[a] || 0), 0),
  }

  // Reserve pool = die maximum + points bought at creation + points allocated per level.
  const creationReserve = (c.creation.reserve || 0) * RESERVE_PER_PURCHASE
  const gold = 25 + (c.creation.wealth || 0) * 50 + (c.feature === 'cf-scavenger' ? 100 : 0)

  const schoolsFromTalents = chosenTalents
    .filter((t) => (t.tags || []).includes('school-access'))
    .map((t) => t.id.replace('school-of-', ''))
  const unlockedSchools = [...new Set([...schoolsFromTalents, ...(c.creationSchools || [])])]
  const maxTier = [0, 1, 2, 3].filter((t) => tierUnlockLevel(t) <= c.level).pop() ?? 0

  const violations = []
  if (spend.total > CREATION_POINTS) violations.push(`Creation overspent by ${spend.total - CREATION_POINTS} points`)
  chosenTalents.forEach((t) => {
    const g = talentGate(t, { level: c.level, dice, chosenIds: c.talents.filter((x) => x !== t.id) })
    if (!g.ok) violations.push(`${t.name}: needs ${[...g.reasons, ...g.missing.map((m) => talentsById[m]?.name || m)].join(', ')}`)
  })
  chosenTraits.forEach((t) => {
    if (!meetsAttrReq(t.attr_req, dice)) violations.push(`${t.name}: attribute gate no longer met`)
  })
  ;(c.access || []).forEach((id) => {
    const item = creation.find((x) => x.id === id)
    if (item?.requires && !meetsAttrReq(item.requires, dice)) {
      violations.push(`${item.name}: needs ${ATTR_LABEL[item.requires.attr]} ${item.requires.die}`)
    }
  })
  if ((c.creationSchools?.length || 0) > 0 && dieIndex(dice.focus) < dieIndex('d6')) {
    violations.push('Spell School access bought at creation requires Focus d6')
  }
  if (c.feature === 'cf-cantrip-touched' && dieIndex(dice.focus) < dieIndex('d6')) {
    violations.push('Cantrip Touched requires Focus d6')
  }
  if (c.talents.length > slots.talents) violations.push(`${c.talents.length} Talents chosen, ${slots.talents} earned`)
  if (c.traits.length > slots.traits) violations.push(`${c.traits.length} Traits chosen, ${slots.traits} available`)
  if (used.increases > slots.increases) violations.push(`${used.increases} die increases spent, ${slots.increases} earned`)
  if (used.reserve > slots.reserve) violations.push(`${used.reserve} level Reserve points allocated, ${slots.reserve} available`)

  const hp = c.hpOverride !== '' ? Number(c.hpOverride) : expectedHp({ tier: c.tier, dice, level: c.level })

  const toggle = (field, id, limit) => set((prev) => {
    const has = prev[field].includes(id)
    if (!has && limit != null && prev[field].length >= limit) return prev
    return { ...prev, [field]: has ? prev[field].filter((x) => x !== id) : [...prev[field], id] }
  })

  const bump = (key, delta, max) => set((prev) => {
    const now = prev.creation[key] || 0
    const next = Math.max(0, Math.min(max ?? 99, now + delta))
    return { ...prev, creation: { ...prev.creation, [key]: next } }
  })

  const buyDie = (attr, delta) => set((prev) => {
    const cur = prev.base[attr]
    const next = delta > 0
      ? (dieIndex(cur) >= dieIndex(NATURAL_DIE_CAP) ? cur : DICE[dieIndex(cur) + 1])
      : (dieIndex(cur) <= 0 ? cur : DICE[dieIndex(cur) - 1])
    return { ...prev, base: { ...prev.base, [attr]: next } }
  })

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ ...c, derived: { dice, hp, gold, spend } }, null, 2)],
                          { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${(c.name || 'character').replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const matches = (text) => !q || text.toLowerCase().includes(q.toLowerCase())
  const accessOptions = creationBy('access')
  const features = creationBy('feature')

  return (
    <>
      <h1>Character Builder</h1>
      <p className="lede">
        Creation spends {CREATION_POINTS} points; every gate in the Talent web is checked
        as you build. Saved to this browser automatically.
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
              <label className="field">HP override
                <input type="number" value={c.hpOverride} placeholder={String(hp)}
                       onChange={(e) => set({ hpOverride: e.target.value })} />
              </label>
              <span className={cpLeft < 0 ? 'warn-text' : 'count'}>
                {cpLeft} of {CREATION_POINTS} Creation Points left
              </span>
            </div>
          </Section>

          <Section
            title="Creation — Attributes"
            right={<span className="count">{spend.dice} CP · d4→d6 {DIE_STEP_COST.d4} · d6→d8 {DIE_STEP_COST.d6} · d8→d10 {DIE_STEP_COST.d8}</span>}
          >
            {ATTRS.map((a) => {
              const bought = c.base[a]
              const nextCost = DIE_STEP_COST[bought]
              const atCap = dieIndex(bought) >= dieIndex(NATURAL_DIE_CAP)
              return (
                <div className="dice-row" key={a}>
                  <span className="name">{ATTR_LABEL[a]}</span>
                  <button className="sm" disabled={bought === CREATION_START_DIE}
                          onClick={() => buyDie(a, -1)}>−</button>
                  <span className="die">{bought}</span>
                  <button className="sm" disabled={atCap || (nextCost ?? 99) > cpLeft}
                          onClick={() => buyDie(a, +1)}>+</button>
                  <span className="count" style={{ marginLeft: 0 }}>
                    {dieCost(bought)} CP{!atCap && ` · next +${nextCost}`}
                    {dice[a] !== bought && ` → ${dice[a]} with level increases`}
                  </span>
                  <span className="count">Def {defenseOf(dice[a])} · Reserve {dieMax(bought) + creationReserve + (c.reserves[a] || 0)}</span>
                </div>
              )
            })}
            <p className="meta" style={{ margin: '6px 0 0' }}>
              Every Attribute starts at {CREATION_START_DIE}. Level increases at {INCREASE_LEVELS.join(', ')} stack on
              top and are allocated below.
            </p>
          </Section>

          <Section title="Creation — Health, Reserves & Coin" right={<span className="count">{spend.health + spend.reserve + spend.wealth} CP</span>}>
            <div className="dice-row">
              <span className="name">Health</span>
              <select value={c.tier} onChange={(e) => set({ tier: e.target.value })}>
                {HEALTH_TIERS.slice().reverse().map((t) => (
                  <option key={t.id} value={t.id}>{t.name} — {t.base} + Vigor max — {t.cost} CP</option>
                ))}
              </select>
              <span className="count" style={{ marginLeft: 0 }}>
                {HEALTH_TIERS.find((t) => t.id === c.tier)?.blurb}
              </span>
            </div>
            <div className="dice-row">
              <span className="name">Reserves</span>
              <button className="sm" disabled={!c.creation.reserve} onClick={() => bump('reserve', -1, CREATION_LIMITS.reserve)}>−</button>
              <span className="die">+{creationReserve}</span>
              <button className="sm" disabled={c.creation.reserve >= CREATION_LIMITS.reserve || cpLeft < 1}
                      onClick={() => bump('reserve', +1, CREATION_LIMITS.reserve)}>+</button>
              <span className="count" style={{ marginLeft: 0 }}>
                1 CP per +{RESERVE_PER_PURCHASE}, max {CREATION_LIMITS.reserve} · split across pools as you like
              </span>
            </div>
            <div className="dice-row">
              <span className="name">Coin</span>
              <button className="sm" disabled={!c.creation.wealth} onClick={() => bump('wealth', -1, CREATION_LIMITS.wealth)}>−</button>
              <span className="die">{gold}g</span>
              <button className="sm" disabled={c.creation.wealth >= CREATION_LIMITS.wealth || cpLeft < 1}
                      onClick={() => bump('wealth', +1, CREATION_LIMITS.wealth)}>+</button>
              <span className="count" style={{ marginLeft: 0 }}>25g free · 1 CP per +50g</span>
            </div>
          </Section>

          <Section title="Creation — Specialties" right={<span className="count">{spend.specialties} CP · 2 each, max {CREATION_LIMITS.specialty}</span>}>
            {(c.specialties || []).map((name, i) => (
              <div className="dice-row" key={i}>
                <input type="text" value={name} placeholder="Lockwork, Tracking, Field Medicine…"
                       style={{ flex: 1 }}
                       onChange={(e) => set((prev) => {
                         const next = prev.specialties.slice(); next[i] = e.target.value
                         return { ...prev, specialties: next }
                       })} />
                <button className="sm" onClick={() => set((prev) => ({
                  ...prev, specialties: prev.specialties.filter((_, n) => n !== i),
                }))}>Remove</button>
              </div>
            ))}
            <button disabled={(c.specialties?.length || 0) >= CREATION_LIMITS.specialty + (c.feature === 'cf-well-traveled' ? 1 : 0) || cpLeft < 2}
                    onClick={() => set((prev) => ({ ...prev, specialties: [...(prev.specialties || []), ''] }))}>
              + Specialty (2 CP)
            </button>
            <p className="meta" style={{ marginBottom: 0 }}>
              Upgrade your Attribute Die on Tasks the Specialty covers. Never on Impact Rolls or Saves.
            </p>
          </Section>

          <Section title="Creation — Access & Schools" right={<span className="count">{spend.access + spend.schools} CP</span>}>
            <div className="chips" style={{ marginBottom: 10 }}>
              {accessOptions.map((opt) => {
                const on = (c.access || []).includes(opt.id)
                const gated = opt.requires && !meetsAttrReq(opt.requires, dice)
                return (
                  <button key={opt.id} className={`chip ${on ? 'on' : ''}`}
                          title={opt.text}
                          disabled={!on && (gated || cpLeft < opt.cost)}
                          onClick={() => toggle('access', opt.id)}>
                    {opt.name.replace('Access: ', '')} · {opt.cost}
                    {gated ? ` · needs ${ATTR_LABEL[opt.requires.attr]} ${opt.requires.die}` : ''}
                  </button>
                )
              })}
            </div>
            <div className="chips">
              {SCHOOLS.map((s) => {
                const on = (c.creationSchools || []).includes(s)
                const viaTalent = schoolsFromTalents.includes(s)
                const blocked = !on && (dieIndex(dice.focus) < dieIndex('d6') || cpLeft < 4 ||
                  (c.creationSchools?.length || 0) >= CREATION_LIMITS.school)
                return (
                  <button key={s} className={`chip ${on ? 'on' : ''}`}
                          disabled={viaTalent || blocked}
                          onClick={() => toggle('creationSchools', s, CREATION_LIMITS.school)}>
                    {s} · 4{viaTalent ? ' (via Talent)' : ''}
                  </button>
                )
              })}
            </div>
            <p className="meta" style={{ marginBottom: 0 }}>
              Schools need Focus d6, cost 4 CP, max {CREATION_LIMITS.school} at creation. The
              School-access Talent is still available from level 2.
            </p>
          </Section>

          <Section title="Creation — Feature" right={<span className="count">{spend.feature} CP · one, 4 CP</span>}>
            <div className="grid">
              {features.map((f) => {
                const on = c.feature === f.id
                const gated = f.requires && !meetsAttrReq(f.requires, dice)
                return (
                  <article className={`card ${on ? 'taken' : gated ? 'locked' : ''}`} key={f.id}>
                    <div className="row">
                      <h3>{f.name}</h3>
                      <span className="tag">{f.cost} CP</span>
                    </div>
                    <p className="text">{f.text}</p>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button className={on ? '' : 'primary'}
                              disabled={!on && (gated || cpLeft < f.cost)}
                              onClick={() => set({ feature: on ? '' : f.id })}>
                        {on ? 'Remove' : 'Take'}
                      </button>
                      {!on && gated && <span className="warn-text">needs {ATTR_LABEL[f.requires.attr]} {f.requires.die}</span>}
                    </div>
                  </article>
                )
              })}
            </div>
            <p className="meta" style={{ marginBottom: 0 }}>
              Creation Features are not Talents: they never appear in the Talent web and cannot be
              taken later. Talents still arrive at {TALENT_LEVELS.join(', ')}.
            </p>
          </Section>

          <Section
            title="Advancement"
            right={<span className="count">
              {used.increases}/{slots.increases} die increases · {used.reserve}/{slots.reserve} Reserve
            </span>}
          >
            {ATTRS.map((a) => {
              const atCap = dieIndex(dice[a]) >= dieIndex(NATURAL_DIE_CAP)
              return (
                <div className="dice-row" key={a}>
                  <span className="name">{ATTR_LABEL[a]}</span>
                  <button className="sm" disabled={!c.increases[a]}
                          onClick={() => set({ increases: { ...c.increases, [a]: c.increases[a] - 1 } })}>−</button>
                  <span className="die">{dice[a]}</span>
                  <button className="sm" disabled={atCap || used.increases >= slots.increases}
                          onClick={() => set({ increases: { ...c.increases, [a]: (c.increases[a] || 0) + 1 } })}>+</button>
                  <span className="count" style={{ marginLeft: 0 }}>level Reserve points</span>
                  <input type="number" min="0" style={{ width: 62 }} value={c.reserves[a] || 0}
                         onChange={(e) => set({ reserves: { ...c.reserves, [a]: Math.max(0, Number(e.target.value)) } })} />
                </div>
              )
            })}
            {c.talents.includes('legendary-attribute') && (
              <div className="dice-row" style={{ marginTop: 8 }}>
                <span className="name">d12 capstone</span>
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
            title="Talents, Traits & Spells"
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
                    : 'Buy a School at creation, or take the Talent at level 2'}
                </span>
              )}
              {tab === 'traits' && (
                <span className="count">
                  2 free at creation{c.creation.trait ? ` · ${c.creation.trait} bought` : ''} · +1 at {TRAIT_LEVELS.join(' & ')}
                  <button className="sm" style={{ marginLeft: 8 }}
                          disabled={cpLeft < 3 || c.creation.trait >= CREATION_LIMITS.trait}
                          onClick={() => bump('trait', +1, CREATION_LIMITS.trait)}>+ Trait (3 CP)</button>
                  {c.creation.trait > 0 && (
                    <button className="sm" style={{ marginLeft: 4 }}
                            onClick={() => bump('trait', -1, CREATION_LIMITS.trait)}>−</button>
                  )}
                </span>
              )}
            </div>

            {tab === 'talents' && (
              <div className="grid">
                {talents.filter((t) => matches(`${t.name} ${t.text}`)).map((t) => {
                  const taken = c.talents.includes(t.id)
                  const gate = talentGate(t, {
                    level: c.level, dice, chosenIds: c.talents.filter((x) => x !== t.id),
                  })
                  const full = !taken && c.talents.length >= slots.talents
                  return (
                    <TalentCard key={t.id} t={t} className={taken ? 'taken' : gate.ok ? '' : 'locked'}>
                      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button className={taken ? '' : 'primary'}
                                disabled={!taken && (!gate.ok || full)}
                                onClick={() => toggle('talents', t.id, slots.talents)}>
                          {taken ? 'Remove' : 'Take'}
                        </button>
                        {!taken && !gate.ok && (
                          <span className="warn-text">
                            needs {[...gate.reasons, ...gate.missing.map((m) => talentsById[m]?.name || m)].join(', ')}
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
                {traits.filter((t) => matches(`${t.name} ${t.text}`)).map((t) => {
                  const taken = c.traits.includes(t.id)
                  const ok = meetsAttrReq(t.attr_req, dice)
                  const full = !taken && c.traits.length >= slots.traits
                  return (
                    <TraitCard key={t.id} t={t} className={taken ? 'taken' : ok ? '' : 'locked'}>
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
                  <p className="empty">No Schools yet — buy one at creation (4 CP, Focus d6) or take the Talent at level 2.</p>
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
                <b>{dice[a]} · Def {defenseOf(dice[a])} · Res {dieMax(c.base[a]) + creationReserve + (c.reserves[a] || 0)}</b>
              </div>
            ))}
            <div className="stat"><span>Hit Points</span><b>{hp}{c.hpOverride !== '' ? '' : ' (avg)'}</b></div>
            <div className="stat"><span>Momentum cap</span><b>{momentumCap(c.talents)}</b></div>
            <div className="stat"><span>Action Points</span><b>{AP_PER_TURN}{c.talents.includes('blur-of-motion') ? ' +1*' : ''}</b></div>
            <div className="stat">
              <span>Readied slots</span>
              <b>{dieMax(dice.agility) + (c.feature === 'cf-quick-hands' ? 2 : 0)}</b>
            </div>
            <div className="stat"><span>Gold</span><b>{gold}g</b></div>
            <p className="meta" style={{ margin: '8px 0 0' }}>{apNote(c.talents)}</p>
          </section>

          <section className="panel">
            <h2>Creation spend</h2>
            {[['Attribute dice', spend.dice], ['Health Tier', spend.health],
              ['Reserves', spend.reserve], ['Specialties', spend.specialties],
              ['Extra Traits', spend.traits], ['Access', spend.access],
              ['Schools', spend.schools], ['Coin', spend.wealth],
              ['Feature', spend.feature]].filter(([, v]) => v > 0).map(([label, v]) => (
              <div className="stat" key={label}><span>{label}</span><b>{v} CP</b></div>
            ))}
            <div className="stat">
              <span><b>Remaining</b></span>
              <b className={cpLeft < 0 ? 'warn-text' : cpLeft === 0 ? 'ok-text' : ''}>
                {cpLeft} of {CREATION_POINTS}
              </b>
            </div>
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
              : <p className="empty">None chosen.</p>}
            {(c.specialties || []).filter(Boolean).length > 0 && (
              <>
                <div className="stat" style={{ marginTop: 8 }}><span>Specialties</span><b>{c.specialties.filter(Boolean).length}</b></div>
                <p className="text">{c.specialties.filter(Boolean).join(' · ')}</p>
              </>
            )}
            {c.feature && (
              <>
                <div className="stat" style={{ marginTop: 8 }}><span>Creation Feature</span><b /></div>
                <p className="text">{creation.find((f) => f.id === c.feature)?.name}</p>
              </>
            )}
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
            <h2>My Characters</h2>
            {!ready && <p className="empty">Checking your account…</p>}
            {ready && !user && (
              <p className="empty">
                Sign in from the sidebar to save characters to your account and reach them
                from any device. Everything here works signed out; your current build is
                kept in this browser.
              </p>
            )}
            {ready && user && (
              <>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  <button className="primary" disabled={syncing} onClick={saveToCloud}>
                    {savedId ? 'Save changes' : 'Save to account'}
                  </button>
                  {savedId && (
                    <button disabled={syncing} onClick={() => { setSavedId(null); setSyncNote('Next save creates a new character.') }}>
                      Save as new
                    </button>
                  )}
                </div>
                {library.length === 0
                  ? <p className="empty">No saved characters yet.</p>
                  : library.map((row) => (
                    <div className={`library-row ${row.id === savedId ? 'current' : ''}`} key={row.id}>
                      <span className="grow" title={row.name}>{row.name || 'Unnamed'}</span>
                      <span className="count" style={{ marginLeft: 0 }}>L{row.level}</span>
                      <button className="sm" disabled={syncing} onClick={() => openCharacter(row)}>Open</button>
                      <button className="sm ghost" disabled={syncing} onClick={() => removeCharacter(row)}>×</button>
                    </div>
                  ))}
                {syncNote && <p className="meta" style={{ marginBottom: 0 }}>{syncNote}</p>}
              </>
            )}
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
          </section>
        </aside>
      </div>
    </>
  )
}
