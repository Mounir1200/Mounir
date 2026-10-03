(() => {
  'use strict';

  const t = (source, variables = {}) => window.portfolioI18n?.t(source, variables)
    ?? source.replace(/\{(\w+)\}/g, (match, name) => variables[name] ?? match);

  const fan = document.querySelector('.photo-fan');
  if (!fan) return;
  const stage = fan.querySelector('.fan-stage');
  const cards = [...fan.querySelectorAll('.fan-card')];
  const links = cards.map(card => card.querySelector('.gallery-link'));
  const previous = fan.querySelector('[data-fan-prev]');
  const next = fan.querySelector('[data-fan-next]');
  const play = fan.querySelector('[data-fan-play]');
  const title = fan.querySelector('[data-fan-title]');
  const caption = fan.querySelector('[data-fan-caption]');
  const counter = fan.querySelector('[data-fan-counter]');
  const announcement = fan.querySelector('[data-fan-announcement]');
  const dialog = document.getElementById('gallery-dialog');
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  if (!stage || cards.length < 2 || links.some(link => !link) || !previous || !next || !play) return;

  const count = cards.length;
  const interval = 4600;
  let phase = 0;
  let current = -1;
  let spacing = 180;
  let visibleRange = 4;
  let frame = null;
  let lastTime = 0;
  let tween = null;
  let inView = false;
  let hovered = false;
  let focused = false;
  let paused = false;
  let drag = null;
  let suppressClick = false;
  let clickTimer = null;
  let reduced = false;
  let focusAfterMove = false;
  let announcedIndex = null;

  const wrap = value => ((value % count) + count) % count;
  const activeIndex = () => wrap(Math.round(phase));
  const closestPhase = index => phase + wrap(index - wrap(phase) + count / 2) - count / 2;
  const autoAllowed = () => inView && !document.hidden && !reduced && !paused && !hovered
    && !focused && !dialog?.open && !drag && !tween;

  function render() {
    const center = wrap(phase);
    cards.forEach((card, index) => {
      const distance = wrap(index - center + count / 2) - count / 2;
      const depth = Math.abs(distance);
      const visible = depth < visibleRange;
      const x = distance * spacing;
      const y = Math.pow(depth, 1.5) * 26;
      const scale = Math.max(.48, 1 - depth * .15);
      card.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), ${y.toFixed(2)}px, 0) rotate(${(distance * 8).toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      card.style.opacity = String(Math.min(1, Math.max(0, (visibleRange - depth) * 1.5)));
      card.style.visibility = visible ? 'visible' : 'hidden';
      card.style.zIndex = String(100 - Math.round(depth * 10));
      // Load nearby prints; the full-resolution photograph is only requested by the dialog.
      if (inView && visible && links[index].querySelector('img').loading !== 'eager') links[index].querySelector('img').loading = 'eager';
    });
    const index = activeIndex();
    if (index === current) return;
    current = index;
    cards.forEach((card, i) => {
      card.dataset.current = String(i === index);
      links[i].tabIndex = i === index ? 0 : -1;
      card.setAttribute('aria-hidden', String(i !== index));
    });
    renderCaption();
  }

  function renderCaption() {
    if (current < 0) return;
    // Titles and captions have already been localized on the source links.
    title.textContent = links[current].dataset.galleryTitle || '';
    caption.textContent = links[current].dataset.galleryCaption || '';
    counter.textContent = t('{current} / {total}', {
      current: String(current + 1).padStart(2, '0'), total: String(count).padStart(2, '0')
    });
    counter.setAttribute('aria-label', t('Photo {current} sur {total}', { current: current + 1, total: count }));
  }

  function renderAnnouncement() {
    if (announcedIndex === null) return;
    announcement.textContent = t('Photo {current} sur {total} : {title}', {
      current: announcedIndex + 1, total: count, title: links[announcedIndex].dataset.galleryTitle || ''
    });
  }

  function updateControls() {
    const stopped = reduced || paused;
    play.querySelector('.fan-play-label').textContent = t(stopped ? 'Défiler' : 'Pause');
    play.querySelector('.fan-play-symbol').textContent = stopped ? '▷' : 'Ⅱ';
    play.setAttribute('aria-label', t(stopped ? 'Lancer le défilement des photos' : 'Mettre le défilement des photos en pause'));
    previous.setAttribute('aria-label', t('Photographie précédente'));
    next.setAttribute('aria-label', t('Photographie suivante'));
    stage.setAttribute('aria-label', t('Les photographies'));
    play.disabled = reduced;
    play.hidden = reduced;
    fan.dataset.playing = String(autoAllowed());
  }

  function tick(now) {
    frame = null;
    const elapsed = lastTime ? Math.min(now - lastTime, 50) : 0;
    lastTime = now;
    if (tween) {
      const progress = Math.min(1, (now - tween.start) / 650);
      const eased = 1 - Math.pow(1 - progress, 4);
      phase = tween.from + (tween.to - tween.from) * eased;
      if (progress === 1) tween = null;
    } else if (autoAllowed()) {
      phase = wrap(phase + elapsed / interval);
    }
    render();
    if (!tween && focusAfterMove) {
      focusAfterMove = false;
      links[current].focus({ preventScroll: true });
    }
    updateControls();
    if (tween || autoAllowed()) frame = requestAnimationFrame(tick);
    else lastTime = 0;
  }

  function sync() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastTime = 0;
    if (document.hidden || !inView || dialog?.open) tween = null;
    updateControls();
    if (tween || autoAllowed()) frame = requestAnimationFrame(tick);
  }

  function moveTo(target, announceChange = true) {
    if (stage.contains(document.activeElement)) {
      focusAfterMove = true;
      stage.focus({ preventScroll: true });
    }
    if (reduced) {
      phase = wrap(target);
      tween = null;
      render();
      if (focusAfterMove) { focusAfterMove = false; links[current].focus({ preventScroll: true }); }
    } else {
      tween = { from: phase, to: target, start: performance.now() };
    }
    if (announceChange) {
      announcedIndex = wrap(Math.round(target));
      renderAnnouncement();
    }
    sync();
  }

  function step(direction) {
    const target = (tween ? tween.to : Math.round(phase)) + direction;
    moveTo(target);
  }

  function measure() {
    const width = stage.clientWidth;
    const cardWidth = cards[0].offsetWidth;
    spacing = Math.min(cardWidth * .69, width * .32);
    visibleRange = Math.min(4.45, width / (2 * spacing) + .75);
    render();
  }

  function syncPreference() {
    reduced = preference.matches || navigator.connection?.saveData || root.dataset.motion === 'reduced';
    if (reduced) {
      phase = Math.round(phase);
      tween = null;
    }
    render();
    sync();
  }

  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  play.addEventListener('click', () => {
    paused = !paused;
    // An explicit Play command may resume while the play button retains keyboard focus.
    if (!paused) focused = false;
    sync();
  });
  fan.addEventListener('focusin', () => { focused = true; sync(); });
  fan.addEventListener('focusout', event => {
    if (!fan.contains(event.relatedTarget)) { focused = false; sync(); }
  });
  stage.addEventListener('pointerenter', () => { if (finePointer.matches) { hovered = true; sync(); } });
  stage.addEventListener('pointerleave', () => { hovered = false; sync(); });
  fan.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') moveTo(closestPhase(0));
    else if (event.key === 'End') moveTo(closestPhase(count - 1));
    else step(event.key === 'ArrowRight' ? 1 : -1);
  });

  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, phase, moving: false };
    tween = null;
    sync();
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moving) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { drag = null; sync(); return; }
      if (Math.abs(dx) < 9 || Math.abs(dx) < Math.abs(dy)) return;
      drag.moving = true;
      fan.dataset.dragging = 'true';
      stage.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    phase = drag.phase - dx / spacing;
    render();
  });
  function finishDrag(event) {
    if (!drag || drag.id !== event.pointerId) return;
    const moved = drag.moving;
    drag = null;
    fan.dataset.dragging = 'false';
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (moved) {
      suppressClick = true;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { suppressClick = false; }, 350);
      moveTo(Math.round(phase));
    } else sync();
  }
  stage.addEventListener('pointerup', finishDrag);
  stage.addEventListener('pointercancel', finishDrag);
  stage.addEventListener('lostpointercapture', finishDrag);
  // A press may leave the stage before reaching the horizontal capture threshold.
  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);
  window.addEventListener('blur', () => {
    drag = null;
    hovered = false;
    tween = null;
    fan.dataset.dragging = 'false';
    sync();
  });
  stage.addEventListener('dragstart', event => event.preventDefault());
  stage.addEventListener('click', event => {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }
  }, true);

  document.addEventListener('visibilitychange', sync);
  document.addEventListener('languagechange', () => {
    renderCaption();
    updateControls();
    renderAnnouncement();
  });
  window.addEventListener('pagehide', sync);
  preference.addEventListener('change', syncPreference);
  navigator.connection?.addEventListener?.('change', syncPreference);
  new MutationObserver(syncPreference).observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  if (dialog) {
    new MutationObserver(sync).observe(dialog, { attributes: true, attributeFilter: ['open'] });
    dialog.addEventListener('close', () => {
      // app.js restores the originating link first, even when a side print was opened.
      const index = links.indexOf(document.activeElement);
      if (index !== -1) { phase = index; render(); }
      sync();
    });
  }

  fan.classList.add('fan-ready');
  measure();
  syncPreference();
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(stage);
  else window.addEventListener('resize', measure, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      render();
      sync();
    }, { threshold: .15 }).observe(stage);
  } else { inView = true; sync(); }
})();
