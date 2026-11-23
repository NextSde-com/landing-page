/* Navigation for the standalone landing page. App links are set in site-config.js. */
(() => {
  if (window.__hubNav) return;
  window.__hubNav = true;

  const SECTIONS = [
    { id: "home", label: "Home", href: "./", hint: "What is in this workspace" },
    { id: "practice", label: "Practice", href: "/", hint: "Coding interview problems" },
    { id: "courses", label: "Courses", href: "/courses/", hint: "Lessons with visuals" },
    { id: "lld", label: "LLD", href: "/lld/", hint: "Low-level design problems" },
    { id: "resume", label: "Resume", href: "/resume/", hint: "Resume builder" },
  ];
  const current = "home";

  const strip = document.createElement("header");
  strip.className = "hub-strip";
  const nav = document.createElement("nav");
  nav.className = "hub";
  nav.setAttribute("aria-label", "Sections");
  for (const s of SECTIONS) {
    const a = document.createElement("a");
    a.href = s.href;
    a.textContent = s.label;
    a.title = s.hint;
    if (s.id === current) a.setAttribute("aria-current", "page");
    nav.appendChild(a);
  }
  const end = document.createElement("div");
  end.className = "hub-end";
  const themeBtn = document.createElement("button");
  themeBtn.type = "button";
  themeBtn.className = "hub-theme";
  const SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.6 6.6 0 0 0 10.7 10.7z"/></svg>';
  const root = document.documentElement;
  const isLight = () => root.getAttribute("data-theme") === "light";
  const syncThemeBtn = () => {
    const light = isLight();
    themeBtn.innerHTML = light ? MOON : SUN;
    themeBtn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    themeBtn.title = light ? "Dark mode" : "Light mode";
  };
  const PAGE_TOGGLES = "#theme-toggle-btn, .theme-toggle-btn, #themeBtn, .theme-toggle, #theme";
  themeBtn.addEventListener("click", () => {
    const own = [...document.querySelectorAll(PAGE_TOGGLES)].find((el) => !el.classList.contains("hub-theme"));
    if (own) { own.click(); return; }
    const next = isLight() ? "dark" : "light";
    // Courses pages style an explicit "dark"; Practice/LLD treat "no attribute" as dark.
    if (next === "light" || current === "courses" || current === "home") root.setAttribute("data-theme", next);
    else root.removeAttribute("data-theme");
  });
  syncThemeBtn();
  end.appendChild(themeBtn);
  strip.append(nav, end);
  root.classList.add("has-hub");

  const place = () => {
    if (!strip.isConnected) document.body.prepend(strip);
  };
  if (document.body) place();
  else document.addEventListener("DOMContentLoaded", place);

  // Controls the page wants in the strip's right end.
  const adopt = () => document.querySelectorAll("[data-hub-end]").forEach((el) => end.appendChild(el));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", adopt);
  else adopt();

  // Keep the theme choice the same in every section.
  const KEYS = ["gi_theme", "llm-course-theme"];
  new MutationObserver(() => {
    syncThemeBtn();
    const t = isLight() ? "light" : "dark";
    try { for (const k of KEYS) localStorage.setItem(k, t); } catch (e) {}
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
})();
