const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const R=require('./course-runtime.js');
function preview(){
 const events={},children=[],posted=[],parent={postMessage:(data,origin)=>posted.push({data,origin})};
 const canvas={width:640,height:480,getBoundingClientRect:()=>({left:0,top:0,width:320,height:240}),getContext:()=>({getImageData:()=>({data:[1,2,3,255]})})};
 const document={baseURI:'https://example.test/course/ecosystem/learn.html',querySelector:()=>canvas,body:{append:node=>children.push(node)},createElement:()=>({style:{},attributes:{},setAttribute(key,value){this.attributes[key]=value;}})};
 let ready;
 const context={URL,document,parent,window:{addEventListener:(name,fn)=>(events[name]??=[]).push(fn)},requestAnimationFrame:fn=>fn(),setInterval:fn=>{ready=fn;return 1;},clearInterval:()=>{},p5:{VERSION:'2.3.4'}};
 const html=R.frameHTML({code:'',stage:1,token:'test-token'}),script=html.match(/<script>([\s\S]*)<\/script>/)[1];
 vm.runInNewContext(script,context);
 const send=(data,overrides={})=>(events.message||[]).forEach(fn=>fn({source:parent,origin:'https://example.test',data,...overrides}));
 return {events,children,posted,canvas,send,ready};
}
test('source selection accepts only the current parent, origin, token and valid coordinates',()=>{
 const p=preview(),valid={kind:'course-select',token:'test-token',x:16,y:16,tile:16};
 for(const [data,extra] of [[valid,{source:{}}],[valid,{origin:'https://other.test'}],[{...valid,token:'old'},{}],[{...valid,x:-1},{}],[{...valid,y:240},{}],[{...valid,tile:Infinity},{}],[null,{}]])p.send(data,extra);
 assert.equal(p.children.length,0);
 p.send(valid);assert.equal(p.children.length,1);
 assert.deepEqual({...p.children[0].style},{position:'absolute',pointerEvents:'none',border:'2px solid #d0efa0',boxShadow:'0 0 0 2px #0a1117',boxSizing:'border-box',left:'16px',top:'16px',width:'16px',height:'16px'});
 assert.equal(p.children[0].attributes['aria-label'],'Selected source tile (16, 16) in the p5 output');
 assert.equal(p.canvas.width,640,'overlay does not redraw or mutate the canvas');
});
test('resize reports current logical canvas size for the displayed rect explanation',()=>{
 const p=preview();p.ready();p.canvas.width=280;p.canvas.height=370;p.events.resize.forEach(fn=>fn());
 assert(p.posted.some(item=>item.origin==='https://example.test'&&item.data.kind==='course-size'&&item.data.width===280&&item.data.height===370));
});
