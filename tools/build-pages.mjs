/* ================================================================
   TRUE BLUE — page builder
   Writes one page per service, the service-areas page, sitemap.xml and
   llms.txt, and keeps the shared header, footer and business data in
   index.html in sync (between the <!-- @name --> / <!-- @/name --> markers).

   Run:  node tools/build-pages.mjs
   Edit the business details and page copy here, never in the generated
   files — they are overwritten on every run.
   ================================================================ */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://trueblueroofrandr.com.au/';
const TODAY = new Date().toISOString().slice(0, 10);

/* ── Business details: the one place they live ──
   Keep these word-for-word identical to the Google Business Profile once
   it exists (name, phone, website, hours). */
const BIZ = {
  name: 'True Blue Roof Restorations & Repairs',
  phones: [
    { label: 'Lochlan', display: '0451 174 122', tel: '+61451174122' },
    { label: 'Rhys', display: '0435 239 766', tel: '+61435239766' }
  ],
  email: 'info@trueblueroofrandr.com.au',
  abn: '69 531 693 315',
  region: 'South East Melbourne',
  hours: 'Mon–Sat: 7am – 5pm',
  areas: ['Berwick', 'Narre Warren', 'Cranbourne', 'Pakenham', 'Dandenong', 'Clayton', 'Ringwood', 'Frankston', 'Mornington'],
  // Add the Google Maps / Facebook / Instagram URLs here once they exist.
  // Empty means the link is left off the page rather than pointing nowhere.
  mapsUrl: '',
  sameAs: []
};
const MAIN_PHONE = BIZ.phones[0];

/* ── Services: one page each ── */
const SERVICES = [
  {
    slug: 'roof-restoration',
    name: 'Roof Restoration',
    short: 'Full roof restoration',
    title: 'Roof Restoration South East Melbourne | True Blue Roof Restorations & Repairs',
    description: 'Full tile roof restoration in South East Melbourne: clean, replace broken tiles, re-bed and re-point the ridge, then prime and coat. Owner-operated, quoted in writing.',
    h1: 'Roof Restoration in South East Melbourne',
    lead: 'A full restoration puts an old tile roof back in working order, not just back in colour. We fix what keeps the water out first — tiles and ridge — and coat it last.',
    intro: [
      'Most of the work on a tile roof happens where you can\'t see it from the driveway. A restoration is the whole job done in the right order: inspect, clean, replace broken tiles, re-bed and re-point the ridge, then seal and coat.',
      'You get the owners on the roof, and a quote itemised in writing before anything starts — materials, labour and days on site, each on its own line.'
    ],
    steps: [
      ['Inspect and mark', 'We walk the roof and mark every cracked and slipped tile before anything else happens.'],
      ['High-pressure clean', 'Moss and lichen hold water against the tile and creep up under the laps. We wash before we price repairs, because half the damage is invisible under years of growth.'],
      ['Replace broken tiles', 'A field tile repair is mechanical: lift the tile above, unhook the broken one, hook the new one back on the batten. No silicone over cracks.'],
      ['Strip and re-bed the ridge', 'Every ridge cap comes off, the old bed is chipped back to the tile, and fresh sand-and-cement mortar goes down both sides. Each cap is set back to a string line so the ridge runs straight.'],
      ['Flexible pointing', 'Flexible pointing compound goes over the bed joint, both sides, the full length of the ridge. It moves with the roof where rigid mortar cracks.'],
      ['Prime and coat', 'One coat of primer or sealer soaks into the tile, then two coats of membrane. Colour is the finish, not the job.']
    ],
    signs: [
      'Cracked or crumbling mortar along the ridge',
      'Moss, lichen or black growth across the tiles',
      'Faded, porous tiles that stay dark long after rain',
      'Cracked or slipped tiles',
      'Water stains on the ceiling or in the roof space'
    ],
    faq: [
      ['How long does a full roof restoration take?', 'Most full roof restorations are completed within 2–4 days, depending on the size and condition of the roof. You get a clear timeline with the quote.'],
      ['Is a restoration cheaper than a new roof?', 'As a rule, a full restoration costs a fraction of a full replacement and keeps the roof you already have working. If a roof is past restoring, we\'ll say so.'],
      ['How much does a roof restoration cost?', 'Every roof is different, so there is no flat rate. You get a written quote that shows how the number is built — materials, labour and days on site, each on its own line — before you commit to anything.']
    ],
    related: ['roof-repointing', 'roof-painting', 'roof-cleaning']
  },
  {
    slug: 'roof-repointing',
    name: 'Ridge Cap Re-bedding & Re-pointing',
    short: 'Re-bedding & re-pointing',
    title: 'Roof Repointing & Ridge Cap Re-bedding Melbourne | True Blue Roof Restorations & Repairs',
    description: 'Ridge cap re-bedding and flexible re-pointing for tile roofs across South East Melbourne. The old bed chipped back, fresh mortar, caps set to a string line.',
    h1: 'Roof Repointing & Ridge Cap Re-bedding',
    lead: 'A rotten ridge bed is the most common failure on an old tile roof, and it\'s invisible from the ground. It lets water straight into the roof space.',
    intro: [
      'The ridge caps sit on a bed of sand and cement. Over the years that bed perishes and the pointing over it cracks. Pointing over the top of perished mortar only buys the same failure again in a couple of years.',
      'So every cap comes off, the old bed is chipped right back to the tile, and the ridge is rebuilt properly.'
    ],
    steps: [
      ['Caps off', 'Every ridge cap is lifted and kept for re-use where it\'s sound.'],
      ['Chip back the old bed', 'The perished sand-and-cement bed is chipped right back to the tile.'],
      ['Fresh bed', 'Fresh mortar is laid both sides of the ridge, around 40–60 mm under every cap.'],
      ['Set to a string line', 'Each cap is set back into the bed and pulled to a string line, so the ridge runs dead straight from end to end.'],
      ['Flexible pointing', 'Flexible pointing compound over the bed joint, both sides, the full length. This is the part that keeps water out, and it moves with the roof instead of cracking.']
    ],
    signs: [
      'Cracked, gapped or missing pointing along the ridge or hips',
      'Loose or rocking ridge caps',
      'Bits of mortar in the gutters or on the ground',
      'Leaks or stains near the top of the walls or the ceiling line'
    ],
    faq: [
      ['What is the difference between re-bedding and re-pointing?', 'The bed is the sand-and-cement mortar under each ridge cap; it holds the cap down and holds the line. Pointing is the flexible compound over the bed joint; it keeps the water out. Re-pointing over a perished bed doesn\'t last, so we re-bed first.'],
      ['Why flexible pointing instead of mortar?', 'A roof expands and contracts. Rigid mortar pointing can\'t, so it cracks out. Flexible pointing moves with the roof.'],
      ['Can you just re-point the ridge without a full restoration?', 'Yes. Re-bedding and re-pointing is often the job that matters most, and it can be done on its own.']
    ],
    related: ['roof-restoration', 'roof-leak-repair', 'roof-tile-replacement']
  },
  {
    slug: 'roof-tile-replacement',
    name: 'Roof Tile Replacement',
    short: 'Tile replacement',
    title: 'Broken Roof Tile Replacement Melbourne | True Blue Roof Restorations & Repairs',
    description: 'Cracked, broken or slipped roof tiles replaced properly across South East Melbourne. Matching tiles sourced, hooked back on the batten, no silicone patches.',
    h1: 'Broken Roof Tile Replacement',
    lead: 'Cracked, broken or slipped tiles let water past the overlap that keeps your roof dry. We replace them properly — not with a smear of silicone.',
    intro: [
      'Tiles aren\'t glued or sealed. They hook over the battens and keep water out by overlap alone: the 75 mm head lap where each tile sits on the one below. One broken tile breaks that lap.',
      'We source matching tiles and replace them so they sit in the roof like the originals.'
    ],
    steps: [
      ['Find every broken tile', 'We walk the roof and mark cracked, broken and slipped tiles, not just the one you can see.'],
      ['Free the lap', 'The tile above is lifted to free the overlap.'],
      ['Out with the old', 'The broken tile is unhooked off the batten and slid out.'],
      ['In with the new', 'The replacement slides up, hooks its nib over the batten, and the lap goes back over it.']
    ],
    signs: [
      'Visible cracks or chips in tiles',
      'Tiles that have slipped out of line',
      'Daylight visible in the roof space',
      'A damp patch after rain in one spot'
    ],
    faq: [
      ['Can a cracked tile be sealed instead of replaced?', 'Sealing a cracked tile with silicone hides the problem; it doesn\'t fix it. A field tile repair is mechanical: the broken tile comes out and a sound one goes in.'],
      ['Can you match my existing tiles?', 'We source matching tiles for the replacement so it suits the roof.']
    ],
    related: ['roof-leak-repair', 'roof-repointing', 'roof-restoration']
  },
  {
    slug: 'roof-cleaning',
    name: 'Roof Pressure Cleaning',
    short: 'Pressure cleaning',
    title: 'Roof Pressure Cleaning South East Melbourne | True Blue Roof Restorations & Repairs',
    description: 'High-pressure cleaning of tile roofs across South East Melbourne. Moss, lichen and years of grime removed so the real condition of the roof shows.',
    h1: 'Roof Pressure Cleaning',
    lead: 'Moss and lichen hold water against the tile and creep up under the laps. A proper clean gets rid of them and shows what the roof really looks like underneath.',
    intro: [
      'We blast away years of dirt, moss and lichen with professional high-pressure cleaning equipment.',
      'On a restoration we always wash before we price the repairs, because half the damage is invisible under years of growth.'
    ],
    steps: [
      ['Check the roof first', 'We walk the roof and note broken tiles before cleaning, so nothing gets worse under the water.'],
      ['High-pressure clean', 'The whole roof is cleaned, ridge to gutter.'],
      ['Report what we found', 'Anything the clean uncovers — cracks, perished pointing, slipped tiles — you hear about before we touch it.']
    ],
    signs: [
      'Green, black or orange growth on the tiles',
      'Moss building up along laps and valleys',
      'Gutters filling with grit from the roof'
    ],
    faq: [
      ['Will pressure cleaning damage my tiles?', 'We check the roof before cleaning and tell you about any tiles that are already cracked, so they can be replaced rather than made worse.'],
      ['Should I clean my roof before painting it?', 'Yes. A coating needs a clean surface to bond to, which is why cleaning is the first step of every restoration.']
    ],
    related: ['roof-restoration', 'roof-painting', 'roof-tile-replacement']
  },
  {
    slug: 'roof-painting',
    name: 'Roof Painting & Sealing',
    short: 'Roof painting',
    title: 'Roof Painting & Sealing South East Melbourne | True Blue Roof Restorations & Repairs',
    description: 'Tile roof painting in South East Melbourne: cleaned and repaired first, then a primer or sealer coat and two coats of membrane. Colour is the finish, not the job.',
    h1: 'Roof Painting & Sealing',
    lead: 'A good-looking roof that still leaks isn\'t a good roof. We only coat once the tiles and ridge underneath are right — then primer and two coats of membrane.',
    intro: [
      'Colour is the last thing that happens. If the tiles and ridge aren\'t right underneath, all you\'ve bought is a nice colour on a roof that still lets water in.',
      'So painting comes after the clean and repairs: one coat of primer or sealer that soaks into the porous tile, then two coats of membrane over the top.'
    ],
    steps: [
      ['Clean', 'The roof is high-pressure cleaned so the coating has a sound surface to bond to.'],
      ['Repair', 'Broken tiles replaced and the ridge re-bedded and re-pointed where it needs it.'],
      ['Prime or seal', 'One coat of primer or sealer soaks into the tile.'],
      ['Two coats of membrane', 'Two coats of membrane in the colour you choose.']
    ],
    signs: [
      'Faded or patchy tiles',
      'Porous tiles that stay dark and damp long after rain',
      'You\'re selling, or want to change the look of the house'
    ],
    faq: [
      ['What colours can I choose?', 'Popular roof colours include terracotta, charcoal, monument grey and heritage red. Bring your preference to the quote and we\'ll talk it through.'],
      ['Can you paint over a roof without fixing it first?', 'We won\'t. Paint over cracked tiles or a perished ridge looks fine for a while and still leaks.']
    ],
    related: ['roof-restoration', 'roof-cleaning', 'roof-repointing']
  },
  {
    slug: 'roof-leak-repair',
    name: 'Roof Leak Detection & Repair',
    short: 'Leak repairs',
    title: 'Roof Leak Repairs South East Melbourne | True Blue Roof Restorations & Repairs',
    description: 'Roof leak detection and repair across South East Melbourne. We find where the water actually gets in — often the ridge bed or a broken tile — and fix that.',
    h1: 'Roof Leak Detection & Repair',
    lead: 'Where the stain is on your ceiling is rarely where the water gets in. We trace the leak to its source and fix that, not the symptom.',
    intro: [
      'On a tile roof, the usual suspects are a perished ridge bed, cracked pointing, or a cracked or slipped tile breaking the overlap. Water can travel along a batten or rafter a long way before it shows up inside.',
      'We find the source and fix it properly. No band-aid solutions, and no silicone smeared over a crack.'
    ],
    steps: [
      ['Look inside', 'Where it\'s safe to, we check the roof space under the stain for the water path.'],
      ['Look on top', 'We check the ridge, hips, valleys and tiles above the leak.'],
      ['Tell you what we found', 'You hear what\'s causing it and what it costs, in writing, before we fix it.'],
      ['Fix the source', 'Replace the tile, re-bed and re-point the ridge, or whatever the cause needs.']
    ],
    signs: [
      'Water stains or drips on the ceiling',
      'Damp insulation or timber in the roof space',
      'Mould spots near the ceiling line',
      'Leaks that only show in heavy or wind-driven rain'
    ],
    faq: [
      ['What causes most roof leaks on a tile roof?', 'A rotten ridge bed is the most common failure on an old tile roof: it lets water straight into the roof space and is invisible from the ground. Cracked or slipped tiles are the next most common cause.'],
      ['Can you fix just the leak?', 'Yes. If the rest of the roof is sound, we fix the cause of the leak and leave it at that.']
    ],
    related: ['roof-repointing', 'roof-tile-replacement', 'roof-restoration']
  }
];

const AREAS_PAGE = {
  slug: 'service-areas',
  title: 'Roofing Service Areas, South East Melbourne | True Blue Roof Restorations & Repairs',
  description: `Roof restoration and repairs across South East Melbourne, including ${BIZ.areas.join(', ')}.`,
  h1: 'Where We Work',
  lead: `True Blue works across ${BIZ.region}. If your suburb isn't listed, call us — if it's within reach, we'll come and quote.`
};

/* ── Helpers ── */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const bySlug = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));
const jsonld = (obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;

const ICON_PHONE = '<svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
const ICON_PLUS = '<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

/* ── Structured data ── */
function businessNode() {
  return {
    '@type': 'RoofingContractor',
    '@id': `${SITE}#business`,
    name: BIZ.name,
    url: SITE,
    logo: `${SITE}assets/logo.png`,
    image: `${SITE}assets/hero-roof.png`,
    description: `Owner-operated roof restoration and repair business serving ${BIZ.region}. Roof cleaning, re-bedding and re-pointing of ridge caps, broken tile replacement, leak repairs, sealing and coating.`,
    telephone: MAIN_PHONE.tel,
    email: BIZ.email,
    priceRange: '$$',
    currenciesAccepted: 'AUD',
    identifier: { '@type': 'PropertyValue', name: 'ABN', value: BIZ.abn.replace(/\s/g, '') },
    address: { '@type': 'PostalAddress', addressLocality: 'Melbourne', addressRegion: 'VIC', addressCountry: 'AU' },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '07:00',
      closes: '17:00'
    },
    areaServed: BIZ.areas.map((name) => ({ '@type': 'City', name })),
    knowsAbout: SERVICES.map((s) => s.name),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Roofing services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: `${SITE}${s.slug}/` }
      }))
    },
    ...(BIZ.mapsUrl ? { hasMap: BIZ.mapsUrl } : {}),
    ...(BIZ.sameAs.length ? { sameAs: BIZ.sameAs } : {})
  };
}

const faqNode = (faq) => ({
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
});

const breadcrumbNode = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url }))
});

/* ── Shared chrome ──
   `r` is the relative path back to the site root ('' on the homepage,
   '../' one folder down), so the site also works from a sub-path. */
function header(r) {
  const home = r || './';
  const svc = SERVICES.map((s) => `      <a class="mobile-menu__link" href="${r}${s.slug}/">${esc(s.name)}</a>`).join('\n');
  return `<header class="header" id="header">
    <div class="container">
      <a href="${home}" class="logo" aria-label="${esc(BIZ.name)} home">
        <img class="logo__img" src="${r}assets/logo-240.webp" width="52" height="52" alt="${esc(BIZ.name)}" />
      </a>
      <nav class="nav" aria-label="Main">
        <ul class="nav__links">
          <li><a class="nav__link" href="${home}#services">Services</a></li>
          <li><a class="nav__link" href="${r}roof-restoration/">Restoration</a></li>
          <li><a class="nav__link" href="${r}roof-repointing/">Re-pointing</a></li>
          <li><a class="nav__link" href="${r}roof-leak-repair/">Leaks</a></li>
          <li><a class="nav__link" href="${r}service-areas/">Areas</a></li>
          <li><a class="nav__link" href="${home}#contact">Free quote</a></li>
        </ul>
        <a href="tel:${MAIN_PHONE.tel}" class="btn btn--primary">${ICON_PHONE}${MAIN_PHONE.display}</a>
      </nav>
      <button class="hamburger" id="hamburger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <span class="hamburger__line"></span><span class="hamburger__line"></span><span class="hamburger__line"></span>
      </button>
    </div>
  </header>
  <div class="mobile-menu__overlay" id="mobile-overlay"></div>
  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile">
${svc}
      <a class="mobile-menu__link" href="${r}service-areas/">Service areas</a>
      <a class="mobile-menu__link" href="${home}#contact">Free quote</a>
      <a href="tel:${MAIN_PHONE.tel}" class="btn btn--primary">${ICON_PHONE}Call ${MAIN_PHONE.display}</a>
  </nav>`;
}

function footer(r) {
  const home = r || './';
  const svc = SERVICES.map((s) => `            <li><a href="${r}${s.slug}/" class="footer__link">${esc(s.short)}</a></li>`).join('\n');
  const phones = BIZ.phones.map((p) => `            <li><a class="footer__link" href="tel:${p.tel}">${p.display} — ${p.label}</a></li>`).join('\n');
  const maps = BIZ.mapsUrl ? `\n            <li><a class="footer__link" href="${BIZ.mapsUrl}" rel="noopener">Find us on Google Maps</a></li>` : '';
  return `<footer class="footer" id="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <a href="${home}" class="logo">
            <img class="logo__img" src="${r}assets/logo-240.webp" width="52" height="52" alt="${esc(BIZ.name)}" loading="lazy" />
          </a>
          <p class="footer__brand-desc">Roof restoration and repairs across ${BIZ.region}. Owner-operated, trade-qualified, and straight with you about what your roof actually needs.</p>
        </div>

        <div>
          <h2 class="footer__heading">Services</h2>
          <ul class="footer__links">
${svc}
          </ul>
        </div>

        <div>
          <h2 class="footer__heading">Company</h2>
          <ul class="footer__links">
            <li><a href="${home}#about" class="footer__link">About us</a></li>
            <li><a href="${r}service-areas/" class="footer__link">Service areas</a></li>
            <li><a href="${home}#faq" class="footer__link">FAQ</a></li>
            <li><a href="${home}#contact" class="footer__link">Free quote</a></li>
          </ul>
        </div>

        <div>
          <h2 class="footer__heading">Contact</h2>
          <ul class="footer__links">
${phones}
            <li><a class="footer__link" href="mailto:${BIZ.email}">${BIZ.email}</a></li>${maps}
            <li><span class="footer__link">${BIZ.region}</span></li>
            <li><span class="footer__link">${BIZ.hours}</span></li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">&copy; ${new Date().getFullYear()} ${esc(BIZ.name)} &middot; ABN ${BIZ.abn}</p>
      </div>
    </div>
  </footer>`;
}

function head({ title, description, path, extraLd = [], r }) {
  const url = SITE + path;
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${url}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="${r}style.css" />
  <link rel="icon" href="${r}assets/logo-240.webp" type="image/webp" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${esc(BIZ.name)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${SITE}assets/hero-roof.png" />
  <meta property="og:locale" content="en_AU" />
  <meta name="twitter:card" content="summary_large_image" />
  ${jsonld({ '@context': 'https://schema.org', '@graph': [businessNode(), ...extraLd] })}
</head>`;
}

function ctaBand(r, heading = 'Get a free, written quote') {
  const home = r || './';
  return `<section class="cta-band section">
      <div class="container">
        <div class="cta-band__inner reveal">
          <h2 class="section__title">${esc(heading)}</h2>
          <p class="section__subtitle">The owners come out, look at the roof, and give you a quote itemised in writing. Call, or send your details and we'll get back to you.</p>
          <div class="hero__actions">
            ${BIZ.phones.map((p, i) => `<a href="tel:${p.tel}" class="btn ${i === 0 ? 'btn--primary' : 'btn--outline'} btn--large">${ICON_PHONE}${p.label} ${p.display}</a>`).join('\n            ')}
            <a href="${home}#contact" class="btn btn--outline btn--large">Request a quote online</a>
          </div>
        </div>
      </div>
    </section>`;
}

const faqList = (faq) => `<div class="faq__list">
${faq.map(([q, a]) => `          <div class="faq-item">
            <button class="faq-item__question" type="button">${esc(q)}${ICON_PLUS}</button>
            <div class="faq-item__answer"><div class="faq-item__answer-inner">${esc(a)}</div></div>
          </div>`).join('\n')}
        </div>`;

const breadcrumbs = (r, name) => `<nav class="crumbs" aria-label="Breadcrumb"><a href="${r}">Home</a> <span aria-hidden="true">/</span> <span aria-current="page">${esc(name)}</span></nav>`;

const page = (headHtml, r, body) => `${headHtml}
<body>
  ${header(r)}

  <main>
${body}
  </main>

  ${footer(r)}

  <script src="${r}script.js" defer></script>
</body>
</html>
`;

/* ── Service pages ── */
function servicePage(s) {
  const r = '../';
  const url = `${SITE}${s.slug}/`;
  const ld = [
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: s.name,
      serviceType: s.name,
      url,
      description: s.description,
      provider: { '@id': `${SITE}#business` },
      areaServed: BIZ.areas.map((name) => ({ '@type': 'City', name }))
    },
    breadcrumbNode([['Home', SITE], [s.name, url]]),
    faqNode(s.faq)
  ];
  const body = `    <section class="page-hero">
      <div class="container">
        ${breadcrumbs(r, s.name)}
        <span class="section__badge">${esc(BIZ.region)}</span>
        <h1 class="page-hero__title">${esc(s.h1)}</h1>
        <p class="page-hero__lead">${esc(s.lead)}</p>
        <div class="hero__actions">
          <a href="tel:${MAIN_PHONE.tel}" class="btn btn--primary btn--large">${ICON_PHONE}Call ${MAIN_PHONE.display}</a>
          <a href="../#contact" class="btn btn--outline btn--large">Free written quote</a>
        </div>
      </div>
    </section>

    <section class="section prose-section">
      <div class="container prose-grid">
        <div class="prose">
          ${s.intro.map((p) => `<p>${esc(p)}</p>`).join('\n          ')}

          <h2>How we do it</h2>
          <ol class="steps">
${s.steps.map(([t, d]) => `            <li><strong>${esc(t)}.</strong> ${esc(d)}</li>`).join('\n')}
          </ol>

          <h2>Signs you need it</h2>
          <ul class="ticks">
${s.signs.map((x) => `            <li>${esc(x)}</li>`).join('\n')}
          </ul>
        </div>

        <aside class="side-card">
          <h2 class="side-card__title">Why True Blue</h2>
          <ul class="ticks">
            <li>The owners quote the job and do the work</li>
            <li>Every quote itemised in writing</li>
            <li>If we find something unexpected, you hear before we touch it</li>
          </ul>
          <p class="side-card__areas">Working across ${esc(BIZ.areas.join(', '))} and surrounds. <a href="${r}service-areas/">All areas</a></p>
          <a href="tel:${MAIN_PHONE.tel}" class="btn btn--primary">${ICON_PHONE}${MAIN_PHONE.display}</a>
        </aside>
      </div>
    </section>

    <section class="faq section">
      <div class="container">
        <div class="section__header">
          <h2 class="section__title">${esc(s.name)} <span>questions</span></h2>
        </div>
        ${faqList(s.faq)}
      </div>
    </section>

    <section class="section related">
      <div class="container">
        <h2 class="section__title">Related <span>services</span></h2>
        <div class="related__grid">
${s.related.map((slug) => `          <a class="service-card related__card" href="${r}${slug}/"><h3 class="service-card__title">${esc(bySlug[slug].name)}</h3><p class="service-card__desc">${esc(bySlug[slug].lead)}</p></a>`).join('\n')}
        </div>
      </div>
    </section>

    ${ctaBand(r, `Get a free ${s.short.toLowerCase()} quote`)}`;
  return page(head({ title: s.title, description: s.description, path: `${s.slug}/`, extraLd: ld, r }), r, body);
}

/* ── Service areas page ── */
function areasPage() {
  const r = '../';
  const url = `${SITE}${AREAS_PAGE.slug}/`;
  const ld = [breadcrumbNode([['Home', SITE], ['Service areas', url]])];
  const body = `    <section class="page-hero">
      <div class="container">
        ${breadcrumbs(r, 'Service areas')}
        <span class="section__badge">${esc(BIZ.region)}</span>
        <h1 class="page-hero__title">${esc(AREAS_PAGE.h1)}</h1>
        <p class="page-hero__lead">${esc(AREAS_PAGE.lead)}</p>
      </div>
    </section>

    <section class="section prose-section">
      <div class="container">
        <ul class="area-list">
${BIZ.areas.map((a) => `          <li>${esc(a)}</li>`).join('\n')}
        </ul>
        <div class="prose">
          <h2>What we do in these areas</h2>
          <ul class="ticks">
${SERVICES.map((s) => `            <li><a href="${r}${s.slug}/">${esc(s.name)}</a></li>`).join('\n')}
          </ul>
        </div>
      </div>
    </section>

    ${ctaBand(r)}`;
  return page(head({ title: AREAS_PAGE.title, description: AREAS_PAGE.description, path: `${AREAS_PAGE.slug}/`, extraLd: ld, r }), r, body);
}

/* ── Homepage: refresh the marked regions ── */
function syncIndex() {
  const file = join(ROOT, 'index.html');
  let html = readFileSync(file, 'utf8');
  const regions = {
    jsonld: jsonld({ '@context': 'https://schema.org', '@graph': [businessNode(), { '@type': 'WebSite', '@id': `${SITE}#website`, url: SITE, name: BIZ.name, publisher: { '@id': `${SITE}#business` } }, faqNode(readHomeFaq(html))] }),
    header: header(''),
    footer: footer('')
  };
  for (const [name, content] of Object.entries(regions)) {
    const re = new RegExp(`(<!-- @${name} -->)[\\s\\S]*?(<!-- @/${name} -->)`);
    if (!re.test(html)) throw new Error(`index.html is missing the <!-- @${name} --> markers`);
    html = html.replace(re, `$1\n  ${content}\n  $2`);
  }
  writeFileSync(file, html);
}

// The homepage FAQ schema is read from the visible FAQ, so the two can't drift.
function readHomeFaq(html) {
  const out = [];
  const re = /<button class="faq-item__question"[^>]*>\s*([\s\S]*?)\s*<svg[\s\S]*?<div class="faq-item__answer-inner">([\s\S]*?)<\/div>/g;
  const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&mdash;/g, '—').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  for (const m of html.matchAll(re)) out.push([strip(m[1]), strip(m[2])]);
  return out;
}

/* ── sitemap.xml and llms.txt ── */
function sitemap() {
  const urls = ['', ...SERVICES.map((s) => `${s.slug}/`), `${AREAS_PAGE.slug}/`];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
}

function llms() {
  return `# ${BIZ.name}

> Owner-operated roof restoration and repair business in ${BIZ.region}, Victoria, Australia. The owners quote every job and do the work, and every quote is itemised in writing.

- Phone: ${BIZ.phones.map((p) => `${p.display} (${p.label})`).join(', ')}
- Email: ${BIZ.email}
- Hours: ${BIZ.hours}
- ABN: ${BIZ.abn}
- Service areas: ${BIZ.areas.join(', ')}

## Services

${SERVICES.map((s) => `- [${s.name}](${SITE}${s.slug}/): ${s.lead}`).join('\n')}

## More

- [Service areas](${SITE}${AREAS_PAGE.slug}/)
- [Home, FAQ and quote form](${SITE})
`;
}

/* ── Write everything ── */
for (const s of SERVICES) {
  const out = join(ROOT, s.slug, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, servicePage(s));
}
mkdirSync(join(ROOT, AREAS_PAGE.slug), { recursive: true });
writeFileSync(join(ROOT, AREAS_PAGE.slug, 'index.html'), areasPage());
syncIndex();
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap());
writeFileSync(join(ROOT, 'llms.txt'), llms());
console.log(`Built ${SERVICES.length} service pages, service-areas, sitemap.xml, llms.txt; synced index.html`);
