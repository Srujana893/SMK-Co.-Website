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
 * Captures are byte-deterministic. Each page is held until its height stops
 * changing (blog.html renders every article at runtime), then resized to the
 * full content height so every IntersectionObserver reveal fires, then held
 * again until all finite animations report finished. Infinite animations --
 * the services page's rotating rings -- are pinned to t=0 so they render at a
 * fixed phase.
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
// Wait until the document stops growing. blog.html renders every article from
// config.js at runtime, so its height is 1182px until the script has run and
// 2751px afterwards -- measuring too early captures an empty page.
const STABLE = `(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let last = -1, same = 0;
  for (let i = 0; i < 80; i++) {
    const h = document.documentElement.scrollHeight;
    same = (h === last) ? same + 1 : 0;
    last = h;
    if (same >= 5) return h;
    await sleep(120);
  }
  return last;
})()`;

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

// Every <img> must have loaded before the shot. A fetch that fails leaves the
// logo rendered as its alt text, which is a capture fault, not a site change,
// so a failed image is re-requested once or twice before giving up.
const IMAGES = `(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const bad = () => [...document.images].filter(i => !i.complete || i.naturalWidth === 0);
  for (let attempt = 0; attempt < 3; attempt++) {
    for (let i = 0; i < 50 && bad().some(i => !i.complete); i++) await sleep(100);
    const failed = bad();
    if (!failed.length) return attempt;
    for (const img of failed) { const src = img.currentSrc || img.src; img.removeAttribute('src'); img.src = src; }
    await sleep(400);
  }
  return -bad().length;
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
    // Third-party frames (the Google map on /contact) paint differently on every
    // load, so they are hidden for the shot: the gate measures this site's
    // rendering, and the frame's box still takes up its space.
    await c.send('Runtime.evaluate', { expression:
      `document.head.insertAdjacentHTML('beforeend', '<style data-shoot>iframe{visibility:hidden!important}</style>')` });
    await c.send('Runtime.evaluate', { expression: STABLE, awaitPromise: true });
    const imgs = await c.send('Runtime.evaluate', { expression: IMAGES, awaitPromise: true });
    await c.send('Runtime.evaluate', { expression: SETTLE, awaitPromise: true });

    const { cssContentSize } = await c.send('Page.getLayoutMetrics');
    const full = Math.min(Math.ceil(cssContentSize.height), 24000);
    await metrics(full);
    // Scroll-linked state (the How we work drawing) recomputes on scroll and
    // resize through requestAnimationFrame. After the resize, fire both and
    // wait two frames so that recompute has landed before anything settles.
    await c.send('Runtime.evaluate', { awaitPromise: true, expression:
      `new Promise(r => { window.dispatchEvent(new Event('resize')); window.dispatchEvent(new Event('scroll'));
         requestAnimationFrame(() => requestAnimationFrame(r)); })` });
    await c.send('Runtime.evaluate', { expression: STABLE, awaitPromise: true });
    const { result } = await c.send('Runtime.evaluate', { expression: SETTLE, awaitPromise: true });
    await c.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
    await sleep(150);

    const { data } = await c.send('Page.captureScreenshot',
      { format: 'png', captureBeyondViewport: true });
    const file = path.join(OUT, `${page}-${w}.png`);
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
    const bytes = fs.statSync(file).size;
    manifest.push({ page, width: w, height: full, bytes });
    const iv = imgs.result.value;
    console.log(`${page}-${w}.png  ${w}x${full}  ${(bytes / 1024).toFixed(0)} KB` +
                (result.value ? `  (${result.value} still running)` : '') +
                (iv > 0 ? `  (images retried x${iv})` : iv < 0 ? `  (${-iv} IMAGE(S) STILL BROKEN)` : ''));
  }
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
ws.close();
process.exit(0);
