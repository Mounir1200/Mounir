// Every French string that i18n.js can show must have an English translation.
// Mirrors i18n.js: text nodes and translatable attributes, skipping script, style,
// noscript and [data-i18n-ignore] subtrees. Strings without letters stay as they are.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const rootPath = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(rootPath, file), 'utf8');

const TRANSLATED_ATTRIBUTES = ['aria-label', 'alt', 'title', 'data-gallery-title', 'data-gallery-caption'];
const SKIPPED_ELEMENTS = new Set(['script', 'style', 'noscript']);
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const TOKEN = /<!--[\s\S]*?-->|<![^>]*>|<(\/?)([a-zA-Z][\w-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/g;
const ATTRIBUTE = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

const normalize = value => value.replace(/\s+/g, ' ').trim();
const hasLetter = value => /\p{L}/u.test(value);
const decode = value => value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity) => {
  if (entity[0] !== '#') return ENTITIES[entity] ?? match;
  return String.fromCodePoint(entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)));
});

function parseAttributes(source) {
  const attributes = new Map();
  for (const [, name, double, single, bare] of source.matchAll(ATTRIBUTE)) {
    attributes.set(name.toLowerCase(), decode(double ?? single ?? bare ?? ''));
  }
  return attributes;
}

function translatableStrings(html) {
  const strings = [];
  const stack = [];
  const isIgnored = () => stack.length > 0 && stack.at(-1).ignored;
  const collect = value => { const text = normalize(value); if (hasLetter(text)) strings.push(text); };
  let cursor = 0;
  for (const match of html.matchAll(TOKEN)) {
    if (!isIgnored()) collect(decode(html.slice(cursor, match.index)));
    cursor = match.index + match[0].length;
    const [, closing, rawName, rawAttributes = ''] = match;
    if (!rawName) continue;
    const name = rawName.toLowerCase();
    if (closing) {
      const opened = stack.map(entry => entry.name).lastIndexOf(name);
      if (opened >= 0) stack.length = opened;
      continue;
    }
    const attributes = parseAttributes(rawAttributes);
    const ignored = isIgnored() || SKIPPED_ELEMENTS.has(name) || attributes.has('data-i18n-ignore');
    if (!ignored) TRANSLATED_ATTRIBUTES.filter(key => attributes.has(key)).forEach(key => collect(attributes.get(key)));
    if (name === 'meta' && attributes.get('name') === 'description') collect(attributes.get('content'));
    if (!VOID_ELEMENTS.has(name)) stack.push({ name, ignored });
  }
  return strings;
}

function loadTranslations() {
  const context = { window: {} };
  vm.runInNewContext(read('translations.js'), context);
  vm.runInNewContext(read('dynamic-translations.js'), context);
  return { ...context.window.portfolioTranslations, ...context.window.portfolioDynamicTranslations };
}

const translations = loadTranslations();
const missing = [...new Set(translatableStrings(read('index.html')))].filter(text => !Object.hasOwn(translations, text));
assert.deepEqual(missing, [], `French strings without an English translation in translations.js:\n${missing.join('\n')}`);
console.log('Translation checks passed: every French string in index.html has an English translation.');
