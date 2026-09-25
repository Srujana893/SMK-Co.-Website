#!/usr/bin/env python3
"""Stage 0 regression metrics for the SMK & Co. site. Read-only.
Run from the repo root:  python3 baseline/metrics.py > baseline/metrics.json
Every later stage re-runs this and diffs against the committed baseline."""
import os, re, json, subprocess
from collections import OrderedDict

ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["index.html","about.html","team.html","services.html","blog.html","contact.html","careers.html"]
CSS   = ["css/styles.css","css/home.css","css/system.css","css/careers.css"]
JS    = ["js/site.js","js/config.js","js/blog.js","js/team.js","image-slot.js"]

rd = lambda p: open(os.path.join(ROOT, p), encoding="utf-8", errors="replace").read()
html = {p: rd(p) for p in PAGES}
css  = {p: rd(p) for p in CSS if os.path.exists(os.path.join(ROOT, p))}
jsrc = {p: rd(p) for p in JS  if os.path.exists(os.path.join(ROOT, p))}
all_html, all_css, all_js = "\n".join(html.values()), "\n".join(css.values()), "\n".join(jsrc.values())
inline_js    = "\n".join(re.findall(r"<script[^>]*>(.*?)</script>", all_html, flags=re.S))
inline_style = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>",  all_html, flags=re.S | re.I))
out = OrderedDict()

# --- CSS class selectors: declared vs referenced -----------------------------
def sels(s):
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.S)
    depth, buf, res = 0, [], []
    for c in s:
        if c == "{":
            if depth == 0: res.append("".join(buf))
            buf, depth = [], depth + 1
        elif c == "}": depth, buf = max(0, depth - 1), []
        elif depth == 0: buf.append(c)
    return res

CR = re.compile(r"\.(-?[_A-Za-z][-_A-Za-z0-9]*)")
declared = {f: {m.group(1) for s in sels(src) if s.strip() and not s.strip().startswith("@")
                for m in CR.finditer(s)} for f, src in css.items()}

used = set()                                    # HTML class attributes ...
for src in html.values():
    for m in re.finditer(r'class\s*=\s*"([^"]*)"', src): used.update(m.group(1).split())
    for m in re.finditer(r"class\s*=\s*'([^']*)'", src): used.update(m.group(1).split())
jsall = all_js + "\n" + inline_js               # ... plus JS *string literals* only
for lit in (re.findall(r'"([^"\n]{0,300})"', jsall) + re.findall(r"'([^'\n]{0,300})'", jsall)
            + re.findall(r"`([^`]{0,1500})`", jsall, flags=re.S)):
    used.update(re.findall(r"[-_A-Za-z][-_A-Za-z0-9]*", lit))

per, dead_by_file = [], {}
for f in css:
    d = sorted(n for n in declared[f] if n not in used)
    dead_by_file[f] = d
    per.append([f, len(declared[f]), len(d)])
uniq = set().union(*declared.values()) if declared else set()
out["css_selectors"] = {"per_file": per, "sum_of_files": sum(p[1] for p in per),
                        "dead_sum": sum(p[2] for p in per), "unique": len(uniq),
                        "dead_unique": len([n for n in uniq if n not in used])}
out["_dead_by_file"] = dead_by_file

# --- content tics ------------------------------------------------------------
def vis(s):
    s = re.sub(r"<script.*?</script>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<style.*?</style>",   " ", s, flags=re.S | re.I)
    s = re.sub(r"<!--.*?-->",          " ", s, flags=re.S)
    return re.sub(r"<[^>]+>", " ", s)

ordre = re.compile(r"(?<![\d/.:-])0[1-9](?![\d%])")
ARROW = re.compile(r"→|&rarr;|&#8594;|&#x2192;")
o = {p: len(ordre.findall(vis(s))) for p, s in html.items()}
a = {p: len(ARROW.findall(vis(s))) for p, s in html.items()}
out["ordinals"] = {"per_page": o, "total": sum(o.values())}
out["arrows"]   = {"per_page": a, "total": sum(a.values()),
                   "css_pseudo_element_arrows": len(re.findall(r'content\s*:\s*"→"', all_css))}

# --- motion ------------------------------------------------------------------
motion = all_css + "\n" + inline_style
TIME   = re.compile(r"(\d*\.?\d+)\s*(ms|s)\b")
to_ms  = lambda v, u: float(v) * (1000 if u == "s" else 1)
td = re.findall(r"transition(?:-duration)?\s*:[^;{}]*", motion)
ad = re.findall(r"animation(?:-duration)?\s*:[^;{}]*",  motion)
out["motion"] = {
    "transition_declarations": len(td),
    "distinct_durations": len({to_ms(v, u) for d in td for v, u in TIME.findall(d)}),
    "durations_ms": sorted({to_ms(v, u) for d in td for v, u in TIME.findall(d)}),
    "animation_declarations": len(ad),
    "keyframes_css": sorted(set(re.findall(r"@keyframes\s+([A-Za-z_-]+)", all_css))),
    "keyframes_inline": sorted(set(re.findall(r"@keyframes\s+([A-Za-z_-]+)", inline_style))),
    "keyframes_inline_occurrences": len(re.findall(r"@keyframes", inline_style)),
    "easings": sorted(set(re.findall(r"cubic-bezier\([^)]*\)", motion))
                      | set(re.findall(r"(?:transition|animation)[^;{}]*?\b(linear|ease-in-out|ease-in|ease-out|ease)\b", motion))),
    "data_reveal": len(re.findall(r"data-reveal", all_html)),
    "reduced_motion_guards": len(re.findall(r"prefers-reduced-motion", motion))}

# --- inline styles, names, assets, headings ----------------------------------
inl = {p: len(re.findall(r'\sstyle\s*=\s*["\']', s)) for p, s in html.items()}
out["inline_style_attrs"] = {"per_page": inl, "total": sum(inl.values()),
    "values": sorted(set(re.findall(r'\sstyle\s*=\s*"([^"]*)"', all_html)))}

out["firm_names"] = {"counts": {
    "SMK & Co":                   len(re.findall(r"SMK\s*&(?:amp;)?\s*Co", all_html)),
    "Sachin Mahendra Kiran & Co": len(re.findall(r"Sachin\s+Mahendra\s+Kiran\s*&(?:amp;)?\s*Co", all_html)),
    "Sachin Mahendra & Co":       len(re.findall(r"Sachin\s+Mahendra\s*&(?:amp;)?\s*Co(?!\w)", all_html))},
    "titles": {p: re.search(r"<title>(.*?)</title>", s, re.S).group(1).strip()
               for p, s in html.items() if re.search(r"<title>", s)}}

refs = all_html + all_css + all_js + (open(os.path.join(ROOT, "assets/site.webmanifest"),
        encoding="utf-8").read() if os.path.exists(os.path.join(ROOT, "assets/site.webmanifest")) else "")
def du(p):
    d = os.path.join(ROOT, p)
    return int(subprocess.check_output(["du", "-sk", d]).split()[0]) * 1024 if os.path.isdir(d) else 0
def lsd(p):
    d = os.path.join(ROOT, p)
    return [f for f in sorted(os.listdir(d)) if f != ".DS_Store"] if os.path.isdir(d) else []
up, asr = lsd("uploads"), lsd("assets")
out["assets"] = {
    "uploads_bytes": du("uploads"), "uploads_files": len(up),
    "uploads_unreferenced": [f for f in up if f not in refs],
    "assets_bytes": du("assets"), "assets_files": len(asr),
    "assets_unreferenced": [f for f in asr if f not in refs],
    "referenced_but_missing": sorted({m for m in re.findall(r'(?:href|src)\s*=\s*"((?:assets|uploads|css|js)/[^"]+)"', all_html)
                                      if not os.path.exists(os.path.join(ROOT, m.split("?")[0]))}),
    "image_slots_state_bytes": os.path.getsize(os.path.join(ROOT, "image-slots.state.json"))}

hd = {}
for p, s in html.items():
    lv, sk, prev = [int(m) for m in re.findall(r"<h([1-6])\b", re.sub(r"<script.*?</script>", " ", s, flags=re.S | re.I), re.I)], [], 0
    for l in lv:
        if prev and l > prev + 1: sk.append(f"h{prev}->h{l}")
        prev = l
    hd[p] = {"counts": {f"h{i}": lv.count(i) for i in range(1, 7) if lv.count(i)}, "skips": sk}
out["headings"] = hd

out["fingerprints"] = {
    "data_screen_label": len(re.findall(r"data-screen-label", all_html)),
    "border_radius_declarations": len(re.findall(r"border-radius\s*:", all_css)),
    "distinct_radius_values": sorted({v.strip() for v in re.findall(r"border-radius\s*:\s*([^;{}]+)", all_css)}),
    "border_declarations": len(re.findall(r"\bborder[a-z-]*\s*:", all_css)),
    "image_slot_elements": len(re.findall(r"<image-slot", all_html)),
    "internal_links_with_dot_html": len(re.findall(r'href="(?!http)[^"#?]*\.html', all_html)),
    "chrome_lines_header_footer": sum(m.group(0).count("\n") + 1 for s in html.values()
        for m in list(re.finditer(r"<header[\s\S]*?</header>", s)) + list(re.finditer(r"<footer[\s\S]*?</footer>", s)))}

out["sizes"] = {"html_bytes": {p: os.path.getsize(os.path.join(ROOT, p)) for p in PAGES},
                "css_bytes":  {p: os.path.getsize(os.path.join(ROOT, p)) for p in css},
                "css_total":  sum(os.path.getsize(os.path.join(ROOT, p)) for p in css),
                "js_bytes":   {p: os.path.getsize(os.path.join(ROOT, p)) for p in jsrc}}

hexes = re.findall(r"#[0-9A-Fa-f]{3,8}\b", all_css)
out["colour"] = {"hex_literals": len(hexes), "distinct_hex": len({h.upper() for h in hexes}),
                 "rgb_functions": len(re.findall(r"rgba?\([^)]*\)", all_css)),
                 "rgba_2F6FA3_untokenised": len(re.findall(r"rgba\(\s*47\s*,\s*111\s*,\s*163", all_css))}

print(json.dumps(out, indent=2, default=str))
