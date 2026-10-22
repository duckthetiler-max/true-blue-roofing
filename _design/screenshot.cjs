const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const [name, outdir] = process.argv.slice(2);
  const b = await chromium.launch(); const errs = [];
  for (const [tag, vp, full] of [['desktop', { width: 1440, height: 900 }, true], ['phone', { width: 390, height: 844 }, true]]) {
    const p = await b.newPage({ viewport: vp, deviceScaleFactor: tag === 'phone' ? 2 : 1 });
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    await p.goto(`http://localhost:8140/${name}.html`, { waitUntil: 'networkidle' });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await p.waitForFunction(() => [...document.images].filter(i => i.getClientRects().length).every(i => i.complete && i.naturalWidth > 0), null, { timeout: 15000 }).catch(() => errs.push('images not all loaded')); await p.waitForTimeout(300);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    if (sw > vp.width) errs.push(`${tag} overflow ${sw}`);
    await p.screenshot({ path: `${outdir}/${name}-${tag}.png`, fullPage: full });
    if (tag === 'desktop') await p.screenshot({ path: `${outdir}/${name}-hero.png` });
  }
  console.log(name, errs.length ? errs : 'ok'); await b.close();
})();
