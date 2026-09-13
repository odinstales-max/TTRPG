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
