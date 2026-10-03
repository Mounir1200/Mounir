(() => {
  'use strict';

  const root = document.documentElement;
  const preferenceKey = 'mounir-language';
  const translations = { ...window.portfolioTranslations, ...window.portfolioDynamicTranslations };
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  const supported = language => language === 'fr' || language === 'en';
  const browserLanguage = () => {
    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
    return preferences.map(value => value.toLowerCase().split('-')[0]).find(supported) || 'en';
  };
  let saved;
  try { saved = localStorage.getItem(preferenceKey); } catch (_) { /* Language switching also works without storage. */ }
  const requested = new URL(location.href).searchParams.get('lang');
  let explicit = supported(requested) || supported(saved);
  let language = supported(requested) ? requested : supported(saved) ? saved : browserLanguage();

  function t(source, variables = {}) {
    const translated = language === 'en' ? translations[normalize(source)] ?? source : source;
    return translated.replace(/\{(\w+)\}/g, (match, key) => variables[key] ?? match);
  }

  // Keep the original text nodes so inline emphasis, links and event handlers survive switching.
  const texts = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script, style, noscript, [data-i18n-ignore]')) continue;
    if (Object.hasOwn(translations, normalize(node.nodeValue))) texts.push({ node, original: node.nodeValue });
  }
  const attributes = [];
  ['aria-label', 'alt', 'title', 'data-gallery-title', 'data-gallery-caption'].forEach(name => {
    document.querySelectorAll(`[${name}]`).forEach(element => {
      if (element.closest('[data-i18n-ignore]')) return;
      const original = element.getAttribute(name);
      if (Object.hasOwn(translations, normalize(original))) attributes.push({ element, name, original });
    });
  });
  const description = document.querySelector('meta[name="description"]');
  if (description) attributes.push({ element: description, name: 'content', original: description.content });

  function apply() {
    root.lang = language;
    texts.forEach(({ node, original }) => {
      const leading = original.match(/^\s*/)[0];
      const trailing = original.match(/\s*$/)[0];
      node.nodeValue = language === 'fr' ? original : leading + t(normalize(original)) + trailing;
    });
    attributes.forEach(({ element, name, original }) => element.setAttribute(name, t(original)));
    document.querySelectorAll('[data-cv-fr][data-cv-en]').forEach(link => {
      link.href = link.dataset[language === 'en' ? 'cvEn' : 'cvFr'];
      link.download = `DABIRE_Mounir_CV_${language.toUpperCase()}.pdf`;
    });
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    document.querySelectorAll('.language-switch').forEach(group => { group.hidden = false; });
    document.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
  }

  function setLanguage(next, persist = true) {
    if (!supported(next)) return;
    language = next;
    if (persist) {
      explicit = true;
      try { localStorage.setItem(preferenceKey, language); } catch (_) { /* The current visit still uses the selected language. */ }
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      history.replaceState(history.state, '', url);
    }
    apply();
  }

  window.portfolioI18n = { t, setLanguage, get language() { return language; } };
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  window.addEventListener('languagechange', event => {
    if (event.target === window && !explicit) setLanguage(browserLanguage(), false);
  });
  apply();
})();
