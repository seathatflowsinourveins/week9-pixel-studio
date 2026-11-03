'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{execFile}=require('node:child_process'),{promisify}=require('node:util');
const run=promisify(execFile),source=__dirname;
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const slash=value=>value.split(path.sep).join('/');
const denied=/(^|\/)(?:workspace|backups|evidence|\.runtime|node_modules|\.git|research-notes)(\/|$)|(^|\/)progress\.txt$|\.(?:zip|7z|tar|gz|log)$/i;
const rootExtensions=new Set(['.cjs','.js','.css','.cmd','.txt']);
const directories=new Set(['data','assets','vendor','sketches','project-sketches','editor-starter','templates']);
const rootHTML=new Set(['Week-9-Project-Studio.html','ICM-Week-9-Workbook.html']);
const ecosystemExtensions=new Set(['.cjs','.js','.css','.html','.txt']);
const ecosystemJSON=new Set(['course-data.json','dashboard-data.json','study-map.json']);
const staticExtensions=new Set(['.cjs','.js','.css','.html','.json','.txt','.png','.svg','.csv']);
async function collect(){
 const files=[];
 async function tree(relative){
  const file=path.join(source,relative),stat=await fs.lstat(file);
  if(stat.isSymbolicLink())throw Error('Package source must not be a link: '+relative);
  if(denied.test(relative))return;
  if(relative.startsWith('assets/')&&!['assets/sample.png','assets/sample.svg'].includes(relative))return;
  if(stat.isDirectory()){for(const entry of (await fs.readdir(file)).sort())await tree(relative+'/'+entry);return;}
  if(!stat.isFile()||!staticExtensions.has(path.extname(relative).toLowerCase()))return;
  files.push(relative);
 }
 for(const entry of (await fs.readdir(source,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
  if(entry.isSymbolicLink())continue;
  if(entry.isDirectory()&&directories.has(entry.name))await tree(entry.name);
  if(!entry.isFile()||denied.test(entry.name))continue;
  if(rootExtensions.has(path.extname(entry.name).toLowerCase())||rootHTML.has(entry.name)||entry.name==='DASHBOARD-README.md'||entry.name==='curriculum-manifest.json')files.push(entry.name);
 }
 for(const entry of (await fs.readdir(path.join(source,'ecosystem'),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
  if(entry.isFile()&&(ecosystemExtensions.has(path.extname(entry.name).toLowerCase())||ecosystemJSON.has(entry.name)))files.push('ecosystem/'+entry.name);
 }
 for(const name of rootHTML){
  const html=await fs.readFile(path.join(source,name),'utf8');
  assert(html.includes('let state={completed:[],notes:{},studio:window.projectCore.cleanState()}'),name+' must start with empty workbook state');
  assert(html.includes("localStorage.getItem('icm-workbook-v1')"),name+' must read learner state only at runtime');
  const match=html.match(/<script id="workbook-data" type="application\/json">([\s\S]*?)<\/script>/);
  assert(match,name+' must have canonical source data');
  const data=JSON.parse(match[1]),keys=new Set(['lessons','stages','guidedWalkthroughs','editorPageHTML','editorSetupText','research','sample','version','p5']);
  assert(Object.keys(data).every(key=>keys.has(key)),name+' contains unexpected embedded state');
 }
 return [...new Set(files)].sort();
}
async function powershell(command,extra={}){
 return run('powershell.exe',['-NoProfile','-NonInteractive','-Command',command],{windowsHide:true,env:{...process.env,...extra},maxBuffer:1024*1024});
}
async function verifyArchive(archive,manifest){
 const temp=await fs.mkdtemp(path.join(os.tmpdir(),'icm-dashboard-source-')),extracted=path.join(temp,'source');
 await powershell('Expand-Archive -LiteralPath $env:ICM_PACKAGE_ZIP -DestinationPath $env:ICM_PACKAGE_EXTRACT',{ICM_PACKAGE_ZIP:archive,ICM_PACKAGE_EXTRACT:extracted});
 const actual=[];
 async function inventory(folder){for(const entry of await fs.readdir(folder,{withFileTypes:true})){const file=path.join(folder,entry.name),relative=slash(path.relative(extracted,file));assert(!entry.isSymbolicLink(),'Archive has a link');assert(!denied.test(relative),'Denied archive name: '+relative);if(entry.isDirectory())await inventory(file);else actual.push(relative);}}
 await inventory(extracted);
 assert.deepEqual(actual.sort(),[...manifest.files.map(file=>file.path),'SOURCE-MANIFEST.json'].sort(),'ZIP inventory differs from manifest');
 for(const item of manifest.files)assert.equal(sha(await fs.readFile(path.join(extracted,item.path))),item.sha256,'Extracted bytes differ: '+item.path);
 const checks=[];
 async function node(args){
  let exit=0,result;try{result=await run(process.execPath,args,{cwd:extracted,windowsHide:true,maxBuffer:4*1024*1024});}catch(error){exit=typeof error.code==='number'?error.code:1;result=error;}
  const log=path.join(temp,'check-'+checks.length+'.log');await fs.writeFile(log,(result.stdout||'')+(result.stderr||''));checks.push({command:[process.execPath,...args],exit,log});
  if(exit!==0)throw Object.assign(Error('Extracted-source command failed: '+args.join(' ')),{checks,temporaryDirectory:temp});
 }
 await node(['ecosystem/build.cjs']);
 await node(['ecosystem/build-course.cjs']);
 const tests=[];for(const folder of ['.','ecosystem'])for(const name of (await fs.readdir(path.join(extracted,folder))).sort())if(name.endsWith('.test.cjs'))tests.push(slash(path.join(folder,name)));
 await node(['--test',...tests]);
 await node(['ecosystem/doctor.cjs']);
 const {createStudyServer}=require(path.join(extracted,'ecosystem/server.cjs')),server=createStudyServer({root:extracted});
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const origin='http://127.0.0.1:'+server.address().port,routes=[];
 try{
  for(const route of ['/api/health','/api/ready','/ecosystem/','/ecosystem/learn.html','/ecosystem/loops.html','/ecosystem/dashboard-data.json','/ecosystem/dashboard.js','/ecosystem/dashboard-art.js','/ecosystem/dashboard-core.js','/ecosystem/dashboard.css','/assets/sample.png','/vendor/p5.min.js','/Week-9-Project-Studio.html']){
   const response=await fetch(origin+route);assert.equal(response.status,200,route);const bytes=await response.arrayBuffer();routes.push({route,status:response.status,bytes:bytes.byteLength});
  }
  const health=await(await fetch(origin+'/api/health')).json();assert.equal(health.p5,'2.3.4');const readiness=await(await fetch(origin+'/api/ready')).json();assert.equal(readiness.ok,true);
 }finally{await new Promise(resolve=>server.close(resolve));}
 return {ok:true,temporaryDirectory:temp,checks,routes,scope:'Native extracted-source tests and own in-process server; browser rendering checked separately.'};
}
async function main(){
 const files=await collect();if(process.argv.includes('--list')){console.log(JSON.stringify({files},null,2));return;}
 const temp=await fs.mkdtemp(path.join(os.tmpdir(),'icm-dashboard-package-')),stage=path.join(temp,'source');await fs.mkdir(stage);
 const manifest={version:1,hashAlgorithm:'SHA-256',scope:'Public application source and pinned assets; excludes learner state.',files:[]};
 for(const relative of files){const bytes=await fs.readFile(path.join(source,relative)),destination=path.join(stage,relative);await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,bytes);manifest.files.push({path:relative,bytes:bytes.length,sha256:sha(bytes)});}
 const readme=await fs.readFile(path.join(source,'DASHBOARD-README.md'));await fs.writeFile(path.join(stage,'README.md'),readme);manifest.files.push({path:'README.md',bytes:readme.length,sha256:sha(readme)});
 const ignore=Buffer.from('workspace/\nbackups/\nevidence/\necosystem/.runtime/\nnode_modules/\n*.zip\nPACKAGE-VALIDATION.json\nprogress.txt\n');await fs.writeFile(path.join(stage,'.gitignore'),ignore);manifest.files.push({path:'.gitignore',bytes:ignore.length,sha256:sha(ignore)});
 manifest.files.sort((a,b)=>a.path.localeCompare(b.path));await fs.writeFile(path.join(stage,'SOURCE-MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
 const draft=path.join(temp,'ICM-Week-9-Dashboard-Source.zip');
 // Compress-Archive omits hidden .gitignore on some Windows versions; a normal file attribute preserves it.
 await powershell('$hiddenFile=Join-Path $env:ICM_PACKAGE_STAGE ".gitignore"; (Get-Item -LiteralPath $hiddenFile -Force).Attributes="Normal"; Compress-Archive -Path (Join-Path $env:ICM_PACKAGE_STAGE "*") -DestinationPath $env:ICM_PACKAGE_ZIP -CompressionLevel Optimal',{ICM_PACKAGE_STAGE:stage,ICM_PACKAGE_ZIP:draft});
 for(const item of manifest.files.filter(item=>files.includes(item.path)))assert.equal(sha(await fs.readFile(path.join(source,item.path))),item.sha256,'Source changed while packaging; retry: '+item.path);
 let validation={ok:null,scope:'Archive built; extracted-source verification not requested.'};
 if(process.argv.includes('--verify'))validation=await verifyArchive(draft,manifest);
 for(const item of manifest.files.filter(item=>files.includes(item.path)))assert.equal(sha(await fs.readFile(path.join(source,item.path))),item.sha256,'Source changed during verification; retry: '+item.path);
 const archive=path.join(source,'..','ICM-Week-9-Dashboard-Source.zip');await fs.copyFile(draft,archive);
 const report={archive,sha256:sha(await fs.readFile(archive)),files:manifest.files.length,...validation};await fs.writeFile(path.join(path.dirname(archive),'PACKAGE-VALIDATION.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}
if(require.main===module)main().catch(error=>{console.error(JSON.stringify({ok:false,error:error.message,checks:error.checks,temporaryDirectory:error.temporaryDirectory},null,2));process.exitCode=1;});
module.exports={collect,verifyArchive};
