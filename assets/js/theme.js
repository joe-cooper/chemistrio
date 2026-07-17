/* =========================================================
   Theme toggle (light / dark)
   Single source of truth for applying + persisting the site's colour
   theme (palettes live in assets/css/theme.css) and for rendering the
   toggle control. Included by index.html and every standalone
   simulation page, so the whole site — including simulations opened
   directly, outside the site shell — shares one mechanism.
   ========================================================= */
(function () {
  var STORAGE_KEY = "chemistrio-theme";

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function applyTheme(theme) {
    if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
  }

  // Applied immediately, before first paint, to avoid a flash of the
  // wrong theme — this script tag is placed in <head>, unblocked by
  // defer/async, so it runs synchronously as the document is parsed.
  applyTheme(getStoredTheme() === "light" ? "light" : "dark");

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function setTheme(theme) {
    applyTheme(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    updateButton();
  }

  window.toggleTheme = function () {
    setTheme(currentTheme() === "light" ? "dark" : "light");
  };

  // Stay in sync with a theme change made in another same-origin
  // document — e.g. toggling on the main site while a simulation is
  // already open in the viewer iframe, or vice versa. The `storage`
  // event only fires in *other* documents than the one that made the
  // change, so this can't loop back on the click that triggered it.
  window.addEventListener("storage", function (e) {
    if (e.key !== STORAGE_KEY) return;
    applyTheme(e.newValue === "light" ? "light" : "dark");
    updateButton();
  });

  var btn, sunIcon, moonIcon;

  function updateButton() {
    if (!btn) return;
    var light = currentTheme() === "light";
    var label = light ? "Switch to dark mode" : "Switch to light mode";
    btn.setAttribute("aria-label", label);
    btn.title = label;
    sunIcon.style.display = light ? "none" : "block";
    moonIcon.style.display = light ? "block" : "none";
  }

  function buildButton() {
    // Only the outermost document gets a visible control — a
    // simulation running inside the site's viewer iframe stays in
    // sync via the storage listener above, without a second,
    // redundant toggle floating inside the embedded frame.
    if (window.self !== window.top) return;

    var style = document.createElement("style");
    style.textContent =
      "#theme-toggle-btn{position:fixed;left:16px;bottom:16px;z-index:9999;" +
      "width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;" +
      "background:var(--surface);border:1px solid var(--border);color:var(--text);" +
      "cursor:pointer;padding:0;box-shadow:0 2px 8px rgba(0,0,0,.25);" +
      "transition:border-color .15s,color .15s;font-family:var(--font);}" +
      "#theme-toggle-btn:hover{border-color:var(--gold);color:var(--gold);}" +
      "#theme-toggle-btn svg{width:18px;height:18px;}";
    document.head.appendChild(style);

    btn = document.createElement("button");
    btn.id = "theme-toggle-btn";
    btn.type = "button";
    btn.onclick = window.toggleTheme;
    btn.innerHTML =
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>' +
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    document.body.appendChild(btn);

    sunIcon = btn.querySelector(".icon-sun");
    moonIcon = btn.querySelector(".icon-moon");
    updateButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildButton);
  } else {
    buildButton();
  }
})();
