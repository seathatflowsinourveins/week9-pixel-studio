const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const core=require('./dashboard-core.js'),groups=require('./dashboard-group.js');
class Element {
 constructor(tag,doc){this.tagName=tag;this.ownerDocument=doc;this.children=[];this.dataset={};this.attributes={};this.events={};this.className='';this.hidden=false;this.open=false;this.parentNode=null;this.textContent='';this.classList={toggle:(name,on)=>{const set=new Set(this.className.split(/\s+/).filter(Boolean));if(on===undefined)on=!set.has(name);on?set.add(name):set.delete(name);this.className=[...set].join(' ');},remove:name=>this.classList.toggle(name,false)};}
 append(...nodes){nodes.forEach(node=>this.appendChild(node));}appendChild(node){node.remove();this.children.push(node);node.parentNode=this;return node;}
 remove(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(n=>n!==this);this.parentNode=null;}}
 replaceChildren(...nodes){this.children.forEach(node=>node.parentNode=null);this.children=[];this.append(...nodes);}
 get lastChild(){return this.children.at(-1);}get isConnected(){return this===this.ownerDocument.body||!!this.parentNode?.isConnected;}
 setAttribute(key,value){this.attributes[key]=String(value);}removeAttribute(key){delete this.attributes[key];}
 addEventListener(kind,fn){(this.events[kind]??=[]).push(fn);}fire(kind,event={}){for(const fn of this.events[kind]||[])fn({button:0,preventDefault(){},...event});}
 focus(){this.ownerDocument.activeElement=this;}showModal(){this.open=true;}close(){this.open=false;this.fire('close');}
 matches(selector){if(selector.startsWith('.'))return this.className.split(/\s+/).includes(selector.slice(1));if(selector.startsWith('#'))return this.id===selector.slice(1);if(selector==='[data-studio-stage]')return this.dataset.studioStage!==undefined;if(selector==='[data-studio-group-open]')return this.dataset.studioGroupOpen!==undefined;return this.tagName===selector;}
 querySelectorAll(selector){return this.children.flatMap(child=>[...(child.matches(selector)?[child]:[]),...child.querySelectorAll(selector)]);}querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}
function harness(href='https://example.test/project/ecosystem/learn.html?view=editor&release=keep#stage-5'){
 const doc={readyState:'complete',currentScript:{src:'https://example.test/project/ecosystem/dashboard.js?v=bundle'},createElement:tag=>new Element(tag,doc)};
 doc.body=new Element('body',doc);const header=new Element('header',doc);header.className='topbar';doc.body.append(header);
 doc.querySelector=selector=>doc.body.querySelector(selector);doc.querySelectorAll=selector=>doc.body.querySelectorAll(selector);doc.getElementById=id=>doc.querySelector('#'+id);
 const location={href,get search(){return new URL(this.href).search;},get origin(){return new URL(this.href).origin;}},history={replaceState(_a,_b,url){location.href=String(url);}},writes=[];
 const events={};const win={studioDashboardCore:core,studioGroupStudy:groups,location,history,addEventListener(kind,fn){(events[kind]??=[]).push(fn);},fire(kind,event){for(const fn of events[kind]||[])fn(event);},studioArt:{paintAll(){}},localStorage:{getItem(){return null;},setItem(...args){writes.push(args);}}};doc.defaultView=win;
 let finish;const fetchPromise=new Promise(resolve=>finish=resolve);
 vm.runInNewContext(fs.readFileSync(require.resolve('./dashboard.js'),'utf8'),{window:win,document:doc,location,history,localStorage:win.localStorage,URL,URLSearchParams,fetch:()=>fetchPromise,console});
 const dialog=doc.getElementById('studio-dialog'),tabs=doc.querySelector('.studio-dialog-tabs'),content=doc.getElementById('studio-dialog-content');
 return {win,doc,dialog,tabs,content,location,writes,async data(){finish({ok:true,json:async()=>({stages:[],foundations:[],repos:[],assignment:{items:[]}})});await new Promise(setImmediate);}};
}
test('all dashboard sections have valid matching tab IDs, including Group study',()=>{
 const h=harness(),names=h.tabs.children.map(tab=>tab.textContent);assert(names.includes('Group study'));assert.equal(names.length,5);
 for(const tab of h.tabs.children)assert(!/\s/.test(tab.id),tab.id);
 assert.equal(h.win.studioDashboard.open('Group study'),true);assert.equal(h.content.attributes['aria-labelledby'],'studio-tab-group-study');assert.equal(h.dialog.open,true);assert.equal(h.writes.length,0);
});
test('opening, repeated renders and late data preserve one group frame and the phase route',async()=>{
 const h=harness();h.win.studioDashboard.open('Group study');const first=h.content.querySelector('iframe');assert(first);
 h.win.studioDashboard.open('Group study');await h.data();assert.equal(h.content.querySelector('iframe'),first);assert.equal(h.content.querySelectorAll('iframe').length,1);
 const url=new URL(h.location.href);assert.equal(url.hash,'#stage-5');assert.equal(url.searchParams.get('view'),'editor');assert.equal(url.searchParams.get('release'),'keep');assert.equal(url.searchParams.get('panel'),'group-study');assert.equal(h.writes.length,0);
});
test('close disposes playback, removes only the group query and restores trigger focus',async()=>{
 const h=harness(),trigger=h.doc.querySelector('.studio-nav').children.find(button=>button.textContent==='Group study');assert(trigger);
 h.win.studioDashboard.open('Group study',trigger);const first=h.content.querySelector('iframe');first.contentWindow={groupStudySession:{snapshot:()=>({line:33,seconds:40})}};
 h.dialog.close();assert(!first.isConnected);assert.equal(h.doc.activeElement,trigger);assert.equal(new URL(h.location.href).searchParams.has('panel'),false);assert.equal(new URL(h.location.href).hash,'#stage-5');
 await h.data();assert.equal(h.content.querySelectorAll('iframe').length,0,'late data must not remount hidden playback');
 h.win.studioDashboard.open('Group study',trigger);const nextURL=new URL(h.content.querySelector('iframe').src);assert.equal(nextURL.hash,'#line-33');assert.equal(nextURL.searchParams.get('seconds'),'40');
});
test('switching dashboard sections destroys only group playback and deep links open in place',()=>{
 const h=harness('https://example.test/project/ecosystem/loops.html?mode=row&view=editor&panel=group-study');assert.equal(h.dialog.open,true);const first=h.content.querySelector('iframe');assert(first);
 h.tabs.children.find(tab=>tab.textContent==='Foundations').fire('click');assert(!first.isConnected);assert.equal(h.content.querySelectorAll('iframe').length,0);const url=new URL(h.location.href);assert.equal(url.searchParams.get('mode'),'row');assert.equal(url.searchParams.get('view'),'editor');assert.equal(url.searchParams.has('panel'),false);
});
test('a queued close event cannot dispose a dialog reopened before it dispatches',()=>{
 const h=harness();h.win.studioDashboard.open('Group study');const pending=[];
 h.dialog.close=()=>{h.dialog.open=false;pending.push(()=>h.dialog.fire('close'));};
 h.dialog.close();h.win.studioDashboard.open('Group study');const active=h.content.querySelector('iframe');pending.shift()();
 assert.equal(h.dialog.open,true);assert(h.content.querySelector('iframe')===active);assert.equal(active.isConnected,true);assert.equal(new URL(h.location.href).searchParams.get('panel'),'group-study');
});
test('Back and Forward synchronize Group study without rewriting the phase hash',()=>{
 const h=harness();h.win.studioDashboard.open('Group study');
 h.location.href='https://example.test/project/ecosystem/learn.html?view=editor#stage-4';h.win.fire('popstate');
 assert.equal(h.dialog.open,false);assert.equal(h.content.querySelector('iframe'),null);assert.equal(new URL(h.location.href).hash,'#stage-4');
 h.location.href='https://example.test/project/ecosystem/learn.html?view=editor&panel=group-study#stage-5';h.win.fire('popstate');
 assert.equal(h.dialog.open,true);assert(h.content.querySelector('iframe'));assert.equal(new URL(h.location.href).hash,'#stage-5');
});
test('Escape requests close only from the active owned guide and exact origin',()=>{
 const h=harness();h.win.studioDashboard.open('Group study');const own={};h.content.querySelector('iframe').contentWindow=own;
 const message={data:{kind:'studio-group-close'},origin:'https://example.test',source:own};
 h.win.fire('message',{...message,source:{}});assert.equal(h.dialog.open,true);
 h.win.fire('message',{...message,origin:'https://other.test'});assert.equal(h.dialog.open,true);
 h.win.fire('message',{...message,data:{kind:'other'}});assert.equal(h.dialog.open,true);
 h.win.fire('message',message);assert.equal(h.dialog.open,false);assert.equal(h.content.querySelector('iframe'),null);
 h.win.studioDashboard.open('References');h.win.fire('message',message);assert.equal(h.dialog.open,true);
});
