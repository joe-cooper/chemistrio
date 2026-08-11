/* =========================================================
   PAGES
   The site shell (index.html) has a single mount point for
   ordinary content pages. Each page points at an HTML fragment
   (just the inner markup, no <section> wrapper) and an optional
   init() to run once that fragment is in the DOM — e.g. to
   populate a list from the data in data.js.

   The list of pages themselves lives in PAGE_META in
   assets/js/render.js, because scripts/build-seo-pages.js needs the
   same list under Node and can't require() this file (it touches
   `document` at load). Here we just attach each page's init().

   To add a new page (a quizzes page, a links page, ...):
     1. Create pages/<id>.html with the page's inner markup.
     2. Add an entry to PAGE_META in render.js. Set hidden:true to
        leave it out of the nav bar while still reachable at /<id>.
     3. If it needs to populate anything from data.js, add an init
        below, keyed by the same id.
   Nothing else needs to change — the nav bar, the router and the
   static-shell build are all driven by that list.
   ========================================================= */

const PAGE_INITS = {
  home: renderFeatured,
  sims: renderSimCategories,
  resources: renderResourceCategories
};

const PAGES = PAGE_META.map(p => ({ ...p, init: PAGE_INITS[p.id] }));

/* =========================================================
   RENDERING
   The markup itself is built by the shared, DOM-free functions in
   render.js (which the static-shell build also calls); the wrappers
   here just put the result on the page.
   ========================================================= */

function renderSimCategories() {
  document.getElementById("simCategories").innerHTML = simCategoriesHtml(simulations);
}

function renderResourceCategories() {
  document.getElementById("resourceCategories").innerHTML = resourceCategoriesHtml(resources);
}

function renderFeatured() {
  document.getElementById("featuredList").innerHTML = featuredHtml(simulations);
}

/* ---------- Simulation viewer ---------- */
function renderSim(id) {
  const s = simulations.find(x => x.id === id);
  if (!s) { renderPage("home"); return; }
  document.title = `${s.title} - chemistr.io`;
  document.getElementById("viewerTitle").textContent = s.title;
  document.getElementById("viewerDesc").textContent = s.desc || "";
  const frame = document.getElementById("viewerFrame");
  document.getElementById("tourBtn").style.display = s.tour ? "" : "none";
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

/* ---------- Teaching notes (Markdown + LaTeX) ----------
   Turning the Markdown into HTML (including the placeholder dance
   that shields LaTeX from marked's backslash-escaping) lives in
   render.js, so scripts/build-seo-pages.js can bake exactly the same
   HTML into each simulation's static page for crawlers. What's left
   here is the browser-only half: fetching the file and running KaTeX
   over the result. */
const MATH_DELIMITERS = [
  { left: "$$", right: "$$", display: true },
  { left: "$", right: "$", display: false },
  { left: "\\(", right: "\\)", display: false },
  { left: "\\[", right: "\\]", display: true }
];

/* KaTeX's auto-render script is deferred, so on a pre-rendered page —
   where the notes are already in the DOM and there's no fetch to wait
   on — this can run before renderMathInElement exists. Deferred scripts
   have all run by the load event, so retry there rather than silently
   leaving the maths as raw $...$ text. */
function typesetMath(el) {
  if (window.renderMathInElement) {
    renderMathInElement(el, { delimiters: MATH_DELIMITERS, throwOnError: false });
  } else if (document.readyState !== "complete") {
    window.addEventListener("load", () => {
      if (window.renderMathInElement) {
        renderMathInElement(el, { delimiters: MATH_DELIMITERS, throwOnError: false });
      }
    }, { once: true });
  }
}

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
  // The static shell for /sims/<id> already carries this simulation's
  // notes, rendered at build time. On the first load of that page
  // there's nothing to fetch: typeset what's there and stop.
  if (content.dataset.prerenderedFor === s.id) {
    delete content.dataset.prerenderedFor;
    typesetMath(content);
    return;
  }
  content.innerHTML = "<p>Loading notes&hellip;</p>";
  try {
    const res = await fetch(s.notes);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const md = await res.text();
    content.innerHTML = notesHtml(md, marked);
    typesetMath(content);
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
   The URL path tracks what's on screen (/sims, /resources, /sims/<id>, ...)
   via the History API, so a refresh or back/forward restores the same
   view instead of always landing on Home, and each page/simulation has
   its own real, crawlable URL. Static per-route HTML files with correct
   <title>/description are generated by scripts/build-seo-pages.js so
   those URLs also carry the right metadata for crawlers and link
   previews before this script ever runs. */

function parsePath() {
  const parts = location.pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { page: "home" };
  if (parts[0] === "sims" && parts[1]) return { page: "viewer", simId: parts[1] };
  if (PAGES.some(p => p.id === parts[0])) {
    return { page: parts[0], section: location.hash.replace(/^#/, "") || undefined };
  }
  return { page: "home" };
}

// One-time migration for old bookmarked/shared links using the previous
// hash-based scheme (#sims, #sim/<id>, #about/contact, ...) so they land
// on the equivalent real path instead of always falling back to Home.
function migrateLegacyHash() {
  if (location.pathname !== "/" || !location.hash) return;
  const hash = location.hash.replace(/^#/, "");
  const [first, second] = hash.split("/");
  let path = null;
  if (first === "sim" && second) path = "/sims/" + second;
  else if (PAGES.some(p => p.id === first)) path = second ? "/" + first + "#" + second : "/" + first;
  if (path) history.replaceState(null, "", path);
}

function applyRoute() {
  const route = parsePath();
  if (route.page === "viewer") renderSim(route.simId);
  else renderPage(route.page, route.section);
}

// Changes the URL (if it isn't already there) via pushState and renders
// the new route. pushState never fires an event, so applyRoute() is
// always called directly here; the popstate listener below only has to
// handle the back/forward buttons.
function navigate(path) {
  if (location.pathname + location.hash !== path) history.pushState(null, "", path);
  applyRoute();
}

// Public entry points used by onclick handlers.
function go(page) {
  navigate(page === "home" ? "/" : "/" + page);
}

function openSim(id) {
  navigate("/sims/" + id);
}

// Intercepts clicks on ordinary same-site links (e.g. the footer's
// /about#contact) so they go through pushState instead of a full page
// reload, while leaving external links, new-tab links and modified
// clicks (ctrl/cmd-click, etc.) to behave normally.
document.addEventListener("click", (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest("a[href^='/']");
  if (!a || a.target === "_blank") return;
  e.preventDefault();
  navigate(a.getAttribute("href"));
});

// Guards against a slow fragment fetch resolving after a newer
// navigation has already started, which would otherwise clobber it.
let navToken = 0;

async function renderPage(id, section) {
  const page = PAGES.find(p => p.id === id) || PAGES.find(p => p.id === "home");
  const token = ++navToken;

  document.getElementById("page-viewer").classList.remove("active");
  const mount = document.getElementById("pageMount");

  // The static shell for this route already contains its fragment,
  // rendered at build time, so the very first render of it has
  // nothing to fetch and nothing to replace — just run the init.
  const prerendered = mount.dataset.prerenderedFor === page.id;
  if (prerendered) delete mount.dataset.prerenderedFor;

  const html = prerendered
    ? null
    : (pageCache[page.id] !== undefined ? pageCache[page.id] : await fetchFragment(page));
  if (token !== navToken) return;

  if (!prerendered) mount.innerHTML = html;
  mount.classList.add("active");
  document.body.dataset.page = page.id;
  if (page.id === "home") window.homeBg && window.homeBg.start();
  else window.homeBg && window.homeBg.stop();
  if (page.init) page.init();
  document.title = page.id === "home" ? "chemistr.io | Chemistry Simulations and Resources" : `${page.label} | chemistr.io`;

  document.querySelectorAll(".nav-links [data-nav]").forEach(b =>
    b.classList.toggle("active", b.dataset.nav === page.id));
  document.getElementById("navLinks").classList.remove("open");

  // Deep link to a specific collapsible section (e.g. #about/contact):
  // open it if it's a <details> and scroll it into view, offset for the
  // sticky header, instead of resetting to the top of the page.
  const target = section && document.getElementById(section);
  if (target) {
    if (target.tagName === "DETAILS") target.open = true;
    const y = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top: Math.max(y, 0) });
    return;
  }
  window.scrollTo({ top: 0 });
}

function showViewer() {
  document.getElementById("pageMount").classList.remove("active");
  document.getElementById("page-viewer").classList.add("active");
  document.body.dataset.page = "viewer";
  window.homeBg && window.homeBg.stop();
  document.querySelectorAll(".nav-links [data-nav]").forEach(b => b.classList.remove("active"));
  document.querySelector('[data-nav="sims"]').classList.add("active");
  window.scrollTo({ top: 0 });
}

// The static shells already carry the nav markup (real <a> links, so
// crawlers can follow them), so this normally has nothing to do. It
// stays as the fallback for any page served without it.
function renderNav() {
  const nav = document.getElementById("navLinks");
  if (!nav.querySelector("[data-nav]")) nav.innerHTML = navHtml(PAGES);
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

window.addEventListener("popstate", applyRoute);

/* ---------- Iframe height via postMessage ---------- */
window.addEventListener('message', (e) => {
  if (!(e.data && e.data.type === 'simHeight')) return;
  const iframe = document.querySelector('#viewerFrame iframe');
  if (!iframe) return;
  if (isViewerFullscreen()) applyFullscreenZoom(iframe, e.data.height);
  else iframe.style.height = e.data.height + 'px';
});

/* ---------- Full screen ----------
   A simulation caps its own content at an intrinsic width (see the
   `.wrap` rule in each simulation file) and just centres itself
   within whatever container it's given, so stretching the iframe to
   fill the screen still leaves it floating in blank space if the
   screen is wider than that cap. Instead, while fullscreen we size
   the iframe to the simulation's own natural width and scale the
   whole thing up with a CSS transform, so it zooms in to fill the
   screen instead of stretching into empty margins. Simulations
   without a recognisable `.wrap` max-width just fall back to a
   plain 100% stretch, same as before. */
const EXPAND_PATH = "M1 5V1h4M9 1h4v4M13 9v4h-4M5 13H1V9";
const COMPRESS_PATH = "M5 1v4H1M13 5H9V1M9 13v-4h4M1 9h4v4";

function startSimTour() {
  const iframe = document.querySelector('#viewerFrame iframe');
  if (iframe && iframe.contentWindow && iframe.contentWindow.ChemTour) {
    iframe.contentWindow.ChemTour.start();
  }
}

function toggleFullscreen() {
  const frame = document.getElementById('viewerFrame');
  if (!document.fullscreenElement) {
    (frame.requestFullscreen || frame.webkitRequestFullscreen).call(frame);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  }
}

function isViewerFullscreen() {
  const frame = document.getElementById('viewerFrame');
  return document.fullscreenElement === frame || document.webkitFullscreenElement === frame;
}

function getNaturalContentWidth(iframe) {
  try {
    const doc = iframe.contentDocument;
    const wrap = doc && doc.querySelector('.wrap');
    const mw = wrap && parseFloat(getComputedStyle(wrap).maxWidth);
    return mw && isFinite(mw) ? mw : null;
  } catch (err) {
    return null; // cross-origin iframe — can't inspect it, so don't zoom
  }
}

// Reads the simulation's own rendered height directly rather than
// waiting for its postMessage('simHeight') report: each simulation
// implements that report differently (some debounce a window resize
// listener, some use a ResizeObserver, timings vary), so waiting on
// it to land before zooming in was unreliable — most simulations
// just sat at their unscaled natural size instead of filling the
// screen. Reading contentDocument's scrollHeight forces a synchronous
// layout flush of the iframe's document, so as long as the width has
// already been set, this reflects the height at that width immediately.
function measureNaturalContentHeight(iframe) {
  try {
    const doc = iframe.contentDocument;
    if (!doc) return null;
    const h = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
    return h || null;
  } catch (err) {
    return null; // cross-origin iframe — can't inspect it
  }
}

// The iframe is `position: absolute; top: 50%; left: 50%` (see
// site.css) so its own top-left sits at the container's centre; it
// then needs pulling back by half its own size to actually centre
// it. That pull-back used to be a `translate(-50%, -50%)`, but a
// percentage translate is resolved against the iframe's own
// just-changed width/height, and Firefox is more prone than Chromium
// to resolving that against a not-yet-settled box mid-transition,
// throwing the centring off. Since the target width/height are
// already known values here, offsetWidth/offsetHeight (which force a
// layout flush, so they reflect the size we just set) let us pull
// back by an exact pixel amount instead, leaving nothing for either
// engine to get wrong.
function centerTransform(iframe) {
  return 'translate(' + (-iframe.offsetWidth / 2) + 'px, ' + (-iframe.offsetHeight / 2) + 'px)';
}

function applyFullscreenZoom(iframe, height) {
  const naturalW = getNaturalContentWidth(iframe);
  if (!naturalW) {
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.transform = centerTransform(iframe);
    return;
  }
  iframe.style.width = naturalW + 'px';
  iframe.style.height = height + 'px';
  // Measure the actual fullscreen container rather than trusting
  // window.innerWidth/innerHeight: some browsers briefly disagree
  // between the two during the fullscreen transition, which would
  // scale the iframe relative to a different box than the one it's
  // actually centred in, throwing the zoom off-centre.
  const box = document.getElementById('viewerFrame').getBoundingClientRect();
  const scale = Math.min(box.width / naturalW, box.height / height);
  iframe.style.transform = centerTransform(iframe) + ' scale(' + scale + ')';
}

document.addEventListener('fullscreenchange', onFullscreenChange);
document.addEventListener('webkitfullscreenchange', onFullscreenChange);

function onFullscreenChange() {
  updateFsButton();
  const iframe = document.querySelector('#viewerFrame iframe');
  if (!iframe) return;
  if (isViewerFullscreen()) {
    const naturalW = getNaturalContentWidth(iframe);
    if (naturalW) {
      // Set the width first so the height measured just below already
      // reflects layout at that width, then zoom immediately — see
      // measureNaturalContentHeight() for why we don't wait on the
      // simulation's own postMessage height report here.
      iframe.style.width = naturalW + 'px';
      const height = measureNaturalContentHeight(iframe);
      if (height) applyFullscreenZoom(iframe, height);
      else iframe.style.transform = centerTransform(iframe);
    }
  } else {
    iframe.style.width = '100%';
    iframe.style.transform = 'none';
  }
}

function updateFsButton() {
  const active = !!document.fullscreenElement;
  document.getElementById('fsLabel').textContent = active ? 'Exit full screen' : 'Full screen';
  document.getElementById('fsIcon').querySelector('path').setAttribute('d', active ? COMPRESS_PATH : EXPAND_PATH);
}

/* ---------- Init ---------- */
renderNav();
migrateLegacyHash();
applyRoute();
prefetchPages();
