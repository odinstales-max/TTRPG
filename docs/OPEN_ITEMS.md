# Open Items — log decisions here as they're made. Nothing else may be reopened without a stated reason (Design Lock v5 §0).

## Resolved this session (for history — the decision itself lives in Design Lock v5, cited below)
| # | Item | Decision | Lock ref |
|---|------|----------|----------|
| 1 | Momentum reset timing | Start of combat | §5 |
| 2 | d12 access mechanism | Removed the gate entirely; natural via Ability Die Increases | §3 |
| 3 | Traits: chosen or assigned, cadence | Chosen; 3 physical + 1 social at creation, +1 at L10 | §6 |
| 7 | Health Tier selection mechanism | Combat Role (creation choice, bundled w/ armor+speed) | §9 |
| — | Talent tier gating (die size per tier) | Minor/Major = d6, Signature = d6+2 Majors, Keystone = d12 | §4.1 |
| — | Vigor/HP coupling | HP die fixed by Combat Role at creation, decoupled from live Vigor | §9 |
| — | Vicious property at d12 | Redesigned: reroll natural 1s, not die-size upgrade | §10 |
| — | Spell Tier ceiling | Tier 0–3 maps to Minor–Keystone; no Tier 4 needed | §11 |
| — | Level cap | Raised 10 → 20, Talent/Die-Increase schedule respaced | §2 |

## Still open — needs a decision or authoring work
| # | Item | Status |
|---|------|--------|
| 4 | Daily Reserve growth formula | Still "provisional +4/level" from v4 — never stress-tested at 20 levels |
| 5 | Conjuration spell list | Not written — 7 of 8 schools exist |
| 6 | Multiattack-discount Talent — exact numbers | Concept locked (§8), mechanism/numbers not statted |
| — | "Extra Quick/Free Action" features (Burning Clock, Blur of Motion) | Flagged as needing rework under flat AP, untouched |
| — | Magic item framework | Not started. Scoped only as: does NOT need to solve d12 access anymore; could cover Momentum-cap boosts, situational Upgrades |
| — | Cross-path/region bridge reference for the printed rulebook | Lower priority now that Major/Signature don't require die-climbing between regions — still useful for Keystone-reach planning |
| — | Region map | **Proposed 2026-09-12** — 13 regions (7 martial / 6 caster-hybrid) in docs/REGION_MAP.md. Awaiting owner approval; nothing written to data/talents/ yet. |
| — | **Spell access reading (§11)** | **BLOCKING for caster regions.** §11 can be read as (A) region tier gates the castable spell Tier, spells learned free from the School list, or (B) each School is its own region and each spell costs a pick. Map assumes A; B would spend a caster's whole 13-pick budget on a few spells. Needs owner confirmation. |
| — | **§4.1 internal inconsistency** | §4.1 states Signature requires "any 2 of the region's Majors" but also that a full region "costs 6 picks minimum (Minor + 3 Majors + Signature + Keystone)". Those disagree: 2 Majors makes the true minimum 5 picks. Flagged per CLAUDE.md rule 1 rather than silently picking one. Affects how many regions a 13-pick career can complete (two full regions at 5 each leaves 3 spare; at 6 each leaves 1). |
| — | **§12 raw-count premise revised** | Lock estimated ~164 usable pieces and named Vanguard a merge candidate for thinness. Measured count is 223 usable, floor Vanguard 17 — above the 8-9 a region needs. No class requires merging. Imbalance re-addressed via region count (7 martial vs 6 caster) instead. |
| — | **Stale `data/talents.json`** | **RESOLVED 2026-09-13** — moved to `docs/archive/talents-v4-superseded.json`. Moved rather than deleted: fully recoverable, out of the `data/` glob so rule 8 works again, and v5's layout never included a flat talents.json. Say the word to delete it outright or restore it. Original finding below. |
| — | *(was)* stale talents.json detail | **Found in the fury pilot.** The file holds 217 superseded v4 Talents on the v4 schema (`level_req`, no `region`/`tier`). Seven of its names collide with fury's (Relentless, Crimson Tide, Crimson Rampage, Furious Strike, Goading Roar, Wrathful Stride, Infectious Fury), so `check_dupes.py` fails on every future region that mines the same class. v5's layout lists `talents/<region>.json`, not a flat `talents.json`. Needs a keep-or-delete ruling; not deleted unilaterally since it is 217 records. |
| — | **`check_dupes.py` was blind to `data/talents/`** | **FIXED 2026-09-13.** It globbed `data/*.json` only, so every region file would have been skipped and rule 8 would have silently passed forever. Now recurses with `data/**/*.json`, reports which file each duplicate came from, and prints file/entry counts. This is what surfaced the stale-talents.json collision above. |
| — | **Schema (§14) cannot express two things fury needed** | Non-blocking, worked around in text. (a) Signature's "owns any 2 of the region's Majors" has no representation — `prereq_ids` is a flat list that reads as AND, so the requirement currently lives in prose and the app cannot enforce it. (b) Passive Talents have no legal `ap_cost`; `"free"` is used with a `passive` tag. Both need a schema decision before the app phase. |
| — | **§8 vs §4.2 tension on Upgrade** | §8 says Talents should grant "more dice, not bigger dice", but §4.2 lists Upgrade/Downgrade as an allowed primitive. Resolved in fury by using added dice for damage (Furious Strike, Crimson Tide) and reserving Downgrade for penalties imposed on enemies (Goading Roar). Flagging so other regions follow the same split rather than each inventing one. |
| — | Content-volume gap authoring | Depends on region map; martial regions (esp. post-merge) likely need net-new Majors |

## Owner rulings — fury review, 2026-09-13
| # | Ruling | Where it lives now |
|---|---|---|
| — | **Generators are capped at 1 per character.** A Talent granting Momentum from a repeating trigger is tagged `generator`; a character may ever own only one. | CONVERSION_STANDARD §2 |
| — | **A Generator must be a Major, never a region's Minor.** Consequence caught during implementation: if Minors were Generators *and* Majors required their Minor, the 1-Generator cap would confine a character to a single region and break Lock §4.3. Majors therefore gate on die alone — the mandatory-Minor prereq was a pilot invention and is withdrawn. | CONVERSION_STANDARD §2–3 |
| — | **No design-rationale text in player-facing rules.** No "this is a deliberate exception to…" sentences. Reasoning lives in docs, not in the product. Enforced by `scripts/check_talents.py`. | CONVERSION_STANDARD §4 |
| — | **No fixed Save Difficulties in Talent text.** Write "or be knocked Prone", never "against Difficulty 5" — the number comes from the character. | CONVERSION_STANDARD §4 |
| — | **Momentum is soft, Reserve is hard, and a big effect may not be cheap on every axis.** The pilot priced everything in Momentum and left Reserve unused; Furious Strike was a Free effect + Momentum-only + 3 bonus dice + a knockdown. Per-tier cost budgets now exist and are machine-checked. | CONVERSION_STANDARD §1 |
| — | **Closed tag vocabulary.** 15 invented tags in the pilot; twelve parallel subagents would have produced twelve taxonomies. | CONVERSION_STANDARD §5 |

## Still open from the fury review
| # | Item | Status |
|---|------|--------|
| — | **Difficulty of a Talent-imposed Save** | Talent text now writes Saves open with no number. The global rule for what Difficulty they use is undecided. Proposed: the governing Defense Rating of the Talent's owner, following the v3.2 Illusion disbelief precedent. Needs a ruling before the balance pass. |
| — | **Region map said 7 martial / 6 caster; it is 8 / 5** | Corrected in REGION_MAP.md 2026-09-13. `venom` is martial-sourced (Assassin Nightshade + Stalker Trapper) though Focus-gated, which is what I miscounted. |

## Findings from the parallel martial conversion, 2026-09-13
Logged per CLAUDE.md rule 9. Independent subagents hit several of these separately, which is
evidence they are structural rather than one converter's misreading.

| # | Finding | Status |
|---|------|--------|
| — | **A region's Minor can be load-bearing, but Majors may not require it.** Hit independently by `the-hunt` and `ironstorm`. Six of the-hunt's nine nodes reference "your Quarry", yet a character may legally take them without ever taking the Minor that grants the mark. **This may be over-correction on my part:** I withdrew the Minor-prereq because Minor-as-Generator plus a mandatory Minor would have locked a character into one region — but now that Generators are Majors, requiring a region's Minor costs one pick and does *not* break Lock §4.3. Needs an owner ruling: (a) restore "Majors require their region's Minor", (b) keep siblings and accept that some nodes are inert without the Minor, or (c) allow a per-region flag. Affects all 13 regions. |
| — | **`ironstorm`'s Minor is dead below Vigor d8.** Lock §4.1 forces every Minor to gate at d6, but the core rules require Vigor d8+ to wield a Heavy weapon at all, and ironstorm's entry identity *is* dual-Heavy wielding. Either the universal d6 Minor gate or the Heavy-weapon requirement has to give. Written straight at d6 for now. |
| — | **REGION_MAP is now stale on resource engines.** It says "class resource engines become the region's Minor node"; CONVERSION_STANDARD §2 supersedes that — Generators must be Majors. Corrected in the map 2026-09-13. |
| — | **My own budget table read as forcing Reserve onto Keystones.** CONVERSION_STANDARD §1 listed Keystone Reserve as "1–2", which `the-hunt` read as a minimum and worked around by paying Reserve to refill Momentum. The validator always allowed 0; the table now reads "0–2". |
| — | **Does the Generator cap cover Momentum granted to allies?** `fury-infectious-fury` and `the-hunt`'s Pack Leader both hand an ally Momentum without being tagged `generator`. Read as self-generation only, so ally grants are uncapped and cost Reserve. Confirm — if ally grants count, both need retagging and the cap becomes much tighter. |
| — | **Mixed-Attribute Impact Pools.** `velocity` adds Agility Dice to melee attacks that otherwise roll Vigor, following the fury precedent of a Talent naming its own bonus die. Reads fine but produces a mixed pool. Confirm this is intended rather than Finesse-gated. |
| — | **Two nodes to watch in the balance pass.** `velocity`'s Afterimage negates an entire attack for 2 Momentum (compare fury's Blood Armor: 1 Momentum for one die of reduction), and three of velocity's Majors key off the same 20ft trigger, making its pool self-feeding. `ironstorm`'s Breaking Point (Explode on max or one below) has no stated interaction with Vicious's reroll-a-1. |
| — | **`data/rules/` is still v4-era and contradicts v5 in places.** `linebreaker` hit this: the Prone condition text says a Prone creature stands by spending "a Quick Action", an action type Lock §7 retired. The rules chapters were written for v4's 10-level, pre-Momentum system and have not had a flat-AP pass. No Talent restates the stale text, but the condition list itself is wrong in the product. Needs a sweep before playtest. |
| — | **"Push" is not a defined term.** Chapter 2 standardises Prone, Restrained, Slowed and the rest, but forced movement is only ever plain language. `linebreaker` and `ironstorm` both needed it. Either define a Push keyword or accept prose — several regions will keep hitting this. |
| — | **Keystones are not actually required to be once-per-combat.** CONVERSION_STANDARD §1's Notes column implies it; neither the budget nor `check_talents.py` enforces it, and `linebreaker`'s Keystone is a permanent passive with a per-trigger Momentum cost that is self-funding off the universal Glancing Blow grant. Decide whether once-per-combat is a rule or a guideline, then enforce or drop it. |
| — | **Archived v4 file collides with five `linebreaker` names** (Hold the Line, Open the Lane, Phalanx Formation, Thunderclap Step, Unstoppable Advance). Harmless while it sits in `docs/archive/`, but it must never be restored to `data/`. |
| — | **Parallel conversion caused a real source collision — my briefing error.** I assigned Vanguard *core* features to both `bulwark` and `linebreaker`. `linebreaker` reached **Hold the Line** first, so `bulwark` — the lockdown region — lost its most iconic Reaction and substituted Iron Hold from the Titan Regiment. Both regions also drew on *Threatening Presence*: linebreaker's Minor took its reach clause, bulwark's Generator took its Momentum clause. Not a rules error and both regions validate, but the gap pass should decide whether Hold the Line sits in the right region. Future briefs must partition source features explicitly, not just subclasses. |
| — | **May martial Talents Sunder at all?** The core chapter says only Channeled effects may stack a Defense Rating to 0. `bulwark` drafted then cut a Glancing-Blow-triggers-Sunder clause rather than guess a stacking cap; `linebreaker` and `the-hunt` both ship Sunder effects. Needs one global ruling on martial Sunder and its cap. |
| — | **Conditions keep fixed Difficulties that Talents are forbidden to write.** Talent text must now write Saves open, but the core condition text still bakes in numbers — Grappled's escape is "Vigor Save against Difficulty 5". `bulwark`'s Iron Hold stays silent so the condition's own rule applies, which leaves the number living in the rules while Talents may not name one. Same sweep as the flat-AP pass on `data/rules/`. |
| — | **`venom` introduces a fifth resource: toxin doses.** Its Minor grants a per-day dose count keyed to the Focus Die — a hard daily pool that is *not* Daily Reserve, so CONVERSION_STANDARD §1's four-axis cost model does not describe it. It is currently what stops the Minor being free. Either bless doses as a region-local resource or re-price toxin application in Focus Points and drop them. |
| — | **Bleeding does not scale, and a whole region runs on it.** Flat 2 True Damage, cap 6, no stacking — so `venom`'s Keystone applies the same Bleed a level-2 toxin does. The attrition identity has no growth curve. Balance-pass item. |
| — | **Two nodes give unconditional numeric edges at cheap tiers.** `shadow`'s Minor (Read the Wound) lets Agility attacks resolve against the *lower* of the target's Vigor or Agility Defense — permanent, free, level-2 reachable. And `shadow`'s Keystone forces every die in an Impact Roll to Explode, which multiplies with the Vicious weapon property. Both flagged by the converter as the region's highest-variance points. |
| — | **Orphaned mechanic: Bait's "Off-Balance".** Charger's turn-order displacement is a genuinely new mechanic, which Lock §4.2 forbids at Minor/Major tier. Dropped from `velocity` with no home. Keep as a Signature/Keystone candidate or retire it. |

## Owner rulings — martial ability format review, 2026-09-13
Owner supplied five handwritten worked examples of the target Talent voice. Three decisions
came out of reviewing them; details and the abbreviation table live in CONVERSION_STANDARD §8–10.

| # | Ruling | Where it lives now |
|---|---|---|
| — | **Action Points keep "AP".** Reserve-pool shorthand is renamed instead: Vigor VP, Agility **AgP** (was going to collide with AP), Focus FP, Resolve RP. Abbreviations are for scratch/reference use only — finished text always spells the resource out in full, which is already how `render_talents.py` renders every node. | CONVERSION_STANDARD §8 |
| — | **Save-based martial Talents are a real, authorized second resolution path**, not shorthand for "Impact Roll vs. Defense." A martial Talent may force a standard Attribute Save instead of rolling an Impact Roll, for effects that land on a beat rather than a strike that must connect. This is a deliberate exception to the core Combat chapter's Impact-Roll default, directed by the owner rather than inferred — logged per CLAUDE.md rule 1, not silently added. It still writes Saves open (no fixed Difficulty) and still costs inside its tier's budget. | CONVERSION_STANDARD §9 |
| — | **The five submitted abilities (Fan of Blades, Whirlwind, Savage Strike, Brutal Strike, Heedless Assault) are style reference only.** Not inserted into `fury` or any region. Do not add them anywhere without further direction. | CONVERSION_STANDARD §10 |

## Still open from this review
| # | Item | Status |
|---|------|--------|
| — | **Save-based martial Talents still need the Difficulty-source ruling to be usable.** They're authorized structurally but every one written so far leaves the number out, same as every other Talent-imposed Save. This makes the existing "Difficulty of a Talent-imposed Save" open item more urgent — it now blocks a whole new category of martial Talent, not just edge cases. |
| — | **Whirlwind's 2 Reserve cost exceeds the Major budget in CONVERSION_STANDARD §1 (0–1 Reserve).** One data point, not evidence the ceiling is wrong — but worth weighing when these examples get a real home, rather than trimming them to fit a number that hasn't been stress-tested either. |
| — | **The playtest kit (character sheet, quick reference PDF) is v4-era and predates the region system, level-20 cap, and Momentum entirely.** Not touched this session per CLAUDE.md rule 4 (content conversion phase, not app/playtest phase). Flagging so the eventual v5 playtest pass knows to adopt the VP/AgP/FP/RP convention from the start rather than drift back to v4's habits. |
