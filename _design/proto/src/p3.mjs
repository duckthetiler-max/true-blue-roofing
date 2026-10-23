// Prototype 3 — "Big Number": simple and punchy. Signwriting on a ute, scaled up to a poster.
// Electric blue, safety yellow, black. One giant phone number you can tap.
import { BIZ, SERVICES, STEPS, FAQ } from './data.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const [lochlan, rhys] = BIZ.phones;
const digits = (s) => [...s].map((c) => (c === ' ' ? '<span class="gap"> </span>' : `<span class="d">${c}</span>`)).join('');
const [first, ...rest] = lochlan.display.split(' ');

const STEPS3 = [
  { title: 'You call.', body: STEPS[0].body },
  { title: 'We quote it in writing.', body: STEPS[1].body },
  { title: 'We fix it.', body: `${STEPS[2].body} ${STEPS[3].body}` }
];
const FAQ3 = [
  ['How long does it take?', FAQ[0][1]],
  ['What does it cost?', FAQ[1][1]],
  ['Why the ridge?', FAQ[2][1]],
  ['Do I need to be home?', FAQ[3][1]]
];
// The house mark from the logo, with its window lit.
const MARK = `<svg class="hero__mark" viewBox="300 690 2490 970" aria-hidden="true">
  <path class="m-roof" d="M1958.5 864L2269 1162.4V1057H2404V1292L2769.7 1643H2580.6L1957.5 1044L1873.6 1124.2L1775.9 1034.6Z"/>
  <path class="m-roof" d="M1347 714L2369 1643H2120L1347 940L574 1643H325L737 1268.5V952H923V1099.5Z"/>
  <path class="m-window" d="M1195 1397V1390A170 170 0 0 1 1350 1220.7V1397ZM1381 1397V1220.8A170 170 0 0 1 1535 1390V1397ZM1195 1429H1350V1596H1195ZM1381 1429H1535V1596H1381Z"/>
</svg>`;

export default function p3() {
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Roof Restoration South East Melbourne | True Blue Roof Restorations &amp; Repairs</title>
<meta name="description" content="Roof restoration and repairs across South East Melbourne. Call Lochlan on ${lochlan.display}. Free quotes, every price in writing.">
<link rel="preload" href="../fonts/anton-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../vendor/lenis.css">
<link rel="stylesheet" href="p3.css">
<link rel="icon" href="../brand/favicon.svg" type="image/svg+xml">
</head>
<body>
<header class="bar" aria-label="Site">
  <a href="#top" class="bar__logo"><img src="../brand/logo-horizontal-white.svg" alt="${esc(BIZ.name)}"></a>
  <nav class="bar__nav" aria-label="Main"><a href="#jobs">What we do</a><a href="#how">How it goes</a><a href="#areas">Areas</a><a href="#quote">Quote</a></nav>
  <a class="bar__call" href="tel:${lochlan.tel}">Call ${lochlan.display}</a>
</header>

<main>
<section class="hero" id="top">
  <div class="hero__top">
    <a href="#top" class="hero__logo"><img src="../brand/logo-horizontal-white.svg" alt="${esc(BIZ.name)}"></a>
    <p class="hero__meta"><span>${BIZ.region}</span><span>${BIZ.hours}</span></p>
  </div>
  ${MARK}
  <div class="hero__main">
    <h1 class="hero__h1">Roof restoration &amp; repairs<span> · </span><br class="m">${BIZ.region}</h1>
    <a class="num" href="tel:${lochlan.tel}" aria-label="Call Lochlan on ${lochlan.display}">${digits(first)}<br class="m"><span class="gap gap--d"> </span>${digits(rest.join(' '))}</a>
    <p class="hero__who"><span class="arrow" aria-hidden="true">↑</span> That's Lochlan's mobile. Rhys is on <a href="tel:${rhys.tel}">${rhys.display}</a>.</p>
    <div class="stickers" aria-label="The deal">
      <span class="sticker sticker--round">Free<br>quotes</span>
      <span class="sticker sticker--a">Every price in writing</span>
      <span class="sticker sticker--b">The owners do the work</span>
    </div>
    <a class="hero__online" href="#quote">Or get a quote online <span aria-hidden="true">→</span></a>
  </div>
</section>

<div class="ticker" aria-hidden="true"><div class="ticker__row">${Array(2).fill(SERVICES.map((s) => `<span>${esc(s.name)}</span><i>✦</i>`).join('')).join('')}</div></div>

<section class="jobs" id="jobs">
  <h2 class="big">Six jobs.<br><span class="blue">One standard.</span></h2>
  <ol class="rows">
    ${SERVICES.map((s, i) => `<li><a class="row" href="#quote">
      <span class="row__n">${String(i + 1).padStart(2, '0')}</span>
      <span class="row__name">${esc(s.name)}</span>
      <span class="row__blurb">${esc(s.blurb)}</span>
      <span class="row__go" aria-hidden="true">→</span>
    </a></li>`).join('')}
  </ol>
</section>

<section class="how" id="how">
  <h2 class="big">How it goes.</h2>
  <div class="how__line" aria-hidden="true"><span></span></div>
  <ol class="how__steps">
    ${STEPS3.map((s, i) => `<li><b>${i + 1}</b><h3>${s.title}</h3><p>${s.body}</p></li>`).join('')}
  </ol>
</section>

<section class="honest">
  <p class="honest__line">New business.</p>
  <p class="honest__line">No fake reviews.</p>
  <p class="honest__line honest__line--y">Ever.</p>
  <p class="honest__small">We're new, so there's no wall of reviews here yet. We'd rather earn them than write them. Judge us on the quote.</p>
</section>

<section class="faq">
  <h2 class="big">Straight answers.</h2>
  <div class="faq__grid">
    ${FAQ3.map(([q, a]) => `<div class="qa"><h3>${q}</h3><p>${a}</p></div>`).join('')}
  </div>
</section>

<section class="areas" id="areas">
  <h2 class="big">Where we work.</h2>
  <p class="burbs">${BIZ.areas.map((a, i) => `<span class="bw"><span class="burb">${a}</span>${i < BIZ.areas.length - 1 ? '<span class="slash" aria-hidden="true">/</span>' : ''}</span>`).join(' ')}</p>
  <p class="anyway"><a href="tel:${lochlan.tel}">Not listed? Call anyway.</a></p>
</section>

<section class="quote" id="quote">
  <h2 class="big">Get a quote.</h2>
  <div class="quote__grid">
    <div class="quote__phones">
      ${BIZ.phones.map((p) => `<a href="tel:${p.tel}"><small>${p.label}</small>${p.display}</a>`).join('')}
      <p>${BIZ.hours}. Free quotes, every price in writing.</p>
    </div>
    <form class="form" action="#" onsubmit="return false">
      <label><span>Name</span><input required autocomplete="name"></label>
      <label><span>Phone</span><input type="tel" required autocomplete="tel"></label>
      <label><span>Suburb</span><input autocomplete="address-level2"></label>
      <label><span>What's going on up there?</span><textarea rows="3"></textarea></label>
      <button type="submit">Send it <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="square" aria-hidden="true"><path d="M3 12h16M13 5l7 7-7 7"/></svg></button>
    </form>
  </div>
</section>
</main>

<footer class="foot">
  <a class="foot__num" href="tel:${lochlan.tel}">${lochlan.display}</a>
  <div class="foot__row">
    <img src="../brand/logo-horizontal-white.svg" alt="${esc(BIZ.name)}">
    <p>${BIZ.region} · ${BIZ.hours} · <a href="mailto:${BIZ.email}">${BIZ.email}</a> · ABN ${BIZ.abn}</p>
  </div>
</footer>
<a class="callbar" href="tel:${lochlan.tel}"><span>Call Lochlan</span>${lochlan.display}</a>

<script src="../vendor/gsap.min.js"></script>
<script src="../vendor/ScrollTrigger.min.js"></script>
<script src="../vendor/SplitText.min.js"></script>
<script src="../vendor/lenis.min.js"></script>
<script src="p3.js"></script>
</body></html>`;
}
