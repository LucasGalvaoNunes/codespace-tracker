const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'images', 'icon.svg');
const pngPath = path.join(__dirname, '..', 'images', 'icon.png');

const svg = fs.readFileSync(svgPath, 'utf-8');
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 128 }
});

const rendered = resvg.render();
const pngBuffer = rendered.asPng();
fs.writeFileSync(pngPath, pngBuffer);

console.log('✓ images/icon.png gerado com sucesso (128×128)');
