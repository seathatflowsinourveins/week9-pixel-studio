const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const corePath = path.join(__dirname, 'progress-transfer-core.js');
const C = fs.existsSync(corePath) ? require(corePath) : {};
const workbook = (extra = {}) => ({workbook:'icm-week9-v1',completed:[],notes:{},...extra});

test('portable progress core is available', () => {
  assert.equal(typeof C.parse, 'function');
});

test('rejects malformed, foreign, and oversized files before producing progress', () => {
  for (const text of ['{', 'null', '[]', JSON.stringify(workbook({workbook:'another-course'})), JSON.stringify(workbook({notes:[]})), ' '.repeat(2 * 1024 * 1024 + 1)]) {
    assert.throws(() => C.parse(text), /progress|JSON|2 MB/i);
  }
  assert.throws(() => C.parse(JSON.stringify(workbook({studioTransfer:{version:2}}))), /version/i);
});

test('allows only canonical lesson IDs and bounded note text; strips arbitrary keys', () => {
  const input = JSON.parse('{"workbook":"icm-week9-v1","completed":["00-start","19-debug","99-wrong","__proto__","00-start"],"notes":{"00-start":"hello","constructor":"bad","07-loops":7},"arbitrary":"do not store","studio":{"completed":["studio-1","studio-7"],"notes":{"studio-0":"<b>plain text</b>","__proto__":"bad"},"walkthrough":{"studio-0":999,"studio-1":"3"},"options":{"tile":999,"mode":"wrong"}}}');
  input.notes['01-language'] = 'n'.repeat(20001);
  const clean = C.parse(JSON.stringify(input));
  assert.deepEqual(clean.completed, ['00-start','19-debug']);
  assert.deepEqual(Object.keys(clean.notes), ['00-start','01-language']);
  assert.equal(clean.notes['01-language'].length, 20000);
  assert.equal(Object.hasOwn(clean, 'arbitrary'), false);
  assert.deepEqual(clean.studio.completed, ['studio-1']);
  assert.deepEqual(clean.studio.notes, {'studio-0':'<b>plain text</b>'});
  assert.deepEqual(clean.studio.walkthrough, {'studio-0':50});
  assert.equal(clean.studio.options.tile, 40);
  assert.equal(clean.studio.options.mode, 'focus');
  assert.equal({}.polluted, undefined);
});

test('round trips known browser progress and primitive guide positions', () => {
  const exported = C.createExport(workbook({completed:['07-loops'],notes:{'07-loops':'Try a wider gap'},studio:{completed:['studio-2'],notes:{'studio-2':'Read RGB'},walkthrough:{'studio-2':3},options:{tile:8,mode:'invert',focus:.5,strength:.6}}}), {
    session:{stage:3,line:12,secret:'omit'},resume:{kind:'loops',stage:2,mode:'grid',url:'omit'},loop:{mode:'grid',index:78}
  });
  const result = C.parse(JSON.stringify(exported));
  assert.deepEqual(result, exported);
  assert.deepEqual(result.studioTransfer, {version:1,session:{stage:3,line:12},resume:{kind:'loops',stage:2,mode:'grid'},loop:{mode:'grid',index:78}});
  assert.deepEqual(C.summarize(result), {foundations:1,stages:1,notes:2,positions:4});
});

test('ignores invalid portable positions and never accepts a route or script', () => {
  const value = C.parse(JSON.stringify(workbook({studioTransfer:{version:1,session:{stage:8,line:-1},resume:{kind:'stage',stage:1,url:'javascript:alert(1)'},loop:{mode:'row',index:18},foreign:{key:'value'}}})));
  assert.deepEqual(value.studioTransfer, {version:1,resume:{kind:'stage',stage:1}});
});

test('ignores stage IDs with extra characters', () => {
  const input = workbook({studio:{completed:['studio-0\n','studio-1'],notes:{'studio-0\n':'foreign','studio-1':'valid'},walkthrough:{'studio-0\n':4,'studio-1':2}}});
  const result = C.parse(JSON.stringify(input));
  assert.deepEqual(result.studio.completed, ['studio-1']);
  assert.deepEqual(result.studio.notes, {'studio-1':'valid'});
  assert.deepEqual(result.studio.walkthrough, {'studio-1':2});
});

test('stage completion IDs must be strings even if a non-string coerces to a known ID', () => {
  const result = C.parse(JSON.stringify(workbook({studio:{completed:[['studio-0'],'studio-1']}})));
  assert.deepEqual(result.studio.completed, ['studio-1']);
});

test('merges incoming conflicts while retaining other local progress without mutating either input', () => {
  const local = C.createExport(workbook({completed:['00-start'],notes:{'00-start':'keep','01-language':'old'},studio:{completed:['studio-0'],notes:{'studio-0':'keep studio','studio-1':'old'},walkthrough:{'studio-0':4},options:{tile:8}}}), {session:{stage:1,line:2},loop:{mode:'row',index:3}});
  const incoming = C.createExport(workbook({completed:['01-language'],notes:{'01-language':'incoming'},studio:{completed:['studio-1'],notes:{'studio-1':'incoming studio'},walkthrough:{'studio-1':2},options:{tile:20}}}), {session:{stage:2,line:9}});
  const beforeLocal = JSON.stringify(local), beforeIncoming = JSON.stringify(incoming);
  const merged = C.merge(local, incoming);
  assert.deepEqual(merged.completed, ['00-start','01-language']);
  assert.deepEqual(merged.notes, {'00-start':'keep','01-language':'incoming'});
  assert.deepEqual(merged.studio.completed, ['studio-0','studio-1']);
  assert.deepEqual(merged.studio.notes, {'studio-0':'keep studio','studio-1':'incoming studio'});
  assert.deepEqual(merged.studio.walkthrough, {'studio-0':4,'studio-1':2});
  assert.equal(merged.studio.options.tile, 20);
  assert.deepEqual(merged.studioTransfer, {version:1,session:{stage:2,line:9},loop:{mode:'row',index:3}});
  assert.equal(JSON.stringify(local), beforeLocal);
  assert.equal(JSON.stringify(incoming), beforeIncoming);
});

test('legacy progress with no studio or transfer state preserves local guide work', () => {
  const local = C.createExport(workbook({studio:{notes:{'studio-3':'keep'},options:{tile:12},walkthrough:{'studio-3':7}}}), {resume:{kind:'stage',stage:4}});
  const merged = C.merge(local, C.parse(JSON.stringify(workbook({notes:{'00-start':'new'}}))));
  assert.deepEqual(merged.studio, local.studio);
  assert.deepEqual(merged.studioTransfer, local.studioTransfer);
  assert.equal(merged.notes['00-start'], 'new');
});

test('export sanitizes local data without mutating browser-shaped inputs', () => {
  const raw = {completed:['00-start'],notes:{'00-start':'saved'},studio:{options:{tile:8},notes:{'studio-0':'saved studio'}},unrelated:'discard'};
  const snapshot = JSON.stringify(raw);
  const result = C.createExport(raw, {});
  result.notes['00-start'] = 'changed copy';
  result.studio.notes['studio-0'] = 'changed copy';
  assert.equal(JSON.stringify(raw), snapshot);
  assert.equal(result.workbook, 'icm-week9-v1');
  assert.equal(Object.hasOwn(result, 'unrelated'), false);
});
