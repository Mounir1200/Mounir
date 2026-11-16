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
const isInsideIgnored = stack => stack.at(-1)?.ignored === true;

function decodeEntity(match, entity) {
  if (entity[0] !== '#') return ENTITIES[entity] || match;
  const isHex = entity[1].toLowerCase() === 'x';
  return String.fromCodePoint(isHex ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)));
}
const decode = value => value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, decodeEntity);

function parseAttributes(source) {
  const attributes = new Map();
  for (const [, name, double, single, bare] of source.matchAll(ATTRIBUTE)) {
    attributes.set(name.toLowerCase(), decode(double ?? single ?? bare ?? ''));
  }
  return attributes;
}

function translatableAttributes(name, attributes) {
  const values = TRANSLATED_ATTRIBUTES.filter(key => attributes.has(key)).map(key => attributes.get(key));
  if (name === 'meta' && attributes.get('name') === 'description') values.push(attributes.get('content'));
  return values;
}

// Returns the attribute strings of the opened element that i18n.js translates.
function openElement(stack, name, attributes) {
  const ignored = isInsideIgnored(stack) || SKIPPED_ELEMENTS.has(name) || attributes.has('data-i18n-ignore');
  if (!VOID_ELEMENTS.has(name)) stack.push({ name, ignored });
  return ignored ? [] : translatableAttributes(name, attributes);
}

function closeElement(stack, name) {
  const opened = stack.map(entry => entry.name).lastIndexOf(name);
  if (opened >= 0) stack.length = opened;
}

function translatableStrings(html) {
  const strings = [];
  const stack = [];
  let cursor = 0;
  for (const match of html.matchAll(TOKEN)) {
    if (!isInsideIgnored(stack)) strings.push(decode(html.slice(cursor, match.index)));
    cursor = match.index + match[0].length;
    const [, closing, name, rawAttributes] = match;
    if (!name) continue;
    if (closing) closeElement(stack, name.toLowerCase());
    else strings.push(...openElement(stack, name.toLowerCase(), parseAttributes(rawAttributes)));
  }
  return strings.map(normalize).filter(hasLetter);
}

const missingTranslations = (html, translations) =>
  [...new Set(translatableStrings(html))].filter(text => !Object.hasOwn(translations, text));

function loadTranslations() {
  const context = { window: {} };
  vm.runInNewContext(read('translations.js'), context);
  vm.runInNewContext(read('dynamic-translations.js'), context);
  return { ...context.window.portfolioTranslations, ...context.window.portfolioDynamicTranslations };
}

function main() {
  const missing = missingTranslations(read('index.html'), loadTranslations());
  assert.deepEqual(missing, [], `French strings without an English translation in translations.js:\n${missing.join('\n')}`);
  console.log('Translation checks passed: every French string in index.html has an English translation.');
}

if (require.main === module) main();
module.exports = { translatableStrings, missingTranslations };
