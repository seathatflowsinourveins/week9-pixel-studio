const test=require('node:test'),assert=require('node:assert/strict');
const core=require('./group-study-core.js');
test('a session restores actual source lines and keeps only the line and normalized time',()=>{
 const lines=require('./group-lessons.js').steps.map(step=>step.line);
 for(let line=1;line<=42;line++){
  assert.deepEqual(core.session({line:String(line),seconds:'23.5',playing:true,url:'https://untrusted.test/'}),
   {line:lines.includes(line)?line:1,seconds:23.5});
 }
 assert.deepEqual(core.session({line:42,seconds:0}),{line:42,seconds:0});
 assert.deepEqual(core.session({line:39,seconds:90}),{line:39,seconds:60});
 assert.deepEqual(core.session({line:8,seconds:-2}),{line:8,seconds:0});
});
test('malformed session data cannot supply a line, a time or automatic playback',()=>{
 const fallback={line:1,seconds:0};
 for(const value of [null,'#line-39',[{line:39,seconds:30}],{line:33.1,seconds:Infinity},
  {line:'<script>',seconds:'30&playing=true'},Object.create({line:33,seconds:30}),
  {line:[33],seconds:{valueOf(){throw Error('should not coerce objects');}}}]){
  assert.deepEqual(core.session(value),fallback);
 }
 assert.deepEqual(core.session({line:500,seconds:'30'}),{line:1,seconds:30});
});
test('one minute maps to the source endpoints and integer grid steps',()=>{
 assert.deepEqual(core.timeline(0),{seconds:0,progress:0,hue:30,spacing:5,count:6400});
 assert.deepEqual(core.timeline(30),{seconds:30,progress:.5,hue:125,spacing:15,count:729});
 assert.deepEqual(core.timeline(60),{seconds:60,progress:1,hue:220,spacing:25,count:256});
 assert.equal(core.timeline(2.9).spacing,5);
 assert.deepEqual(core.timeline(80),core.timeline(60));
 assert.deepEqual(core.timeline(-1),core.timeline(0));
 assert.deepEqual(core.timeline(NaN),core.timeline(0));
});
test('sampling snaps to the actual grid and stays inside the image',()=>{
 assert.deepEqual(core.snapPoint(163,121,15),{x:150,y:120});
 assert.deepEqual(core.snapPoint(400,-10,25),{x:375,y:0});
});
test('RGBA index is an address; four stored values are read separately',()=>{
 const bytes=Uint8ClampedArray.from([1,2,3,4, 30,60,90,7, 5,6,7,8, 200,100,0,11]);
 const result=core.sampleAt(bytes,2,2,1,1,30);
 assert.equal(result.index,12);assert.deepEqual(result.rgba,[200,100,0,11]);
 assert.equal(result.bright,100);assert.equal(result.hue,355);
 assert.equal(result.diameter,2*15*100/255);
 assert.equal(result.outputBrightness,50+100/255*50);
 assert.equal(core.sampleAt(bytes,2,2,0,0,0).index,0);
 assert.throws(()=>core.sampleAt(bytes,2,2,2,0,0),/outside/);
 assert.throws(()=>core.sampleAt(bytes.slice(0,3),2,2,0,0,0),/buffer/);
});
test('black disappears, white can span two grid cells, alpha is not used in output',()=>{
 const bytes=Uint8ClampedArray.from([0,0,0,0,255,255,255,0]);
 assert.equal(core.sampleAt(bytes,2,1,0,0,60).diameter,0);
 const white=core.sampleAt(bytes,2,1,1,0,60);
 assert.equal(white.diameter,50);assert.equal(white.hue,295);assert.equal(white.outputBrightness,100);
 assert.equal(white.rgba[3],0);assert.equal(white.outputAlpha,255);
});
test('HSB swatches use brightness rather than HSL lightness',()=>{
 assert.deepEqual(core.hsbRGB(0,100),[255,0,0]);
 assert.deepEqual(core.hsbRGB(120,50),[0,128,0]);
 assert.deepEqual(core.hsbRGB(360,100),[255,0,0]);
});
