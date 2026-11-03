const {test}=require('node:test'),assert=require('node:assert/strict'),C=require('./project-core.cjs');
test('a stale foundation tab preserves newer course notes, options and step while saving its own edit',()=>{
 const base={completed:[],notes:{},studio:{notes:{'studio-0':'old'},walkthrough:{'studio-0':0}}};
 const local={...base,completed:['00-start'],notes:{'00-start':'foundation observation'}};
 const remote={...base,otherField:'keep',studio:{notes:{'studio-0':'new course observation'},walkthrough:{'studio-0':4},options:{tile:32}}};
 const result=C.mergeProgress(base,local,remote);assert.deepEqual(result.completed,['00-start']);assert.equal(result.notes['00-start'],'foundation observation');assert.equal(result.studio.notes['studio-0'],'new course observation');assert.equal(result.studio.walkthrough['studio-0'],4);assert.equal(result.studio.options.tile,32);assert.equal(result.otherField,'keep');
});
test('intentional unchecking and clearing apply without erasing independent edits',()=>{
 const base={completed:['00-start'],notes:{'00-start':'old'},studio:{completed:['studio-0'],notes:{'studio-0':'old'}}};
 const local={completed:[],notes:{'00-start':''},studio:{completed:[],notes:{'studio-0':''}}};
 const remote={completed:['00-start','01-language'],notes:{'00-start':'old','01-language':'other'},studio:{completed:['studio-0','studio-1'],notes:{'studio-0':'old','studio-1':'other'}}};
 const r=C.mergeProgress(base,local,remote);assert.deepEqual(r.completed,['01-language']);assert.equal(r.notes['00-start'],'');assert.equal(r.notes['01-language'],'other');assert.deepEqual(r.studio.completed,['studio-1']);assert.equal(r.studio.notes['studio-1'],'other');
});
