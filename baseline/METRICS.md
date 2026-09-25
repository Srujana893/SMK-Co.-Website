# Baseline metrics — 25 Sep 2026

Measured from the working tree on `redesign/stage-0-baseline`, before any
redesign change. Reproduce with `python3 baseline/metrics.py`.

## Headline numbers

| Metric | Audit §10 | Measured | |
| --- | --- | --- | --- |
| CSS class selectors declared | 378 | **371** unique (435 counting cross-file redefinitions) | ↓7 |
| Unreferenced selectors | 139 | **122** unique (136 per-file) | ↓17 |
| Visible `01` / `02` ordinals | 91 | **91** | = |
| `→` arrows | 91 | **91** (89 in markup + 2 CSS `content` rules) | = |
| Distinct transition durations | 19 | **16** | ↓3 |
| Inline `style` attributes | 18 | **18** | = |
| Firm names in circulation | 3 | **3** | = |
| Unreferenced `uploads/` | 18 MB | **17.6 MB**, 11 files | = |

Three lines differ from the audit. The selector counts differ because this
script treats a class named in a JS *string literal* as used, where the audit
counted any identifier; that is the stricter, safer test for Stage 5, so these
are the numbers the deletion gate runs against. The duration count differs
because this script normalises `.25s` and `250ms` to the same value. All three
deltas make the target easier, not harder.

## CSS

| Stylesheet | Bytes | Selectors | Unreferenced | Share |
| --- | --- | --- | --- | --- |
| `css/styles.css` | 47,587 | 216 | 94 | 44% |
| `css/home.css` | 17,533 | 81 | 7 | 9% |
| `css/system.css` | 15,659 | 92 | 35 | 38% |
| `css/careers.css` | 9,644 | 46 | 0 | 0% |
| **Total** | **90,423** | 435 / 371 unique | 136 / 122 unique | 33% |

Stage 5 target: 45–55 KB. The per-file worklist is `dead-selectors.json`.

## Colour

63 hex literals, 25 distinct · 46 `rgb()`/`rgba()` functions · `rgba(47,111,163,…)`
appears **16** times with no token behind it. Stage 2 target: zero colour
literals outside `tokens.css`.

## Type and headings

| Page | h1 | h2 | h3 | h4 | h5 | Level skips |
| --- | --- | --- | --- | --- | --- | --- |
| index | 1 | 6 | 9 | 2 | 3 | h2→h4, h2→h5 |
| about | **0** | 2 | 6 | — | 3 | h3→h5 |
| team | 1 | **0** | 3 | — | 3 | h1→h3, h3→h5 |
| services | **0** | 3 | 10 | 3 | 3 | h2→h4, h2→h5 |
| blog | 1 | **0** | — | — | 3 | h1→h5 |
| contact | **0** | 1 | — | 2 | 3 | h2→h4 |
| careers | 1 | 6 | 11 | 5 | 3 | h2→h4 ×2 |

Three pages have no `<h1>`. Every page skips at least one level; the `h5` in
every row is the footer. Stage 3 gate: exactly one `<h1>` per page, largest
element on the page, zero skips.

## Motion

85 `transition` declarations · 16 distinct durations
(100, 160, 200, 220, 250, 260, 280, 300, 340, 350, 400, 420, 450, 500, 600, 700 ms) ·
30 `animation` declarations · 4 easings (`cubic-bezier(.22,.61,.36,1)`, `ease`,
`ease-in-out`, `linear`) · 66 `[data-reveal]` elements · 10 `prefers-reduced-motion`
guards.

`@keyframes`: 4 in stylesheets (`crfade`, `hxfade`, `smkFade`, `smkIn`) and 4
inline (`dash`, `drift`, `pulse`, `spin`) — shipped 12 times, because all four
are pasted into about, contact **and** services while only services has an
element that uses them.

Stage 10 target: 3 durations, 1 easing, ≤1 `[data-reveal]` per page.

## Inline styles — all 18

`font-size: 37px` ×4 · `font-size: 37px; font-family: Georgia` · `font-family:
"Cormorant Garamond"; font-size: 37px` · `transform-origin:180px 180px` ·
`grid-column:1/-1` · `margin-top:1.1rem;margin-bottom:2rem` · `margin-top:1.2rem` ·
`margin-top:1.4rem` · `padding-top:0` · `text-align: left` · `display:none`.

Neither Georgia nor Cormorant Garamond is loaded. Stage 1/3 target: zero.

## Names

| Variant | Occurrences |
| --- | --- |
| SMK & Co | 41 |
| Sachin Mahendra Kiran & Co | 8 |
| Sachin Mahendra & Co | 8 |

`<title>` tags: index, team, careers use *SMK & Co*; about, services, blog,
contact use *Sachin Mahendra & Co* — the variant that omits a named partner.
**Blocked on a decision.**

## Assets

`uploads/` 18,481,152 bytes across 12 files — **11 referenced by nothing**
(only `.gitkeep` is excluded from that count) ·
`assets/` 925,696 bytes across 14 files, **9 referenced by nothing** ·
`image-slots.state.json` 892,527 bytes of base64 WebP ·
`assets/favicon.png` is referenced by 3 pages and **does not exist** ·
18 empty `<image-slot>` elements.

## Structure

557 lines of duplicated `<header>` + `<footer>` markup across 7 pages ·
188 internal links written as `*.html` while Caddy 301-redirects them ·
36 `border-radius` declarations over 9 distinct values
(2px, 3px, 8px, 40px, 50px, 50%, 999px, and two tokens) ·
132 border declarations · 32 `data-screen-label` attributes.

## Page weight and rendered height

| Page | HTML | 390px | 900px | 1440px |
| --- | --- | --- | --- | --- |
| index | 27,439 | 10,260 | 8,055 | 8,336 |
| careers | 24,202 | 8,578 | 6,970 | 6,501 |
| services | 21,048 | 7,481 | 4,344 | 3,872 |
| team | 15,636 | 3,544 | 2,534 | 1,843 |
| contact | 14,776 | 2,903 | 2,279 | 1,617 |
| about | 13,487 | 3,084 | 2,156 | 2,139 |
| blog | 10,695 | 5,696 | 3,456 | 2,751 |

Heights in CSS px. The homepage is 8,336px tall at desktop — 9.3 screens — with
one tempo throughout.
