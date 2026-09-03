# Decision Log
Non-Open-Item calls made while executing the roadmap. Per CLAUDE.md rule 5: decided, noted, moved on.
Anything here can be revisited by the owner; nothing here reopens a locked decision.

## Standing owner rulings (2026-09-03)

- **Flat 1-AP costs across the board on all decisions.** No action ever costs 2+ AP; power
  differentiation lives entirely in Reserve/Momentum costs.
- **Decision delegation:** the owner has delegated this and future decisions to Claude —
  auto-approve, execute, and notate everything here for later review. Open Items may be decided
  provisionally under this delegation; each such decision is logged in OPEN_ITEMS.md and here.

## 2026-09-03 — Phase 1 (Core Rules v4 rewrite)

1. ~~Stowed item retrieval = two Interactions (2 AP total)~~ **SUPERSEDED by owner ruling
   2026-09-03: flat 1-AP costs across the board on ALL decisions.** Stowed retrieval is one
   Interaction (1 AP), same as Readied. The Readied/Stowed distinction now lives in slot limits
   (Agility max face), in Talents/Reactions that reference Readied items, and in out-of-combat
   logistics — not in AP cost.
2. **Baseline Defend action — "Guard"** `(tunable)`. The lock names Defends as an AP category but
   no baseline Defend existed in v3.2. Provisional baseline: Guard (1 AP) — until the start of your
   next turn, Impact Rolls against you are Downgraded. Mirrors the Light Cover mechanic, so it's
   expressed through dice, consistent with the system's design principle.
3. **Disengage defined as a Maneuver (1 AP)**: until the end of your turn, your movement does not
   provoke Opportunity Attacks. v3.2 referenced "deliberately disengaging" without defining it.
4. **Channeled spells**: driving a channel costs 1 AP at the start of your turn (per lock §2.7's
   Standard-Action→1-AP translation), but spending AP on anything else that turn still breaks the
   channel. This preserves v3.2's full-turn-commitment rationale, which is what justifies channels
   carrying the game's most extreme effects.
5. **Weapon/armor access re-gated**: "class weapon restrictions" and "class proficiencies" become
   access granted at character creation or by Talents. The out-of-access penalties are unchanged
   (Downgraded Impact Pool + no Explosion Rider for weapons; all Attribute Dice Downgraded for
   armor). Which configurations a starting character gets is a Phase 2/creation-chapter question.
6. **Health Tier provisional list** `(tunable)`: Frontline (9 + Vigor max), Skirmisher (7 + Vigor
   max), Adept (5 + Vigor max). The lock names the first two and says "etc." Selection mechanism is
   still Open Item 7; defaulting to a creation choice until decided.
7. **Momentum on Tasks — contradiction resolved**: v3.2 Chapter 2 said "party pool" in the Tasks
   section but defined personal pools in the Momentum section. v4 uses personal pools everywhere;
   the flat spend (own roll or an ally's within engagement) already covers helping on Tasks.
8. **Multiattack / Combined Strike text removed from core rules**: both live as Talents (Phase 2).
   The core chapter states only that no baseline multiattack exists — you may spend multiple AP on
   attacks. Discount numbers remain Open Item 6.
9. **Temporary vs. permanent d12**: the d10 natural cap applies to the permanent Attribute Die.
   Temporary roll Upgrades (cover, features, assists) can still push a roll to d12 and into
   overflow, exactly as the retained Upgrade/Downgrade rules describe.

## 2026-09-03 (overnight) — Phase 2 (Talents & Traits)

10. **Schema interpretations**: `reserve_cost` is a string naming pool and amount ("1 Vigor Point",
    "2 Focus Points") or null; `momentum_cost` is a number, or a string range like "1-3"; `ap_cost`
    is a number (0 for passives, Reactions, and Free-Action riders — the action type lives in
    `tags`). Traits (no schema in CLAUDE.md) use `{id, name, flavor: social|good_bad, attr_req:
    {attr, die, op: min|max}, paired_with, tags, text}` — `op:"max"` gates weakness Traits to
    characters at or below the threshold.
11. **Old pool costs → Momentum**: every class-pool cost (Fury, Lethality, Velocity, Animus,
    Conviction, Accord, Acclaim, Aether, Guile, Clarity, Entropy) became a Momentum cost at the
    same number; pool generation triggers became Talent generator Talents feeding Momentum. Old
    caps scaled 2→5; v4 base cap is 3, so abilities costing 4-5 Momentum state that a cap-raising
    Talent (Expanded/Vast Momentum) is required. Avatar of War explicitly prereqs Vast Momentum.
12. **Level mapping**: v3.2 feature levels 1-2 → level_req 2; levels 3-4 → 4; levels 5-6 → 6;
    levels 7-9 → 8; level 10 capstones → 10. Subclass chains run 4 → 6 → 8. Old Level 5 output
    expansions landed at 4 or 6 case by case.
13. **Merged near-duplicates across classes** (each keeps a multi-class `source_class`):
    Aetheric Dart/Void Lance/Sacred Bolt/Psychic Jab → **signature-bolt** (choose damage type);
    Phase Shift/Slip/Dancer's Step/Read the Wind moves → **fluid-step**; Rapid Recovery/Ancestral
    Vigor → **rapid-recovery**; Healing Word/Healing Surge/Stim-Shot → **healing-word**;
    Brace/Unbowed/Blood Armor → **brace**; Steadfast/Steadfast Prayer/Prayer of Resolve/Grim Will →
    **bolstering-word**; Divine Ward/Sharp Timing → **guardian-interjection**; Prophetic
    Strike/Perfect Opening → **seize-the-opening** (middle node of both the Prophet and Seer
    chains); Iron Retribution/Blood for Blood → **retributive-strike** (also Bloodfury chain
    middle node); Danger Sense/Predator's Reflex → **evasive-instinct**; Phase Step/Spirit Walk →
    **phase-step**; Fortress Stance/Fortress of One → **fortress-stance** (also Black Iron chain
    middle node); Sanctuary of Steel folded into the ward talents, with Martyr's Blood serving as
    the Shepherd chain's middle node.
14. **Dropped as obsolete under the 3-AP economy** (any character can already do the thing):
    Dash, Burst, Adaptive Response, baseline Multiattack text, Aetheric Echo's "equivalent to
    Multiattack" framing. Dropped as redundant with featured attacks: Ghoststrike, Speed Bubble,
    Mercurial Healing (Charger's kit was the largest and kept its identity without them). Blur of
    Motion became +1 AP restricted to non-Attack use, exactly as lock §2.7 prescribes; Burning
    Clock will get the same treatment in Phase 3.
15. **The Juggernaut**: "third attack from momentum" became "next attack costs 0 AP after moving
    40ft" — an AP-economy-native phrasing of the same reward (tunable).
16. **Spell access & tier unlocks**: one School-access Talent per School (8 total, level_req 2,
    Focus d6). Each grants Tier 0 + Tier 1; Tier 2 unlocks at character level 5 and Tier 3 at
    level 9 for accessed Schools (tunable) — v3.2 had no explicit unlock schedule to retain.
17. **Article of War** kept its choose-one structure as a single repeatable Talent.
18. **Open Item 6 decided (provisional)**: Relentless Onslaught = flat −1 Reserve on the second
    attack-adjacent ability each turn, minimum 0; "attack-adjacent" = tagged attack or a
    Free-Action rider on one.
19. **Open Item 7 decided (provisional)**: Health Tier is a creation choice (no Trait slot spent).
    Four tiers restored from source: Bulwark 11 / Frontline 9 / Skirmisher 7 / Adept 5 (+ Vigor
    max), replacing the three-tier guess.
20. **Bad Traits grant a slot**: taking a weakness Trait grants one additional Trait choice at
    creation (tunable) — the incentive that makes paired weaknesses worth choosing.
21. **Trait count**: 22 Traits shipped (11 good/bad in mirrored pairs, 11 social). The list is a
    starter set; expansion is content work, not design work.

## 2026-09-03 (overnight) — Phase 3 (Spells)

22. **Source count discrepancy**: the seven v3.2 lists actually contain **149** spells, not the
    148 the Design Lock states (Evocation 21, Abjuration 22, Divination 21, Transmutation 23,
    Illusion 21, Entropy 20, Resonance 21). All 149 were converted; with 21 new Conjuration
    spells, data/spells.json holds 170.
23. **v4 translations applied to spell text**: "Standard Action"/"Quick Action" → 1 AP (Venom
    Strike's purge, Void Mantle's rejoin, Mirror Storm's scrutinize, etc.); "Unconscious" →
    "Incapacitated" (the core rules' term); "Focus is spent" → "Reserve is spent" where it names
    the cost being wasted. **Burning Clock** now grants +1 AP restricted to non-Attack actions,
    exactly as lock §2.7 prescribes. Everything else is word-for-word from source.
24. **Domination spells re-expressed in AP**: Seized Action commands 1 AP of the target's turn;
    Stolen Will consumes 1 AP per command; Absolute Command consumes 2 AP; The Hive consumes 1 AP
    per target. This preserves v3.2's rule that no Resonance effect removes a whole turn — under
    3 AP, the target always keeps movement-capable AP and survival instinct.
25. **Name collision resolved**: the Illusion spell Phantom Double keeps its canonical name; the
    Muse chain Talent mined from the same concept was renamed **Phantom Ally** (`phantom-ally`),
    with its chain prereq updated.
26. **Conjuration draft (Open Item 5)**: 21 spells across the school's three locked identities —
    creating matter, summoning entities, teleportation. Tier shape mirrors the other schools
    (T0×5 / T1×6 / T2×6 / T3×4). Summons reuse the Servitor statline convention from the mined
    summon Talents (HP = base + Focus max, Defenses keyed to half Focus max) so all summons in
    the game speak one language. Damage is Bludgeoning/Piercing ("varies by conjured form" per
    the lock's school table). Momentum conventions (Glancing Blow / resisted Save → 1 Momentum)
    match the other lists.

## 2026-09-03 — Phase 4 (Paper playtest kit)

27. **Starting attribute array**: two Attributes at d6, two at d4, assigned by the player
    `(tunable)` — the v3.2 per-class convention generalized. Used by the pre-built paths; the
    real home for this rule is the future creation chapter (lock §5 input still needed).
28. **Level 1 is the pre-Talent baseline**: per the lock, Talents start at Level 2, so a Level 1
    character runs on dice, Health Tier, and Traits alone. Stated plainly on the paths sheet
    rather than papered over.
29. **The kit is generated, not authored**: `scripts/build_playtest_kit.py` produces all three
    PDFs. After tuning any number, rerun the script — never hand-edit the PDFs.
30. **Path picks verified against the data**: each pre-built sequence satisfies every level gate,
    attribute-die gate, and prerequisite chain in data/talents.json at the level it is taken
    (die increases were scheduled to open the gates in time). Paths remain guidance only.
