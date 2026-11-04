const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('returning from the pixel inspector keeps the Phase 1 iframe in place while it reports ready', async () => {
  const elements = new Map(), moves = [], srcdocs = [], listeners = {};
  const get = id => elements.get(id);
  const pixels = new Uint8ClampedArray(320 * 240 * 4);
  function node() {
    return {
      children: [], parentElement: null,
      set id(value) { elements.set(value, this); },
      get previousElementSibling() { return this.parentElement?.children[this.parentElement.children.indexOf(this) - 1] || null; },
      get nextElementSibling() { return this.parentElement?.children[this.parentElement.children.indexOf(this) + 1] || null; },
      remove() {
        if (this.parentElement) this.parentElement.children.splice(this.parentElement.children.indexOf(this), 1);
        this.parentElement = null;
      },
      append(...items) { for (const item of items) { item.remove(); item.parentElement = this; this.children.push(item); } },
      replaceChildren(...items) { for (const item of this.children.slice()) item.remove(); this.append(...items); },
      before(item) {
        if (this === get('preview-status') && item === get('preview-wrap')) moves.push(item.parentElement);
        item.remove();
        item.parentElement = this.parentElement;
        this.parentElement.children.splice(this.parentElement.children.indexOf(this), 0, item);
      },
      after(item) { item.remove(); item.parentElement = this.parentElement; this.parentElement.children.splice(this.parentElement.children.indexOf(this) + 1, 0, item); },
      classList: {add() {}, remove() {}, toggle() {}}, style: {setProperty() {}},
      setAttribute() {}, removeAttribute() {}, scrollIntoView() {},
      getContext() { return {drawImage() {}, getImageData: () => ({data: pixels})}; }
    };
  }
  const read = filename => fs.readFileSync(path.join(__dirname, filename), 'utf8');
  for (const [, id] of read('learn.html').matchAll(/\bid="([^"]+)"/g)) node().id = id;
  const figure = node(), lab = node(), status = get('preview-status'), wrap = get('preview-wrap'), preview = get('p5-preview');
  lab.append(get('illustration-hint'), wrap, status);
  wrap.append(preview);
  preview.contentWindow = {postMessage() {}};
  Object.defineProperty(preview, 'srcdoc', {set(html) { srcdocs.push(html); }});
  const origin = 'https://course.example';
  const location = {origin, hash: '#stage-3', search: ''};
  const context = {
    location, document: {body: node(), getElementById: get, createElement: node, querySelectorAll: () => []},
    window: {
      projectCore: require('../project-core.cjs'), courseRuntime: require('./course-runtime.js'),
      pixelFlowCore: require('./pixel-flow-core.js'),
      pixelFlow: {mount({container, preview}) {
        container.append(figure);
        return {update() {}, attachPreview() { if (preview.parentElement !== figure) figure.append(preview); }};
      }},
      addEventListener(type, handler) { listeners[type] = handler; }, dispatchEvent() {}
    },
    fetch: async () => ({ok: true, json: async () => require('./course-data.json')}),
    Image: class { set src(_) { this.onload(); } }, URLSearchParams, Event,
    localStorage: {getItem: () => null, setItem() {}}, setTimeout, clearTimeout
  };
  vm.runInNewContext(read('learn.js'), context);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(srcdocs.length, 1, get('lesson-subtitle').textContent);
  assert.ok(wrap.parentElement === figure, 'Phase 3 starts with the preview in the pixel inspector');
  location.hash = '#stage-1';
  listeners.hashchange();
  assert.ok(status.previousElementSibling === wrap, 'Phase 1 restores the preview above its status');
  assert.equal(moves.filter(parent => parent === figure).length, 1, 'the return needs one move from the inspector');
  assert.equal(srcdocs.length, 2, 'switching phases starts a new sketch');
  const movesAfterReturn = moves.length;
  const token = JSON.parse(srcdocs.at(-1).match(/const courseToken=(.*?);/)[1]);
  for (const kind of ['course-ready', 'course-size', 'course-ready']) {
    listeners.message({source: preview.contentWindow, origin, data: {kind, token, width: 640, height: 480, version: 'test'}});
  }
  get('next-line').onclick();
  assert.match(get('line-position').textContent, /^Line 2 of /);
  assert.equal(srcdocs.length, 2, 'message and line updates do not request another sketch');
  assert.equal(moves.length, movesAfterReturn, 'ready, size, and line updates must not move a running iframe');
  assert.equal(moves.length, 1, 'the move from the inspector is the only one');
});
