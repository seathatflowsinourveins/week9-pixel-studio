'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const {backupWorkspace}=require('./setup.cjs');
const {inspect}=require('./doctor.cjs');

async function fixture(t){
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'icm-session-backup-'));
 t.after(async()=>{const real=await fs.realpath(root),temp=await fs.realpath(os.tmpdir());assert.equal(path.dirname(real).toLowerCase(),temp.toLowerCase());assert(path.basename(real).startsWith('icm-session-backup-'));await fs.rm(real,{recursive:true,force:true});});
 for(const sub of ['my-project','journal','versions'])await fs.mkdir(path.join(root,'workspace',sub),{recursive:true});
 return root;
}

test('session snapshots preserve exact learner bytes, deduplicate and retain earlier versions',async t=>{
 const root=await fixture(t),code=path.join(root,'workspace/my-project/sketch.js'),image=path.join(root,'workspace/my-project/source.png');
 const original=Buffer.from('// My own version\r\nconst value = 42;\r\n');
 await fs.writeFile(code,original);await fs.writeFile(image,Buffer.from([0,1,2,254,255]));await fs.writeFile(path.join(root,'workspace/journal/notes.txt'),'Real notes.');
 const first=await backupWorkspace({root});assert.equal(first.created,true);assert.equal(first.files,3);assert.deepEqual(await fs.readFile(path.join(first.path,'workspace/my-project/sketch.js')),original);assert.deepEqual(await fs.readFile(path.join(first.path,'workspace/my-project/source.png')),await fs.readFile(image));assert.deepEqual(await fs.readFile(code),original);
 const same=await backupWorkspace({root});assert.equal(same.created,false);assert.equal(same.hash,first.hash);assert.equal(same.path,first.path);
 await fs.writeFile(code,'// A second tested version\n');const changed=await backupWorkspace({root});assert.equal(changed.created,true);assert.notEqual(changed.path,first.path);assert.deepEqual(await fs.readFile(path.join(first.path,'workspace/my-project/sketch.js')),original);assert.equal(await fs.readFile(path.join(changed.path,'workspace/my-project/sketch.js'),'utf8'),'// A second tested version\n');
});

test('source symlinks are reported and never followed',async t=>{
 const root=await fixture(t),outside=path.join(root,'outside');await fs.mkdir(outside);await fs.writeFile(path.join(outside,'private.txt'),'Do not copy this.');
 await fs.symlink(outside,path.join(root,'workspace/my-project/linked'),'junction');await fs.writeFile(path.join(root,'workspace/my-project/sketch.js'),'// Saved project');
 const result=await backupWorkspace({root});assert.equal(result.created,true);assert.equal(result.files,1);assert(result.skipped.some(x=>x.path.endsWith('linked')&&/link/i.test(x.reason)));await assert.rejects(fs.stat(path.join(result.path,'workspace/my-project/linked/private.txt')),{code:'ENOENT'});
});

test('backup destination symlinks are rejected before any outside write',async t=>{
 const root=await fixture(t),outside=path.join(root,'outside');await fs.mkdir(outside);await fs.writeFile(path.join(root,'workspace/my-project/sketch.js'),'// Saved project');await fs.symlink(outside,path.join(root,'backups'),'junction');
 await assert.rejects(backupWorkspace({root}),/link|outside/i);assert.deepEqual(await fs.readdir(outside),[]);
});

test('invalid progress envelopes are skipped without changing their bytes',async t=>{
 const root=await fixture(t),dir=path.join(root,'backups/progress');await fs.mkdir(dir,{recursive:true});const raw='{broken';await fs.writeFile(path.join(dir,'current.json'),raw);
 const result=await backupWorkspace({root});assert.equal(result.created,false);assert(result.skipped.some(x=>x.path==='backups/progress/current.json'&&/invalid/i.test(x.reason)));assert.equal(await fs.readFile(path.join(dir,'current.json'),'utf8'),raw);
});

test('validated progress envelope is preserved byte-for-byte in the session snapshot',async t=>{
 const root=await fixture(t),{createProgressStore}=require('./progress-store.cjs'),store=createProgressStore(root);
 await store.save({revision:null,progress:{workbook:'icm-week9-v1',completed:[],notes:{},studio:{notes:{'studio-0':'Fixture observation'}}},session:{stage:1,line:3}});
 const original=await fs.readFile(path.join(root,'backups/progress/current.json')),result=await backupWorkspace({root});assert.equal(result.created,true);assert.equal(result.files,1);assert.deepEqual(await fs.readFile(path.join(result.path,'backups/progress/current.json')),original);
 const broken=JSON.parse(original);broken.hash='0'.repeat(64);await fs.writeFile(path.join(root,'backups/progress/current.json'),JSON.stringify(broken));const skipped=await backupWorkspace({root});assert.equal(skipped.created,false);assert(skipped.skipped.some(x=>x.path==='backups/progress/current.json'&&/invalid/i.test(x.reason)));
});

test('doctor verifies current pinned assets and reference syntax without claiming browser rendering',async()=>{
 const result=await inspect(path.resolve(__dirname,'..'));assert.equal(result.ok,true,JSON.stringify(result.checks.filter(x=>!x.ok)));assert.equal(result.p5,'2.3.4');assert(result.checks.some(x=>x.name==='Pinned p5 bytes'&&x.ok));assert.equal(result.checks.filter(x=>/^Stage \d reference/.test(x.name)).length,7);assert(result.checks.some(x=>/not a browser rendering test/i.test(x.detail)));
});
