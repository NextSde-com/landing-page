const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
  document.body.style.overflow = '';
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileNav.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) closeMenu();
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const reveals = document.querySelectorAll('.reveal');
const taglineWords = document.querySelectorAll('.tagline-text span');

if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  reveals.forEach(element => element.classList.add('visible'));
  taglineWords.forEach(word => word.classList.add('lit'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  reveals.forEach(element => revealObserver.observe(element));

  const tagline = document.querySelector('.tagline-text');
  const taglineObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    taglineWords.forEach((word, index) => {
      window.setTimeout(() => word.classList.add('lit'), index * 95);
    });
    taglineObserver.disconnect();
  }, { threshold: 0.45 });
  taglineObserver.observe(tagline);
}

const motionButton = document.querySelector('.motion-toggle');
motionButton.addEventListener('click', () => {
  const paused = document.querySelector('.hero-art').classList.toggle('paused');
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'Resume animation' : 'Pause animation';
});

// Reuse NextSDE's original interactive 3D queue lab.
const queueHost = document.querySelector('#queue-host');
const queueToggle = document.querySelector('.queue-toggle');
let queueLab, queueTimer, queuePaused = reducedMotion.matches, queueVisible = false;
function syncQueue() {
  clearInterval(queueTimer);
  if (!queueLab) return;
  const playing = queueVisible && !queuePaused && !document.hidden;
  if (playing) {
    queueLab.resume();
    queueTimer = setInterval(() => {
      const state = queueLab.getState();
      if (state.size >= 5) queueLab.dequeue();
      else queueLab.enqueue();
    }, 1900);
  } else queueLab.pause();
  queueToggle.textContent = queuePaused ? 'Play queue' : 'Pause queue';
  queueToggle.setAttribute('aria-pressed', String(queuePaused));
}
if (queueHost && window.createQueueLab) {
  try {
    queueLab = window.createQueueLab({container: queueHost});
    queueLab.setMode('inline');
    queueLab.resize();
    queueHost.classList.add('live');
    new ResizeObserver(() => queueLab.resize()).observe(queueHost);
    new IntersectionObserver(entries => { queueVisible = entries[0].isIntersecting; syncQueue(); }).observe(queueHost);
    queueToggle.addEventListener('click', () => {queuePaused = !queuePaused; syncQueue();});
    document.addEventListener('visibilitychange', syncQueue);
  } catch (error) { queueToggle.hidden = true; }
} else if (queueToggle) queueToggle.hidden = true;

// Original NextSDE model animations, with screenshot fallback if WebGL fails.
for (const [id, factory, readyEvent] of [
  ['pc-animation', window.createPcHero, 'pchero:ready']
]) {
  const container = document.getElementById(id);
  if (!container || !factory) continue;
  container.addEventListener(readyEvent, () => container.classList.add('live'), {once:true});
  try { factory({container, theme:'dark'}); }
  catch (error) { container.querySelectorAll('canvas').forEach(canvas => canvas.remove()); }
}


const aiFlow = document.querySelector('.ai-flow');
if (aiFlow) {
  let aiStep = 0, aiPaused = reducedMotion.matches, aiVisible = false, aiTimer;
  const layers = aiFlow.querySelectorAll('.ai-layer');
  const paint = () => {
    layers.forEach((layer, index) => layer.classList.toggle('active', index === aiStep));
    aiFlow.classList.toggle('prediction', aiStep === 3);
    aiFlow.dataset.step = String(aiStep);
  };
  const sync = () => {
    clearInterval(aiTimer);
    aiFlow.classList.toggle('paused', aiPaused || !aiVisible || document.hidden);
    document.getElementById('ai-play').textContent = aiPaused ? 'Play' : 'Pause';
    if (!aiPaused && aiVisible && !document.hidden) aiTimer = setInterval(() => {aiStep=(aiStep+1)%4;paint();},1800);
  };
  paint();
  document.getElementById('ai-play').onclick = () => {aiPaused=!aiPaused;sync();};
  new IntersectionObserver(entries => {aiVisible=entries[0].isIntersecting;sync();}).observe(aiFlow);
  document.addEventListener('visibilitychange',sync);
}
