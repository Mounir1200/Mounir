(() => {
  'use strict';

  const audio = document.getElementById('background-music');
  const controls = [...document.querySelectorAll('[data-sound-toggle]')];
  const status = document.getElementById('sound-status');
  if (!audio || !controls.length) return;

  const root = document.documentElement;
  const t = (text, vars) => window.portfolioI18n?.t(text, vars) ?? text;
  const preferenceKey = 'mounir-background-music';
  const volume = .18;
  let statusMessage = '';
  let wanted = true;
  let pending = false;
  let request = 0;
  let context;
  let gain;
  let source;
  try { wanted = localStorage.getItem(preferenceKey) !== 'off'; } catch (_) { /* Storage can be disabled. */ }
  audio.volume = volume;

  function render(state) {
    root.dataset.sound = state;
    const playing = state === 'playing';
    const label = playing ? 'Son activé' : state === 'starting' ? 'Chargement…' : state === 'off' ? 'Son coupé' : 'Activer le son';
    controls.forEach(button => {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', t(playing || state === 'starting' ? 'Couper la musique de fond' : 'Activer la musique de fond'));
      button.title = t(playing ? 'Positive Chill Hop · ZephiraMusic — couper le son' : 'Écouter à faible volume');
      button.querySelector('[data-sound-label]').textContent = t(label);
    });
  }

  function setStatus(message) {
    statusMessage = message;
    status.textContent = message ? t(message) : '';
  }

  function remember() {
    try { localStorage.setItem(preferenceKey, wanted ? 'on' : 'off'); } catch (_) { /* Playback still works without storage. */ }
  }

  function isAudible() {
    return wanted && !audio.paused && !audio.muted && !audio.error && !audio.ended && audio.readyState >= 3 && (!context || context.state === 'running');
  }

  function sync() {
    render(isAudible() ? 'playing' : !wanted ? 'off' : pending ? 'starting' : 'ready');
  }

  function prepareVolume() {
    // A gain node also keeps the mix quiet on mobile browsers with fixed media volume.
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!context && AudioContext) {
      try {
        context = new AudioContext();
        gain = context.createGain();
        gain.gain.value = volume;
        source = context.createMediaElementSource(audio);
        source.connect(gain);
        gain.connect(context.destination);
        audio.volume = 1;
        context.addEventListener('statechange', sync);
      } catch (_) {
        if (context) context.close().catch(() => {});
        context = null;
        audio.volume = volume;
      }
    }
    if (context && context.state !== 'running') context.resume().then(sync).catch(sync);
  }

  async function start() {
    if (!wanted) return;
    prepareVolume();
    if (pending) return;
    const attempt = ++request;
    pending = true;
    render('starting');
    try {
      if (audio.error) audio.load();
      await audio.play();
      if (attempt !== request) return;
      pending = false;
      sync();
    } catch (error) {
      if (attempt !== request) return;
      pending = false;
      sync();
      if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
        setStatus('La musique est momentanément indisponible. Vous pouvez réessayer.');
      }
    }
  }

  controls.forEach(button => button.addEventListener('click', () => {
    if (wanted && (isAudible() || pending)) {
      wanted = false;
      pending = false;
      request++;
      audio.pause();
      render('off');
      setStatus('Musique de fond coupée.');
    } else {
      wanted = true;
      setStatus('');
      start();
    }
    remember();
  }));

  function unlock(event) {
    if (!wanted || event.target.closest?.('[data-sound-toggle]')) return;
    if (event.type === 'keydown' && (event.repeat || event.ctrlKey || event.metaKey || event.altKey || !['Enter', ' '].includes(event.key))) return;
    if (!isAudible()) start();
  }
  document.addEventListener('click', unlock);
  document.addEventListener('keydown', unlock);

  audio.addEventListener('playing', () => {
    if (!wanted) { audio.pause(); return; }
    pending = false;
    setStatus('');
    sync();
  });
  ['pause', 'waiting', 'stalled', 'ended', 'volumechange'].forEach(event => audio.addEventListener(event, sync));
  audio.addEventListener('error', () => {
    pending = false;
    sync();
    setStatus('La musique est momentanément indisponible. Vous pouvez réessayer.');
  });

  document.addEventListener('languagechange', () => {
    sync();
    setStatus(statusMessage);
  });

  render(wanted ? 'ready' : 'off');
  if (wanted) start();
})();
