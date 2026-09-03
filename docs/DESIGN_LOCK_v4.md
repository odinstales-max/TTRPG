# [GAME NAME] — Design Lock v4.0
**Date locked:** September 2, 2026
**Purpose:** Every structural decision below is FROZEN. Changes to this document require a deliberate,
written reason. Playtesting happens against this spec. Tuning numbers is fine; reopening structure is not.

---

## 1. What v4 Is

A classless, talent-driven rebuild of the v3.2 system. The core dice engine (Step-Dice, Impact Rolls vs.
Defense Ratings, Explosions, Glancing Blows, Saves, Tasks, Daily Reserves) is **retained unchanged**
unless listed below. Everything class-shaped is dissolved into a talent web.

---

## 2. Locked Decisions

### 2.1 Attributes & Progression
- Four Attributes: **Vigor, Agility, Focus, Resolve.** Step-Dice d4 → d12. *(Unchanged)*
- Defense Ratings = half max face of the governing die. *(Unchanged)*
- **Natural progression caps at d10.** Ability Die Increases at Levels **3, 5, 7, 9** are the only path
  to d10.
- **d12 is not reachable by leveling.** Reaching d12 requires a Talent, item, or other feature that grants
  an Upgrade beyond d10. *(Mechanism deferred — see Open Items.)*
- **Talents are gained at Levels 2, 4, 6, 8, 10.** Ability Die Increases stay on 3/5/7/9. Every level
  grants exactly one of the two.

### 2.2 Classes → Talents & Traits
- **Classes are removed.** No class chassis, no subclass, no class progression table.
- **Talents** (feat-analog): always beneficial, combat/capability-oriented, gated by **minimum level**
  and optionally by **Attribute Die threshold** (e.g. "Vigor d8+"). Some Talents may have Talent
  prerequisites (chains).
- **Traits** (background-analog): personality/physical definers, can be a strength or a paired
  weakness, gated by **Attribute Die threshold.** Two flavors: Social, and Good/Bad. *(Whether Traits are
  chosen or assigned at creation — see Open Items.)*
- The web is **fully open**: any Talent whose prerequisites are met is available regardless of what
  else the character has taken. No archetype anchor.
- Suggested "paths" (pre-built Talent sequences reproducing the 11 old class fantasies) ship as
  guidance only, not as rules.
- **Source material:** The 11 v3.2 classes (Arcanist, Assassin, Berserker, Charger, Harrower, Invoker,
  Muse, Shaman, Stalker, Vanguard, Zealot) are mined for Talents. Old subclass Paths (3 features each)
  become 3-node Talent chains.

### 2.3 Action Economy
- **3 Action Points (AP) per turn.** Every action costs **1 AP** — no exceptions.
- Action categories: **Attacks, Defends, Maneuvers (includes movement), Interactions, Spellcasting.**
- **Reactions are a separate resource** outside the AP pool: one per round, regained at the start of
  your turn. *(Unchanged from v3.2)*
- **Free-Action riders** (effects triggered by a hit, e.g. old Elemental Strike / Furious Strike) remain
  outside AP. They cost Momentum or Reserve, never AP.
- The v3.2 Standard/Quick/Free/Reaction structure is **retired.** All v3.2 feature text is rewritten,
  not converted.

### 2.4 Attack Structure
- **Basic Attack:** 1 AP. Rolls **1 Attribute Die** (Vigor melee, Agility ranged/Finesse). No resource
  cost.
- **Featured Attacks** (Talent abilities, spells): 1 AP + a **Reserve** and/or **Momentum** cost. The
  cost buys additional dice and/or an effect.
- **Multiattack is removed** as a baseline feature. Its role is replaced by a **Reserve-discount Talent**
  (reduces the Reserve cost of a second attack-adjacent ability used in the same turn). A separate
  **Combined Strike Talent** (pool two attacks into one Impact Roll) is a later Talent option.
- Bonus Impact Dice rule (max one bonus die per roll unless a feature says otherwise) is retained.

### 2.5 Unified Resource: Momentum
The 11 class pools (Fury, Guile, Velocity, Animus, Conviction, Lethality, Acclaim, Aether, Clarity,
Accord, Entropy) are **collapsed into Momentum.** Flavor lives in Talent text, not pool names.

- **One pool per character.** Base cap **3.** Talents may raise the cap.
- **Universal generators** (retained from v3.2): Glancing Blow (attacker +1), Save resisted (caster +1),
  Task failed by 1–2 (+1), Task failed by 3+ (+2).
- **Talent generators:** Talents grant additional generation triggers feeding the same pool (e.g. "gain
  1 Momentum when an enemy attacks you"). No separate trackers.
- **Two spend tiers:**
  - *Flat spend* — 1 token = +1 to a roll, own or an ally's within engagement. Shareable. *(Unchanged)*
  - *Talent spend* — Talents define effects purchased with Momentum. **Self-only**, never shareable.
- **Reset timing: DECISION REQUIRED** — see Open Items. Default until decided: **Long Rest** (v3.2
  behavior).

### 2.6 Daily Reserves
- Retained as four Attribute-keyed pools (Vigor/Agility/Focus/Resolve Points).
- Base capacity = max face of the starting die. **Per-level growth formula must be rewritten** (v3.2 tied
  it to class). Provisional: **+4 total per level, allocated by the player** across the four pools.
- Spell Reserve costs (Tier 0 = 0, Tier 1 = 1–2, Tier 2 = 3–4, Tier 3 = 5–6 Focus) unchanged.

### 2.7 Spells
- 8 Schools retained. **7 spell lists exist (148 spells); Conjuration is missing and must be written.**
- Spell access is granted by Talents (per School), not by class.
- All "requires a Standard Action" text becomes "1 AP." Free-Action and Reaction spells keep those tags.
- Features granting "an extra Quick Action" (e.g. Burning Clock, Blur of Motion) are **re-evaluated**: they
  grant +1 AP restricted to non-Attack use unless deliberately opened up.

### 2.8 HP
- Retained: level-1 formula by tier is replaced by a **Talent/Trait or creation choice** selecting a Health
  Tier (Frontline 9 + Vigor max / Skirmisher 7 + Vigor max / etc.). Per-level roll and Vitality Surge at
  5 and 10 unchanged.

---

## 3. Open Items (must be decided before playtest, nothing else may be reopened)
1. **Momentum reset timing:** Long Rest (persistent, v3.2 flavor) vs. start of combat (burst flavor).
2. **d12 access mechanism:** which Talents/items grant the d10→d12 Upgrade.
3. **Traits — chosen or assigned?** And do they have a level cadence or are they creation-only?
4. **Reserve growth formula** (provisional +4/level player-allocated).
5. **Conjuration spell list** (needs writing).
6. **Multiattack-discount Talent numbers** (flat −1 Reserve? −2? qualifying abilities).
7. **Health Tier selection mechanism** (Trait vs. creation choice).

---

## 4. Build Roadmap (in order — do not skip ahead)

| Phase | Deliverable | Format | Purpose |
|---|---|---|---|
| **1** | Chapter 2 rewrite (Core Rules v4) | Markdown | Rulebook text for AP, Momentum, Talents |
| **2** | Talent & Trait master list | JSON + Markdown | Every node: id, name, level req, attribute req, prereq ids, cost, text |
| **3** | Spell master list | JSON | All 148 (+ Conjuration) normalized to one schema |
| **4** | Paper playtest kit | PDF | Character sheet, quick-reference, 3 pre-built paths |
| **5** | Web app (static, data-driven) | React + JSON | Character builder, rules reference, admin editor |
| **6** | Repo handoff | Git-ready folder | You push to GitHub; deploy on Pages/Netlify |

**Why this order:** Phases 1–3 are the same data the app reads. Phase 4 lets you test rules before
the app hardens them. Phase 5 builds against files that already exist, so the app never dictates the rules.

---

## 5. Inputs Still Needed From You
- Any rulebook chapters other than Chapter 2 (creation, equipment, GM rules, bestiary).
- The Conjuration spell list, or confirmation that I should draft it.
- Decisions on Open Items 1–3 (the rest can be provisional).
- Game name, if decided.
