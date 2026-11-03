const {test}=require('node:test');
const assert=require('node:assert/strict');
let core;
try { core=require('./core.cjs'); } catch {}
test('pixel address uses image row width and four channels',()=>{
  assert.ok(core,'pixel helpers are not implemented');
  assert.equal(core.pixelIndex(1,1,3),16);
  assert.equal(core.pixelIndex(2,0,3),8);
});
test('minute progress clamps start and end and restarts from chosen start',()=>{
  assert.ok(core,'timeline helper is not implemented');
  assert.equal(core.minuteProgress(500,1000),0);
  assert.equal(core.minuteProgress(31000,1000),0.5);
  assert.equal(core.minuteProgress(61000,1000),1);
  assert.equal(core.minuteProgress(90000,1000),1);
  assert.equal(core.minuteProgress(90000,90000),0);
});
