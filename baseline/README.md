# Baseline — Stage 0

The regression harness for the redesign. Captured before any redesign change, on
branch `redesign/stage-0-baseline`, from the working tree as the design audit
measured it.

## Contents

| File | What it is |
| --- | --- |
| `<page>-<width>.png` | 21 full-page screenshots: 7 pages × 390 / 900 / 1440px |
| `manifest.json` | Rendered page height and file size for each capture |
| `noise-floor.json` | Per-capture run-to-run variance, measured over 4 runs |
| `metrics.json` | Every number in `METRICS.md`, machine-readable |
| `dead-selectors.json` | The 136 unreferenced class selectors, per stylesheet — the Stage 5 worklist |
| `shoot.mjs` | The screenshot harness |
| `compare.py` | The stage gate |
| `metrics.py` | The metrics harness |
| `METRICS.md` | The numbers, with the audit reconciliation |

## Previewing the site locally

Use `serve.py`, not `python3 -m http.server`. Every internal link is a clean URL
(`/about`, `/services`), which only resolves if the server applies the
Caddyfile's `try_files {path} {path}.html`. A plain static server — including
VS Code Live Server and `file://` — returns 404 for all six pages.

```sh
python3 baseline/serve.py          # http://127.0.0.1:8765
```

## Running a stage gate

No dependency, no build step. Chrome over CDP through Node's native `WebSocket`.

```sh
python3 baseline/serve.py 8765 --quiet &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --force-color-profile=srgb \
  --remote-debugging-port=9222 --user-data-dir=/tmp/smk-shoot about:blank &

OUT_DIR=./after node baseline/shoot.mjs      # writes ./after/*.png
python3 baseline/compare.py ./after          # exit 0 = gate passes
python3 baseline/metrics.py > after.json     # then diff against metrics.json
```

`compare.py` fails on any size change and on any capture that differs by more
than its noise floor, and writes a diff PNG to `./after/_diff/` for each
failure. Validated both ways: it passes four consecutive captures of the
unchanged site, and catches a 3px page-wide shift (5.03% of pixels).

`shoot.mjs` honours `PAGES`, `WIDTHS`, `BASE_URL`, `OUT_DIR`, `CDP_URL`, and
`REDUCED=1` to emulate `prefers-reduced-motion: reduce`.

## Why captures are deterministic

The viewport is resized to the full content height before the shot, so every
`IntersectionObserver` reveal has fired; the page is then held until all finite
animations report `finished`, and infinite ones — the services page's rotating
rings — are pinned to `currentTime = 0` so they render at a fixed phase.

20 of the 21 captures are byte-identical run to run. The exception is
`index-1440`, which moves by up to **0.3348%** of pixels: `.hx-ind__d` in the
industries accordion transitions to a fractional `max-height: 9em` under
`overflow: hidden`, so the open panel lands on a sub-pixel height and the text
inside it — plus the section hairlines below it — rasterise one pixel apart
between runs. It is a real defect, not harness noise, and Stage 10 removes it.
Recalibrate the floor to zero once it is gone.

## Environment

Chrome 154.0.8037.57 · Node 25.8.1 · macOS 27.0.0 (arm64) · deviceScaleFactor 1.
Captures at a different scale factor, Chrome version or platform will not match.
