// Prototype 2 — "Blueprint": an interactive 3D roof that goes from blueprint to restored as you scroll.
import { BIZ, SERVICES, STEPS } from './data.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tel = (p = BIZ.phones[0]) => `tel:${p.tel}`;

const STORY = [
  { k: 'Step 01', t: 'Inspect &amp; wash', b: 'We walk the roof, mark every cracked and slipped tile, then wash off years of moss and lichen. Half the damage hides under the growth.' },
  { k: 'Step 02', t: 'Replace broken tiles', b: 'Cracked tiles come out and sound ones hook back onto the batten. A mechanical fix. No silicone smeared over cracks.' },
  { k: 'Step 03', t: 'Strip &amp; re-bed the ridge', b: 'Every ridge cap comes off, the perished bed is chipped back, and fresh sand-and-cement goes down both sides, to a string line.' },
  { k: 'Step 04', t: 'Flexible pointing', b: 'Flexible pointing seals the joint, the full length of the ridge. It moves with the roof instead of cracking.' },
  { k: 'Step 05', t: 'Prime &amp; two coats', b: 'Primer soaks into the tile, then two coats of membrane. Colour comes last, once everything underneath is right.' }
];
const COATS = [['Terracotta', '#b4573a'], ['Charcoal', '#3a3f45'], ['Slate grey', '#5d646b'], ['Heritage red', '#8e322c']];

export default function p2() {
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Roof Restoration South East Melbourne | True Blue Roof Restorations &amp; Repairs</title>
<meta name="description" content="See how a tile roof is restored properly, step by step in 3D. Owner-operated roofers across South East Melbourne.">
<link rel="stylesheet" href="../vendor/lenis.css">
<link rel="stylesheet" href="p2.css">
<link rel="icon" href="../brand/favicon.svg" type="image/svg+xml">
<script type="importmap">{ "imports": { "three": "../vendor/three/three.module.js", "three/addons/": "../vendor/three/addons/" } }</script>
</head>
<body>
<div class="bg" aria-hidden="true"></div>
<canvas id="scene" aria-label="3D model of a house roof being restored"></canvas>
<div id="hud" aria-hidden="true"></div>

<header class="nav">
  <a href="#" class="nav__logo"><img src="../brand/logo-horizontal-dark.svg" alt="${esc(BIZ.name)}"></a>
  <div class="nav__meta"><span class="mono">SE MELBOURNE</span><span class="mono">${BIZ.hours.toUpperCase()}</span></div>
  <a class="nav__call" href="${tel()}">${BIZ.phones[0].display}</a>
</header>

<main>
<div class="story" id="story">
  <section class="beat beat--hero">
    <div class="card card--hero">
      <h1 class="mono kick">Roof restoration &amp; repairs · ${BIZ.region}</h1>
      <p class="title">Watch a roof<br>get restored<br><span class="hl">properly.</span></p>
      <p class="lead">Scroll to see every step we take on a tile roof. Then let the owners come and quote yours, free and in writing.</p>
      <div class="ctas"><a class="btn btn--amber" href="#quote">Get a free quote</a><a class="btn btn--line" href="${tel()}">Call ${BIZ.phones[0].display}</a></div>
      <p class="mono scrollhint"><span></span>Scroll to start</p>
    </div>
  </section>
  ${STORY.map((s, i) => `<section class="beat">
    <div class="card">
      <p class="mono kick">${s.k} / 05</p>
      <h2 class="h2">${s.t}</h2>
      <p class="lead">${s.b}</p>
      ${i === 4 ? `<div class="swatches" role="group" aria-label="Pick a coat colour">${COATS.map(([n, c], j) => `<button type="button" data-coat="${c}" ${j === 1 ? 'aria-pressed="true"' : 'aria-pressed="false"'}><span style="background:${c}"></span>${n}</button>`).join('')}</div>` : ''}
    </div>
  </section>`).join('')}
  <section class="beat beat--done">
    <div class="card card--done">
      <p class="mono kick">Finished</p>
      <h2 class="h2">Done properly.<br><span class="hl">Priced in writing.</span></h2>
      <p class="lead">Drag the house to look around. Then get the owners out to your place for a free, itemised quote.</p>
      <div class="ctas"><a class="btn btn--amber" href="#quote">Get a free quote</a><a class="btn btn--line" href="${tel()}">Call ${BIZ.phones[0].display}</a></div>
    </div>
  </section>
</div>

<div class="solid">
<section class="services">
  <p class="mono kick">// What we do</p>
  <h2 class="h2">Six jobs, one standard.</h2>
  <div class="grid">${SERVICES.map((s, i) => `<a class="svc" href="#"><span class="mono">0${i + 1}</span><h3>${esc(s.name)}</h3><p>${esc(s.blurb)}</p><span class="arrow" aria-hidden="true">→</span></a>`).join('')}</div>
</section>

<section class="process">
  <p class="mono kick">// How we work</p>
  <h2 class="h2">The owners, start to finish.</h2>
  <ol class="steps">${STEPS.map((s, i) => `<li><span class="mono">0${i + 1}</span><h3>${s.title}</h3><p>${s.body}</p></li>`).join('')}</ol>
</section>

<section class="quote" id="quote">
  <div>
    <p class="mono kick">// Free quote</p>
    <h2 class="h2">Get the real thing<br>on your roof.</h2>
    <p class="lead">The owners come out, look at the roof with you, and put the price in writing. Working across ${BIZ.areas.join(', ')}.</p>
    <div class="phones">${BIZ.phones.map((p) => `<a href="tel:${p.tel}"><span class="mono">${p.label.toUpperCase()}</span>${p.display}</a>`).join('')}</div>
  </div>
  <form class="form" action="#" onsubmit="return false">
    <label><span class="mono">Name</span><input required autocomplete="name"></label>
    <label><span class="mono">Phone</span><input type="tel" required autocomplete="tel"></label>
    <label><span class="mono">Suburb</span><input autocomplete="address-level2"></label>
    <label><span class="mono">The job</span><textarea rows="3"></textarea></label>
    <button class="btn btn--amber" type="submit">Send request →</button>
  </form>
</section>

<footer class="foot">
  <img src="../brand/logo-horizontal-dark.svg" alt="${esc(BIZ.name)}">
  <p class="mono">${BIZ.email} · ABN ${BIZ.abn}</p>
</footer>
</div>
</main>
<a class="mcall" href="${tel()}">Call ${BIZ.phones[0].display}</a>

<script src="../vendor/gsap.min.js"></script>
<script src="../vendor/ScrollTrigger.min.js"></script>
<script src="../vendor/lenis.min.js"></script>
<script type="module" src="p2.js"></script>
</body></html>`;
}
