(()=>{
 'use strict';
 if(!window.projectCore)return;
 if(location.protocol!=='http:'||!['127.0.0.1','localhost'].includes(location.hostname)||document.querySelector('meta[name="studio-hosting"][content="static"]')){
  const key='icm-study-session-v1',valid=s=>s&&Number.isInteger(s.stage)&&s.stage>=1&&s.stage<=7&&Number.isInteger(s.line)&&s.line>=0&&s.line<=100;
  window.studySync={ready:Promise.resolve(),getSession(){try{const s=JSON.parse(localStorage.getItem(key));if(valid(s))return {stage:s.stage,line:s.line};}catch{}return {stage:1,line:0};},setSession(s){if(valid(s))try{localStorage.setItem(key,JSON.stringify({stage:s.stage,line:s.line}));}catch{}},backupNow:async()=>({localOnly:true}),getStatus:()=> 'Saved in this browser · use Progress to move notes.'};
  return;
 }
 const C=window.projectCore,KEY='icm-workbook-v1',META='icm-backup-meta-v1',SESSION='icm-study-session-v1';
 const EMPTY={workbook:'icm-week9-v1',completed:[],notes:{},studio:C.cleanState()};
 let revision=null,baseline=EMPTY,baselineSession={stage:1,line:0},rootId='',initialized=false,pending=false,inflight=null,timer,status='Connecting local backup…';
 const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 function say(message){status=message;document.querySelectorAll('[data-study-backup]').forEach(e=>e.textContent=message);window.dispatchEvent(new CustomEvent('icm-backup-status',{detail:message}));}
 function rawLocal(){const value=JSON.parse(localStorage.getItem(KEY)||'null');if(value===null)return {completed:[],notes:{},studio:C.cleanState()};if(!value||typeof value!=='object'||Array.isArray(value)||!Array.isArray(value.completed)||!value.notes||typeof value.notes!=='object'||Array.isArray(value.notes))throw Error('Browser progress needs recovery.');return value;}
 function canonical(value){const sorted=m=>Object.fromEntries(Object.entries(m||{}).sort(([a],[b])=>a.localeCompare(b))),s=C.cleanState(value.studio);return {workbook:'icm-week9-v1',completed:[...new Set(value.completed||[])].sort(),notes:sorted(value.notes),studio:{...s,completed:s.completed.sort(),notes:sorted(s.notes),walkthrough:sorted(s.walkthrough)}};}
 function session(){try{const s=JSON.parse(localStorage.getItem(SESSION)||'null');if(s&&Number.isInteger(s.stage)&&s.stage>=1&&s.stage<=7&&Number.isInteger(s.line)&&s.line>=0&&s.line<=100)return s;}catch{}return {stage:1,line:0};}
 function remember(){localStorage.setItem(META,JSON.stringify({rootId,revision,baseline,session:baselineSession}));}
 function writeMerged(remote,base){const local=rawLocal(),merged=C.mergeProgress(base,canonical(local),remote);localStorage.setItem(KEY,JSON.stringify({...local,...merged,workbook:'icm-week9-v1'}));window.dispatchEvent(new Event('icm-progress-restored'));return canonical(merged);}
 async function request(url,options){return fetch(url,{cache:'no-store',signal:AbortSignal.timeout(5000),...options});}
 async function connect(){
  const [h,p]=await Promise.all([request('/api/health'),request('/api/progress')]);if(!h.ok||!p.ok)throw Error('Local backup is unavailable.');const health=await h.json(),result=await p.json();if(health.app!=='icm-week9-study'||health.protocol!==2)throw Error('Restart the study launcher.');rootId=health.rootId;
  let meta;try{meta=JSON.parse(localStorage.getItem(META)||'null');}catch{}
  const base=meta?.rootId===rootId&&meta.baseline?canonical(meta.baseline):EMPTY;
  if(result.exists){const backup=result.backup,prior=session();writeMerged(canonical(backup.progress),base);revision=backup.revision;baseline=canonical(backup.progress);baselineSession=backup.session;if(!meta||equal(prior,meta.session))localStorage.setItem(SESSION,JSON.stringify(backup.session));}
  else{rawLocal();revision=null;baseline=EMPTY;baselineSession=session();}
  remember();initialized=true;say('Autosave ready · on this computer');schedule();
 }
 function schedule(){pending=true;say('Backing up…');clearTimeout(timer);timer=setTimeout(()=>backupNow(),650);}
 async function backupNow(){
  clearTimeout(timer);if(inflight){pending=true;return inflight;}
  pending=false;inflight=(async()=>{
   try{
    if(!initialized)await connect();
    for(let attempt=0;attempt<4;attempt++){
     const progress=canonical(rawLocal()),position=session();say('Backing up…');
     const bodyText=JSON.stringify({revision,progress,session:position}),keepalive=document.visibilityState==='hidden'&&new TextEncoder().encode(bodyText).length<60000;
     const response=await request('/api/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:bodyText,keepalive});
     const body=await response.json().catch(()=>({}));
     if(response.status===409&&body.current){const oldSession=baselineSession;writeMerged(canonical(body.current.progress),baseline);revision=body.current.revision;baseline=canonical(body.current.progress);baselineSession=body.current.session;if(equal(session(),oldSession))localStorage.setItem(SESSION,JSON.stringify(body.current.session));remember();continue;}
     if(!response.ok)throw Error(body.error||'Local backup did not finish.');
     revision=body.revision;baseline=canonical(body.progress);baselineSession=body.session;remember();
     if(!equal(canonical(rawLocal()),baseline)||!equal(session(),baselineSession)){pending=true;say('Backing up…');}else say('Backed up · on this computer');
     return body;
    }
    throw Error('Another study window is saving. Try Backup now again.');
   }catch(error){say('Backup paused · copy notes to keep them');return {error:error.message};}
  })();
  const result=await inflight;inflight=null;if(pending)schedule();return result;
 }
 function setSession(value){if(!value||!Number.isInteger(value.stage)||value.stage<1||value.stage>7||!Number.isInteger(value.line)||value.line<0||value.line>100)return;try{if(!equal(session(),value)){localStorage.setItem(SESSION,JSON.stringify(value));schedule();}}catch{say('Backup paused · copy notes to keep them');}}
 window.studySync={ready:Promise.resolve(),getSession:session,setSession,backupNow,getStatus:()=>status};
 window.addEventListener('icm-progress-change',schedule);
 window.addEventListener('storage',event=>{if([KEY,SESSION].includes(event.key))schedule();});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')backupNow();});
 window.studySync.ready=connect().catch(()=>{say('Backup paused · copy notes to keep them');});
 document.addEventListener('DOMContentLoaded',()=>say(status));
})();
