// Keep app routes separate from the static landing page's own asset paths.
document.querySelectorAll('a[href^="/"]').forEach((link) => {
  link.href = window.nextsdeAppHref(link.getAttribute('href'));
});
