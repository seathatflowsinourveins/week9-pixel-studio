const test = require('node:test');
const assert = require('node:assert/strict');
const lessons = require('../data/clean-lessons.cjs');
const roadmap = require('../data/learning-roadmap.cjs');

test('all seven phase openings give a visible action for the loaded practice sketch', () => {
  assert.deepEqual(lessons.map(lesson => lesson.actions.length), [9, 7, 6, 6, 6, 6, 7]);
  const actions = [/window.*plant/i, /block|square/i, /\(16, ?16\)/, /40%/, /30 seconds/i, /Narrow preview/i, /\bA\b.*\bB\b/];
  lessons.forEach((lesson, stage) => {
    const first = lesson.actions[0];
    assert.doesNotMatch(first.title + ' ' + first.here, /install|copy sketch|replace|press Restart p5|beside each other/i);
    assert.match(first.here, actions[stage], lesson.title);
  });
  assert.match(lessons[0].actions[0].here, /Practice|Your sketch/i);
  assert.match(lessons[0].actions[0].editor, /account/i);
});

test('the RGBA walkthrough keeps the address and color amount separate for sample 16,16', () => {
  const rgba = lessons[2];
  assert.match(rgba.actions[0].title, /choose one pixel/i);
  assert.match(roadmap[2].play.try, /\(16, ?16\)/);
  const text = [rgba.experiment.expect, ...rgba.actions.map(action => action.here)].join(' ');
  assert.match(text, /20545.{0,40}201/);
  assert.match(text, /148, ?201, ?207, ?255/);
});

test('focus uses the same boundary comparison in the roadmap and walkthrough', () => {
  for (const text of [roadmap[3].play.try, lessons[3].experiment.instruction, lessons[3].actions[2].here]) {
    assert.match(text, /100%/);
    assert.match(text, /40%.{0,30}70%/);
  }
});

test('timed practice distinguishes the two clocks and still asks for a real full viewing', () => {
  const first = lessons[4].actions[0];
  assert.match(first.here, /Teaching preview/i);
  assert.match(first.here, /Your sketch/i);
  assert.match(lessons[4].experiment.instruction, /60 seconds|full minute/i);
  assert.match(lessons[6].actions.map(action => action.here + ' ' + action.editor).join(' '), /two or three.*observations/i);
});
