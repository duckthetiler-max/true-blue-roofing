// Direction 3 — "Terracotta & Blue": warm, friendly, arched frames from the logo's window,
// a roman-tile scallop pattern, terracotta and true-blue as complementary colours.
import { BIZ, SERVICES, STEPS, WHY } from './data.mjs';
import { esc, icon, pic, telLink, ridgeDiagram, areaMap, mobileBar } from './parts.mjs';
import { head, quoteForm, faqList, footer, tail } from './shared-html.mjs';

const NAV = [['Services', '#services'], ['How we work', '#how'], ['Service areas', '#areas'], ['FAQ', '#faq']];

export default function d3() {
  return `${head('Roof Restoration South East Melbourne | True Blue Roof Restorations & Repairs', 't-terra')}
<header class="sticky top-0 z-40 border-b border-line bg-page/90 backdrop-blur">
  <div class="wrap flex h-[4.75rem] items-center justify-between gap-6">
    <a href="#" class="shrink-0"><img src="brand/logo-horizontal-light.svg" alt="${esc(BIZ.name)}" class="h-9 w-auto sm:h-11"></a>
    <nav class="hidden items-center gap-8 text-[15px] font-semibold text-ink/80 lg:flex" aria-label="Main">${NAV.map(([t, h]) => `<a class="hover:text-accent" href="${h}">${t}</a>`).join('')}</nav>
    <div class="flex items-center gap-2">
      <a href="${telLink()}" class="btn hidden text-ink hover:bg-tint md:inline-flex">${icon('phone', 'size-5 text-accent')}${BIZ.phones[0].display}</a>
      <a href="#quote" class="btn btn-accent hidden sm:inline-flex">Free quote</a>
      <details data-menu class="relative lg:hidden"><summary class="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-line bg-white" aria-label="Menu">${icon('menu', 'size-6')}</summary>
        <div class="absolute right-0 mt-2 w-72 rounded-3xl border border-line bg-white p-2 shadow-2xl">${NAV.map(([t, h]) => `<a class="block rounded-2xl px-4 py-3 font-semibold hover:bg-tint" href="${h}">${t}</a>`).join('')}<a class="btn btn-accent mt-2 w-full" href="#quote">Free quote</a></div></details>
    </div>
  </div>
</header>

<main>
<section class="relative overflow-hidden">
  <div class="wrap grid items-center gap-14 py-12 md:py-16 lg:grid-cols-[1fr_1fr] lg:py-20">
    <div>
      <h1 class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-line">${icon('map-pin', 'size-4 text-brand')}Roof restoration &amp; repairs in ${BIZ.region}</h1>
      <p class="mt-6 font-display text-[2.9rem] leading-[1.02] font-bold tracking-tight [text-wrap:balance] sm:text-6xl lg:text-[4.3rem]">An old trade, done the <span class="relative whitespace-nowrap text-accent">honest way.<svg aria-hidden="true" viewBox="0 0 300 20" class="absolute -bottom-2 left-0 w-full" preserveAspectRatio="none"><path d="M3 15 C 60 4, 140 3, 297 9" fill="none" stroke="#1c8fd0" stroke-width="5" stroke-linecap="round"/></svg></span></p>
      <p class="mt-7 max-w-xl text-lg leading-relaxed text-muted">We're a two-man roofing business in ${BIZ.region}. The owners quote your roof, do the work, and put every price in writing before anything starts.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#quote" class="btn btn-accent btn-lg">Get a free quote ${icon('arrow-right', 'size-5')}</a>
        <a href="${telLink()}" class="btn btn-lg bg-white text-ink ring-1 ring-line hover:bg-tint">${icon('phone', 'size-5 text-accent')}${BIZ.phones[0].display}</a>
      </div>
      <ul class="mt-9 grid gap-2.5 text-[15px] font-medium sm:grid-cols-3">
        ${['Free on-site quotes', 'Itemised, in writing', 'Owners on every job'].map((t) => `<li class="flex items-center gap-2">${icon('circle-check', 'size-5 text-brand')}${t}</li>`).join('')}
      </ul>
    </div>
    <div class="relative mx-auto w-full max-w-md lg:max-w-none">
      <div class="arch aspect-[4/4.6] overflow-hidden bg-tint shadow-2xl shadow-[#c2502a]/15 lg:ml-12">${pic('roof-restored-clouds', 'Terracotta tile roof under a blue sky with clouds', { sizes: '(min-width:1024px) 520px, 90vw', eager: true, cls: 'size-full object-cover' })}</div>
      <div class="absolute -right-2 top-8 hidden size-32 overflow-hidden rounded-full ring-8 ring-page sm:block lg:-right-4">${pic('tiles-close', 'Close-up of terracotta roof tiles', { sizes: '128px', cls: 'size-full object-cover' })}</div>
      <div class="absolute bottom-8 -left-2 flex items-center gap-3 rounded-2xl bg-white p-4 pr-6 shadow-xl ring-1 ring-line lg:left-0">
        <span class="grid size-12 place-items-center rounded-full bg-accent text-white">${icon('clipboard-check', 'size-6')}</span>
        <p class="leading-tight"><span class="block font-display text-lg font-bold">Every quote itemised</span><span class="text-sm text-muted">in writing, before we start</span></p>
      </div>
    </div>
  </div>
</section>

<div aria-hidden="true" class="tiles h-14 shadow-[inset_0_6px_10px_-6px_rgba(0,0,0,.25)]"></div>

<section id="services" class="bg-white py-20 md:py-28">
  <div class="wrap">
    <div class="mx-auto max-w-2xl text-center"><p class="eyebrow !text-accent">What we do</p><h2 class="h2">Everything your tile roof needs</h2><p class="lead mx-auto">From a single cracked tile to a full restoration. Every job starts with the owners on your roof and a written quote.</p></div>
    <div class="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      ${SERVICES.map((s) => `<a href="#" class="group">
        <div class="arch-top aspect-[4/3.3] overflow-hidden bg-tint">${pic(s.photo, s.alt, { sizes: '(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw', cls: 'size-full object-cover transition duration-700 group-hover:scale-105' })}</div>
        <div class="mt-5 flex items-start gap-4"><span class="grid size-11 shrink-0 place-items-center rounded-full bg-tint text-accent">${icon(s.icon, 'size-5')}</span>
        <div><h3 class="font-display text-2xl font-bold group-hover:text-accent">${esc(s.name)}</h3><p class="mt-1.5 leading-relaxed text-muted">${esc(s.blurb)}</p></div></div></a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="py-20 md:py-28">
  <div class="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
    <figure class="order-2 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-line sm:p-8 lg:order-1">${ridgeDiagram()}<figcaption class="mt-3 text-center text-sm text-muted">Cross-section of a ridge. Diagram, not to scale.</figcaption></figure>
    <div class="order-1 lg:order-2">
      <p class="eyebrow !text-accent">Inside the job</p>
      <h2 class="h2">The ridge is where old roofs give up first</h2>
      <p class="lead">A perished ridge bed is the most common failure on an old tile roof, and you can't see it from the driveway. Pointing over the top of it just buys the same failure again.</p>
      <ul class="mt-7 grid gap-3 text-[17px]">
        ${['Every cap comes off and the old bed is chipped back', 'Fresh mortar both sides, caps set to a string line', 'Flexible pointing that moves with the roof'].map((t) => `<li class="flex gap-3">${icon('circle-check', 'mt-0.5 size-6 shrink-0 text-brand')}<span>${t}</span></li>`).join('')}
      </ul>
    </div>
  </div>
</section>

<section id="how" class="bg-tint py-20 md:py-28">
  <div class="wrap grid items-start gap-14 lg:grid-cols-2">
    <div class="lg:sticky lg:top-28">
      <p class="eyebrow !text-accent">How we work</p>
      <h2 class="h2">Straight up, from first look to last cap</h2>
      <div class="arch mt-10 hidden aspect-[4/3.6] overflow-hidden lg:block">${pic('tiles-low-angle-sky', 'Curved terracotta roof tiles against the sky', { sizes: '520px', cls: 'size-full object-cover' })}</div>
    </div>
    <ol class="relative grid gap-5 before:absolute before:top-6 before:bottom-6 before:left-[1.65rem] before:w-0.5 before:bg-[#e2c9ae]">
      ${STEPS.map((s, i) => `<li class="relative flex gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-line"><span class="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-accent font-display text-lg font-bold text-white">${i + 1}</span>
        <div><h3 class="font-display text-2xl font-bold">${s.title}</h3><p class="mt-1.5 leading-relaxed text-muted">${s.body}</p></div></li>`).join('\n      ')}
      <li class="relative ml-16 rounded-3xl border-2 border-dashed border-[#e2c9ae] p-6"><p class="font-display text-xl font-bold">From the two of us</p><p class="mt-2 leading-relaxed text-muted">True Blue is new. The hands doing the work aren't: this is a qualified roof tiler's trade, done properly. We'd rather earn a review than write one.</p><p class="mt-4 font-display text-lg font-semibold text-accent italic">— Lochlan &amp; Rhys</p></li>
    </ol>
  </div>
</section>

<section class="py-20 md:py-28">
  <div class="wrap">
    <div class="mx-auto max-w-2xl text-center"><p class="eyebrow !text-accent">Why True Blue</p><h2 class="h2">What you can count on</h2></div>
    <div class="mt-12 grid gap-6 md:grid-cols-3">
      ${WHY.map((w) => `<div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-line"><span class="grid size-14 place-items-center rounded-2xl bg-[#e8f3fb] text-brand">${icon(w.icon, 'size-7')}</span><h3 class="mt-6 font-display text-2xl font-bold">${w.title}</h3><p class="mt-2 leading-relaxed text-muted">${w.body}</p></div>`).join('')}
    </div>
  </div>
</section>

<section id="areas" class="bg-white py-20 md:py-28">
  <div class="wrap grid items-center gap-12 lg:grid-cols-2">
    <div>
      <p class="eyebrow !text-accent">Service area</p>
      <h2 class="h2">Local to South East Melbourne</h2>
      <p class="lead">From Clayton and Ringwood out to Pakenham, and down the bay to Mornington. Not on the list? Give us a call. If we can get there, we'll come and quote.</p>
      <ul class="mt-8 flex flex-wrap gap-2.5">${BIZ.areas.map((a) => `<li class="chip bg-tint">${icon('map-pin', 'size-4 text-accent')}${a}</li>`).join('')}</ul>
    </div>
    <div class="overflow-hidden rounded-[2rem] ring-1 ring-line">${areaMap()}</div>
  </div>
</section>

<section id="faq" class="py-20 md:py-28">
  <div class="wrap max-w-3xl">
    <div class="text-center"><p class="eyebrow !text-accent">FAQ</p><h2 class="h2">Good questions</h2></div>
    ${faqList({ wrapCls: 'mt-10 grid gap-3', itemCls: 'rounded-3xl bg-white p-6 ring-1 ring-line', qCls: 'font-display text-xl font-bold' })}
  </div>
</section>

<section id="quote" class="relative overflow-hidden bg-accent py-20 text-white md:py-28">
  <div aria-hidden="true" class="tiles-light absolute inset-0 opacity-[.1]"></div>
  <div class="wrap relative grid items-center gap-12 lg:grid-cols-2">
    <div>
      <h2 class="font-display text-5xl leading-[1.02] font-bold tracking-tight sm:text-6xl">Get a free, written quote</h2>
      <p class="mt-6 max-w-md text-lg text-white/90">The owners come out, look at the roof with you, and put the price in writing. Call either of us, or send your details.</p>
      <div class="mt-8 grid gap-3 sm:max-w-sm">${BIZ.phones.map((p) => `<a href="tel:${p.tel}" class="flex items-center gap-4 rounded-full bg-white/10 px-5 py-3.5 ring-1 ring-white/30 transition hover:bg-white/20"><span class="grid size-10 place-items-center rounded-full bg-white text-accent">${icon('phone', 'size-5')}</span><span class="leading-tight"><span class="block text-sm text-white/75">${p.label}</span><span class="text-xl font-bold">${p.display}</span></span></a>`).join('')}</div>
    </div>
    <div class="rounded-[2rem] bg-white p-6 text-ink shadow-2xl sm:p-8">${quoteForm({ headingCls: 'font-display text-3xl font-bold' })}</div>
  </div>
</section>
</main>
${footer({ cls: 'bg-deep text-white/65' })}
${mobileBar({ callCls: 'bg-white text-ink ring-1 ring-line', quoteCls: 'bg-accent text-accent-ink' })}
${tail}`;
}
