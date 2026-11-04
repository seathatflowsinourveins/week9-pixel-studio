const test=require('node:test'),assert=require('node:assert/strict');
test('one source pixel has four distinct addresses and maps to the destination tile',()=>{
 const F=require('./pixel-flow-core.js'),p=new Uint8ClampedArray(320*240*4),i=4*(16+16*320);p.set([172,97,100,255],i);
 const s=F.sample(p,{x:16,y:16,tile:16,stage:2});assert.equal(s.index,20544);assert.deepEqual(s.rgba,[172,97,100,255]);assert.deepEqual(s.addresses,[20544,20545,20546,20547]);assert.deepEqual(s.destination,{x:32,y:32,w:32,h:32});assert.equal(s.x,16);assert.equal(s.y,16);
});
test('sample selection snaps to the real grid, clamps edges and returns a stable order',()=>{
 const F=require('./pixel-flow-core.js');assert.deepEqual(F.position(319,239,16),{x:304,y:224,order:299});assert.deepEqual(F.position(-2,17,16),{x:0,y:16,order:20});assert.deepEqual(F.position(NaN,Infinity,16),{x:0,y:0,order:0});
});
test('time and strength are separate; inside focus remains unchanged',()=>{
 const F=require('./pixel-flow-core.js'),C=require('../project-core.cjs'),p=new Uint8ClampedArray(320*240*4);for(let i=0;i<p.length;i+=4)p.set([172,97,100,255],i);
 const options={mode:'focus',focus:.4,strength:.5,tile:16},outside=F.sample(p,{x:160,y:16,stage:4,seconds:30,options});assert.equal(outside.t,.5);assert.equal(outside.amount,.25);assert.deepEqual(outside.current,C.transformRGB([172,97,100],options,.5,.25));
 const inside=F.sample(p,{x:16,y:16,stage:4,seconds:60,options});assert.deepEqual(inside.current,[172,97,100]);assert.deepEqual(inside.target,[172,97,100]);
 const staticSample=F.sample(p,{x:160,y:16,stage:3,seconds:0,options});assert.equal(staticSample.amount,.5);
});
test('address, color and time lines have distinct teaching roles and semantic targets',()=>{
 const F=require('./pixel-flow-core.js'),C=require('../project-core.cjs');assert.equal(F.role('const g = picture.pixels[i + 1];'),'values');assert.equal(F.role('const i = 4 * (x + y * picture.width);'),'address');assert.equal(F.role('const t = constrain((millis() - start) / 60000, 0, 1);'),'time');
 for(let stage=0;stage<7;stage++){const lines=C.buildProject(stage).lines;for(const target of F.ACTION_TARGETS[stage])assert(F.targetLine(lines,target)>=0,'stage'+stage+' target '+target);}
 const lines=C.buildProject(2).lines;assert.match(lines[F.targetLine(lines,'green')][0],/pixels\[i \+ 1\]/);
});
test('action focus follows the active color rule and RGBA falls back to a whole pixel read',()=>{
 const F=require('./pixel-flow-core.js'),C=require('../project-core.cjs');
 for(const mode of ['focus','gray','invert'])for(let stage=0;stage<7;stage++){
  const lines=C.buildProject(stage,{mode}).lines;
  for(const target of F.ACTION_TARGETS[stage])assert(F.actionLine(lines,target)>=0,mode+' stage '+stage+' '+target);
  if(stage===3&&mode!=='focus')assert.match(lines[F.actionLine(lines,'condition')][0],/targetR/);
 }
 assert.match(C.buildProject(1).lines[F.actionLine(C.buildProject(1).lines,'green')][0],/picture.get/);
});

test('live line examples use the selected pixel addresses and channel amounts',()=>{
 const F=require('./pixel-flow-core.js'),p=new Uint8ClampedArray(320*240*4);p.set([148,201,207,255],20544);p.set([42,84,126,255],20608);const state={x:16,y:16,tile:16,stage:2};
 assert.equal(typeof F.lineExample,'function');const address=F.lineExample(p,state,'const i = 4 * (x + y * picture.width);');assert.match(address.expression,/20544/);assert.match(address.context,/16, 16/);
 const green=F.lineExample(p,state,'const g = picture.pixels[i + 1];');assert.equal(green.expression,'pixels[20545] → 201');assert.match(green.meaning,/green/);
 const next=F.lineExample(p,{...state,x:32},'const g = picture.pixels[i + 1];');assert.equal(next.expression,'pixels[20609] → 84');
 const alpha=F.lineExample(p,state,'const a = picture.pixels[i + 3];');assert.match(alpha.meaning,/opaque/);
});
test('live fill and rectangle examples connect the sample to its actual color and destination',()=>{
 const F=require('./pixel-flow-core.js'),p=new Uint8ClampedArray(320*240*4);p.set([148,201,207,255],20544);const state={x:16,y:16,tile:16,stage:2};const fill=F.lineExample(p,state,'fill(r, g, b);');assert.equal(fill.expression,'fill(148, 201, 207)');assert.deepEqual(fill.swatch,[148,201,207]);assert.equal(F.lineExample(p,state,'rect(x / picture.width * width, y / picture.height * height, tile / picture.width * width, tile / picture.height * height);').expression,'rect(32, 32, 32, 32)');
});
test('Stage2 fill includes alpha while later transformed colors are described as rounded output',()=>{
 const F=require('./pixel-flow-core.js'),C=require('../project-core.cjs'),p=new Uint8ClampedArray(320*240*4);p.set([148,201,207,255],20544);
 const line=C.buildProject(1).lines.find(([code])=>code.trim().startsWith('fill('))[0];assert.equal(F.lineExample(p,{x:16,y:16,tile:16,stage:1},line).expression,'fill(148, 201, 207, 255)');
 const transformed=F.lineExample(p,{x:16,y:16,tile:16,stage:3,options:{mode:'gray',strength:.5}},'fill(lerp(r, targetR, amount), lerp(g, targetG, amount), lerp(b, targetB, amount));');assert.match(transformed.title,/rounded/i);assert.doesNotMatch(transformed.expression,/^fill\(/);
});
test('time and transformed examples describe the teaching sample rather than the independent practice clock',()=>{
 const F=require('./pixel-flow-core.js'),p=new Uint8ClampedArray(320*240*4);p.set([148,201,207,255],4*(160+16*320));const state={x:160,y:16,stage:4,seconds:30,teaching:true,options:{mode:'focus',focus:.4,strength:.5,tile:16}};
 const time=F.lineExample(p,state,'paintTiles(t * strength);');assert.match(time.expression,/30 ÷ 60 × 0.5 = 0.25/);assert.match(time.context,/Teaching preview/);
 const fill=F.lineExample(p,state,'fill(lerp(r, targetR, amount), lerp(g, targetG, amount), lerp(b, targetB, amount));');assert.deepEqual(fill.swatch,F.sample(p,state).current);
 assert.equal(F.lineExample(p,state,'let picture;'),null);
});

function illustrationSource(){const p=new Uint8ClampedArray(320*240*4);for(let i=0;i<p.length;i+=4)p.set([150,90,60,255],i);return p;}
const visualState={x:160,y:16,stage:3,options:{mode:'focus',focus:.4,strength:.5,tile:16}};

test('new illustrated lines highlight the corresponding drawing or transformation step',()=>{
 const F=require('./pixel-flow-core.js');
 assert.equal(F.role('background(12, 18, 28);'),'draw');
 for(const code of ['const strength = 1;','paintTiles(strength);','function paintTiles(amount) {'])assert.equal(F.role(code),'transform');
});

test('strength illustration shows the setting rather than elapsed animation progress',()=>{
 const F=require('./pixel-flow-core.js'),p=illustrationSource();
 const example=F.lineExample(p,{...visualState,stage:4,seconds:30},'const strength = 0.5;');
 assert.ok(example,'strength needs a teaching example');
 assert.deepEqual(example.visual,{type:'amount',label:'strength',value:.5});
 assert.equal(example.control,'strength');
});

test('region diagram locates the selected sample against the exact rule boundary',()=>{
 const F=require('./pixel-flow-core.js'),p=illustrationSource();
 const before=F.lineExample(p,{...visualState,x:112},'const focus = 0.4;');
 const at=F.lineExample(p,{...visualState,x:128},'if (x / picture.width >= focus) {');
 assert.ok(before&&at,'both boundary lines need examples');
 assert.deepEqual(before.visual,{type:'region',fraction:.4,position:.35,changes:false});
 assert.deepEqual(at.visual,{type:'region',fraction:.4,position:.4,changes:true});
 assert.equal(before.control,'focus');
});

test('function call and definition diagrams connect the argument with amount',()=>{
 const F=require('./pixel-flow-core.js'),p=illustrationSource();
 const call=F.lineExample(p,visualState,'paintTiles(strength);');
 assert.ok(call,'the call needs an argument diagram');
 assert.deepEqual(call.visual,{type:'call',argumentName:'strength',parameterName:'amount',value:.5});
 const definition=F.lineExample(p,{...visualState,stage:4,seconds:30},'function paintTiles(amount) {');
 assert.deepEqual(definition.visual,{type:'call',argumentName:'t × strength',parameterName:'amount',value:.25});
 const timed=F.lineExample(p,{...visualState,stage:4,seconds:30},'paintTiles(t * strength);');
 assert.deepEqual(timed.visual,definition.visual);
 assert.equal(definition.control,'teaching-time');
});

test('background illustration draws the literal canvas base before a sample-colored block',()=>{
 const F=require('./pixel-flow-core.js'),p=illustrationSource();
 const example=F.lineExample(p,visualState,'background(12, 18, 28);');
 assert.ok(example,'background needs a layer example');
 assert.deepEqual(example.visual,{type:'layers',background:[12,18,28],block:[125,95,80]});
 assert.deepEqual(example.swatch,[12,18,28]);
});

test('gray bars use the arithmetic target rather than the current blended channels',()=>{
 const F=require('./pixel-flow-core.js'),p=illustrationSource();
 const example=F.lineExample(p,visualState,'const gray = (r + g + b) / 3;');
 assert.deepEqual(example.visual,{type:'gray',original:[150,90,60],gray:100});
 assert.deepEqual(example.swatch,[100,100,100]);
});

test('blend diagrams retain original target and current color, including protected samples',()=>{
 const F=require('./pixel-flow-core.js'),p=illustrationSource(),code='fill(lerp(r, targetR, amount), lerp(g, targetG, amount), lerp(b, targetB, amount));';
 const outside=F.lineExample(p,visualState,code);
 assert.deepEqual(outside.visual,{type:'blend',original:[150,90,60],target:[100,100,100],current:[125,95,80],value:.5});
 const inside=F.lineExample(p,{...visualState,x:16},code);
 assert.deepEqual(inside.visual.target,[150,90,60]);assert.deepEqual(inside.visual.current,[150,90,60]);
});

test('rectangle diagrams retain actual canvas proportions and sample destinations',()=>{
 const F=require('./pixel-flow-core.js'),p=illustrationSource();
 const example=F.lineExample(p,{...visualState,canvasW:360,canvasH:640},'rect(x / picture.width * width, y / picture.height * height, tile / picture.width * width, tile / picture.height * height);');
 assert.deepEqual(example.visual,{type:'position',x:180,y:16/240*640,w:18,h:16/240*640,canvasW:360,canvasH:640,rgb:[125,95,80]});
});
