/* Big Number — light motion only: the digits drop in, the stickers slap on, the ticker speeds up with the
   scroll, headings rise out of their lines, and the header and call bar arrive once the number has gone. */
gsap.registerPlugin(ScrollTrigger, SplitText);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s) => document.querySelector(s);

if (window.Lenis && !reduce) {
  const lenis = new Lenis({ lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    e.preventDefault(); lenis.scrollTo(id, { duration: 1.4, offset: id === '#top' ? 0 : -60 });
  }));
}

// Header (desktop) and call bar (phones) arrive once the big number has scrolled away.
ScrollTrigger.create({ trigger: '.num', start: 'bottom top', end: 'max', onToggle: (s) => { $('.bar').classList.toggle('on', s.isActive); $('.callbar').classList.toggle('on', s.isActive); } });

// Ticker: loops on its own, runs faster while you scroll.
const loop = gsap.to('.ticker__row', { xPercent: -50, ease: 'none', duration: 30, repeat: -1 });
let boost = 0;
ScrollTrigger.create({ onUpdate: (s) => { boost = Math.min(6, Math.abs(s.getVelocity()) / 250); } });
gsap.ticker.add(() => { loop.timeScale(reduce ? 0 : 1 + boost); boost *= 0.93; });

// Stickers wobble when you touch them.
gsap.utils.toArray('.sticker').forEach((el) => {
  const flip = (s) => gsap.to(el, { scale: s, rotation: -gsap.getProperty(el, 'rotation'), duration: 0.35, ease: 'back.out(3)' });
  el.addEventListener('pointerenter', () => flip(1.08));
  el.addEventListener('pointerleave', () => flip(1));
});

// The number ripples under the mouse on desktop.
gsap.matchMedia().add('(hover: hover) and (min-width: 901px)', () => {
  const ds = gsap.utils.toArray('.num .d'), num = $('.num');
  const to = ds.map((d) => gsap.quickTo(d, 'y', { duration: 0.5, ease: 'power3.out' }));
  const move = (e) => ds.forEach((d, i) => { const r = d.getBoundingClientRect(), dx = (e.clientX - (r.left + r.width / 2)) / r.width; to[i](-Math.max(0, 1 - Math.abs(dx) / 2.2) * 0.12 * r.height); });
  const leave = () => to.forEach((f) => f(0));
  num.addEventListener('pointermove', move); num.addEventListener('pointerleave', leave);
  return () => { num.removeEventListener('pointermove', move); num.removeEventListener('pointerleave', leave); };
});

if (!reduce) {
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero__mark', { scale: 0.94, autoAlpha: 0, duration: 1.6, transformOrigin: '70% 100%' }, 0)
    .from('.hero__h1', { y: 18, autoAlpha: 0, duration: 0.8 }, 0.1)
    .from('.num .d', { yPercent: -60, autoAlpha: 0, duration: 0.7, stagger: 0.05, ease: 'back.out(2.2)' }, 0.2)
    .from('.hero__who', { y: 14, autoAlpha: 0, duration: 0.7 }, 0.75)
    .from('.sticker', { scale: 1.9, autoAlpha: 0, rotation: (i) => [40, -30, 28][i], duration: 0.45, stagger: 0.12, ease: 'back.out(2.4)' }, 0.85)
    .from('.hero__online', { y: 14, autoAlpha: 0, duration: 0.7 }, 1.1);
  gsap.to('.hero__mark', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  document.fonts.ready.then(() => {
    gsap.utils.toArray('.big').forEach((h) => {
      const split = SplitText.create(h, { type: 'lines', mask: 'lines' });
      gsap.from(split.lines, { yPercent: 105, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: h, start: 'top 85%' } });
    });
    const rise = (targets, trigger, extra = {}) => gsap.from(targets, { y: 44, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger, start: 'top 82%' }, ...extra });
    rise('.row', '.rows');
    rise('.how__steps li', '.how__steps', { stagger: 0.12 });
    rise('.qa', '.faq__grid');
    rise('.quote__phones a, .quote__phones p, .form label, .form button', '.quote__grid', { y: 30, stagger: 0.05 });
    gsap.fromTo('.how__line span', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.how', start: 'top 70%', end: 'bottom 75%', scrub: true } });
    gsap.utils.toArray('.honest__line').forEach((l, i) => gsap.fromTo(l, { xPercent: i % 2 ? 16 : -16 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: l, start: 'top bottom', end: 'top 50%', scrub: true } }));
    gsap.from('.burb', { yPercent: 60, autoAlpha: 0, rotation: () => gsap.utils.random(-8, 8), stagger: 0.05, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: '.burbs', start: 'top 82%' } });
    gsap.from('.anyway a', { scale: 1.6, autoAlpha: 0, rotation: 12, duration: 0.5, ease: 'back.out(2.5)', scrollTrigger: { trigger: '.anyway', start: 'top 88%' } });
  });
}
