# Design workspace (not published)

Folders starting with `_` are skipped by GitHub Pages, so nothing here goes live. This is where the redesign was worked out before it's built into the real pages.

**Status (22 Oct 2026):** three homepage directions are ready. The owners haven't picked one yet. Previews are in `previews/`:

| | Direction | Feel |
|---|---|---|
| A | Blue Sky | Light and photo-led, with the quote form up front |
| B | Ute Signage | Dark navy and bold, in the logo's colours, with the photo inside the logo's roofline |
| C | Terracotta & Blue | Warm and friendly, with arched frames and a roof-tile pattern |

## What's in here

- `brand/`: the logo rebuilt as vector files from the original artwork. The original `assets/logo.png` has a fake "transparent" checkerboard baked into it. The roofs and window are redrawn as exact geometry, and the wordmark is traced (`logo/trace.cjs`, `logo/paths-final.json`).
  - `logo-horizontal-*`, `logo-stacked-*`, `mark-*`: `-light` versions for light backgrounds, `-dark` versions for dark ones.
  - `roof-*.svg`: the roof on its own, sized to sit exactly on the house-shaped photo frame used in direction B.
  - `favicon.svg`: the browser-tab icon.
- `photos/`: licensed stock photos, resized to WebP at several widths (see below).
- `mock/`: the three directions. Shared content and components, Tailwind CSS v4, self-hosted fonts (Fontsource) and Lucide icons.

## Rebuild the previews

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
