// version-assets.js
const fs = require('fs');
const crypto = require('crypto');

const htmlFiles = ['./index.html']; // add other pages as needed
const hash = f => crypto.createHash('md5')
  .update(fs.readFileSync(f)).digest('hex').slice(0, 8);

for (const page of htmlFiles) {
  let html = fs.readFileSync(page, 'utf8');
  html = html.replace(
    /((?:href|src)=")([^"?]+\.(?:css|js))(?:\?v=[^"]*)?(")/g,
    (m, pre, file, post) => {
      if (!fs.existsSync(file)) return m; // skip external URLs
      return `${pre}${file}?v=${hash(file)}${post}`;
    }
  );
  fs.writeFileSync(page, html);
}