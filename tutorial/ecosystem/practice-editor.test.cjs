const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const file=path.join(__dirname,'practice-editor.js');
const practice=fs.existsSync(file)?require(file):{};
class Node {
 constructor(tag,doc){this.tagName=tag;this.ownerDocument=doc;this.children=[];this.attributes={};this.listeners={};this.style={};this.scrollTop=0;this.clientHeight=150;this.offsetHeight=150;this.selectionStart=this.selectionEnd=0;this.value='';this.contentWindow={};this.srcWrites=[];this.classList={add(){},remove(){},toggle(){}};}
 setSelectionRange(start,end,direction='none'){this.selectionStart=start;this.selectionEnd=end;this.selectionDirection=direction;}
 appendChild(n){this.children.push(n);n.parentNode=this;return n;} append(...nodes){nodes.forEach(n=>this.appendChild(n));} replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);} getAttribute(k){return this.attributes[k]??null;}
 addEventListener(k,fn){(this.listeners[k]??=[]).push(fn);} fire(k,event={}){return Promise.all((this.listeners[k]||[]).map(fn=>fn(event)));} click(){return this.fire('click');} focus(){this.ownerDocument.activeElement=this;}
 set srcdoc(v){this._srcdoc=v;this.srcWrites.push(v);} get srcdoc(){return this._srcdoc;}
}
function find(node,name){if((node.className||'').split(' ').includes(name))return node;for(const child of node.children){const match=find(child,name);if(match)return match;}}
function setup(raw,shared,followLine){
 const memory=shared||new Map(raw?[['icm-practice-drafts-v1',raw]]:[]),listeners={},copied=[],selected=[],writes=[];
 const doc={activeElement:null,createElement:tag=>new Node(tag,doc)};
 doc.defaultView={getComputedStyle:()=>({lineHeight:'29px',paddingTop:'7px',paddingBottom:'7px'}),location:{origin:'https://course.test'},navigator:{clipboard:{writeText:async code=>copied.push(code)}},addEventListener:(kind,fn)=>{listeners[kind]=fn;}};
 const container=new Node('aside',doc);
 const storage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>{writes.push(key);memory.set(key,value);}};
 const editor=practice.mount({container,storage,runtime:{practiceFrameHTML:args=>JSON.stringify(args)},onLine:line=>{selected.push(line);followLine?.(line,editor);}});
 return {container,editor,memory,writes,listeners,copied,selected,el:name=>find(container,name),send(data,source){listeners.message({origin:'https://course.test',source:source||find(container,'practice-preview').contentWindow,data});}};
}
const one={id:'stage-1',title:'Stage 1 · Image',code:'let picture;\nasync function setup() {}',line:0,meaning:'Name the image.'};
const two={id:'stage-3',title:'Stage 3 · RGBA',code:'const tile = 16;\nconst r = picture.pixels[i];',line:1,meaning:'Read red.'};

const rowLesson={...one,code:'// 🌱\n\n  draw();\nnext();\nlast();',meaning:'Start here.'};

test('choosing a guide row parks the caret at its first character without taking focus, saving or rerunning',()=>{
 const s=setup();s.editor.setLesson(rowLesson);
 const input=s.el('practice-code'),control=s.el('practice-run');control.focus();
 input.setSelectionRange(1,3);
 s.editor.setLine(2,'Draw the frame.');
 assert.equal(input.selectionStart,7,'typing should begin at the first space on line 3');assert.equal(input.selectionEnd,7);
 assert.equal(input.ownerDocument.activeElement,control);
 assert.equal(s.el('practice-line-code').textContent,'  draw();');
 assert.equal(s.el('practice-line-meaning').textContent,'Draw the frame.');
 assert.equal(s.el('practice-gutter').children[2].getAttribute('aria-current'),'true');
 assert.equal(s.editor.frame.srcWrites.length,1);assert.deepEqual(s.writes,[]);
});

test('the current row is highlighted at the measured text position after manual scroll',async()=>{
 const s=setup();s.editor.setLesson(rowLesson);s.editor.setLine(2,'Draw the frame.');
 const row=s.el('practice-current-row'),input=s.el('practice-code');
 assert.ok(row,'the current line needs a highlight inside the editable source');
 assert.equal(row.hidden,false);assert.equal(row.style.height,'29px');
 input.scrollTop=19;await input.fire('scroll');
 assert.equal(row.style.top,'46px','third row: 7px top padding + two 29px lines − 19px scroll');
 assert.equal(s.el('practice-gutter').scrollTop,19);
 input.clientHeight=70;s.editor.setLine(4,'Finish the frame.');
 assert.ok(input.scrollTop>19,'a guide row below the viewport should scroll into view');
 assert.ok(parseFloat(row.style.top)>=0&&parseFloat(row.style.top)+29<=input.clientHeight);
 assert.equal(s.editor.frame.srcWrites.length,1);assert.deepEqual(s.writes,[]);
});

test('guide navigation from the end of a long line reveals the start of the next short line',()=>{
 const s=setup(),longLine='  // '+ 'draw one square '.repeat(12);
 s.editor.setLesson({...rowLesson,code:longLine+'\n}'});
 const input=s.el('practice-code');input.focus();input.setSelectionRange(longLine.length,longLine.length);
 input.scrollLeft=505.7;s.el('practice-run').focus();
 s.editor.setLine(1,'Close the block.');
 assert.equal(input.value[input.selectionStart],'}');
 assert.equal(input.scrollLeft,0,'the selected closing brace must be visible');
});

test('textarea click and key navigation keep the active selection and scroll when the guide responds',async()=>{
 const s=setup(undefined,undefined,(line,editor)=>editor.setLine(line,'Follow this row.'));
 s.editor.setLesson(rowLesson);const input=s.el('practice-code');input.focus();input.scrollTop=16;input.scrollLeft=36;
 for(const [event,start,end,direction,line] of [['click',9,9,'none',2],['keyup',17,20,'backward',3],['keyup',9,20,'forward',3],['keyup',9,20,'backward',2]]){
  input.setSelectionRange(start,end,direction);await input.fire(event);
  assert.equal(s.selected.at(-1),line);assert.equal(input.ownerDocument.activeElement,input);
  assert.deepEqual([input.selectionStart,input.selectionEnd,input.selectionDirection],[start,end,direction]);
  assert.equal(input.scrollTop,16);assert.equal(input.scrollLeft,36);assert.equal(s.el('practice-gutter').children[line].getAttribute('aria-current'),'true');
 }
 assert.equal(s.editor.frame.srcWrites.length,1);assert.deepEqual(s.writes,[]);
});

test('a differing draft retains its selection and scroll without a guide-row highlight',async()=>{
 const s=setup();s.editor.setLesson(rowLesson);const input=s.el('practice-code');
 input.value='// my note\n'+input.value;await input.fire('input');
 input.setSelectionRange(2,8,'backward');input.scrollTop=20;input.scrollLeft=41;s.el('practice-run').focus();
 s.editor.setLine(3,'Go to the next frame.');
 assert.deepEqual([input.selectionStart,input.selectionEnd,input.selectionDirection,input.scrollTop],[2,8,'backward',20]);
 assert.equal(input.scrollLeft,41);
 assert.equal(input.value,'// my note\n'+rowLesson.code);
 assert.ok(s.el('practice-gutter').children.every(n=>n.getAttribute('aria-current')===null));
 const row=s.el('practice-current-row');assert.ok(row?.hidden,'no guide highlight may remain over different code');
 assert.equal(s.editor.frame.srcWrites.length,1);assert.equal(s.writes.length,1,'only the edit writes a draft');
 await s.el('practice-use-guide').click();
 assert.equal(row.hidden,false);assert.equal(input.selectionStart,17,'restoring the example follows the selected line again');
 await s.el('practice-undo').click();assert.equal(row.hidden,true);assert.equal(input.value,'// my note\n'+rowLesson.code);
});

test('phase changes replace clean practice source and run automatically beside the current explanation',()=>{
 assert.equal(typeof practice.mount,'function');const s=setup();s.editor.setLesson(one);assert.equal(s.el('practice-code').value,one.code);s.editor.setLesson(two);assert.equal(s.el('practice-code').value,two.code);assert.equal(JSON.parse(s.el('practice-preview').srcdoc).code,two.code);assert.equal(s.el('practice-line-meaning').textContent,'Read red.');const runs=s.el('practice-preview').srcWrites.length;s.editor.setLine(0,'Set block size.');assert.equal(s.el('practice-preview').srcWrites.length,runs,'line changes do not restart the clock');assert.equal(s.el('practice-line-code').textContent,'const tile = 16;');
});
test('edits survive phase changes, reload and incoming guide settings without overwriting another phase',async()=>{
 const s=setup();s.editor.setLesson(one);s.el('practice-code').value='my edited image code';await s.el('practice-code').fire('input');s.editor.setLesson(two);s.editor.setLesson(one);assert.equal(s.editor.getCode(),'my edited image code');s.editor.setLesson({...one,code:'updated image settings'});assert.equal(s.editor.getCode(),'my edited image code');const reloaded=setup(s.memory.get('icm-practice-drafts-v1'));reloaded.editor.setLesson(one);assert.equal(reloaded.editor.getCode(),'my edited image code');reloaded.editor.setLesson(two);assert.equal(reloaded.editor.getCode(),two.code);
});
test('use lesson code retains an undo copy and Copy exports the actual edited draft',async()=>{
 const s=setup();s.editor.setLesson(one);s.el('practice-code').value='my experiment';await s.el('practice-code').fire('input');await s.el('practice-copy').click();assert.deepEqual(s.copied,['my experiment']);await s.el('practice-use-guide').click();assert.equal(s.editor.getCode(),one.code);assert.equal(s.el('practice-undo').disabled,false);await s.el('practice-undo').click();assert.equal(s.editor.getCode(),'my experiment');
});
test('clean drafts follow changed guide settings, while clicking an unedited line chooses its explanation',async()=>{
 const s=setup();s.editor.setLesson(two);const changed={...two,code:two.code.replace('16','8')};s.editor.setLesson(changed);assert.equal(s.editor.getCode(),changed.code);s.el('practice-code').selectionStart=changed.code.indexOf('const r');await s.el('practice-code').click();assert.deepEqual(s.selected,[1]);s.el('practice-code').value='different draft';await s.el('practice-code').fire('input');await s.el('practice-code').click();assert.deepEqual(s.selected,[1],'edited lines must not pretend to have guide explanations');
});
test('only the current practice frame can report ready or errors and rerun can recover',async()=>{
 const s=setup();s.editor.setLesson(one);const old=JSON.parse(s.el('practice-preview').srcdoc).token;s.editor.setLesson(two);const current=JSON.parse(s.el('practice-preview').srcdoc).token;s.send({kind:'practice-error',token:old,message:'stale'});assert.doesNotMatch(s.el('practice-state').textContent,/stale/);s.send({kind:'practice-error',token:current,message:'foreign'},{});assert.doesNotMatch(s.el('practice-state').textContent,/foreign/);s.send({kind:'practice-error',token:current,message:'Unexpected token'});assert.match(s.el('practice-state').textContent,/Unexpected token/);await s.el('practice-run').click();const next=JSON.parse(s.el('practice-preview').srcdoc).token;s.send({kind:'practice-ready',token:next,version:'2.3.4',width:640,height:480});assert.match(s.el('practice-state').textContent,/running/i);
});
test('unreadable or future draft storage is left untouched while practice still runs',async()=>{
 for(const raw of ['broken-json',JSON.stringify({version:99,drafts:{}})]){const s=setup(raw);s.editor.setLesson(one);s.el('practice-code').value='new unsaved code';await s.el('practice-code').fire('input');assert.equal(s.memory.get('icm-practice-drafts-v1'),raw);assert.match(s.el('practice-save').textContent,/download|unavailable|backup/i);assert.ok(s.el('practice-preview').srcdoc);}
});
test('two tabs preserve independent phase drafts and notice a future storage format before writing',async()=>{
 const a=setup(),b=setup(undefined,a.memory);a.editor.setLesson(one);a.el('practice-code').value='A edited the image';await a.el('practice-code').fire('input');b.editor.setLesson(two);assert.equal(JSON.parse(a.memory.get('icm-practice-drafts-v1')).drafts['stage-1'].code,'A edited the image');b.editor.setLesson(one);assert.equal(b.editor.getCode(),'A edited the image');const future=JSON.stringify({version:9,drafts:{}});a.memory.set('icm-practice-drafts-v1',future);b.el('practice-code').value='second edit';await b.el('practice-code').fire('input');assert.equal(a.memory.get('icm-practice-drafts-v1'),future);
});
test('late readiness cannot present an unrun edit as the currently running source',async()=>{
 const s=setup();s.editor.setLesson(one);const token=JSON.parse(s.el('practice-preview').srcdoc).token;s.el('practice-code').value='edited before readiness';await s.el('practice-code').fire('input');s.send({kind:'practice-ready',token,version:'2.3.4',width:640,height:480});assert.match(s.el('practice-state').textContent,/press Run/i);
});
test('a passive Run or guide update in another tab cannot overwrite a saved same-phase edit',async()=>{
 const a=setup(),b=setup(undefined,a.memory);a.editor.setLesson(one);b.editor.setLesson(one);a.el('practice-code').value='latest explicit edit in tab A';await a.el('practice-code').fire('input');await b.el('practice-run').click();b.editor.setLesson({...one,code:'new guide settings'});assert.equal(JSON.parse(a.memory.get('icm-practice-drafts-v1')).drafts['stage-1'].code,'latest explicit edit in tab A');
});
test('Run stays prominent while secondary actions are in a named Tools disclosure',()=>{
 const s=setup(),tools=s.el('practice-tools');assert.ok(tools,'Tools disclosure is missing');assert.equal(tools.tagName,'details');assert.equal(s.el('practice-tools-label').textContent,'Tools');assert.equal(s.el('practice-copy').parentNode,s.el('practice-tool-list'));assert.notEqual(s.el('practice-run').parentNode,s.el('practice-tool-list'));s.editor.setLesson(one);assert.equal(s.el('practice-output-label').textContent,'Your sketch · latest Run');
});

const mosaic={id:'stage-2',title:'Stage 2 · Mosaic',code:'const tile = 16;',line:0,meaning:'Set the tile size.'};
const stalledDraft='for (let x = 0; x < 320; x += 0) {}';
const storedMosaic=JSON.stringify({version:1,drafts:{
 'stage-2':{code:stalledDraft,base:mosaic.code},
 'stage-1':{code:'my other image',base:one.code}
}});

test('opening an edited mosaic keeps its code visible and waits for an explicit Run',async()=>{
 const s=setup(storedMosaic);
 s.editor.setLesson(mosaic);
 assert.equal(s.editor.getCode(),stalledDraft);
 assert.doesNotMatch(s.editor.frame.srcdoc||'',/x \+= 0/,'opening the lesson executed the saved loop');
 assert.match(s.el('practice-state').textContent,/paused/i);
 assert.equal(s.memory.get('icm-practice-drafts-v1'),storedMosaic);
 await s.el('practice-run').click();
 assert.equal(JSON.parse(s.editor.frame.srcdoc).code,stalledDraft);
 assert.equal(s.memory.get('icm-practice-drafts-v1'),storedMosaic);
});

test('returning to an edited phase stops the old preview and ignores its late messages',()=>{
 const s=setup(storedMosaic);
 s.editor.setLesson(two);
 const running=JSON.parse(s.editor.frame.srcdoc);
 assert.equal(running.code,two.code);
 s.editor.setLesson(mosaic);
 assert.equal(s.editor.getCode(),stalledDraft);
 assert.ok(!s.editor.frame.srcdoc,'the previous executable document should be cleared');
 const paused=s.el('practice-state').textContent;
 assert.match(paused,/paused/i);
 s.send({kind:'practice-ready',token:running.token,version:'2.3.4',width:640,height:480});
 s.send({kind:'practice-error',token:running.token,message:'late error'});
 assert.equal(s.el('practice-state').textContent,paused);
});

test('Use lesson code runs the mosaic and Undo recovers the original draft without running it',async()=>{
 const s=setup(storedMosaic);
 s.editor.setLesson(mosaic);
 await s.el('practice-use-guide').click();
 assert.equal(JSON.parse(s.editor.frame.srcdoc).code,mosaic.code);
 const stored=JSON.parse(s.memory.get('icm-practice-drafts-v1')).drafts;
 assert.equal(stored['stage-2'].previous.code,stalledDraft);
 assert.deepEqual(stored['stage-1'],{code:'my other image',base:one.code});
 await s.el('practice-undo').click();
 assert.equal(s.editor.getCode(),stalledDraft);
 assert.ok(!s.editor.frame.srcdoc,'Undo must not run the recovered loop');
 assert.match(s.el('practice-state').textContent,/paused/i);
 assert.equal(JSON.parse(s.memory.get('icm-practice-drafts-v1')).drafts['stage-2'].code,stalledDraft);
});
