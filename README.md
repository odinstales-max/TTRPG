# [GAME NAME] — v4

A classless, talent-driven tabletop RPG. The core dice engine is Step-Dice (d4→d12) with
Impact Rolls against Defense Ratings; the v4 rebuild dissolves eleven classes into an open
Talent web and replaces eleven resource pools with one.

**All game content is plain data.** Rules live in `data/rules/*.md`, and every Talent, Trait,
and spell lives in a JSON file. The web app renders those files and contains no game content
of its own, so you can edit the game without touching code — and without AI.

## Status

| Phase | Deliverable | Where |
|---|---|---|
| 1 | Core Rules v4 | `data/rules/` — 15 chapters, including character creation |
| 2 | Talents & Traits | `data/talents.json` (217), `data/traits.json` (22), `data/creation.json` (28 purchases) |
| 3 | Spell master list | `data/spells.json` (170, including a new Conjuration school) |
| 4 | Paper playtest kit | `playtest/` — character sheet, quick reference, 3 pre-built paths |
| 5 | Web app | `app/` — builder, compendium, rules reference, admin editor |
| 6 | Handoff | this file, plus deploy config for Pages and Netlify |

## Editing the game

1. **Rules text** — edit the Markdown in `data/rules/`. The app renders it as-is.
2. **Talents, Traits, spells** — edit the JSON directly, or run the app and use the
   **Admin Editor**, which writes whole files back to `data/` while you are running
   `npm run dev`.
3. **Validate** before committing:
   ```bash
   python scripts/check_dupes.py
   ```
   Ids and names must be unique across every file in `data/`.
4. **Regenerate the playtest PDFs** after tuning numbers — they are generated, never
   hand-edited:
   ```bash
   python scripts/build_playtest_kit.py
   ```

Numbers marked `(tunable)` are deliberate playtest targets, not settled design.

## Running the app

```bash
npm install --prefix app     # once
npm run dev  --prefix app    # http://localhost:5173
npm run build --prefix app   # → app/dist
```

See [app/README.md](app/README.md) for what each view does and how the admin write-back
works. Requires Node 20+ and Python 3 for the scripts.

## Deploying

**Live: https://eraofsilence-744cb.web.app**

The build is a static folder with `base: './'`, so it works from any subpath.

- **Firebase Hosting (primary)** — `npm run deploy --prefix app` builds and publishes.
  Accounts and saved characters live in the same Firebase project, so hosting, auth, and
  data are one console.

- **GitHub Pages** — `.github/workflows/deploy.yml` builds and publishes on every push to
  `master`. Enable it once at *Settings → Pages → Source: GitHub Actions*, then re-run the
  workflow from the Actions tab (a run that happened before Pages was enabled will have
  failed at the deploy step). **Pages on a private repo needs a paid GitHub plan** — on the
  free tier, either make the repo public or use Netlify below.
- **Netlify** — `netlify.toml` is already configured; point Netlify at the repo.

The workflow runs the dedupe check before building, so malformed data fails the deploy
rather than shipping.

## Pushing to GitHub

The repo has no remote yet. To publish it:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin master
```

## Accounts and saved characters

The compendium works signed out — rules, Talents, spells, and the builder all run with no
account, and your working character is kept in this browser. Signing in adds sync:

- **Auth**: Google sign-in or email/password, via Firebase Auth.
- **Storage**: characters are written to `users/{uid}/characters` in Firestore, so they
  follow you between devices. Save, open, and delete from the *My Characters* panel.
- **Rules content is never in the database.** Talents, Traits, spells, and rules text stay
  in git and compile into the app, so a balance change is a commit you can diff and revert.
  Firestore holds only per-user data.

Security is enforced by [firestore.rules](firestore.rules): default-deny everywhere, each
account reachable only by its owner, and character documents validated on every write.
Verified against the live database — anonymous reads and writes, cross-user access, and
documents carrying unexpected fields are all rejected.

The Firebase web config in `app/src/firebase.js` is public on purpose: an API key
identifies the project, it does not grant access. The rules are the security boundary.

```bash
npx -y firebase-tools@latest deploy --only firestore:rules   # after editing rules
```

## Documentation

| File | What it holds |
|---|---|
| [docs/DESIGN_LOCK_v4.md](docs/DESIGN_LOCK_v4.md) | The frozen structural decisions. Changing these requires a deliberate, written reason. |
| [docs/OPEN_ITEMS.md](docs/OPEN_ITEMS.md) | The seven items that were allowed to remain open, and what each was decided to be. |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Every judgment call made while building phases 1–6, numbered and dated, with the reasoning. Start here when something looks arbitrary. |
| [docs/draft_notes_sept_2026.md](docs/draft_notes_sept_2026.md) | The original brainstorming that led to v4. |
| [CLAUDE.md](CLAUDE.md) | Instructions for working on this repo with Claude Code. |

## Still needed from you

These are noted in Design Lock §5 and remain the real gaps:

- Rulebook chapters still missing: equipment tables, GM rules, bestiary. Character creation
  now exists (`data/rules/02_character_creation.md`) as a 20-point buy, but its prices are
  playtest targets — the numbers most worth hitting with real play.
- Review of the seven Open Item decisions — three were yours; four were decided
  provisionally under delegation and are marked as such.
- Review of the drafted Conjuration spell list (21 spells).
- A game name.
