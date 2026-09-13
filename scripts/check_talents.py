#!/usr/bin/env python3
"""Validate data/talents/*.json against Design Lock v5 and docs/CONVERSION_STANDARD.md.

    python scripts/check_talents.py           # all regions
    python scripts/check_talents.py fury      # one region
Exit 1 on any failure.
"""
import json, glob, os, re, sys, collections

FIELDS = {"id", "name", "region", "tier", "attr_req", "prereq_ids", "momentum_cost",
          "reserve_cost", "ap_cost", "tags", "source_class", "text"}
TIERS = {"minor", "major", "signature", "keystone"}
ATTRS = {"vigor", "agility", "focus", "resolve"}
ROLES = {"generator", "burst", "mitigation", "mobility", "control", "sustain", "support"}
TAGS = ROLES | {
    "momentum", "upgrade", "downgrade", "explosion", "sunder", "glancing-blow",
    "passive", "reaction", "free-rider", "once-per-combat",
    "prone", "dazed", "bleeding", "restrained", "blinded", "slowed", "frightened",
    "marked", "burning", "grappled",
}
# CONVERSION_STANDARD section 1: momentum / reserve ceilings per tier
BUDGET = {"minor": (1, 0), "major": (2, 1), "signature": (3, 2), "keystone": (3, 2)}

# Text smells the owner called out in the fury review
META = re.compile(r"(deliberate exception|Bonus Impact Dice rule|this is because|the reason|"
                  r"rather than competing|not a bigger die|as ever,)", re.I)
FIXED_DIFF = re.compile(r"Difficulty\s+\d|against\s+Difficulty", re.I)


def check(path):
    errs, warns = [], []
    region = os.path.basename(path)[:-5]
    rows = json.load(open(path, encoding="utf-8"))
    by_tier = collections.Counter(r.get("tier") for r in rows)
    ids = {r.get("id") for r in rows}

    for r in rows:
        rid = r.get("id", "<no id>")
        if set(r) != FIELDS:
            errs.append(f"{rid}: field mismatch extra={sorted(set(r)-FIELDS)} missing={sorted(FIELDS-set(r))}")
            continue
        if r["region"] != region:
            errs.append(f"{rid}: region '{r['region']}' != file '{region}'")
        if r["tier"] not in TIERS:
            errs.append(f"{rid}: bad tier {r['tier']}")
            continue
        if r["ap_cost"] not in ("1", "free", "reaction"):
            errs.append(f"{rid}: bad ap_cost {r['ap_cost']!r}")

        a = r["attr_req"]
        if a.get("attr") not in ATTRS:
            errs.append(f"{rid}: bad attr {a.get('attr')}")
        want = "d12" if r["tier"] == "keystone" else "d6"
        if a.get("die") != want:
            errs.append(f"{rid}: {r['tier']} must gate {want}, got {a.get('die')}")

        bad_tags = sorted(set(r["tags"]) - TAGS)
        if bad_tags:
            errs.append(f"{rid}: invented tags {bad_tags}")
        if len(set(r["tags"]) & ROLES) != 1:
            errs.append(f"{rid}: needs exactly one Role tag, has {sorted(set(r['tags']) & ROLES)}")

        mmax, rmax = BUDGET[r["tier"]]
        m = r["momentum_cost"] or 0
        if not isinstance(m, int) or m > mmax:
            errs.append(f"{rid}: momentum_cost {m} over the {r['tier']} budget of {mmax}")
        rc = r["reserve_cost"]
        if rc:
            if set(rc) != {"attr", "amount"} or rc["attr"] not in ATTRS:
                errs.append(f"{rid}: malformed reserve_cost {rc}")
            elif rc["amount"] > rmax:
                errs.append(f"{rid}: reserve {rc['amount']} over the {r['tier']} budget of {rmax}")

        for p in r["prereq_ids"]:
            if p not in ids:
                errs.append(f"{rid}: dangling prereq {p}")
        if r["tier"] in ("minor", "major") and r["prereq_ids"]:
            errs.append(f"{rid}: {r['tier']} must have no prerequisite (siblings, not children)")
        if r["tier"] == "keystone":
            sig = [x["id"] for x in rows if x["tier"] == "signature"]
            if r["prereq_ids"] != sig:
                errs.append(f"{rid}: keystone must require the region Signature {sig}")

        if META.search(r["text"]):
            errs.append(f"{rid}: design-rationale text aimed at the reader")
        if FIXED_DIFF.search(r["text"]):
            errs.append(f"{rid}: fixed Save Difficulty in text — write the Save open")
        n = len(re.findall(r"[.!?]", r["text"]))
        if n > 5:
            warns.append(f"{rid}: {n} sentences — standard asks for 2-4")

    if by_tier["minor"] != 1:
        errs.append(f"region needs exactly 1 Minor, has {by_tier['minor']}")
    if by_tier["signature"] != 1:
        errs.append(f"region needs exactly 1 Signature, has {by_tier['signature']}")
    if by_tier["keystone"] != 1:
        errs.append(f"region needs exactly 1 Keystone, has {by_tier['keystone']}")
    if by_tier["major"] < 3:
        errs.append(f"Major floor is 3, has {by_tier['major']}")
    elif by_tier["major"] < 5:
        warns.append(f"{by_tier['major']} Majors — target is 5-6, gap pass may be needed")

    gens = [r["id"] for r in rows if "generator" in r.get("tags", [])]
    if len(gens) > 1:
        errs.append(f"region has {len(gens)} Generators, max 1: {gens}")
    for g in gens:
        if next(r for r in rows if r["id"] == g)["tier"] != "major":
            errs.append(f"{g}: a Generator must be a Major")
    return region, len(rows), errs, warns


def main():
    want = sys.argv[1] if len(sys.argv) > 1 else None
    files = sorted(glob.glob("data/talents/*.json"))
    if want:
        files = [f for f in files if os.path.basename(f)[:-5] == want]
    if not files:
        print("no region files found")
        return 1
    total_err = 0
    for f in files:
        region, n, errs, warns = check(f)
        status = "FAIL" if errs else "ok"
        print(f"[{status}] {region}: {n} nodes")
        for e in errs:
            print(f"    ERROR {e}")
        for w in warns:
            print(f"    warn  {w}")
        total_err += len(errs)
    print()
    print("FAILED" if total_err else "all regions conform")
    return 1 if total_err else 0


if __name__ == "__main__":
    sys.exit(main())
