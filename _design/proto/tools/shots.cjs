// Usage: node shots.cjs <page> <outdir> <w> <h> <y1,y2,...> [settleMs]   (env: Q=?query, RM=1 for reduced motion)
// Jumps to each scroll position (px, or "end" for the bottom) and screenshots it after the scene settles.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const [page, out, w, h, list, settle = '2200'] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +w < 500 ? 2 : 1, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' });
  const errs = [];
  p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto(`http://localhost:8150/${page}/${process.env.Q || ""}`, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(2600);
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  const ys = list.split(',');
  for (let i = 0; i < ys.length; i++) {
    const y = ys[i] === 'end' ? total : +ys[i];
    await p.evaluate((y) => window.scrollTo(0, y), y);
    // Headless Chrome only runs animation frames intermittently when idle, so wait until the scene reports it has caught up.
    for (let k = 0; k < 60; k++) {
      await p.waitForTimeout(250);
      const ok = await p.evaluate(() => !window.__p2 || Math.abs(window.__p2().T - window.__p2().target) < 1e-3);
      if (ok) break;
    }
    await p.waitForTimeout(+settle);
    await p.screenshot({ timeout: 120000, path: `${out}/${page}-${w}-${String(i).padStart(2, '0')}.png` });
  }
  console.log(page, w, 'height', total, errs.length ? errs.slice(0, 5) : 'no errors');
  await b.close();
})();
