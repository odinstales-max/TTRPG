#!/usr/bin/env python3
"""Fail if any id or name is duplicated across data/ (including data/talents/)."""
import json, glob, sys, collections, os

paths = sorted(glob.glob("data/**/*.json", recursive=True))
ids, names, where = collections.Counter(), collections.Counter(), collections.defaultdict(list)
for path in paths:
    rows = json.load(open(path, encoding="utf-8"))
    if not isinstance(rows, list):
        continue
    for row in rows:
        if "id" not in row or "name" not in row:
            continue
        ids[row["id"]] += 1
        names[row["name"].strip().lower()] += 1
        where[row["id"]].append(path)

bad = sorted({k for k, v in list(ids.items()) + list(names.items()) if v > 1})
if bad:
    print("duplicates:", bad)
    for k in bad:
        if k in where:
            print(f"  {k}: {', '.join(where[k])}")
    sys.exit(1)
print(f"ok: no duplicates ({len(paths)} files, {sum(ids.values())} entries)")
