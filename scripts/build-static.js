const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const files = [
  'index.html', 'privacy.html', 'robots.txt', 'site.webmanifest',
  'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png',
  'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'logo.png',
  'css', 'js', 'media'
];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);
for (const file of files) fs.cpSync(path.join(root, file), path.join(dist, file), { recursive: true });
