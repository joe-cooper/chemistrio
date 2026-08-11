// version-assets.js
//
// Rewrites the ?v= query string on local .css/.js references in the site
// shell to a hash of that file's contents, so a changed asset can't be
// served from a browser cache against newly deployed HTML.
//
// Run it BEFORE scripts/build-seo-pages.js: the shell is that script's
// template, so the refreshed query strings then propagate to every
// generated per-route file in the same pass.
//
//   node assets/js/version-assets.js && node scripts/build-seo-pages.js
//
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', '..');
const htmlFiles = ['index.html']; // add other pages as needed

const hash = f => crypto.createHash('md5')
  .update(fs.readFileSync(f)).digest('hex').slice(0, 8);

for (const page of htmlFiles) {
  const pagePath = path.join(ROOT, page);
  let html = fs.readFileSync(pagePath, 'utf8');
  html = html.replace(
    // Also matches the older ?version=<date> form, so those get folded
    // into the content-hash scheme rather than left behind.
    /((?:href|src)=")([^"?]+\.(?:css|js))(?:\?(?:v|version)=[^"]*)?(")/g,
    (m, pre, ref, post) => {
      // Root-relative ("/assets/js/app.js") is what the shell uses, but
      // resolve plain relative refs too. Anything that isn't a file on
      // disk is an external URL and is left alone.
      const file = path.join(ROOT, ref.replace(/^\//, ''));
      if (!fs.existsSync(file)) return m;
      return `${pre}${ref}?v=${hash(file)}${post}`;
    }
  );
  fs.writeFileSync(pagePath, html);
  console.log('versioned', page);
}
