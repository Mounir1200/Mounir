// The translation check must see exactly the strings i18n.js would translate.
const assert = require('node:assert/strict');
const test = require('node:test');
const { translatableStrings, missingTranslations } = require('./check_translations.cjs');

test('collects text nodes and translatable attributes with normalised spaces', () => {
  const html = '<p title="Un titre">  Bonjour\n   le monde </p><img alt="Une photo"><a aria-label="Ouvrir" data-gallery-title="Le ciel" data-gallery-caption="Au Pixel">x</a>';
  assert.deepEqual(translatableStrings(html), ['Un titre', 'Bonjour le monde', 'Une photo', 'Ouvrir', 'Le ciel', 'Au Pixel', 'x']);
});

test('skips script, style, noscript and data-i18n-ignore subtrees with their attributes', () => {
  const html = '<script>var texte = "Bonjour";</script><style>p{content:"Salut"}</style><noscript>Activez</noscript>'
    + '<p data-i18n-ignore>Python <b title="Outil">FastAPI</b></p><span data-i18n-ignore aria-label="Nom">Azure</span><p>Après</p>';
  assert.deepEqual(translatableStrings(html), ['Après']);
});

test('keeps text before the first tag whole', () => {
  assert.deepEqual(translatableStrings('Bonjour <b>monde</b>'), ['Bonjour', 'monde']);
});

test('void elements do not swallow the text that follows them', () => {
  assert.deepEqual(translatableStrings('<p>Avant<br>après<img alt="Image">fin</p>'), ['Avant', 'après', 'Image', 'fin']);
});

test('closing a parent also closes unclosed children', () => {
  assert.deepEqual(translatableStrings('<div data-i18n-ignore><p>Python</div><p>Ensuite</p>'), ['Ensuite']);
});

test('decodes named, decimal and hexadecimal entities and keeps unknown ones', () => {
  assert.deepEqual(translatableStrings('<p>A &amp; B&nbsp;€ &#8217; &#x2192; &lt; &inconnu;</p>'), ['A & B € ’ → < &inconnu;']);
});

test('ignores strings without letters, comments and the doctype', () => {
  assert.deepEqual(translatableStrings('<!doctype html><!-- Note --><p>2026</p><span>↗</span><title>Titre</title>'), ['Titre']);
});

test('reads the meta description only', () => {
  assert.deepEqual(translatableStrings('<meta name="description" content="Une description"><meta name="theme-color" content="Pêche">'), ['Une description']);
});

test('reports each missing string once and accepts translated ones', () => {
  const html = '<p>Bonjour</p><p>Merci</p><p>Merci</p>';
  assert.deepEqual(missingTranslations(html, { Bonjour: 'Hello' }), ['Merci']);
});
