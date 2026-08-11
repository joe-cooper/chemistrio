/* =========================================================
   SHARED RENDERING
   Pure HTML-building functions used by BOTH runtimes:

     - the browser, where app.js calls them and writes the result
       into the DOM (this file is a plain <script> in index.html,
       loaded before app.js), and
     - Node, where scripts/build-seo-pages.js requires this file to
       bake the same markup into the static per-route HTML shells so
       crawlers see real content before any JS runs.

   Nothing in here may touch `document`, `window` or `fetch` — that's
   what keeps it require()-able under Node. Data comes in as an
   argument rather than being read off the `simulations` / `resources`
   globals, for the same reason.

   The page list lives here too (PAGE_META) so the build script and
   the router agree on which routes exist. app.js turns it into its
   own PAGES array by attaching each page's init() callback.
   ========================================================= */

const PAGE_META = [
  { id: "home", label: "Home", fragment: "/pages/home.html" },
  { id: "sims", label: "Simulations", fragment: "/pages/sims.html" },
  { id: "resources", label: "Resources", fragment: "/pages/resources.html" },
  // { id: "quizzes", label: "Quizzes", fragment: "/pages/quizzes.html" },
  { id: "about", label: "About", fragment: "/pages/about.html" }
];

function uniq(a){ return [...new Set(a)]; }

function pagePath(id) { return id === "home" ? "/" : "/" + id; }

function simPath(id) { return "/sims/" + id; }

/* ---------- "New" badge ----------
   A sim shows the badge for this many days after its `added` date.
   `now` is a parameter rather than a straight Date.now() call so the
   build script's output is a pure function of its inputs; the badge
   in a generated file is therefore frozen at build time, but app.js
   re-renders the same list on boot and corrects it for real visitors. */
const NEW_BADGE_DAYS = 30;

function isNewSim(s, now) {
  if (!s.added) return false;
  const ageMs = (now === undefined ? Date.now() : now) - Date.parse(s.added);
  return ageMs >= 0 && ageMs < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;
}

function newBadge(s, now) {
  return isNewSim(s, now) ? `<span class="new-badge">New</span>` : "";
}

/* ---------- Lists ----------
   Each simulation is a real <a href="/sims/<id>"> rather than a
   button with an onclick: crawlers can then follow it and read its
   anchor text, and the delegated click handler in app.js still turns
   it into a pushState navigation for visitors, so nothing about the
   in-page behaviour changes. */
function simCategoriesHtml(simulations, now) {
  const topics = uniq(simulations.map(s => s.topic));
  return topics.map((topic, i) => {
    const items = simulations.filter(s => s.topic === topic);
    const rows = items.map(s => `
      <li>
        <a class="item-row" href="${simPath(s.id)}">
          <span class="item-main">
            <span class="item-title">${s.title}</span>${newBadge(s, now)}<br>
            <span class="item-desc">${s.desc}</span>
          </span>
          <span class="level-tag">${s.level}</span>
          <span class="open-hint">Open &rarr;</span>
        </a>
      </li>`).join("");
    return `
      <details class="category" ${i === 0 ? "open" : ""}>
        <summary>
          <span class="arrow">&#9654;</span>
          <span>${topic}</span>
          <span class="count">${items.length} simulation${items.length>1?"s":""}</span>
        </summary>
        <ul class="cat-list">${rows}</ul>
      </details>`;
  }).join("");
}

function resourceCategoriesHtml(resources) {
  return resources.map((g, i) => {
    const rows = g.items.map(it => `
      <li>
        <div class="res-row">
          <span class="item-main">
            <span class="item-title">${it.title}</span><br>
            <span class="item-desc">${it.desc}</span>
          </span>
          ${it.url
            ? `<a class="dl" href="${it.url}" target="_blank" rel="noopener">${it.type}</a>`
            : it.file
            ? `<a class="dl" href="${it.file}" download>${it.type}</a>`
            : `<span class="dl disabled" title="Add a file path in the data to enable">${it.type}</span>`}
        </div>
      </li>`).join("");
    return `
      <details class="category" ${i === 0 ? "open" : ""}>
        <summary>
          <span class="arrow">&#9654;</span>
          <span>${g.topic}</span>
          <span class="count">${g.items.length} item${g.items.length>1?"s":""}</span>
        </summary>
        <ul class="cat-list">${rows}</ul>
      </details>`;
  }).join("");
}

function featuredHtml(simulations, now) {
  return simulations.filter(s => s.featured).map(s => `
    <li>
      <a class="linkish" href="${simPath(s.id)}">
        <span>${s.title}</span>${newBadge(s, now)}
        <span class="meta">${s.topic} &middot; ${s.level}</span>
      </a>
    </li>`).join("");
}

function navHtml(pages) {
  return pages
    .filter(p => !p.hidden)
    .map(p => `<a data-nav="${p.id}" href="${pagePath(p.id)}">${p.label}</a>`)
    .join("");
}

/* ---------- Teaching notes (Markdown + LaTeX) ----------
   Marked applies CommonMark backslash-escaping (e.g. "\," -> ",")
   before KaTeX ever sees the markdown, which mangles LaTeX spacing
   macros like \, \; \! \\. Swap math spans out for placeholders
   before marked runs, then restore the untouched original text for
   KaTeX to render. The placeholders are private-use codepoints
   (U+E000/U+E001), which can't occur in real note text and which
   marked passes through untouched. */
const MATH_SPAN_RE = /\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$(?:\\.|[^\$\\\n])*\$/g;

function protectMath(md) {
  const store = [];
  const protectedMd = md.replace(MATH_SPAN_RE, (match) => {
    store.push(match);
    return `${store.length - 1}`;
  });
  return { protectedMd, store };
}

function restoreMath(html, store) {
  return html.replace(/(\d+)/g, (_, idx) => store[Number(idx)]);
}

// `markedLib` is passed in because the two runtimes get it from
// different places: `window.marked` in the browser (CDN/vendored
// <script>), `require(".../marked.min.js").marked` under Node.
function notesHtml(md, markedLib) {
  const { protectedMd, store } = protectMath(md);
  return restoreMath(markedLib.parse(protectedMd), store);
}

/* Node-only export; harmless in the browser, where this file is just
   a plain <script> and the declarations above are already globals.
   Same dual-use trick as assets/js/data.js. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PAGE_META, NEW_BADGE_DAYS,
    uniq, pagePath, simPath, isNewSim, newBadge,
    simCategoriesHtml, resourceCategoriesHtml, featuredHtml, navHtml,
    MATH_SPAN_RE, protectMath, restoreMath, notesHtml
  };
}
