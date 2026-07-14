/* =========================================================
   PAGES
   The site shell (index.html) has a single mount point for
   ordinary content pages. Each entry below points at an HTML
   fragment (just the inner markup, no <section> wrapper) and an
   optional init() to run once that fragment is in the DOM — e.g.
   to populate a list from the data in data.js.

   To add a new page (a quizzes page, a links page, ...):
     1. Create pages/<id>.html with the page's inner markup.
     2. Add an entry here. Set hidden:true to leave it out of the
        nav bar while still reachable at #<id>.
   Nothing else needs to change — the nav bar and router are both
   driven by this list.
   ========================================================= */

const PAGES = [
  { id: "home", label: "Home", fragment: "pages/home.html", init: renderFeatured },
  { id: "sims", label: "Simulations", fragment: "pages/sims.html", init: renderSimCategories },
  { id: "resources", label: "Resources", fragment: "pages/resources.html", init: renderResourceCategories },
  { id: "about", label: "About", fragment: "pages/about.html" }

];

/* =========================================================
   RENDERING
   ========================================================= */

function uniq(a){ return [...new Set(a)]; }

function renderSimCategories() {
  const topics = uniq(simulations.map(s => s.topic));
  const html = topics.map((topic, i) => {
    const items = simulations.filter(s => s.topic === topic);
    const rows = items.map(s => `
      <li>
        <button class="item-row" onclick="openSim('${s.id}')">
          <span class="item-main">
            <span class="item-title">${s.title}</span><br>
            <span class="item-desc">${s.desc}</span>
          </span>
          <span class="level-tag">${s.level}</span>
          <span class="open-hint">Open &rarr;</span>
        </button>
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
  document.getElementById("simCategories").innerHTML = html;
}

function renderResourceCategories() {
  const html = resources.map((g, i) => {
    const rows = g.items.map(it => `
      <li>
        <div class="res-row">
          <span class="item-main">
            <span class="item-title">${it.title}</span><br>
            <span class="item-desc">${it.desc}</span>
          </span>
          ${it.file
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
  document.getElementById("resourceCategories").innerHTML = html;
}

function renderFeatured() {
  const featured = simulations.filter(s => s.featured);
  document.getElementById("featuredList").innerHTML = featured.map(s => `
    <li>
      <button class="linkish" onclick="openSim('${s.id}')">
        <span>${s.title}</span>
        <span class="meta">${s.topic} · ${s.level}</span>
      </button>
    </li>`).join("");
}

/* ---------- Simulation viewer ---------- */
function renderSim(id) {
  const s = simulations.find(x => x.id === id);
  if (!s) { renderPage("home"); return; }
  document.getElementById("viewerTitle").textContent = s.title;
  const frame = document.getElementById("viewerFrame");
  if (s.file) {
    const iframeEl = document.createElement('iframe');
    iframeEl.src = s.file;
    iframeEl.scrolling = 'no';
    iframeEl.style.cssText = 'width:100%;border:0;display:block;';
    frame.innerHTML = '';
    frame.appendChild(iframeEl);
  } else {
    frame.innerHTML = `
      <div class="placeholder-sim">
        <div>
          <h2>${s.title}</h2>
          <p style="max-width:440px;margin:0 auto;">
            The simulation will load here. To connect it, set the
            <code>file</code> field for <code>"${s.id}"</code> in the data to the
            path of your simulation's HTML file.
          </p>
        </div>
      </div>`;
  }
  loadNotes(s);
  showViewer();
}

/* ---------- Teaching notes (Markdown + LaTeX) ---------- */
const MATH_DELIMITERS = [
  { left: "$$", right: "$$", display: true },
  { left: "$", right: "$", display: false },
  { left: "\\(", right: "\\)", display: false },
  { left: "\\[", right: "\\]", display: true }
];

async function loadNotes(s) {
  const sidebar = document.getElementById("notesSidebar");
  const toggle = document.getElementById("notesToggle");
  const content = document.getElementById("notesContent");
  sidebar.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  if (!s.notes) {
    sidebar.style.display = "none";
    content.innerHTML = "";
    return;
  }
  sidebar.style.display = "";
  content.innerHTML = "<p>Loading notes&hellip;</p>";
  try {
    const res = await fetch(s.notes);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const md = await res.text();
    content.innerHTML = marked.parse(md);
    if (window.renderMathInElement) {
      renderMathInElement(content, { delimiters: MATH_DELIMITERS, throwOnError: false });
    }
  } catch (err) {
    content.innerHTML = "<p>Teaching notes couldn't be loaded.</p>";
  }
}

function toggleNotes() {
  const sidebar = document.getElementById("notesSidebar");
  const open = sidebar.classList.toggle("open");
  document.getElementById("notesToggle").setAttribute("aria-expanded", String(open));
}

/* =========================================================
   PAGE LOADING
   Fragments are fetched over HTTP (this needs a local/static web
   server, same as the notes and simulation files already do) and
   cached in memory so repeat visits to a page are instant.
   ========================================================= */

const pageCache = {};

function fetchFragment(page) {
  return fetch(page.fragment)
    .then(res => res.text())
    .then(html => { pageCache[page.id] = html; return html; });
}

function prefetchPages() {
  PAGES.forEach(p => { if (!(p.id in pageCache)) fetchFragment(p); });
}

/* ---------- Navigation ----------
   The URL hash tracks what's on screen (#sims, #resources, #sim/<id>, ...)
   so a refresh or back/forward restores the same view instead of
   always landing on Home. */

function parseHash() {
  const hash = location.hash.replace(/^#/, "");
  if (!hash) return { page: "home" };
  const [first, second] = hash.split("/");
  if (first === "sim" && second) return { page: "viewer", simId: second };
  if (PAGES.some(p => p.id === first)) return { page: first };
  return { page: "home" };
}

function applyRoute() {
  const route = parseHash();
  if (route.page === "viewer") renderSim(route.simId);
  else renderPage(route.page);
}

// Public entry points used by onclick handlers: they just change the
// hash; the hashchange listener (and initial applyRoute call) does the
// actual rendering, so back/forward and manual URL edits work too.
function go(page) {
  const target = page === "home" ? "" : "#" + page;
  if (location.hash === target || (target === "" && !location.hash)) {
    applyRoute();
  } else {
    location.hash = target;
  }
}

function openSim(id) {
  const target = "#sim/" + id;
  if (location.hash === target) applyRoute();
  else location.hash = target;
}

// Guards against a slow fragment fetch resolving after a newer
// navigation has already started, which would otherwise clobber it.
let navToken = 0;

async function renderPage(id) {
  const page = PAGES.find(p => p.id === id) || PAGES.find(p => p.id === "home");
  const token = ++navToken;

  document.getElementById("page-viewer").classList.remove("active");
  const html = pageCache[page.id] !== undefined ? pageCache[page.id] : await fetchFragment(page);
  if (token !== navToken) return;

  const mount = document.getElementById("pageMount");
  mount.innerHTML = html;
  mount.classList.add("active");
  if (page.init) page.init();

  document.querySelectorAll(".nav-links button").forEach(b =>
    b.classList.toggle("active", b.dataset.nav === page.id));
  document.getElementById("navLinks").classList.remove("open");
  window.scrollTo({ top: 0 });
}

function showViewer() {
  document.getElementById("pageMount").classList.remove("active");
  document.getElementById("page-viewer").classList.add("active");
  document.querySelectorAll(".nav-links button").forEach(b => b.classList.remove("active"));
  document.querySelector('[data-nav="sims"]').classList.add("active");
  window.scrollTo({ top: 0 });
}

function renderNav() {
  document.getElementById("navLinks").innerHTML = PAGES
    .filter(p => !p.hidden)
    .map(p => `<button data-nav="${p.id}" onclick="go('${p.id}')">${p.label}</button>`)
    .join("");
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

window.addEventListener("hashchange", applyRoute);

/* ---------- Iframe height via postMessage ---------- */
window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'simHeight') {
    const iframe = document.querySelector('#viewerFrame iframe');
    if (iframe) iframe.style.height = e.data.height + 'px';
  }
});

/* ---------- Full screen ---------- */
const EXPAND_PATH = "M1 5V1h4M9 1h4v4M13 9v4h-4M5 13H1V9";
const COMPRESS_PATH = "M5 1v4H1M13 5H9V1M9 13v-4h4M1 9h4v4";

function toggleFullscreen() {
  const frame = document.getElementById('viewerFrame');
  if (!document.fullscreenElement) {
    (frame.requestFullscreen || frame.webkitRequestFullscreen).call(frame);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  }
}

document.addEventListener('fullscreenchange', updateFsButton);
document.addEventListener('webkitfullscreenchange', updateFsButton);

function updateFsButton() {
  const active = !!document.fullscreenElement;
  document.getElementById('fsLabel').textContent = active ? 'Exit full screen' : 'Full screen';
  document.getElementById('fsIcon').querySelector('path').setAttribute('d', active ? COMPRESS_PATH : EXPAND_PATH);
}

/* ---------- Init ---------- */
renderNav();
applyRoute();
prefetchPages();
