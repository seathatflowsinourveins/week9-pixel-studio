const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const host = require('./editor-frame.js');

const ROW = 'https://editor.p5js.org/student/sketches/row_123';
const MOSAIC = 'https://editor.p5js.org/student/sketches/mosaic-456';
const OWN = 'https://editor.p5js.org/my-name/sketches/mine_789';

// The fake records the browser navigation boundary, without loading a remote editor.
function events() {
  return {
    listeners: {},
    addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); },
    dispatch(type) { for (const listener of this.listeners[type] || []) listener({ type }); },
  };
}
function container(clipboard) {
  const doc = { ...events(), activeElement: null, createElement: tag => new Element(tag, doc) };
  doc.defaultView = { ...events(), navigator: { clipboard } };
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
    this.value = '';
  }
  appendChild(child) { this.children.push(child); child.parentNode = this; return child; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  addEventListener(type, listener) { this.listeners[type] = listener; }
  click() { return this.listeners.click?.({ preventDefault() {} }); }
  focus() { this.ownerDocument.activeElement = this; }
  set src(value) { this.srcWrites.push(value); this._src = value; }
  get src() { return this._src; }
}
function find(root, className) {
  if ((root.className || '').split(' ').includes(className)) return root;
  for (const child of root.children) { const match = find(child, className); if (match) return match; }
}
function contents(root) { return [root.textContent || '', ...root.children.map(contents)].join(' '); }

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
  assert.match(link.textContent, /Open p5 & save/);
  assert.match(link.getAttribute('aria-label'), /full tab/);
  assert.match(find(aside, 'p5-native-note').textContent, /full p5 tab/i);
  const example = find(aside, 'p5-native-example');
  assert.equal(example.href, ROW);
  assert.equal(example.target, '_blank');
  assert.equal(example.rel, 'noopener noreferrer');
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
  assert.equal(find(aside, 'p5-native-example').href, MOSAIC);
  assert.match(find(aside, 'p5-native-example').getAttribute('aria-label'), /Mosaic/);
  assert.match(find(aside, 'p5-native-load').getAttribute('aria-label'), /Mosaic/);
  assert.deepEqual(instance.iframe.srcWrites, [ROW]);
  instance.loadSuggested();
  assert.deepEqual(instance.iframe.srcWrites, [ROW, MOSAIC]);
  instance.setSuggestedProject(ROW, 'Row');
  find(aside, 'p5-native-load').click();
  assert.deepEqual(instance.iframe.srcWrites, [ROW, MOSAIC, ROW]);
});

test('saved own project opens outside the dashboard and stays selected across lesson changes', () => {
  const aside = container();
  const instance = host.mount({ container: aside, url: ROW, readProjectURL: () => OWN });
  const open = find(aside, 'p5-native-open');
  assert.equal(open.href, OWN);
  assert.equal(open.target, '_blank');
  assert.equal(open.rel, 'noopener noreferrer');
  assert.equal(find(aside, 'p5-native-project-url').value, OWN);
  assert.deepEqual(instance.iframe.srcWrites, [OWN]);
  instance.setSuggestedProject(MOSAIC, 'Mosaic');
  assert.equal(open.href, OWN);
  assert.equal(find(aside, 'p5-native-example').href, MOSAIC);
  open.click();
  assert.deepEqual(instance.iframe.srcWrites, [OWN]);
});

test('initial saved project stays in the pane through restores until an explicit example load', () => {
  const aside = container();
  let saved = OWN;
  const instance = host.mount({ container: aside, url: ROW, readProjectURL: () => saved });
  assert.deepEqual(instance.iframe.srcWrites, [OWN]);
  instance.setSuggestedProject(MOSAIC, 'Mosaic');
  saved = ROW;
  aside.ownerDocument.defaultView.dispatch('icm-progress-restored');
  assert.equal(find(aside, 'p5-native-open').href, ROW);
  assert.deepEqual(instance.iframe.srcWrites, [OWN]);
  find(aside, 'p5-native-load').click();
  assert.deepEqual(instance.iframe.srcWrites, [OWN, MOSAIC]);
});

test('untrusted remembered URLs never become clickable destinations', () => {
  for (const url of ['javascript:alert(1)', 'https://other.test/a/sketches/b', OWN + '?x=1', OWN + '#x']) {
    const aside = container();
    const instance = host.mount({ container: aside, url: ROW, readProjectURL: () => url });
    assert.equal(find(aside, 'p5-native-open').href, ROW);
    assert.equal(find(aside, 'p5-native-project-url').value, '');
    assert.deepEqual(instance.iframe.srcWrites, [ROW]);
  }
});

test('typing a project URL does not save it; Keep link stores a valid URL explicitly', () => {
  const aside = container();
  let saved = '';
  const instance = host.mount({ container: aside, url: ROW, readProjectURL: () => saved,
    saveProjectURL: url => { saved = url; return true; } });
  const field = find(aside, 'p5-native-project-url');
  field.value = OWN;
  assert.equal(saved, '');
  assert.equal(find(aside, 'p5-native-open').href, ROW);
  find(aside, 'p5-native-keep').click();
  assert.equal(saved, OWN);
  assert.equal(find(aside, 'p5-native-open').href, OWN);
  assert.match(find(aside, 'p5-native-status').textContent, /Finish/);
  assert.deepEqual(instance.iframe.srcWrites, [ROW]);
});

test('invalid Keep link input leaves the remembered project unchanged', () => {
  for (const url of ['', 'https://example.org/a/sketches/b', OWN + '?redirect=x', OWN + '#x']) {
    const aside = container();
    let saved = OWN;
    let writes = 0;
    host.mount({ container: aside, url: ROW, readProjectURL: () => saved,
      saveProjectURL: next => { writes++; saved = next; return true; } });
    find(aside, 'p5-native-project-url').value = url;
    find(aside, 'p5-native-keep').click();
    assert.equal(writes, 0);
    assert.equal(saved, OWN);
    assert.equal(find(aside, 'p5-native-open').href, OWN);
    assert.match(find(aside, 'p5-native-status').textContent, /public p5/i);
  }
});

test('failed project persistence does not present the new URL as saved', () => {
  for (const saveProjectURL of [() => false, () => { throw new Error('Storage blocked'); }]) {
    const aside = container();
    const instance = host.mount({ container: aside, url: ROW, readProjectURL: () => OWN, saveProjectURL });
    find(aside, 'p5-native-project-url').value = MOSAIC;
    find(aside, 'p5-native-keep').click();
    assert.equal(find(aside, 'p5-native-open').href, OWN);
    assert.equal(find(aside, 'p5-native-project-url').value, MOSAIC);
    assert.match(find(aside, 'p5-native-status').textContent, /could not be kept/i);
    assert.deepEqual(instance.iframe.srcWrites, [OWN]);
  }
});

test('a failed saved-link read leaves a safe example available', () => {
  const aside = container();
  assert.doesNotThrow(() => host.mount({ container: aside, url: ROW,
    readProjectURL: () => { throw new Error('Storage blocked'); } }));
  assert.equal(find(aside, 'p5-native-open').href, ROW);
  assert.deepEqual(find(aside, 'p5-official-frame').srcWrites, [ROW]);
});

test('Copy guide code uses the current lesson callback and never navigates the editor', async () => {
  const copied = [];
  const aside = container({ writeText: async value => { copied.push(value); } });
  let code = 'function setup() { createCanvas(100, 100); }';
  const instance = host.mount({ container: aside, url: ROW, getGuideCode: () => code });
  const copy = find(aside, 'p5-native-copy');
  await copy.click();
  code = 'function setup() { createCanvas(200, 200); }';
  instance.setSuggestedProject(MOSAIC, 'Mosaic');
  await copy.click();
  assert.deepEqual(copied, ['function setup() { createCanvas(100, 100); }', 'function setup() { createCanvas(200, 200); }']);
  assert.match(find(aside, 'p5-native-status').textContent, /guide code copied/i);
  assert.match(find(aside, 'p5-native-status').textContent, /pane edits.*not copied/i);
  assert.deepEqual(instance.iframe.srcWrites, [ROW]);
});

test('unavailable or rejected clipboard directs the learner to the guide download', async () => {
  for (const clipboard of [undefined, { writeText: async () => { throw new Error('Permission denied'); } }]) {
    const aside = container(clipboard);
    const instance = host.mount({ container: aside, url: ROW, getGuideCode: () => 'let sample = 1;' });
    await find(aside, 'p5-native-copy').click();
    const status = find(aside, 'p5-native-status').textContent;
    assert.match(status, /Download sketch\.js/);
    assert.match(status, /guide code/i);
    assert.doesNotMatch(status, /code copied/i);
    assert.deepEqual(instance.iframe.srcWrites, [ROW]);
  }
});

test('an unavailable guide callback does not copy an empty backup', async () => {
  const copied = [];
  const aside = container({ writeText: async value => { copied.push(value); } });
  host.mount({ container: aside, url: ROW, getGuideCode: () => '' });
  await find(aside, 'p5-native-copy').click();
  assert.deepEqual(copied, []);
  assert.match(find(aside, 'p5-native-status').textContent, /Download sketch\.js/);
});

test('native save help preserves the same editor and explains the manual transfer boundary', () => {
  const aside = container();
  const instance = host.mount({ container: aside, url: ROW });
  const help = find(aside, 'p5-native-help');
  assert.equal(help.tagName, 'DETAILS');
  assert.equal(help.children[0].tagName, 'SUMMARY');
  help.open = true;
  help.children[0].click();
  const guide = contents(help);
  assert.match(guide, /Ctrl\+A.*Ctrl\+C/);
  assert.match(guide, /File.*Download/);
  assert.match(guide, /File.*Duplicate/);
  assert.match(guide, /prepared guide/i);
  assert.match(guide, /Your saved p5 sketch/);
  assert.match(guide, /Finish/);
  assert.equal(instance.iframe.parentNode, find(aside, 'p5-native-surface'));
  assert.deepEqual(instance.iframe.srcWrites, [ROW]);
});

test('progress and late initialization refresh the saved link without replacing focused input or iframe', () => {
  const aside = container();
  let saved = '';
  const instance = host.mount({ container: aside, url: ROW, readProjectURL: () => saved });
  const doc = aside.ownerDocument;
  const field = find(aside, 'p5-native-project-url');
  for (const type of ['icm-progress-restored', 'icm-progress-change', 'storage']) {
    saved = OWN;
    doc.defaultView.dispatch(type);
    assert.equal(find(aside, 'p5-native-open').href, OWN, type);
    assert.equal(field.value, OWN, type);
    saved = '';
    doc.defaultView.dispatch(type);
    assert.equal(find(aside, 'p5-native-open').href, ROW, type);
  }
  saved = OWN;
  doc.dispatch('DOMContentLoaded');
  assert.equal(find(aside, 'p5-native-open').href, OWN);
  field.focus();
  field.value = 'https://editor.p5js.org/my-draft';
  saved = MOSAIC;
  doc.defaultView.dispatch('icm-progress-change');
  assert.equal(find(aside, 'p5-native-open').href, MOSAIC);
  assert.equal(field.value, 'https://editor.p5js.org/my-draft');
  assert.deepEqual(instance.iframe.srcWrites, [ROW]);
});

test('Finish edits refresh or clear the saved destination while preserving a focused draft and iframe', () => {
  const aside = container();
  let saved = OWN;
  const instance = host.mount({ container: aside, url: ROW, readProjectURL: () => saved });
  const doc = aside.ownerDocument;
  const field = find(aside, 'p5-native-project-url');
  const open = find(aside, 'p5-native-open');
  saved = MOSAIC;
  doc.defaultView.dispatch('icm-assignment-change');
  assert.equal(open.href, MOSAIC);
  assert.equal(field.value, MOSAIC);
  saved = '';
  doc.defaultView.dispatch('icm-assignment-change');
  assert.equal(open.href, ROW);
  assert.equal(field.value, '');
  field.focus();
  field.value = 'https://editor.p5js.org/my-draft';
  saved = OWN;
  doc.defaultView.dispatch('icm-assignment-change');
  assert.equal(open.href, OWN);
  assert.equal(field.value, 'https://editor.p5js.org/my-draft');
  saved = '';
  doc.defaultView.dispatch('icm-assignment-change');
  assert.equal(open.href, ROW);
  assert.equal(field.value, 'https://editor.p5js.org/my-draft');
  assert.equal(instance.iframe.parentNode, find(aside, 'p5-native-surface'));
  assert.deepEqual(instance.iframe.srcWrites, [OWN]);
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
