/* Blueprint — a procedural brick-veneer house with a tiled gable roof, in Three.js.
   Scroll drives the story: blueprint → the house builds itself → wash → replace tiles →
   re-bed the ridge → flexible pointing → coat → done (drag to look around). */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('scene');
const hud = document.getElementById('hud');
const story = document.getElementById('story');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const snap = reduce || new URLSearchParams(location.search).has('snap'); // ?snap jumps straight to the scroll position (used for storyboards)
const narrow = () => innerWidth < 900;
const deg = THREE.MathUtils.degToRad, lerp = THREE.MathUtils.lerp;
const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const rnd = (i) => { const x = Math.sin(i * 127.1 + 31.7) * 43758.5453; return x - Math.floor(x); };

/* ── Renderer, scene, camera, light ── */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, narrow() ? 1.5 : 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = !narrow();
renderer.shadowMap.type = THREE.PCFShadowMap;
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x3a2a1e, 0.9));
const sun = new THREE.DirectionalLight(0xfff0dc, 2.4);
sun.position.set(9, 15, 7);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 45 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.02;
scene.add(sun);

const house = new THREE.Group();
const shell = new THREE.Group(); // walls, gables, windows: rise out of the ground
const frame = new THREE.Group(); // sarking, rafters, battens, fascia, gutters: drop onto the walls
house.add(shell, frame);
scene.add(house);

/* ── Dimensions (metres). The ridge runs along x; side 1 is the front (+z) roof plane. ── */
const W = 10, D = 7.4, H = 2.7, PITCH = deg(25);
const C = Math.cos(PITCH), S = Math.sin(PITCH);
const HALF = D / 2, OVER = 0.5, GOVER = 0.4;
const RIDGE_Y = H + HALF * Math.tan(PITCH);
const SLOPE = (HALF + OVER) / C;
const ROOF_L = W + GOVER * 2;
const N1 = new THREE.Vector3(0, C, S), N2 = new THREE.Vector3(0, C, -S);
const normal = (side) => (side > 0 ? N1 : N2);
// A point on a roof plane: u along the ridge, v down the slope from the ridge line, off along the plane normal.
const onRoof = (side, u, v, off, out = new THREE.Vector3()) => out.set(u, RIDGE_Y - S * v + C * off, side * (C * v + S * off));
const orient = (side) => new THREE.Matrix4().makeBasis(new THREE.Vector3(side, 0, 0), normal(side), new THREE.Vector3(0, -S, C * side));

/* ── Materials ── */
function brickTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#d8cbb6'; g.fillRect(0, 0, 512, 512);
  const bw = 119, bh = 39, mortar = 7;
  for (let r = 0; r < 14; r++) {
    const off = r % 2 ? bw / 2 : 0;
    for (let x = -bw, k = 0; x < 512 + bw; x += bw, k++) {
      const s = rnd(r * 31 + k);
      g.fillStyle = `hsl(${14 + s * 10} ${48 + rnd(s * 9) * 10}% ${42 + rnd(s * 17) * 14}%)`;
      g.fillRect(x + off + mortar / 2, r * bh + mortar / 2, bw - mortar, bh - mortar);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return t;
}
const M = (o) => new THREE.MeshStandardMaterial(o);
const brickMat = M({ map: brickTexture(), roughness: 0.9 });
const renderMat = M({ color: 0xe9e1d3, roughness: 0.85 });
const trimMat = M({ color: 0xf2f2ee, roughness: 0.5 });
const glassMat = M({ color: 0x1c2a3a, roughness: 0.08, metalness: 0.3 });
const steelMat = M({ color: 0x3c4853, roughness: 0.45, metalness: 0.4 });
const timberMat = M({ color: 0x8a6a48, roughness: 0.8 });
const battenMat = M({ color: 0x4a3a2a, roughness: 0.9 });
const sarkMat = M({ color: 0x23282e, roughness: 1, side: THREE.DoubleSide });
const tileMat = M({ color: 0xffffff, roughness: 0.62, metalness: 0.02, side: THREE.DoubleSide });
const capMat = M({ color: 0xffffff, roughness: 0.6, side: THREE.DoubleSide });
const oldBedMat = M({ color: 0x7a7262, roughness: 1 });
const bedMat = M({ color: 0xd9ccb0, roughness: 0.95 });
const pointMat = M({ color: 0x6f7980, roughness: 0.5, emissive: 0x3fd8ff, emissiveIntensity: 0 });

const add = (parent, geo, m, pos, cast = true) => {
  const mesh = new THREE.Mesh(geo, m);
  if (pos) mesh.position.copy(pos);
  mesh.castShadow = cast; mesh.receiveShadow = true;
  parent.add(mesh); return mesh;
};
const onPlane = (mesh, side) => { mesh.quaternion.setFromRotationMatrix(orient(side)); return mesh; };

/* ── Shell: brick walls (one texture repeat per ~1.1 m), rendered gables, windows, door ── */
const wallGeo = new THREE.BoxGeometry(W, H, D);
{
  const uv = wallGeo.attributes.uv; const dims = [[D, H], [D, H], [W, D], [W, D], [W, H], [W, H]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] * 0.9, uv.getY(i) * dims[f][1] * 0.9); }
}
add(shell, wallGeo, brickMat, new THREE.Vector3(0, H / 2, 0));
const gable = new THREE.Shape([new THREE.Vector2(-HALF, 0), new THREE.Vector2(HALF, 0), new THREE.Vector2(0, RIDGE_Y - H)]);
for (const sx of [-1, 1]) {
  const m = add(shell, new THREE.ExtrudeGeometry(gable, { depth: 0.06, bevelEnabled: false }), renderMat);
  m.rotation.y = Math.PI / 2; m.position.set(sx * (W / 2) - 0.03, H, 0);
}
const opening = (w, h, x, y, z, rotY = 0) => {
  const g = new THREE.Group();
  for (const m of [new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, h + 0.12, 0.08), trimMat), new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), glassMat), new THREE.Mesh(new THREE.BoxGeometry(0.05, h, 0.11), trimMat)]) { m.receiveShadow = true; g.add(m); }
  g.position.set(x, y, z); g.rotation.y = rotY; shell.add(g);
};
opening(1.7, 1.3, -2.9, 1.55, HALF + 0.02); opening(1.7, 1.3, 2.9, 1.55, HALF + 0.02);
opening(1.4, 1.2, -2.5, 1.6, -HALF - 0.02); opening(1.4, 1.2, 2.5, 1.6, -HALF - 0.02);
opening(1.2, 1.2, W / 2 + 0.02, 1.6, 0, Math.PI / 2);
add(shell, new THREE.BoxGeometry(0.95, 2.1, 0.1), M({ color: 0x2f4a5f, roughness: 0.5 }), new THREE.Vector3(0, 1.05, HALF + 0.03));

/* ── Roof frame: sarking, rafters at 600, battens, ridge board, fascia, gutters, barge boards ── */
const ROWS = 14, GAUGE = 0.33, TW = 0.3, TL = 0.42, COLS = Math.round(ROOF_L / TW);
const rowV = (r) => Math.max(0.05, SLOPE - r * GAUGE - TL + 0.02); // head (upslope end) of row r; row 0 is the eave course
add(frame, new THREE.BoxGeometry(ROOF_L - 0.2, 0.28, 0.05), timberMat, new THREE.Vector3(0, RIDGE_Y - 0.14, 0));
for (const side of [-1, 1]) {
  const sark = new THREE.PlaneGeometry(ROOF_L, SLOPE); sark.rotateX(-Math.PI / 2);
  onPlane(add(frame, sark, sarkMat, onRoof(side, 0, SLOPE / 2, -0.004), false), side);
  for (let u = -ROOF_L / 2 + 0.3; u <= ROOF_L / 2 - 0.2; u += 0.6) onPlane(add(frame, new THREE.BoxGeometry(0.05, 0.12, SLOPE), timberMat, onRoof(side, u, SLOPE / 2, -0.07)), side);
  for (let r = 0; r < ROWS; r++) onPlane(add(frame, new THREE.BoxGeometry(ROOF_L, 0.025, 0.05), battenMat, onRoof(side, 0, rowV(r) + 0.03, 0.0125), false), side);
  const eave = onRoof(side, 0, SLOPE, 0);
  add(frame, new THREE.BoxGeometry(ROOF_L, 0.2, 0.04), trimMat, eave.clone().add(new THREE.Vector3(0, -0.08, 0.02 * side)), false);
  add(frame, new THREE.BoxGeometry(ROOF_L, 0.12, 0.13), steelMat, eave.clone().add(new THREE.Vector3(0, -0.12, 0.09 * side)));
  for (const ux of [-1, 1]) onPlane(add(frame, new THREE.BoxGeometry(0.04, 0.22, SLOPE + 0.05), trimMat, onRoof(side, ux * (ROOF_L / 2 + 0.02), SLOPE / 2, -0.03)), side);
}

/* ── Tiles: one instanced mesh of Roman (wave) profile tiles, laid from the eaves up ── */
const tileGeo = (() => {
  const A = 0.024, TH = 0.014, N = 16; const top = [], bot = [];
  for (let i = 0; i <= N; i++) { const x = -TW / 2 + (TW * i) / N, y = A * Math.sin((i / N) * Math.PI * 2); top.push(new THREE.Vector2(x, y)); bot.push(new THREE.Vector2(x, y - TH)); }
  const g = new THREE.ExtrudeGeometry(new THREE.Shape([...top, ...bot.reverse()]), { depth: TL, bevelEnabled: false, curveSegments: 1 });
  g.translate(0, 0, -TL / 2);
  // Thicken the tail (downslope end) so each tile's butt sits down onto the row below, like a real tile.
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), top = A * Math.sin(((x + TW / 2) / TW) * Math.PI * 2);
    if (pos.getZ(i) > 0 && y < top - TH / 2) pos.setY(i, y - 0.026);
  }
  g.computeVertexNormals(); return g;
})();
const tiles = [];
for (const side of [1, -1]) for (let r = 0; r < ROWS; r++) for (let j = 0; j < COLS; j++) tiles.push({ side, r, j, u: -ROOF_L / 2 + TW / 2 + j * TW, x01: (j + 0.5) / COLS });
const tileMesh = new THREE.InstancedMesh(tileGeo, tileMat, tiles.length);
tileMesh.castShadow = tileMesh.receiveShadow = true;
house.add(tileMesh);
const KICK = 0.04, TILE_OFF = 0.025 + 0.024 + 0.014; // batten + wave depth + tile thickness
const baseMatrix = tiles.map(({ side, r, u }) => {
  const m = orient(side).multiply(new THREE.Matrix4().makeRotationX(-KICK));
  return m.setPosition(onRoof(side, u, rowV(r) + TL / 2, TILE_OFF + (TL / 2) * Math.sin(KICK)));
});
const vnoise = (x, y) => {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, h = (a, b) => rnd(a * 57.31 + b * 131.7 + 0.5);
  const sx = xf * xf * (3 - 2 * xf), sy = yf * yf * (3 - 2 * yf);
  return lerp(lerp(h(xi, yi), h(xi + 1, yi), sx), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), sx), sy);
};
const grime = (u, r, side) => Math.min(0.92, Math.max(0.12, (0.62 * vnoise(u * 0.55 + side * 9, r * 0.42) + 0.38 * vnoise(u * 1.4 + 7, r * 1.1 + 3) - 0.18) * 1.5 + (1 - r / ROWS) * 0.18));
const dirt = tiles.map(({ u, r, side }) => grime(u, r, side));
const lichen = tiles.map((t, i) => rnd(i * 4.7 + 1) > 0.95);
const appearAt = tiles.map(({ side, r, j }) => 0.38 + (r / ROWS) * 0.36 + (j / COLS) * 0.06 + (side < 0 ? 0.03 : 0));
const broken = new Set([[4, 10], [6, 17], [8, 24], [5, 28], [9, 13]].map(([r, j]) => r * COLS + j)); // front-plane tiles
const brokenCentre = new THREE.Vector3();
broken.forEach((i) => brokenCentre.add(new THREE.Vector3().setFromMatrixPosition(baseMatrix[i])));
brokenCentre.divideScalar(broken.size);
const firstBroken = new THREE.Vector3().setFromMatrixPosition(baseMatrix[[...broken][0]]);

/* ── Ridge: caps, the old perished bed, the new bed, a string line and flexible pointing ── */
const capGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.39, 20, 1, true, -Math.PI / 2, Math.PI);
capGeo.rotateX(-Math.PI / 2); capGeo.rotateY(Math.PI / 2);
const CAPS = Math.round(ROOF_L / 0.4);
const capX = (i) => -ROOF_L / 2 + 0.2 + i * 0.4;
const capDirt = Array.from({ length: CAPS }, (_, i) => grime(capX(i), ROWS - 1, 3) * 0.9);
const caps = new THREE.InstancedMesh(capGeo, capMat, CAPS);
caps.castShadow = true; house.add(caps);
const RL = ROOF_L - 0.1;
const ridgeStrip = (m, side, y, z, fromEnd, h = 0.08, w = 0.16) => {
  const g = new THREE.BoxGeometry(RL, h, w); g.translate((fromEnd * RL) / 2, 0, 0);
  const mesh = add(house, g, m, new THREE.Vector3((-fromEnd * RL) / 2, y, z * side)); mesh.rotation.x = -side * PITCH; return mesh;
};
const oldBeds = [-1, 1].map((s) => ridgeStrip(oldBedMat, s, RIDGE_Y + 0.09, 0.13, -1));
const beds = [-1, 1].map((s) => ridgeStrip(bedMat, s, RIDGE_Y + 0.1, 0.13, 1));
const points = [-1, 1].map((side) => {
  const g = new THREE.CylinderGeometry(0.024, 0.024, RL, 10); g.rotateZ(Math.PI / 2); g.translate(RL / 2, 0, 0);
  return add(house, g, pointMat, new THREE.Vector3(-RL / 2, RIDGE_Y + 0.09, 0.205 * side));
});
const stringMat = new THREE.LineBasicMaterial({ color: 0xffb547, transparent: true, opacity: 0 });
const stringLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-ROOF_L / 2 - 0.3, RIDGE_Y + 0.33, 0), new THREE.Vector3(ROOF_L / 2 + 0.3, RIDGE_Y + 0.33, 0)]), stringMat);
house.add(stringLine);

/* ── Ground: shadow catcher plus a soft contact shadow (phones skip the shadow map) ── */
const ground = new THREE.Mesh(new THREE.CircleGeometry(16, 64), new THREE.ShadowMaterial({ opacity: 0, transparent: true }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
const blob = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 8, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.7, D * 1.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity: 0, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.01; house.add(m); return m;
})();

/* ── Blueprint linework and grid ── */
const lineMat = new THREE.LineBasicMaterial({ color: 0x6fe3ff, transparent: true, opacity: 1 });
const lines = new THREE.Group(); house.add(lines);
{
  const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)), lineMat); box.position.y = H / 2; lines.add(box);
  const pts = [];
  const seg = (a, b) => pts.push(a, b);
  for (const sx of [-1, 1]) { const x = (sx * W) / 2; seg(new THREE.Vector3(x, H, -HALF), new THREE.Vector3(x, RIDGE_Y, 0)); seg(new THREE.Vector3(x, RIDGE_Y, 0), new THREE.Vector3(x, H, HALF)); }
  for (const side of [-1, 1]) {
    const c = [onRoof(side, -ROOF_L / 2, 0, 0), onRoof(side, ROOF_L / 2, 0, 0), onRoof(side, ROOF_L / 2, SLOPE, 0), onRoof(side, -ROOF_L / 2, SLOPE, 0)];
    for (let k = 0; k < 4; k++) seg(c[k], c[(k + 1) % 4]);
    for (let u = -ROOF_L / 2 + 0.3; u <= ROOF_L / 2 - 0.2; u += 0.6) seg(onRoof(side, u, 0, -0.01), onRoof(side, u, SLOPE, -0.01));
    for (let r = 0; r < ROWS; r++) seg(onRoof(side, -ROOF_L / 2, rowV(r) + 0.03, 0.02), onRoof(side, ROOF_L / 2, rowV(r) + 0.03, 0.02));
  }
  for (const [w, h, x, y] of [[1.7, 1.3, -2.9, 1.55], [1.7, 1.3, 2.9, 1.55], [0.95, 2.1, 0, 1.05]]) {
    const z = HALF + 0.01, a = new THREE.Vector3(x - w / 2, y - h / 2, z), b = new THREE.Vector3(x + w / 2, y - h / 2, z), c2 = new THREE.Vector3(x + w / 2, y + h / 2, z), d = new THREE.Vector3(x - w / 2, y + h / 2, z);
    seg(a, b); seg(b, c2); seg(c2, d); seg(d, a);
  }
  lines.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
}
const grid = new THREE.GridHelper(28, 28, 0x6fe3ff, 0x6fe3ff);
grid.material.transparent = true; grid.material.opacity = 0.2; scene.add(grid);

/* ── Spray: a curtain of droplets that follows the wash and coat sweeps ── */
const SPRAY = 700;
const sprayPos = new Float32Array(SPRAY * 3);
const sprayGeo = new THREE.BufferGeometry(); sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
const sprayMat = new THREE.PointsMaterial({ color: 0xe6f8ff, size: 0.075, transparent: true, opacity: 0, depthWrite: false });
const spray = new THREE.Points(sprayGeo, sprayMat); spray.frustumCulled = false; house.add(spray);
const seeds = Array.from({ length: SPRAY }, (_, k) => [rnd(k + 1), rnd(k * 2.3 + 7), rnd(k * 5.1 + 3), rnd(k * 7.7 + 11)]);
const sp = new THREE.Vector3();
function updateSpray(u, opacity, colour, time) {
  spray.visible = opacity > 0.01; if (!spray.visible) return;
  sprayMat.opacity = opacity; sprayMat.color.copy(colour);
  for (let k = 0; k < SPRAY; k++) {
    const [a, b, c, d] = seeds[k];
    const life = (time * (0.9 + a) + b) % 1;
    onRoof(k % 9 ? 1 : -1, u + (d - 0.5) * 0.24 - life * 0.35, c * SLOPE, 0.05 + life * (0.2 + a * 0.5), sp);
    sprayPos[k * 3] = sp.x; sprayPos[k * 3 + 1] = sp.y; sprayPos[k * 3 + 2] = sp.z;
  }
  sprayGeo.attributes.position.needsUpdate = true;
}

/* ── Colour: weathered (moss and lichen) → washed → coated, swept across the roof ── */
const CLEAN = new THREE.Color(0xb4573a), MOSS = new THREE.Color(0x2e3427), LICHEN = new THREE.Color(0x8a875f), MARK = new THREE.Color(0xffb547), WATER = new THREE.Color(0xe6f8ff);
const coat = { now: new THREE.Color(0x3a3f45), prev: new THREE.Color(0x3a3f45), swap: 1 };
const front = (k) => k * 1.15 - 0.075; // sweep position across the roof, as a fraction of its length
const sweepU = (k) => -ROOF_L / 2 + Math.min(1, Math.max(0, front(k))) * ROOF_L;
function shade(out, seed, x01, grimy, spotted, wash, coatK, marked) {
  const vary = (rnd(seed) - 0.5) * 0.08;
  if (x01 < front(coatK)) return out.copy(x01 < front(coat.swap) ? coat.now : coat.prev).offsetHSL(0, 0, vary * 0.4);
  if (marked) return out.copy(MARK);
  out.copy(CLEAN).offsetHSL(0, 0, vary);
  if (x01 >= front(wash)) { out.lerp(MOSS, grimy); if (spotted) out.lerp(LICHEN, 0.35); }
  return out;
}

/* ── Story state. T runs 0 → 6; cards sit at about T = 0.9, 1.9 … 4.9, and the finish at 6. ── */
let T = 0, wash = 0, coatK = 0;
let lastColour = '', lastTiles = '', lastCaps = '';
const tmpC = new THREE.Color(), tmpM = new THREE.Matrix4(), rotM = new THREE.Matrix4(), zero = new THREE.Vector3(0, 0, 0);
function setTile(i) {
  const k = ss(appearAt[i], appearAt[i] + 0.1, T);
  let lift = (1 - k) * 0.9, tilt = (1 - k) * 0.6;
  if (broken.has(i)) { const out = ss(1.8, 2.05, T) * (1 - ss(2.12, 2.42, T)); lift += out * 0.5; tilt += out * 1.15; }
  tmpM.copy(baseMatrix[i]);
  if (tilt) tmpM.multiply(rotM.makeRotationX(-tilt));
  if (k <= 0) tmpM.scale(zero);
  const n = normal(tiles[i].side), e = tmpM.elements;
  e[12] += n.x * lift; e[13] += n.y * lift; e[14] += n.z * lift;
  tileMesh.setMatrixAt(i, tmpM);
}
function setCap(i) {
  const s = i / (CAPS - 1);
  const k = ss(0.62 + s * 0.12, 0.7 + s * 0.12, T);
  const up = ss(2.55 + s * 0.22, 2.7 + s * 0.22, T) * (1 - ss(3.12 + s * 0.22, 3.27 + s * 0.22, T));
  tmpM.makeTranslation(capX(i), RIDGE_Y + 0.1 + (1 - k) * 0.9 + up * (0.85 + rnd(i + 3) * 0.3), 0);
  if (up > 0) tmpM.multiply(rotM.makeRotationFromEuler(new THREE.Euler((rnd(i) - 0.5) * 0.6 * up, (rnd(i + 9) - 0.5) * 0.5 * up, (rnd(i + 5) - 0.5) * 0.3 * up)));
  if (k <= 0) tmpM.scale(zero);
  caps.setMatrixAt(i, tmpM);
}
const strip = (m, k) => { m.visible = k > 0.002; m.scale.x = Math.max(0.002, k); };

function applyState(time) {
  // Build: walls rise, the roof frame drops on, tiles lay from the eaves up, caps go on last.
  const walls = ss(0.08, 0.3, T);
  shell.visible = walls > 0.002; shell.scale.y = Math.max(0.002, walls);
  const fr = ss(0.24, 0.42, T);
  frame.visible = fr > 0.002; frame.position.y = (1 - fr) * 2.4;
  ground.material.opacity = 0.32 * ss(0.1, 0.5, T);
  blob.material.opacity = ss(0.1, 0.5, T);
  lineMat.opacity = 1 - ss(0.12, 0.7, T); lines.visible = lineMat.opacity > 0.01;
  grid.material.opacity = 0.06 + 0.14 * (1 - ss(0.2, 0.8, T));

  // Tile and cap positions, recomputed only while something is moving.
  const tKey = (T > 0.36 && T < 1) || (T > 1.75 && T < 2.45) ? T.toFixed(4) : T <= 0.36 ? 'pre' : 'rest';
  if (tKey !== lastTiles) { lastTiles = tKey; for (let i = 0; i < tiles.length; i++) setTile(i); tileMesh.instanceMatrix.needsUpdate = true; }
  const cKey = (T > 0.6 && T < 0.9) || (T > 2.5 && T < 3.55) ? T.toFixed(4) : T <= 0.6 ? 'pre' : 'rest';
  if (cKey !== lastCaps) { lastCaps = cKey; for (let i = 0; i < CAPS; i++) setCap(i); caps.instanceMatrix.needsUpdate = true; }

  // Colours: wash sweep, marked broken tiles, coat sweep (and a re-sweep when a swatch is picked).
  wash = ss(0.92, 1.36, T); coatK = ss(4.55, 5.15, T);
  const marked = T > 1.45 && T < 2.1;
  const key = `${wash.toFixed(3)}|${coatK.toFixed(3)}|${coat.swap.toFixed(3)}|${marked}|${coat.now.getHex()}`;
  if (key !== lastColour) {
    lastColour = key;
    for (let i = 0; i < tiles.length; i++) tileMesh.setColorAt(i, shade(tmpC, i, tiles[i].x01, dirt[i], lichen[i], wash, coatK, marked && broken.has(i)));
    for (let i = 0; i < CAPS; i++) caps.setColorAt(i, shade(tmpC, 9000 + i, (i + 0.5) / CAPS, capDirt[i], false, wash, coatK, false));
    tileMesh.instanceColor.needsUpdate = caps.instanceColor.needsUpdate = true;
  }

  // Ridge: old bed chipped back as the caps come off, new bed laid to a string line, then pointing.
  oldBeds.forEach((b) => strip(b, T > 0.6 ? 1 - ss(2.78, 2.95, T) : 0));
  beds.forEach((b) => strip(b, ss(2.9, 3.15, T)));
  stringMat.opacity = ss(2.84, 2.9, T) * (1 - ss(3.2, 3.3, T)); stringLine.visible = stringMat.opacity > 0.01;
  const pt = ss(3.55, 4.05, T);
  points.forEach((p) => strip(p, pt));
  pointMat.emissiveIntensity = 2.2 * pt * (1 - ss(4.1, 4.4, T));

  // Spray follows whichever sweep is running.
  if (wash > 0 && wash < 1) updateSpray(sweepU(wash), 0.85, WATER, time);
  else if (coatK > 0 && coatK < 1) updateSpray(sweepU(coatK), 0.9, tmpC.copy(coat.now).offsetHSL(0, 0, 0.12), time);
  else if (coat.swap < 1 && coatK > 0) updateSpray(sweepU(coat.swap), 0.9, tmpC.copy(coat.now).offsetHSL(0, 0, 0.12), time);
  else updateSpray(0, 0, WATER, time);

  // Light warms for the finish.
  const done = ss(5.3, 5.9, T);
  sun.color.setRGB(1, 0.94 - done * 0.1, 0.86 - done * 0.22);
  sun.intensity = 2.4 + done * 0.6;
  return spray.visible;
}

/* ── Camera: orbit keyframes (azimuth from +z toward +x, elevation, distance) that hold while each card is centred ── */
const KEYS = [
  { at: 0, az: 36, el: 18, d: 30, t: [0, 2.0, 0] },
  { at: 0.9, az: 28, el: 30, d: 23, t: [1.1, 2.6, 0] },
  { at: 1.9, az: 14, el: 40, d: 12.5, t: brokenCentre.toArray() },
  { at: 2.9, az: 70, el: 22, d: 10.5, t: [0.6, 4.25, 0] },
  { at: 3.9, az: -62, el: 20, d: 9.5, t: [-1.4, 4.3, 0] },
  { at: 4.9, az: 26, el: 33, d: 23, t: [1.1, 2.6, 0] },
  { at: 6, az: 40, el: 14, d: 24, t: [1.3, 2.1, 0] }
];
let fit = 1;
const tgt = new THREE.Vector3(), tv = new THREE.Vector3();
function placeCamera() {
  let i = 0; while (i < KEYS.length - 2 && T > KEYS[i + 1].at) i++;
  const a = KEYS[i], b = KEYS[i + 1], f = ss(0.12, 0.88, (T - a.at) / (b.at - a.at));
  const az = deg(lerp(a.az, b.az, f)), el = deg(lerp(a.el, b.el, f)), d = lerp(a.d, b.d, f) * fit;
  tgt.fromArray(a.t).lerp(tv.fromArray(b.t), f);
  camera.position.set(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)).multiplyScalar(d).add(tgt);
  camera.lookAt(tgt);
  // The house sits beside the cards on desktop; on phones it sits below the hero copy, then above the cards.
  const w = innerWidth, h = innerHeight;
  if (narrow()) camera.setViewOffset(w, h, 0, lerp(-0.29, 0.17, ss(0.15, 0.85, T)) * h, w, h);
  else camera.setViewOffset(w, h, -w * lerp(0.23, 0.18, ss(0, 0.5, T)), 0, w, h);
}
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.fov = narrow() ? 38 : 30;
  fit = Math.max(1, (0.62 * Math.tan(deg(15)) * 1.6) / (0.95 * Math.tan(deg(camera.fov / 2)) * camera.aspect));
  camera.updateProjectionMatrix();
}
resize(); addEventListener('resize', resize);

/* ── HUD tags pinned to points on the model ── */
const TAGS = [
  ['RAFTERS', () => onRoof(1, 4.2, SLOPE * 0.5, 0.05), 0.2, 0.48],
  ['BATTENS', () => onRoof(1, -2.8, SLOPE * 0.62, 0.05), 0.27, 0.56],
  ['MOSS + LICHEN', () => onRoof(1, 2.4, SLOPE * 0.42, 0.1), 0.74, 1.0],
  ['PRESSURE CLEAN', () => onRoof(1, sweepU(wash), SLOPE * 0.25, 0.75), 0.96, 1.32],
  ['CRACKED TILE', () => firstBroken.clone().add(new THREE.Vector3(0, 0.15, 0)), 1.5, 2.02],
  ['CAPS OFF', () => new THREE.Vector3(2.4, RIDGE_Y + 0.95, 0), 2.62, 2.95],
  ['NEW BED · STRING LINE', () => new THREE.Vector3(-2.2, RIDGE_Y + 0.35, 0), 2.92, 3.22],
  ['FLEXIBLE POINTING', () => new THREE.Vector3(-2.6, RIDGE_Y + 0.14, 0.24), 3.62, 4.25],
  ['PRIMER + 2 COATS', () => onRoof(1, sweepU(coatK), SLOPE * 0.25, 0.75), 4.62, 5.12]
].map(([text, at, a, b]) => { const el = document.createElement('div'); el.className = 'tag'; el.textContent = text; el.style.opacity = 0; hud.appendChild(el); return { el, at, a, b }; });
const proj = new THREE.Vector3();
function updateTags() {
  for (const t of TAGS) {
    const o = ss(t.a, t.a + 0.06, T) * (1 - ss(t.b - 0.06, t.b, T));
    t.el.style.opacity = o.toFixed(3);
    if (o <= 0) continue;
    proj.copy(t.at()).applyMatrix4(house.matrixWorld).project(camera);
    t.el.style.transform = `translate(${(((proj.x + 1) / 2) * innerWidth).toFixed(1)}px, ${(((1 - proj.y) / 2) * innerHeight - 18).toFixed(1)}px) translate(-50%, -100%)`;
  }
}

/* ── Interaction: drag to look around once finished; gentle idle drift and mouse parallax up top ── */
let yaw = 0, yawTarget = 0, dragging = false, lastX = 0, mouseX = 0, canDrag = false;
const interactive = (el) => el instanceof Element && el.closest('a, button, input, textarea, label, .card, .nav, .solid');
addEventListener('pointerdown', (e) => { if (!canDrag || interactive(e.target)) return; dragging = true; lastX = e.clientX; document.body.classList.add('dragging'); });
addEventListener('pointermove', (e) => { mouseX = e.clientX / innerWidth - 0.5; if (dragging) { yawTarget += (e.clientX - lastX) * 0.008; lastX = e.clientX; } });
const endDrag = () => { dragging = false; document.body.classList.remove('dragging'); };
addEventListener('pointerup', endDrag); addEventListener('pointercancel', endDrag);
document.querySelectorAll('[data-coat]').forEach((b) => b.addEventListener('click', () => {
  coat.prev.copy(coat.now); coat.now.set(b.dataset.coat); coat.swap = 0;
  document.querySelectorAll('[data-coat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
}));

/* ── Scroll → T, render only when something changed ── */
let storyVisible = true;
new IntersectionObserver(([e]) => { storyVisible = e.isIntersecting; }).observe(story);
function scrollT() {
  const r = story.getBoundingClientRect();
  return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight))) * 6;
}
const timer = new THREE.Timer();
let lastSig = '';
function tick() {
  requestAnimationFrame(tick);
  timer.update();
  if (!storyVisible) return;
  const dt = Math.min(0.1, timer.getDelta()), time = timer.getElapsed();
  const target = scrollT();
  T = snap || Math.abs(target - T) < 1e-4 ? target : T + (target - T) * (1 - Math.exp(-dt * 9));
  if (coat.swap < 1) coat.swap = Math.min(1, coat.swap + dt / 1.1);
  yaw += (yawTarget - yaw) * (1 - Math.exp(-dt * 6));
  const drift = reduce ? 0 : (1 - ss(0, 0.6, T)) * (Math.sin(time * 0.25) * 0.22 + mouseX * 0.12);
  house.rotation.y = drift + yaw * ss(5.0, 5.3, T);
  if (canDrag !== T > 5.3) { canDrag = T > 5.3; document.body.classList.toggle('can-drag', canDrag); }
  const spraying = applyState(time);
  const sig = `${T.toFixed(4)}|${house.rotation.y.toFixed(4)}|${spraying ? time.toFixed(3) : ''}|${coat.swap}|${innerWidth}x${innerHeight}`;
  if (sig === lastSig) return;
  lastSig = sig;
  placeCamera();
  house.updateMatrixWorld();
  updateTags();
  renderer.render(scene, camera);
}
tick();
if (snap) window.__p2 = () => ({ T, target: scrollT() }); // lets the storyboard script wait for the scene to settle

/* ── Smooth scroll and light UI motion ── */
if (window.Lenis && !reduce) {
  const lenis = new Lenis({ lerp: 0.1 });
  if (window.gsap) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((time) => lenis.raf(time * 1000)); gsap.ticker.lagSmoothing(0); }
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => { const id = a.getAttribute('href'); if (id.length < 2) return; e.preventDefault(); lenis.scrollTo(id, { duration: 1.8 }); }));
}
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.card--hero > *', { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, delay: 0.2 });
  gsap.utils.toArray('.beat:not(.beat--hero) .card').forEach((c) => gsap.from(c, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 85%' } }));
  gsap.utils.toArray('.svc, .steps li').forEach((el, i) => gsap.from(el, { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', delay: (i % 3) * 0.08, scrollTrigger: { trigger: el, start: 'top 88%' } }));
}
