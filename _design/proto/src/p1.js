/* Golden Hour — live sky shader + scroll choreography (GSAP ScrollTrigger, SplitText, DrawSVG, Lenis). */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Sky: a small fragment shader. Phase 0 = dawn, .5 = day, 1 = dusk, driven by scroll. ── */
  const canvas = document.getElementById('sky');
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  let skyVisible = true;
  if (gl) {
    const vs = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
    const fs = `precision highp float;
      varying vec2 v; uniform float t, phase, aspect; uniform vec2 sun;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
        return mix(mix(h(i), h(i + vec2(1, 0)), u.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), u.x), u.y); }
      float fbm(vec2 p){ float s = 0., a = .5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6); for (int i = 0; i < 6; i++) { s += a * n(p); p = m * p; a *= .5; } return s; }
      vec3 k3(vec3 a, vec3 b, vec3 c, float x){ return x < .5 ? mix(a, b, x * 2.) : mix(b, c, x * 2. - 1.); }
      void main(){
        float ph = phase;
        vec3 top = k3(vec3(.06,.11,.24), vec3(.10,.29,.62), vec3(.05,.07,.19), ph);
        vec3 mid = k3(vec3(.24,.31,.53), vec3(.30,.52,.84), vec3(.24,.18,.39), ph);
        vec3 low = k3(vec3(.85,.55,.45), vec3(.61,.78,.94), vec3(.79,.38,.42), ph);
        vec3 hor = k3(vec3(1.,.78,.57), vec3(.86,.94,1.), vec3(.96,.66,.42), ph);
        vec3 sunc = k3(vec3(1.,.84,.63), vec3(1.,1.,.97), vec3(1.,.70,.48), ph);
        vec3 lit = k3(vec3(1.,.78,.64), vec3(1.,1.,1.), vec3(.97,.66,.52), ph);
        vec3 shd = k3(vec3(.29,.31,.47), vec3(.66,.74,.85), vec3(.21,.17,.33), ph);
        float y = v.y;
        vec3 c = mix(hor, low, smoothstep(.0, .22, y));
        c = mix(c, mid, smoothstep(.18, .55, y));
        c = mix(c, top, smoothstep(.5, 1., y));
        vec2 uv = vec2(v.x * aspect, v.y);
        float d = distance(uv, vec2(sun.x * aspect, sun.y));
        c += sunc * (exp(-d * 5.) * .45 + exp(-d * 28.) * .9);
        vec2 q = vec2(uv.x * 1.3 + t * .012, y * 3.4);
        float a = fbm(q + vec2(0., t * .004));
        float b = fbm(q * 2.3 - vec2(t * .01, 0.));
        float dens = smoothstep(.5, .8, a * .78 + b * .32) * smoothstep(.12, .5, y);
        float toward = 1. - clamp(d * 1.1, 0., 1.);
        vec3 cloud = mix(shd, lit, clamp(b * 1.15 + toward * .55 - .15, 0., 1.));
        c = mix(c, cloud, dens * .82);
        c += (h(v * 913.7 + fract(t)) - .5) * .018;
        gl_FragColor = vec4(c, 1.);
      }`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s)); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = Object.fromEntries(['t', 'phase', 'aspect', 'sun'].map((k) => [k, gl.getUniformLocation(prog, k)]));
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (innerWidth < 900 ? 0.5 : 0.62);
    const resize = () => { canvas.width = Math.round(innerWidth * scale); canvas.height = Math.round(innerHeight * scale); gl.viewport(0, 0, canvas.width, canvas.height); };
    resize(); addEventListener('resize', resize);
    let mx = 0, my = 0, sx = 0, sy = 0;
    addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    const t0 = performance.now();
    const frame = (now) => {
      requestAnimationFrame(frame);
      if (!skyVisible) return;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = Math.min(1, Math.max(0, scrollY / max));
      sx += (mx - sx) * .04; sy += (my - sy) * .04;
      gl.uniform1f(U.t, reduce ? 0 : (now - t0) / 1000);
      gl.uniform1f(U.phase, p < .5 ? p * .5 : .25 + (p - .5) * 1.5);
      gl.uniform1f(U.aspect, innerWidth / innerHeight);
      gl.uniform2f(U.sun, .74 + sx * .03, .2 - sy * .02 + (1 - p) * .02);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    requestAnimationFrame(frame);
    const io = new IntersectionObserver((es) => { es.forEach((e) => { e.target._v = e.isIntersecting; }); skyVisible = [...document.querySelectorAll('.hero,.statement,.cta')].some((el) => el._v !== false); });
    document.querySelectorAll('.hero,.statement,.cta').forEach((el) => io.observe(el));
  } else {
    canvas.style.background = 'linear-gradient(#0f1c3d, #3c4f86 55%, #d98c73 85%, #ffc891)';
  }

  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

  /* ── Smooth scroll ── */
  if (!reduce && window.Lenis) {
    const lenis = new Lenis({ lerp: .09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href'); if (id.length < 2) return; e.preventDefault(); lenis.scrollTo(id, { offset: -30, duration: 1.6 });
    }));
  }
  const nav = document.querySelector('.nav');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => nav.classList.toggle('is-solid', s.scroll() > 60) });

  const allStrokes = (root) => root.querySelectorAll('path, rect, circle, ellipse');

  document.fonts.ready.then(() => {
    /* Hero intro */
    const title = SplitText.create('[data-split]', { type: 'lines,words', mask: 'lines' });
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro.from(title.words, { yPercent: 115, duration: 1.4, stagger: .07 }, .15)
      .from('[data-fade]', { y: 26, opacity: 0, duration: 1.2, stagger: .12 }, .45)
      .from('.skyline__near', { yPercent: 30, duration: 1.8 }, 0)
      .from('.skyline__far', { yPercent: 18, duration: 2 }, 0)
      .from('.nav', { y: -30, opacity: 0, duration: 1 }, .6);

    /* Word-by-word reveals tied to scroll */
    document.querySelectorAll('[data-words]').forEach((el) => {
      const s = SplitText.create(el, { type: 'words' });
      gsap.fromTo(s.words, { opacity: .12 }, { opacity: 1, ease: 'none', stagger: .1, scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: true } });
    });

    /* Display headings rise in */
    document.querySelectorAll('.display').forEach((el) => {
      const s = SplitText.create(el, { type: 'lines', mask: 'lines' });
      gsap.from(s.lines, { yPercent: 105, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
    ScrollTrigger.refresh();
  });

  /* Hero parallax */
  gsap.to('.hero__copy', { yPercent: -18, opacity: .15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.skyline__far', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    /* Services: pinned horizontal track */
    const track = document.querySelector('.work__track');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.work', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
    document.querySelectorAll('.panel').forEach((p) => {
      gsap.from(allStrokes(p.querySelector('.illo')), { drawSVG: 0, duration: 1.6, ease: 'power2.inOut', stagger: .04, scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 92%' } });
    });

    /* Ridge: pinned build-up */
    const labels = [...document.querySelectorAll('.ridge__labels li')];
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.ridge', start: 'top top', end: '+=180%', pin: '.ridge__stage', scrub: 1,
      onUpdate: (s) => labels.forEach((li, i) => li.classList.toggle('on', s.progress > .12 + i * .2)) } });
    tl.from('.r-structure path', { drawSVG: 0, stagger: .1, duration: 1 })
      .from('.r-tiles path', { drawSVG: 0, stagger: .1, duration: 1 }, '<.3')
      .from('.r-cap', { y: -70, opacity: 0, duration: 1 })
      .to('.r-cap', { y: -70, duration: .6 }, '+=.2')
      .from('.r-bed path', { drawSVG: 0, stagger: .05, duration: 1 })
      .to('.r-cap', { y: 0, duration: .8, ease: 'power2.inOut' })
      .from('.r-point path', { drawSVG: 0, duration: 1 }, '+=.1');
  });
  mm.add('(max-width: 900px)', () => {
    document.querySelectorAll('.panel').forEach((p) => {
      gsap.from(allStrokes(p.querySelector('.illo')), { drawSVG: 0, duration: 1.6, ease: 'power2.inOut', stagger: .04, scrollTrigger: { trigger: p, start: 'top 80%' } });
    });
    gsap.from('.ridge__svg path', { drawSVG: 0, duration: 1.5, stagger: .05, scrollTrigger: { trigger: '.ridge__svg', start: 'top 75%' } });
    document.querySelectorAll('.ridge__labels li').forEach((li) => li.classList.add('on'));
  });

  /* Process line */
  gsap.to('.how__line span', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.how__steps', start: 'top 70%', end: 'bottom 55%', scrub: true } });
  gsap.utils.toArray('.step').forEach((s) => gsap.from(s, { opacity: 0, x: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 82%' } }));

  /* CTA form lifts in */
  gsap.from('.glass', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.cta', start: 'top 65%' } });
})();
