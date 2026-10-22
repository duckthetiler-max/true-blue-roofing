// Shared content for the three design directions. Only facts already on the
// live site are used: no reviews, ratings, warranties or licences are claimed.

export const BIZ = {
  name: 'True Blue Roof Restorations & Repairs',
  phones: [
    { label: 'Lochlan', display: '0451 174 122', tel: '+61451174122' },
    { label: 'Rhys', display: '0435 239 766', tel: '+61435239766' }
  ],
  email: 'info@trueblueroofrandr.com.au',
  abn: '69 531 693 315',
  region: 'South East Melbourne',
  hours: 'Mon–Sat, 7am – 5pm',
  areas: ['Berwick', 'Narre Warren', 'Cranbourne', 'Pakenham', 'Dandenong', 'Clayton', 'Ringwood', 'Frankston', 'Mornington']
};

export const SERVICES = [
  { slug: 'roof-restoration', name: 'Roof restoration', icon: 'house', photo: 'roof-restored-clouds',
    alt: 'Terracotta tile roof under a blue sky',
    blurb: 'Clean, replace broken tiles, re-bed and re-point the ridge, then prime and coat. In that order.' },
  { slug: 'roof-repointing', name: 'Re-bedding & re-pointing', icon: 'brick-wall', photo: 'tiles-low-angle-sky',
    alt: 'Rows of curved terracotta roof tiles against the sky',
    blurb: 'Caps off, old bed chipped back, fresh mortar to a string line, flexible pointing over the top.' },
  { slug: 'roof-tile-replacement', name: 'Tile replacement', icon: 'layers', photo: 'tiles-storm-damage',
    alt: 'Broken terracotta roof tiles under a stormy sky',
    blurb: 'Cracked or slipped tiles swapped properly and hooked back on the batten. No silicone patches.' },
  { slug: 'roof-cleaning', name: 'Pressure cleaning', icon: 'droplets', photo: 'tiles-scrubbing',
    alt: 'Lichen being cleaned off terracotta roof tiles',
    blurb: 'Moss, lichen and years of grime off, so you can see what the roof really looks like.' },
  { slug: 'roof-painting', name: 'Roof painting', icon: 'paint-roller', photo: 'concrete-tile-roof',
    alt: 'Concrete tile roof against a blue sky',
    blurb: 'Primer, then two coats of membrane, once the roof underneath is sound.' },
  { slug: 'roof-leak-repair', name: 'Leak repairs', icon: 'cloud-rain', photo: 'ceiling-leak-stain',
    alt: 'Water stain on a ceiling cornice from a roof leak',
    blurb: 'We trace the water to where it gets in and fix that, not the stain.' }
];

export const STEPS = [
  { icon: 'calendar-check', title: 'We come out', body: 'The owners look at the roof with you. Free, no obligation.' },
  { icon: 'file-text', title: 'Written quote', body: 'Materials, labour and days on site, each on its own line.' },
  { icon: 'hard-hat', title: 'We do the work', body: 'The same two blokes who quoted it, on your roof.' },
  { icon: 'message-square', title: 'No surprises', body: 'Find something unexpected? You hear before we touch it.' }
];

export const WHY = [
  { icon: 'user-round-check', title: 'The owners on every job', body: 'Lochlan and Rhys quote it, do it, and answer the phone afterwards. No subbies you have never met.' },
  { icon: 'clipboard-check', title: 'Itemised, written quotes', body: 'Every quote shows materials, labour and days on site, so you can see how the number is built.' },
  { icon: 'eye', title: 'You hear before we touch it', body: 'If we find something unexpected up there, we tell you first. Not on the invoice.' }
];

export const FAQ = [
  ['How long does a full roof restoration take?', 'Most full roof restorations are completed within 2–4 days, depending on the size and condition of the roof. You get a clear timeline with the quote.'],
  ['How much does a roof restoration cost?', 'Every roof is different, so there is no flat rate. You get a written quote that shows how the number is built — materials, labour and days on site, each on its own line — before you commit to anything.'],
  ['Why does the ridge matter so much?', 'A rotten ridge bed is the most common failure on an old tile roof, and it is invisible from the ground. We take the caps off, chip the old bed back, re-bed them and finish with flexible pointing.'],
  ['Do I need to be home during the work?', 'Not at all. As long as we have access to the roof and the areas around it, you are free to go about your day. We will let you know when we are done.']
];
