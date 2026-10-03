// Exercise language selection and persistence without changing browser/system preferences.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const rootPath = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(rootPath, 'i18n.js'), 'utf8');

function visit({ languages = ['fr-FR'], saved, query = '', storageBlocked = false } = {}) {
  const root = { lang: 'fr' };
  const cv = { dataset: { cvFr: 'assets/Mounir-DABIRE-CV.pdf', cvEn: 'assets/Mounir-DABIRE-CV-EN.pdf' } };
  const node = { nodeValue: '  Mon CV ', parentElement: { closest: () => null } };
  const buttons = ['fr', 'en'].map(language => ({ dataset: { language }, attributes: {}, setAttribute(key, value) { this.attributes[key] = value; }, addEventListener() {} }));
  const groups = [{ hidden: true }];
  const storage = new Map(saved ? [['mounir-language', saved]] : []);
  const window = { portfolioTranslations: { 'Mon CV': 'My CV', 'Photo {current} sur {total}': 'Photo {current} of {total}' }, addEventListener() {} };
  const location = { href: `https://example.test/Mounir/${query}#hobbies` };
  const events = [];
  const document = {
    documentElement: root,
    createTreeWalker() { let seen = false; return { currentNode: node, nextNode() { if (seen) return false; seen = true; return true; } }; },
    querySelector: () => null,
    querySelectorAll(selector) { return selector === '[data-cv-fr][data-cv-en]' ? [cv] : selector === '[data-language]' ? buttons : selector === '.language-switch' ? groups : []; },
    dispatchEvent: event => events.push(event),
  };
  const context = {
    window, document, navigator: { languages, language: languages[0] }, location,
    localStorage: {
      getItem(key) { if (storageBlocked) throw new Error('Storage disabled'); return storage.get(key); },
      setItem(key, value) { if (storageBlocked) throw new Error('Storage disabled'); storage.set(key, value); },
    },
    history: { state: null, replaceState(_state, _title, url) { location.href = String(url); } },
    URL, NodeFilter: { SHOW_TEXT: 4 }, CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
  };
  vm.runInNewContext(source, context);
  return { ...context, root, cv, node, buttons, groups, storage, events, api: window.portfolioI18n };
}

for (const [languages, expected] of [
  [['fr-FR'], 'fr'], [['fr-CA'], 'fr'], [['en-GB'], 'en'], [['EN-us'], 'en'],
  [['de-DE', 'fr-BE', 'en'], 'fr'], [['de-DE', 'en-US', 'fr'], 'en'], [['ja-JP'], 'en'], [[], 'en'],
]) {
  const page = visit({ languages });
  assert.equal(page.root.lang, expected, `Browser preferences: ${languages}`);
  assert.equal(page.cv.download, `DABIRE_Mounir_CV_${expected.toUpperCase()}.pdf`);
  assert.equal(page.cv.href, expected === 'fr' ? page.cv.dataset.cvFr : page.cv.dataset.cvEn);
}
assert.equal(visit({ languages: ['en-US'], saved: 'fr' }).root.lang, 'fr');
assert.equal(visit({ saved: 'en', query: '?lang=fr' }).root.lang, 'fr');
assert.equal(visit({ saved: 'invalid', query: '?lang=xx', languages: ['en-US'] }).root.lang, 'en');

const page = visit({ query: '?music=chill' });
page.api.setLanguage('en');
assert.equal(page.node.nodeValue, '  My CV ');
assert.equal(page.api.t('Photo {current} sur {total}', { current: 2, total: 16 }), 'Photo 2 of 16');
assert.equal(page.storage.get('mounir-language'), 'en');
assert.equal(page.buttons[1].attributes['aria-pressed'], 'true');
assert.equal(new URL(page.location.href).searchParams.get('music'), 'chill');
assert.equal(new URL(page.location.href).hash, '#hobbies');
assert.equal(page.cv.href, 'assets/Mounir-DABIRE-CV-EN.pdf');
page.api.setLanguage('fr');
assert.equal(page.node.nodeValue, '  Mon CV ');
assert.equal(page.buttons[0].attributes['aria-pressed'], 'true');
assert.equal(page.cv.href, 'assets/Mounir-DABIRE-CV.pdf');
assert.equal(page.events.at(-1).detail.language, 'fr');
assert.equal(page.groups[0].hidden, false);
const blocked = visit({ storageBlocked: true });
blocked.api.setLanguage('en');
assert.equal(blocked.root.lang, 'en');
assert.equal(blocked.cv.download, 'DABIRE_Mounir_CV_EN.pdf');
console.log('Language checks passed: browser preferences, saved choice, switching, CVs and blocked storage.');
