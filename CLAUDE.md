# CLAUDE.md — project instructions (read this first, every session)

This repo is a classless tabletop RPG (working title "[GAME NAME]"), 20-level cap, being built from
mined content across 11 old classes and 7 (soon 8) spell schools. **Design decisions are FROZEN in
`docs/DESIGN_LOCK_v5.md` — this supersedes v4 entirely. Read v5 before doing anything. Do not read
v4 for rules; it's kept for history only.**

## Ground rules
1. **Do not reopen locked decisions** (Design Lock v5, all sections). If a locked decision creates
   a conflict, log it in `docs/OPEN_ITEMS.md` and pick the interpretation closest to the lock.
   Never redesign silently — if you think a rule is wrong, say so and stop, don't route around it.
2. **Content lives in data, not code.** Every Talent, Trait, and spell is a JSON file under `data/`.
   The eventual app only renders `data/`. This is how the owner edits the game without Claude.
3. **Source material is read-only.** `source/v3.2/` is the old system. Mine it; never edit it.
4. **The current phase is content conversion, not app development.** Follow Design Lock v5 §13
   in order: Region Map → per-region harvest/convert → per-region gap pass → per-region balance
   check → dedupe. Do not touch `app/` until all regions pass the balance check.
5. **`docs/REGION_MAP.md` must be completed and internally consistent before any file is written
   to `data/talents/`.** This is the first task. Do not skip to conversion because source material
   is sitting right there — the whole point of the region map is to catch the martial/caster
   content imbalance (Design Lock v5 §12) before, not after, writing 100+ Talents.
6. **Convert one region at a time**, each as its own file (`data/talents/<region-id>.json`).
   Spot-check each region against Design Lock v5 before starting the next. A systemic conversion
   mistake caught after region 1 costs one file; caught after region 11 costs eleven.
7. **Ask before deciding any item still marked open in `docs/OPEN_ITEMS.md`.** Everything else:
   decide, log it if it's a judgment call worth remembering, move on.
8. **No duplicate ids or names across `data/`.** Run `python3 scripts/check_dupes.py` before
   ending any session that touched `data/`.
9. **Log every finding from a balance-check pass in `docs/OPEN_ITEMS.md`**, even if you also fix
   it — structural issues (a dead level, a resource math problem) should be visible, not silently
   patched. This project has already had to walk back several early decisions once worked examples
   exposed problems; the log is how that stops costing rework.

## Using subagents for this phase
Region conversion (Design Lock v5 §13, step 2) is a good fit for parallel subagents — each region
is independent once the Region Map and schema are fixed.
- Dispatch one subagent per region (or small batch of thin regions), giving it: `docs/
  DESIGN_LOCK_v5.md`, the schema (§14), its assigned region's row from `docs/REGION_MAP.md`, and
  only that region's source files.
- Each subagent should return one complete `data/talents/<region-id>.json` and a short note on
  whether it hit the Major-count target or needs a gap-fill pass — not touch any other region's
  file or shared docs.
- Do the gap-fill and balance-check passes (§13 steps 3–4) in the main session after subagents
  return, since those need judgment against the whole picture, not per-region isolation.
- Explicit invocation ("use a subagent to convert the Bloodfury region") is more reliable than
  relying on automatic routing.

## Layout
- `docs/`      — DESIGN_LOCK_v5.md (rules), REGION_MAP.md (fill in first), OPEN_ITEMS.md (log here)
- `source/`    — v3.2 originals converted to Markdown (11 classes, 7 spell schools, Chapter 2)
- `data/`      — v4 game content: `rules/*.md`, `talents/<region>.json`, `traits.json`, `spells.json`
- `playtest/`  — character sheet, quick-ref, pre-built paths (later phase)
- `app/`       — do not touch this phase
- `scripts/`   — validation/dedupe utilities

## Data schema
See Design Lock v5 §14 for the authoritative Talent and Trait schemas. Do not improvise fields.

## Style
Rules text: second person, present tense, match the tone of `source/v3.2/rules/chapter_2_core_rules.md`.
Every converted Talent should read as if it were written for this system from the start — not
"convert Elemental Strike, keep the old Animus references and swap the word" but a genuine rewrite
using Momentum, the AP economy, and the tier-gate language from Design Lock v5 §4.
