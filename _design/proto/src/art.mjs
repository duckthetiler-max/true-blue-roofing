// Generated artwork: suburban skyline silhouettes and hand-drawn service line illustrations.

// Deterministic PRNG so the skyline is the same on every build.
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const f = (n) => Number(n.toFixed(1));

/** One silhouette layer of an Australian suburban street: tile roofs (gable and hip),
 * chimneys, TV antennas, gum trees and power poles. Returns {fill, wires} path data. */
export function skylineLayer({ seed, width = 2400, base = 420, scale = 1, trees = 0.35, poles = true }) {
  const r = rng(seed);
  const R = (a, b) => a + (b - a) * r();
  let d = '';
  const wires = [];
  const poleXs = [];
  let x = -60;
  while (x < width + 60) {
    const w = R(170, 300) * scale;
    const wall = R(58, 92) * scale;
    const over = 12 * scale;
    const pitch = R(0.42, 0.62);
    const top = base - wall;
    const rise = (w / 2 + over) * pitch;
    const hip = r() < 0.5;
    // walls
    d += `M${f(x)} ${base}V${f(top)}H${f(x + w)}V${base}Z`;
    // roof: hip = trapezoid with a short ridge, gable = triangle
    if (hip) {
      const ridge = w * R(0.18, 0.34);
      const cx = x + w / 2;
      d += `M${f(x - over)} ${f(top + 2)}L${f(cx - ridge / 2)} ${f(top - rise)}H${f(cx + ridge / 2)}L${f(x + w + over)} ${f(top + 2)}Z`;
    } else {
      d += `M${f(x - over)} ${f(top + 2)}L${f(x + w / 2)} ${f(top - rise)}L${f(x + w + over)} ${f(top + 2)}Z`;
    }
    // chimney on the left slope
    if (r() < 0.45) {
      const cxp = x + w * R(0.22, 0.34);
      const slopeY = top - (cxp - (x - over)) * pitch;
      const cw = 14 * scale, ch = R(22, 34) * scale;
      d += `M${f(cxp)} ${f(slopeY + 8)}V${f(slopeY - ch)}H${f(cxp + cw)}V${f(slopeY + 8 - cw * pitch)}Z`;
      d += `M${f(cxp - 2)} ${f(slopeY - ch)}h${f(cw + 4)}v${f(-4 * scale)}h${f(-(cw + 4))}Z`;
    }
    // TV antenna: mast with three crossbars
    if (r() < 0.55) {
      const ax = x + w * R(0.55, 0.7);
      const ay = top - rise * R(0.35, 0.6);
      const mh = R(34, 58) * scale;
      d += `M${f(ax)} ${f(ay)}v${f(-mh)}h${f(2.2 * scale)}v${f(mh)}Z`;
      for (let k = 0; k < 3; k++) {
        const bw = (26 - k * 6) * scale;
        const by = ay - mh + 4 * scale + k * 8 * scale;
        d += `M${f(ax - bw / 2)} ${f(by)}h${f(bw)}v${f(1.8 * scale)}h${f(-bw)}Z`;
      }
    }
    // low fence
    const gap = R(14, 46) * scale;
    d += `M${f(x + w)} ${base}V${f(base - 16 * scale)}H${f(x + w + gap)}V${base}Z`;
    // gum tree in some gaps: forked trunk, airy clumps of small leaves
    if (r() < trees) {
      const tx = x + w + gap / 2;
      const th = R(150, 240) * scale;
      const fork = base - th * 0.45;
      d += `M${f(tx - 3.2 * scale)} ${base}L${f(tx - 1.6 * scale)} ${f(fork)}L${f(tx + 1.6 * scale)} ${f(fork)}L${f(tx + 3.2 * scale)} ${base}Z`;
      const nb = 2 + Math.floor(r() * 3);
      for (let k = 0; k < nb; k++) {
        const ang = -Math.PI / 2 + (k - (nb - 1) / 2) * R(0.35, 0.6);
        const len = th * R(0.35, 0.55);
        const bx = tx + Math.cos(ang) * len, by = fork + Math.sin(ang) * len;
        const wv = 1.3 * scale;
        d += `M${f(tx - wv)} ${f(fork + 4)}L${f(bx - wv * 0.5)} ${f(by)}L${f(bx + wv * 0.5)} ${f(by)}L${f(tx + wv)} ${f(fork + 4)}Z`;
        const leaves = 7 + Math.floor(r() * 7);
        for (let q = 0; q < leaves; q++) {
          const ex = bx + R(-30, 30) * scale, ey = by + R(-20, 14) * scale;
          const rx = R(6, 15) * scale, ry = R(4, 9) * scale;
          d += `M${f(ex - rx)} ${f(ey)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`;
        }
      }
    }
    if (poles && r() < 0.32) poleXs.push(x + w + gap * 0.5);
    x += w + gap;
  }
  // power poles with crossarms, and sagging wires between them
  if (poles) {
    for (const px of poleXs) {
      const ph = 250 * scale;
      d += `M${f(px - 2.5 * scale)} ${base}V${f(base - ph)}h${f(5 * scale)}V${base}Z`;
      d += `M${f(px - 26 * scale)} ${f(base - ph + 14 * scale)}h${f(52 * scale)}v${f(3 * scale)}h${f(-52 * scale)}Z`;
    }
    for (let i = 0; i < poleXs.length - 1; i++) {
      const a = poleXs[i], b = poleXs[i + 1], y = base - 250 * scale + 15 * scale;
      for (const off of [-22, 22]) {
        const sag = Math.min(60, (b - a) * 0.06) * scale;
        wires.push(`M${f(a + off * scale)} ${f(y)}Q${f((a + b) / 2)} ${f(y + sag)} ${f(b + off * scale)} ${f(y)}`);
      }
    }
  }
  d += `M-80 ${base}H${width + 80}V${base + 40}H-80Z`;
  return { fill: d, wires: wires.join('') };
}

/** Line illustrations for the six services (viewBox 0 0 320 200), drawn with strokes only. */
const arcs = (x0, y, n, w = 40) => Array.from({ length: n }, (_, i) => `M${x0 + i * w} ${y}a${w / 2} ${w / 2} 0 0 0 ${w} 0`).join('');
export const ILLUSTRATIONS = {
  'roof-restoration': `<path d="M30 150L160 52L290 150Z"/><path d="M126 78H194M98 100H222M69 122H251M40 144H280"/>
    <path d="M140 78v22M180 78v22M120 100v22M160 100v22M200 100v22M100 122v22M140 122v22M180 122v22M220 122v22" class="fine"/>
    <path d="M200 82V58H220V97"/><path d="M52 150V188M268 150V188M14 188H306M150 188V164H170V188"/>`,
  'roof-repointing': `<path d="M24 172L146 114M296 172L174 114"/><path d="M36 182L150 128M284 182L170 128" class="fine"/>
    <path d="M122 118C126 70 194 70 198 118"/><path d="M132 116C140 104 150 98 160 96M188 116C180 104 170 98 160 96" class="fine"/>
    <path d="M118 120q-6 10-10 18M202 120q6 10 10 18" class="bold"/><path d="M60 40H260" class="dash"/><path d="M160 40v30" class="fine"/>`,
  'roof-tile-replacement': `${'<path d="' + arcs(40, 90, 6) + '"/>'}<path d="${arcs(20, 120, 7)}"/><path d="${arcs(40, 150, 6)}"/>
    <path d="M180 90a20 20 0 0 0 40 0" class="dash"/><g transform="rotate(-18 230 40)"><path d="M210 22h40v30a20 20 0 0 1 -40 0z"/></g>
    <path d="M196 70C188 56 196 44 208 40" class="fine"/><path d="M204 36l6 4-7 4" class="fine"/>`,
  'roof-cleaning': `<path d="${arcs(20, 150, 7)}"/><path d="${arcs(40, 180, 6)}"/>
    <path d="M52 26L140 92"/><path d="M64 30l-8 12 12 8" class="fine"/><path d="M140 92l8 6"/>
    <path d="M150 100L176 132M152 100L196 128M154 99L214 120M156 98L230 108" class="dash"/>
    <circle cx="196" cy="140" r="2.5"/><circle cx="222" cy="128" r="2"/><circle cx="240" cy="116" r="2.5"/>`,
  'roof-painting': `<path d="${arcs(20, 150, 7)}"/><path d="${arcs(40, 180, 6)}"/>
    <path d="M20 150h120M40 180h120" class="bold"/>
    <rect x="160" y="66" width="96" height="30" rx="15"/><path d="M256 81h18v40l-40 28v26"/><path d="M226 175h16" class="bold"/>`,
  'roof-leak-repair': `<path d="M20 66L160 22L300 66"/><path d="M20 150H300"/><path d="M40 150v-6M280 150v-6" class="fine"/>
    <path d="M160 40V86" class="dash"/><path d="M160 92c-10 16-14 22-14 30a14 14 0 0 0 28 0c0-8-4-14-14-30z"/>
    <ellipse cx="160" cy="166" rx="54" ry="8" class="fine"/><ellipse cx="160" cy="166" rx="30" ry="4" class="fine"/>`
};

export function illustration(slug, cls = '') {
  return `<svg viewBox="0 0 320 200" class="illo ${cls}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ILLUSTRATIONS[slug]}</svg>`;
}
