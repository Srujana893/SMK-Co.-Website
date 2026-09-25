/**
 * Full-page screenshot harness for the SMK & Co. redesign.
 * Chrome over CDP through Node's native WebSocket. No dependency, no build step.
 *
 *   python3 -m http.server 8765 --bind 127.0.0.1 &
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
 *     --disable-gpu --hide-scrollbars --force-color-profile=srgb \
 *     --remote-debugging-port=9222 --user-data-dir=/tmp/smk-shoot about:blank &
 *   OUT_DIR=./after node baseline/shoot.mjs
 *
 * Captures are byte-deterministic: the viewport is resized to the full content
 * height so every IntersectionObserver reveal fires, then the page is held until
 * all finite animations have finished. Infinite animations (the services page's
 * rotating rings) are pinned to t=0 so they render at a fixed phase.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE   = process.env.BASE_URL || 'http://127.0.0.1:8765';
const OUT    = process.env.OUT_DIR  || './baseline';
const DBG    = process.env.CDP_URL  || 'http://127.0.0.1:9222';
const PAGES  = (process.env.PAGES  || 'index,about,team,services,blog,contact,careers').split(',');
const WIDTHS = (process.env.WIDTHS || '390,900,1440').split(',').map(Number);

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Pin infinite animations, then wait out every finite one. Run twice, because
// resizing to full height starts a fresh wave of reveals.
const SETTLE = `(async () => {
  for (let pass = 0; pass < 2; pass++) {
    const all = document.getAnimations();
    const infinite = [], finite = [];
    for (const a of all) {
      let forever = false;
      try { forever = a.effect.getComputedTiming().iterations === Infinity; } catch {}
      (forever ? infinite : finite).push(a);
    }
    for (const a of infinite) { try { a.currentTime = 0; a.pause(); } catch {} }
    await Promise.race([
      Promise.allSettled(finite.map(a => a.finished)),
      new Promise(r => setTimeout(r, 6000)),
    ]);
    await new Promise(r => setTimeout(r, 400));
  }
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  return document.getAnimations().filter(a => a.playState === 'running').length;
})()`;

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pend = new Map(); this.ev = new Map();
    ws.onmessage = e => {
      const m = JSON.parse(e.data);
      if (m.id && this.pend.has(m.id)) {
        const { res, rej } = this.pend.get(m.id); this.pend.delete(m.id);
        m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
      } else if (m.method) for (const f of this.ev.get(m.method) || []) f(m.params);
    };
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pend.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(m, f) { if (!this.ev.has(m)) this.ev.set(m, []); this.ev.get(m).push(f); }
}

let r = await fetch(`${DBG}/json/new?about:blank`, { method: 'PUT' });
if (!r.ok) r = await fetch(`${DBG}/json/new?about:blank`);
const tab = await r.json();

const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
const c = new CDP(ws);
await c.send('Page.enable');
await c.send('Runtime.enable');
await c.send('Network.enable');
await c.send('Network.setCacheDisabled', { cacheDisabled: true });
if (process.env.REDUCED === '1')
  await c.send('Emulation.setEmulatedMedia',
    { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });

fs.mkdirSync(OUT, { recursive: true });
const manifest = [];

for (const page of PAGES) {
  for (const w of WIDTHS) {
    const metrics = h => c.send('Emulation.setDeviceMetricsOverride',
      { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });

    await metrics(900);
    const loaded = new Promise(res => c.on('Page.loadEventFired', res));
    await c.send('Page.navigate', { url: `${BASE}/${page}.html` });
    await Promise.race([loaded, sleep(20000)]);
    await c.send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
    await c.send('Runtime.evaluate', { expression: SETTLE, awaitPromise: true });

    const { cssContentSize } = await c.send('Page.getLayoutMetrics');
    const full = Math.min(Math.ceil(cssContentSize.height), 24000);
    await metrics(full);
    const { result } = await c.send('Runtime.evaluate', { expression: SETTLE, awaitPromise: true });
    await c.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
    await sleep(150);

    const { data } = await c.send('Page.captureScreenshot',
      { format: 'png', captureBeyondViewport: true });
    const file = path.join(OUT, `${page}-${w}.png`);
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
    const bytes = fs.statSync(file).size;
    manifest.push({ page, width: w, height: full, bytes });
    console.log(`${page}-${w}.png  ${w}x${full}  ${(bytes / 1024).toFixed(0)} KB` +
                (result.value ? `  (${result.value} still running)` : ''));
  }
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
ws.close();
process.exit(0);
