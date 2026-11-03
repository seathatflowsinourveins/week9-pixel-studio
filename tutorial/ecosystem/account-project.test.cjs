const test=require('node:test'),assert=require('node:assert/strict');
const A=require('./assignment-core.js'),P=(()=>{try{return require('./account-project.js');}catch{return {};}})();
const URL='https://editor.p5js.org/student/sketches/project_123';
function memory(value){let raw=value===undefined?null:JSON.stringify(value);return {getItem:()=>raw,setItem:(key,next)=>{assert.equal(key,A.STORAGE_KEY);raw=next;},raw:()=>raw};}
test('saved p5 link uses Finish code link and preserves the latest notes, rows and other links',()=>{
 const storage=memory(A.normalize({project:{title:'Keep me'},iterations:[{change:'tile size',result:'detail'}],links:{blog:'https://example.test/blog'}}));
 assert.equal(P.read(storage),'');assert.equal(P.save(storage,URL),true);
 const after=JSON.parse(storage.raw());assert.equal(after.links.code,URL);assert.equal(after.project.title,'Keep me');assert.equal(after.iterations[0].result,'detail');assert.equal(after.links.blog,'https://example.test/blog');
 assert.equal(P.read(storage),URL);
});
test('non-p5 Finish links are not account destinations and rejected saves preserve exact bytes',()=>{
 const storage=memory(A.normalize({links:{code:'https://example.test/code'}})),before=storage.raw();
 assert.equal(P.read(storage),'');for(const value of ['javascript:alert(1)','https://editor.p5js.org/login','https://editor.p5js.org/a/sketches/b?x=1','https://example.test/a/sketches/b'])assert.throws(()=>P.save(storage,value),/p5/i);
 assert.equal(storage.raw(),before);
});
test('unreadable, future-version and unavailable storage never become blank replacement state',()=>{
 for(const raw of ['{','null','[]','{"version":2}']){let writes=0;const storage={getItem:()=>raw,setItem:()=>writes++};assert.throws(()=>P.save(storage,URL));assert.equal(writes,0);}
 assert.throws(()=>P.save({getItem:()=>{throw Error('blocked');}},URL),/blocked/);
 const storage={getItem:()=>null,setItem:()=>{throw Error('full');}};assert.throws(()=>P.save(storage,URL),/full/);
});
test('the account destination travels in the existing Finish desk progress export',()=>{
 const transfer=require('./progress-transfer-core.js'),storage=memory();P.save(storage,URL);
 const exported=transfer.createExport({completed:[],notes:{}},{assignment:JSON.parse(storage.raw())});
 const imported=transfer.parse(JSON.stringify(exported));
 assert.equal(P.read(memory(imported.studioTransfer.assignment)),URL);
});
