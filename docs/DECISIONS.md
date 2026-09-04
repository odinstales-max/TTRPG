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

## 2026-09-03 — Phase 5 (Web app)

31. **Mechanics live in one module**: `app/src/rules.js` holds the dice ladder, gates,
    slot counts, HP, Momentum cap, and tier unlocks. The builder and the browsers both read
    it, so they cannot drift from each other. When a locked rule changes, that file and
    `data/rules/` are the two places to touch.
32. **Data is imported, never fetched**: the app pulls `../../data/*.json` and
    `data/rules/*.md` through Vite's glob imports, so content is inlined at build time and
    the production bundle is a single static folder with no runtime data directory. Bundle
    is ~453 kB (127 kB gzipped) with all 217 Talents, 22 Traits, 170 spells, and 14 rules
    files inside.
33. **Admin write-back is dev-only by design**: `POST /__api/save` exists only under
    `npm run dev` (`apply: 'serve'`), accepts only the three data files, and rejects
    duplicate ids — mirroring `scripts/check_dupes.py`. In a production build the endpoint
    404s and the editor falls back to downloading the edited file. A static host must never
    carry a write endpoint.
34. **HP is shown as an average with an override**: per-level HP is a Vigor Die roll, so the
    builder displays the expected value and offers a manual field for what was actually
    rolled at the table.
35. **The d12 capstone is an explicit choice**: taking Legendary Attribute reveals a picker
    listing only Attributes already at d10, matching the Talent's text rather than silently
    upgrading one.
36. **Trailing newlines normalized** in `data/*.json`. The Phase 2/3 merge scripts wrote
    files without one; the admin editor's writer adds it, so the first save produced a
    one-byte diff. All three files now end with a newline.

## 2026-09-03 — Character creation rework (owner-directed)

The owner identified a real balance flaw: four Health Tiers offered as a free choice means
every character takes Bulwark, because nothing is given up for it. The fix is a point-buy
creation system, which also fills part of the Design Lock §5 gap (a creation chapter).

37. **20 Creation Points** `(tunable)`, chosen for "one strong identity": the old default array
    (two d6) costs 6, leaving 14 for a single standout — high health, a d8, a School, or good
    gear — but never two of them. Written up in `data/rules/02_character_creation.md`, priced in
    `data/creation.json` so costs are data, not code.
38. **Everything starts at d4.** Attribute dice are bought: d4→d6 costs 3, d6→d8 costs 5,
    d8→d10 costs 9. Escalating cost means a specialist pays for their specialty. A d10 at
    creation is legal at 17 points and deliberately self-punishing — it also strands that
    Attribute's four Ability Die Increases.
39. **Health Tier is priced** at 0/3/6/10 for Adept/Skirmisher/Frontline/Bulwark. Bulwark costs
    half the budget, which is the point: durability now competes with capability. Resolves
    Open Item 7 properly and supersedes decision 19.
40. **Task Specialties** are new (2 CP each, max 3): name a trained field, Upgrade your die on
    Tasks it covers. This is the answer to the owner's "skills" — it reuses the Step-Die engine
    rather than adding a parallel resolution mechanic, and never applies to Impact Rolls or
    Saves. Documented in `09_tasks_and_saves.md` as well as the creation chapter.
41. **Creation Features, not Talents** (4 CP, max 1). The owner asked for "a talent" at
    creation, which conflicts with locked §2.1 (Talents at levels 2/4/6/8/10 only). Rather than
    amend the lock, creation buys from a separate, deliberately weaker set of eight features
    that never appear in the Talent web and cannot be taken later. Level 1 still grants no
    Talent; decision 28 stands.
42. **Access is purchased**, replacing the vague "granted at creation" of decision 5: martial
    weapons 2, heavy weapons 1 (Vigor d8), shields 1, armor 1/2/3, Vestments 2, Armaments 2,
    Spell School 4 (Focus d6, max 2). The School-access Talent remains available from level 2,
    so magic can be deferred rather than bought early.
43. **Supersedes decision 27** (the two-d6/two-d4 starting array). That array is now simply
    what 6 of your 20 points buys, not a rule.
44. **Rules chapters renumbered** to put creation second, where a rulebook needs it: former
    02–13 became 03–14 and every cross-link was updated. The app's sidebar and index follow
    automatically because both are generated from the files.

## 2026-09-03 — Accounts and saved characters (owner-directed)

The owner's goal is a D&D Beyond-style site: accounts, stored characters, eventually
sharing. That changes the earlier "this needs no backend" answer, but not the content model.

45. **Two layers, deliberately separate.** Game content (Talents, Traits, spells, rules
    chapters, creation costs) stays in git and compiles into the bundle — same for every
    user, versioned, diffable, revertable. Only per-user data goes to Firestore. Putting
    rules content in a database would trade git history for nothing.
46. **Reused `eraofsilence-744cb`** rather than a new project: the Google account is at its
    project quota, and that project already carries the game's name from v3.2 ("Era of
    Silence"). Its Firestore was STANDARD edition with default open rules that had already
    expired on 2026-01-07, so nothing was live to disturb.
47. **Data model**: `users/{uid}/characters/{id}` with `name`, `level`, `sheet` (the whole
    builder state as a map), `createdAt`, `updatedAt`. Name and level are duplicated out of
    the sheet so the character list renders without parsing every document.
48. **Rules are default-deny** with owner-only access and full validation on create *and*
    update, per the Firebase rules guidance. Updates use `updateDoc` so `createdAt` is never
    in the write and its immutability check passes without the client echoing it back.
    Verified live: anonymous read/write, cross-user read/write, out-of-range level, and an
    unexpected `isAdmin` field are all rejected; owner read/write succeeds.
49. **Signed out still works.** Auth is additive: the draft character stays in localStorage
    either way, so nothing is lost by signing out mid-build. The site is usable by someone
    who never makes an account.
50. **Hosting moved to Firebase** (https://eraofsilence-744cb.web.app), which also sidesteps
    GitHub Pages' paid-plan requirement for private repos. The Pages workflow is kept as a
    second target for when the repo is public. CI auto-deploy to Firebase needs a
    `FIREBASE_SERVICE_ACCOUNT` secret, which requires an interactive GitHub OAuth flow the
    owner must run (`firebase init hosting:github`); until then deploys are
    `npm run deploy --prefix app`.

## 2026-09-03 — Creation reworked as a lifepath (owner-directed)

The 20-point buy read as a spreadsheet rather than a character. The owner asked for something
closer to a traditional RPG — history first, numbers following from it — and supplied the
core spec. Decisions 37-44 are superseded wholesale.

51. **Three stages of history**: Origin (where you were raised), Trade (what you did), and
    The Turn (what put you on the road), in `data/lifepath.json` — 6 origins, 8 trades, 6
    turns, all written from Era of Silence material rather than medieval flavour. Between
    them they grant five Skills, access, and a Creation Feature, so most of a character
    arrives as history rather than purchase.
52. **Overlap became a free pick, not a loss.** A Trade repeating a Skill your Origin gave
    you would otherwise silently waste a grant; instead each duplicate converts into a free
    Skill choice. The builder computes and displays this.
53. **Attributes: everything starts at d4 with exactly two improvements** — two Attributes to
    d6, or one to d8 (owner's spec). No cost, no pool. This is the specialist-versus-generalist
    choice in its oldest form, and it supersedes both the old two-d6/two-d4 array (decision 27)
    and the escalating 3/5/9 pricing (decision 38).
54. **Health is Vigor.** Health Tiers are gone: starting HP = 4 + twice the Vigor Die maximum
    `(tunable)`, giving 12/16/20/24 at d4/d6/d8/d10. Durability cannot be shopped for, which
    closes the original complaint permanently rather than pricing around it. Closes Open Item 7.
55. **Reserves track the die, not the purchase.** Each pool equals its Attribute Die's
    **current** maximum plus per-level allocations, so a die increase at level 3/5/7/9 now
    deepens the pool too. A raised die improves offense, Defense, and Reserve together.
56. **Skills are a fixed list of sixteen** (`data/skills.json`), each keyed to an Attribute
    and drawn from the setting — Scavenging, Ruin-Lore, Toxicology, Beast-Handling and so on.
    Training is binary and applies to Tasks only. This replaces free-text Task Specialties
    (decision 40), which could not be granted by an Origin or referenced by anything.
57. **Armor now interferes with spellcasting** — the mechanic the owner asked for, expressed
    in dice rather than percentages. Vestments and Light armor: nothing. Medium: Downgrade the
    Focus Die on spell Impact Rolls and Concentration Saves. Heavy: as Medium, and Tier 2+
    cannot be cast at all. Documented in Equipment, cross-referenced from Spellcasting, and
    enforced in the builder's spell list.
58. **Starting gold is flat at 100** `(tunable)`, on top of the kit Origin and Trade grant.
59. **The point pool shrank to 6** and now buys only personalisation: Skills (2), Traits (3),
    a second Feature (4), access (1-3), a School (4), coin (1). Nothing essential is bought —
    dice, health, Reserves, Skills, Traits, and a Feature all arrive free.
60. **Talents still start at level 2.** The owner asked about starting Talents; Creation
    Features remain the answer, now granted by your Trade and freely swappable. Locked §2.1
    is untouched and decision 28 stands. Amending it remains a one-line change if wanted.
