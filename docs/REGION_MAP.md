# Region Map — APPROVED

Status: **approved by owner 2026-09-13.** Conversion may proceed. `fury` is the pilot region;
the remaining martial regions follow in parallel only after it is spot-checked (CLAUDE.md rule 6).

## Raw material — measured, not estimated

Counted from `source/v3.2/classes/` by level-tagged feature header, minus obsolete progression
lines (Ability Die Increase, Vitality Surge, Multiattack — all superseded by Design Lock v5 §2/§8):

| Old class | Raw | Obsolete | Usable | Subclass groups |
|---|---|---|---|---|
| Arcanist | 22 | 2 | **20** | Aegis, Control, Transmuter |
| Assassin | 26 | 3 | **23** | Nightshade, Razorwire, Deadeye |
| Berserker | 22 | 3 | **19** | Bloodfury, Iron Storm, Outward Rage |
| Charger | 32 | 2 | **30** | Demolisher, Line Breaker, Ironclad Runner |
| Harrower | 21 | 2 | **19** | Grave Warden, Void Conjurer, Psychic Harrower |
| Invoker | 21 | 2 | **19** | Aegis, Inquisition, Prophet |
| Muse | 22 | 3 | **19** | Virtuoso, Illusionist, Seer |
| Shaman | 22 | 3 | **19** | Spirit Caller, Earthshaker, Stormcaller |
| Stalker | 23 | 3 | **20** | Ghost Hunter, Pack-Bond, Trapper |
| Vanguard | 20 | 3 | **17** | Breach, Warden, Titan |
| Zealot | 21 | 3 | **18** | Black Iron, Eternal Flame, Shepherd |
| **Total** | **252** | **29** | **223** | |

**This revises a premise in Design Lock §12.** The Lock estimated ~164 usable pieces and named
Vanguard as a merge candidate for being too thin. Measured, the floor is Vanguard at 17 usable —
and a full region needs only 8–9 nodes (Minor + 5–6 Majors + Signature + Keystone). **No class is
too thin to carry a region on its own.** The imbalance in §12 is therefore real but is not a
shortfall problem; it is a *variety* problem, addressed below by region count rather than by merging.

Every class also has the same shape — an entry engine, ~6–8 core features, and 3 subclasses of 3 —
which maps onto the tier ladder almost directly: entry engine → **Minor**, core + subclass mid
features → **Majors**, a subclass capstone → **Signature**, the Level-10 class capstone → **Keystone**.

## How the imbalance is actually corrected

Casters gain versatility from the 148-spell pool that martials have no equivalent of. Rather than
merging martial classes (unnecessary — see above), the correction is **more martial regions than
caster regions**, so the martial side gains in build variety what the caster side gains in spells:
**8 martial-sourced regions to 5 caster regions**, achieved by splitting the two richest martial
classes rather than merging the thinnest.

## Proposed regions (13)

| Region ID | Source class(es) | Attribute | Theme | Target Majors | Status |
|---|---|---|---|---|---|
| `fury` | Berserker (Bloodfury, Outward Rage, core) | Vigor | Pain taken becomes damage dealt; rage that radiates outward | 6 | **pilot — in progress** |
| `ironstorm` | Berserker (Iron Storm) + Charger (Demolisher) | Vigor | Two-handed and dual-heavy weapons; Explosion cascades | 5 | approved |
| `bulwark` | Vanguard (Warden, Titan, core) + Zealot (Black Iron) | Vigor | Shields, lockdown, standing between harm and an ally | 6 | approved |
| `linebreaker` | Vanguard (Breach) + Charger (Line Breaker) | Vigor | Displacement, Prone, breaking formations open | 5 | approved |
| `velocity` | Charger (Ironclad Runner, core) | Agility | Movement converted into impact; untouchable tempo | 6 | approved |
| `shadow` | Assassin (Razorwire, Deadeye, core) | Agility | First strike, precision, execution from concealment | 6 | approved |
| `the-hunt` | Stalker (Ghost Hunter, Pack-Bond, core) | Agility | Marking quarry, tracking, pack coordination | 6 | approved |
| `venom` | Assassin (Nightshade) + Stalker (Trapper) | Focus | Toxins, traps, attrition that wins before the fight | 5 | approved |
| `weaving` | Arcanist | Focus | Modifying a spell as it forms; arcane engineering | 6 | approved |
| `decay` | Harrower | Focus | Void, Decay stages, life drawn out of the living | 6 | approved |
| `elements` | Shaman | Focus | Elemental infusion, totems, spirits, storm | 6 | approved |
| `resonance` | Muse | Resolve | Inspiration, illusion, foresight, the mind as weapon | 6 | approved |
| `sanctuary` | Invoker + Zealot (Shepherd, Eternal Flame) | Resolve | Divine authority: wards, judgment, radiant reprisal | 6 | approved |

Totals: **13 regions**, 8 martial-sourced / 5 caster, target **~75 Majors** and **~117 nodes** overall,
drawn from 223 usable raw pieces — meaning every region is selecting its best material rather than
padding to reach a floor.

### Splits and merges, with reasons
- **Charger splits three ways** (Demolisher → `ironstorm`, Line Breaker → `linebreaker`, Ironclad
  Runner + core → `velocity`). At 30 usable it is nearly double the next class and the Lock itself
  flags it for bloat. A large share of its core list (Dash, Burst, the extra-Quick-Action features)
  is obsolete under flat AP anyway, so a single Charger region would have been padded with material
  that has to be rewritten or dropped regardless.
- **Berserker splits two ways** (Iron Storm → `ironstorm`, rest → `fury`). Iron Storm is a
  weapon-property chain, not a rage chain; it pairs far better with Demolisher than with Bloodfury.
- **Vanguard splits two ways** (Breach → `linebreaker`, rest → `bulwark`). Breach is aggressive
  advance; Warden and Titan are protective. They are different verbs wearing one class name.
- **Zealot distributes three ways** (Black Iron → `bulwark`, Shepherd + Eternal Flame →
  `sanctuary`). Zealot is the one genuine martial/caster hybrid; splitting it along that seam is
  cleaner than forcing a region that is half armor and half radiant magic.
- **Invoker + Zealot merge** into `sanctuary` — the only merge. Both are divine, both do wards and
  judgment, and their combined 37 usable features comfortably fill one rich region.
- **No class was merged for being thin.** Every merge and split above is thematic.

### Regions that may need gap authoring (Design Lock §13 step 3)
`ironstorm` (5), `linebreaker` (5), and `venom` (5) draw on partial class material and are the most
likely to fall short of 5 Majors once obsolete text is discarded. Flagged now so the gap pass can
author to the §4.2 recombination rule rather than reflavouring duplicates.

## Caster regions and spell access

Design Lock §11 says Spell Tier maps onto the Talent tier ladder (Tier 0 = Minor … Tier 3 =
Keystone). Two readings are possible and they produce very different content:

- **Reading A (assumed here):** a caster region contains School-access nodes, and *the tier you hold
  in that region gates the spell Tier you can cast* — Minor lets you cast that School's Tier 0,
  a Major opens Tier 1, Signature opens Tier 2, Keystone opens Tier 3. Individual spells are learned
  from the School list without costing Talent picks, as in v3.2. Specialized Armaments come bundled
  with the School-access node, per §10.
- **Reading B:** each of the 8 Schools is its own region, its Tier 1 spells *are* its Majors, and
  each spell costs a pick.

**Reading A is assumed** because Reading B would consume a caster's entire 13-pick budget on a
handful of spells, and because §10's phrase "whichever spellcasting-School Talent grants that
School's access" implies School access is a node inside a region rather than a region itself.
This is logged in OPEN_ITEMS and needs confirmation before any caster region is converted —
it is the single assumption with the widest blast radius in this map.

Class resource engines (Living Conduit, The Aether Conduit, The Inspiration Engine, and similar)
become the region's **Minor** node — they are the entry identity and they are what makes the
region's Momentum generation feel distinct. They are not free passives.
