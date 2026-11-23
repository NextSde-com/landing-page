(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const isLight = () => root.dataset.theme === 'light';

  const hub = $('.hub-strip');
  const hubLinks = $('.hub', hub);
  if (hub && hubLinks && !$('.hub-brand', hub)) {
    const brand = document.createElement('a');
    brand.className = 'hub-brand';
    brand.href = './';
    brand.innerHTML = '<img class="hub-logo hub-logo-light" src="media/nextsde-logo-light.webp" alt="NextSDE" width="310" height="120"><img class="hub-logo hub-logo-dark" src="media/nextsde-logo-dark.webp" alt="" aria-hidden="true" width="310" height="120">';
    hub.insertBefore(brand, hubLinks);
  }

  const showcase = $('.hero-showcase');
  if (showcase) {
    const osBase = 'media/';
    const queueBase = 'media/';
    const scenes = [
      { name: 'practice', kicker: '01 / INTERVIEW PRACTICE', title: 'Solve FAANG questions from LeetCode and beyond.', description: 'Company tagged LeetCode problems plus 500+ non LeetCode questions from real FAANG interview write-ups. Every non LeetCode question comes with answers: brute force to optimal solutions with code, complexity, and verified test cases. Filter by company, round, difficulty, and topic.', link: 'Explore practice', href: '/', alt: 'Interview practice dashboard with company filters', light: ['media/practice-light.webp'], dark: ['media/practice.webp'], main: 'Beyond LeetCode <b>513 original questions</b>', secondary: 'Filter by company, round, and topic' },
      { name: 'lld', kicker: '02 / CONCURRENCY AND DESIGN PATTERNS', title: 'Design for concurrency. Direct the AI implementer.', description: 'Real LLD questions reported from Amazon, Google, Uber, and Stripe interviews. Most demand thread-safe concurrent designs: pick the patterns, guide the AI class by class, and run acceptance tests.', link: 'Open LLD practice', href: '/lld/', alt: 'Low level design AI implementation workspace', light: ['media/lldai-2-light.webp'], dark: ['media/lldai-2.webp'], main: 'You make the design decisions', secondary: 'AI implements your plan · tests verify it' },
      { name: 'queue', kicker: '03 / VISUAL COURSES', title: 'Watch a queue change, one operation at a time.', description: 'Follow the front and rear pointers as items enter, leave, and wrap around the circular queue.', link: 'Open the queue lab', href: '/courses/queues.html', alt: 'Interactive circular queue with front and rear pointers', light: [`${queueBase}queue-light.webp`], dark: [`${queueBase}queue-dark.webp`], main: 'Enqueue 53 → rear moves', secondary: 'First in, first out · watch the ring wrap' },
      { name: 'os', kicker: '04 / OPERATING SYSTEMS', title: 'See the computer behind every program.', description: 'Take apart a computer in 3D, inspect its components, and follow what happens when it starts.', link: 'Explore computer Part 1', href: '/courses/operating-systems/computer-foundations/inside-a-computer/', alt: '3D computer model with motherboard, CPU, memory and storage', light: [`${osBase}assembled.png`], dark: [`${osBase}course-learning-dark.png`], main: 'Motherboard · CPU · memory', secondary: 'Follow the startup sequence in 3D' },
      { name: 'resume', kicker: '05 / RESUME BUILDER', title: 'Turn your work into a resume ready to share.', description: 'Add your experience, pick a clear template, review the draft, and export it for the role you want.', link: 'Build your resume', href: '/resume/', alt: 'Resume builder with template selection', light: ['media/resume-templates-light.webp'], dark: ['media/resume-templates.webp'], main: 'Your experience, clearly presented', secondary: 'Choose a template · review · export' },
    ];
    const stage = $('#showcase-stage');
    const progress = $$('[data-showcase-index]', showcase);
    const pauseButton = $('#showcase-pause');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let sceneIndex = 0;
    let paused = false;
    let inView = true;
    let autoTimer = null;
    let transitionTimer = null;

    function clearPlayback() {
      clearTimeout(autoTimer);
    }
    function setProgress(index) {
      progress.forEach((button, i) => {
        button.classList.toggle('is-done', i < index);
        button.classList.remove('is-current', 'is-paused');
        button.removeAttribute('aria-current');
        if (i === index) {
          void button.offsetWidth;
          button.classList.add('is-current');
          button.setAttribute('aria-current', 'step');
        }
      });
    }
    function createSlide(index) {
      const scene = scenes[index];
      const slide = document.createElement('div');
      slide.className = `showcase-slide showcase-${scene.name}`;
      const img = document.createElement('img');
      img.src = (isLight() ? scene.light : scene.dark)[0];
      img.dataset.srcLight = scene.light[0];
      img.dataset.srcDark = scene.dark[0];
      img.alt = scene.alt;
      slide.appendChild(img);
      return slide;
    }
    function schedulePlayback() {
      clearPlayback();
      const stop = paused || !inView || document.hidden || reduced.matches;
      showcase.classList.toggle('is-paused', stop);
      progress[sceneIndex].classList.toggle('is-paused', stop);
      if (stop) return;
      autoTimer = setTimeout(() => showScene((sceneIndex + 1) % scenes.length), 6200);
    }
    function showScene(index, manual = false) {
      if (index === sceneIndex && !manual) return;
      clearPlayback();
      clearTimeout(transitionTimer);
      const previous = $('.showcase-slide.is-active', stage);
      const next = createSlide(index);
      stage.appendChild(next);
      if (previous) {
        previous.classList.remove('is-active');
        previous.classList.add('is-leaving');
      }
      requestAnimationFrame(() => requestAnimationFrame(() => next.classList.add('is-active')));
      transitionTimer = setTimeout(() => { $$('.showcase-slide', stage).forEach(slide => { if (slide !== next) slide.remove(); }); }, reduced.matches ? 0 : 700);
      sceneIndex = index;
      const scene = scenes[index];
      showcase.dataset.scene = scene.name;
      $('#showcase-count').textContent = `${String(index + 1).padStart(2, '0')} / 05`;
      $('#showcase-kicker').textContent = scene.kicker;
      $('#showcase-title').textContent = scene.title;
      $('#showcase-description').textContent = scene.description;
      const link = $('#showcase-link');
      link.href = window.nextsdeAppHref(scene.href);
      link.innerHTML = `${scene.link} <i class="ph ph-arrow-up-right" aria-hidden="true"></i>`;
      $('#showcase-copy').setAttribute('aria-live', manual ? 'polite' : 'off');
      setProgress(index);
      schedulePlayback();
    }
    $('#showcase-next').addEventListener('click', () => showScene((sceneIndex + 1) % scenes.length, true));
    $('#showcase-prev').addEventListener('click', () => showScene((sceneIndex - 1 + scenes.length) % scenes.length, true));
    progress.forEach(button => button.addEventListener('click', () => showScene(Number(button.dataset.showcaseIndex), true)));
    pauseButton.addEventListener('click', () => {
      paused = !paused;
      pauseButton.setAttribute('aria-pressed', String(paused));
      pauseButton.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
      pauseButton.innerHTML = `<i class="ph ph-${paused ? 'play' : 'pause'}" aria-hidden="true"></i>`;
      setProgress(sceneIndex);
      schedulePlayback();
    });
    showcase.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (!event.target.closest('button')) return;
      event.preventDefault();
      showScene((sceneIndex + (event.key === 'ArrowRight' ? 1 : -1) + scenes.length) % scenes.length, true);
    });
    document.addEventListener('visibilitychange', schedulePlayback);
    reduced.addEventListener('change', schedulePlayback);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      schedulePlayback();
    }, { threshold: 0.1 }).observe(showcase);
    showcase.dataset.scene = scenes[sceneIndex].name;
    schedulePlayback();
  }

  function syncThemeImages() {
    const key = isLight() ? 'srcLight' : 'srcDark';
    $$('img[data-src-dark][data-src-light]').forEach((img) => {
      const src = img.dataset[key];
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
  }
  syncThemeImages();
  new MutationObserver(syncThemeImages).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  // Entrance animation for the six feature sections: plate slides in, card rises, copy types in.
  // Typing never touches the DOM text: the copy is made transparent and revealed with CSS Custom Highlight ranges,
  // so line breaks (text-wrap: pretty/balance) are identical to the static layout and nothing shifts.
  const FEATURES = ['practice-feature', 'lld-feature', 'resume-feature', 'os-visual', 'dsa-visual', 'ai-course'].map((id) => document.getElementById(id)).filter(Boolean);
  FEATURES.forEach((sec) => $$('.reveal', sec).forEach((el) => el.classList.remove('reveal')));
  (function featureEntrance() {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window) || !FEATURES.length) return;
    const canType = !!(window.CSS && CSS.highlights && window.Highlight);
    const TYPE_START = 1100, TYPE_TOTAL = 2300;
    const sheet = document.createElement('style');
    const cleanup = (sec) => {
      (sec._segs || []).forEach((sg) => {
        if (canType) CSS.highlights.delete(sg.name);
        sg.el.classList.remove('seg-ty', 'seg-fade', 'line-on');
        sg.icons.forEach(([i]) => { i.style.color = ''; });
      });
      if (sec._caret) sec._caret.remove();
      sec.classList.remove('feat-anim', 'is-in');
    };
    try {
      root.classList.add('js-anim');
      document.head.appendChild(sheet);
      let n = 0, rules = '';
      const weight = (el) => (el.matches('.section-kicker') ? 0.9 : el.matches('h2') ? 1.6 : 1);
      const prep = (sec) => {
        const copy = $('.os-copy', sec);
        const els = canType ? [$('.section-kicker', copy), $('h2', copy), $('p', copy), ...$$('.os-points > span', copy), ...$$('.button', copy)].filter(Boolean) : [];
        sec._segs = els.map((el) => {
          const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          const nodes = []; while (tw.nextNode()) if (tw.currentNode.nodeValue.trim()) nodes.push(tw.currentNode);
          const total = nodes.reduce((a, x) => a + x.nodeValue.length, 0);
          const color = getComputedStyle(el).color, name = 'fh' + (n++);
          rules += `::highlight(${name}){color:${color}}`;
          const icons = $$('i', el).map((i) => [i, i.style.color = getComputedStyle(i).color]);
          el.classList.add('seg-ty');
          if (el.matches('.section-kicker, .button, .os-points > span')) el.classList.add('seg-fade');
          return { el, nodes, total, name, color, icons, w: weight(el) * total };
        }).filter((sg) => sg.total);
        const sum = sec._segs.reduce((a, sg) => a + sg.w, 0);
        let t = TYPE_START;
        sec._segs.forEach((sg) => { sg.start = t; sg.dur = Math.max(160, TYPE_TOTAL * sg.w / sum); t = sg.start + sg.dur; });
        sec._end = t;
        if (canType) { sec._caret = document.createElement('i'); sec._caret.className = 'type-caret'; sec._caret.setAttribute('aria-hidden', 'true'); sec.appendChild(sec._caret); }
        sec.classList.add('feat-anim');
      };
      const rangeTo = (sg, count) => {
        const r = document.createRange(); let left = count, last = sg.nodes[0];
        r.setStart(sg.nodes[0], 0);
        for (const node of sg.nodes) { last = node; if (left <= node.nodeValue.length) { r.setEnd(node, left); return r; } left -= node.nodeValue.length; }
        r.setEnd(last, last.nodeValue.length); return r;
      };
      const run = (sec) => {
        sec.classList.add('is-in');
        const segs = sec._segs; let t0 = 0;
        const frame = (now) => {
          if (!t0) t0 = now;
          const t = now - t0;
          let caretAt = null;
          segs.forEach((sg) => {
            if (t < sg.start - 40) return;
            sg.el.classList.add('line-on');
            const k = Math.min(sg.total, Math.max(0, Math.floor((t - sg.start) / sg.dur * sg.total) + 1));
            const r = rangeTo(sg, k);
            CSS.highlights.set(sg.name, new Highlight(r));
            if (k < sg.total) { const c = r.cloneRange(); c.collapse(false); const rc = c.getClientRects()[0] || c.getBoundingClientRect(); if (rc && rc.height) caretAt = { rc, color: sg.color }; }
          });
          const cr = sec._caret;
          if (caretAt) {
            const sr = sec.getBoundingClientRect();
            cr.style.cssText = `display:block;left:${caretAt.rc.right - sr.left}px;top:${caretAt.rc.top - sr.top + caretAt.rc.height * .12}px;height:${caretAt.rc.height * .76}px;background:${caretAt.color}`;
          } else cr.style.display = 'none';
          if (t < sec._end + 150) requestAnimationFrame(frame);
          else cleanup(sec);
        };
        requestAnimationFrame(frame);
      };
      FEATURES.forEach(prep);
      sheet.textContent = rules;
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        const need = Math.min(0.25 * e.boundingClientRect.height, 0.25 * innerHeight);
        if (e.intersectionRect.height < need - 1) return;
        io.unobserve(e.target); run(e.target);
      }), { threshold: [0, 0.1, 0.25, 0.5, 1] });
      FEATURES.forEach((sec) => io.observe(sec));
    } catch (err) {
      root.classList.remove('js-anim');
      FEATURES.forEach(cleanup);
    }
  })();

  const reveals = $$('.reveal');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach((el) => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => observer.observe(el));
  }

  const webglOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } };

  // Load the 3D scene immediately so a screenshot never flashes before it starts.
  (function mountPcHero() {
    const link = $('#os-visual .os-preview');
    const img = link && link.querySelector('img');
    if (!img) return;
    const stage = document.createElement('span');
    stage.className = 'os-pc-stage';
    img.parentNode.insertBefore(stage, img);
    stage.appendChild(img);
    const box = document.createElement('span');
    box.className = 'os-pc-canvas';
    stage.appendChild(box);
    const fail = () => { stage.classList.add('no-webgl'); box.remove(); };
    let started = false;
    const start = () => {
      if (started) return; started = true;
      if (!webglOK()) { fail(); return; }
      const s = document.createElement('script');
      s.src = 'media/pc-hero.bundle.js';
      s.onerror = fail;
      s.onload = () => {
        if (!window.createPcHero) { fail(); return; }
        box.addEventListener('pchero:ready', () => requestAnimationFrame(() => box.classList.add('ready')), { once: true });
        try {
          const hero = window.createPcHero({ container: box, theme: isLight() ? 'light' : 'dark' });
          new MutationObserver(() => hero.setTheme(isLight() ? 'light' : 'dark')).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
        } catch (e) { fail(); }
      };
      document.head.appendChild(s);
    };
    start();
  })();

  // Use the Queues lesson's 3D lab in the landing preview.
  (function mountQueueLab() {
    const stage = $('#dsa-stage');
    if (!stage) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const ring = $('.queue-ring', stage);
    const frontLabel = $('.queue-front b', stage);
    const rearLabel = $('.queue-rear b', stage);
    const actionLabel = $('.queue-action', stage);
    const values = Array(8).fill(null);
    let front = 2, size = 4, nextValue = 53, removing = false;
    [14, 27, 31, 8].forEach((value, index) => { values[front + index] = value; });
    const slots = values.map((_, index) => {
      const slot = document.createElement('span');
      slot.className = 'queue-slot';
      const angle = (-90 + index * 45) * Math.PI / 180;
      slot.style.setProperty('--x', `${50 + 40 * Math.cos(angle)}%`);
      slot.style.setProperty('--y', `${50 + 40 * Math.sin(angle)}%`);
      slot.innerHTML = `<span class="queue-slot-index">${index}</span><span class="queue-value"></span>`;
      ring.appendChild(slot);
      return slot;
    });
    const render = () => {
      const rear = (front + size) % 8;
      slots.forEach((slot, index) => {
        const value = values[index];
        slot.classList.toggle('is-filled', value !== null);
        slot.classList.toggle('is-front', size > 0 && index === front);
        slot.classList.toggle('is-rear', index === rear);
        $('.queue-value', slot).textContent = value === null ? '' : String(value);
      });
      frontLabel.textContent = String(front);
      rearLabel.textContent = String(rear);
    };
    render();
    let timer = 0, labTimer = 0, visible = false, started = false, lab = null, labRemoving = true;
    const tick = () => {
      timer = 0;
      if (!visible || document.hidden || reduced.matches) return;
      if (size < 6 && !removing) {
        const rear = (front + size) % 8;
        slots[rear].classList.remove('is-leaving');
        values[rear] = nextValue;
        actionLabel.textContent = `ENQUEUE ${nextValue}`;
        nextValue = nextValue === 53 ? 19 : nextValue === 19 ? 45 : nextValue === 45 ? 62 : nextValue + 7;
        size++;
        render();
        slots[rear].classList.remove('is-entering');
        void slots[rear].offsetWidth;
        slots[rear].classList.add('is-entering');
        if (size === 6) removing = true;
      } else {
        actionLabel.textContent = `DEQUEUE ${values[front]}`;
        const leavingIndex = front;
        slots[leavingIndex].classList.add('is-leaving');
        setTimeout(() => {
          values[leavingIndex] = null;
          front = (front + 1) % 8;
          size--;
          slots[leavingIndex].classList.remove('is-leaving');
          render();
        }, 380);
        if (size === 4) removing = false;
      }
      timer = setTimeout(tick, 1600);
    };
    const sync = () => {
      clearTimeout(timer);
      clearTimeout(labTimer);
      const playing = visible && !document.hidden && !reduced.matches;
      if (lab) {
        if (playing) { lab.resume(); labTimer = setTimeout(labTick, 1500); }
        else lab.pause();
      } else if (playing && stage.classList.contains('no-webgl')) timer = setTimeout(tick, 1400);
    };
    const labTick = () => {
      labTimer = 0;
      if (!lab || !visible || document.hidden || reduced.matches) return;
      const state = lab.getState();
      if (labRemoving) {
        lab.dequeue();
        if (state.size <= 4) labRemoving = false;
      } else {
        lab.enqueue();
        if (state.size >= 5) labRemoving = true;
      }
      labTimer = setTimeout(labTick, 1900);
    };
    const fallback = () => { stage.classList.add('no-webgl'); sync(); };
    const start3d = () => {
      if (started) return;
      if (reduced.matches) { fallback(); return; }
      started = true;
      if (!webglOK()) { fallback(); return; }
      const script = document.createElement('script');
      script.src = 'bundles/queue-lab.bundle.js?v=20261101';
      script.onerror = fallback;
      script.onload = () => {
        if (!window.createQueueLab) { fallback(); return; }
        const box = document.createElement('span');
        box.className = 'dsa-canvas';
        stage.appendChild(box);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          try {
            lab = window.createQueueLab({ container: box });
            lab.setMode('inline');
            lab.resize();
            box.classList.add('ready');
            stage.classList.add('is-live');
            sync();
          } catch (error) {
            if (lab) lab.dispose();
            lab = null;
            box.remove();
            fallback();
          }
        }));
      };
      document.head.appendChild(script);
    };
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    start3d();
    if (!('IntersectionObserver' in window)) { visible = true; sync(); return; }
    new IntersectionObserver((es) => {
      visible = es[es.length - 1].isIntersecting;
      sync();
    }, { threshold: .1 }).observe(stage);
  })();

  // Chat figure from the Using LLMs course (LLMUse3D "chat" scenario): lazy-load, auto-advance, pause offscreen.
  (function mountChatLab() {
    const card = $('#ai-chat');
    if (!card) return;
    const stage = $('.ai-chat-stage', card);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const REDUCED_STEP = 2;
    let view = null, timer = 0, visible = false, started = false;
    const fail = () => { try { view && view.dispose(); } catch (e) {} view = null; card.classList.add('no-webgl'); };
    const make = (at) => {
      view = window.LLMUse3D.createWindow(stage, { scenario: 'chat' });
      view.setStep(Math.min(at, view.STEPS - 1));
    };
    const stop = () => { clearInterval(timer); timer = 0; };
    const sync = () => {
      stop();
      if (!view || !visible || document.hidden || reduced.matches) return;
      timer = setInterval(() => view.setStep(view.step >= view.STEPS - 1 ? 0 : view.step + 1), 2400);
    };
    const start = () => {
      if (started) return; started = true;
      if (!webglOK()) { fail(); return; }
      const s = document.createElement('script');
      s.src = 'bundles/llm-use-lab.bundle.js';
      s.onerror = fail;
      s.onload = () => {
        if (!window.LLMUse3D) { fail(); return; }
        try { make(reduced.matches ? REDUCED_STEP : 0); } catch (e) { fail(); return; }
        card.classList.add('is-live');
        sync();
      };
      document.head.appendChild(s);
    };
    new MutationObserver(() => {
      if (!view) return;
      const at = view.step; stop();
      try { view.dispose(); } catch (e) {}
      try { make(at); } catch (e) { fail(); return; }
      sync();
    }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', () => { if (view && reduced.matches) view.setStep(REDUCED_STEP); sync(); });
    if (!('IntersectionObserver' in window)) { visible = true; start(); return; }
    new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; if (visible) start(); sync(); }, { rootMargin: '300px 0px' }).observe(card);
  })();

})();
