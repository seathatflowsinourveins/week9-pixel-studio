'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const PIN='bb8b82b97fcbcd5bb2d5475d1b6a3904f3ab4ed01b821134fd8f1e7710fce559';
async function inspect(root=path.resolve(__dirname,'..')){
 const checks=[],add=(name,ok,detail)=>checks.push({name,ok,detail});
 let realRoot;try{realRoot=await fs.realpath(root);}catch(e){return {ok:false,node:process.version,p5:'2.3.4',checks:[{name:'Study folder',ok:false,detail:e.message}]};}
 async function read(relative){const file=await fs.realpath(path.join(realRoot,relative)),rel=path.relative(realRoot,file);if(rel==='..'||rel.startsWith('..'+path.sep)||path.isAbsolute(rel))throw Error('File resolves outside the study folder: '+relative);return fs.readFile(file);}
 add('Installed Node runtime',Number(process.versions.node.split('.')[0])>=18&&typeof fetch==='function',process.version+'; uses installed Node and its standard libraries.');
 try{const hash=crypto.createHash('sha256').update(await read('vendor/p5.min.js')).digest('hex');add('Pinned p5 bytes',hash===PIN,'p5 2.3.4 SHA256 '+hash);}catch(e){add('Pinned p5 bytes',false,e.message);}
 for(const relative of ['ecosystem/learn.html','ecosystem/learn.css','ecosystem/learn.js','ecosystem/course-runtime.js','ecosystem/course-core.js','ecosystem/course-data.json','ecosystem/study-sync.js','ecosystem/progress-store.cjs','editor-starter/index.html','project-core.cjs','Week-9-Project-Studio.html']){
  try{const bytes=await read(relative);if(!bytes.length)throw Error('Empty file');add('Required file: '+relative,true,bytes.length+' bytes available.');}catch(e){add('Required file: '+relative,false,e.message);}
 }
 try{const d=JSON.parse((await read('ecosystem/course-data.json')).toString('utf8'));const count=d.stages?.reduce((n,s)=>n+s.actions.length,0);add('Course structure',d.p5==='2.3.4'&&d.stages?.length===7&&count===47,'Seven stages and 47 ordered actions expected; found '+d.stages?.length+' stages and '+count+' actions.');}catch(e){add('Course structure',false,e.message);}
 try{const a=await read('ecosystem/course-core.js'),b=await read('project-core.cjs');add('Generated code matches its source',a.equals(b),'The browser code generator must match project-core.cjs.');}catch(e){add('Generated code matches its source',false,e.message);}
 try{const b=await read('assets/sample.png');const valid=b.length>=24&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))&&b.readUInt32BE(16)===320&&b.readUInt32BE(20)===240;add('Supplied source image',valid,'Expected PNG source dimensions: 320 × 240.');}catch(e){add('Supplied source image',false,e.message);}
 for(let n=1;n<=7;n++){
  const folder='workspace/stage-'+String(n).padStart(2,'0');
  try{const code=(await read(folder+'/sketch.js')).toString('utf8');new Function(code);await read(folder+'/index.html');await read(folder+'/sample.png');add('Stage '+n+' reference',true,'Files exist and JavaScript parses; this is not a browser rendering test.');}catch(e){add('Stage '+n+' reference',false,e.message);}
 }
 return {ok:checks.every(c=>c.ok),node:process.version,p5:'2.3.4',checks};
}
if(require.main===module)inspect().then(result=>{console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=1;}).catch(e=>{console.error(e.message);process.exitCode=1;});
module.exports={inspect};
