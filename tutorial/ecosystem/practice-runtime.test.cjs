const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const runtime = require('./course-runtime.js');

// Execute the generated classic scripts in document order, including scripts
// inserted through the DOM. Browser QA separately checks real p5 and painting.
function runFrame({code = '', token = 'run-1', libraryError = false} = {}) {
  assert.equal(typeof runtime.practiceFrameHTML, 'function', 'practice needs its own runnable frame');
  const html = runtime.practiceFrameHTML({code, token});
  const page = 'https://studio.example/nested/course/ecosystem/learn.html';
  const base = new URL(html.match(/<base href="([^"]+)"/i)?.[1] || page, page);
  const events = new Map(), timers = new Map(), messages = [], images = [], scripts = [];
  let canvas = null, nextTimer = 0;
  const context = vm.createContext({
    URL,
    document: {
      baseURI: base.href,
      querySelector: selector => selector === 'canvas' ? canvas : null,
      createElement: tag => ({tagName: tag.toUpperCase()}),
      body: {appendChild(script) { execute(script.textContent); }, append(script) { execute(script.textContent); }}
    },
    parent: {postMessage(value, origin) { messages.push({value: structuredClone(value), origin}); }},
    addEventListener(name, listener) { events.set(name, listener); },
    setInterval(fn) { timers.set(++nextTimer, fn); return nextTimer; },
    clearInterval(id) { timers.delete(id); },
    loadImage(src) { images.push(new URL(src, base).href); },
  });
  context.window = context;
  function execute(source) {
    try { vm.runInContext(source, context); }
    catch (error) { events.get('error')?.({message: error.message}); }
  }
  for (const [, attrs, source] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const src = attrs.match(/\bsrc="([^"]+)"/)?.[1];
    if (!src) execute(source);
    else {
      scripts.push(new URL(src, base).href);
      if (libraryError) events.get('error')?.({target: {tagName: 'SCRIPT', src}});
      else context.p5 = {VERSION: '2.3.4'};
    }
  }
  return {
    context, events, messages, images, scripts,
    tick() { for (const fn of timers.values()) fn(); },
    pixels(data) {
      canvas = {width: 2, height: 2, getContext: () => ({getImageData: () => ({data})})};
    }
  };
}

test('editable global setup, draw and mousePressed run unmodified, with every image URL relative to project assets', () => {
  const marker = '</ScRiPt><script>globalThis.unintended = true;</script>';
  const f = runFrame({code: `
    let repeats = 0;
    function setup() { const src = "sample.png"; loadImage(src); loadImage('sample.png'); }
    function draw() { return ++repeats; }
    function mousePressed() { return ${JSON.stringify(marker)}; }
  `});
  f.context.setup();
  assert.equal(f.context.draw(), 1);
  assert.equal(f.context.draw(), 2);
  assert.equal(f.context.mousePressed(), marker);
  assert.equal(f.context.unintended, undefined);
  assert.deepEqual(f.images, Array(2).fill('https://studio.example/nested/course/assets/sample.png'));
  assert.deepEqual(f.scripts, ['https://studio.example/nested/course/vendor/p5.min.js']);
});

test('readiness requires paint, including a colored pixel away from the top-left corner', () => {
  const token = 'run:</script><script>unexpected()</script>';
  const f = runFrame({token});
  const data = new Uint8ClampedArray(16);
  f.pixels(data);
  f.tick();
  assert.equal(f.messages.length, 0);
  data[15] = 128;
  f.tick();
  f.tick();
  assert.deepEqual(f.messages, [{
    origin: 'https://studio.example',
    value: {kind: 'practice-ready', token, version: '2.3.4', width: 2, height: 2}
  }]);
});

test('syntax, library loading and rejected promises report the error for this run', () => {
  for (const [options, match] of [
    [{code: 'function setup( { !'}, /syntax|unexpected|token/i],
    [{libraryError: true}, /p5|script|library/i],
    [{}, /missing picture/i]
  ]) {
    const f = runFrame(options);
    if (!options.code && !options.libraryError) f.events.get('unhandledrejection')({reason: Error('Missing picture')});
    for (let i = 0; i < 170; i++) f.tick();
    assert.equal(f.messages.length, 1, 'a timeout must not mask the original failure');
    assert.equal(f.messages[0].value.kind, 'practice-error');
    assert.equal(f.messages[0].value.token, 'run-1');
    assert.equal(f.messages[0].origin, 'https://studio.example');
    assert.match(f.messages[0].value.message, match);
  }
});

test('a sketch that never paints produces one finite, actionable diagnostic', () => {
  const f = runFrame();
  for (let i = 0; i < 170; i++) f.tick();
  assert.equal(f.messages.length, 1);
  assert.equal(f.messages[0].value.kind, 'practice-error');
  assert.match(f.messages[0].value.message, /canvas|createCanvas|draw/i);
});
