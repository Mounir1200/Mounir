(() => {
  'use strict';

  const root = document.documentElement;
  const welcomeScreen = document.getElementById('welcome-screen');
  const hero = document.getElementById('univers');
  const portrait = document.getElementById('poster-image');
  const presentation = document.getElementById('presentation');
  const toggle = document.getElementById('intro-toggle');
  const replay = document.getElementById('intro-replay');
  const cue = document.getElementById('intro-cue');
  const introStatus = document.getElementById('intro-status');
  const meter = document.querySelector('.poster-meter > span');
  const galleryLinks = [...document.querySelectorAll('.gallery-link')];
  const galleryDialog = document.getElementById('gallery-dialog');
  const galleryImage = document.getElementById('gallery-full-image');
  const galleryTitle = document.getElementById('gallery-dialog-title');
  const galleryCaption = document.getElementById('gallery-dialog-caption');
  const galleryCounter = document.getElementById('gallery-counter');
  const galleryPrevious = document.getElementById('gallery-prev');
  const galleryNext = document.getElementById('gallery-next');
  const galleryClose = document.getElementById('gallery-close');
  const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const connection = navigator.connection;
  const duration = 6500;
  const reveals = [...document.querySelectorAll('.motion-reveal, .project-art, .kinetic-band')];
  const artworks = [...document.querySelectorAll('.project-art')];
  const progressingSections = [...document.querySelectorAll('.featured-project, #portrait')];
  const transitionOverlay = document.getElementById('page-transition');
  const transitionPanels = [...(transitionOverlay?.querySelectorAll('.transition-panel') || [])];
  const transitionWord = transitionOverlay?.querySelector('.transition-word');
  const navigation = [...document.querySelectorAll('a[data-nav]')]
    .map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter(item => item.section);
  let activeTransition = null;
  let activeNavigation = null;
  let navigationOffset = 0;
  let activeGalleryLinks = [];
  let galleryIndex = 0;
  let galleryReturnFocus = null;
  let galleryAnimation = null;
  let reduced = false;
  let imageReady = Boolean(portrait?.complete && portrait.naturalWidth > 0);
  let imageFailed = Boolean(portrait?.complete && !portrait.naturalWidth);
  let state = 'idle';
  let elapsed = 0;
  let lastTime = 0;
  let introFrame = null;
  let scrollFrame = null;
  let positionFrame = null;
  let manuallyPaused = false;
  let suspendedByPage = false;
  let introStarted = false;
  let welcomeDone = !welcomeScreen || root.dataset.welcome !== 'pending';
  let welcomeTimer = null;
  let welcomeExitTimer = null;
  let autoAdvance = Boolean(hero && presentation && portrait)
    && window.scrollY <= 8 && !location.hash && !document.hidden && !imageFailed;

  function updateCue() {
    const label = cue?.querySelector('span:first-child');
    if (label) label.textContent = autoAdvance ? 'La suite après l’intro' : 'Explorer le portfolio';
  }

  function finishWelcome(resumeIntro = true) {
    clearTimeout(welcomeTimer);
    clearTimeout(welcomeExitTimer);
    welcomeTimer = null;
    welcomeExitTimer = null;
    welcomeDone = true;
    root.dataset.welcome = 'complete';
    if (welcomeScreen) welcomeScreen.hidden = true;
    if (resumeIntro) syncPageVisibility();
  }

  function beginWelcome() {
    if (welcomeDone || reduced || document.hidden) {
      if (document.hidden) cancelAutomaticScroll();
      finishWelcome(false);
      return;
    }
    welcomeScreen.hidden = false;
    welcomeTimer = setTimeout(() => {
      welcomeTimer = null;
      if (reduced || document.hidden) {
        cancelAutomaticScroll();
        finishWelcome();
        return;
      }
      root.dataset.welcome = 'leaving';
      welcomeExitTimer = setTimeout(() => finishWelcome(), 650);
    }, 1400);
  }

  function cancelAutomaticScroll() {
    autoAdvance = false;
    if (scrollFrame !== null) {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = null;
    }
    updateCue();
  }

  function cancelPageTransition() {
    const transition = activeTransition;
    activeTransition = null;
    if (transition) {
      transition.cancelled = true;
      clearTimeout(transition.timeout);
      transition.animations.forEach(animation => animation.cancel());
    }
    if (transitionOverlay) {
      transitionOverlay.dataset.active = 'false';
      transitionOverlay.style.visibility = 'hidden';
      transitionOverlay.hidden = true;
    }
  }

  function interruptNavigation() {
    cancelAutomaticScroll();
    cancelPageTransition();
    if (!welcomeDone) finishWelcome();
  }

  function stopGalleryAnimation() {
    galleryAnimation?.cancel();
    galleryAnimation = null;
  }

  function showGalleryImage(index) {
    if (!activeGalleryLinks.length) return;
    galleryIndex = ((index % activeGalleryLinks.length) + activeGalleryLinks.length) % activeGalleryLinks.length;
    const link = activeGalleryLinks[galleryIndex];
    galleryImage.alt = link.querySelector('img')?.alt || link.dataset.galleryTitle || 'Photographie de Mounir';
    galleryImage.src = link.href;
    galleryTitle.textContent = link.dataset.galleryTitle || 'Galerie';
    galleryCaption.textContent = link.dataset.galleryCaption || '';
    galleryCounter.textContent = (galleryIndex + 1) + ' / ' + activeGalleryLinks.length;
  }

  function openGallery(link) {
    if (!galleryLinks.includes(link) || !galleryDialog || typeof galleryDialog.showModal !== 'function'
      || !galleryImage || !galleryTitle || !galleryCaption || !galleryCounter
      || !galleryPrevious || !galleryNext || !galleryClose) return false;
    const group = link.dataset.galleryGroup?.trim() || 'portraits';
    activeGalleryLinks = galleryLinks.filter(item => (item.dataset.galleryGroup?.trim() || 'portraits') === group);
    showGalleryImage(activeGalleryLinks.indexOf(link));
    try {
      if (!galleryDialog.open) galleryDialog.showModal();
    } catch (_) { return false; }
    interruptNavigation();
    galleryReturnFocus = link;
    document.body.classList.add('gallery-open');
    galleryClose.focus({ preventScroll: true });
    stopGalleryAnimation();
    if (!reduced && typeof galleryDialog.animate === 'function') {
      try {
        galleryAnimation = galleryDialog.animate(
          [{ opacity: 0, transform: 'translateY(14px) scale(.985)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
          { duration: 250, easing: 'cubic-bezier(.2,.7,.2,1)' });
        galleryAnimation.finished.catch(() => {});
      } catch (_) { /* The native dialog remains usable without an entrance effect. */ }
    }
    return true;
  }

  function migrateLegacyFilmAnchor() {
    if (document.readyState !== 'complete' || !['#film', '#film-details'].includes(location.hash)) return;
    const gallery = document.getElementById('galerie');
    if (!gallery) return;
    cancelAutomaticScroll();
    cancelPageTransition();
    history.replaceState(history.state, '', '#galerie');
    gallery.scrollIntoView({ behavior: 'instant', block: 'start' });
    updatePositions();
  }

  function goToAnchor(target, url, keyboard) {
    if (location.hash !== url.hash) {
      const previousURL = location.href;
      try {
        history.pushState(history.state, '', url.hash);
        window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL: previousURL, newURL: location.href }));
      } catch (_) {
        location.hash = url.hash;
      }
    }
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
    if (keyboard) {
      const temporaryTabIndex = !target.hasAttribute('tabindex');
      if (temporaryTabIndex) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (temporaryTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
  }

  async function transitionToAnchor(target, url, keyboard) {
    const transition = { animations: [], cancelled: false, navigated: false, timeout: null };
    activeTransition = transition;
    const labels = { projets: 'Projets', portrait: 'Parcours', experiences: 'Expériences', contact: 'Contact', presentation: 'Explorer', univers: 'Accueil', galerie: 'Galerie', hobbies: 'Hobbies' };
    transitionWord.textContent = labels[target.id] || 'Explorer';
    transitionOverlay.hidden = false;
    transitionOverlay.dataset.active = 'true';
    transitionOverlay.style.visibility = 'visible';
    const animate = (element, frames, options) => {
      const animation = element.animate(frames, options);
      // Cancellation is expected input, including for the decorative word.
      animation.finished.catch(() => {});
      transition.animations.push(animation);
      return animation;
    };
    const navigate = () => {
      if (transition.navigated) return;
      transition.navigated = true;
      goToAnchor(target, url, keyboard);
    };
    // A backgrounded tab or failed animation must never leave the page covered.
    transition.timeout = setTimeout(() => {
      if (activeTransition !== transition) return;
      if (!reduced && !document.hidden) navigate();
      cancelPageTransition();
    }, 1800);
    try {
      const entering = transitionPanels.map((panel, index) => animate(panel,
        [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
        { duration: 420, delay: index * 45, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'both' }));
      animate(transitionWord,
        [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 280, delay: 180, easing: 'ease-out', fill: 'both' });
      await Promise.all(entering.map(animation => animation.finished));
      if (activeTransition !== transition || transition.cancelled || reduced || document.hidden) return;
      navigate();
      const exiting = transitionPanels.map((panel, index) => animate(panel,
        [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }],
        { duration: 420, delay: (transitionPanels.length - 1 - index) * 45, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'both' }));
      animate(transitionWord,
        [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-16px)' }],
        { duration: 220, easing: 'ease-in', fill: 'both' });
      await Promise.all(exiting.map(animation => animation.finished));
    } catch (_) {
      if (activeTransition === transition && !transition.cancelled && !reduced && !document.hidden) navigate();
    } finally {
      if (activeTransition === transition) cancelPageTransition();
    }
  }

  function inHero() {
    if (!hero) return false;
    const bounds = hero.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < window.innerHeight;
  }

  function setProgress() {
    const progress = Math.min(1, elapsed / duration);
    hero?.style.setProperty('--intro-progress', String(progress));
    if (meter) meter.style.transform = 'scaleX(' + progress + ')';
  }

  function setState(next) {
    state = next;
    if (hero) hero.dataset.intro = next;
    if (toggle) {
      toggle.disabled = reduced || !imageReady || imageFailed;
      toggle.textContent = reduced ? 'Animations réduites' : next === 'playing' ? 'Pause' : next === 'complete' ? 'Revoir' : 'Animer';
      toggle.setAttribute('aria-label', reduced ? 'Animations réduites' : next === 'playing' ? 'Mettre l’introduction en pause' : next === 'complete' ? 'Revoir l’introduction' : 'Animer l’introduction');
      toggle.setAttribute('aria-pressed', String(next === 'paused'));
    }
    if (replay) {
      replay.disabled = reduced || !imageReady || imageFailed;
      replay.setAttribute('aria-label', 'Rejouer l’introduction sans défilement automatique');
    }
    if (introStatus) introStatus.textContent = imageFailed ? 'Le portrait ne peut pas être chargé.' : reduced ? 'Animations réduites.' : next === 'paused' ? 'Introduction en pause.' : next === 'complete' ? 'Introduction terminée.' : '';
  }

  function pauseIntro() {
    if (introFrame !== null) cancelAnimationFrame(introFrame);
    introFrame = null;
    if (state === 'playing') setState('paused');
  }

  function advanceToPresentation() {
    // Each frame is cancellable: user input cannot leave a native scroll queued.
    const start = window.scrollY;
    const margin = parseFloat(getComputedStyle(presentation).scrollMarginTop) || 0;
    const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || navigationOffset;
    const target = Math.max(0, start + presentation.getBoundingClientRect().top - margin - padding);
    const startedAt = performance.now();
    function step(now) {
      if (reduced || document.hidden) { cancelAutomaticScroll(); return; }
      const fraction = Math.min(1, (now - startedAt) / 1300);
      const eased = fraction < 0.5 ? 4 * fraction ** 3 : 1 - (-2 * fraction + 2) ** 3 / 2;
      window.scrollTo({ top: start + (target - start) * eased, behavior: 'instant' });
      scrollFrame = fraction < 1 ? requestAnimationFrame(step) : null;
    }
    scrollFrame = requestAnimationFrame(step);
  }

  function tick(now) {
    if (state !== 'playing') return;
    elapsed = Math.min(duration, elapsed + Math.max(0, now - lastTime));
    lastTime = now;
    setProgress();
    if (elapsed < duration) {
      introFrame = requestAnimationFrame(tick);
      return;
    }
    introFrame = null;
    setState('complete');
    const shouldAdvance = autoAdvance && !reduced && !document.hidden
      && imageReady && !imageFailed && inHero() && window.scrollY <= 20;
    cancelAutomaticScroll();
    if (shouldAdvance) advanceToPresentation();
  }

  function startIntro(restart = false) {
    if (!welcomeDone || !hero || !portrait || !imageReady || imageFailed || reduced || document.hidden || !inHero()) return;
    if (introFrame !== null) cancelAnimationFrame(introFrame);
    if (restart) {
      elapsed = 0;
      setState('idle');
      // Flush idle styles so all CSS animation timelines restart together.
      void hero.offsetWidth;
    }
    introStarted = true;
    manuallyPaused = false;
    suspendedByPage = false;
    lastTime = performance.now();
    setProgress();
    setState('playing');
    introFrame = requestAnimationFrame(tick);
  }

  function resetTilts() {
    artworks.forEach(art => {
      art.style.setProperty('--tilt-x', '0deg');
      art.style.setProperty('--tilt-y', '0deg');
    });
  }

  function updateNavigationOffset() {
    navigationOffset = parseFloat(getComputedStyle(root).scrollPaddingTop)
      || (document.querySelector('.site-header')?.getBoundingClientRect().height || 0) + 16;
  }

  function updateActiveNavigation() {
    if (!navigation.length) return;
    let active = navigation[0];
    if (window.scrollY + window.innerHeight >= root.scrollHeight - 2) {
      active = navigation.find(item => item.section.id === 'contact') || navigation[navigation.length - 1];
    } else {
      // Section starts keep a tall section active until its successor arrives.
      for (const item of navigation) {
        if (item.section.getBoundingClientRect().top <= navigationOffset + 8) active = item;
      }
    }
    if (activeNavigation === active) return;
    activeNavigation = active;
    navigation.forEach(item => {
      if (item === active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
  }

  function updatePositions() {
    positionFrame = null;
    const extent = Math.max(1, root.scrollHeight - window.innerHeight);
    root.style.setProperty('--scroll-progress', String(Math.min(1, Math.max(0, window.scrollY / extent))));
    if (hero) {
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty('--hero-progress', String(reduced ? 0 : Math.min(1, Math.max(0, -bounds.top / Math.max(1, bounds.height)))));
    }
    progressingSections.forEach(section => {
      const bounds = section.getBoundingClientRect();
      const progress = reduced ? 0 : Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / Math.max(1, window.innerHeight + bounds.height)));
      section.style.setProperty('--section-progress', String(progress));
    });
    updateActiveNavigation();
  }

  function syncMotion() {
    reduced = systemMotion.matches || Boolean(connection?.saveData);
    root.dataset.motion = reduced ? 'reduced' : 'full';
    if (reduced) {
      cancelAutomaticScroll();
      if (!welcomeDone) finishWelcome(false);
      cancelPageTransition();
      stopGalleryAnimation();
      pauseIntro();
      // Reduced motion removes CSS timelines; resume from a fresh, synchronized intro.
      elapsed = 0;
      setProgress();
      state = 'idle';
      suspendedByPage = false;
      resetTilts();
      reveals.forEach(element => element.classList.add('is-visible'));
    } else {
      reveals.forEach(element => {
        const bounds = element.getBoundingClientRect();
        element.classList.toggle('is-visible', bounds.bottom > 0 && bounds.top < window.innerHeight);
      });
    }
    setState(state);
    updatePositions();
  }

  function syncPageVisibility() {
    if (!welcomeDone) {
      if (!document.hidden) return;
      cancelAutomaticScroll();
      finishWelcome(false);
    }
    if (document.hidden || !inHero()) {
      if (document.hidden) {
        cancelAutomaticScroll();
        cancelPageTransition();
        stopGalleryAnimation();
      }
      if (state === 'playing') {
        suspendedByPage = true;
        pauseIntro();
      }
      return;
    }
    if (suspendedByPage && !manuallyPaused && !reduced) startIntro();
    else if (!introStarted && !manuallyPaused && !reduced) startIntro();
  }

  toggle?.addEventListener('click', () => {
    cancelAutomaticScroll();
    if (state === 'playing') {
      manuallyPaused = true;
      suspendedByPage = false;
      pauseIntro();
    } else startIntro(state === 'complete');
  });
  replay?.addEventListener('click', () => {
    cancelAutomaticScroll();
    startIntro(true);
  });
  galleryPrevious?.addEventListener('click', () => {
    if (galleryDialog?.open) showGalleryImage(galleryIndex - 1);
  });
  galleryNext?.addEventListener('click', () => {
    if (galleryDialog?.open) showGalleryImage(galleryIndex + 1);
  });
  galleryClose?.addEventListener('click', () => galleryDialog?.close?.());
  galleryDialog?.addEventListener('keydown', event => {
    if (!galleryDialog.open || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showGalleryImage(galleryIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  galleryDialog?.addEventListener('click', event => {
    if (event.target !== galleryDialog) return;
    const bounds = galleryDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) galleryDialog.close?.();
  });
  galleryDialog?.addEventListener('close', () => {
    stopGalleryAnimation();
    document.body.classList.remove('gallery-open');
    if (galleryReturnFocus?.isConnected) galleryReturnFocus.focus({ preventScroll: true });
    galleryReturnFocus = null;
  });
  systemMotion.addEventListener('change', syncMotion);
  connection?.addEventListener?.('change', syncMotion);
  finePointer.addEventListener('change', resetTilts);

  portrait?.addEventListener('load', () => {
    imageReady = portrait.naturalWidth > 0;
    imageFailed = !imageReady;
    setState(state);
    syncPageVisibility();
  });
  portrait?.addEventListener('error', () => {
    imageFailed = true;
    cancelAutomaticScroll();
    pauseIntro();
    setState('idle');
  });

  window.addEventListener('wheel', interruptNavigation, { passive: true });
  window.addEventListener('touchstart', interruptNavigation, { passive: true });
  window.addEventListener('touchmove', interruptNavigation, { passive: true });
  window.addEventListener('pointerdown', interruptNavigation, { passive: true });
  document.addEventListener('keydown', event => {
    if (['Tab', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Escape'].includes(event.key)) interruptNavigation();
  });
  document.addEventListener('click', event => {
    // Every new click clears a prior cover, including clicks on native controls.
    if (!welcomeDone) interruptNavigation();
    else cancelPageTransition();
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    cancelAutomaticScroll();
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    if (link.classList.contains('gallery-link')) {
      if (openGallery(link)) event.preventDefault();
      return;
    }
    if (reduced || document.hidden || !transitionOverlay || transitionPanels.length !== 3 || !transitionWord
      || !transitionPanels.every(panel => typeof panel.animate === 'function') || typeof transitionWord.animate !== 'function') return;
    let url;
    let target;
    try {
      url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    } catch (_) { return; }
    if (!target) return;
    event.preventDefault();
    transitionToAnchor(target, url, event.detail === 0);
  });
  window.addEventListener('scroll', () => {
    if (scrollFrame === null && window.scrollY > 20) cancelAutomaticScroll();
    if (positionFrame === null) positionFrame = requestAnimationFrame(updatePositions);
    syncPageVisibility();
  }, { passive: true });
  window.addEventListener('resize', () => {
    updateNavigationOffset();
    if (positionFrame === null) positionFrame = requestAnimationFrame(updatePositions);
  }, { passive: true });
  document.addEventListener('toggle', () => {
    if (positionFrame === null) positionFrame = requestAnimationFrame(updatePositions);
  }, true);
  document.addEventListener('visibilitychange', syncPageVisibility);
  window.addEventListener('pagehide', interruptNavigation);
  window.addEventListener('popstate', interruptNavigation);
  window.addEventListener('hashchange', migrateLegacyFilmAnchor);
  if (document.readyState === 'complete') migrateLegacyFilmAnchor();
  else window.addEventListener('load', migrateLegacyFilmAnchor, { once: true });

  artworks.forEach(art => {
    art.addEventListener('pointermove', event => {
      if (reduced || !finePointer.matches || event.pointerType === 'touch') return;
      const bounds = art.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      art.style.setProperty('--tilt-x', (-y * 5).toFixed(2) + 'deg');
      art.style.setProperty('--tilt-y', (x * 5).toFixed(2) + 'deg');
    });
    art.addEventListener('pointerleave', () => {
      art.style.setProperty('--tilt-x', '0deg');
      art.style.setProperty('--tilt-y', '0deg');
    });
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting || reduced));
    }, { threshold: 0.08 });
    reveals.forEach(element => revealObserver.observe(element));

  } else {
    reveals.forEach(element => element.classList.add('is-visible'));
  }

  if (toggle) toggle.hidden = false;
  if (replay) replay.hidden = false;
  updateNavigationOffset();
  syncMotion();
  beginWelcome();
  cancelPageTransition();
  updateCue();
  setProgress();
  syncPageVisibility();
})();
