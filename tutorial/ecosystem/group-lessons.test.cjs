const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const file = path.join(__dirname, 'group-lessons.js');
const {source, steps} = require(file);

const nonblankLines = [1,2,3,5,6,7,8,10,11,12,13,15,16,18,19,21,22,24,26,27,28,29,30,31,33,34,36,38,39,40,41,42];
function reading(line) {
  const step = steps.find(entry => entry.line === line);
  assert.ok(step, 'missing reading for line ' + line);
  return step.meaning + ' ' + step.detail;
}
test('the guide credits Samuel and links to the sketch used to verify the line numbers', () => {
  assert.deepEqual(source, {
    url:'https://editor.p5js.org/samuelgoldman/sketches/Q1TY34oqc',
    author:'samuelgoldman', title:'Week 008: Partner Assignment copy', checked:'2026-11-04', p5:'2.3.4'
  });
});
test('every nonblank original line has a reading, one action and a supported illustration', () => {
  assert.deepEqual(steps.map(step => step.line), nonblankLines);
  for (const step of steps) {
    for (const field of ['title','meaning','detail','try']) assert.ok(step[field]?.trim(), 'line ' + step.line + ' lacks ' + field);
    assert.ok(['Prepare','Time','Grid','Color','Draw'].includes(step.section));
    assert.ok(['load','time','grid','pixels','brightness','hue','circle'].includes(step.visual));
  }
});
test('the live browser page receives the same ordered lesson contract as Node', () => {
  const window = {};
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), {window});
  assert.deepEqual(Array.from(window.groupLessons.steps, step => step.line), nonblankLines);
  assert.equal(window.groupLessons.source.url, source.url);
});
test('the sketch clock resets before draw and caps progress only at the upper end', () => {
  assert.match(reading(1), /undefined/i);
  assert.match(reading(10), /wait/i);
  assert.match(reading(15), /after.*(load|prepar|ready)/i);
  assert.match(reading(15), /reset.*before.*draw/i);
  assert.match(reading(19), /60,?000 milliseconds/i);
  assert.match(reading(19), /min.*1/i);
  assert.match(reading(19), /negative/i);
  assert.match(reading(19), /guide.*0.*60/i);
  assert.match(reading(24), /floor.*down/i);
  assert.match(reading(42), /once change reaches 1.*(hold|same|stay|steady|final)/i);
});
test('the reader goes down one column before moving right, and the braces close those loops in order', () => {
  assert.match(reading(26), /outer.*x.*right/i);
  assert.match(reading(27), /inner.*y.*down/i);
  assert.match(reading(40), /line 27/);
  assert.match(reading(41), /line 26/);
});
test('the guide distinguishes HSB drawing inputs from RGBA data read by address, including skipped alpha', () => {
  assert.match(reading(8), /hue.*saturation.*brightness/i);
  assert.match(reading(8), /RGBA/i);
  assert.match(reading(28), /address/i);
  assert.match(reading(30), /i\s*\+\s*1/);
  assert.match(reading(31), /skip(?:s|ped)? alpha|ignore(?:s|d)? alpha/i);
});
test('the guide explains the simple average, actual circle diameter, overlap and wrapped hue', () => {
  assert.match(reading(33), /equal.*(weight|say|share)|average/i);
  assert.match(reading(33), /eye|perceiv|percept/i);
  assert.match(reading(34), /half.*diameter/i);
  assert.match(reading(36), /180/);
  assert.match(reading(36), /change (?:is|=) 0.*opposite.*bright/i);
  assert.match(reading(36), /360/);
  assert.match(reading(36), /wrap/i);
  assert.match(reading(39), /overlap/i);
});
