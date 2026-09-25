# Redesign decisions

Settled decisions from the design-direction audit, recorded as they are made.
Stage 11 folds each block into the skill that owns it; this file is the interim
home, not the permanent one.

## Firm name — settled 25 Sep 2026 · owner: `smk-brand`

| | Name |
| --- | --- |
| Legal name | **[Placeholder — confirm exact ICAI record]** |
| Trading name | **SMK & Co.** |
| Retired | ~~Sachin Mahendra & Co~~ — omits a named partner. Zero occurrences remain. |

Where each appears:

| Position | Name |
| --- | --- |
| `<title>` | Trading |
| OG title, Twitter title | Trading |
| Navigation, logo alt text | Trading |
| Body copy naming the firm | Trading |
| Footer copyright | Legal |
| About page, firm description | Legal |

Page-title pattern: `<Page> — SMK & Co.` on every page except the homepage,
which is `SMK & Co. — Chartered Accountants, Bengaluru` — the one page that
should carry the category and the city for search.

The trading name carries a full stop after "Co." It already did in the logo alt
text and the homepage hero; Stage 1 made the rest match.

**Open:** the legal name is still a placeholder. Nine occurrences of
"Sachin Mahendra Kiran & Co" — seven footer copyrights, one About paragraph and
`assets/site.webmanifest` — were left in place pending the exact ICAI record.
`js/config.js` carries `legalName: "[Placeholder — confirm exact ICAI record]"`.

## ICAI FRN — settled 25 Sep 2026 · owner: `smk-copy`

FRN 021859S is **not cited on the site**. Removed from the meta descriptions of
about, services and contact, and from `js/config.js`. This reverses the audit's
§4 recommendation that About should carry it.

## Typeface — settled · owner: `smk-design-system`

Inter Display above 28px, Inter below it. One family, two optical grades. Three
weights: 400 body, 500 labels and UI, 600 display. No serif. Manrope is retired.
Applied at Stage 3.

## Logo — replaced 25 Sep 2026 · owner: `smk-brand`

A high-resolution lockup was supplied and now ships. It resolves the audit's §6
complaint that the mark was a 285px raster where the nav needed 486px.

| File | Role |
| --- | --- |
| `assets/smk-logo-source.png` | Master. 2172×724 as supplied. Unreferenced by design — the source every delivered file is exported from. |
| `assets/smk-logo-lockup.png` | Positive, on light grounds. 800×163, trimmed to the ink. |
| `assets/smk-logo-lockup-reversed.png` | Reversed, on dark grounds. Same geometry. |

Delivered at 800px against a largest rendered width of 255px (nav, 52px tall) —
3.1×, past 3× DPR. Not quantised: palette reduction saved 29 KB but shifted
edge pixels by up to 12/255, and the point of the replacement was fidelity.

The mark has two tones — navy `#0C1E37` for the monogram and wordmark, a lighter
slate for the ampersand and the K's leg. The footer previously reversed the
logo with `filter: brightness(0) invert(1)`, which flattens both tones to one
white silhouette. It now uses a real reversed file that keeps the tonal
relationship, and the filter is gone. This is the audit's "a real reversed file,
not a filter".

**Resolved 25 Sep 2026.** `.nav__tag` read "SMK & Co. · Chartered Accountants"
immediately beside a lockup that already said exactly that, and the homepage
hero repeated the same line a third time as `.hx-hero__eyebrow`. Both removed,
along with their now-orphaned CSS. The lockup carries the identity; nothing
restates it. This is §6's "no redundancy" and §7's "one emphasis device per
component" — the nav had three ways of saying the firm's name in one row.

Still needed, unchanged by this: a vector master, the compact and monogram
locks, and written clear-space and minimum sizes.

## Still open

1. **Photography** — not commissioned. Until it is, empty image slots are
   removed rather than filled with grey boxes. No stock.
2. **Six practice areas or ten service lines** — the site claims both. Blocks
   Stage 7.
