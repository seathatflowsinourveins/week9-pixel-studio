'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const repository=path.resolve(__dirname,'..'),source=path.join(repository,'tutorial');
const browserFiles=['account-project.js','assignment-core.js','assignment-panel.js','assignment-panel.css','pixel-flow-core.js','pixel-flow.js','pixel-flow.css','index.html','learn.html','learn.css','learn.js','loops.html','loops.css','loops.js','loops-core.js','editor-frame.js','editor-view.css','practice-editor.js','practice-editor.css','course-core.js','course-runtime.js','course-data.json','study-sync.js','dashboard-core.js','dashboard-art.js','dashboard.js','dashboard.css','dashboard-data.json','progress-transfer-core.js','progress-transfer.js','progress-transfer.css'];
const rootFiles=['Week-9-Project-Studio.html','ICM-Week-9-Workbook.html','YOUR-FIRST-SESSION.txt','SIDE-BY-SIDE-WALKTHROUGH.txt','EDITOR-SETUP.txt','START-HERE.txt'];
function canonicalText(text){return String(text).replace(/\r\n?/g,'\n');}
function bundleFingerprint(records){
 const sources=records.map(({name,text})=>[name,canonicalText(text)]).sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);
 return crypto.createHash('sha256').update(JSON.stringify(sources)).digest('hex').slice(0,16);
}
async function buildPages({destination=path.join(repository,'dist')}={}){
 const out=path.resolve(destination);if(out===repository||out===source||!path.relative(out,repository).startsWith('..'))throw Error('Build destination must not contain source.');
 try{const real=await fs.realpath(out);if(real.toLowerCase()!==out.toLowerCase())throw Error('Refusing a linked build destination.');const marker=await fs.readFile(path.join(out,'.pixel-studio-build'),'utf8');if(marker!=='pixel-studio-static-v1')throw Error('Destination is not a Pixel Studio build.');await fs.rm(out,{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;const entries=await fs.readdir(out).catch(()=>[]);if(entries.length)throw Error('Choose an empty build destination.');}
 await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'.pixel-studio-build'),'pixel-studio-static-v1');
 const files=[];
 async function write(relative,bytes){const target=path.resolve(out,relative);if(!target.startsWith(out+path.sep))throw Error('Build path escaped destination.');await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,bytes);files.push({path:relative,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});}
 async function readPublic(relative,from=source){const file=path.join(from,relative),stat=await fs.lstat(file);if(!stat.isFile()||stat.isSymbolicLink())throw Error('Expected regular public asset: '+relative);return fs.readFile(file);}
 async function copy(relative,from=source){await write(relative,await readPublic(relative,from));}
 const browserSources=await Promise.all(browserFiles.map(async name=>({name,text:canonicalText(await readPublic('ecosystem/'+name))}))),version=bundleFingerprint(browserSources);
 for(const {name,text} of browserSources){
  let stamped=text;
  if(name.endsWith('.html'))stamped=stamped.replace('<head>','<head>\n<meta name="studio-hosting" content="static">').replace(/\b(href|src)(\s*=\s*)(["'])(\.\/([^"'/?#]+\.(?:js|css)))\3/g,(match,attribute,equals,quote,url,asset)=>browserFiles.includes(asset)?attribute+equals+quote+url+'?v='+version+quote:match);
  if(name.endsWith('.js'))stamped=stamped.replace(/(["'])(\.\/(?:course|dashboard)-data\.json)\1/g,(_,quote,url)=>quote+url+'?v='+version+quote);
  await write('ecosystem/'+name,Buffer.from(stamped));
 }
 for(const name of rootFiles)await copy(name);
 for(const name of ['sample.png','sample.svg'])await copy('assets/'+name);
 for(const name of ['p5.min.js','p5-LICENSE.txt'])await copy('vendor/'+name);
 for(const name of ['observations.csv','iterations.csv','partner-log.csv','blog-outline.txt'])await copy('templates/'+name);
 const temporary=await fs.mkdtemp(path.join(os.tmpdir(),'pixel-pages-build-'));
 try{
  require('../tutorial/ecosystem/build.cjs').setupWorkspace({base:temporary});
  for(let stage=1;stage<=7;stage++)for(const name of ['index.html','index.web-editor.html','sketch.js','sample.png','explain.html','LEARNING-LINKS.txt'])await copy('workspace/stage-0'+stage+'/'+name,temporary);
 }finally{const real=await fs.realpath(temporary),parent=await fs.realpath(os.tmpdir());if(path.dirname(real).toLowerCase()!==parent.toLowerCase()||!path.basename(real).startsWith('pixel-pages-build-'))throw Error('Unexpected temporary path.');await fs.rm(real,{recursive:true,force:true});}
 await write('index.html',Buffer.from('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>Week 9 Pixel Studio</title><meta http-equiv="refresh" content="0;url=./ecosystem/"><style>body{background:#111518;color:#f0f1e8;font:18px/1.6 system-ui;padding:8vw}a{color:#d0efa0}</style></head><body><h1>Week 9 Pixel Studio</h1><p><a href="./ecosystem/">Open your illustrated learning dashboard →</a></p></body></html>'));
 const dashboard=JSON.parse(await fs.readFile(path.join(out,'ecosystem/dashboard-data.json'),'utf8'));
 const manifest={name:'Week 9 Pixel Studio',version,p5:'2.3.4',stages:dashboard.stages.map(s=>({number:s.number,title:s.title,url:'ecosystem/learn.html?view=editor#stage-'+s.number})),foundations:dashboard.foundations.length,privacy:'No learner workspace, notes or backup data included.',files:files.sort((a,b)=>a.path.localeCompare(b.path))};
 await fs.writeFile(path.join(out,'site-manifest.json'),JSON.stringify(manifest,null,2)+'\n');return manifest;
}
if(require.main===module)buildPages().then(m=>console.log(JSON.stringify({directory:path.join(repository,'dist'),files:m.files.length,stages:m.stages.length,foundations:m.foundations}))).catch(e=>{console.error(e.message);process.exitCode=1;});
module.exports={buildPages,bundleFingerprint};
