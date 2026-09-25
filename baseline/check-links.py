#!/usr/bin/env python3
"""Resolve every internal link the way the Caddyfile would, and check the target
exists. Also checks that every #fragment has a matching id on the target page.

    python3 baseline/check-links.py

Caddy rules applied:  redir /index.html -> / ;  redir /foo.html -> /foo ;
try_files {path} {path}.html ;  file_server (a directory serves its index.html).
"""
import os, re, sys

ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = [f for f in sorted(os.listdir(ROOT)) if f.endswith(".html")]

def resolve(url):
    """-> (path on disk or None, note)"""
    path = url.split("#")[0].split("?")[0]
    if not path:
        return None, "fragment-only"
    if path.endswith(".html"):
        return None, "still written with .html — Caddy will 301 it"
    p = path.lstrip("/")
    if p in ("", "/"):
        p = "index.html"
    full = os.path.join(ROOT, p)
    if os.path.isdir(full):
        full = os.path.join(full, "index.html")
    if os.path.exists(full):
        return full, ""
    if os.path.exists(full + ".html"):
        return full + ".html", ""
    return None, "404"

ids = {}
for f in PAGES:
    src = open(os.path.join(ROOT, f), encoding="utf-8").read()
    ids[f] = set(re.findall(r'\sid="([^"]+)"', src))

# Fragments served by JS rather than by a static id. team.html injects partner
# profiles from a script, so #sachin / #mahendra / #kiran resolve at runtime but
# not in the markup -- which is also why they are invisible to search. Stage 7
# gives each partner a real URL; delete this list then.
JS_ROUTED = {("team.html", "sachin"), ("team.html", "mahendra"), ("team.html", "kiran")}

problems, checked, waived = [], 0, 0
for f in PAGES:
    src = open(os.path.join(ROOT, f), encoding="utf-8").read()
    for attr, url in re.findall(r'\b(href|src)="([^"]+)"', src):
        if re.match(r"^(https?:|mailto:|tel:|data:|//)", url):
            continue
        checked += 1
        if url.startswith("#"):
            if url[1:] not in ids[f]:
                problems.append((f, url, "no element with that id on this page"))
            continue
        target, note = resolve(url)
        if target is None:
            problems.append((f, url, note)); continue
        if "#" in url:
            frag = url.split("#", 1)[1]
            tgt = os.path.basename(target)
            if tgt.endswith(".html") and frag not in ids.get(tgt, set()):
                if (tgt, frag) in JS_ROUTED:
                    waived += 1
                else:
                    problems.append((f, url, f"no id '{frag}' on {tgt}"))

print(f"checked {checked} internal references across {len(PAGES)} pages"
      + (f"  ({waived} JS-routed fragments waived)" if waived else ""))
if problems:
    print(f"\n{len(problems)} problem(s):")
    for f, url, why in problems:
        print(f"  {f:16s} {url:34s} {why}")
    sys.exit(1)
print("all internal links resolve")
