const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const host = require('./editor-frame.js');

const ROW = 'https://editor.p5js.org/student/sketches/row_123';
const MOSAIC = 'https://editor.p5js.org/student/sketches/mosaic-456';

// The fake records the browser navigation boundary, without loading a remote editor.
function container() {
  const doc = { createElement: tag => new Element(tag, doc) };
  return new Element('aside', doc);
}
class Element {
  constructor(tag, doc) {
    this.tagName = tag.toUpperCase();
    this.ownerDocument = doc;
    this.children = [];
    this.attributes = {};
    this.srcWrites = [];
    this.listeners = {};
  }
  appendChild(child) { this.children.push(child); child.parentNode = this; return child; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  addEventListener(type, listener) { this.listeners[type] = listener; }
  click() { this.listeners.click?.({ preventDefault() {} }); }
  set src(value) { this.srcWrites.push(value); this._src = value; }
  get src() { return this._src; }
}
function find(root, className) {
  if ((root.className || '').split(' ').includes(className)) return root;
  for (const child of root.children) { const match = find(child, className); if (match) return match; }
}

test('safeURL accepts public saved project routes', () => {
  assert.equal(host.safeURL(ROW), ROW);
  assert.equal(host.safeURL(MOSAIC), MOSAIC);
});

test('safeURL rejects non-project routes and unsafe origins or schemes', () => {
  for (const url of [
    'javascript:alert(1)', 'data:text/html,hello', 'http://editor.p5js.org/a/sketches/b',
    'https://example.org/a/sketches/b', 'https://editor.p5js.org.evil.test/a/sketches/b',
    'https://user:pass@editor.p5js.org/a/sketches/b', 'https://editor.p5js.org/',
    'https://editor.p5js.org/a/sketches/b/edit', 'https://editor.p5js.org/a/full/b',
    'https://editor.p5js.org/a/sketches/b?redirect=evil', 'https://editor.p5js.org/a/sketches/b#x',
    '/a/sketches/b', '', null,
  ]) assert.throws(() => host.safeURL(url), TypeError, String(url));
});

test('mount creates an accessible official editor with safe external opening', () => {
  const aside = container();
  const instance = host.mount({ container: aside, url: ROW, label: 'Prepared row' });
  assert.equal(instance.iframe.id, 'p5-official-editor');
  assert.equal(instance.iframe.title, 'p5 Web Editor');
  assert.equal(instance.iframe.className, 'p5-official-frame');
  assert.equal(instance.iframe.allowFullscreen, true);
  assert.equal(instance.iframe.getAttribute('sandbox'), null);
  assert.deepEqual(instance.iframe.srcWrites, [ROW]);
  assert.equal(instance.iframe.parentNode, find(aside, 'p5-native-surface'));
  const link = find(aside, 'p5-native-open');
  assert.equal(link.href, ROW);
  assert.equal(link.target, '_blank');
  assert.ok(link.rel.split(/\s+/).includes('noopener'));
  assert.ok(link.rel.split(/\s+/).includes('noreferrer'));
  assert.equal(link.textContent, 'Open saved example');
  assert.equal(link.getAttribute('aria-label'), 'Open saved example: Prepared row in full tab');
  assert.equal(find(aside, 'p5-native-note').textContent,
    'Run and edit here. Sign in here to save to p5; guide steps explain the prepared example.');
});

test('mounting the same container preserves the editor and never reloads', () => {
  const aside = container();
  const first = host.mount({ container: aside, url: ROW });
  const children = [...aside.children];
  const again = host.mount({ container: aside, url: MOSAIC, label: 'Mosaic' });
  assert.equal(again, first);
  assert.deepEqual(aside.children, children);
  assert.deepEqual(first.iframe.srcWrites, [ROW]);
});

test('suggesting a new stage updates links and label without navigating; explicit load navigates', () => {
  const aside = container();
  const instance = host.mount({ container: aside, url: ROW, label: 'Row' });
  instance.setSuggestedProject(MOSAIC, 'Mosaic');
  assert.equal(find(aside, 'p5-native-open').href, MOSAIC);
  assert.equal(find(aside, 'p5-native-open').getAttribute('aria-label'),
    'Open saved example: Mosaic in full tab');
  assert.match(find(aside, 'p5-native-load').getAttribute('aria-label'), /Mosaic/);
  assert.deepEqual(instance.iframe.srcWrites, [ROW]);
  instance.loadSuggested();
  assert.deepEqual(instance.iframe.srcWrites, [ROW, MOSAIC]);
  instance.setSuggestedProject(ROW, 'Row');
  find(aside, 'p5-native-load').click();
  assert.deepEqual(instance.iframe.srcWrites, [ROW, MOSAIC, ROW]);
});

test('invalid mount or suggestion is rejected before DOM changes or navigation', () => {
  const aside = container();
  assert.throws(() => host.mount({ container: aside, url: 'javascript:alert(1)' }), TypeError);
  assert.equal(aside.children.length, 0);
  const instance = host.mount({ container: aside, url: ROW });
  assert.throws(() => instance.setSuggestedProject('https://example.org/'), TypeError);
  assert.equal(find(aside, 'p5-native-open').href, ROW);
  instance.loadSuggested();
  assert.deepEqual(instance.iframe.srcWrites, [ROW, ROW]);
});

test('browser script exposes the same host API without CommonJS', () => {
  const context = { window: {}, URL };
  vm.runInNewContext(fs.readFileSync(require.resolve('./editor-frame.js'), 'utf8'), context);
  assert.equal(typeof context.window.p5EditorHost.mount, 'function');
  assert.equal(context.window.p5EditorHost.safeURL(ROW), ROW);
});
