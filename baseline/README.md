# Baseline — Stage 0

The regression harness for the redesign. Captured before any redesign change, on
branch `redesign/stage-0-baseline`, from the working tree as the design audit
measured it.

## Contents

| File | What it is |
| --- | --- |
| `<page>-<width>.png` | 21 full-page screenshots: 7 pages × 390 / 900 / 1440px |
| `manifest.json` | Rendered page height and file size for each capture |
| `metrics.json` | Every number below, machine-readable |
| `dead-selectors.json` | The 136 unreferenced class selectors, per stylesheet — the Stage 5 worklist |
| `shoot.mjs` | The screenshot harness |
| `metrics.py` | The metrics harness |
| `METRICS.md` | The numbers, with the audit reconciliation |

## Re-running it

No dependency, no build step. Chrome over CDP through Node's native `WebSocket`.

```sh
python3 -m http.server 8765 --bind 127.0.0.1 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --force-color-profile=srgb \
  --remote-debugging-port=9222 --user-data-dir=/tmp/smk-shoot about:blank &

OUT_DIR=./after node baseline/shoot.mjs      # writes ./after/*.png
python3 baseline/metrics.py > after-metrics.json
```

Then diff `after/` against this directory. Captures are deterministic: the
viewport is resized to the full content height before the shot, so every
`IntersectionObserver` reveal has fired and settled.

## Environment

Chrome 154.0.8037.57 · Node 25.8.1 · macOS 27.0.0 (arm64) · deviceScaleFactor 1.
