const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

async function openFinishStage() {
  const elements = new Map();
  function element() {
    return {
      children: [],
      set id(value) { elements.set(value, this); },
      append(...items) { this.children.push(...items); },
      prepend(...items) { this.children.unshift(...items); },
      replaceChildren(...items) { this.children = items; },
      setAttribute() {}, removeAttribute() {},
      classList: {add() {}, remove() {}, toggle() {}},
      getContext() { return {drawImage() {}, getImageData: () => ({data: null})}; }
    };
  }
  // Load the actual lesson controls while leaving pixel drawing to the frame.
  const html = fs.readFileSync(path.join(__dirname, 'learn.html'), 'utf8');
  for (const [, id] of html.matchAll(/\bid="([^"]+)"/g)) element().id = id;
  const get = id => elements.get(id);
  const posted = [], listeners = {}, timers = new Map();
  let nextTimer = 0;
  const preview = get('p5-preview');
  preview.contentWindow = {postMessage: command => posted.push(command)};
  const origin = 'https://course.example';
  const context = {
    location: {origin, hash: '#stage-7', search: ''},
    document: {body: element(), getElementById: get, createElement: element, querySelectorAll: () => []},
    window: {
      projectCore: require('../project-core.cjs'), courseRuntime: require('./course-runtime.js'),
      addEventListener(type, handler) { listeners[type] = handler; }, dispatchEvent() {}
    },
    fetch: async () => ({ok: true, json: async () => require('./course-data.json')}),
    Image: class { set src(_) { this.onload(); } },
    URLSearchParams, Event, localStorage: {getItem: () => null, setItem() {}},
    setTimeout(callback) { timers.set(++nextTimer, callback); return nextTimer; },
    clearTimeout(id) { timers.delete(id); }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'learn.js'), 'utf8'), context);
  await new Promise(resolve => setImmediate(resolve));
  assert.ok(get('compare-a')?.onclick, get('lesson-subtitle').textContent);
  return {
    get, posted,
    token: () => JSON.parse(preview.srcdoc.match(/const courseToken=(.*?);/)[1]),
    send(data) { listeners.message({source: preview.contentWindow, origin, data}); },
    flushTimers() { for (const callback of timers.values()) callback(); timers.clear(); }
  };
}

test('comparison buttons keep the new frame at 30 seconds when a late clock event arrives from the previous frame', async () => {
  const lesson = await openFinishStage();
  const ready = token => lesson.send({kind: 'course-ready', token, width: 640, height: 480});
  ready(lesson.token());
  for (const [button, tile] of [['compare-a', 16], ['compare-b', 8]]) {
    const previous = lesson.token();
    lesson.get(button).onclick();
    lesson.send({kind: 'course-time', token: previous, teaching: false, seconds: 2});
    lesson.flushTimers();
    const current = lesson.token();
    assert.notEqual(current, previous);
    ready(current);
    assert.ok(lesson.posted.some(command => command.token === current &&
      command.kind === 'course-seek' && command.seconds === 30), button + ': new frame must receive the 30-second seek');
    assert.match(lesson.get('full-code').textContent, new RegExp('const tile = ' + tile + ';'));
    assert.equal(Number(lesson.get('teaching-time').value), 30);
  }
});
