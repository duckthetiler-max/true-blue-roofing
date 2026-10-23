// Builds the three prototypes into out/: vendor libraries, fonts, brand files and pages.
// Usage: node build.mjs [p1 p2 p3], then serve out/ with any static server.
import { mkdirSync, writeFileSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const R = dirname(fileURLToPath(import.meta.url));
const OUT = join(R, 'out');
const NM = join(R, 'node_modules');
for (const d of ['vendor', 'vendor/three/addons/environments', 'fonts', 'brand']) mkdirSync(join(OUT, d), { recursive: true });

const copy = (from, to) => cpSync(join(NM, from), join(OUT, to));
for (const f of ['gsap.min.js', 'ScrollTrigger.min.js', 'SplitText.min.js', 'DrawSVGPlugin.min.js']) copy(`gsap/dist/${f}`, `vendor/${f}`);
copy('lenis/dist/lenis.min.js', 'vendor/lenis.min.js');
copy('lenis/dist/lenis.css', 'vendor/lenis.css');
copy('three/build/three.module.js', 'vendor/three/three.module.js');
copy('three/build/three.core.js', 'vendor/three/three.core.js');
copy('three/examples/jsm/environments/RoomEnvironment.js', 'vendor/three/addons/environments/RoomEnvironment.js');

const FONTS = {
  '@fontsource/instrument-serif': ['instrument-serif-latin-400-normal.woff2', 'instrument-serif-latin-400-italic.woff2'],
  '@fontsource-variable/inter-tight': ['inter-tight-latin-wght-normal.woff2'],
  '@fontsource-variable/space-grotesk': ['space-grotesk-latin-wght-normal.woff2'],
  '@fontsource-variable/jetbrains-mono': ['jetbrains-mono-latin-wght-normal.woff2'],
  '@fontsource/anton': ['anton-latin-400-normal.woff2'],
  '@fontsource-variable/archivo': ['archivo-latin-wdth-normal.woff2']
};
for (const [pkg, files] of Object.entries(FONTS)) for (const f of files) copy(`${pkg}/files/${f}`, `fonts/${f}`);
cpSync(join(R, '..', 'brand'), join(OUT, 'brand'), { recursive: true });

const which = process.argv.slice(2).length ? process.argv.slice(2) : ['p1', 'p2', 'p3'];
for (const p of which) {
  mkdirSync(join(OUT, p), { recursive: true });
  const mod = await import(`./src/${p}.mjs?${Date.now()}`);
  writeFileSync(join(OUT, p, 'index.html'), mod.default());
  for (const ext of ['css', 'js']) if (existsSync(join(R, 'src', `${p}.${ext}`))) cpSync(join(R, 'src', `${p}.${ext}`), join(OUT, p, `${p}.${ext}`));
}
console.log('built', which.join(', '));
