// Direction 1 — "Blue Sky": light, photographic, conversion-led.
import { BIZ, SERVICES, STEPS, WHY } from './data.mjs';
import { esc, icon, pic, telLink, ridgeDiagram, areaMap, mobileBar } from './parts.mjs';
import { head, quoteForm, faqList, footer, tail } from './shared-html.mjs';

const NAV = [['Services', '#services'], ['How we work', '#how'], ['Service areas', '#areas'], ['FAQ', '#faq']];

export default function d1() {
  return `${head('Roof Restoration South East Melbourne | True Blue Roof Restorations & Repairs', 't-sky')}
<div class="hidden bg-deep text-sm text-white/75 md:block">
  <div class="wrap flex items-center justify-between py-2">
    <p class="flex items-center gap-2">${icon('map-pin', 'size-4 text-[#7fd3fb]')}Owner-operated roofers across ${BIZ.region}</p>
    <p class="flex items-center gap-6"><span class="flex items-center gap-2">${icon('clock', 'size-4 text-[#7fd3fb]')}${BIZ.hours}</span><span>ABN ${BIZ.abn}</span></p>
  </div>
</div>
<header class="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
  <div class="wrap flex h-[4.5rem] items-center justify-between gap-6">
    <a href="#" class="shrink-0"><img src="brand/logo-horizontal-light.svg" alt="${esc(BIZ.name)}" class="h-9 w-auto sm:h-11"></a>
    <nav class="hidden items-center gap-8 text-[15px] font-semibold text-ink/80 lg:flex" aria-label="Main">${NAV.map(([t, h]) => `<a class="hover:text-brand-ink" href="${h}">${t}</a>`).join('')}</nav>
    <div class="flex items-center gap-3">
      <a href="${telLink()}" class="hidden items-center gap-3 md:flex"><span class="grid size-11 place-items-center rounded-full bg-tint text-brand-ink">${icon('phone', 'size-5')}</span><span class="leading-tight"><span class="block text-xs font-medium text-muted">Call Lochlan</span><span class="font-bold">${BIZ.phones[0].display}</span></span></a>
      <a href="#quote" class="btn btn-accent hidden sm:inline-flex">Free quote</a>
      <details data-menu class="relative lg:hidden"><summary class="grid size-11 cursor-pointer list-none place-items-center rounded-xl border border-line" aria-label="Menu">${icon('menu', 'size-6')}</summary>
        <div class="absolute right-0 mt-2 w-72 rounded-2xl border border-line bg-white p-2 shadow-2xl">${NAV.map(([t, h]) => `<a class="block rounded-xl px-4 py-3 font-semibold hover:bg-tint" href="${h}">${t}</a>`).join('')}<a class="btn btn-accent mt-2 w-full" href="#quote">Free quote</a></div></details>
    </div>
  </div>
</header>

<main>
<section class="relative isolate overflow-hidden bg-deep">
  ${pic('tiles-blue-sky', 'Terracotta roof tiles under a blue sky', { sizes: '100vw', eager: true, cls: 'absolute inset-0 -z-20 size-full object-cover object-[50%_65%]' })}
  <div class="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b2239]/90 via-[#0b2239]/60 to-[#0b2239]/10"></div>
  <div class="wrap grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.25fr_.75fr] lg:py-24">
    <div class="text-white">
      <h1 class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/25 backdrop-blur">${icon('map-pin', 'size-4')}Roof restoration &amp; repairs · ${BIZ.region}</h1>
      <p class="display mt-6 font-display text-[2.7rem] leading-[1] font-extrabold tracking-tight [text-wrap:balance] sm:text-6xl lg:text-[3.6rem] xl:text-[3.9rem]">Roofs fixed properly.<span class="block text-[#8ddcff]">Priced in writing.</span></p>
      <p class="mt-6 max-w-xl text-lg leading-relaxed text-white/85">A two-man roofing business. The owners quote your roof, do the work, and put every price in writing before anything starts.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#quote" class="btn btn-accent btn-lg">Get a free quote ${icon('arrow-right', 'size-5')}</a>
        <a href="${telLink()}" class="btn btn-ghost btn-lg text-white">${icon('phone', 'size-5')}${BIZ.phones[0].display}</a>
      </div>
      <ul class="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[15px] font-semibold text-white/90">
        ${['Free on-site quotes', 'Itemised, written pricing', 'Owners on every job'].map((t) => `<li class="flex items-center gap-2">${icon('circle-check', 'size-5 text-[#8ddcff]')}${t}</li>`).join('')}
      </ul>
    </div>
    <div id="quote" class="rounded-3xl bg-white p-6 text-ink shadow-2xl shadow-black/30 sm:p-8">${quoteForm()}</div>
  </div>
</section>

<section id="services" class="py-20 md:py-28">
  <div class="wrap">
    <div class="flex flex-wrap items-end justify-between gap-6">
      <div class="max-w-2xl"><p class="eyebrow">What we do</p><h2 class="h2 display">Roof work for tile roofs, done properly</h2><p class="lead">Six jobs we know inside out. Each one starts with the owners looking at your roof and a written quote.</p></div>
      <a href="#quote" class="inline-flex items-center gap-2 font-bold text-brand-ink hover:underline">Get a free quote ${icon('arrow-right', 'size-5')}</a>
    </div>
    <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      ${SERVICES.map((s) => `<a href="#" class="group flex items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-line transition hover:shadow-xl hover:ring-brand/40 sm:block sm:overflow-hidden sm:p-0 sm:hover:-translate-y-1">
        <div class="size-24 shrink-0 overflow-hidden rounded-xl sm:aspect-[16/10] sm:size-auto sm:rounded-none">${pic(s.photo, s.alt, { sizes: '(min-width:1024px) 400px, (min-width:640px) 50vw, 96px', cls: 'size-full object-cover transition duration-500 group-hover:scale-105' })}</div>
        <div class="min-w-0 sm:p-6"><div class="flex items-center gap-3"><span class="hidden size-10 place-items-center rounded-xl bg-tint text-brand-ink sm:grid">${icon(s.icon, 'size-5')}</span><h3 class="font-display text-lg font-bold sm:text-xl">${esc(s.name)}</h3></div>
        <p class="mt-1 text-[15px] leading-snug text-muted sm:mt-3 sm:text-base sm:leading-relaxed">${esc(s.blurb)}</p><span class="mt-4 hidden items-center gap-1.5 font-semibold text-brand-ink sm:inline-flex">Learn more ${icon('arrow-right', 'size-4 transition group-hover:translate-x-1')}</span></div></a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="bg-tint py-20 md:py-28">
  <div class="wrap grid items-center gap-12 lg:grid-cols-[.85fr_1.15fr]">
    <div>
      <p class="eyebrow">Inside the job</p>
      <h2 class="h2 display">The ridge is where old tile roofs leak</h2>
      <p class="lead">A perished ridge bed is the most common failure on an old tile roof, and you can't see it from the driveway. Pointing over the top of it just buys the same failure again.</p>
      <ul class="mt-7 grid gap-3 text-[17px]">
        ${['Every cap comes off and the old bed is chipped back to the tile', 'Fresh mortar both sides, caps set to a string line', 'Flexible pointing over the joint, so it moves with the roof'].map((t) => `<li class="flex gap-3">${icon('circle-check', 'mt-0.5 size-6 shrink-0 text-brand')}<span>${t}</span></li>`).join('')}
      </ul>
      <a href="#" class="btn btn-deep mt-9">About re-bedding &amp; re-pointing ${icon('arrow-right', 'size-5')}</a>
    </div>
    <figure class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-line sm:p-8">${ridgeDiagram()}<figcaption class="mt-3 text-center text-sm text-muted">Cross-section of a ridge. Diagram, not to scale.</figcaption></figure>
  </div>
</section>

<section id="how" class="py-20 md:py-28">
  <div class="wrap">
    <div class="mx-auto max-w-2xl text-center"><p class="eyebrow">How we work</p><h2 class="h2 display">Straight up, start to finish</h2></div>
    <ol class="relative mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
      <div aria-hidden="true" class="absolute top-8 right-[12.5%] left-[12.5%] hidden h-0.5 bg-line md:block"></div>
      ${STEPS.map((s, i) => `<li class="relative text-center"><span class="relative mx-auto grid size-14 place-items-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30 md:size-16">${icon(s.icon, 'size-7')}</span>
        <p class="mt-5 text-sm font-bold tracking-widest text-brand-ink">STEP ${i + 1}</p><h3 class="mt-1 font-display text-xl font-bold">${s.title}</h3><p class="mx-auto mt-2 max-w-[16rem] text-muted">${s.body}</p></li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="relative overflow-hidden bg-deep py-20 text-white md:py-28">
  <div class="wrap grid items-center gap-14 lg:grid-cols-2">
    <div class="relative">
      ${pic('roof-restored-clouds', 'Terracotta tile roof under a blue sky with clouds', { sizes: '(min-width:1024px) 600px, 100vw', cls: 'aspect-[5/4] w-full rounded-3xl object-cover' })}
      <div class="absolute -bottom-6 left-6 max-w-[17rem] rounded-2xl bg-accent p-5 text-accent-ink shadow-xl"><p class="font-display text-xl leading-tight font-extrabold">A new business.<br>An old trade.</p></div>
    </div>
    <div>
      <p class="eyebrow !text-[#8ddcff]">Why True Blue</p>
      <h2 class="h2 display">You deal with the owners, start to finish</h2>
      <p class="lead !text-white/75">We're new, so you won't find a wall of reviews here yet. We'd rather earn them than write them. What you get instead:</p>
      <div class="mt-9 grid gap-7">
        ${WHY.map((w) => `<div class="flex gap-5"><span class="grid size-12 shrink-0 place-items-center rounded-xl bg-white/10 text-[#8ddcff] ring-1 ring-white/15">${icon(w.icon, 'size-6')}</span><div><h3 class="font-display text-xl font-bold">${w.title}</h3><p class="mt-1.5 leading-relaxed text-white/70">${w.body}</p></div></div>`).join('')}
      </div>
    </div>
  </div>
</section>

<section id="areas" class="py-20 md:py-28">
  <div class="wrap grid items-center gap-12 lg:grid-cols-2">
    <div>
      <p class="eyebrow">Service area</p>
      <h2 class="h2 display">Working across South East Melbourne</h2>
      <p class="lead">From Clayton and Ringwood out to Pakenham, and down the bay to Mornington. Not on the list? Call us. If we can get there, we'll come and quote.</p>
      <ul class="mt-8 flex flex-wrap gap-2.5">${BIZ.areas.map((a) => `<li class="chip bg-tint text-ink">${icon('map-pin', 'size-4 text-brand')}${a}</li>`).join('')}</ul>
    </div>
    <div class="overflow-hidden rounded-3xl shadow-sm ring-1 ring-line">${areaMap()}</div>
  </div>
</section>

<section id="faq" class="bg-tint py-20 md:py-28">
  <div class="wrap max-w-3xl">
    <div class="text-center"><p class="eyebrow">FAQ</p><h2 class="h2 display">Questions we get asked</h2></div>
    ${faqList({ wrapCls: 'mt-10 divide-y divide-line rounded-2xl bg-white ring-1 ring-line' })}
  </div>
</section>

<section class="relative isolate overflow-hidden py-20 text-center text-white md:py-28">
  ${pic('roof-horizon-sky', '', { sizes: '100vw', cls: 'absolute inset-0 -z-20 size-full object-cover' })}
  <div class="absolute inset-0 -z-10 bg-gradient-to-br from-[#0b2239]/92 via-[#0b2239]/72 to-[#0a76aa]/55"></div>
  <div class="wrap">
    <h2 class="h2 display mx-auto max-w-3xl">Get a free, written quote</h2>
    <p class="lead mx-auto !text-white/85">The owners come out, look at the roof with you, and put the price in writing. Call either of us, or send your details.</p>
    <div class="mt-9 flex flex-wrap justify-center gap-3">
      ${BIZ.phones.map((p, i) => `<a href="tel:${p.tel}" class="btn btn-lg ${i ? 'btn-ghost text-white' : 'btn-accent'}">${icon('phone', 'size-5')}${p.label} ${p.display}</a>`).join('')}
    </div>
  </div>
</section>
</main>
${footer()}
${mobileBar({ callCls: 'bg-deep text-white', quoteCls: 'bg-accent text-accent-ink' })}
${tail}`;
}
