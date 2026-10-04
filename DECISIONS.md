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

## Palette — amended §3, shipped 25 Sep 2026 · owner: `smk-design-system`

Warm graphite neutrals replace the blue-charcoals. One blue accent, and it means
interactive.

| Token | Value | Role |
| --- | --- | --- |
| `--surface` | `#FFFFFF` | primary ground |
| `--surface-warm` | `#FAF9F7` | alternating band |
| `--surface-tint` | `#F4F2EE` | second ground |
| `--ink` | `#1C1B19` | headings, primary dark surface |
| `--ink-2` | `#292724` | secondary dark surface |
| `--text` | `#57534E` | body |
| `--text-muted` | `#6B655F` | meta, captions, eyebrows |
| `--accent` | `#2F6FA3` | interactive only |
| `--accent-ink` | `#255A86` | accent as text on light |
| `--accent-wash` | `#EAF1F7` | interaction surface |
| `--danger` | `#B4483A` | errors |
| `--line` | `#E7E4DF` | hairlines |

Added beyond the §3 table, because 77 uses had nowhere to go: `--accent-on-ink`
`#8FB8D8`, `--on-ink` (aliases `--surface-warm`), `--on-ink-muted` `#A8A29B`,
`--line-on-ink`, `--accent-line`. All clear 4.5:1 on both dark surfaces.

Contrast, measured against the shipped file: `--text` 6.82:1 worst case,
`--text-muted` 5.14:1, `--accent-ink` 6.51:1, `--accent` as a focus ring 4.79:1.
All on `--surface-tint`, the hardest ground. The old palette's 4.32:1 and 3.74:1
failures have no equivalent.

**Accent discipline.** Section eyebrows are `--text-muted` with `--line` rules —
they are not interactive. Accent survives only on links, hover, focus and active
states. The four interaction surfaces (`.hx-svc:hover`, `.hx-ind__row.is-active`,
`.cr-row:hover`, `.mega__link:hover`) use `--accent-wash`; the nine section
grounds use warm `--surface-tint`.

**Reading of "keep the tinted band and active-row wash blue":** the token table
sets `--surface-tint` to warm `#F4F2EE` explicitly, so blue was kept for the
interaction surfaces only. A precise table beats an ambiguous sentence — but if
you meant the alternating section band should stay blue too, that is one token
value and one commit.

## Six practice areas — settled 1 Oct 2026 · owner: `smk-copy`

The site claimed six practice areas on the homepage and in the mega menu and
ten service lines on the services page. The six are the architecture; the ten
are capabilities under them.

| Practice area | Absorbs |
| --- | --- |
| Audit & Assurance | Audit & Assurance; Internal Controls & Process Efficiency |
| Tax & Compliance | Taxation, as Direct and Indirect taxation; Accounting & Financial Reporting |
| Advisory | Business Advisory & Consulting; Virtual CFO (with projections and forecasting); Due diligence |
| Forensic | Forensic Accounting & Investigations |
| Technology & Cyber | IS & Cybersecurity Audit; AI Automation & Technology Services |
| Business, LLP & Regulatory | Corporate & Regulatory Compliance; Formation, registration and structuring |

Specialised & Sector-Specific Services was a sector lens, not a service; its
sectors live in the Sectors block. The contact form select offers the six
areas plus "General enquiry", and keeps the enquiry API's existing slugs so
routing is unchanged. "Ten service lines" no longer appears anywhere.

Practice areas are not numbered. Order carries no meaning, so the audit's rule
applies: emphasis comes from the name's weight, one device per row.

Tax representation is labelled "Tax representation" pending confirmation of
appellate work; it becomes "Tax litigation & representation" by changing the
one `<li id="tax-representation">` in `services.html`.

## Pure white grounds — 1 Oct 2026 · owner: `smk-design-system`

`--surface-warm` and `--surface-tint` are set to `#FFFFFF`. The warm greige
bands (`#FAF9F7`, `#F4F2EE`) read as off-white rather than as a chosen second
ground, so every band is now pure white and the 1px hairline between sections
carries the rhythm. The token names stay so a second ground can return in the
palette round, which waits on the final logo.

## The ledger — 3 Oct 2026 · owner: `smk-design-system`

With every ground pure white, the inner pages had only a hairline between
sections. Services, Careers and Insights now carry a margin column down the
page: each section's label, a one-line note and, where it is a true count, a
figure (the figures are counted from the page by `js/site.js`, never typed).
One rule divides margin from content the length of the page, the way a
ledger's margin line does. The in-content eyebrow is hidden on these pages.
One block per page sits on ink: the technology edge, the "why work here"
statement, the latest note. The homepage is unchanged. Rejected on the way:
a scroll-drawn guide line in the gutter (too subtle), framed wash panels and
alternating ink bands (shown side by side on a preview page).

Insights is a journal index: the latest note on ink, every other note as a
dated row under plain word filters, no cards or thumbnails. The article is a
reading column with a side rail of the note's facts and section links, and
every note has a link of its own (`/blog#<id>`).

## Still open

1. **Photography** — not commissioned. Until it is, empty image slots are
   removed rather than filled with grey boxes. No stock.
