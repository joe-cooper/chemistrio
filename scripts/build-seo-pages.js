#!/usr/bin/env node
/* =========================================================
   BUILD SEO PAGES
   This site is a single-page app (see assets/js/app.js): every route
   is normally just index.html re-mounting different content into
   #pageMount via JS. That's fine for real visitors, but it means every
   route shares one <title>/<meta description>, which is bad for search
   ranking and gives crawlers/link-preview bots nothing useful to read
   before JS runs.

   This script writes a real static HTML file at every route's actual
   URL path (e.g. sims/index.html, sims/<id>/index.html, about/index.html)
   that is byte-for-byte the same page shell as index.html, except with
   that route's own <title>, meta description, canonical link and Open
   Graph tags swapped in. The SPA's own JS still boots from that file
   and mounts the interactive content on top, exactly as it does today —
   this only changes what a crawler (or a refresh/direct link) sees
   before that JS runs.

   It also (re)writes robots.txt and sitemap.xml from the same route
   list, and does NOT need any dependencies beyond Node's built-ins.

   Run this manually after adding/editing a simulation, resource, or
   page, before pushing:
     node scripts/build-seo-pages.js
   ========================================================= */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE_URL = "https://www.chemistr.io";

const { simulations } = require(path.join(ROOT, "assets/js/data.js"));

// Static pages besides Home (which is index.html itself and is left
// untouched by this script). Keep in sync with the PAGES array in
// assets/js/app.js if a page is added, renamed or removed there.
const STATIC_PAGES = [
  { path: "/sims", title: "Simulations - chemistr.io",
    description: "Browse free interactive chemistry simulations for GCSE and A-level, covering kinetic theory, kinetics, equilibrium, acids and bases, quantum chemistry and organic mechanisms." },
  { path: "/resources", title: "Resources - chemistr.io",
    description: "Chemistry teaching resources and links, including extension material for the Cambridge Chemistry Challenge and UK Chemistry Olympiad." },
  { path: "/about", title: "About - chemistr.io",
    description: "About chemistr.io: free chemistry simulations and teaching notes made by a UK chemistry teacher, plus how to get in touch or support the site." },
];

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function truncate(s, max) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

const template = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

function renderPage(route) {
  const url = SITE_URL + route.path;
  const title = escapeAttr(route.title);
  const description = escapeAttr(truncate(route.description, 300));
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapeAttr(url)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapeAttr(url)}">`);
  return html;
}

function writeRoute(route) {
  const html = renderPage(route);
  const dir = path.join(ROOT, route.path.replace(/^\//, ""));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  console.log("wrote", path.join(route.path, "index.html").replace(/\\/g, "/"));
}

const simRoutes = simulations.map(s => ({
  path: `/sims/${s.id}`,
  title: `${s.title} - chemistr.io`,
  description: s.desc,
}));

const allRoutes = [...STATIC_PAGES, ...simRoutes];

allRoutes.forEach(writeRoute);

// robots.txt + sitemap.xml, generated from the same route list plus Home.
fs.writeFileSync(path.join(ROOT, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

const sitemapUrls = ["/", ...allRoutes.map(r => r.path)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapUrls.map(p => `  <url><loc>${SITE_URL}${p}</loc></url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
console.log("wrote robots.txt");
console.log("wrote sitemap.xml (" + sitemapUrls.length + " URLs)");

// GitHub Pages fallback: served for any path with no matching static
// file, so the SPA's own router can take over. Kept as a verbatim copy
// of index.html (not run through renderPage) since an unknown path has
// no specific route metadata to inject.
fs.writeFileSync(path.join(ROOT, "404.html"), template);
console.log("wrote 404.html");
