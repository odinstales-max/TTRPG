# CLAUDE.md — project instructions (read this first, every session)

This repo is a classless tabletop RPG (working title "[GAME NAME]") being rebuilt from v3.2 to v4.
The design decisions are FROZEN in `docs/DESIGN_LOCK_v4.md`. Read it before doing anything.

## Ground rules
1. **Do not reopen locked decisions.** If a locked decision creates a conflict, flag it in
   `docs/OPEN_ITEMS.md` and pick the interpretation closest to the lock. Never redesign silently.
2. **Content lives in data, not code.** Every rule, talent, trait, and spell is a JSON or Markdown file
   under `data/`. The app only renders `data/`. This is how the owner edits the game without Claude.
3. **Source material is read-only.** `source/v3.2/` is the old system. Mine it; never edit it.
4. **Follow the roadmap in order** (Design Lock §4). Commit at the end of each phase with a message
   like `phase-1: core rules v4`. Do not start Phase 5 (app) until Phases 1–3 are committed.
5. **Ask before deciding any Open Item** (Design Lock §3). Everything else: decide, note it, move on.
6. No duplicate ids/names across `data/`. Run the dedupe check (`scripts/check_dupes.py`) before commits.

## Layout
- `docs/`      — design lock, open items, decision log
- `source/`    — v3.2 originals converted to Markdown (11 classes, 7 spell schools, Chapter 2)
- `data/`      — v4 game content: `rules/*.md`, `talents.json`, `traits.json`, `spells.json`
- `playtest/`  — character sheet, quick-ref, pre-built paths (Phase 4)
- `app/`       — static React + Vite site reading `../data` (Phase 5). Admin editor writes back to `data/`.
- `scripts/`   — validation/dedupe utilities

## Data schema (Phase 2/3 must conform)
Talent: `{ id, name, level_req, attr_req: {attr, die}|null, prereq_ids: [], momentum_cost, reserve_cost,
ap_cost, tags: [], source_class, text }`
Spell: `{ id, name, school, tier, focus_cost, target, range, tags: [], action: "1AP"|"free"|"reaction",
channeled: bool, text }`
Ids are kebab-case, globally unique across all files.

## Style
- Rules text: second person, present tense, match the tone of `source/v3.2/rules/chapter_2_core_rules.md`.
- Keep numbers "tunable" flagged with `(tunable)` where the lock says provisional.
