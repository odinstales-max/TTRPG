# The v4 app

A static React + Vite site that renders `../data`. It contains no game content of its
own: every Talent, Trait, spell, and rule on screen is read from the data files, so
editing the game never means editing the app.

```bash
npm install --prefix app     # once
npm run dev  --prefix app    # http://localhost:5173
npm run build --prefix app   # → app/dist (static, deployable anywhere)
```

## What's here

| View | Purpose |
|---|---|
| **Character Builder** | Level, Health Tier, dice, die increases, Reserve allocation, Talents, Traits, spells. Every level gate, Attribute-die gate, and prerequisite chain is enforced live, and a validation panel lists anything that became illegal (for example after lowering your level). Saves to `localStorage`; exports JSON; prints. |
| **Talents / Traits / Spells** | Filterable browsers over the data files. |
| **Rules** | `data/rules/*.md` rendered in place, with cross-file links rewritten to in-app routes. |
| **Admin Editor** | Edit entries as JSON and write whole files back to `data/`. |

## How the admin editor writes back

`vite.config.js` registers a middleware at `POST /__api/save` that is **dev-only**
(`apply: 'serve'`). It accepts `talents.json`, `traits.json`, and `spells.json`, rejects
duplicate ids — the same rule `scripts/check_dupes.py` enforces before a commit — and
writes the file with a trailing newline.

A production build has no server, so that endpoint 404s and the editor falls back to
**Download**: save the file, drop it into `data/`, and commit it. This is deliberate —
a static host must never expose a write endpoint.

## Deploying (Phase 6)

`base` is `'./'`, so `app/dist` works from any subpath — GitHub Pages project sites
included. Build output is gitignored; publish it from CI or push the folder to a
`gh-pages` branch.

## The one rule for changing this app

Content changes belong in `data/`. Touch `app/src` only when you are changing how
content is *presented* — or when a locked rule changes, in which case `src/rules.js`
is the single place the mechanics live (dice ladder, gates, slot counts, HP, Momentum
cap). Both the builder and the browsers read from there, so they cannot drift apart.
