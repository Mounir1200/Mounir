(() => {
  'use strict';

  const trail = document.getElementById('cursor-trail');
  if (!trail || trail.dataset.cursorReady === 'true') return;
  trail.dataset.cursorReady = 'true';
  trail.setAttribute('aria-hidden', 'true');
  trail.setAttribute('focusable', 'false');

  const root = document.documentElement;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const textControls = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]';
  const lifetime = 500;
  const maxPoints = 16;
  let points = [];
  let target = null;
  let follower = null;
  let lastInput = 0;
  let previousFrame = 0;
  let frame = null;
  let pageFocused = document.hasFocus();

  function createPath(color, width) {
    const path = document.createElementNS(svgNamespace, 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', String(width));
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    trail.append(path);
    return path;
  }

  const outline = createPath('#0057ba', 3);
  const core = createPath('#f2ad78', 1.5);
  const tail = document.createElementNS(svgNamespace, 'circle');
  tail.setAttribute('r', '1.5');
  tail.setAttribute('fill', '#f2ad78');
  trail.append(tail);

  function overTextControl(element) {
    return Boolean(element?.closest?.(textControls));
  }

  function allowed() {
    return finePointer.matches && !reducedMotion.matches && root.dataset.motion === 'full'
      && pageFocused && !document.hidden && !document.querySelector('dialog[open]')
      && !overTextControl(document.activeElement);
  }

  function clearTrail() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    points = [];
    target = null;
    follower = null;
    previousFrame = 0;
    outline.removeAttribute('d');
    core.removeAttribute('d');
    trail.style.opacity = '0';
    trail.dataset.active = 'false';
  }

  function resize() {
    trail.setAttribute('viewBox', '0 0 ' + window.innerWidth + ' ' + window.innerHeight);
    clearTrail();
  }

  function curve(samples) {
    if (samples.length < 2) return '';
    let path = 'M ' + samples[0].x.toFixed(1) + ' ' + samples[0].y.toFixed(1);
    for (let index = 1; index < samples.length - 1; index += 1) {
      const point = samples[index];
      const next = samples[index + 1];
      path += ' Q ' + point.x.toFixed(1) + ' ' + point.y.toFixed(1)
        + ' ' + ((point.x + next.x) / 2).toFixed(1) + ' ' + ((point.y + next.y) / 2).toFixed(1);
    }
    const end = samples[samples.length - 1];
    return path + ' L ' + end.x.toFixed(1) + ' ' + end.y.toFixed(1);
  }

  function draw(now) {
    frame = null;
    const age = now - lastInput;
    if (!allowed() || !target || age >= lifetime) { clearTrail(); return; }
    const step = previousFrame ? Math.min(40, now - previousFrame) : 16;
    previousFrame = now;
    const smoothing = 1 - Math.exp(-step / 38);
    follower.x += (target.x - follower.x) * smoothing;
    follower.y += (target.y - follower.y) * smoothing;
    const previous = points[points.length - 1];
    if (!previous || Math.hypot(follower.x - previous.x, follower.y - previous.y) > 0.6) {
      points.push({ x: follower.x, y: follower.y, time: now });
      if (points.length > maxPoints) points.shift();
    }
    while (points.length > 2 && now - points[0].time > 240) points.shift();

    if (points.length > 1) {
      // The smoothed follower sits behind the real cursor; native pointing stays precise.
      const path = curve(points);
      outline.setAttribute('d', path);
      core.setAttribute('d', path);
      tail.setAttribute('cx', points[0].x.toFixed(1));
      tail.setAttribute('cy', points[0].y.toFixed(1));
      tail.setAttribute('opacity', '0.65');
      trail.style.opacity = String(0.7 * Math.pow(1 - age / lifetime, 1.4));
      trail.dataset.active = 'true';
    }
    frame = requestAnimationFrame(draw);
  }

  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !allowed() || overTextControl(event.target)) {
      clearTrail();
      return;
    }
    lastInput = performance.now();
    target = { x: event.clientX, y: event.clientY };
    if (!follower) follower = { ...target };
    if (frame === null) frame = requestAnimationFrame(draw);
  }, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || overTextControl(event.target)) clearTrail();
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) clearTrail();
  }, { passive: true });
  document.addEventListener('focusin', event => {
    if (overTextControl(event.target)) clearTrail();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTrail();
  });
  window.addEventListener('blur', () => { pageFocused = false; clearTrail(); });
  window.addEventListener('focus', () => { pageFocused = true; });
  window.addEventListener('pagehide', clearTrail);
  window.addEventListener('resize', resize, { passive: true });
  finePointer.addEventListener('change', clearTrail);
  reducedMotion.addEventListener('change', clearTrail);

  new MutationObserver(() => {
    if (root.dataset.motion !== 'full') clearTrail();
  }).observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  new MutationObserver(() => {
    if (document.querySelector('dialog[open]')) clearTrail();
  }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });

  resize();
})();
