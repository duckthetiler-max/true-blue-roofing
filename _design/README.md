# Design workspace (not published)

Folders starting with `_` are skipped by GitHub Pages, so nothing here goes live. This is where the redesign was worked out before it's built into the real pages.

**Status (23 Oct 2026):** round 3. The owners turned down the round 2 directions below as too generic and not flashy enough, with stock photos that looked fake and colours and fonts they didn't like. Three new prototypes are in `proto/`. They use no photos at all: the art is drawn in code, in 3D or in type. The owners haven't picked one yet. Previews are in `proto/previews/`:

| | Prototype | Feel |
|---|---|---|
| 1 | Golden Hour | Cinematic and premium. A live sky shader turns from day to dusk as you scroll, over a generated suburban skyline. Big serif type, line drawings that draw themselves, a pinned cutaway of the ridge. |
| 2 | Blueprint | Interactive 3D. A house is modelled in the browser and builds itself from a blueprint. As you scroll, the roof is washed, cracked tiles come out and go back in, the ridge is re-bedded and pointed, and the coat goes on. Visitors pick the coat colour and can drag the house round at the end. |
| 3 | Big Number | Simple and punchy. Electric blue, safety yellow and black, a giant tap-to-call number, stickers and big type. |

### Round 3 prototypes (`proto/`)

```sh
cd _design/proto
npm ci
node build.mjs     # writes out/p1, out/p2 and out/p3
npm run serve      # then open http://localhost:8150/p1/ (or p2, p3)
```

- `src/data.mjs` holds every fact the pages use. It only repeats what is already on the live site: no reviews, ratings, warranties or licences. Coat colours have plain names, not brand names.
- `src/art.mjs` draws the Golden Hour skyline and service line drawings. `src/p2.js` models the house and roof (about 1,000 tiles) in three.js.
- `tools/shots.cjs` takes storyboard screenshots, `tools/video.cjs` records scroll-through videos frame by frame on a virtual clock, and `tools/sheet.py` makes contact sheets. They need Playwright with Chromium and the site served on port 8150. Adding `?snap` to the Blueprint page makes the 3D scene jump straight to the scroll position, for storyboards.
- Libraries: GSAP 3.15 with ScrollTrigger, SplitText and DrawSVG (free under GSAP's standard licence), Lenis (MIT), three.js r186 (MIT). Fonts: Instrument Serif, Inter Tight, Space Grotesk, JetBrains Mono, Anton and Archivo (SIL Open Font Licence).
- These are prototypes, not the finished site. Whichever is picked gets rebuilt into the real pages, keeping the SEO work on this branch (service pages, structured data, sitemap). If it's Blueprint, the real build should also bundle only the parts of three.js it uses (the prototype loads the whole library) and show a still image where WebGL isn't available.

### Round 2 (turned down)

Previews are in `previews/`:

| | Direction | Feel |
|---|---|---|
| A | Blue Sky | Light and photo-led, with the quote form up front |
| B | Ute Signage | Dark navy and bold, in the logo's colours, with the photo inside the logo's roofline |
| C | Terracotta & Blue | Warm and friendly, with arched frames and a roof-tile pattern |

## What's in here

- `brand/`: the logo rebuilt as vector files from the original artwork. The original `assets/logo.png` has a fake "transparent" checkerboard baked into it. The roofs and window are redrawn as exact geometry, and the wordmark is traced (`logo/trace.cjs`, `logo/paths-final.json`).
  - `logo-horizontal-*`, `logo-stacked-*`, `mark-*`: `-light` versions for light backgrounds, `-dark` versions for dark ones. For colour backgrounds: `logo-horizontal-white` is white with a lit gold window, `mark-white` is all white, and `logo-horizontal-ink` is all near-black.
  - `roof-*.svg`: the roof on its own, sized to sit exactly on the house-shaped photo frame used in direction B.
  - `favicon.svg`: the browser-tab icon.
- `photos/`: licensed stock photos used in round 2, resized to WebP at several widths (see below).
- `proto/`: the round 3 prototypes (see above).
- `mock/`: the round 2 directions. Shared content and components, Tailwind CSS v4, self-hosted fonts (Fontsource) and Lucide icons.

## Rebuild the round 2 previews

```sh
cd _design
npm ci
node mock/build.mjs      # writes out/d1.html, d2.html, d3.html and out/site.css
```

## Photo licences

Photos are from the **Adobe Stock free collection**, licensed at no cost on 22 Oct 2026 through the Adobe account connected to the Claude session, under the Adobe Stock Standard License. They are generic roof photos, **not True Blue's own jobs**, and must not be captioned as if they were. The footer says stock photography is used. Replace them with real job photos as soon as there are some.

| File slug | Adobe Stock ID | Subject |
|---|---|---|
| tiles-blue-sky | 290058910 | Red roof tiles under a blue sky |
| roof-chimney-sky | 292407393 | Red roof and chimney against a blue sky |
| roof-restored-clouds | 88332627 | Tiled roof, blue sky with clouds |
| roof-horizon-sky | 281651268 | Orange tile roof slope against the sky |
| tiles-sunlit-texture | 1899597419 | Terracotta tile texture |
| tiles-close | 712703390 | Clay tiles close-up |
| tiles-mossy | 231569372 | Roof tiles covered in moss |
| tiles-scrubbing | 440117772 | Scraping lichen off roof tiles |
| ceiling-leak-stain | 409230501 | Water stain on a ceiling |
| tiles-storm-damage | 605982507 | Storm-damaged terracotta tiles |
| concrete-tile-roof | 490466110 | Concrete tile roof, blue sky |
| tiles-low-angle-sky | 659108788 | Red tile roof under a blue sky |

Also licensed but not used: 368852672 and 368852758 (roof pressure cleaning, people in shot), 758031976 (a European dry-ridge system, which doesn't match how Australian ridges are bedded).

Fonts are under the SIL Open Font Licence (Inter, Archivo, Barlow, Barlow Condensed, Bricolage Grotesque). Icons are Lucide (ISC licence).
