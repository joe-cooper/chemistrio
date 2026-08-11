#!/usr/bin/env node
/* =========================================================
   BUILD SEO PAGES
   This site is a single-page app (see assets/js/app.js): every route
   is normally just index.html re-mounting different content into
   #pageMount via JS. That's fine for real visitors, but a crawler
   that doesn't run JS (or runs it on a later pass) sees an empty
   page with one <title> shared across the whole site.

   This script writes a real static HTML file at every route's actual
   URL path (e.g. sims/index.html, sims/<id>/index.html) built from
   the same page shell as index.html, with that route's own:

     - <title>, meta description, canonical link and Open Graph tags,
     - page content, inlined into #pageMount (or, for a simulation,
       its title, description and rendered teaching notes inlined
       into the viewer),
     - nav bar, as real <a href> links a crawler can follow.

   The SPA's own JS still boots from that file and takes over exactly
   as before; app.js recognises the pre-rendered content (via the
   data-prerendered-for attributes written here) and skips re-fetching
   what's already on the page.

   The markup itself comes from assets/js/render.js, the same module
   the browser uses, so the static and client-rendered versions can't
   drift apart.

   It also (re)writes robots.txt and sitemap.xml from the same route
   list. No dependencies beyond Node's built-ins and the vendored copy
   of marked in assets/vendor.

   Run this manually after adding/editing a simulation, resource, or
   page, before pushing:
     node scripts/build-seo-pages.js
   ========================================================= */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE_URL = "https://www.chemistr.io";

const { simulations, resources } = require(path.join(ROOT, "assets/js/data.js"));
const R = require(path.join(ROOT, "assets/js/render.js"));
const { marked } = require(path.join(ROOT, "assets/vendor/marked.min.js"));

// Frozen once so every route in a single build agrees about which
// simulations still count as "new" (see NEW_BADGE_DAYS in render.js).
const NOW = Date.now();

// Static pages besides Home (which is index.html itself: its <head> is
// hand-maintained there and this script only fills in its body). The
// page ids come from PAGE_META in render.js, which is also what drives
// the nav bar and the router.
const STATIC_PAGES = [
  { id: "sims", path: "/sims", title: "Simulations - chemistr.io",
    description: "Browse free interactive chemistry simulations for GCSE and A-level, covering kinetic theory, kinetics, equilibrium, acids and bases, quantum chemistry and organic mechanisms." },
  { id: "resources", path: "/resources", title: "Resources - chemistr.io",
    description: "Chemistry teaching resources and links, including extension material for the Cambridge Chemistry Challenge and UK Chemistry Olympiad." },
  { id: "about", path: "/about", title: "About - chemistr.io",
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

/* ---------- Shell surgery ----------
   Every replacement below rewrites a whole region (between a pair of
   prerender markers, or an element's entire start tag) rather than
   filling a blank, and every render sets every region explicitly. The
   output is therefore the same whether the input shell is a pristine
   index.html or one this script has already written — which matters,
   because index.html is both the template and one of the outputs. */

function replaceBetween(html, name, content) {
  const start = `<!--prerender:${name}:start-->`;
  const end = `<!--prerender:${name}:end-->`;
  const i = html.indexOf(start);
  const j = html.indexOf(end);
  if (i < 0 || j < 0 || j < i) {
    throw new Error(`index.html is missing the ${name} prerender markers`);
  }
  return html.slice(0, i + start.length) + content + html.slice(j);
}

// Replaces the whole of an empty element with the same element holding
// `inner`. Deliberately only matches an empty one: the containers in
// pages/*.html that JS fills are empty in the source, so a match
// failure means the fragment changed shape and should be looked at.
function fillEmptyById(html, id, inner) {
  const re = new RegExp(`(<(\\w+)([^>]*\\sid="${id}"[^>]*)>)</\\2>`);
  if (!re.test(html)) throw new Error(`no empty element with id="${id}" to fill`);
  return html.replace(re, (_m, open, tag) => `${open}${inner}</${tag}>`);
}

function setStartTag(html, re, tag) {
  if (!re.test(html)) throw new Error(`index.html is missing ${re}`);
  return html.replace(re, tag);
}

function setTextEl(html, re, open, text, close) {
  if (!re.test(html)) throw new Error(`index.html is missing ${re}`);
  return html.replace(re, `${open}${escapeAttr(text)}${close}`);
}

const PAGE_MOUNT_RE = /<div class="page[^"]*" id="pageMount"[^>]*>/;
const VIEWER_RE = /<section class="viewer[^"]*" id="page-viewer">/;
const VIEWER_TITLE_RE = /<h1 class="vtitle" id="viewerTitle"[^>]*>[\s\S]*?<\/h1>/;
const VIEWER_DESC_RE = /<p class="vdesc" id="viewerDesc"[^>]*>[\s\S]*?<\/p>/;
const NOTES_SIDEBAR_RE = /<aside class="notes-sidebar" id="notesSidebar"[^>]*>/;
const NOTES_CONTENT_RE = /<div class="notes-content prose" id="notesContent"[^>]*>/;

function renderHead(html, route) {
  const url = SITE_URL + route.path;
  const title = escapeAttr(route.title);
  const description = escapeAttr(truncate(route.description, 300));
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapeAttr(url)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapeAttr(url)}">`);
  return html;
}

// The nav is the same on every route; app.js only adds the `active`
// class on top of it once it boots.
function renderNav(html) {
  return replaceBetween(html, "nav", R.navHtml(R.PAGE_META));
}

// Reads pages/<id>.html and fills in whatever that fragment leaves for
// JS to populate, so the version baked into the shell matches what a
// visitor ends up with.
function pageFragment(id) {
  const meta = R.PAGE_META.find(p => p.id === id);
  if (!meta) throw new Error(`no PAGE_META entry for "${id}"`);
  let html = fs.readFileSync(path.join(ROOT, meta.fragment.replace(/^\//, "")), "utf8").trim();
  if (id === "home") html = fillEmptyById(html, "featuredList", R.featuredHtml(simulations, NOW));
  if (id === "sims") html = fillEmptyById(html, "simCategories", R.simCategoriesHtml(simulations, NOW));
  if (id === "resources") html = fillEmptyById(html, "resourceCategories", R.resourceCategoriesHtml(resources));
  return html;
}

// The shell with every pre-rendered region emptied and the nav filled
// in: the common starting point for all three kinds of output. Because
// index.html is both the template and one of the outputs, starting from
// a known-blank shell is what stops a second run of this script from
// building on the first run's content.
function blankShell() {
  let html = renderNav(template);
  html = setStartTag(html, PAGE_MOUNT_RE, `<div class="page active" id="pageMount">`);
  html = replaceBetween(html, "page", "");
  html = setStartTag(html, VIEWER_RE, `<section class="viewer" id="page-viewer">`);
  html = setTextEl(html, VIEWER_TITLE_RE, `<h1 class="vtitle" id="viewerTitle">`, "", `</h1>`);
  html = setTextEl(html, VIEWER_DESC_RE, `<p class="vdesc" id="viewerDesc">`, "", `</p>`);
  html = setStartTag(html, NOTES_SIDEBAR_RE, `<aside class="notes-sidebar" id="notesSidebar">`);
  html = setStartTag(html, NOTES_CONTENT_RE, `<div class="notes-content prose" id="notesContent">`);
  html = replaceBetween(html, "frame", "");
  html = replaceBetween(html, "notes", "");
  return html;
}

function renderStaticPage(route) {
  // Home keeps index.html's own hand-written <head>.
  let html = blankShell();
  if (route.id !== "home") html = renderHead(html, route);

  // Content page visible, simulation viewer empty and hidden.
  html = setStartTag(html, PAGE_MOUNT_RE,
    `<div class="page active" id="pageMount" data-prerendered-for="${route.id}">`);
  html = replaceBetween(html, "page", "\n" + pageFragment(route.id) + "\n");
  return html;
}

function renderSimPage(sim) {
  const route = {
    path: `/sims/${sim.id}`,
    title: `${sim.title} - chemistr.io`,
    description: sim.desc,
  };
  let html = renderHead(blankShell(), route);

  // Content page empty and hidden, simulation viewer visible.
  html = setStartTag(html, PAGE_MOUNT_RE, `<div class="page" id="pageMount">`);
  html = replaceBetween(html, "page", "");

  html = setStartTag(html, VIEWER_RE, `<section class="viewer active" id="page-viewer">`);
  html = setTextEl(html, VIEWER_TITLE_RE, `<h1 class="vtitle" id="viewerTitle">`, sim.title, `</h1>`);
  html = setTextEl(html, VIEWER_DESC_RE, `<p class="vdesc" id="viewerDesc">`, sim.desc || "", `</p>`);

  // Stand-in for the iframe app.js will insert: a plain link to the
  // simulation's own page, so the simulation is reachable (and
  // crawlable) from here without JS.
  const frame = sim.file
    ? `\n        <p class="sim-fallback"><a href="${escapeAttr(sim.file)}">Open the ${escapeAttr(sim.title)} simulation</a></p>\n      `
    : "";
  html = replaceBetween(html, "frame", frame);

  // Teaching notes, rendered here rather than fetched, so the prose
  // that makes this page worth finding is in the HTML from the start.
  let notes = "";
  if (sim.notes) {
    const md = fs.readFileSync(path.join(ROOT, sim.notes.replace(/^\//, "")), "utf8");
    notes = "\n" + R.notesHtml(md, marked) + "\n          ";
    html = setStartTag(html, NOTES_SIDEBAR_RE, `<aside class="notes-sidebar" id="notesSidebar">`);
    html = setStartTag(html, NOTES_CONTENT_RE,
      `<div class="notes-content prose" id="notesContent" data-prerendered-for="${escapeAttr(sim.id)}">`);
  } else {
    html = setStartTag(html, NOTES_SIDEBAR_RE,
      `<aside class="notes-sidebar" id="notesSidebar" style="display:none;">`);
    html = setStartTag(html, NOTES_CONTENT_RE, `<div class="notes-content prose" id="notesContent">`);
  }
  html = replaceBetween(html, "notes", notes);
  return html;
}

function writeFile(relPath, html) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  console.log("wrote", relPath.replace(/\\/g, "/"));
}

/* ---------- Build ---------- */

// Home is index.html itself: same body treatment as every other page,
// but its hand-written <head> is left exactly as it is.
writeFile("index.html", renderStaticPage({ id: "home", path: "/" }));

STATIC_PAGES.forEach(route => {
  writeFile(path.join(route.path.replace(/^\//, ""), "index.html"), renderStaticPage(route));
});

simulations.forEach(sim => {
  writeFile(path.join("sims", sim.id, "index.html"), renderSimPage(sim));
});

// robots.txt + sitemap.xml, generated from the same route list plus Home.
fs.writeFileSync(path.join(ROOT, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

const sitemapUrls = ["/", ...STATIC_PAGES.map(r => r.path), ...simulations.map(s => `/sims/${s.id}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapUrls.map(p => `  <url><loc>${SITE_URL}${p}</loc></url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
console.log("wrote robots.txt");
console.log("wrote sitemap.xml (" + sitemapUrls.length + " URLs)");

// GitHub Pages fallback: served (with a 404 status) for any path with
// no matching static file, so the SPA's own router can take over. An
// unknown path has no route metadata and no content to pre-render, so
// this is the bare shell, straight from the template.
writeFile("404.html", blankShell());
