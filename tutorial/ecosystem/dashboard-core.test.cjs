const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('./dashboard-core.js');

test('validates only primitive lesson context fields and strips foreign fields', () => {
  assert.deepEqual(C.validContext({kind:'loops',stage:2,mode:'grid',href:'https://bad.example',completed:['studio-6']}), {kind:'loops',stage:2,mode:'grid'});
  assert.deepEqual(C.validContext({kind:'stage',stage:7,mode:'row'}), {kind:'stage',stage:7});
  for (const value of [null, [], 'stage', {}, {kind:'stage',stage:'2'}, {kind:'stage',stage:0}, {kind:'stage',stage:8}, {kind:'stage',stage:NaN}, {kind:'loops',stage:2,mode:'bad'}, {kind:'loops',stage:3,mode:'row'}, {kind:'stage',stage:2.5}]) assert.equal(C.validContext(value), null);
});

test('rebuilds editor routes and ignores injected storage URLs', () => {
  assert.equal(C.resumePath({kind:'stage',stage:4,url:'//evil.example'}), './learn.html?view=editor#stage-4');
  assert.equal(C.resumePath({kind:'loops',stage:2,mode:'grid'}), './loops.html?mode=grid&view=editor');
  assert.equal(C.resumePath({kind:'loops',stage:2,mode:'row'}), './loops.html?mode=row&view=editor');
  assert.equal(C.resumePath({kind:'stage',stage:'javascript:alert(1)'}), './loops.html?mode=row&view=editor');
  assert.equal(C.resumePath(null), './loops.html?mode=row&view=editor');
});

test('reads recognized workbook completion without mutating it', () => {
  const workbook = Object.freeze({completed:Object.freeze(['foundation-1']),studio:Object.freeze({completed:Object.freeze(['studio-6','studio-0','studio-0','studio-7',0,null,'studio-2\n','__proto__'])})});
  assert.deepEqual(C.completedStages(workbook), ['studio-6','studio-0']);
  assert.equal(workbook.studio.completed.length, 8);
  for (const value of [null, {}, {completed:['studio-0']}, {studio:{completed:'studio-0'}}, {studio:{completed:{0:'studio-0'}}}]) assert.deepEqual(C.completedStages(value), []);
});
