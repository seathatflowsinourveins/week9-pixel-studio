const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const runtime = require('./course-runtime.js');
const rules = require('../data/short-line-meanings.cjs');
const roadmap = require('../data/learning-roadmap.cjs');
const lessons = ['foundations', 'media', 'extensions'].flatMap(name => require('../data/lessons-' + name + '.cjs'));
const modes = ['focus', 'gray', 'invert'];

function meaning(lines, index) {
  return runtime.meaningForLine(lines, index, rules);
}

test('complete generated sketches have compact and detailed meanings for every line in all three modes', t => {
  let count = 0;
  for (const mode of modes) {
    for (let stage = 0; stage < 7; stage++) {
      const {lines, code} = runtime.lessonProject(stage, {mode});
      assert.equal(code, lines.map(([source]) => source).join('\n'));
      lines.forEach(([source, detail], i) => {
        const where = 'stage ' + (stage + 1) + ', ' + mode + ', line ' + (i + 1);
        assert(source.trim() && detail.trim(), where);
        const brief = meaning(lines, i);
        assert(brief.trim() && brief.trim().split(/\s+/).length <= 12, where + ': ' + brief);
        count++;
      });
    }
  }
  assert.equal(count, 614);
  t.diagnostic(count + ' generated line occurrences across 7 stages × 3 modes.');
});

test('successive closing braces identify the actual loop, condition or function they end', () => {
  for (const mode of modes) {
    for (let stage = 0; stage < 7; stage++) {
      const {lines} = runtime.lessonProject(stage, {mode});
      const actual = lines.flatMap(([code], i) => code.trim() === '}' ? [meaning(lines, i)] : []);
      const loops = [/column|x loop/i, /row|y loop/i];
      const expected = stage < 3 ? [...(stage > 0 ? loops : []), /setup/i] : [
        /setup/i, ...(stage >= 4 ? [/first frame|clock check|start check/i, /draw\b|drawing frame/i] : []),
        ...(mode === 'focus' ? [/focus|boundary|region/i] : []), ...loops, /paintTiles|tile drawing function/i,
        ...(stage >= 5 ? [/mousePressed|replay/i, /windowResized|resize/i] : [])
      ];
      assert.equal(actual.length, expected.length);
      expected.forEach((pattern, i) => assert.match(actual[i], pattern, 'stage ' + (stage + 1) + ', ' + mode + ', brace ' + (i + 1) + ': ' + actual[i]));
    }
  }
});

test('unknown blocks and future lines keep their own explanations', () => {
  const lines = [
    ['async function setup() {', 'Begin setup.'],
    ['  if (futureFlag) {', 'Check the new flag.'],
    ['    futureAction();', 'Try the new action.'],
    ['  }', 'End the flag check.'],
    ['}', 'Finish setup.'],
    ['}', 'A closing brace with no known opening block.']
  ];
  assert.equal(meaning(lines, 2), lines[2][1]);
  assert.equal(meaning(lines, 3), lines[3][1]);
  assert.match(meaning(lines, 4), /setup/i);
  assert.equal(meaning(lines, 5), lines[5][1]);
});

test('short labels distinguish the key operations: sample, address, transform, time and resize', () => {
  const cases = [
    [1, 'focus', 'const shade = picture.get', /read.*source color/i],
    [2, 'focus', 'const i = 4 *', /address/i],
    [2, 'focus', 'const g = picture.pixels', /green/i],
    [3, 'focus', 'if (x / picture.width', /boundary/i],
    [3, 'gray', 'const targetR = gray;', /gray/i],
    [3, 'invert', 'const targetR = 255 - r;', /invert.*red/i],
    [3, 'focus', 'fill(lerp(', /blend.*target/i],
    [4, 'focus', 'const t = constrain(', /elapsed.*progress/i],
    [5, 'focus', 'resizeCanvas(', /resize.*canvas/i]
  ];
  for (const [stage, mode, start, expected] of cases) {
    const {lines} = runtime.lessonProject(stage, {mode});
    const i = lines.findIndex(([code]) => code.trim().startsWith(start));
    assert.notEqual(i, -1, start);
    assert.match(meaning(lines, i), expected, start);
  }
});

test('every foundation sketch matches its explained source line for line', t => {
  assert.equal(lessons.length, 20);
  let count = 0;
  for (const lesson of lessons) {
    const file = path.join(__dirname, '../sketches', lesson.id + '.js');
    const code = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').trimEnd();
    assert.equal(lesson.lines.map(([source]) => source).join('\n'), code, lesson.id);
    lesson.lines.forEach(([source, detail], i) => {
      assert(source.trim() && detail.trim(), lesson.id + ' line ' + (i + 1));
      count++;
    });
  }
  assert.equal(count, 355);
  t.diagnostic(count + ' explained lines in ' + lessons.length + ' foundation sketches.');
});

test('roadmap gives each stage a build, an assignment connection, evidence and at most two real starting lessons', () => {
  const ids = new Set(lessons.map(lesson => lesson.id));
  assert.deepEqual(roadmap.map(stage => stage.tag), ['Image', 'Mosaic', 'RGBA', 'Focus', 'Minute', 'Present', 'Finish']);
  assert.deepEqual(roadmap[1].learnFirst, ['09-color', '07-loops']); // Learn RGB and grid order before channel addresses.
  roadmap.forEach((stage, i) => {
    assert.equal(stage.number, i + 1);
    assert(stage.learnFirst.length > 0 && stage.learnFirst.length <= 2);
    stage.learnFirst.forEach(id => assert(ids.has(id), id));
    for (const key of ['build', 'assignment', 'proof']) assert(stage[key].trim(), stage.tag + ': ' + key);
  });
  const finish = roadmap[6];
  assert.match(finish.build, /same program as Stage 6/i);
  assert.match(finish.assignment, /three iterations/i);
  assert.match(finish.assignment, /three.*full.minute|full minute.*three/i);
  assert.match(finish.assignment, /partner/i);
  assert.match(finish.proof, /blog/i);
  assert.match(finish.proof, /spreadsheet/i);
  for (const mode of modes) {
    assert.equal(runtime.lessonProject(5, {mode}).code, runtime.lessonProject(6, {mode}).code);
  }
});

test('each stage has a short experiment and visible result tied to its control', () => {
  const controls = ['larger-size', 'tile', 'flow-source', 'color-rule', 'teaching-time', 'narrow-preview', 'compare-a'];
  assert.equal(roadmap.length, controls.length);
  roadmap.forEach(({tag, play}, i) => {
    assert.ok(play, tag + ': missing play prompts');
    assert.equal(play.control, controls[i], tag + ': control');
    for (const key of ['try', 'notice']) {
      assert.equal(typeof play[key], 'string', tag + ': ' + key);
      assert.ok(play[key].trim(), tag + ': empty ' + key);
      assert.ok(play[key].trim().split(/\s+/).length <= 25, tag + ': long ' + key);
    }
  });
});
