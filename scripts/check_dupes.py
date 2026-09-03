#!/usr/bin/env python3
"""Fail if any id or name is duplicated across data/*.json."""
import json, glob, sys, collections
ids, names = collections.Counter(), collections.Counter()
for path in glob.glob("data/*.json"):
    for row in json.load(open(path)):
        ids[row["id"]] += 1; names[row["name"].strip().lower()] += 1
bad = [k for k, v in list(ids.items()) + list(names.items()) if v > 1]
print("duplicates:", bad) if bad else print("ok: no duplicates")
sys.exit(1 if bad else 0)
