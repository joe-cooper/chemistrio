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
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");

const { simulations, resources } = require(path.join(ROOT, "assets/js/data.js"));
const R = require(path.join(ROOT, "assets/js/render.js"));
const { marked } = require(path.join(ROOT, "assets/vendor/marked.min.js"));

// Apex, not www: see CANONICAL_ORIGIN in render.js. Taken from there
// rather than redeclared, so the two can't drift.
const SITE_URL = R.CANONICAL_ORIGIN;
const SITE_NAME = "chemistr.io";
const LANG = "en-GB";
const LICENSE_URL = "https://creativecommons.org/licenses/by-nc-sa/4.0/";
const OG_DIR = "assets/img/og";
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
// Search results cut a <title> off around here. Titles over this get
// listed at the end of the build so they can be given a `seoTitle`.
const TITLE_LIMIT = 60;

// Frozen once so every route in a single build agrees about which
// simulations still count as "new" (see NEW_BADGE_DAYS in render.js).
const NOW = Date.now();

// Every route's title and description come from PAGE_META / the
// simulation helpers in render.js, which app.js also uses to set them
// on the document as you navigate. Keeping one copy is what stops the
// generated <title> and the one the SPA writes from disagreeing.
const STATIC_PAGES = R.PAGE_META
  .filter(p => p.id !== "home")
  .map(p => ({ id: p.id, path: `/${p.id}`, title: p.title, description: p.description }));

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Titles, descriptions and level formatting live in render.js so the
// SPA sets exactly the same values as are baked in here.
const { normLevel, simTitle, simDescription, truncateText: truncate } = R;

/* ---------- Last-modified dates ----------
   Taken from the last commit that touched a route's own source files,
   not their mtime: on a fresh clone every mtime is checkout time,
   which would tell crawlers the whole site changed at once. */

const dateCache = new Map();

function fileDate(rel) {
  if (!rel) return null;
  if (dateCache.has(rel)) return dateCache.get(rel);
  const abs = path.join(ROOT, rel);
  let date = null;
  if (fs.existsSync(abs)) {
    try {
      const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", rel],
        { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
      if (out) date = out;
    } catch (e) { /* not a git repo, or git unavailable */ }
    // Uncommitted or untracked (a brand-new simulation): fall back to
    // the file's own mtime so it still gets a plausible date.
    if (!date) date = fs.statSync(abs).mtime.toISOString().slice(0, 10);
  }
  dateCache.set(rel, date);
  return date;
}

function lastmodOf(rels) {
  const dates = rels.map(fileDate).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1] : null;
}

function stripLeadingSlash(p) { return p ? p.replace(/^\//, "") : p; }

function simSources(sim) {
  return [stripLeadingSlash(sim.file), stripLeadingSlash(sim.notes), "assets/js/data.js"];
}

/* ---------- Open Graph images ---------- */

function ogImage(name) {
  const rel = `${OG_DIR}/${name}.png`;
  const file = fs.existsSync(path.join(ROOT, rel)) ? rel : `${OG_DIR}/default.png`;
  return fs.existsSync(path.join(ROOT, file)) ? `${SITE_URL}/${file}` : null;
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

/* ---------- Structured data ----------
   One @graph per page rather than several loose blocks, so the nodes
   can reference each other by @id (every page's WebPage points at the
   same WebSite and Organization). The site has no named author — the
   About page is deliberately anonymous — so the Organization stands
   as author and publisher rather than inventing a Person. */

function orgNode() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: "Free interactive chemistry simulations and teaching notes for GCSE, A-level and pre-university chemistry.",
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: LANG,
  };
}

function webPageNode(route, extra) {
  const url = R.canonicalUrl(route.path);
  return Object.assign({
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: route.title,
    description: route.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: LANG,
    license: LICENSE_URL,
  }, extra || {});
}

function breadcrumbNode(route, trail) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${R.canonicalUrl(route.path)}#breadcrumb`,
    itemListElement: trail.map(([name, p], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: R.canonicalUrl(p),
    })),
  };
}

function simResourceNode(sim, route) {
  const url = R.canonicalUrl(route.path);
  const image = ogImage(sim.id);
  const modified = lastmodOf(simSources(sim));
  const node = {
    "@type": "LearningResource",
    "@id": `${url}#resource`,
    name: sim.title,
    url,
    description: sim.desc,
    learningResourceType: "Interactive simulation",
    educationalLevel: normLevel(sim.level),
    about: { "@type": "Thing", name: "Chemistry" },
    teaches: sim.topic,
    audience: { "@type": "EducationalAudience", educationalRole: "student" },
    inLanguage: LANG,
    isAccessibleForFree: true,
    license: LICENSE_URL,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
  if (image) node.image = image;
  if (sim.added) node.datePublished = sim.added;
  if (modified) node.dateModified = modified;
  return node;
}

function jsonLdFor(route, sim) {
  const graph = [orgNode(), websiteNode()];
  if (sim) {
    graph.push(
      webPageNode(route, {
        breadcrumb: { "@id": `${R.canonicalUrl(route.path)}#breadcrumb` },
        mainEntity: { "@id": `${R.canonicalUrl(route.path)}#resource` },
      }),
      breadcrumbNode(route, [["Home", "/"], ["Simulations", "/sims"], [sim.title, route.path]]),
      simResourceNode(sim, route));
  } else if (route.id === "home") {
    graph.push(webPageNode(route));
  } else {
    graph.push(
      webPageNode(route, { breadcrumb: { "@id": `${R.canonicalUrl(route.path)}#breadcrumb` } }),
      breadcrumbNode(route, [["Home", "/"], [route.navName || route.title, route.path]]));
    if (route.id === "sims") {
      graph.push({
        "@type": "ItemList",
        "@id": `${R.canonicalUrl(route.path)}#simulations`,
        name: "Chemistry simulations",
        numberOfItems: simulations.length,
        itemListElement: simulations.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.title,
          url: R.canonicalUrl(`/sims/${s.id}`),
        })),
      });
    }
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

// "<" is escaped so a description containing "</script>" can't end the
// block early. JSON is not HTML-escaped otherwise: inside a JSON-LD
// script element, &amp; and friends would be read literally.
function jsonLdScript(data) {
  const json = JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">\n${json}\n</script>`;
}

/* ---------- Head ---------- */

function headExtras(route, sim) {
  const image = ogImage(sim ? sim.id : "default");
  const lines = [];
  if (image) {
    const alt = sim
      ? `Screenshot of the ${sim.title} chemistry simulation`
      : `${SITE_NAME} — free interactive chemistry simulations`;
    lines.push(
      `<meta property="og:image" content="${escapeAttr(image)}">`,
      `<meta property="og:image:width" content="${OG_WIDTH}">`,
      `<meta property="og:image:height" content="${OG_HEIGHT}">`,
      `<meta property="og:image:alt" content="${escapeAttr(alt)}">`,
      `<meta name="twitter:image" content="${escapeAttr(image)}">`);
  }
  lines.push(jsonLdScript(jsonLdFor(route, sim)));
  return "\n" + lines.join("\n") + "\n";
}

function renderHead(html, route, sim) {
  const url = R.canonicalUrl(route.path);
  const title = escapeAttr(route.title);
  const description = escapeAttr(truncate(route.description, 300));
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapeAttr(url)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapeAttr(url)}">`);
  // A picture of the simulation is worth showing at full width.
  html = html.replace(/<meta name="twitter:card" content="[^"]*">/, `<meta name="twitter:card" content="summary_large_image">`);
  return replaceBetween(html, "head", headExtras(route, sim));
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
  // Reset the head regions renderHead() writes, so 404.html (which
  // skips renderHead entirely) doesn't inherit whatever route was
  // built into index.html on the previous run.
  html = replaceBetween(html, "head", "");
  html = html.replace(/<meta name="twitter:card" content="[^"]*">/, `<meta name="twitter:card" content="summary">`);
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
  let html = renderHead(blankShell(), route);

  // Content page visible, simulation viewer empty and hidden.
  html = setStartTag(html, PAGE_MOUNT_RE,
    `<div class="page active" id="pageMount" data-prerendered-for="${route.id}">`);
  html = replaceBetween(html, "page", "\n" + pageFragment(route.id) + "\n");
  return html;
}

function simRoute(sim) {
  return {
    id: sim.id,
    path: `/sims/${sim.id}`,
    title: simTitle(sim),
    description: simDescription(sim),
  };
}

function renderSimPage(sim) {
  const route = simRoute(sim);
  let html = renderHead(blankShell(), route, sim);

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

// Home is index.html itself. Its title and description stay
// hand-written there; they're read back out of the template so the
// rest of the head (canonical, OG tags, structured data) can be
// generated from the same values as every other route.
const HOME_ROUTE = {
  id: "home",
  path: "/",
  title: R.pageMeta("home").title,
  description: R.pageMeta("home").description,
  sources: ["pages/home.html", "assets/js/data.js"],
};

writeFile("index.html", renderStaticPage(HOME_ROUTE));

STATIC_PAGES.forEach(route => {
  writeFile(path.join(route.path.replace(/^\//, ""), "index.html"), renderStaticPage(route));
});

simulations.forEach(sim => {
  writeFile(path.join("sims", sim.id, "index.html"), renderSimPage(sim));
});

// robots.txt + sitemap.xml, generated from the same route list plus Home.
fs.writeFileSync(path.join(ROOT, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// <lastmod> per URL, from the last commit touching that route's own
// sources, so a changed simulation or notes file is what prompts a
// recrawl rather than every URL claiming to have changed at once.
const sitemapEntries = [
  { path: "/", lastmod: lastmodOf(HOME_ROUTE.sources) },
  ...STATIC_PAGES.map(r => ({
    path: r.path,
    lastmod: lastmodOf(r.sources || [`pages/${r.id}.html`, "assets/js/data.js"]),
  })),
  ...simulations.map(s => ({ path: `/sims/${s.id}`, lastmod: lastmodOf(simSources(s)) })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapEntries.map(e =>
    `  <url><loc>${R.canonicalUrl(e.path)}</loc>` +
    (e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : "") +
    `</url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
console.log("wrote robots.txt");
console.log("wrote sitemap.xml (" + sitemapEntries.length + " URLs, " +
  sitemapEntries.filter(e => e.lastmod).length + " with lastmod)");

// GitHub Pages fallback: served (with a 404 status) for any path with
// no matching static file, so the SPA's own router can take over. An
// unknown path has no route metadata and no content to pre-render, so
// this is the bare shell. It also drops the canonical link — inherited
// from the template, it would have pointed every crawled dead URL at
// the homepage — and asks not to be indexed in its own right.
function render404() {
  const title = "Page not found | chemistr.io";
  const description = "Page not found on chemistr.io.";
  let html = blankShell();
  // The canonical and og:url would otherwise still say "/", pointing
  // every crawled dead URL at the homepage.
  html = html.replace(/\s*<link rel="canonical" href="[^"]*">/, "");
  html = html.replace(/\s*<meta property="og:url" content="[^"]*">/, "");
  html = html.replace(/<meta name="description" content="[^"]*">/,
    `<meta name="robots" content="noindex">\n<meta name="description" content="${description}">`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`);
  return html;
}

writeFile("404.html", render404());

/* ---------- Standalone simulation files ----------
   Each simulations/<id>.html is a complete, indexable page in its own
   right, and the pre-rendered #viewerFrame links straight to it. Left
   alone they compete with /sims/<id> for the same searches while
   carrying none of the teaching notes, so each one gets a canonical
   pointing back at its route. Written into the source files (rather
   than generated alongside them) because these are hand-authored pages
   that are also served directly; the edit is idempotent, so re-running
   the build changes nothing once they're in place. */
function updateSimulationFiles() {
  const changed = [];
  simulations.filter(s => s.file).forEach(sim => {
    const rel = stripLeadingSlash(sim.file);
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      console.log(`  ! ${rel} is missing (referenced by "${sim.id}")`);
      return;
    }
    const before = fs.readFileSync(abs, "utf8");
    let html = before;

    const canonical = `<link rel="canonical" href="${R.canonicalUrl(`/sims/${sim.id}`)}">`;
    if (/<link rel="canonical"[^>]*>/.test(html)) {
      html = html.replace(/<link rel="canonical"[^>]*>/, canonical);
    } else if (/<\/title>/.test(html)) {
      html = html.replace(/<\/title>/, `</title>\n${canonical}`);
    } else {
      console.log(`  ! ${rel} has no <title> to anchor the canonical to`);
      return;
    }

    // These files disagree about lang; the site is UK-curriculum.
    html = html.replace(/<html lang="[^"]*">/, `<html lang="${LANG}">`);

    if (html !== before) { fs.writeFileSync(abs, html); changed.push(rel); }
  });
  console.log(`updated ${changed.length} simulation file(s) with canonical/lang`);
  changed.forEach(f => console.log("  " + f));
}

updateSimulationFiles();

// Titles longer than this get cut off in search results. Report rather
// than fail: the fix is a judgement call about wording, and it's a
// `seoTitle` in data.js for a simulation (see the notes there).
const longTitles = [HOME_ROUTE, ...STATIC_PAGES, ...simulations.map(simRoute)]
  .filter(r => r.title.length > TITLE_LIMIT);
if (longTitles.length) {
  console.log(`\n${longTitles.length} title(s) over ${TITLE_LIMIT} chars and likely to be truncated:`);
  longTitles.forEach(r => console.log(`  ${String(r.title.length).padStart(3)}  ${r.path}  ${r.title}`));
}
