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

## Still open

1. **Photography** — not commissioned. Until it is, empty image slots are
   removed rather than filled with grey boxes. No stock.
2. **Six practice areas or ten service lines** — the site claims both. Blocks
   Stage 7.
