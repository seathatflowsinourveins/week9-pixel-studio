const test=require('node:test'),assert=require('node:assert/strict');
const group=require('./dashboard-group.js');
class Node {
 constructor(tag,doc){this.tagName=tag;this.ownerDocument=doc;this.children=[];this.attributes={};this.parentNode=null;}
 appendChild(node){this.children.push(node);node.parentNode=this;return node;}
 setAttribute(key,value){this.attributes[key]=String(value);}
 remove(){if(this.parentNode){const host=this.parentNode;host.children=host.children.filter(node=>node!==this);this.parentNode=null;}}
}
function setup(){const doc={createElement:tag=>new Node(tag,doc)},host=new Node('div',doc);return {host,controller:group.create({host,document:doc,baseURL:'https://example.test/project/ecosystem/dashboard-data.json?v=abc123'})};}
test('dashboard link preserves the current phase, view and unrelated release parameters',()=>{
 const source='https://example.test/project/ecosystem/learn.html?view=editor&release=proof#stage-5';
 const link=new URL(group.panelURL(source,true));
 assert.equal(link.hash,'#stage-5');assert.equal(link.searchParams.get('view'),'editor');assert.equal(link.searchParams.get('release'),'proof');assert.equal(link.searchParams.get('panel'),'group-study');
 assert.equal(group.panelURL(link.href,false),source);
 assert.equal(new URL(group.panelURL('https://example.test/project/ecosystem/?panel=group-study#group',false)).hash,'#group');
});
test('mount only one owned, versioned compact iframe through repeated dashboard renders',()=>{
 const {host,controller}=setup(),first=controller.mount(),again=controller.mount(),url=new URL(first.src);
 assert.equal(again,first);assert.equal(host.children.length,1);assert.equal(url.pathname,'/project/ecosystem/group-study.html');assert.equal(url.searchParams.get('v'),'abc123');assert.equal(url.searchParams.get('embedded'),'dashboard');assert.equal(url.hash,'#line-1');
 assert.equal(first.title,'Group study: source lines and interactive p5');assert.equal(first.attributes['referrerpolicy'],'same-origin');
});
test('leaving destroys the group frame, and reopening restores only line/time paused',()=>{
 const {host,controller}=setup(),first=controller.mount();
 first.contentWindow={groupStudySession:{snapshot:()=>({line:28,seconds:30,code:'never copy me',playing:true})}};
 controller.unmount();assert.equal(host.children.length,0);assert.equal(first.parentNode,null);
 const second=controller.mount(),url=new URL(second.src);assert.notEqual(second,first);assert.equal(url.hash,'#line-28');assert.equal(url.searchParams.get('seconds'),'30');assert.equal(url.searchParams.has('playing'),false);assert.equal(url.searchParams.has('code'),false);
});
test('failed or invalid snapshots cannot break closing or inject another destination',()=>{
 const {controller}=setup(),first=controller.mount();
 first.contentWindow={groupStudySession:{snapshot(){throw Error('unavailable');}}};assert.doesNotThrow(()=>controller.unmount());
 const second=controller.mount();second.contentWindow={groupStudySession:{snapshot:()=>({line:'https://other.test',seconds:Infinity,url:'https://other.test'})}};controller.unmount();
 const url=new URL(controller.mount().src);assert.equal(url.origin,'https://example.test');assert.equal(url.hash,'#line-1');assert.equal(url.searchParams.get('seconds'),'0');
});
