# Starting a new Claude Code session on this repo

The original bootstrap prompt (phases 1–6) is complete — see the git log and
`docs/DECISIONS.md`. Use one of these instead.

## For any new work

Claude Code reads `CLAUDE.md` automatically, which points at the Design Lock. You usually
need only describe the task. Two things worth saying explicitly:

- Whether a locked decision is genuinely being reopened, or whether Claude should pick the
  interpretation closest to the lock and flag the conflict.
- Whether you want to approve judgment calls as they come up, or have them decided and
  logged in `docs/DECISIONS.md` for later review.

## Suggested next task

> Read CLAUDE.md and docs/DESIGN_LOCK_v4.md fully, then check docs/OPEN_ITEMS.md and
> docs/DECISIONS.md so you know what has already been decided and why.
>
> Design Lock §5 lists the chapters still missing. Draft the **character creation
> chapter** into `data/rules/` as v4: starting attribute array, Health Tier selection,
> Trait selection, starting equipment and access (weapons, armor, Armaments), and the
> level-1 baseline. Reconcile it with the provisional calls already made — decisions
> 19, 27, and 28 — and promote or revise them explicitly rather than silently.
>
> Run `python scripts/check_dupes.py`, commit, then summarize what changed and what it
> settled.

## After changing any content

```bash
python scripts/check_dupes.py            # ids and names unique across data/
python scripts/build_playtest_kit.py     # regenerate the PDFs if numbers moved
npm run build --prefix app               # confirm the app still builds
```
