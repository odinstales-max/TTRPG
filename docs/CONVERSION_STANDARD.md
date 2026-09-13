# Conversion Standard — binding on every region

Owner-directed, 2026-09-13, from review of the `fury` pilot. Design Lock v5 says *what* the
structure is; this says *how* a converted Talent must read and cost. Every region file and every
subagent is held to this. Where it conflicts with an earlier assumption, this wins.

---

## 1. Resources — what costs what

Momentum is generated and renews inside a fight. Reserve is a hard daily pool. **They are not
interchangeable, and the pilot's mistake was pricing everything in Momentum.**

| Resource | Nature | What it may buy |
|---|---|---|
| **Momentum** | Soft. Generated in combat, resets at combat start, cap 3→9. | Small riders. One extra die. A Reaction's mitigation. A minor condition. |
| **Daily Reserve** | Hard. Finite per day, keyed to an Attribute. | Real power: multi-die additions, area effects, forced conditions, anything that ends a fight early. |
| **AP** | 3 per turn, flat. | Anything that is an action in its own right. |
| **Free effect** | Costs no AP. | Only small riders attached to something you already did. |

**The rule the pilot broke:** a big effect may not be cheap on *every* axis at once. If it is a Free
effect, it costs Reserve or is small. If it costs only Momentum, it is small. Furious Strike was a
Free effect, Momentum-only, up to three bonus dice, *and* a knockdown — four cheap axes stacked.

### Cost budget by tier

| Tier | AP | Momentum | Reserve | Notes |
|---|---|---|---|---|
| **Minor** | passive, or 1 AP | 0–1 | 0 | Entry identity. Cheap and always useful. |
| **Major** | 1 AP, or Free rider | 1–2 | 0–1 | One clear verb. Never more than one bonus die from Momentum alone. |
| **Signature** | 1 AP | 2–3 | 1–2 | Recombines two primitives (Lock §4.2). |
| **Keystone** | 1 AP or passive | 0–3 | 0–2 | Once per combat. The mastery payoff. |

Momentum costs do **not** scale with the pool as it grows to 9; a Major stays cheap on purpose.

---

## 2. Generators — one per character

A Talent that grants Momentum from a repeating trigger is a **Generator**, tagged `generator`.

- **A character may own at most one Generator, ever.** Choosing it is a real commitment.
- A region has **at most one** Generator node.
- A Generator is a **Major**, never the Minor. If it were the Minor, and Majors required their
  Minor, the one-Generator cap would confine a character to a single region and break Lock §4.3.
- One-off Momentum grants (a Keystone that refills the pool once per combat, a Glancing Blow's
  universal +1) are **not** Generators and are not capped.

---

## 3. Gating — what actually requires what

Per Lock §4.1, read literally:

- **Minor** — Attribute Die d6. No prerequisite.
- **Major** — Attribute Die d6. **No prerequisite.** Majors are siblings, not children; requiring
  the Minor was a pilot-era invention and is withdrawn.
- **Signature** — Attribute Die d6, plus **any two Majors of that region**.
- **Keystone** — Attribute Die d12, plus that region's Signature.

Because the schema's flat `prereq_ids` reads as AND, a Signature carries only its region's
Signature requirement in prose; the "any two" rule is enforced by the reader until the schema
grows a way to say it. See OPEN_ITEMS.

---

## 4. How rules text must read

Second person, present tense, matching `source/v3.2/rules/chapter_2_core_rules.md`.

**Do not explain the design to the reader.** No sentences about why a rule exists, what it is an
exception to, or how it interacts with the bonus-die cap. The player and GM get the rule; the
reasoning lives here and in OPEN_ITEMS.

> ✗ "These are added dice, not a bigger die, and they are a deliberate exception to the Bonus Impact Dice rule."
> ✓ "Add one Vigor Die to that attack's Impact Roll."

**No fixed Save Difficulties in Talent text.** A Save imposed by a Talent is written open — "or be
knocked Prone" — and its Difficulty comes from the character, not the ability.

> ✗ "must succeed on a Vigor Save against Difficulty 5 or be knocked Prone"
> ✓ "must succeed on a Vigor Save or be knocked Prone"

*(The global rule for what Difficulty a Talent-imposed Save uses is still open — proposed: the
governing Defense Rating of the Talent's owner, following the disbelief rule in v3.2 Illusion.
Logged in OPEN_ITEMS. Until it is settled, write the Save open and never name a number.)*

**Keep it tight.** Two to four sentences. One evocative opening line is welcome; a paragraph of
flavour is not. Cut any sentence that restates a rule the core chapter already covers.

---

## 5. Tag vocabulary — closed list

Use only these. Do not invent tags; twelve regions inventing their own makes the data unqueryable.

- **Primitives** — `momentum`, `upgrade`, `downgrade`, `explosion`, `sunder`, `glancing-blow`
- **Shape** — `passive`, `reaction`, `free-rider`, `once-per-combat`
- **Role** — `generator`, `burst`, `mitigation`, `mobility`, `control`, `sustain`, `support`
- **Conditions** — `prone`, `dazed`, `bleeding`, `restrained`, `blinded`, `slowed`, `frightened`,
  `marked`, `burning`, `grappled`

Every node carries exactly one **Role** tag. Others as applicable.

---

## 6. Region shape

1 Minor · 5–6 Majors (floor 3), each a distinct Role · 1 Signature · 1 Keystone. At most one
Major is the region's `generator`.

## 7. Before returning a region file

- Every node validates against the Lock §14 schema, exact field set, no extras.
- Tier gates: Minor/Major/Signature d6, Keystone d12, all on the region's Attribute.
- Costs inside the tier budget in §1.
- No invented tags, no fixed Save Difficulties, no design-rationale sentences.
- `python scripts/check_dupes.py` passes; `python scripts/render_talents.py <region>` reads well.

---

## 8. Resource abbreviations

Full names in every finished Talent and rules sentence — abbreviations are for scratch notes,
worked-example tables, and future quick-reference material only, never in delivered text.

| Resource | Abbreviation | Notes |
|---|---|---|
| Action Points (the flat 3-per-turn economy) | **AP** | Load-bearing everywhere already — schema's `ap_cost`, the app, every rules chapter. Keeps the letters. |
| Vigor (Daily Reserve) | **VP** | |
| Agility (Daily Reserve) | **AgP** | Not `AP` — that collided with Action Points and is retired. |
| Focus (Daily Reserve) | **FP** | |
| Resolve (Daily Reserve) | **RP** | |
| Momentum | **Mom.** | Rarely abbreviated; spell it out unless space is tight. |

---

## 9. Save-based martial Talents (owner-authorized, 2026-09-13)

The default for a martial Talent is the core Combat chapter's Impact Roll against a Defense
Rating — no to-hit, connect always assumed. Some martial Talents may instead force a standard
Attribute **Save**, exactly as a spell does. This is a deliberate exception for effects that land
on a beat the target must resist, not a strike that must connect — an area burst, not a blow.

- Name the Save's Attribute in the text ("Agility Save"), matching the Talent's own theme.
- State what happens on a failure, and separately on a success — never leave success undefined.
- **Never name a Difficulty.** A Talent-imposed Save is written open, exactly like every other
  Talent-imposed Save (§4). The rule for what Difficulty these use is still Open Item — see
  OPEN_ITEMS.md — and will apply uniformly to spell Saves and martial Saves alike once settled.
- Still priced inside its tier's AP/Momentum/Reserve budget (§1). A Save-based AoE is not exempt
  from tier costing just because it changed resolution method.

---

## 10. Worked examples from the owner, 2026-09-13

Reference only — these are **not** live Talents. No `id`, `region`, or `tier`; not in any data
file; not validated by `check_talents.py`. They exist to fix the target voice: resource cost
first, one mechanical clause per line, nothing explaining why the rule exists.

**Fan of Blades** — 2 AgP. Agility Save, 15ft cone. Agility damage.
**Whirlwind** — 2 VP. 5ft area, Vigor damage. If a creature is killed, spend 1 Momentum to make another attack.
**Savage Strike** — 1 VP. Roll an additional Vigor die. If the result is a Glancing Blow, spend 1 Momentum to reroll any number of the Impact dice.
**Brutal Strike** — 1 VP. When an Impact die Explodes, roll one additional Impact die into the total.
**Heedless Assault** — 2 RP. Roll 1 Vigor die. Reduce your own Vigor Defense and one target within 5ft's Vigor Defense by the result.

Not yet assigned to a region — do not add these to `fury` or any other region file without
further direction. Whirlwind's cost (2 Reserve) also sits above the current Major budget in §1
(0–1 Reserve); worth revisiting that ceiling once these get a home, rather than shrinking the
examples to fit a number that may itself be wrong.
