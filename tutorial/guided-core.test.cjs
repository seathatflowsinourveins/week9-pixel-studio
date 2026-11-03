const {test}=require('node:test'),assert=require('node:assert/strict'),C=require('./project-core.cjs');
test('saved walkthrough places survive normalization while invalid entries are dropped',()=>{
 const s=C.cleanState({walkthrough:{'studio-0':3,'studio-1':-8,'studio-2':2.8,alien:5,'studio-4':'bad'}});
 assert.deepEqual(s.walkthrough,{'studio-0':3,'studio-1':0,'studio-2':2});
});
test('resume stays inside the actual guide and older progress starts at the beginning',()=>{
 assert.equal(typeof C.guidePosition,'function','walkthrough resume helper is missing');
 assert.equal(C.guidePosition({walkthrough:{'studio-0':30}},'studio-0',8),7);
 assert.equal(C.guidePosition({walkthrough:{'studio-0':3}},'studio-0',8),3);
 assert.equal(C.guidePosition({completed:[],notes:{}},'studio-0',8),0);
});
