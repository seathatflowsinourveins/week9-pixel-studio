const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('./assignment-core.js');

test('blank data starts with empty rows and no recorded work', () => {
  const value = core.normalize();
  assert.deepEqual(value.project, {title:'', concept:'', source:'', partner:'', roles:''});
  assert.deepEqual(value.iterations, Array.from({length:3}, () => ({change:'', result:'', url:''})));
  assert.deepEqual(value.viewings, Array.from({length:3}, () => ({notes:'', fullMinute:false})));
  assert.deepEqual(value.links, {blog:'', code:'', fullscreen:'', spreadsheet:''});
  assert.deepEqual(value.checked, []);
  assert.deepEqual(core.summary(value), {iterations:0, viewings:0, selfChecked:0, links:0, unfinished:[
    'Add a title and concept.', 'Record your image source or references.', 'Record your partner and roles.',
    'Record at least three iterations with a change and result.',
    'Record at least three full-minute viewings with notes.',
    'Add the four submission links.', 'Review the nine assignment self-checks.'
  ]});
});

test('normalization strips foreign and inherited keys without coercing objects', () => {
  const input = JSON.parse('{"__proto__":{"polluted":true},"project":{"title":{"bad":"value"},"concept":7,"source":null,"partner":false,"roles":"  shared work  ","secret":"x"},"links":{"blog":"javascript:alert(1)","code":"data:text/html,bad","fullscreen":"file:///tmp/x","spreadsheet":"https://example.com/sheet"},"checked":[0,8,8,9,-1,"2",2.5],"foreign":"discard"}');
  const normalized = core.normalize(input);
  assert.deepEqual(normalized.project, {title:'', concept:'', source:'', partner:'', roles:'  shared work  '});
  assert.deepEqual(normalized.links, {blog:'', code:'', fullscreen:'', spreadsheet:'https://example.com/sheet'});
  assert.deepEqual(normalized.checked, [0,8]);
  assert.equal(Object.hasOwn(normalized, '__proto__'), false);
  assert.equal(Object.hasOwn(normalized, 'foreign'), false);
  assert.equal({}.polluted, undefined);
  assert.equal(core.normalize(Object.create({project:{title:'inherited'}})).project.title, '');
  assert.equal(core.normalize({project:Object.create({title:'inherited'})}).project.title, '');
});

test('normalization bounds notes and row counts and requires literal boolean checks', () => {
  const value = core.normalize({project:{title:'t'.repeat(300), concept:'c'.repeat(25000)},
    iterations:Array.from({length:20}, () => ({change:'a'.repeat(25000), result:'b', url:'https://example.com'})),
    viewings:[{notes:'n'.repeat(25000), fullMinute:'true'}, {notes:'yes', fullMinute:1}, {notes:'yes', fullMinute:true}]});
  assert.equal(value.project.title.length, 200);
  assert.equal(value.project.concept.length, 20000);
  assert.equal(value.iterations.length, 12);
  assert.equal(value.iterations[0].change.length, 20000);
  assert.equal(value.viewings[0].notes.length, 20000);
  assert.deepEqual(value.viewings.map(row => row.fullMinute), [false,false,true]);
  assert.equal(core.normalize({viewings:Array(30).fill(null)}).viewings.length, 12);
  assert.deepEqual(core.normalize({iterations:[null, false, {change:{}}]}).iterations, Array.from({length:3}, () => ({change:'',result:'',url:''})));
});

test('URLs accept only complete http or https addresses', () => {
  const value = core.normalize({iterations:[{url:' /relative '}], links:{blog:' https://example.com/blog ',code:'http://localhost:3000/code',fullscreen:'https://',spreadsheet:'https://example.com/' + 'a'.repeat(2100)}});
  assert.equal(value.links.blog, 'https://example.com/blog');
  assert.equal(value.links.code, 'http://localhost:3000/code');
  assert.equal(value.links.fullscreen, '');
  assert.equal(value.links.spreadsheet, '');
  assert.equal(value.iterations[0].url, '');
});

test('summary counts recorded evidence and explicit self-checks separately', () => {
  const value = {iterations:[{change:'smaller tiles',result:'more detail'},{change:'only change'},{change:' ',result:'x'}],
    viewings:[{notes:'12 s: brighter center',fullMinute:true},{notes:'notes only'},{notes:' ',fullMinute:true}],
    checked:[0,2,2], links:{blog:'https://example.com',code:'javascript:alert(1)'}};
  const result = core.summary(value);
  assert.equal(result.iterations,1);
  assert.equal(result.viewings,1);
  assert.equal(result.selfChecked,2);
  assert.equal(result.links,1);
  assert.ok(result.unfinished.includes('Record at least three full-minute viewings with notes.'));
  assert.equal(Object.hasOwn(result,'complete'),false);
});

test('normalizing and summarizing leave input objects unchanged', () => {
  const input = {project:{title:'My work'}, iterations:[{change:'first'}], checked:[3,1,3]};
  const before = JSON.stringify(input);
  const result = core.normalize(input);
  core.summary(input);
  result.project.title = 'Different';
  result.iterations[0].change = 'Changed';
  assert.equal(JSON.stringify(input), before);
});

test('merge preserves local fields and rows while imported nonempty fields win', () => {
  const left = {project:{title:'Local',concept:'Keep concept',partner:'Pat'},
    iterations:[{change:'local change',result:'keep result'}, {}, {}, {change:'fourth'}],
    viewings:[{notes:'local notes',fullMinute:true}],links:{blog:'https://example.com/local',code:'https://example.com/code'},checked:[0,3]};
  const right = {project:{title:'Imported',concept:'  ',roles:'Together'},iterations:[{change:'import change'}, {result:'second result'}],
    viewings:[{notes:'import notes',fullMinute:false},{notes:'second viewing',fullMinute:true}],links:{blog:'javascript:alert(1)'},checked:[3,5]};
  const before = [JSON.stringify(left),JSON.stringify(right)];
  const result = core.merge(left,right);
  assert.deepEqual(result.project,{title:'Imported',concept:'Keep concept',source:'',partner:'Pat',roles:'Together'});
  assert.deepEqual(result.iterations[0],{change:'import change',result:'keep result',url:''});
  assert.equal(result.iterations[1].result,'second result');
  assert.equal(result.iterations[3].change,'fourth');
  assert.deepEqual(result.viewings[0],{notes:'import notes',fullMinute:true});
  assert.deepEqual(result.viewings[1],{notes:'second viewing',fullMinute:true});
  assert.equal(result.links.blog,'https://example.com/local');
  assert.equal(result.links.code,'https://example.com/code');
  assert.deepEqual(result.checked,[0,3,5]);
  assert.deepEqual([JSON.stringify(left),JSON.stringify(right)], before);
  assert.deepEqual(core.merge(left,{}), core.normalize(left));
});

test('field edits preserve current unrelated notes and allow intentional clearing and unchecking', () => {
  const current = {project:{title:'Latest title',concept:'Notes from another tab'},
    iterations:[{change:'new change',result:'new result'}],checked:[1,4],links:{code:'https://example.com/code'}};
  const before = JSON.stringify(current);
  const cleared = core.patch(current,'project.title','');
  assert.equal(cleared.project.title,'');
  assert.equal(cleared.project.concept,'Notes from another tab');
  const unchecked = core.patch(cleared,'checked.1',false);
  assert.deepEqual(unchecked.checked,[4]);
  const changed = core.patch(unchecked,'iterations.0.change','my new edit');
  assert.deepEqual(changed.iterations[0],{change:'my new edit',result:'new result',url:''});
  assert.equal(core.patch(changed,'links.code','').links.code,'');
  assert.equal(JSON.stringify(current),before);
});

test('field edits reject foreign paths and bound newly added rows', () => {
  const current = core.normalize();
  for (const path of ['__proto__.bad','project.__proto__','iterations.12.change','iterations.-1.change','viewings.1.foreign','checked.9']) {
    assert.deepEqual(core.patch(current,path,'bad'),current);
  }
  const expanded = core.patch(current,'iterations.3.change','');
  assert.equal(expanded.iterations.length,4);
  assert.equal(core.summary(expanded).iterations,0);
  assert.equal(core.patch(current,'viewings.11.fullMinute',true).viewings.length,12);
  assert.equal(core.patch(current,'viewings.0.fullMinute','true').viewings[0].fullMinute,false);
  assert.deepEqual(core.patch(current,'checked.2',true).checked,[2]);
});

test('pending field edits can be replayed over newer storage after a failed save', () => {
  let state = {project:{partner:'Newest partner',concept:'Newer concept'},links:{blog:'https://example.com/new'}};
  for (const [path,value] of [['project.title','Unsaved title'],['iterations.0.result','Unsaved result'],['checked.3',true]]) {
    state = core.patch(state,path,value);
  }
  assert.equal(state.project.title,'Unsaved title');
  assert.equal(state.project.partner,'Newest partner');
  assert.equal(state.project.concept,'Newer concept');
  assert.equal(state.links.blog,'https://example.com/new');
  assert.equal(state.iterations[0].result,'Unsaved result');
  assert.deepEqual(state.checked,[3]);
});

test('CSV exports only entered rows, quoting text and neutralizing spreadsheet formulas', () => {
  assert.equal(core.iterationsCsv({}), 'iteration,change,result,url\r\n');
  assert.equal(core.observationsCsv({}), 'viewing,notes,full_minute_self_reported\r\n');
  assert.equal(core.iterationsCsv({iterations:[{change:'=HYPERLINK("bad")',result:'two, colors\nchanged'}]}),
    'iteration,change,result,url\r\n1,"\'=HYPERLINK(""bad"")","two, colors\nchanged",\r\n');
  assert.equal(core.observationsCsv({viewings:[{}, {notes:'12 s: blue',fullMinute:true}]}),
    'viewing,notes,full_minute_self_reported\r\n2,12 s: blue,true\r\n');
});

test('Markdown export records only supplied notes and separates self-report from verification', () => {
  const blank = core.toMarkdown({});
  assert.ok(!blank.includes('Iteration 1'));
  assert.ok(!blank.includes('Viewing 1'));
  const output = core.toMarkdown({project:{title:'My piece',concept:'Blue at the edges'},iterations:[{change:'Larger tiles',result:'Less detail'}],viewings:[{notes:'12 s: center changes',fullMinute:true}],checked:[2],links:{code:'https://example.com/code'}}, ['First check','Second check','Repeatable']);
  assert.ok(output.includes('Blue at the edges'));
  assert.ok(output.includes('Larger tiles'));
  assert.ok(output.includes('12 s: center changes'));
  assert.ok(output.includes('Full minute watched (self-reported): yes'));
  assert.ok(output.includes('Repeatable'));
  assert.ok(!output.includes('First check'));
  assert.ok(output.includes('Links have not been verified by this page.'));
});
