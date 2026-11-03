const {test}=require('node:test'),assert=require('node:assert/strict');
let c;try{c=require('./project-core.cjs');}catch{}
test('outside region loses color while inside region keeps source channels',()=>{
 assert.ok(c,'project color rules missing');
 assert.deepEqual(c.transformRGB([100,40,180],{mode:'focus',focus:.5},.8,1),[107,107,107]);
 assert.deepEqual(c.transformRGB([100,40,180],{mode:'focus',focus:.5},.2,1),[100,40,180]);
 assert.deepEqual(c.transformRGB([100,40,180],{mode:'focus',focus:.5},.8,0),[100,40,180]);
 assert.deepEqual(c.transformRGB([100,40,180],{mode:'focus',focus:.5},.8,.5),[103,73,143]);
 assert.deepEqual(c.transformRGB([100,40,180],{mode:'invert'},.2,1),[155,215,75]);
});
test('sampling walks source columns then rows and wraps at last valid tile',()=>{
 assert.ok(c,'sampling missing');
 assert.deepEqual(c.sampleAt(19,16,320,240),{x:304,y:0,index:1216,column:19,row:0,count:300});
 assert.deepEqual(c.sampleAt(20,16,320,240),{x:0,y:16,index:20480,column:0,row:1,count:300});
 assert.deepEqual(c.sampleAt(300,16,320,240),{x:0,y:0,index:0,column:0,row:0,count:300});
});
test('progress options retain zero endpoints and reject invalid modes and stage ids',()=>{
 assert.ok(c,'state normalization missing');
 const s=c.cleanState({options:{focus:0,strength:0,tile:0,mode:'bad'},completed:['studio-1','alien','studio-1'],notes:{'studio-1':'actual note',alien:'ignore'}});
 assert.equal(s.options.focus,0);assert.equal(s.options.strength,0);assert.equal(s.options.tile,4);assert.equal(s.options.mode,'focus');
 assert.deepEqual(s.completed,['studio-1']);assert.deepEqual(s.notes,{'studio-1':'actual note'});
});
