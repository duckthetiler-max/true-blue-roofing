// Shared building blocks: icons, responsive photos, logo, ridge diagram, area map.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { BIZ } from './data.mjs';

const require = createRequire(import.meta.url);
const lucideDir = require.resolve('lucide-static/package.json').replace(/package\.json$/, 'icons/');
const META = JSON.parse(readFileSync(new URL('../photos/meta.json', import.meta.url), 'utf8'));

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline Lucide icon (ISC licence). */
export function icon(name, cls = 'size-5') {
  const svg = readFileSync(`${lucideDir}${name}.svg`, 'utf8');
  return svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s(width|height)="24"/g, '')
    .replace(/class="[^"]*"/, '')
    .replace('<svg', `<svg class="${cls}" aria-hidden="true" focusable="false"`)
    .replace(/\n\s*/g, '');
}

/** Responsive <img> from the processed photo set. */
export function pic(slug, alt, { sizes = '100vw', cls = '', eager = false, root = '' } = {}) {
  const m = META[slug];
  if (!m) throw new Error(`unknown photo ${slug}`);
  const srcset = m.widths.map((w) => `${root}photos/${slug}-${w}.webp ${w}w`).join(', ');
  const fallback = m.widths.find((w) => w >= 1200) || m.widths.at(-1);
  return `<img src="${root}photos/${slug}-${fallback}.webp" srcset="${srcset}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(alt)}" class="${cls}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

export const telLink = (p = BIZ.phones[0]) => `tel:${p.tel}`;

/** Ridge cross-section, drawn from real proportions: 25° pitch, tiles hung on battens with a
 * head lap, ridge cap on a sand-and-cement bed, flexible pointing over the bed's outer face.
 * Colours come from CSS variables so each theme can restyle it. On phones the in-drawing labels
 * give way to numbered markers and an HTML legend (see .dg-legend). */
const DG = (() => {
  const A = [360, 120], th = 25 * Math.PI / 180, c = Math.cos(th), s = Math.sin(th);
  const P = (d, n) => [A[0] - d * c - n * s, A[1] + d * s - n * c]; // d along slope (down-left), n outward
  const f = (pts) => pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
  const tile = (hook, len = 190) => `M${f([P(hook - 6, 16), P(hook - 6, 30), P(hook + len, 44), P(hook + len, 30)])}Z`;
  return { P, f, tile };
})();

export function ridgeDiagram() {
  const { P, f, tile } = DG;
  const half = `
    <path class="dg-rafter" d="M${f([P(6, 0), P(392, 0), P(392, -26), P(6, -26)])}Z"/>
    <g class="dg-batten">${[40, 190, 340].map((b) => `<path d="M${f([P(b - 8, 0), P(b + 8, 0), P(b + 8, 16), P(b - 8, 16)])}Z"/>`).join('')}</g>
    <path class="dg-tile" d="${tile(340, 60)}"/>
    <path class="dg-tile" d="${tile(190)}"/>
    <path class="dg-tile dg-tile--top" d="${tile(40)}"/>
    <path class="dg-mortar" d="M${f([P(36, 31), P(98, 36)])} L${P(100, 57).map((v) => v.toFixed(1)).join(' ')} C${P(80, 74).map((v) => v.toFixed(1)).join(' ')} ${P(40, 82).map((v) => v.toFixed(1)).join(' ')} ${P(22, 70).map((v) => v.toFixed(1)).join(' ')} Z"/>
    <path class="dg-point" d="M${f([P(101, 58), P(99, 37)])}"/>`;
  const capL = P(104, 60), capR = [720 - capL[0], capL[1]];
  const mark = (n, x, y) => `<g class="dg-num"><circle cx="${x}" cy="${y}" r="15"/><text x="${x}" y="${y + 5.5}" text-anchor="middle">${n}</text></g>`;
  const pt = P(100, 47), bed = [720 - P(70, 52)[0], P(70, 52)[1]], lap = P(205, 40), bat = [720 - P(190, 8)[0], P(190, 8)[1]];
  return `<svg viewBox="0 0 720 340" class="dg w-full h-auto" role="img" aria-labelledby="dg-title dg-desc">
  <title id="dg-title">Cross-section of a tile roof ridge</title>
  <desc id="dg-desc">The ridge cap sits on a bed of sand and cement mortar on both sides. Flexible pointing seals the outer face of the bed. Roof tiles hook over timber battens and overlap by about 75 millimetres.</desc>
  <g>${half}</g>
  <g transform="translate(720 0) scale(-1 1)">${half}</g>
  <rect class="dg-ridgeboard" x="353" y="100" width="14" height="86" rx="2"/>
  <path class="dg-cap" d="M${capL[0].toFixed(1)} ${capL[1].toFixed(1)} C${(capL[0] + 4).toFixed(1)} 34 ${(capR[0] - 4).toFixed(1)} 34 ${capR[0].toFixed(1)} ${capR[1].toFixed(1)}"/>
  <g class="dg-labels">
    <path class="dg-lead" d="M418 56 L470 30 H520"/><circle class="dg-dot" cx="418" cy="56" r="4"/>
    <text x="526" y="36" class="dg-t">Ridge cap</text>
    <path class="dg-lead" d="M${pt[0].toFixed(1)} ${pt[1].toFixed(1)} L196 64 H178"/><circle class="dg-dot" cx="${pt[0].toFixed(1)}" cy="${pt[1].toFixed(1)}" r="4"/>
    <text x="172" y="60" text-anchor="end" class="dg-t">Flexible pointing</text><text x="172" y="80" text-anchor="end" class="dg-s">seals the bed</text>
    <path class="dg-lead" d="M${bed[0].toFixed(1)} ${bed[1].toFixed(1)} L520 112 H546"/><circle class="dg-dot" cx="${bed[0].toFixed(1)}" cy="${bed[1].toFixed(1)}" r="4"/>
    <text x="552" y="108" class="dg-t">Bedding mortar</text><text x="552" y="128" class="dg-s">holds the cap on</text>
    <path class="dg-lead" d="M${lap[0].toFixed(1)} ${lap[1].toFixed(1)} L118 262 H96"/><circle class="dg-dot" cx="${lap[0].toFixed(1)}" cy="${lap[1].toFixed(1)}" r="4"/>
    <text x="22" y="292" class="dg-t">75 mm head lap</text><text x="22" y="312" class="dg-s">the overlap keeps water out</text>
    <path class="dg-lead" d="M${bat[0].toFixed(1)} ${bat[1].toFixed(1)} L588 252 H608"/><circle class="dg-dot" cx="${bat[0].toFixed(1)}" cy="${bat[1].toFixed(1)}" r="4"/>
    <text x="614" y="258" class="dg-t">Batten</text>
  </g>
  <g class="dg-nums">${mark(1, 410, 40)}${mark(2, pt[0] - 26, pt[1] - 10)}${mark(3, bed[0] + 34, bed[1] - 6)}${mark(4, lap[0] - 8, lap[1] + 40)}${mark(5, bat[0] + 22, bat[1] + 28)}</g>
</svg>
<ol class="dg-legend mt-4 grid gap-2 text-sm sm:hidden">
  <li><b>1 Ridge cap</b> — covers the gap at the top</li><li><b>2 Flexible pointing</b> — seals the bed</li><li><b>3 Bedding mortar</b> — holds the cap on</li><li><b>4 75 mm head lap</b> — the overlap keeps water out</li><li><b>5 Batten</b> — the tiles hook over it</li>
</ol>`;
}

// Approximate positions (equirectangular projection of real coordinates).
const PROJ = (lat, lon) => [((lon - 144.88) * 0.788 * 1119.4), ((-37.76 - lat) * 1119.4)];
const PLACES = {
  Clayton: [-37.915, 145.129, 'r'], Dandenong: [-37.9875, 145.2149, 'r'], 'Narre Warren': [-38.026, 145.301, 'tl'],
  Berwick: [-38.033, 145.349, 'br'], Cranbourne: [-38.0996, 145.2834, 'r'], Pakenham: [-38.071, 145.487, 'b'],
  Ringwood: [-37.816, 145.229, 'r'], Frankston: [-38.144, 145.126, 'r'], Mornington: [-38.218, 145.038, 'r']
};
const COAST = [[-37.862, 144.898], [-37.85, 144.915], [-37.842, 144.935], [-37.85, 144.955], [-37.867, 144.974], [-37.888, 144.984], [-37.912, 144.986], [-37.938, 145.0], [-37.952, 145.004], [-37.972, 145.015], [-37.989, 145.04], [-37.986, 145.066], [-38.008, 145.085], [-38.026, 145.1], [-38.039, 145.108], [-38.074, 145.12], [-38.105, 145.127], [-38.142, 145.118], [-38.165, 145.105], [-38.19, 145.083], [-38.222, 145.035], [-38.265, 145.012]];

function smooth(points) {
  // Closed Catmull-Rom spline through the points, as cubic Béziers.
  const p = points; const n = p.length; let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

export function areaMap() {
  const water = 'M0 120 ' + COAST.map(([la, lo]) => { const [x, y] = PROJ(la, lo); return `L${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' ') + ' L0 580 Z';
  const hull = smooth([[290, 22], [352, 34], [436, 196], [560, 300], [588, 360], [520, 404], [392, 428], [270, 470], [168, 548], [100, 540], [128, 470], [176, 382], [180, 160], [238, 96]]);
  const [cx, cy] = PROJ(-37.8136, 144.9631);
  const dots = Object.entries(PLACES).map(([name, [la, lo, pos]]) => {
    const [x, y] = PROJ(la, lo);
    const lab = { r: [x + 12, y + 5, 'start'], tl: [x - 10, y - 10, 'end'], br: [x + 10, y + 20, 'start'], b: [x, y + 26, 'middle'] }[pos];
    return `<circle class="mp-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6"/><text class="mp-t" x="${lab[0].toFixed(1)}" y="${lab[1].toFixed(1)}" text-anchor="${lab[2]}">${name}</text>`;
  }).join('');
  return `<svg viewBox="0 0 600 560" class="mp w-full h-auto" role="img" aria-labelledby="mp-title">
  <title id="mp-title">Map of the suburbs True Blue works in, south east of Melbourne</title>
  <rect class="mp-land" width="600" height="560"/>
  <path class="mp-area" d="${hull}"/>
  <path class="mp-water" d="${water}"/>
  <text class="mp-water-t" x="40" y="330" transform="rotate(-72 40 330)">Port Phillip Bay</text>
  <rect class="mp-cbd" x="${(cx - 6).toFixed(1)}" y="${(cy - 6).toFixed(1)}" width="12" height="12" rx="2"/>
  <text class="mp-cbd-t" x="${(cx + 12).toFixed(1)}" y="${(cy + 5).toFixed(1)}">Melbourne CBD</text>
  ${dots}
</svg>`;
}

export function mobileBar({ callCls, quoteCls, quoteHref = '#quote' }) {
  return `<div class="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t p-2 md:hidden mobilebar">
    <a href="${telLink()}" class="flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold ${callCls}">${icon('phone', 'size-5')}Call now</a>
    <a href="${quoteHref}" class="flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold ${quoteCls}">${icon('file-text', 'size-5')}Free quote</a>
  </div>`;
}
