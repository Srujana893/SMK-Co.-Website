import fs from 'node:fs'; import path from 'node:path';
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8765';
const OUT  = process.env.OUT_DIR  || './baseline';
const PAGES = ['index','about','team','services','blog','contact','careers'];
const WIDTHS = [390, 900, 1440];
const DBG = 'http://127.0.0.1:9222';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function newTab() {
  let r = await fetch(`${DBG}/json/new?about:blank`, { method: 'PUT' });
  if (!r.ok) r = await fetch(`${DBG}/json/new?about:blank`);
  return r.json();
}

class CDP {
  constructor(ws){ this.ws=ws; this.id=0; this.pend=new Map(); this.ev=new Map();
    ws.onmessage = e => { const m = JSON.parse(e.data);
      if (m.id && this.pend.has(m.id)) { const {res,rej}=this.pend.get(m.id); this.pend.delete(m.id);
        m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); }
      else if (m.method) (this.ev.get(m.method)||[]).forEach(f=>f(m.params)); };
  }
  send(method, params={}) { const id = ++this.id;
    return new Promise((res,rej)=>{ this.pend.set(id,{res,rej}); this.ws.send(JSON.stringify({id,method,params})); }); }
  on(m,f){ (this.ev.get(m)||this.ev.set(m,[]).get(m)).push(f); }
}

const tab = await newTab();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((res,rej)=>{ ws.onopen=res; ws.onerror=rej; });
const c = new CDP(ws);
await c.send('Page.enable'); await c.send('Runtime.enable'); await c.send('Network.enable');
await c.send('Network.setCacheDisabled', { cacheDisabled: true });

fs.mkdirSync(OUT, { recursive: true });
const manifest = [];

for (const page of PAGES) {
  for (const w of WIDTHS) {
    await c.send('Emulation.setDeviceMetricsOverride',
      { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 700 });
    const loaded = new Promise(r => { const h = () => r(); c.on('Page.loadEventFired', h); });
    await c.send('Page.navigate', { url: `${BASE}/${page}.html` });
    await Promise.race([loaded, sleep(15000)]);
    await c.send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
    await sleep(900);
    const { cssContentSize } = await c.send('Page.getLayoutMetrics');
    const full = Math.min(Math.ceil(cssContentSize.height), 24000);
    // resize to full height so IntersectionObserver reveals fire everywhere, then settle
    await c.send('Emulation.setDeviceMetricsOverride',
      { width: w, height: full, deviceScaleFactor: 1, mobile: w < 700 });
    await sleep(1600);
    await c.send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
    await sleep(200);
    const { data } = await c.send('Page.captureScreenshot',
      { format: 'png', captureBeyondViewport: true });
    const file = path.join(OUT, `${page}-${w}.png`);
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
    manifest.push({ page, width: w, height: full, bytes: fs.statSync(file).size });
    console.log(`${page}-${w}.png  ${w}x${full}  ${(fs.statSync(file).size/1024).toFixed(0)} KB`);
  }
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
ws.close(); process.exit(0);
