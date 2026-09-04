// The mechanical spine, mirroring data/rules/. Kept in one place so the builder
// and the browsers can never disagree about what a rule means.

export const DICE = ['d4', 'd6', 'd8', 'd10', 'd12']
export const ATTRS = ['vigor', 'agility', 'focus', 'resolve']
export const ATTR_LABEL = {
  vigor: 'Vigor', agility: 'Agility', focus: 'Focus', resolve: 'Resolve',
}

export const dieIndex = (die) => DICE.indexOf(die)
export const dieMax = (die) => Number(die.slice(1))
export const defenseOf = (die) => dieMax(die) / 2
export const stepUp = (die) => DICE[Math.min(DICE.length - 1, dieIndex(die) + 1)]
export const stepDown = (die) => DICE[Math.max(0, dieIndex(die) - 1)]

// Levels 2/4/6/8/10 grant a Talent; 3/5/7/9 grant an Ability Die Increase.
export const TALENT_LEVELS = [2, 4, 6, 8, 10]
export const INCREASE_LEVELS = [3, 5, 7, 9]
export const TRAIT_LEVELS = [5, 10] // beyond the 2 chosen at creation (tunable)
export const BASE_TRAITS = 2
export const NATURAL_DIE_CAP = 'd10'
export const BASE_MOMENTUM_CAP = 3

// --- Character creation ----------------------------------------------------
// Attributes start at d4 and get exactly two improvements: two to d6, or one to
// d8. Health, Defenses, and Reserves all follow from the dice, so nothing
// essential is bought. The point pool is only for personalisation.
export const CREATION_POINTS = 6
export const CREATION_START_DIE = 'd4'
export const ATTRIBUTE_IMPROVEMENTS = 2
export const STARTING_GOLD = 100
export const FREE_TRAITS_AT_CREATION = 2
export const CREATION_LIMITS = { skill: 3, trait: 2, feature_slot: 1, school: 1, wealth: 2 }

/** Steps spent lifting one Attribute off the d4 baseline. */
export const dieSteps = (die) => dieIndex(die) - dieIndex(CREATION_START_DIE)

/** Starting HP comes from Vigor alone (tunable). */
export const startingHp = (vigorDie) => 4 + 2 * dieMax(vigorDie)

/** A Reserve pool equals its Attribute Die maximum, plus per-level allocations. */
export const reservePool = (die, allocated = 0) => dieMax(die) + allocated

/** What the point pool has been spent on, itemised for the UI. */
export function creationSpend(c, catalogue) {
  const cost = (id) => catalogue.find((x) => x.id === id)?.cost ?? 0
  const counted = (key, id) => (c.creation?.[key] || 0) * cost(id)
  const items = {
    skills: counted('skill', 'cp-skill'),
    traits: counted('trait', 'cp-trait-extra'),
    feature: (c.creation?.feature_slot || 0) * cost('cp-feature-extra'),
    access: (c.access || []).reduce((n, id) => n + cost(id), 0),
    schools: (c.creationSchools?.length || 0) * cost('cp-school'),
    wealth: counted('wealth', 'cp-wealth'),
  }
  items.total = Object.values(items).reduce((a, b) => a + b, 0)
  return items
}

/** Armor stops being neutral once you cast (see data/rules/12_equipment.md). */
export const ARMOR_CASTING = {
  none: { label: 'No armor', note: 'No effect on casting.' },
  vestments: { label: 'Arcane Vestments', note: 'No effect on casting.' },
  light: { label: 'Light armor', note: 'No effect on casting.' },
  medium: { label: 'Medium armor', downgrade: true, note: 'Spell Impact Rolls and Concentration Saves Downgraded.' },
  heavy: { label: 'Heavy armor', downgrade: true, maxTier: 1, note: 'Spells Downgraded, and Tier 2+ cannot be cast at all.' },
}

export const talentSlots = (level) => TALENT_LEVELS.filter((l) => l <= level).length
export const increaseSlots = (level) => INCREASE_LEVELS.filter((l) => l <= level).length
export const reserveBudget = (level) => 4 * (level - 1) // +4 per level, player-allocated (tunable)

export function traitSlots(level, chosenTraits) {
  // Taking a weakness Trait grants one extra Trait choice (tunable).
  const bonus = chosenTraits.filter((t) => (t.tags || []).includes('weakness')).length
  return BASE_TRAITS + TRAIT_LEVELS.filter((l) => l <= level).length + bonus
}

export function momentumCap(chosenTalentIds) {
  let cap = BASE_MOMENTUM_CAP
  if (chosenTalentIds.includes('expanded-momentum')) cap += 1
  if (chosenTalentIds.includes('vast-momentum')) cap += 1
  return cap
}

/** Attribute-die gate. Traits may gate from above (op: "max"). */
export function meetsAttrReq(req, dice) {
  if (!req) return true
  if (req.attr === 'any') {
    return ATTRS.some((a) => dieIndex(dice[a]) >= dieIndex(req.die))
  }
  const have = dieIndex(dice[req.attr])
  const need = dieIndex(req.die)
  return req.op === 'max' ? have <= need : have >= need
}

/** Why a Talent is or is not available right now. */
export function talentGate(talent, { level, dice, chosenIds }) {
  const reasons = []
  if (talent.level_req > level) reasons.push(`Level ${talent.level_req}`)
  if (!meetsAttrReq(talent.attr_req, dice)) {
    const a = talent.attr_req
    reasons.push(a.attr === 'any' ? `any Attribute at ${a.die}` : `${ATTR_LABEL[a.attr]} ${a.die}+`)
  }
  const missing = (talent.prereq_ids || []).filter((id) => !chosenIds.includes(id))
  return { ok: reasons.length === 0 && missing.length === 0, reasons, missing }
}

export function defenses(dice, talentIds = []) {
  const d = Object.fromEntries(ATTRS.map((a) => [a, defenseOf(dice[a])]))
  // Unarmored Bulwark: no armor, no shield → Vigor & Resolve Defense gain half the Resolve max.
  if (talentIds.includes('unarmored-bulwark')) {
    const bonus = dieMax(dice.resolve) / 2
    d.unarmoredBulwark = bonus
  }
  return d
}

/**
 * Expected maximum HP. Per level after 1st you roll your Vigor Die and add your
 * level, with the roll floored at half the die; Vitality Surge at 5 and 10 adds
 * the Vigor maximum. Rolls vary, so this is the average — the sheet has a manual
 * override for what you actually rolled.
 */
export function expectedHp({ dice, level }) {
  const vmax = dieMax(dice.vigor)
  let hp = startingHp(dice.vigor)
  for (let l = 2; l <= level; l++) {
    const half = vmax / 2
    const avgRoll = (vmax + 1) / 2
    hp += Math.max(half, avgRoll) + l
    if (l === 5 || l === 10) hp += vmax
  }
  return Math.round(hp)
}

export const AP_PER_TURN = 3
export function apNote(talentIds) {
  return talentIds.includes('blur-of-motion')
    ? '3 AP + 1 AP restricted to non-Attack actions (Blur of Motion)'
    : '3 AP — every action costs 1, no exceptions'
}

export const SPELL_TIER_TABLE = [
  { tier: 0, reserve: '0', dice: '1 Focus Die', difficulty: 5 },
  { tier: 1, reserve: '1–2 Focus', dice: '1 Focus Die', difficulty: 5 },
  { tier: 2, reserve: '3–4 Focus', dice: '2 Focus Dice', difficulty: 7 },
  { tier: 3, reserve: '5–6 Focus', dice: '3 Focus Dice', difficulty: 9 },
]

// Tier unlocks for an accessed School (tunable — see docs/DECISIONS.md #16).
export const tierUnlockLevel = (tier) => (tier <= 1 ? 1 : tier === 2 ? 5 : 9)

export function costLabel(t) {
  const bits = []
  if (t.ap_cost) bits.push(`${t.ap_cost} AP`)
  if (t.momentum_cost) bits.push(`${t.momentum_cost} Momentum`)
  if (t.reserve_cost) bits.push(t.reserve_cost)
  if (!bits.length) {
    const tags = t.tags || []
    if (tags.includes('reaction')) return 'Reaction'
    if (tags.includes('passive')) return 'Passive'
    return 'Free'
  }
  const tags = t.tags || []
  if (tags.includes('reaction')) bits.unshift('Reaction')
  return bits.join(' · ')
}
