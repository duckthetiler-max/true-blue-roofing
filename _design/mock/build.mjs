import { mkdirSync, writeFileSync, cpSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const R = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(R, 'out');
mkdirSync(join(OUT, 'fonts'), { recursive: true });
const FONTS = {
  '@fontsource-variable/inter': ['inter-latin-wght-normal.woff2'],
  '@fontsource-variable/archivo': ['archivo-latin-wdth-normal.woff2'],
  '@fontsource/barlow': ['barlow-latin-400-normal.woff2', 'barlow-latin-500-normal.woff2', 'barlow-latin-600-normal.woff2', 'barlow-latin-700-normal.woff2'],
  '@fontsource/barlow-condensed': ['barlow-condensed-latin-600-normal.woff2', 'barlow-condensed-latin-700-normal.woff2', 'barlow-condensed-latin-800-normal.woff2'],
  '@fontsource-variable/bricolage-grotesque': ['bricolage-grotesque-latin-wght-normal.woff2']
};
for (const [pkg, files] of Object.entries(FONTS)) for (const f of files) cpSync(join(R, 'node_modules', pkg, 'files', f), join(OUT, 'fonts', f));
cpSync(join(R, 'brand'), join(OUT, 'brand'), { recursive: true });
cpSync(join(R, 'photos'), join(OUT, 'photos'), { recursive: true });
const which = process.argv.slice(2).length ? process.argv.slice(2) : ['d1', 'd2', 'd3'];
for (const d of which) {
  const mod = await import(`./${d}.mjs?${Date.now()}`);
  writeFileSync(join(OUT, `${d}.html`), mod.default());
}
execSync(`npx @tailwindcss/cli -i mock/input.css -o out/site.css --minify`, { cwd: R, stdio: 'inherit' });
console.log('built', which.join(', '));
