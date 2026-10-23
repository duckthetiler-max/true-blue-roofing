// Usage: node video.cjs <page> <out.mp4> <w> <h> <fps> <plan> [query]
// plan: comma-separated steps, each "hold@seconds" or "y0>y1@seconds" (scroll linearly; y may be "end").
// Frames are rendered on a virtual clock: requestAnimationFrame, performance.now and Date.now are replaced,
// so motion stays smooth even though this machine renders WebGL slowly. Lenis is switched off and the page
// scrolls natively, one step per frame.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const [page, out, w, h, fpsArg, plan, query = ''] = process.argv.slice(2);
  const fps = +fpsArg;
  const dir = out.replace(/\.mp4$/, '') + '-frames';
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +w < 500 ? 2 : 1 });
  const errs = [];
  p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  await p.addInitScript(() => {
    let now = 0, queue = [], id = 0;
    const base = Date.now();
    window.requestAnimationFrame = (cb) => { queue.push({ id: ++id, cb }); return id; };
    window.cancelAnimationFrame = (i) => { queue = queue.filter((q) => q.id !== i); };
    performance.now = () => now;
    Date.now = () => base + now;
    window.__advance = (ms) => {
      now += ms;
      const q = queue; queue = [];
      for (const { cb } of q) { try { cb(now); } catch (e) { console.error(e); } }
    };
  });
  await p.route('**/lenis.min.js', (r) => r.fulfill({ body: '', contentType: 'application/javascript' }));
  await p.goto(`http://localhost:8150/${page}/${query}`, { waitUntil: 'networkidle', timeout: 120000 });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const Y = (v) => (v === 'end' ? total : Math.min(total, +v));

  const steps = plan.split(',').map((s) => {
    const [what, secs] = s.split('@');
    const n = Math.round(+secs * fps);
    if (what === 'hold') return { n, from: null };
    const [a, c] = what.split('>');
    return { n, from: Y(a), to: Y(c) };
  });
  let y = 0, frame = 0;
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const t0 = Date.now();
  for (const s of steps) {
    for (let i = 0; i < s.n; i++) {
      if (s.from !== null) y = s.from + (s.to - s.from) * ease((i + 1) / s.n);
      await p.evaluate((y) => { window.scrollTo(0, y); if (window.ScrollTrigger) ScrollTrigger.update(); }, Math.round(y));
      await p.evaluate((ms) => window.__advance(ms), 1000 / fps);
      await p.screenshot({ path: path.join(dir, `${String(frame++).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 88, timeout: 120000 });
    }
  }
  await b.close();
  execFileSync('/usr/bin/ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(fps), '-i', path.join(dir, '%05d.jpg'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', '-preset', 'slow', '-movflags', '+faststart', out]);
  console.log(page, `${frame} frames in ${Math.round((Date.now() - t0) / 1000)}s ->`, out, errs.length ? errs.slice(0, 5) : 'no errors');
})();
