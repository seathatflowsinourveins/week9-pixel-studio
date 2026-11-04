const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const file=path.join(__dirname,'practice-editor.js');
const practice=fs.existsSync(file)?require(file):{};
class Node {
 constructor(tag,doc){this.tagName=tag;this.ownerDocument=doc;this.children=[];this.attributes={};this.listeners={};this.style={setProperty(){}};this.scrollTop=0;this.value='';this.contentWindow={};this.srcWrites=[];this.classList={add(){},remove(){},toggle(){}};}
 appendChild(n){this.children.push(n);n.parentNode=this;return n;} append(...nodes){nodes.forEach(n=>this.appendChild(n));} replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);} getAttribute(k){return this.attributes[k]??null;}
 addEventListener(k,fn){(this.listeners[k]??=[]).push(fn);} fire(k,event={}){return Promise.all((this.listeners[k]||[]).map(fn=>fn(event)));} click(){return this.fire('click');} focus(){this.ownerDocument.activeElement=this;}
 set srcdoc(v){this._srcdoc=v;this.srcWrites.push(v);} get srcdoc(){return this._srcdoc;}
}
function find(node,name){if((node.className||'').split(' ').includes(name))return node;for(const child of node.children){const match=find(child,name);if(match)return match;}}
function setup(raw,shared){const memory=shared||new Map(raw?[['icm-practice-drafts-v1',raw]]:[]),listeners={},copied=[],selected=[];const doc={activeElement:null,createElement:tag=>new Node(tag,doc)};doc.defaultView={location:{origin:'https://course.test'},navigator:{clipboard:{writeText:async code=>copied.push(code)}},addEventListener:(kind,fn)=>{listeners[kind]=fn;}};const container=new Node('aside',doc);const storage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)};const editor=practice.mount({container,storage,runtime:{practiceFrameHTML:args=>JSON.stringify(args)},onLine:line=>selected.push(line)});return {container,editor,memory,listeners,copied,selected,el:name=>find(container,name),send(data,source){listeners.message({origin:'https://course.test',source:source||find(container,'practice-preview').contentWindow,data});}};}
const one={id:'stage-1',title:'Stage 1 · Image',code:'let picture;\nasync function setup() {}',line:0,meaning:'Name the image.'};
const two={id:'stage-3',title:'Stage 3 · RGBA',code:'const tile = 16;\nconst r = picture.pixels[i];',line:1,meaning:'Read red.'};

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
