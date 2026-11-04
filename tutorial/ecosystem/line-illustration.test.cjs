const test = require('node:test');
const assert = require('node:assert/strict');
const {existsSync} = require('node:fs');
const file = require('node:path').join(__dirname, 'line-illustration.js');
const render = existsSync(file) ? require(file).render : () => null;

class Element {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName;
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.attributes = {};
    this.style = {};
    this.textContent = '';
  }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
}
const doc = {createElement: tag => new Element(tag, doc)};
const host = () => doc.createElement('div');
function descendants(node) { return [node, ...node.children.flatMap(descendants)]; }
function readable(node) {
  if (node.attributes['aria-hidden'] === 'true') return '';
  return [node.textContent, ...node.children.map(readable)].filter(Boolean).join(' ');
}
function draw(visual, container = host()) {
  const figure = render(container, visual);
  assert.ok(figure, 'the requested illustration was missing');
  assert.deepEqual(container.children, [figure]);
  assert.equal(figure.tagName, 'figure');
  assert.ok(figure.children.some(child => child.tagName === 'figcaption' && readable(child)));
  return figure;
}
function widths(figure) {
  return descendants(figure).flatMap(el => el.style.width === undefined ? [] : [parseFloat(el.style.width)]);
}

test('the amount meter shows zero, partial and full color change', () => {
  for (const [value, percent] of [[0, 0], [0.25, 25], [1, 100]]) {
    const figure = draw({type:'amount', label:'Strength', value});
    assert.match(readable(figure), /strength/i);
    assert.match(readable(figure), new RegExp(percent + '%'));
    assert.match(readable(figure), /color change/i);
    assert.deepEqual(widths(figure), [percent]);
  }
});

test('the region marks the rule and sample separately, including a sample exactly on the boundary', () => {
  for (const [position, changes] of [[0.2, false], [0.35, true], [0.8, true]]) {
    const figure = draw({type:'region', fraction:0.35, position, changes});
    const label = readable(figure);
    assert.match(label, /rule boundary.*35%/i);
    assert.match(label, new RegExp('sample.*' + position * 100 + '%.*' + (changes ? 'apply' : 'keep'), 'i'));
    assert.deepEqual(descendants(figure).filter(el => el.style.left).map(el => parseFloat(el.style.left)), [35, position * 100]);
  }
});

test('a call shows the argument and the value received by the parameter in order', () => {
  const figure = draw({type:'call', argumentName:'t * strength', parameterName:'amount', value:0.125});
  assert.match(readable(figure), /t \* strength.*0\.13.*paintTiles.*amount.*0\.13/);
});

test('the two paint layers show the background underneath the sampled block', () => {
  const figure = draw({type:'layers', background:[12,18,28], block:[77,88,99]});
  assert.match(readable(figure), /background.*12, 18, 28.*block.*77, 88, 99/i);
  const base = descendants(figure).find(el => el.style.backgroundColor === 'rgb(12, 18, 28)');
  assert.ok(base?.children.some(el => el.style.backgroundColor === 'rgb(77, 88, 99)'));
});

test('gray shows three source channels and three equal target bars on the same scale', () => {
  const figure = draw({type:'gray', original:[0,51,255], gray:102});
  assert.match(readable(figure), /0 \+ 51 \+ 255.*÷ 3 = 102/);
  assert.match(readable(figure), /red 102.*green 102.*blue 102/i);
  assert.deepEqual(widths(figure), [0,20,100,40,40,40]);
  const fractional = draw({type:'gray', original:[255,200,101], gray:556/3});
  assert.match(readable(fractional), /÷ 3 = 185\.33 /);
});

test('the blend keeps the current color separate from the target color', () => {
  const figure = draw({type:'blend', original:[12,18,24], current:[24,30,36], target:[60,66,72], value:0.25});
  assert.match(readable(figure), /from.*12, 18, 24.*now.*24, 30, 36.*target.*60, 66, 72/i);
  assert.match(readable(figure), /25%/);
  assert.deepEqual(descendants(figure).filter(el => el.style.backgroundColor).map(el => el.style.backgroundColor),
    ['rgb(12, 18, 24)', 'rgb(24, 30, 36)', 'rgb(60, 66, 72)']);
});

test('the sample rectangle uses separate canvas dimensions for both position and size', () => {
  const figure = draw({type:'position', x:160,y:120,w:32,h:24,canvasW:640,canvasH:240,rgb:[24,46,68]});
  const plane = descendants(figure).find(el => el.style.aspectRatio);
  assert.equal(plane?.style.aspectRatio, '640 / 240');
  const block = plane.children.find(el => el.style.backgroundColor === 'rgb(24, 46, 68)');
  assert.deepEqual([block.style.left, block.style.top, block.style.width, block.style.height], ['25%','50%','5%','10%']);
  assert.match(readable(figure), /160, 120.*32 × 24.*640 × 240/);
});

test('line changes replace earlier data and absent or unrecognized examples clear it', () => {
  const container = host();
  draw({type:'gray', original:[3,6,9], gray:6}, container);
  draw({type:'amount', label:'Strength', value:0}, container);
  assert.doesNotMatch(readable(container), /gray/i);
  for (const visual of [null, undefined, {type:'unrecognized'}, {type:'constructor'}]) {
    container.replaceChildren(doc.createElement('figure'));
    assert.equal(render(container, visual), null);
    assert.deepEqual(container.children, []);
  }
});
