const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
test('static export contains all stages and resolves assets below a project URL',async t=>{
 const {buildPages}=require('./build-pages.cjs'),temp=await fs.mkdtemp(path.join(os.tmpdir(),'pixel-pages-test-'));
 t.after(async()=>{const resolved=await fs.realpath(temp),parent=await fs.realpath(os.tmpdir());assert.equal(path.dirname(resolved).toLowerCase(),parent.toLowerCase());assert(path.basename(resolved).startsWith('pixel-pages-test-'));await fs.rm(resolved,{recursive:true,force:true});});
 const out=path.join(temp,'dist'),manifest=await buildPages({destination:out}),names=new Set(manifest.files.map(f=>f.path));
 assert.equal(manifest.stages.length,7);assert.equal(manifest.foundations,20);
 assert(![...names].some(name=>name.split('/').some(part=>part.startsWith('.'))),'Public manifest must exclude dotfiles omitted by the Pages uploader');
 for(const name of names)assert(!/(^|\/)(backups|\.runtime|my-project|journal|evidence|node_modules|\.git)(\/|$)|\.(cjs|test.js|log|zip)$/.test(name),name);
 for(let n=1;n<=7;n++)assert(names.has('workspace/stage-0'+n+'/sketch.js'));
 for(const page of ['index.html','ecosystem/index.html','ecosystem/learn.html','ecosystem/loops.html']){
  const html=await fs.readFile(path.join(out,page),'utf8'),base=new URL(page,'https://example.test/some/nested/project/');
  for(const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)){
   const target=match[1].replaceAll('&amp;','&');if(/^(?:https?:|data:|#)/.test(target))continue;
   const url=new URL(target,base);assert(url.pathname.startsWith('/some/nested/project/'),target+' escaped the project');
   const relative=decodeURIComponent(url.pathname.slice('/some/nested/project/'.length)),file=relative.endsWith('/')?relative+'index.html':relative;
   assert(names.has(file),page+' links to missing '+file);
  }
 }
 const data=JSON.parse(await fs.readFile(path.join(out,'ecosystem/dashboard-data.json'),'utf8'));
 for(const item of [...data.stages,...data.foundations]){const url=new URL(item.href,'https://example.test/some/nested/project/ecosystem/');assert(url.pathname.startsWith('/some/nested/project/'));assert(names.has(url.pathname.slice('/some/nested/project/'.length)));}
 assert((await fs.readFile(path.join(out,'ecosystem/progress-transfer.js'),'utf8')).includes('transfer'));
});
