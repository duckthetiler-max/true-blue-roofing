// HTML pieces several directions reuse (head, quote form, FAQ, footer).
import { BIZ, SERVICES, FAQ } from './data.mjs';
import { esc, icon, telLink } from './parts.mjs';

export function head(title, theme) {
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="preload" href="fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="site.css">
<link rel="icon" href="brand/favicon.svg" type="image/svg+xml">
</head>
<body class="${theme} bg-page font-body text-ink antialiased pb-[4.75rem] md:pb-0">`;
}

export function quoteForm({ heading = 'Get your free quote', sub = "Tell us about the roof and we'll call you back to book a time.", headingCls = 'font-display text-2xl font-extrabold' } = {}) {
  const opts = SERVICES.map((s) => `<option>${esc(s.name)}</option>`).join('');
  return `<form class="grid gap-4" action="#" onsubmit="return false">
    <div><h2 class="${headingCls}">${esc(heading)}</h2><p class="mt-1 text-sm opacity-75">${esc(sub)}</p></div>
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="field">Name<input name="Name" autocomplete="name" required placeholder="Your name"></label>
      <label class="field">Phone<input name="Phone" type="tel" autocomplete="tel" required placeholder="04xx xxx xxx"></label>
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="field">Suburb<input name="Suburb" autocomplete="address-level2" placeholder="e.g. Berwick"></label>
      <label class="field">Service<select name="Service"><option value="">Not sure yet</option>${opts}</select></label>
    </div>
    <label class="field"><span>Anything we should know? <span class="font-normal opacity-70">(optional)</span></span><textarea name="Details" rows="3" placeholder="Roof type, what you've noticed, best time to call"></textarea></label>
    <button class="btn btn-accent btn-lg w-full" type="submit">Send my request ${icon('arrow-right', 'size-5')}</button>
    <p class="text-center text-xs opacity-70">No obligation. Prefer to talk? Call <a class="font-semibold underline" href="${telLink()}">${BIZ.phones[0].display}</a>.</p>
  </form>`;
}

export function faqList({ wrapCls, itemCls = 'p-6', qCls = 'font-display text-lg font-bold', aCls = 'mt-3 leading-relaxed opacity-80' }) {
  return `<div class="${wrapCls}">${FAQ.map(([q, a]) => `
    <details class="group ${itemCls}"><summary class="flex cursor-pointer list-none items-center justify-between gap-6 ${qCls}">${esc(q)}<span class="shrink-0 transition-transform group-open:rotate-45">${icon('plus', 'size-6')}</span></summary><p class="${aCls}">${esc(a)}</p></details>`).join('')}
  </div>`;
}

export function footer({ cls = 'bg-deep text-white/70', logo = 'brand/logo-horizontal-dark.svg', headCls = 'text-white' } = {}) {
  const svc = SERVICES.map((s) => `<li><a class="hover:text-white" href="#">${esc(s.name)}</a></li>`).join('');
  const phones = BIZ.phones.map((p) => `<li><a class="hover:text-white" href="tel:${p.tel}">${p.display} — ${p.label}</a></li>`).join('');
  return `<footer class="${cls}">
  <div class="wrap grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
    <div><img src="${logo}" alt="${esc(BIZ.name)}" class="h-11 w-auto"><p class="mt-5 max-w-xs text-sm leading-relaxed">Roof restoration and repairs across ${BIZ.region}. Owner-operated, and straight with you about what your roof actually needs.</p></div>
    <div><h2 class="text-sm font-bold uppercase tracking-widest ${headCls}">Services</h2><ul class="mt-4 grid gap-2.5 text-sm">${svc}</ul></div>
    <div><h2 class="text-sm font-bold uppercase tracking-widest ${headCls}">Company</h2><ul class="mt-4 grid gap-2.5 text-sm"><li><a class="hover:text-white" href="#how">How we work</a></li><li><a class="hover:text-white" href="#areas">Service areas</a></li><li><a class="hover:text-white" href="#faq">FAQ</a></li><li><a class="hover:text-white" href="#quote">Free quote</a></li></ul></div>
    <div><h2 class="text-sm font-bold uppercase tracking-widest ${headCls}">Contact</h2><ul class="mt-4 grid gap-2.5 text-sm">${phones}<li><a class="hover:text-white" href="mailto:${BIZ.email}">${BIZ.email}</a></li><li>${BIZ.region}</li><li>${BIZ.hours}</li></ul></div>
  </div>
  <div class="border-t border-white/10"><div class="wrap flex flex-wrap justify-between gap-3 py-6 text-xs"><p>&copy; 2026 ${esc(BIZ.name)} &middot; ABN ${BIZ.abn}</p><p>Stock photography used under licence.</p></div></div>
</footer>`;
}

export const tail = `<script>document.querySelectorAll('details[data-menu] a').forEach(a=>a.addEventListener('click',()=>a.closest('details').removeAttribute('open')));</script>
</body></html>`;
