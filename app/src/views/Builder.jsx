import React, { useEffect, useMemo, useState } from 'react'
import {
  talents, traits, spells, skills, lifepath, talentsById, traitsById,
  skillsById, creation, creationBy, lifepathBy, SCHOOLS,
} from '../data.js'
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
  TALENT_LEVELS, INCREASE_LEVELS, TRAIT_LEVELS,
  talentSlots, increaseSlots, traitSlots, reserveBudget, momentumCap,
  talentGate, meetsAttrReq, expectedHp, apNote, tierUnlockLevel,
  NATURAL_DIE_CAP, AP_PER_TURN, CREATION_POINTS, CREATION_START_DIE,
  ATTRIBUTE_IMPROVEMENTS, STARTING_GOLD, CREATION_LIMITS,
  ARMOR_CASTING, dieSteps, startingHp, reservePool, creationSpend,
} from '../rules.js'

const BLANK = {
  name: '',
  level: 1,
  origin: '', trade: '', turn: '',
  base: { vigor: 'd4', agility: 'd4', focus: 'd4', resolve: 'd4' },
  increases: { vigor: 0, agility: 0, focus: 0, resolve: 0 },
  legendaryAttr: '',
  extraSkills: [],
  traits: [],
  feature: '',
  access: [],
  creationSchools: [],
  creation: { skill: 0, trait: 0, feature_slot: 0, wealth: 0 },
  armor: 'none',
  talents: [],
  spells: [],
  reserves: { vigor: 0, agility: 0, focus: 0, resolve: 0 },
  hpOverride: '',
}

function load() {
  const saved = loadDraft(null)
  if (!saved) return { ...BLANK }
  // Characters built under the old point-buy have a different shape; merging onto
  // BLANK keeps what still means the same and drops what no longer exists.
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
      <div className="row"><h2>{title}</h2>{right}</div>
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
    try { setLibrary(await listCharacters(uid)) }
    catch (err) { setSyncNote(`Could not load your characters: ${err.message}`) }
  }
  useEffect(() => {
    if (!user) { setLibrary([]); setSavedId(null); return }
    refreshLibrary(user.uid)
  }, [user])

  const saveToCloud = async () => {
    if (!user) return
    setSyncing(true); setSyncNote('')
    try {
      if (savedId) { await updateCharacter(user.uid, savedId, c); setSyncNote(`Saved "${c.name || 'Unnamed'}".`) }
      else { setSavedId(await createCharacter(user.uid, c)); setSyncNote(`Saved "${c.name || 'Unnamed'}" to your account.`) }
      await refreshLibrary(user.uid)
    } catch (err) { setSyncNote(`Save failed: ${err.message}`) }
    finally { setSyncing(false) }
  }
  const openCharacter = (row) => {
    set({ ...BLANK, ...row.sheet, creation: { ...BLANK.creation, ...(row.sheet?.creation || {}) } })
    setSavedId(row.id); setSyncNote(`Opened "${row.name}".`)
  }
  const removeCharacter = async (row) => {
    if (!user || !confirm(`Delete "${row.name}" from your account?`)) return
    setSyncing(true)
    try {
      await deleteCharacter(user.uid, row.id)
      if (savedId === row.id) setSavedId(null)
      await refreshLibrary(user.uid); setSyncNote(`Deleted "${row.name}".`)
    } catch (err) { setSyncNote(`Delete failed: ${err.message}`) }
    finally { setSyncing(false) }
  }

  // ---------------------------------------------------------------- lifepath
  const origins = lifepathBy('origin')
  const trades = lifepathBy('trade')
  const turns = lifepathBy('turn')
  const chosenPath = [c.origin, c.trade, c.turn]
    .map((id) => lifepath.find((l) => l.id === id)).filter(Boolean)

  // A Trade repeating a Skill your Origin gave you is not wasted: the overlap
  // becomes a free pick instead of a loss.
  const grantedList = chosenPath.flatMap((l) => l.skills || [])
  const grantedSkills = [...new Set(grantedList)]
  const freeSkillPicks = grantedList.length - grantedSkills.length

  const extraSkills = (c.extraSkills || []).filter((id) => !grantedSkills.includes(id))
  const boughtSkills = Math.max(0, extraSkills.length - freeSkillPicks)
  const allSkills = [...grantedSkills, ...extraSkills]

  const pathAccess = [...new Set(chosenPath.flatMap((l) => l.access || []))]
  const boughtAccess = (c.access || []).filter((id) => !pathAccess.includes(id))
  const allAccess = [...new Set([...pathAccess, ...boughtAccess])]

  const tradeFeature = chosenPath.find((l) => l.stage === 'trade')?.feature || ''
  const feature = c.feature || tradeFeature
  const featureRow = creation.find((f) => f.id === feature)
  const traitSuggestions = [...new Set(chosenPath.flatMap((l) => l.trait_suggestions || []))]

  // ---------------------------------------------------------------- derived
  const dice = useMemo(() => effectiveDice(c), [c])
  const chosenTraits = c.traits.map((id) => traitsById[id]).filter(Boolean)
  const chosenTalents = c.talents.map((id) => talentsById[id]).filter(Boolean)

  const spend = useMemo(
    () => creationSpend({ ...c, access: boughtAccess, creation: { ...c.creation, skill: boughtSkills } }, creation),
    [c, boughtSkills, boughtAccess.length]
  )
  const cpLeft = CREATION_POINTS - spend.total

  const improvementsUsed = ATTRS.reduce((n, a) => n + dieSteps(c.base[a]), 0)
  const improvementsLeft = ATTRIBUTE_IMPROVEMENTS - improvementsUsed

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

  const gold = STARTING_GOLD + (c.creation.wealth || 0) * 50 + (feature === 'cf-scavenger' ? 100 : 0)

  const schoolsFromTalents = chosenTalents
    .filter((t) => (t.tags || []).includes('school-access'))
    .map((t) => t.id.replace('school-of-', ''))
  const unlockedSchools = [...new Set([...schoolsFromTalents, ...(c.creationSchools || [])])]
  const armor = ARMOR_CASTING[c.armor] || ARMOR_CASTING.none
  const levelTier = [0, 1, 2, 3].filter((t) => tierUnlockLevel(t) <= c.level).pop() ?? 0
  const maxTier = Math.min(levelTier, armor.maxTier ?? 3)

  const violations = []
  if (spend.total > CREATION_POINTS) violations.push(`Creation overspent by ${spend.total - CREATION_POINTS} points`)
  if (improvementsUsed > ATTRIBUTE_IMPROVEMENTS) violations.push(`${improvementsUsed} Attribute improvements used, ${ATTRIBUTE_IMPROVEMENTS} allowed`)
  if (!c.origin || !c.trade || !c.turn) violations.push('Lifepath incomplete — choose an Origin, a Trade, and a Turn')
  chosenTalents.forEach((t) => {
    const g = talentGate(t, { level: c.level, dice, chosenIds: c.talents.filter((x) => x !== t.id) })
    if (!g.ok) violations.push(`${t.name}: needs ${[...g.reasons, ...g.missing.map((m) => talentsById[m]?.name || m)].join(', ')}`)
  })
  chosenTraits.forEach((t) => {
    if (!meetsAttrReq(t.attr_req, dice)) violations.push(`${t.name}: attribute gate no longer met`)
  })
  allAccess.forEach((id) => {
    const item = creation.find((x) => x.id === id)
    if (item?.requires && !meetsAttrReq(item.requires, dice)) {
      violations.push(`${item.name}: needs ${ATTR_LABEL[item.requires.attr]} ${item.requires.die}`)
    }
  })
  if ((c.creationSchools?.length || 0) > 0 && dieIndex(dice.focus) < dieIndex('d6')) {
    violations.push('Spell School access requires Focus d6')
  }
  if (feature === 'cf-cantrip-touched' && dieIndex(dice.focus) < dieIndex('d6')) {
    violations.push('Cantrip Touched requires Focus d6')
  }
  if (c.spells.some((id) => (spells.find((s) => s.id === id)?.tier ?? 0) > maxTier)) {
    violations.push(`Spells known exceed Tier ${maxTier}${armor.maxTier != null ? ` while wearing ${armor.label.toLowerCase()}` : ''}`)
  }
  if (c.talents.length > slots.talents) violations.push(`${c.talents.length} Talents chosen, ${slots.talents} earned`)
  if (c.traits.length > slots.traits) violations.push(`${c.traits.length} Traits chosen, ${slots.traits} available`)
  if (used.increases > slots.increases) violations.push(`${used.increases} die increases spent, ${slots.increases} earned`)
  if (used.reserve > slots.reserve) violations.push(`${used.reserve} level Reserve points allocated, ${slots.reserve} available`)

  const hp = c.hpOverride !== '' ? Number(c.hpOverride) : expectedHp({ dice, level: c.level })

  const toggle = (field, id, limit) => set((prev) => {
    const has = (prev[field] || []).includes(id)
    if (!has && limit != null && (prev[field] || []).length >= limit) return prev
    return { ...prev, [field]: has ? prev[field].filter((x) => x !== id) : [...(prev[field] || []), id] }
  })
  const bump = (key, delta, max) => set((prev) => ({
    ...prev,
    creation: { ...prev.creation, [key]: Math.max(0, Math.min(max ?? 99, (prev.creation[key] || 0) + delta)) },
  }))
  const buyDie = (attr, delta) => set((prev) => {
    const cur = prev.base[attr]
    const next = delta > 0
      ? (dieIndex(cur) >= dieIndex('d8') ? cur : DICE[dieIndex(cur) + 1])
      : (dieIndex(cur) <= 0 ? cur : DICE[dieIndex(cur) - 1])
    return { ...prev, base: { ...prev.base, [attr]: next } }
  })

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ ...c, derived: { dice, hp, gold, skills: allSkills, access: allAccess, feature } }, null, 2)],
                          { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${(c.name || 'character').replace(/\s+/g, '-').toLowerCase()}.json`
    a.click(); URL.revokeObjectURL(a.href)
  }

  const matches = (text) => !q || text.toLowerCase().includes(q.toLowerCase())
  const accessOptions = creationBy('access')
  const features = creationBy('feature')
  const accessName = (id) => creation.find((x) => x.id === id)?.name.replace('Access: ', '') ?? id

  const StagePicker = ({ stage, options, value, label }) => (
    <div style={{ marginBottom: 12 }}>
      <div className="meta" style={{ margin: '0 0 5px' }}>{label}</div>
      <div className="chips">
        {options.map((o) => (
          <button key={o.id} className={`chip ${value === o.id ? 'on' : ''}`}
                  onClick={() => set({ [stage]: value === o.id ? '' : o.id })}>
            {o.name}
          </button>
        ))}
      </div>
      {value && <p className="text" style={{ marginTop: 7 }}>{options.find((o) => o.id === value)?.text}</p>}
    </div>
  )

  return (
    <>
      <h1>Character Builder</h1>
      <p className="lede">
        Three choices of history hand you most of your character; {CREATION_POINTS} points
        cover the rest. Every gate in the Talent web is checked as you build.
      </p>

      <div className="builder">
        <div>
          <Section title="Identity">
            <div className="controls" style={{ margin: 0, border: 0, padding: 0, background: 'none' }}>
              <label className="field">Name
                <input type="text" value={c.name} placeholder="Unnamed"
                       onChange={(e) => set({ name: e.target.value })} />
              </label>
              <label className="field">Level
                <select value={c.level} onChange={(e) => set({ level: Number(e.target.value) })}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </label>
              <label className="field">Armor worn
                <select value={c.armor} onChange={(e) => set({ armor: e.target.value })}>
                  {Object.entries(ARMOR_CASTING).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </label>
              <label className="field">HP override
                <input type="number" value={c.hpOverride} placeholder={String(hp)}
                       onChange={(e) => set({ hpOverride: e.target.value })} />
              </label>
              <span className={cpLeft < 0 ? 'warn-text' : 'count'}>
                {cpLeft} of {CREATION_POINTS} points left
              </span>
            </div>
            {armor.downgrade && <p className="warn-text" style={{ margin: '8px 0 0' }}>{armor.note}</p>}
          </Section>

          <Section title="Your History" right={<span className="count">Origin · Trade · The Turn</span>}>
            <StagePicker stage="origin" options={origins} value={c.origin} label="Where you were raised" />
            <StagePicker stage="trade" options={trades} value={c.trade} label="What you did for a living" />
            <StagePicker stage="turn" options={turns} value={c.turn} label="What put you on the road" />
            {chosenPath.length > 0 && (
              <p className="meta" style={{ marginBottom: 0 }}>
                Granted: {grantedSkills.map((id) => skillsById[id]?.name).join(', ') || '—'}
                {pathAccess.length > 0 && ` · ${pathAccess.map(accessName).join(', ')}`}
                {tradeFeature && ` · ${creation.find((f) => f.id === tradeFeature)?.name}`}
                {freeSkillPicks > 0 && ` · ${freeSkillPicks} free Skill pick${freeSkillPicks > 1 ? 's' : ''} from overlap`}
              </p>
            )}
          </Section>

          <Section title="Attributes"
                   right={<span className={improvementsLeft < 0 ? 'warn-text' : 'count'}>
                     {improvementsLeft} of {ATTRIBUTE_IMPROVEMENTS} improvements left
                   </span>}>
            {ATTRS.map((a) => (
              <div className="dice-row" key={a}>
                <span className="name">{ATTR_LABEL[a]}</span>
                <button className="sm" disabled={c.base[a] === CREATION_START_DIE} onClick={() => buyDie(a, -1)}>−</button>
                <span className="die">{c.base[a]}</span>
                <button className="sm" disabled={improvementsLeft <= 0 || dieIndex(c.base[a]) >= dieIndex('d8')}
                        onClick={() => buyDie(a, +1)}>+</button>
                <span className="count" style={{ marginLeft: 0 }}>
                  {dice[a] !== c.base[a] ? `${dice[a]} with increases · ` : ''}
                  Def {defenseOf(dice[a])} · Reserve {reservePool(dice[a], c.reserves[a] || 0)}
                </span>
              </div>
            ))}
            <p className="meta" style={{ margin: '6px 0 0' }}>
              Everything starts at d4. Two improvements: two Attributes to d6, or one to d8.
              Defense, Reserves, and Hit Points all follow from these dice — Vigor {dice.vigor} gives {startingHp(dice.vigor)} starting HP.
            </p>
          </Section>

          <Section title="Skills"
                   right={<span className="count">{allSkills.length} trained{spend.skills > 0 ? ` · ${spend.skills} CP` : ''}</span>}>
            <div className="chips">
              {skills.map((s) => {
                const granted = grantedSkills.includes(s.id)
                const taken = allSkills.includes(s.id)
                const withinFree = extraSkills.length < freeSkillPicks
                const canAdd = withinFree || (cpLeft >= 2 && boughtSkills < CREATION_LIMITS.skill)
                return (
                  <button key={s.id} className={`chip ${taken ? 'on' : ''}`} title={s.text}
                          disabled={granted || (!taken && !canAdd)}
                          onClick={() => toggle('extraSkills', s.id)}>
                    {s.name} <span style={{ opacity: .65 }}>{ATTR_LABEL[s.attr].slice(0, 3)}</span>{granted ? ' ✓' : ''}
                  </button>
                )
              })}
            </div>
            <p className="meta" style={{ marginBottom: 0 }}>
              Ticked Skills came from your history and cost nothing.
              {freeSkillPicks > 0 && ` ${Math.max(0, freeSkillPicks - extraSkills.length)} free pick(s) left from overlapping grants.`}
              {' '}Further Skills cost 2 points each, up to {CREATION_LIMITS.skill}. Skills apply to Tasks only — never Impact Rolls or Saves.
            </p>
          </Section>

          <Section title="Creation Feature"
                   right={<span className="count">{tradeFeature ? 'granted by Trade · swapping is free' : 'choose a Trade first'}</span>}>
            <div className="grid">
              {features.map((f) => {
                const on = feature === f.id
                const fromTrade = tradeFeature === f.id && !c.feature
                const gated = f.requires && !meetsAttrReq(f.requires, dice)
                return (
                  <article className={`card ${on ? 'taken' : gated ? 'locked' : ''}`} key={f.id}>
                    <div className="row">
                      <h3>{f.name}</h3>
                      <span className="tag">{fromTrade ? 'from Trade' : on ? 'chosen' : 'swap'}</span>
                    </div>
                    <p className="text">{f.text}</p>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button className={on ? '' : 'primary'} disabled={!on && gated}
                              onClick={() => set({ feature: on ? '' : f.id })}>
                        {on ? (fromTrade ? 'Granted' : 'Clear') : 'Take instead'}
                      </button>
                      {!on && gated && <span className="warn-text">needs {ATTR_LABEL[f.requires.attr]} {f.requires.die}</span>}
                    </div>
                  </article>
                )
              })}
            </div>
            <p className="meta" style={{ marginBottom: 0 }}>
              Creation Features are not Talents — they never appear in the Talent web and cannot
              be taken later. Talents still arrive at levels {TALENT_LEVELS.join(', ')}.
            </p>
          </Section>

          <Section title="Access & Schools" right={<span className="count">{spend.access + spend.schools} CP</span>}>
            <div className="chips" style={{ marginBottom: 10 }}>
              {accessOptions.map((opt) => {
                const fromPath = pathAccess.includes(opt.id)
                const on = allAccess.includes(opt.id)
                const gated = opt.requires && !meetsAttrReq(opt.requires, dice)
                return (
                  <button key={opt.id} className={`chip ${on ? 'on' : ''}`} title={opt.text}
                          disabled={fromPath || (!on && (gated || cpLeft < opt.cost))}
                          onClick={() => toggle('access', opt.id)}>
                    {accessName(opt.id)} · {fromPath ? 'history' : opt.cost}
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
                  <button key={s} className={`chip ${on ? 'on' : ''}`} disabled={viaTalent || blocked}
                          onClick={() => toggle('creationSchools', s, CREATION_LIMITS.school)}>
                    {s} · 4{viaTalent ? ' (Talent)' : ''}
                  </button>
                )
              })}
            </div>
            <p className="meta" style={{ marginBottom: 0 }}>
              Access marked "history" came free from your Origin or Trade. A School needs Focus d6.
            </p>
          </Section>

          <Section
            title="Talents, Traits & Spells"
            right={
              <div className="chips">
                {[['talents', `Talents ${c.talents.length}/${slots.talents}`],
                  ['traits', `Traits ${c.traits.length}/${slots.traits}`],
                  ['spells', `Spells ${c.spells.length}`]].map(([v, label]) => (
                  <button key={v} className={`chip ${tab === v ? 'on' : ''}`} onClick={() => setTab(v)}>{label}</button>
                ))}
              </div>
            }
          >
            <div className="controls" style={{ margin: '0 0 10px' }}>
              <input type="text" placeholder={`Search ${tab}…`} value={q} onChange={(e) => setQ(e.target.value)} />
              {tab === 'spells' && (
                <span className="count">
                  {unlockedSchools.length
                    ? `${unlockedSchools.join(', ')} · up to Tier ${maxTier}${armor.maxTier != null ? ` (${armor.label})` : ''}`
                    : 'Buy a School (4 CP, Focus d6) or take the Talent at level 2'}
                </span>
              )}
              {tab === 'traits' && (
                <span className="count">
                  2 free{traitSuggestions.length > 0 && ` · your Turn suits ${traitSuggestions.map((t) => traitsById[t]?.name).join(' & ')}`}
                  <button className="sm" style={{ marginLeft: 8 }}
                          disabled={cpLeft < 3 || c.creation.trait >= CREATION_LIMITS.trait}
                          onClick={() => bump('trait', +1, CREATION_LIMITS.trait)}>+ Trait (3 CP)</button>
                  {c.creation.trait > 0 && (
                    <button className="sm" style={{ marginLeft: 4 }} onClick={() => bump('trait', -1, CREATION_LIMITS.trait)}>−</button>
                  )}
                </span>
              )}
            </div>

            {tab === 'talents' && (
              <div className="grid">
                {talents.filter((t) => matches(`${t.name} ${t.text}`)).map((t) => {
                  const taken = c.talents.includes(t.id)
                  const gate = talentGate(t, { level: c.level, dice, chosenIds: c.talents.filter((x) => x !== t.id) })
                  const full = !taken && c.talents.length >= slots.talents
                  return (
                    <TalentCard key={t.id} t={t} className={taken ? 'taken' : gate.ok ? '' : 'locked'}>
                      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button className={taken ? '' : 'primary'} disabled={!taken && (!gate.ok || full)}
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
                  const suits = traitSuggestions.includes(t.id)
                  return (
                    <TraitCard key={t.id} t={t} className={taken ? 'taken' : ok ? '' : 'locked'}>
                      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button className={taken ? '' : 'primary'} disabled={!taken && (!ok || full)}
                                onClick={() => toggle('traits', t.id, slots.traits)}>
                          {taken ? 'Remove' : 'Choose'}
                        </button>
                        {suits && !taken && <span className="tag ok">suits your Turn</span>}
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
                {spells.filter((s) => unlockedSchools.includes(s.school))
                  .filter((s) => s.tier <= maxTier)
                  .filter((s) => matches(`${s.name} ${s.text}`))
                  .map((s) => {
                    const taken = c.spells.includes(s.id)
                    return (
                      <SpellCard key={s.id} s={s} className={taken ? 'taken' : ''}>
                        <div style={{ marginTop: 8 }}>
                          <button className={taken ? '' : 'primary'} onClick={() => toggle('spells', s.id)}>
                            {taken ? 'Remove' : 'Learn'}
                          </button>
                        </div>
                      </SpellCard>
                    )
                  })}
                {!unlockedSchools.length && <p className="empty">No Schools yet.</p>}
              </div>
            )}
          </Section>

          <Section title="Advancement"
                   right={<span className="count">{used.increases}/{slots.increases} die increases · {used.reserve}/{slots.reserve} Reserve</span>}>
            {ATTRS.map((a) => (
              <div className="dice-row" key={a}>
                <span className="name">{ATTR_LABEL[a]}</span>
                <button className="sm" disabled={!c.increases[a]}
                        onClick={() => set({ increases: { ...c.increases, [a]: c.increases[a] - 1 } })}>−</button>
                <span className="die">{dice[a]}</span>
                <button className="sm" disabled={dieIndex(dice[a]) >= dieIndex(NATURAL_DIE_CAP) || used.increases >= slots.increases}
                        onClick={() => set({ increases: { ...c.increases, [a]: (c.increases[a] || 0) + 1 } })}>+</button>
                <span className="count" style={{ marginLeft: 0 }}>level Reserve points</span>
                <input type="number" min="0" style={{ width: 62 }} value={c.reserves[a] || 0}
                       onChange={(e) => set({ reserves: { ...c.reserves, [a]: Math.max(0, Number(e.target.value)) } })} />
              </div>
            ))}
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
        </div>

        <aside className="sticky">
          <section className="panel">
            <h2>{c.name || 'Unnamed'} · Level {c.level}</h2>
            {chosenPath.length === 3 && (
              <p className="meta" style={{ marginTop: -4 }}>{chosenPath.map((l) => l.name).join(' · ')}</p>
            )}
            {ATTRS.map((a) => (
              <div className="stat" key={a}>
                <span>{ATTR_LABEL[a]}</span>
                <b>{dice[a]} · Def {defenseOf(dice[a])} · Res {reservePool(dice[a], c.reserves[a] || 0)}</b>
              </div>
            ))}
            <div className="stat"><span>Hit Points</span><b>{hp}{c.hpOverride !== '' ? '' : ' (avg)'}</b></div>
            <div className="stat"><span>Momentum cap</span><b>{momentumCap(c.talents)}</b></div>
            <div className="stat"><span>Action Points</span><b>{AP_PER_TURN}{c.talents.includes('blur-of-motion') ? ' +1*' : ''}</b></div>
            <div className="stat"><span>Readied slots</span><b>{dieMax(dice.agility) + (feature === 'cf-quick-hands' ? 2 : 0)}</b></div>
            <div className="stat"><span>Gold</span><b>{gold}g</b></div>
            <p className="meta" style={{ margin: '8px 0 0' }}>{apNote(c.talents)}</p>
          </section>

          <section className="panel">
            <h2>Points</h2>
            {[['Skills', spend.skills], ['Extra Traits', spend.traits], ['Extra Feature', spend.feature],
              ['Access', spend.access], ['Schools', spend.schools], ['Coin', spend.wealth]]
              .filter(([, v]) => v > 0).map(([label, v]) => (
                <div className="stat" key={label}><span>{label}</span><b>{v} CP</b></div>
              ))}
            <div className="stat">
              <span><b>Remaining</b></span>
              <b className={cpLeft < 0 ? 'warn-text' : cpLeft === 0 ? 'ok-text' : ''}>{cpLeft} of {CREATION_POINTS}</b>
            </div>
            <div className="stat"><span>Attribute improvements</span><b>{improvementsUsed}/{ATTRIBUTE_IMPROVEMENTS}</b></div>
          </section>

          <section className="panel">
            <h2>Build sheet</h2>
            <div className="stat"><span>Skills</span><b>{allSkills.length}</b></div>
            {allSkills.length
              ? <p className="text">{allSkills.map((id) => skillsById[id]?.name).join(' · ')}</p>
              : <p className="empty">Choose your history.</p>}
            {featureRow && (<><div className="stat" style={{ marginTop: 8 }}><span>Feature</span><b /></div>
              <p className="text">{featureRow.name}</p></>)}
            <div className="stat" style={{ marginTop: 8 }}><span>Traits</span><b>{c.traits.length}/{slots.traits}</b></div>
            {chosenTraits.length ? <p className="text">{chosenTraits.map((t) => t.name).join(' · ')}</p> : <p className="empty">None chosen.</p>}
            <div className="stat" style={{ marginTop: 8 }}><span>Talents</span><b>{c.talents.length}/{slots.talents}</b></div>
            {chosenTalents.length ? <p className="text">{chosenTalents.map((t) => t.name).join(' · ')}</p> : <p className="empty">First at level 2.</p>}
            {c.spells.length > 0 && (<><div className="stat" style={{ marginTop: 8 }}><span>Spells</span><b>{c.spells.length}</b></div>
              <p className="text">{c.spells.map((id) => spells.find((s) => s.id === id)?.name).join(' · ')}</p></>)}
          </section>

          <section className="panel">
            <h2>My Characters</h2>
            {!ready && <p className="empty">Checking your account…</p>}
            {ready && !user && (
              <p className="empty">
                Sign in from the sidebar to save characters to your account. Everything works
                signed out; your current build is kept in this browser.
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
              <button className="ghost" onClick={() => { if (confirm('Clear this character?')) set({ ...BLANK }) }}>Reset</button>
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}
