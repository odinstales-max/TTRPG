# Paste this as your first message in Claude Code, opened on this same project folder

Read CLAUDE.md, docs/DESIGN_LOCK_v5.md, and docs/OPEN_ITEMS.md in full. Design Lock v4 is
superseded — do not use it for rules, history only.

Then:
1. Confirm you understand the level cap is now 20, the d10 hard cap is removed, and Momentum/
   Combat Role/Traits/Vicious are new systems that didn't exist before this update. Say back to me
   in one short paragraph what changed, so I know it landed correctly.
2. Do NOT start converting Talents yet. Your first real task is `docs/REGION_MAP.md` — read it,
   then propose a completed region map (merges/splits included, per the martial/caster imbalance
   noted in Design Lock v5 §12) and show it to me before writing any files to data/talents/.
3. Once I approve the region map, use subagents to convert regions in parallel per the guidance in
   CLAUDE.md — one subagent per region or small batch, each returning one data/talents/<id>.json.
4. After all regions are converted, run the gap pass and balance check (Design Lock v5 §13 steps
   3–4) yourself in the main session, log findings in docs/OPEN_ITEMS.md, and only then run
   scripts/check_dupes.py and report back.

Commit after the region map is approved, and again after each batch of regions is converted and
spot-checked — small commits, not one giant one at the end.
