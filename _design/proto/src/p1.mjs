// Prototype 1 — "Golden Hour": cinematic and premium. A live sky shader behind the page,
// a generated suburban skyline, big serif type and line drawings that draw themselves.
import { BIZ, SERVICES, STEPS, FAQ } from './data.mjs';
import { skylineLayer, illustration } from './art.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tel = (p = BIZ.phones[0]) => `tel:${p.tel}`;

export default function p1() {
  const far = skylineLayer({ seed: 7, width: 2400, base: 372, scale: 0.7, trees: 0.3, poles: false });
  const near = skylineLayer({ seed: 21, width: 2400, base: 420, scale: 1, trees: 0.4, poles: true });
  const svc = SERVICES.map((s, i) => `
      <article class="panel" data-panel>
        <div class="panel__num">${String(i + 1).padStart(2, '0')}</div>
        ${illustration(s.slug, 'panel__art')}
        <h3 class="panel__title">${esc(s.name)}</h3>
        <p class="panel__body">${esc(s.blurb)}</p>
        <a class="panel__link" href="#">Read more <span aria-hidden="true">→</span></a>
      </article>`).join('');
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Roof Restoration South East Melbourne | True Blue Roof Restorations &amp; Repairs</title>
<meta name="description" content="Owner-operated roof restoration and repairs across South East Melbourne. Every price in writing before we start.">
<link rel="preload" href="../fonts/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../vendor/lenis.css">
<link rel="stylesheet" href="p1.css">
<link rel="icon" href="../brand/favicon.svg" type="image/svg+xml">
</head>
<body>
<canvas id="sky" aria-hidden="true"></canvas>
<div class="grain" aria-hidden="true"></div>

<header class="nav">
  <a href="#" class="nav__logo"><img src="../brand/logo-horizontal-white.svg" alt="${esc(BIZ.name)}"></a>
  <nav class="nav__links" aria-label="Main"><a href="#work">The work</a><a href="#ridge">The ridge</a><a href="#how">How we work</a><a href="#areas">Areas</a></nav>
  <a class="nav__call" href="${tel()}"><span class="dot"></span>${BIZ.phones[0].display}</a>
</header>

<main>
<section class="hero" id="top">
  <div class="hero__copy">
    <h1 class="eyebrow" data-fade>Roof restoration &amp; repairs · ${BIZ.region}</h1>
    <p class="hero__title" data-split>Roofs, restored<br><em>the true blue way.</em></p>
    <p class="hero__sub" data-fade>Two owners. One trade. Every price in writing before a single tile moves.</p>
    <div class="hero__cta" data-fade>
      <a class="btn btn--gold" href="#quote">Get a free quote</a>
      <a class="btn btn--ghost" href="${tel()}">Call ${BIZ.phones[0].display}</a>
    </div>
  </div>
  <div class="skyline" aria-hidden="true">
    <svg class="skyline__far" viewBox="0 0 2400 460" preserveAspectRatio="xMidYMax slice"><path d="${far.fill}"/></svg>
    <svg class="skyline__near" viewBox="0 0 2400 460" preserveAspectRatio="xMidYMax slice"><path d="${near.fill}"/><path class="wires" d="${near.wires}"/></svg>
  </div>
  <a class="scrollcue" href="#statement" aria-label="Scroll down"><span></span>Scroll</a>
</section>

<section class="statement" id="statement">
  <p class="statement__text" data-words>Most of the work on a tile roof happens where you can't see it from the driveway. <em>That's exactly where we start.</em></p>
</section>

<div class="sheet">
<section class="work" id="work">
  <div class="work__track">
    <div class="work__intro">
    <p class="kicker">The work</p>
    <h2 class="display">Six jobs.<br><em>Done properly.</em></h2>
    <p class="muted">From one cracked tile to a full restoration. Every job starts with the owners on your roof and a quote in writing.</p>
  </div>
${svc}
  </div>
</section>

<section class="ridge" id="ridge">
  <div class="ridge__stage">
    <div class="ridge__copy">
      <p class="kicker">Inside the job</p>
      <h2 class="display">Where old roofs<br><em>fail first.</em></h2>
      <p class="muted">A perished ridge bed is the most common failure on an old tile roof. Pointing over the top of it only buys the same failure again. So every cap comes off, the bed is rebuilt, and flexible pointing seals it.</p>
    </div>
    <svg class="ridge__svg" viewBox="0 0 720 360" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <g class="r-structure" stroke="currentColor" stroke-width="2">
        <path d="M352 196L40 336M368 196L680 336"/><path d="M352 218L40 358M368 218L680 358" opacity=".4"/>
        <path d="M353 130V230M367 130V230"/>
      </g>
      <g class="r-tiles" stroke="#d9805a" stroke-width="10">
        <path d="M336 186L180 256M180 268L40 330"/><path d="M384 186L540 256M540 268L680 330"/>
      </g>
      <g class="r-bed" stroke="#e8d5ae" stroke-width="2.2"><path d="M298 168C302 148 318 132 340 126M422 168C418 148 402 132 380 126"/><path d="M304 164l12-8M312 152l14-8M322 142l12-6M416 164l-12-8M408 152l-14-8M398 142l-12-6"/></g>
      <path class="r-cap" d="M292 172C296 112 330 88 360 88C390 88 424 112 428 172" stroke="#d9805a" stroke-width="14"/>
      <g class="r-point" stroke="#8fd3ff" stroke-width="7"><path d="M296 176C298 162 304 150 312 142"/><path d="M424 176C422 162 416 150 408 142"/></g>
    </svg>
    <ol class="ridge__labels">
      <li data-step="1"><b>01</b> Caps off, old bed chipped back</li>
      <li data-step="2"><b>02</b> Fresh sand-and-cement bed, to a string line</li>
      <li data-step="3"><b>03</b> Caps reset, dead straight</li>
      <li data-step="4"><b>04</b> Flexible pointing seals the joint</li>
    </ol>
  </div>
</section>

<section class="how" id="how">
  <p class="kicker">How we work</p>
  <h2 class="display">Straight up,<br><em>start to finish.</em></h2>
  <ol class="how__steps">
    <div class="how__line"><span></span></div>
    ${STEPS.map((s, i) => `<li class="step"><span class="step__n">${i + 1}</span><div><h3>${s.title}</h3><p>${s.body}</p></div></li>`).join('')}
  </ol>
</section>

<section class="promise">
  <p class="promise__line" data-words>The owners on your roof.</p>
  <p class="promise__line" data-words>Every price in writing.</p>
  <p class="promise__line" data-words><em>No surprises on the invoice.</em></p>
  <p class="promise__note">We're new, so there's no wall of reviews here yet. We'd rather earn them than write them.</p>
</section>

<section class="areas" id="areas">
  <p class="kicker">Where we work</p>
  <div class="marquee"><div class="marquee__row">${Array(2).fill(BIZ.areas.map((a) => `<span>${a}</span><i>✦</i>`).join('')).join('')}</div></div>
  <div class="marquee marquee--rev"><div class="marquee__row">${Array(2).fill([...BIZ.areas].reverse().map((a) => `<span>${a}</span><i>✦</i>`).join('')).join('')}</div></div>
  <p class="muted center">Not on the list? Call us. If we can get there, we'll come and quote.</p>
</section>
</div>

<section class="cta" id="quote">
  <div class="cta__copy">
    <h2 class="display">Let's take a proper<br><em>look at your roof.</em></h2>
    <div class="cta__phones">${BIZ.phones.map((p) => `<a href="tel:${p.tel}"><small>${p.label}</small>${p.display}</a>`).join('')}</div>
  </div>
  <form class="glass" action="#" onsubmit="return false">
    <p class="glass__title">Free quote, in writing</p>
    <label>Name<input required autocomplete="name"></label>
    <label>Phone<input type="tel" required autocomplete="tel"></label>
    <label>Suburb<input autocomplete="address-level2" placeholder="e.g. Berwick"></label>
    <label>What's going on?<textarea rows="3" placeholder="Leaks, cracked tiles, ridge, colour…"></textarea></label>
    <button class="btn btn--gold" type="submit">Send request</button>
  </form>
</section>
</main>

<footer class="foot">
  <img src="../brand/logo-horizontal-white.svg" alt="${esc(BIZ.name)}">
  <p>${BIZ.region} · ${BIZ.hours} · <a href="mailto:${BIZ.email}">${BIZ.email}</a> · ABN ${BIZ.abn}</p>
</footer>
<a class="mcall" href="${tel()}">Call ${BIZ.phones[0].display}</a>

<script src="../vendor/gsap.min.js"></script>
<script src="../vendor/ScrollTrigger.min.js"></script>
<script src="../vendor/SplitText.min.js"></script>
<script src="../vendor/DrawSVGPlugin.min.js"></script>
<script src="../vendor/lenis.min.js"></script>
<script src="p1.js"></script>
</body></html>`;
}
