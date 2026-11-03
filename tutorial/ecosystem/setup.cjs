'use strict';
const fs=require('node:fs/promises'),nativeFs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFile}=require('node:child_process'),{promisify}=require('node:util');
const run=promisify(execFile),defaultRoot=path.resolve(__dirname,'..');
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function within(root,file){const rel=path.relative(root,file);return rel!== '..'&&!rel.startsWith('..'+path.sep)&&!path.isAbsolute(rel);}
async function safeDirectory(root,relative){let current=root;for(const name of relative.split('/').filter(Boolean)){current=path.join(current,name);if(!within(root,current))throw Error('Directory outside study workspace.');let stat;try{stat=await fs.lstat(current);}catch(e){if(e.code!=='ENOENT')throw e;try{await fs.mkdir(current);}catch(m){if(m.code!=='EEXIST')throw m;}stat=await fs.lstat(current);}if(stat.isSymbolicLink())throw Error('Refusing backup directory link: '+relative);if(!stat.isDirectory())throw Error('Backup directory is not a directory: '+relative);if(!within(root,await fs.realpath(current)))throw Error('Backup directory resolves outside workspace.');}return current;}
async function backupWorkspace({root=defaultRoot}={}){
 root=await fs.realpath(root);const entries=[],skipped=[];
 async function collect(relative){
  const file=path.join(root,relative);if(!within(root,file))throw Error('Source outside workspace.');
  let stat;try{stat=await fs.lstat(file);}catch(e){if(e.code==='ENOENT')return;throw e;}
  if(stat.isSymbolicLink()){skipped.push({path:relative,reason:'Symbolic link skipped.'});return;}
  if(!within(root,await fs.realpath(file))){skipped.push({path:relative,reason:'Resolved path outside workspace.'});return;}
  if(stat.isDirectory()){for(const name of (await fs.readdir(file)).sort())await collect(relative+'/'+name);return;}
  if(!stat.isFile()){skipped.push({path:relative,reason:'Not a regular file.'});return;}
  const bytes=await fs.readFile(file),after=await fs.stat(file);if(stat.size!==after.size||stat.mtimeMs!==after.mtimeMs){skipped.push({path:relative,reason:'File changed during backup; retry after saving.'});return;}
  entries.push({relative,bytes,hash:digest(bytes)});
 }
 // Refuse linked source parents rather than following junctions into other folders.
 let workspace;try{workspace=await fs.lstat(path.join(root,'workspace'));}catch(e){if(e.code!=='ENOENT')throw e;}
 if(workspace?.isSymbolicLink())skipped.push({path:'workspace',reason:'Symbolic link skipped.'});
 else for(const name of ['my-project','journal','versions'])await collect('workspace/'+name);
 const progressRelative='backups/progress/current.json';
 try{
  let linked=false;for(const part of ['backups','backups/progress',progressRelative]){const stat=await fs.lstat(path.join(root,part));if(stat.isSymbolicLink()){linked=true;break;}}
  if(linked)skipped.push({path:progressRelative,reason:'Symbolic link skipped.'});
  else{
   const file=path.join(root,progressRelative),stat=await fs.stat(file);if(!within(root,await fs.realpath(file))||stat.size>2*1024*1024)throw Error('Invalid progress envelope.');
   const bytes=await fs.readFile(file),d=JSON.parse(bytes.toString('utf8'));
   if(!/^[a-f0-9-]{36}$/.test(d.revision||'')||!Number.isFinite(Date.parse(d.updatedAt))||!/^[a-f0-9]{64}$/i.test(d.hash)||d.progress?.workbook!=='icm-week9-v1'||!Array.isArray(d.progress.completed)||!d.progress.notes||typeof d.progress.notes!=='object'||Array.isArray(d.progress.notes)||!d.progress.studio||!Number.isInteger(d.session?.stage)||d.session.stage<1||d.session.stage>7||!Number.isInteger(d.session?.line)||d.session.line<0||d.session.line>100)throw Error('Invalid progress envelope.');
   const validator=path.join(__dirname,'progress-store.cjs');if(nativeFs.existsSync(validator)){const p=require(validator),progress=p.normalizeProgress(d.progress),session=p.normalizeSession(d.session);if(d.hash!==digest(JSON.stringify({progress,session})))throw Error('Invalid progress checksum.');}
   entries.push({relative:progressRelative,bytes,hash:digest(bytes)});
  }
 }catch(e){if(e.code!=='ENOENT')skipped.push({path:progressRelative,reason:'Invalid or unreadable progress envelope; original left unchanged.'});}
 entries.sort((a,b)=>a.relative.localeCompare(b.relative));const hash=digest(JSON.stringify(entries.map(e=>[e.relative,e.hash,e.bytes.length])));
 if(!entries.length)return {created:false,path:null,files:0,skipped,hash};
 const sessions=await safeDirectory(root,'backups/sessions'),runtime=await safeDirectory(root,'ecosystem/.runtime'),cacheFile=path.join(runtime,'source-backup.json');
 try{
  const cacheStat=await fs.lstat(cacheFile);if(cacheStat.isSymbolicLink())throw Error('Runtime backup index is a symbolic link.');const prior=JSON.parse(await fs.readFile(cacheFile,'utf8'));let intact=prior.hash===hash&&typeof prior.path==='string'&&within(sessions,path.resolve(prior.path))&&path.resolve(prior.path)!==sessions;
  if(intact){const priorStat=await fs.lstat(prior.path);intact=priorStat.isDirectory()&&!priorStat.isSymbolicLink()&&within(sessions,await fs.realpath(prior.path));}
  if(intact)for(const e of entries){const file=path.join(prior.path,e.relative),real=await fs.realpath(file);if(!within(prior.path,real)||digest(await fs.readFile(file))!==e.hash){intact=false;break;}}
  if(intact)return {created:false,path:prior.path,files:entries.length,skipped,hash};
 }catch(e){if(!['ENOENT','ENOTDIR'].includes(e.code)&&!(e instanceof SyntaxError))skipped.push({path:'ecosystem/.runtime/source-backup.json',reason:'Previous backup could not be verified; creating a new snapshot.'});}
 const name=new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomUUID(),destination=path.join(sessions,name);await fs.mkdir(destination);
 for(const entry of entries){const folder=path.posix.dirname(entry.relative);await safeDirectory(destination,folder);const dest=path.join(destination,entry.relative);if(!within(destination,dest))throw Error('Invalid snapshot path.');await fs.writeFile(dest,entry.bytes,{flag:'wx'});}
 const manifest={version:1,createdAt:new Date().toISOString(),scope:'Saved local workspace files and a validated local progress envelope; excludes unsaved online p5 work.',hash,files:entries.map(e=>({path:e.relative,bytes:e.bytes.length,sha256:e.hash})),skipped};
 await fs.writeFile(path.join(destination,'manifest.json'),JSON.stringify(manifest,null,2),{flag:'wx'});
 const temp=path.join(runtime,'source-backup-'+crypto.randomUUID()+'.tmp');await fs.writeFile(temp,JSON.stringify({hash,path:destination,files:entries.length},null,2),{flag:'wx'});await fs.rename(temp,cacheFile);
 return {created:true,path:destination,files:entries.length,skipped,hash};
}
async function setup({noOpen=false,checkOnly=false}={}){
 const doctor=require('./doctor.cjs');
 if(checkOnly){const inspection=await doctor.inspect(defaultRoot);return {ok:inspection.ok,checkOnly:true,inspection,scope:'File, hash and syntax checks; browser rendering is checked separately.'};}
 const backup=await backupWorkspace({root:defaultRoot});
 const realRoot=await fs.realpath(defaultRoot);for(const relative of ['ecosystem','workspace/my-project','workspace/journal','workspace/versions',...Array.from({length:7},(_,i)=>'workspace/stage-'+String(i+1).padStart(2,'0'))])await safeDirectory(realRoot,relative);
 for(const name of ['study-map.json','course-data.json','course-core.js']){try{if((await fs.lstat(path.join(realRoot,'ecosystem',name))).isSymbolicLink())throw Error('Refusing generated-file link: '+name);}catch(e){if(e.code!=='ENOENT')throw e;}}
 const workspace=require('./build.cjs').setupWorkspace({base:defaultRoot});
 const generated=await run(process.execPath,[path.join(__dirname,'build-course.cjs')],{cwd:defaultRoot,windowsHide:true,maxBuffer:512*1024});
 const inspection=await doctor.inspect(defaultRoot);if(!inspection.ok){const e=Error('Study checks failed: '+inspection.checks.filter(c=>!c.ok).map(c=>c.name+': '+c.detail).join('; '));e.report=inspection;throw e;}
 const launch=require('./launch.cjs'),service=await launch.start(),origin=service.origin||new URL(service.url).origin,resumeUrl=origin+'/ecosystem/learn.html?view=lines';
 if(!noOpen)await launch.openHome(resumeUrl);
 return {ok:true,resumeUrl,backup,workspace:{created:workspace.created.length,preserved:workspace.preserved.length},generated:generated.stdout.trim(),inspection,service,scope:'Session-start backups protect saved local files. Save online p5 work through its normal editor.'};
}
if(require.main===module)setup({noOpen:process.argv.includes('--no-open'),checkOnly:process.argv.includes('--check-only')}).then(result=>{console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=1;}).catch(e=>{console.error(JSON.stringify({ok:false,error:e.message,inspection:e.report},null,2));process.exitCode=1;});
module.exports={backupWorkspace,setup};
