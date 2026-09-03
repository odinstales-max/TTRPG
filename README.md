# [GAME NAME] — v4 rebuild

Classless, talent-driven tabletop RPG. All game content is plain data in `data/`; the web app in
`app/` renders it. Edit the game by editing files — no AI required.

- Start here: `docs/DESIGN_LOCK_v4.md`
- Working with Claude Code: it reads `CLAUDE.md` automatically.
- Validate content: `python3 scripts/check_dupes.py`

## Status
- [x] Phase 1 — Core Rules v4 (`data/rules/`)
- [x] Phase 2 — Talents & Traits (`data/talents.json`, `data/traits.json`)
- [x] Phase 3 — Spells (`data/spells.json`)
- [ ] Phase 4 — Playtest kit (`playtest/`)
- [ ] Phase 5 — Web app (`app/`)
- [ ] Phase 6 — Deploy (GitHub Pages / Netlify)
