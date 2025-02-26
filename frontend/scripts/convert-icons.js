const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function convertSVGtoPNG(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw NHS blue background
  ctx.fillStyle = '#005EB8';
  ctx.fillRect(0, 0, size, size);
  
  // Add NHS text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size/2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NHS', size/2, size/2);
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/assets/icon-${size}.png`, buffer);
}

// Convert all sizes
[16, 32, 64, 80].forEach(size => convertSVGtoPNG(size)); 