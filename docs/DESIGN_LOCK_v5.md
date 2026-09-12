# [GAME NAME] — Design Lock v5
**Supersedes:** DESIGN_LOCK_v4.md in full. v4 is kept for history only — do not build from it.
**Purpose:** Same as v4 — every decision below is FROZEN. Tuning numbers is fine; reopening
structure requires a stated, deliberate reason, logged in OPEN_ITEMS.md.

---

## 1. What Changed Since v4 (read this first)
- Level cap raised **10 → 20**.
- The d10 natural cap / Talent-gated d12 rule is **REMOVED**. Attributes climb d4→d12 purely
  through Ability Die Increases, respaced (below).
- Talent tiers no longer scale by die size except at the two ends (Minor entry, Keystone mastery).
- Multiattack, "extra Quick Action" features, and old class-locked resource pools were already
  superseded pre-v4-lock; nothing new there, restated for completeness.
- Momentum, Combat Role, weapon proficiency, Vicious, Traits, and HP-by-Role are **new systems**,
  none of which existed in v4.

---

## 2. Level Progression (Levels 1–20)

**Schedule:** Every level from 2–20 grants a **Talent pick**, except six levels which grant an
**Ability Die Increase** instead: **4, 7, 10, 13, 16, 19.**
- Total Talent picks over a career: **13**
- Total Ability Die Increases: **6**
- **Level 10** grants a Die Increase *and* the one mid-career bonus Trait pick (see §6).
- **Level 1** is character creation: starting Attribute dice, Combat Role, starting Traits.

**Ability Die Increases:** permanently Upgrade one Attribute Die one step. No cap besides d12
(the top of the step-die scale itself). A player may spend all 6 in one Attribute (reaching d12
uses exactly 4 of them) or spread across multiple.

**Banked-pick rule:** if a Talent-pick level arrives and the character has no legal option (every
owned-region node they qualify for is already taken, and no new die size has opened a new region),
the pick is **banked** and spent at the next level where a legal option exists. Banked picks may
stack; multiple banked picks may be spent the same level.

---

## 3. Attributes & Defense
- Four Attributes: Vigor, Agility, Focus, Resolve. Step-Die d4→d12. *(Unchanged from v3.2)*
- Defense Ratings = half max face of the governing die. *(Unchanged)*
- No natural cap besides d12 itself (see §2). No Talent or item is required to reach d12.

---

## 4. Talents — Structure and Gating

### 4.1 The tier ladder (per region)
Every region is a **hub with siblings**, not a single chain:

| Tier | Gate | Shape |
|---|---|---|
| **Minor** | Attribute Die **d6** | Single entry node. Cheap, low/no resource cost. |
| **Major** | Attribute Die **d6** (same as Minor — no further die needed) | Multiple parallel siblings (aim for 5–6 per region for real choice, never fewer than 3). Each is a distinct verb: burst, mitigation, mobility, control, sustain, etc. |
| **Signature** | Attribute Die **d6** + **owns any 2 of the region's Majors** | One node. Requires breadth within the region, not a bigger die. |
| **Keystone** | Attribute Die **d12** + owns the region's Signature | One node. The one true mastery gate — the sole place a die *size* requirement beyond entry applies. |

**A full region costs 6 picks minimum** (Minor + 3 Majors + Signature + Keystone) if a player takes
the smallest legal path. Regions should offer more than 3 Majors so "any 2" is a real choice.

### 4.2 Authoring rule — recombination over invention
Minor and Major talents may only use **existing primitives** (Momentum, Upgrade/Downgrade,
Explosion, Sunder, Glancing Blow, and the four Attribute rolls themselves). Signature and Keystone
talents should **recombine two existing primitives in a way nobody's used yet**, not invent a new
one. If a Keystone needs a genuinely new mechanic to feel earned, that's a signal to reconsider the
chain, not a license to add a bespoke resource.

### 4.3 Cross-region access
The web is fully open. Any Talent whose gate is met is takeable regardless of what else the
character owns. There is no archetype anchor, no multiclass rule, no toll for reaching into a
foreign region beyond the die requirement and pick cost already listed above. (An earlier
"connector/bridge toll" concept was tested and rejected — it only works at trees with hundreds of
nodes, not a 13-pick budget. Do not reintroduce it.)

---

## 5. Unified Resource: Momentum
- **One pool per character.** No per-class resources (Fury, Guile, Velocity, Animus, Conviction,
  Lethality, Acclaim, Aether, Clarity, Accord, Entropy) — all collapsed into Momentum. Flavor lives
  in each Talent's generation/spend text, not in separate pool names.
- **Cap = 3 (base) + 1 per Ability Die Increase taken.** Scales automatically at Levels 4/7/10/
  13/16/19 to a max of 9 at Level 19, regardless of which Attribute the Increase went into.
- **Resets at the start of combat.** (Not Long Rest — decided and locked this session.)
- **Universal generators** (all characters, no Talent needed): Glancing Blow (attacker +1), Save
  resisted (caster +1), Task failed by 1–2 (+1), Task failed by 3+ (+2).
- **Talent generators/spenders:** each Talent defines its own trigger and its own spend effect,
  all drawing from the same pool.
- **Two spend tiers:** flat spend (1 token = +1 to a roll, shareable with an ally in engagement,
  unchanged from v3.2) vs. Talent-defined spends (self-only, never shareable).

---

## 6. Traits
- **Chosen, never assigned.** Matches every other creation choice in this system.
- **Physical/"Good-or-Bad" Traits are single axes with two poles**, not paired bundles: e.g. the
  Wit axis offers **Quick-Witted** (Strength pole, gated by an Attribute Die threshold) *or*
  **Dim-Witted** (Weakness pole, no gate). **Taking a Weakness pole grants one bonus Trait pick**
  spendable anywhere.
- **Social Traits** are narrative/Task-facing only — no combat numbers (e.g. Aloof, Blunt,
  Well-Connected). Talents own combat; Traits own identity.
- **Cadence:** 3 Physical axes + 1 Social Trait at character creation (Level 1). One additional
  Trait pick at **Level 10** (does not scale with Weakness bonuses from creation-time picks —
  those bonus picks are spent at creation, not banked to Level 10).

---

## 7. Action Economy
- **3 Action Points (AP) per turn. Every action costs 1 AP flat**, no exceptions. Categories:
  Attacks, Defends, Maneuvers (includes movement), Interactions, Spellcasting.
- **Reactions are separate**, outside the 3-AP pool: one per round, regained at the start of your
  turn.
- **Free-Action riders** (effects triggered by a hit) stay outside AP, costed in Momentum only.
- v3.2's Standard/Quick/Free/Reaction structure is retired; all v3.2 feature text must be rewritten
  to this system, not mechanically converted.
- **"Extra Quick/Free Action" features** (e.g. old Burning Clock, Blur of Motion) — STILL OPEN. See
  OPEN_ITEMS.md. Do not port these as-is; flat, fungible AP makes "+1 AP, any use" stronger than
  the old text intended.

## 8. Attacks & Multiattack
- **Basic Attack:** 1 AP, no resource cost, rolls 1 Attribute Die.
- **Featured Attacks** (Talents, spells): 1 AP + Momentum and/or Reserve cost, buying additional
  dice and/or an effect. Talents should grant **more dice**, not bigger dice — Ability Die
  Increases already own "bigger."
- **Multiattack is removed as a baseline feature.** Replacement: a **Reserve-discount Talent**
  (reduces the Reserve cost of a second attack-adjacent ability used the same turn). A separate
  **Combined-Strike-pooling Talent** is a distinct, later option, not the default fix. — Concept
  locked; **exact numbers not yet statted.** See OPEN_ITEMS.md.

---

## 9. Combat Role (creation choice, not a Talent — costs no pick)
Bundles HP, armor ceiling, shields, and Base Speed into one choice so the tradeoff is legible and
can't be gamed by picking the best of two Roles' benefits separately.

| Role | HP formula | Armor ceiling | Shields | Base Speed |
|---|---|---|---|---|
| Fragile Caster | 5 + starting Vigor Die (L1), then **+1d6/level** | None / Light | No | +5ft |
| Skirmisher | 7 + starting Vigor Die (L1), then **+1d8/level** | Light / Medium | No | +0ft |
| Frontline | 9 + starting Vigor Die (L1), then **+1d10/level** | Light / Medium | Yes | +0ft |
| Tank | 11 + starting Vigor Die (L1), then **+1d12/level** | Light / Medium / Heavy | Yes | −5ft |

**Critical rule — HP is decoupled from the live Vigor Die after Level 1.** The per-level HP die is
fixed by Combat Role at creation and never changes, regardless of later Attribute investment. This
closes the "dump Vigor, still get big HP because Vigor die is high anyway" hole found via worked
Level-20 characters — under the old rule, HP scaled off whatever Vigor happened to be, which
punished casters unpredictably and rewarded accidental hybrid stacking. A Vigor-gated Toughness
Talent line (flat +HP/level) is the intended way for a player who wants extra durability *and*
raw Vigor investment to double-dip deliberately, instead of getting it automatically.

---

## 10. Weapons & Armor
- **Simple + Martial Weapons: universal**, available to every character regardless of Combat Role.
- **Finesse Weapons:** Minor-tier Talent, Agility d6.
- **Specialized Armaments** (Arcane/Sacred/Totemic focuses, etc.): bundled automatically with
  whichever spellcasting-School Talent grants that School's access. Not a separate pick.
- **Vicious property (redesigned):** whenever any Impact Die from a Vicious weapon — including
  bonus dice — rolls a natural 1, reroll it once and use the new result. (Replaces the old
  "Upgrade the exploded bonus die" version, which dropped to zero benefit at d12 now that d12 is
  reachable by any character, not just one narrow old class.)

---

## 11. Spells
- 8 Schools retained. Spell Tier maps directly onto the Talent tier ladder:
  **Tier 0 = Minor, Tier 1 = Major, Tier 2 = Signature, Tier 3 = Keystone.** No Tier 4 exists —
  casting power intentionally plateaus once a Keystone is reached, same as martial capstones.
- 7 of 8 spell lists exist (148 spells, zero duplicate names). **Conjuration is missing** and must
  be authored.
- All "requires a Standard Action" spell text becomes "1 AP." Free-Action and Reaction-tagged
  spells keep those tags (see §7).

---

## 12. Content Sourcing (11 old classes → regions)
- Raw level-tagged features across all 11 classes: **230**, of which ~66 are obsolete progression
  lines (old "Ability Die Increase" and "Vitality Surge" entries, both superseded above) — leaving
  **~164 genuinely Talent-shaped raw pieces.**
- **Known imbalance:** the 6 primarily-martial classes (Assassin, Berserker, Charger, Stalker,
  Vanguard, Zealot) total ~96 hand-written features between them — that's the *entire* ceiling of
  their content unless new material is authored. The 5 caster classes (Arcanist, Harrower, Invoker,
  Muse, Shaman) have fewer hand-written features (~68) but draw additionally on the full 148-spell
  pool, which the martial side has no equivalent of.
- **Region map must be decided before bulk conversion**, specifically to correct this imbalance —
  e.g. merging two thin martial classes into one richer region — rather than converting 1:1 by old
  class and discovering the gap afterward. See `docs/REGION_MAP.md` (to be filled in as the first
  task of this phase) and workflow in §13.

---

## 13. Content Workflow (this phase's actual task)
1. **Region map** (`docs/REGION_MAP.md`) — decide final region list: which old classes feed which
   region, merges/splits, and a target Major-count per region (5–6 for real choice).
2. **Harvest + convert, one region at a time** — pull raw features from `source/v3.2/`, rewrite to
   the schema in §14, into `data/talents/<region>.json`. Spot-check each region against this Lock
   before moving to the next. **Do not bulk-convert all 11 classes in one pass** — a systemic
   mistake caught at region 1 is cheap; caught at region 11 it's a full re-pass.
3. **Gap pass per region** — compare actual Major count against the 5–6 target; author new Talents
   for shortfalls using the §4.2 recombination rule, not reflavored duplicates.
4. **Balance check per region** — run 2–3 worked characters through the finished region (the method
   used throughout this design phase: build a full Level 20 sheet, check HP/Defense math, check for
   dead levels, check resource math against Momentum cap). Log findings in OPEN_ITEMS.md, don't
   silently patch structural issues without flagging them here first.
5. Only after all regions pass step 4: full dedupe check (`scripts/check_dupes.py`), then this
   document gets superseded by v6 reflecting final content, if anything structural changed along
   the way.

**Parallelization note:** regions are independent of each other once §14's schema and this Lock
are fixed. Region-by-region conversion is a good candidate for Claude Code subagents — one per
region or small batch — provided each subagent is given this file, the schema, and only its
assigned region's source material, and returns a single JSON file rather than editing shared state.

---

## 14. Data Schema (Phase 2/3 must conform — unchanged from bootstrap, restated)
Talent:
```json
{
  "id": "kebab-case-unique",
  "name": "Display Name",
  "region": "region-id",
  "tier": "minor|major|signature|keystone",
  "attr_req": {"attr": "vigor|agility|focus|resolve", "die": "d6|d12"},
  "prereq_ids": ["other-talent-id"],
  "momentum_cost": 0,
  "reserve_cost": {"attr": "focus", "amount": 2},
  "ap_cost": "1|free|reaction",
  "tags": ["explosion", "sunder"],
  "source_class": "berserker",
  "text": "Full rules text, second person, present tense."
}
```
Trait:
```json
{
  "id": "kebab-case-unique",
  "name": "Display Name",
  "axis": "wit|perception|agility|...",
  "pole": "strength|weakness",
  "flavor": "physical|social",
  "attr_req": {"attr": "focus", "die": "d6"} ,
  "grants_bonus_pick": false,
  "text": "..."
}
```
Ids are globally unique across all files. No duplicate `name` values either — run
`scripts/check_dupes.py` before any commit.
