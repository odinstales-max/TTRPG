#!/usr/bin/env python3
"""Render data/talents/*.json into readable Markdown.

The JSON is the source of truth; this is the human-readable view of it.
    python scripts/render_talents.py            # all regions -> docs/TALENTS.md
    python scripts/render_talents.py fury       # one region, printed to stdout
"""
import json, glob, os, sys

TIER_ORDER = {"minor": 0, "major": 1, "signature": 2, "keystone": 3}
TIER_LABEL = {"minor": "Minor", "major": "Major",
              "signature": "Signature", "keystone": "Keystone"}


def cost_line(t):
    bits = []
    ap = t.get("ap_cost")
    if ap == "1":
        bits.append("1 AP")
    elif ap == "reaction":
        bits.append("Reaction")
    elif ap == "free" and "passive" in (t.get("tags") or []):
        bits.append("passive")
    elif ap == "free":
        bits.append("Free effect")
    m = t.get("momentum_cost") or 0
    if m:
        bits.append(f"{m} Momentum")
    r = t.get("reserve_cost")
    if r:
        bits.append(f"{r['amount']} {r['attr'].title()} Point" + ("s" if r["amount"] != 1 else ""))
    if not bits:
        bits.append("no cost")
    return " · ".join(bits)


def gate_line(t, by_id):
    a = t.get("attr_req") or {}
    gate = f"{a.get('attr','?').title()} {a.get('die','?')}"
    pre = [by_id.get(p, {}).get("name", p) for p in (t.get("prereq_ids") or [])]
    if pre:
        gate += " + " + ", ".join(pre)
    return gate


def render_region(rows, region):
    by_id = {r["id"]: r for r in rows}
    rows = sorted(rows, key=lambda r: (TIER_ORDER.get(r["tier"], 9), r["name"]))
    counts = {}
    for r in rows:
        counts[r["tier"]] = counts.get(r["tier"], 0) + 1
    summary = " · ".join(f"{counts.get(k,0)} {TIER_LABEL[k]}" for k in TIER_ORDER if counts.get(k))

    out = [f"## Region: `{region}`", "", f"*{len(rows)} nodes — {summary}*", ""]
    current = None
    for t in rows:
        if t["tier"] != current:
            current = t["tier"]
            out += [f"### {TIER_LABEL[current]}", ""]
        out += [
            f"**{t['name']}**  ",
            f"*{gate_line(t, by_id)} — {cost_line(t)}*",
            "",
            f"> {t['text']}",
            "",
        ]
    return "\n".join(out)


def main():
    want = sys.argv[1] if len(sys.argv) > 1 else None
    files = sorted(glob.glob("data/talents/*.json"))
    if not files:
        print("no region files in data/talents/")
        return 1

    chunks, total = [], 0
    for f in files:
        region = os.path.basename(f)[:-5]
        if want and region != want:
            continue
        rows = json.load(open(f, encoding="utf-8"))
        total += len(rows)
        chunks.append(render_region(rows, region))

    if not chunks:
        print(f"no region named {want!r}")
        return 1

    body = "\n\n---\n\n".join(chunks)
    if want:
        print(body)
        return 0

    header = ("# Talent Web — readable view\n\n"
              "Generated from `data/talents/*.json` by `scripts/render_talents.py`. "
              "The JSON is the source of truth; edit that, then regenerate this.\n\n"
              f"**{total} nodes across {len(chunks)} regions.**\n")
    os.makedirs("docs", exist_ok=True)
    with open("docs/TALENTS.md", "w", encoding="utf-8", newline="\n") as fh:
        fh.write(header + "\n" + body + "\n")
    print(f"wrote docs/TALENTS.md — {total} nodes, {len(chunks)} regions")
    return 0


if __name__ == "__main__":
    sys.exit(main())
