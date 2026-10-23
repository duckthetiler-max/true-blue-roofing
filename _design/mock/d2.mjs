// Direction 2 — "Ute Signage": dark navy, bold condensed type, the logo's roofline as the motif.
import { BIZ, SERVICES, STEPS, WHY } from './data.mjs';
import { esc, icon, pic, telLink, ridgeDiagram, areaMap, mobileBar } from './parts.mjs';
import { head, quoteForm, faqList, footer, tail } from './shared-html.mjs';

const NAV = [['Services', '#services'], ['How we work', '#how'], ['Areas', '#areas'], ['FAQ', '#faq']];

export default function d2() {
  return `${head('Roof Restoration South East Melbourne | True Blue Roof Restorations & Repairs', 't-ute')}
<header class="sticky top-0 z-40 border-b border-line bg-deep/90 backdrop-blur">
  <div class="wrap flex h-[4.75rem] items-center justify-between gap-6">
    <a href="#" class="shrink-0"><img src="brand/logo-horizontal-dark.svg" alt="${esc(BIZ.name)}" class="h-10 w-auto sm:h-12"></a>
    <nav class="hidden items-center gap-9 font-display text-lg font-bold tracking-wider text-white/75 uppercase lg:flex" aria-label="Main">${NAV.map(([t, h]) => `<a class="hover:text-brand" href="${h}">${t}</a>`).join('')}</nav>
    <div class="flex items-center gap-3">
      <a href="${telLink()}" class="btn btn-accent hidden sm:inline-flex">${icon('phone', 'size-5')}${BIZ.phones[0].display}</a>
      <details data-menu class="relative lg:hidden"><summary class="grid size-11 cursor-pointer list-none place-items-center border border-line text-white" aria-label="Menu">${icon('menu', 'size-6')}</summary>
        <div class="absolute right-0 mt-2 w-72 border border-line bg-surface p-2 shadow-2xl">${NAV.map(([t, h]) => `<a class="block px-4 py-3 font-display text-xl font-bold uppercase hover:bg-tint" href="${h}">${t}</a>`).join('')}<a class="btn btn-accent mt-2 w-full" href="#quote">Free quote</a></div></details>
    </div>
  </div>
</header>

<main>
<section class="relative overflow-hidden">
  <div aria-hidden="true" class="pitch-lines absolute inset-0 text-white opacity-[.035]"></div>
  <div class="wrap relative grid items-center gap-12 pt-12 pb-16 md:pt-16 lg:grid-cols-[1.15fr_.85fr] lg:pb-24">
    <div>
      <h1 class="flex items-center gap-3 font-display text-lg font-bold tracking-[.12em] text-brand uppercase"><span class="h-0.5 w-10 bg-brand"></span>Roof restoration &amp; repairs · South East Melbourne</h1>
      <p class="mt-5 font-display text-[3.4rem] leading-[.9] font-extrabold uppercase [text-wrap:balance] sm:text-[4.4rem] lg:text-[4.5rem] xl:text-[5rem]">Proper roof work.<span class="block text-brand">Priced in writing.</span></p>
      <p class="mt-7 max-w-xl text-lg leading-relaxed text-muted">A two-man roofing business. The owners quote your roof, do the work, and put every price in writing before anything starts.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#quote" class="btn btn-accent btn-lg">Get a free quote ${icon('arrow-right', 'size-5')}</a>
        <a href="${telLink()}" class="btn btn-ghost btn-lg text-brand">${icon('phone', 'size-5')}Call ${BIZ.phones[0].display}</a>
      </div>
      <dl class="mt-12 grid max-w-xl grid-cols-3 border-t border-line pt-6">
        ${[['Free', 'on-site quotes'], ['Itemised', 'written pricing'], ['2 owners', 'on every job']].map(([a, b]) => `<div><dt class="font-display text-3xl font-extrabold text-brand uppercase sm:text-4xl">${a}</dt><dd class="mt-1 text-sm text-muted sm:text-base">${b}</dd></div>`).join('')}
      </dl>
    </div>
    <div class="relative mx-auto mt-10 w-[78%] max-w-[30rem] lg:mt-16">
      <div class="house relative overflow-hidden">${pic('roof-chimney-sky', 'Terracotta tile roof and brick chimney against a deep blue sky', { sizes: '(min-width:1024px) 480px, 80vw', eager: true, cls: 'size-full object-cover' })}
        <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06182a]/85 to-transparent"></div>
        <p class="absolute bottom-5 left-6 font-display text-lg font-bold tracking-wider text-white uppercase sm:text-xl">Owner-operated · South East Melbourne</p>
      </div>
      <img src="brand/roof-dark.svg" alt="" class="house-roof pointer-events-none absolute drop-shadow-[0_12px_30px_rgba(37,216,243,.3)]">
    </div>
  </div>
</section>

<div class="overflow-hidden bg-accent py-4 text-accent-ink">
  <div class="marquee font-display text-2xl font-extrabold tracking-wide uppercase">${Array(2).fill(SERVICES.map((s) => `<span class="flex items-center gap-6 px-6">${esc(s.name)}<span class="size-2.5 rotate-45 bg-accent-ink"></span></span>`).join('')).join('')}</div>
</div>

<section id="services" class="py-20 md:py-28">
  <div class="wrap grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
    <div class="self-start lg:sticky lg:top-32">
      <p class="eyebrow">What we do</p>
      <h2 class="h2">Six jobs.<br>Done properly.</h2>
      <p class="lead">Tile roofs are our trade. Every job starts with the owners on your roof and a written, itemised quote.</p>
      <a href="#quote" class="btn btn-accent mt-8">Get a free quote ${icon('arrow-right', 'size-5')}</a>
    </div>
    <ol class="border-t border-line">
      ${SERVICES.map((s, i) => `<li class="border-b border-line"><a href="#" class="group grid grid-cols-[auto_1fr] items-center gap-5 py-6 sm:grid-cols-[auto_1fr_auto] sm:gap-7">
        <span class="font-display text-5xl font-extrabold text-transparent [-webkit-text-stroke:1.5px_var(--t-brand)] sm:text-6xl">${String(i + 1).padStart(2, '0')}</span>
        <span><span class="flex items-center gap-3 font-display text-3xl font-extrabold uppercase transition group-hover:text-brand sm:text-4xl">${esc(s.name)}</span><span class="mt-1.5 block max-w-md leading-relaxed text-muted">${esc(s.blurb)}</span></span>
        <span class="gable hidden aspect-[4/3.4] w-36 overflow-hidden sm:block">${pic(s.photo, s.alt, { sizes: '160px', cls: 'size-full object-cover transition duration-500 group-hover:scale-110' })}</span>
      </a></li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="relative bg-surface py-20 md:py-28">
  <div class="wrap grid items-center gap-12 lg:grid-cols-[.85fr_1.15fr]">
    <div>
      <p class="eyebrow">Inside the job</p>
      <h2 class="h2">Where old roofs leak</h2>
      <p class="lead">A perished ridge bed is the most common failure on an old tile roof, and you can't see it from the driveway. Pointing over the top of it just buys the same failure again.</p>
      <ul class="mt-7 grid gap-3 text-lg">
        ${['Every cap off, the old bed chipped back to the tile', 'Fresh mortar both sides, caps to a string line', 'Flexible pointing that moves with the roof'].map((t) => `<li class="flex gap-3">${icon('check', 'mt-0.5 size-6 shrink-0 text-accent')}<span>${t}</span></li>`).join('')}
      </ul>
    </div>
    <figure class="border border-line bg-deep p-5 sm:p-8">${ridgeDiagram()}<figcaption class="mt-3 text-center text-sm text-muted">Cross-section of a ridge. Diagram, not to scale.</figcaption></figure>
  </div>
</section>

<section id="how" class="py-20 md:py-28">
  <div class="wrap">
    <div class="flex flex-wrap items-end justify-between gap-6"><div><p class="eyebrow">How we work</p><h2 class="h2">The job, start to finish</h2></div><p class="max-w-sm text-muted">Same two people from the first look to the last ridge cap. No call centre, no subbies.</p></div>
    <ol class="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      ${STEPS.map((s, i) => `<li class="bg-page p-7"><div class="flex items-center justify-between"><span class="font-display text-6xl leading-none font-extrabold text-accent">${i + 1}</span>${icon(s.icon, 'size-8 text-brand')}</div><h3 class="mt-6 font-display text-2xl font-extrabold uppercase">${s.title}</h3><p class="mt-2 leading-relaxed text-muted">${s.body}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="relative isolate overflow-hidden py-24 md:py-32">
  ${pic('tiles-sunlit-texture', '', { sizes: '100vw', cls: 'absolute inset-0 -z-20 size-full object-cover grayscale' })}
  <div class="absolute inset-0 -z-10 bg-[#06182a]/85 mix-blend-multiply"></div><div class="absolute inset-0 -z-10 bg-gradient-to-r from-[#06182a] via-[#06182a]/80 to-[#0e2a46]/40"></div>
  <div class="wrap grid gap-12 lg:grid-cols-2">
    <div><p class="eyebrow">Straight up</p><h2 class="h2">A new business.<br><span class="text-brand">An old trade.</span></h2>
      <p class="lead">True Blue is new, so you won't find a wall of reviews here yet. We'd rather earn them than write them. When customers put something in writing, it'll go here with their name on it.</p></div>
    <div class="grid gap-6 self-end">
      ${WHY.map((w) => `<div class="flex gap-5 border-l-4 border-accent bg-surface/80 p-5 backdrop-blur"><span class="text-brand">${icon(w.icon, 'size-7')}</span><div><h3 class="font-display text-2xl font-extrabold uppercase">${w.title}</h3><p class="mt-1 leading-relaxed text-muted">${w.body}</p></div></div>`).join('')}
    </div>
  </div>
</section>

<section id="areas" class="py-20 md:py-28">
  <div class="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
    <div class="order-2 border border-line lg:order-1">${areaMap()}</div>
    <div class="order-1 lg:order-2">
      <p class="eyebrow">Service area</p><h2 class="h2">South East Melbourne</h2>
      <p class="lead">From Clayton and Ringwood out to Pakenham, and down the bay to Mornington. Not on the list? Call. If we can get there, we'll come and quote.</p>
      <ul class="mt-8 flex flex-wrap gap-2">${BIZ.areas.map((a) => `<li class="border border-line px-4 py-2 font-display text-lg font-bold tracking-wide uppercase">${a}</li>`).join('')}</ul>
    </div>
  </div>
</section>

<section id="faq" class="bg-surface py-20 md:py-28">
  <div class="wrap grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
    <div><p class="eyebrow">FAQ</p><h2 class="h2">Fair questions</h2></div>
    ${faqList({ wrapCls: 'divide-y divide-line border-y border-line', itemCls: 'py-6', qCls: 'font-display text-2xl font-extrabold uppercase', aCls: 'mt-3 max-w-2xl text-lg leading-relaxed text-muted' })}
  </div>
</section>

<section id="quote" class="bg-accent py-20 text-accent-ink md:py-28">
  <div class="wrap grid items-center gap-12 lg:grid-cols-2">
    <div>
      <h2 class="font-display text-[3.2rem] leading-[.9] font-extrabold uppercase sm:text-7xl">Get a free<br>written quote</h2>
      <p class="mt-6 max-w-md text-lg font-medium">The owners come out, look at the roof with you, and put the price in writing. Call either of us direct.</p>
      <div class="mt-8 grid gap-3 sm:max-w-md">
        ${BIZ.phones.map((p) => `<a href="tel:${p.tel}" class="flex items-center justify-between border-2 border-accent-ink px-5 py-4 font-display text-3xl font-extrabold tracking-wide uppercase transition hover:bg-accent-ink hover:text-accent"><span class="text-lg">${p.label}</span>${p.display}</a>`).join('')}
      </div>
    </div>
    <div class="bg-deep p-6 text-white shadow-2xl sm:p-8">${quoteForm({ headingCls: 'font-display text-3xl font-extrabold uppercase' })}</div>
  </div>
</section>
</main>
${footer({ cls: 'bg-deep text-white/65' })}
${mobileBar({ callCls: 'bg-surface text-brand ring-1 ring-line', quoteCls: 'bg-accent text-accent-ink' })}
${tail}`;
}
