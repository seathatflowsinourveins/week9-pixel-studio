const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
test('browser bundle fingerprint ignores source order and line endings but includes names and all text assets',()=>{
 const {bundleFingerprint}=require('./build-pages.cjs');
 const records=[
  {name:'learn.js',text:"fetch('./course-data.json');\n"},
  {name:'course-data.json',text:'{"stages":[1]}\n'},
  {name:'learn.css',text:'body {\n  color: red;\n}\n'},
  {name:'learn.html',text:'<script src="./learn.js"></script>\n'},
 ];
 const version=bundleFingerprint(records);
 assert.match(version,/^[a-f0-9]{16}$/);
 assert.equal(bundleFingerprint(records.toReversed().map(record=>({...record,text:record.text.replaceAll('\n','\r\n')}))),version);
 for(let i=0;i<records.length;i++)assert.notEqual(bundleFingerprint(records.map((record,index)=>index===i?{...record,text:record.text+' '}:record)),version,records[i].name+' content must affect the version');
 assert.notEqual(bundleFingerprint(records.map(record=>record.name==='course-data.json'?{...record,text:'{"stages":[2]}\n'}:record)),version,'Updated course JSON must invalidate the asset bundle');
 assert.notEqual(bundleFingerprint(records.map(record=>({...record,name:'renamed-'+record.name}))),version);
});
test('static export contains all stages and resolves assets below a project URL',async t=>{
 const {buildPages}=require('./build-pages.cjs'),temp=await fs.mkdtemp(path.join(os.tmpdir(),'pixel-pages-test-'));
 t.after(async()=>{const resolved=await fs.realpath(temp),parent=await fs.realpath(os.tmpdir());assert.equal(path.dirname(resolved).toLowerCase(),parent.toLowerCase());assert(path.basename(resolved).startsWith('pixel-pages-test-'));await fs.rm(resolved,{recursive:true,force:true});});
 const out=path.join(temp,'dist'),manifest=await buildPages({destination:out}),names=new Set(manifest.files.map(f=>f.path));
 assert.match(manifest.version,/^[a-f0-9]{16}$/);
 assert.equal(JSON.parse(await fs.readFile(path.join(out,'site-manifest.json'),'utf8')).version,manifest.version);
 assert.equal(manifest.stages.length,7);assert.equal(manifest.foundations,20);
 assert(![...names].some(name=>name.split('/').some(part=>part.startsWith('.'))),'Public manifest must exclude dotfiles omitted by the Pages uploader');
 for(const name of names)assert(!/(^|\/)(backups|\.runtime|my-project|journal|evidence|node_modules|\.git)(\/|$)|\.(cjs|test.js|log|zip)$/.test(name),name);
 for(let n=1;n<=7;n++)assert(names.has('workspace/stage-0'+n+'/sketch.js'));
 for(const page of ['index.html','ecosystem/index.html','ecosystem/learn.html','ecosystem/loops.html','ecosystem/group-study.html']){
  const html=await fs.readFile(path.join(out,page),'utf8'),base=new URL(page,'https://example.test/some/nested/project/');
  if(page.startsWith('ecosystem/')){
   const sourceHTML=await fs.readFile(path.join(__dirname,'../tutorial',page),'utf8');
   const references=text=>[...text.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map(match=>match[1]);
   assert.deepEqual(references(html),references(sourceHTML).map(url=>/^\.\/[^/?#]+\.(?:js|css)$/.test(url)?url+'?v='+manifest.version:url),page+' must version owned assets and preserve other destinations');
  }
  for(const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)){
   const target=match[1].replaceAll('&amp;','&');if(/^(?:https?:|data:|#)/.test(target))continue;
   const url=new URL(target,base);assert(url.pathname.startsWith('/some/nested/project/'),target+' escaped the project');
   const relative=decodeURIComponent(url.pathname.slice('/some/nested/project/'.length)),file=relative.endsWith('/')?relative+'index.html':relative;
   assert(names.has(file),page+' links to missing '+file);
   if(page.startsWith('ecosystem/')&&/^\.\/[^/?#]+\.(?:js|css)(?:\?|$)/.test(target))assert.equal(url.search,'?v='+manifest.version,target+' must use this bundle version');
  }
 }
 const data=JSON.parse(await fs.readFile(path.join(out,'ecosystem/dashboard-data.json'),'utf8'));
 for(const item of [...data.stages,...data.foundations]){const url=new URL(item.href,'https://example.test/some/nested/project/ecosystem/');assert(url.pathname.startsWith('/some/nested/project/'));assert(names.has(url.pathname.slice('/some/nested/project/'.length)));}
 assert((await fs.readFile(path.join(out,'ecosystem/progress-transfer.js'),'utf8')).includes('transfer'));
 for(const [file,dataFile] of [['learn.js','course-data.json'],['dashboard.js','dashboard-data.json']]){
  const script=await fs.readFile(path.join(out,'ecosystem',file),'utf8');
  assert(script.includes('./'+dataFile+'?v='+manifest.version),file+' must fetch matching data');
  assert(!script.includes("'./"+dataFile+"'"),file+' must not retain its unversioned data fetch');
 }
 for(const file of manifest.files){
  const bytes=await fs.readFile(path.join(out,file.path));
  assert.equal(file.bytes,bytes.length,file.path);
  assert.equal(file.sha256,crypto.createHash('sha256').update(bytes).digest('hex'),file.path+' manifest hash must cover emitted bytes');
  if(file.path.startsWith('ecosystem/'))assert(!bytes.toString('utf8').includes('\r'),file.path+' must emit canonical LF text');
 }
 for(const name of ['p5.min.js','p5-LICENSE.txt'])assert.deepEqual(await fs.readFile(path.join(out,'vendor',name)),await fs.readFile(path.join(__dirname,'../tutorial/vendor',name)),'Pinned vendor bytes must remain unchanged');
 assert.equal(await fs.readFile(path.join(out,'.pixel-studio-build'),'utf8'),'pixel-studio-static-v1');
 const repeated=await buildPages({destination:out});
 assert.deepEqual(repeated,manifest,'The same sources must produce the same version, output hashes and manifest');
});
