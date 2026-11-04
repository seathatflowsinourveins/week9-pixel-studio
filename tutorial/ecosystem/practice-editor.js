(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.practiceEditor=factory();})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const KEY='icm-practice-drafts-v1',validID=/^(stage-[1-7]|loops-row|loops-grid)$/;
 function mount({container,storage,runtime,onLine}){
  const doc=container.ownerDocument,view=doc.defaultView;
  let records=Object.create(null),writable=true,lesson=null,token='',sequence=0,line=0,failed=false,runSource='';
  function readRecords(){const result=Object.create(null),raw=storage?.getItem(KEY);if(raw){const saved=JSON.parse(raw);if(saved?.version!==1||!saved.drafts||typeof saved.drafts!=='object'||Array.isArray(saved.drafts))throw Error('Unknown draft format');for(const [id,draft] of Object.entries(saved.drafts)){if(validID.test(id)&&typeof draft?.code==='string'&&typeof draft.base==='string'&&draft.code.length<=200000&&draft.base.length<=200000){result[id]={code:draft.code,base:draft.base};if(typeof draft.previous?.code==='string'&&typeof draft.previous.base==='string'&&draft.previous.code.length<=200000&&draft.previous.base.length<=200000)result[id].previous={...draft.previous};}}}return result;}
  try{records=readRecords();}catch{writable=false;}
  function node(tag,className,text){const n=doc.createElement(tag);n.className=className;if(text)n.textContent=text;return n;}
  function button(className,text,handler){const b=node('button',className,text);b.type='button';b.addEventListener('click',handler);return b;}
  const root=node('section','practice-editor');root.setAttribute('aria-label','Automatic p5 practice');
  const top=node('div','practice-top'),title=node('strong','practice-title','p5 practice'),badge=node('span','practice-badge','FOLLOWS YOUR PHASE');top.append(title,badge);
  const hint=node('p','practice-hint','Phase code runs automatically. Edit → Run.');
  const toolbar=node('div','practice-toolbar'),runButton=button('practice-run','▶ Run',run),use=button('practice-use-guide','Use lesson code',useLesson),undo=button('practice-undo','Undo',undoLesson);undo.disabled=true;undo.title='Undo the last lesson code replacement';
  const tools=node('details','practice-tools'),toolsLabel=node('summary','practice-tools-label','Tools'),toolList=node('div','practice-tool-list');toolList.append(use,undo,button('practice-copy','Copy my code',copy),button('practice-download','Download',download));tools.append(toolsLabel,toolList);toolbar.append(runButton,tools);
  const save=node('p','practice-save');save.setAttribute('role','status');
  const focused=node('div','practice-line'),lineTitle=node('span','practice-line-title'),lineCode=node('code','practice-line-code'),meaning=node('p','practice-line-meaning');focused.append(lineTitle,lineCode,meaning);
  const draftNote=node('p','practice-draft-note');
  const codeArea=node('div','practice-source'),gutter=node('div','practice-gutter'),input=node('textarea','practice-code');gutter.setAttribute('aria-hidden','true');input.setAttribute('aria-label','Editable p5 practice code');input.spellcheck=false;input.wrap='off';input.autocapitalize='off';input.autocomplete='off';input.maxLength=200000;codeArea.append(gutter,input);
  const outputLabel=node('p','practice-output-label','Your sketch · latest Run'),output=node('div','practice-output'),frame=node('iframe','practice-preview');frame.title='Your running p5 practice';frame.setAttribute('sandbox','allow-scripts allow-same-origin');output.append(frame);
  const status=node('p','practice-state');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  root.append(top,hint,toolbar,save,focused,draftNote,codeArea,outputLabel,output,status);container.appendChild(root);
  function persist(){if(writable){try{if(!storage)throw Error('No storage');const latest=readRecords();latest[lesson.id]=records[lesson.id];storage.setItem(KEY,JSON.stringify({version:1,drafts:latest}));records=latest;}catch{writable=false;}}saveStatus();}
  function saveStatus(){save.textContent=writable?'Edits save on this device · account saving is separate.':'Draft storage unavailable or unreadable. Download a backup before leaving.';}
  function draft(){return lesson?records[lesson.id]:null;}
  function renderLines(){if(!lesson)return;const matching=input.value===lesson.code;gutter.replaceChildren(...input.value.split('\n').map((_,i)=>{const n=node('span','',String(i+1));if(matching&&i===line)n.setAttribute('aria-current','true');return n;}));gutter.scrollTop=input.scrollTop;draftNote.textContent=matching?'':'Your draft differs from the guide. It is kept here. Open Tools → Use lesson code to follow the example again.';undo.disabled=!draft()?.previous;}
  function setLine(index,text){if(!lesson)return;const lines=lesson.code.split('\n');line=Math.max(0,Math.min(Number(index)||0,lines.length-1));lineTitle.textContent='GUIDE LINE '+(line+1)+' / '+lines.length;lineCode.textContent=lines[line];meaning.textContent=text||'';renderLines();if(input.value===lesson.code&&doc.activeElement!==input){input.scrollTop=Math.max(0,line*24-60);gutter.scrollTop=input.scrollTop;}}
  function setLesson(next){if(!next||!validID.test(next.id)||typeof next.code!=='string')throw TypeError('Expected a course phase and its code.');const changed=!lesson||lesson.id!==next.id||lesson.code!==next.code;if(writable&&(!lesson||lesson.id!==next.id)){try{records=readRecords();}catch{writable=false;}}lesson={...next};let saved=records[next.id];if(!saved){saved=records[next.id]={code:next.code,base:next.code};}else if(saved.code===saved.base){saved.code=next.code;saved.base=next.code;}title.textContent=next.title;if(changed)input.value=saved.code;setLine(next.line,next.meaning);saveStatus();if(changed)run();}
  function remember(){if(!lesson)return;draft().code=input.value;persist();renderLines();}
  function run(){if(!lesson)return;token='practice-'+Date.now()+'-'+(++sequence);runSource=input.value;outputLabel.textContent=/^stage-[5-7]$/.test(lesson.id)&&input.value===lesson.code?'Your sketch · real-time run':'Your sketch · latest Run';failed=false;status.classList.remove('error');status.textContent='Starting p5…';frame.srcdoc=runtime.practiceFrameHTML({code:runSource,token});}
  function useLesson(){if(!lesson)return;const current=draft();if(input.value!==lesson.code)current.previous={code:input.value,base:current.base};current.code=lesson.code;current.base=lesson.code;input.value=lesson.code;renderLines();persist();run();}
  function undoLesson(){const current=draft();if(!current?.previous)return;const old={code:input.value,base:current.base};current.code=current.previous.code;current.base=current.previous.base;current.previous=old;input.value=current.code;renderLines();persist();run();}
  async function copy(){try{await view.navigator.clipboard.writeText(input.value);save.textContent='Your practice code copied. Paste into sketch.js in your duplicated p5 account sketch.';}catch{input.focus();input.select?.();save.textContent='Select and copy this practice code, or use Download.';}}
  function download(){const blob=new Blob([input.value+'\n'],{type:'text/javascript;charset=utf-8'}),url=URL.createObjectURL(blob),a=node('a','');a.href=url;a.download='sketch.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);save.textContent='Downloaded sketch.js. Keep sample.png with it when moving to p5.';}
  input.addEventListener('input',()=>{remember();status.textContent='Code changed · press Run to see your edit.';});
  input.addEventListener('scroll',()=>{gutter.scrollTop=input.scrollTop;});
  function chooseLine(){if(lesson&&input.value===lesson.code&&typeof onLine==='function')onLine(input.value.slice(0,input.selectionStart).split('\n').length-1);}
  input.addEventListener('click',chooseLine);input.addEventListener('keyup',chooseLine);
  view.addEventListener('message',event=>{if(event.source!==frame.contentWindow||event.origin!==view.location.origin||event.data?.token!==token)return;const data=event.data;if(data.kind==='practice-error'){failed=true;status.classList.add('error');status.textContent=input.value!==runSource?'Last run: '+String(data.message)+' · Code changed; press Run.':'p5: '+String(data.message)+' · Fix the line, then Run again.';}if(data.kind==='practice-ready'&&!failed){status.classList.remove('error');status.textContent=input.value!==runSource?'Preview shows the last run · code changed, press Run.':'p5 '+data.version+' running · '+data.width+' × '+data.height+' canvas';}});
  return {setLesson,setLine,getCode:()=>input.value,frame};
 }
 return {mount};
});
