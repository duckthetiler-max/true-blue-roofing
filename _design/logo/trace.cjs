const potrace = require('potrace');
const fs = require('fs');
const layers = ['dark', 'roof_bright', 'blue_text', 'tagline', 'amber', 'white'];
const out = {};
let n = 0;
for (const name of layers) {
  const p = new potrace.Potrace();
  p.setParameters({ turdSize: 40, optTolerance: 0.7, alphaMax: 0.9, threshold: 128, blackOnWhite: true, optCurve: true });
  p.loadImage(`${__dirname}/${name}.png`, (err) => {
    if (err) throw err;
    const tag = p.getPathTag('#000');
    out[name] = tag.match(/ d="([^"]+)"/)[1];
    if (++n === layers.length) {
      fs.writeFileSync(`${__dirname}/paths.json`, JSON.stringify(out));
      for (const k of layers) console.log(k, out[k].length);
    }
  });
}
