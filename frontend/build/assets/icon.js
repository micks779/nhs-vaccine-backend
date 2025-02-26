const fs = require('fs');

const createNHSIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#005EB8"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size/2}" fill="white" text-anchor="middle" dominant-baseline="middle">
    NHS
  </text>
</svg>
`;

// Create icons for each size
[16, 32, 64, 80].forEach(size => {
  fs.writeFileSync(`public/assets/icon-${size}.svg`, createNHSIcon(size));
}); 