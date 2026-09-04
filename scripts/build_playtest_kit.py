#!/usr/bin/env python3
"""Generate the Phase 4 paper playtest kit into playtest/.

Outputs: character_sheet.pdf, quick_reference.pdf, prebuilt_paths.pdf.
Rerun after tuning numbers in data/ or docs/ — the kit is derived, not hand-edited.
"""
import os
from reportlab import rl_config
# Invariant output: no embedded timestamps or random ids, so regenerating an
# unchanged kit produces byte-identical files instead of churning git history.
rl_config.invariant = 1
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, PageBreak)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

OUT = os.path.join(os.path.dirname(__file__), "..", "playtest")
os.makedirs(OUT, exist_ok=True)

INK = colors.HexColor("#1a1a2e")
ACCENT = colors.HexColor("#4a3f6b")
FAINT = colors.HexColor("#8888a0")
PALE = colors.HexColor("#efeef5")

W, H = letter

# ---------------------------------------------------------------- character sheet

def rule(c, x0, y, x1, w=0.8, col=INK):
    c.setLineWidth(w); c.setStrokeColor(col); c.line(x0, y, x1, y)

def label(c, x, y, text, size=6.5, col=FAINT):
    c.setFont("Helvetica", size); c.setFillColor(col); c.drawString(x, y, text)

def box(c, x, y, w, h, title=None, lw=1.0):
    c.setLineWidth(lw); c.setStrokeColor(INK); c.rect(x, y, w, h)
    if title:
        c.setFont("Helvetica-Bold", 7); c.setFillColor(ACCENT)
        c.drawString(x + 3, y + h - 9, title.upper())

def circles(c, x, y, n, r=6, dashed_after=None, gap=17):
    for i in range(n):
        cx = x + i * gap
        if dashed_after is not None and i >= dashed_after:
            c.setDash(2, 2)
        else:
            c.setDash()
        c.setLineWidth(1.1); c.setStrokeColor(INK); c.circle(cx, y, r)
    c.setDash()

def write_lines(c, x, y, w, n, spacing=13):
    for i in range(n):
        rule(c, x, y - i * spacing, x + w, 0.5, FAINT)

def character_sheet():
    path = os.path.join(OUT, "character_sheet.pdf")
    c = canvas.Canvas(path, pagesize=letter)
    m = 0.45 * inch
    top = H - m

    # header
    c.setFont("Helvetica-Bold", 16); c.setFillColor(INK)
    c.drawString(m, top - 14, "[GAME NAME]  —  CHARACTER SHEET")
    c.setFont("Helvetica", 7); c.setFillColor(FAINT)
    c.drawRightString(W - m, top - 14, "Core Rules v4 playtest")
    y = top - 30
    # identity row
    for lbl, wfrac in [("NAME", 0.34), ("SUGGESTED PATH", 0.26), ("LEVEL", 0.08),
                       ("HEALTH TIER", 0.16), ("BASE SPEED", 0.16)]:
        pass
    xs = m
    for lbl, wpt in [("NAME", 180), ("SUGGESTED PATH", 140), ("LEVEL", 45),
                     ("HEALTH TIER", 90), ("BASE SPEED", 65)]:
        rule(c, xs, y - 12, xs + wpt, 0.8)
        label(c, xs, y - 20, lbl)
        xs += wpt + 8
    y -= 34

    # ---- attribute panels (left column)
    colw = 250
    panel_h = 78
    attrs = [
        ("VIGOR", "Melee strikes, athletics, raw endurance"),
        ("AGILITY", "Ranged & Finesse attacks, reflexes, evasion"),
        ("FOCUS", "Spellcasting, perception, problem-solving"),
        ("RESOLVE", "Command, fear resistance, force of will"),
    ]
    ay = y
    for name, blurb in attrs:
        box(c, m, ay - panel_h, colw, panel_h, title=name)
        # die box
        box(c, m + 8, ay - panel_h + 12, 46, 40)
        label(c, m + 8, ay - panel_h + 4, "ATTRIBUTE DIE")
        # defense box
        box(c, m + 66, ay - panel_h + 12, 46, 40)
        label(c, m + 66, ay - panel_h + 4, "DEFENSE = MAX/2")
        # reserve
        label(c, m + 124, ay - 22, "DAILY RESERVE")
        c.setFont("Helvetica", 8); c.setFillColor(INK)
        c.drawString(m + 124, ay - 36, "Max")
        rule(c, m + 146, ay - 38, m + 180, 0.8)
        c.drawString(m + 188, ay - 36, "Current")
        rule(c, m + 220, ay - 38, m + 242, 0.8)
        c.setFont("Helvetica-Oblique", 6); c.setFillColor(FAINT)
        c.drawString(m + 124, ay - 50, blurb)
        c.drawString(m + 124, ay - 60, "Base = starting die max · +4/level, split freely")
        ay -= panel_h + 8

    # ---- combat trackers under attributes
    ty = ay - 4
    box(c, m, ty - 88, colw, 88, title="Turn Trackers")
    label(c, m + 8, ty - 22, "ACTION POINTS — every action costs 1 AP, no exceptions")
    circles(c, m + 16, ty - 36, 4, dashed_after=3)
    label(c, m + 84, ty - 39, "(4th = feature-granted, non-Attack only)")
    label(c, m + 8, ty - 54, "REACTION (1/round, back at start of your turn)")
    circles(c, m + 200, ty - 52, 1)
    label(c, m + 8, ty - 68, "MOMENTUM — cap 3 (dashed = cap Talents) · resets at combat start")
    circles(c, m + 16, ty - 80, 5, dashed_after=3)

    # ---- right column
    rx = m + colw + 12
    rw = W - m - rx
    # HP block
    box(c, rx, y - 84, rw, 84, title="Hit Points")
    box(c, rx + 8, y - 50, 60, 34)
    label(c, rx + 8, y - 58, "MAXIMUM")
    box(c, rx + 78, y - 50, 60, 34)
    label(c, rx + 78, y - 58, "CURRENT")
    box(c, rx + 148, y - 50, 46, 34)
    label(c, rx + 148, y - 58, "TEMP")
    c.setFont("Helvetica-Oblique", 6); c.setFillColor(FAINT)
    c.drawString(rx + 8, y - 70, "Per level: Vigor Die + level (min half die) · Vitality Surge at 5 & 10: +Vigor max.")
    c.drawString(rx + 8, y - 79, "At 0 HP: Vigor Save vs 5 — 3 successes stable, 3 failures dead, Explosion = up at 1 HP.")
    yr = y - 92

    box(c, rx, yr - 78, rw, 78, title="Creation  (20 Creation Points)")
    label(c, rx + 8, yr - 22, "HEALTH TIER / CP")
    rule(c, rx + 96, yr - 24, rx + 196, 0.8)
    label(c, rx + 208, yr - 22, "GOLD")
    rule(c, rx + 232, yr - 24, rx + rw - 8, 0.8)
    label(c, rx + 8, yr - 40, "CREATION FEATURE")
    rule(c, rx + 96, yr - 42, rx + rw - 8, 0.8)
    label(c, rx + 8, yr - 58, "TASK SPECIALTIES  (Upgrade the die on Tasks they cover)")
    write_lines(c, rx + 8, yr - 70, rw - 16, 1, spacing=12)
    yr -= 86

    box(c, rx, yr - 104, rw, 104, title="Talents  (one at levels 2, 4, 6, 8, 10)")
    write_lines(c, rx + 8, yr - 24, rw - 16, 6)
    yr -= 112
    box(c, rx, yr - 56, rw, 56, title="Traits  (2 at creation; +1 at levels 5 & 10)")
    write_lines(c, rx + 8, yr - 24, rw - 16, 2)
    yr -= 64
    box(c, rx, yr - 92, rw, 92, title="Spells  (name / school / tier / cost)")
    write_lines(c, rx + 8, yr - 24, rw - 16, 5)
    yr -= 100

    # ---- bottom band: equipment & notes
    by = min(ay - 4 - 88, yr) - 8
    box(c, m, m, W - 2 * m, by - m, title="Equipment & Notes")
    label(c, m + 8, by - 22, "READIED SLOTS = your Agility Die maximum (draw/stow: 1 AP each)")
    slot_w = (W - 2 * m - 16 - 11 * 4) / 12
    for i in range(12):
        sx = m + 8 + i * (slot_w + 4)
        c.setLineWidth(0.8); c.setStrokeColor(INK if i < 4 else FAINT)
        c.rect(sx, by - 52, slot_w, 24)
    label(c, m + 8, by - 64, "STOWED  (retrieve: 1 AP)")
    write_lines(c, m + 8, by - 78, W - 2 * m - 16, 4, spacing=14)
    label(c, m + 8, by - 140, "NOTES")
    n_lines = max(0, int((by - 154 - (m + 8)) / 14))
    write_lines(c, m + 8, by - 154, W - 2 * m - 16, n_lines, spacing=14)

    c.showPage(); c.save()
    return path

# ---------------------------------------------------------------- quick reference

def styled():
    ss = getSampleStyleSheet()
    ss.add(ParagraphStyle("H", parent=ss["Heading2"], textColor=ACCENT,
                          spaceBefore=8, spaceAfter=3, fontSize=11))
    ss.add(ParagraphStyle("B", parent=ss["Normal"], fontSize=8.2, leading=10.6))
    ss.add(ParagraphStyle("T", parent=ss["Normal"], fontSize=7.8, leading=9.8))
    return ss

def tbl(data, widths, ss, header=True):
    rows = [[Paragraph(cell, ss["T"]) for cell in row] for row in data]
    t = Table(rows, colWidths=widths)
    style = [
        ("GRID", (0, 0), (-1, -1), 0.4, FAINT),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]
    if header:
        style += [("BACKGROUND", (0, 0), (-1, 0), PALE)]
    t.setStyle(TableStyle(style))
    return t

def quick_reference():
    path = os.path.join(OUT, "quick_reference.pdf")
    ss = styled()
    doc = SimpleDocTemplate(path, pagesize=letter, topMargin=0.5 * inch,
                            bottomMargin=0.5 * inch, leftMargin=0.5 * inch,
                            rightMargin=0.5 * inch, title="Quick Reference")
    s = []
    s.append(Paragraph("[GAME NAME] — QUICK REFERENCE (Core Rules v4)", ss["Title"]))

    s.append(Paragraph("Character Creation — 20 Points", ss["H"]))
    s.append(Paragraph("Everything starts at d4, Adept health, two free Traits, 25 gold. "
                       "Every point spent in one place is a point missing somewhere else.", ss["B"]))
    s.append(tbl([
        ["Purchase", "Cost", "Purchase", "Cost"],
        ["Attribute d4→d6", "3", "Task Specialty (max 3)", "2"],
        ["Attribute d6→d8", "5", "Additional Trait (max 2)", "3"],
        ["Attribute d8→d10", "9", "Spell School, needs Focus d6 (max 2)", "4"],
        ["Health: Skirmisher 7 / Frontline 9 / Bulwark 11", "3 / 6 / 10", "Creation Feature (max 1)", "4"],
        ["+2 Daily Reserve (max 5)", "1", "+50 gold (max 4)", "1"],
        ["Armor: light / medium / heavy", "1 / 2 / 3", "Martial weapons · Heavy · Shields", "2 · 1 · 1"],
        ["Arcane Vestments · Armaments", "2 · 2", "Level 1 grants no Talent", "—"],
    ], [176, 74, 190, 72], ss))
    s.append(Spacer(1, 4))

    s.append(Paragraph("Your Turn: 3 Action Points", ss["H"]))
    s.append(Paragraph("Every action costs <b>1 AP — no exceptions</b>. Reserve and Momentum "
                       "spend governs how <i>strong</i> your actions are; AP only governs how "
                       "<i>many</i>.", ss["B"]))
    s.append(Spacer(1, 3))
    s.append(tbl([
        ["Category", "Baseline actions (1 AP each)"],
        ["<b>Attacks</b>", "Basic Attack: 1 Attribute Die (Vigor melee / Agility ranged or Finesse), no cost. Featured Attack: + Reserve/Momentum cost from its Talent or spell entry."],
        ["<b>Defends</b>", "Guard: Impact Rolls against you are Downgraded until your next turn (tunable)."],
        ["<b>Maneuvers</b>", "Move up to Base Speed (repeatable) · Stand from Prone · Disengage (no Opportunity Attacks this turn)."],
        ["<b>Interactions</b>", "Draw/stow a Readied item · retrieve Stowed · use object · treat a wound / extinguish · Scrutinize an illusion."],
        ["<b>Spellcasting</b>", "Cast a spell (+ its Reserve cost by Tier) · drive a Channel (any other AP spent breaks it)."],
    ], [80, 432], ss))
    s.append(Paragraph("<b>Reactions:</b> one per round, regained at the start of your turn — Opportunity Attacks, "
                       "Grab/Redirect/Parry (free hand), Intercept (shield), Reaction spells and Talents. "
                       "<b>Free-Action riders</b> trigger off actions and cost Momentum or Reserve, never AP.", ss["B"]))

    s.append(Paragraph("Impact Rolls — no to-hit, ever", ss["H"]))
    s.append(Paragraph("1) Roll your Impact Pool. 2) Add the dice. 3) Subtract the target's Defense Rating; "
                       "the remainder is damage. <b>Glancing Blow</b> (total ≤ Defense): zero damage, attacker "
                       "gains 1 Momentum. <b>Explosion</b>: a die at maximum rerolls and adds — infinitely. "
                       "<b>Vicious</b>: exploding dice Upgrade one step per cascade. Max <b>one bonus die</b> per "
                       "roll unless a feature says otherwise; extra points Upgrade that bonus die instead.", ss["B"]))
    s.append(tbl([
        ["Die", "d4", "d6", "d8", "d10", "d12"],
        ["Defense (max/2)", "2", "3", "4", "5", "6"],
    ], [100, 60, 60, 60, 60, 60], ss))

    s.append(Paragraph("Momentum", ss["H"]))
    s.append(Paragraph("Personal pool, <b>cap 3</b> (Talents raise it). <b>Resets to 0 when combat starts.</b> "
                       "Generate: your attack Glances +1 · your spell is Saved against +1 · your Task fails by 1–2 "
                       "+1 / by 3+ +2 · plus your generator Talents. Spend (declare before rolling): "
                       "<b>flat</b> — 1 token = +1 to your roll or an ally's within engagement (shareable); "
                       "<b>Talent</b> — effects priced in the Talent's entry, always self-only.", ss["B"]))

    s.append(Paragraph("Cover & Positioning", ss["H"]))
    s.append(Paragraph("<b>Light Cover</b> (1/3 obscured): +1 Vigor/Agility Defense, attacker Downgrades Impact Die. "
                       "<b>Heavy Cover</b> (1/2 obscured): +2, attacker Downgrades whole pool; fully hidden = untargetable. "
                       "Cover never helps against Focus/Resolve attacks. Force damage ignores Cover. Leaving melee reach "
                       "without Disengaging provokes an Opportunity Attack (their Reaction).", ss["B"]))

    s.append(PageBreak())
    s.append(Paragraph("Tasks & Saves", ss["H"]))
    s.append(tbl([
        ["Difficulty", "Target", "Feels like"],
        ["Routine", "3", "Trained people manage it under pressure"],
        ["Challenging", "5", "Demands skill and focus"],
        ["Demanding", "7", "Limit of reliable achievement"],
        ["Extreme", "9", "Legendary careers are made of these"],
    ], [90, 50, 372], ss))
    s.append(Paragraph("Fail by 1–2: near miss, +1 Momentum. Fail by 3+: complication, +2 Momentum. "
                       "Assist: helper rolls vs 3; success Upgrades the actor's die (one helper max). "
                       "Group Task: majority carries. <b>Saves</b> use the same mechanic but are reactive; "
                       "your own failed Save generates nothing — a resisted caster gains 1 Momentum.", ss["B"]))

    s.append(Paragraph("Spell Tiers", ss["H"]))
    s.append(tbl([
        ["Tier", "Reserve", "Impact Dice", "Save Difficulty"],
        ["0", "0", "1 Focus Die", "5"],
        ["1", "1–2 Focus", "1 Focus Die", "5"],
        ["2", "3–4 Focus", "2 Focus Dice", "7"],
        ["3", "5–6 Focus", "3 Focus Dice", "9"],
    ], [60, 90, 110, 252], ss))
    s.append(Paragraph("Sustained: 1 Focus at the start of your turns + Concentration Save when damaged "
                       "(Focus Die vs 5 + 2×tier). Channeled: 1 AP each turn; any other action breaks it.", ss["B"]))

    s.append(Paragraph("Conditions (one-liners)", ss["H"]))
    s.append(tbl([
        ["<b>Dazed</b> no Reactions; next Impact Die Downgraded", "<b>Sundered</b> −1 to a named Defense (stacks, floor 0)"],
        ["<b>Bleeding</b> 2 True Damage/turn until treated (1 AP)", "<b>Burning</b> stated Fire damage/turn until doused (1 AP)"],
        ["<b>Restrained</b> Speed 0; attacks vs you Upgraded", "<b>Grappled</b> Speed 0; 1 AP + Vigor Save 5 to break"],
        ["<b>Prone</b> Speed 0 until you stand (1 AP); melee vs you Upgraded, ranged Downgraded", "<b>Slowed</b> Speed reduced; no Speed bonuses"],
        ["<b>Blinded</b> your Impact Rolls Downgraded; no Cover", "<b>Silenced</b> no speech, no Verbal spells"],
        ["<b>Frightened</b> Downgraded vs source; can't approach it", "<b>Exhausted</b> all four Attribute Dice Downgraded"],
        ["<b>Invisible/Concealed</b> attacks vs you Downgraded", "<b>Hidden</b> untargetable by single-target attacks"],
        ["<b>Incapacitated</b> no actions, movement, or speech", "<b>Marked</b> source's allies gain the stated benefit"],
    ], [256, 256], ss, header=False))

    s.append(Paragraph("Dying, Healing, Resting", ss["H"]))
    s.append(Paragraph("<b>0 HP:</b> Incapacitated; Vigor Save vs 5 each turn — three successes stabilize, three "
                       "failures kill, a max roll that Explodes puts you up at 1 HP. Any healing brings you back up. "
                       "<b>Short Rest</b> (30 min + supplies): heal a Vigor Die roll. <b>Long Rest</b> (6h + 2h light): "
                       "full HP and all Reserves; Decay cleansed.", ss["B"]))
    doc.build(s)
    return path

# ---------------------------------------------------------------- pre-built paths

PATHS = [
    {
        "name": "THE RECKONING — a Berserker's path",
        "concept": "Frontline fury. You want enemies swinging at you, because every attack that "
                   "comes your way is fuel, and every drop of your own blood is a promise.",
        "tier": "Frontline (9 + Vigor max HP)",
        "creation": "Vigor d6 (3) · Resolve d6 (3) · Frontline (6) · Martial weapons (2) · Medium armor (2) · Shields (1) · Specialty: Intimidation (2) · +50g (1) = 20 CP",
        "dice": "Vigor d6 · Resolve d6 · Agility d4 · Focus d4",
        "traits": "Heavy-Handed, Steel-Nerved",
        "gear": "Heavy cleaver (Vicious) or war-axe & shield · medium armor (or war-paint for "
                "Unarmored Bulwark later) · javelins · explorer's pack",
        "increases": "L3 Vigor→d8 · L5 Vigor→d10 · L7 Resolve→d8 · L9 Agility→d6",
        "talents": [
            ("2", "Primal Fury", "Momentum when enemies target you; emergency temp HP."),
            ("4", "Crimson Tide", "Below half HP, every melee attack rolls a bonus Vigor Die."),
            ("6", "Retributive Strike", "2 Momentum: answer a melee hit with an Upgraded attack."),
            ("8", "Crimson Rampage", "Kills chain into free movement and another attack."),
            ("10", "Relentless", "Once per combat, refuse to drop; full Momentum, auto-Explosion."),
        ],
        "play": ["Wade in and spend AP on attacks — your Momentum arrives when enemies answer.",
                 "Furious Strike (swap a pick, or grab it in another campaign) and flat spends "
                 "turn glancing rounds into kills; hold 2 tokens for Retributive Strike.",
                 "Below half HP you get stronger, not weaker. Trust the tide."],
    },
    {
        "name": "THE EQUATION — an Arcanist's path",
        "concept": "Magic as engineering. You spend Focus like a budget, weave modifications into "
                   "every casting, and treat each Explosion as compounding interest.",
        "tier": "Adept (5 + Vigor max HP)",
        "creation": "Focus d8 (8) · Agility d6 (3) · Adept (0) · School of Evocation (4) · Arcane Armaments (2) · Arcane Vestments (2) · +50g (1) = 20 CP",
        "dice": "Focus d6 · Agility d6 · Vigor d4 · Resolve d4",
        "traits": "Quick-Witted, Perceptive",
        "gear": "Arcane Vestments · a Conduit staff or wand · formulary & scholar's pack",
        "increases": "L3 Focus→d8 · L5 Focus→d10 · L7 Agility→d8 · L9 Vigor→d6",
        "talents": [
            ("2", "School of Evocation", "Tier 0 element bolts now; Tiers 2/3 unlock at 5 and 9."),
            ("4", "Spell Weaving", "1 Momentum riders: double range, or Sunder Agility Defense."),
            ("6", "Aetheric Siphon", "Every spell Explosion pays you 1 Momentum."),
            ("8", "Advanced Weaving", "Vicious and knockback Weaves join the toolkit."),
            ("10", "Master of the Weave", "Two Weaves per spell, one of them free each turn."),
        ],
        "play": ["Open with cheap Tier 1 spells to bait Explosions; Siphon converts them to Momentum.",
                 "Weave-Sunder a target, then pour your big Tier 2 into the softened defense.",
                 "Keep 2 Focus in reserve for the round that matters — overspending early is how "
                 "Adepts die."],
    },
    {
        "name": "THE LONG WATCH — a Stalker's path",
        "concept": "Patience made lethal. Mark the kill, control the angles, and let the quarry "
                   "spend its whole life walking into the one moment you prepared.",
        "tier": "Skirmisher (7 + Vigor max HP)",
        "creation": "Agility d6 (3) · Focus d6 (3) · Skirmisher (3) · Martial weapons (2) · Light armor (1) · Specialties: Tracking, Survival (4) · Battle Sense (4) = 20 CP",
        "dice": "Agility d6 · Focus d6 · Vigor d4 · Resolve d4",
        "traits": "Agile, Streetwise",
        "gear": "Hunter's bow & arrows or paired hunting blades (Finesse) · cured hides · "
                "stalker's kit (caltrops, tripwire, smoke) · field pack",
        "increases": "L3 Agility→d8 · L5 Agility→d10 · L7 Focus→d8 · L9 Vigor→d6",
        "talents": [
            ("2", "Marked Quarry", "Always know where it is; Upgraded attacks against it."),
            ("4", "Hunter's Instinct", "Momentum from exploiting cover, surprise, and conditions."),
            ("6", "Visceral Quarry", "Once a round, a hit on your Quarry is all True Damage."),
            ("8", "Apex Predator", "Your Quarry cannot run, hide, or vanish from you."),
            ("10", "One With the Wastes", "Move at full speed Hidden; kills refill Momentum."),
        ],
        "play": ["Mark before you shoot. Two stacked Upgrades on round one is your baseline.",
                 "Fight from Cover — it feeds Hunter's Instinct and starves the enemy's math.",
                 "Save the Visceral declaration for the turn their Defense would blunt you most."],
    },
]

def prebuilt_paths():
    path = os.path.join(OUT, "prebuilt_paths.pdf")
    ss = styled()
    doc = SimpleDocTemplate(path, pagesize=letter, topMargin=0.55 * inch,
                            bottomMargin=0.55 * inch, leftMargin=0.6 * inch,
                            rightMargin=0.6 * inch, title="Pre-Built Paths")
    s = []
    s.append(Paragraph("[GAME NAME] — THREE PRE-BUILT PATHS", ss["Title"]))
    s.append(Paragraph("Paths are <b>guidance, not rules</b>. Each is a complete plan from creation to "
                       "Level 10; swap any pick for any Talent whose gates you meet. Level 1 is the "
                       "pre-Talent baseline — your dice, tier, and traits carry you until Level 2. "
                       "All numbers marked (tunable) in the rules are playtest targets.", ss["B"]))
    for i, p in enumerate(PATHS):
        s.append(Spacer(1, 10))
        s.append(Paragraph(p["name"], ss["H"]))
        s.append(Paragraph("<i>" + p["concept"] + "</i>", ss["B"]))
        s.append(Spacer(1, 4))
        s.append(tbl([
            ["Health Tier", p["tier"], "Starting Dice", p["dice"]],
            ["Traits", p["traits"], "Die Increases", p["increases"]],
            ["Gear", p["gear"], "", ""],
        ], [65, 191, 75, 181], ss, header=False))
        s.append(Spacer(1, 3))
        s.append(tbl([["Creation spend (20 CP)", p["creation"]]], [110, 402], ss, header=False))
        s.append(Spacer(1, 4))
        s.append(tbl([["Lv", "Talent", "Why"]] +
                     [[lv, "<b>%s</b>" % t, why] for lv, t, why in p["talents"]],
                     [28, 130, 354], ss))
        s.append(Spacer(1, 4))
        for line in p["play"]:
            s.append(Paragraph("• " + line, ss["B"]))
        if i < len(PATHS) - 1:
            s.append(PageBreak() if i == 0 else Spacer(1, 6))
    doc.build(s)
    return path

if __name__ == "__main__":
    for fn in (character_sheet, quick_reference, prebuilt_paths):
        print("wrote", fn())
