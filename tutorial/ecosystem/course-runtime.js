(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('../project-core.cjs'));else root.courseRuntime=factory(root.projectCore);})(typeof globalThis!=='undefined'?globalThis:this,function(C){
 'use strict';
 // These are the blocks emitted by the project generator. Match an entire
 // opening line so an unfamiliar future block keeps its detailed explanation.
 const closingMeanings=new Map([
  ['for (let x = 0; x < picture.width; x += tile) {','End the column loop for this row.'],
  ['for (let y = 0; y < picture.height; y += tile) {','End the row loop after visiting every sampled row.'],
  ['if (x / picture.width >= focus) {','End the focus check that selects which colors change.'],
  ['if (start === undefined) {','End the first frame check; later frames keep the start time.'],
  ['async function setup() {','End setup after preparing the sketch.'],
  ['function draw() {','End draw for this frame.'],
  ['function paintTiles(amount) {','End paintTiles after drawing the mosaic.'],
  ['function mousePressed() {','End mousePressed after restarting the minute.'],
  ['function windowResized() {','End windowResized after fitting the canvas to the window.']
 ]);
 function meaningForLine(lines,index,rules){
  const [source,detail]=lines[index],code=source.trim();
  if(code==='}'){
   const open=[];
   for(let i=0;i<index;i++){
    const prior=lines[i][0].trim();
    if(prior.endsWith('{'))open.push(prior);
    else if(prior==='}')open.pop();
   }
   return closingMeanings.get(open.pop())??detail;
  }
  return rules.find(rule=>new RegExp(rule.pattern).test(code))?.meaning??detail;
 }
 function lessonProject(stage,options,size){
  const built=C.buildProject(stage,options);
  if(stage===0&&Number(size)===320){built.lines[3]=['  createCanvas(320, 240);','Create a 320 × 240 canvas, the same dimensions as the supplied source. Changing the canvas does not resize the stored source file.'];built.code=built.lines.map(l=>l[0]).join('\n');}
  return built;
 }
 function frameHTML({code,stage,token}){
  const executable=code.replace('loadImage("sample.png")','loadImage("../assets/sample.png")').replace(/<\/script/gi,'<\\/script');
  const bridge=`
const courseToken=${JSON.stringify(token)};
const courseOrigin=new URL(document.baseURI).origin;
let teachingSeconds=null,lastReport=0;
function tell(kind,extra={}){parent.postMessage({kind,token:courseToken,...extra},courseOrigin);}
window.addEventListener('error',e=>tell('course-error',{message:e.message}));
window.addEventListener('unhandledrejection',e=>tell('course-error',{message:String(e.reason)}));
let selectedSample=null,selectionBox;
function markSample(){
 const canvas=document.querySelector('canvas');if(!canvas||!selectedSample)return;
 if(!selectionBox){selectionBox=document.createElement('div');selectionBox.id='course-sample-marker';selectionBox.setAttribute('role','img');Object.assign(selectionBox.style,{position:'absolute',pointerEvents:'none',border:'2px solid #d0efa0',boxShadow:'0 0 0 2px #0a1117',boxSizing:'border-box'});document.body.append(selectionBox);}
 const {x,y,tile}=selectedSample,box=canvas.getBoundingClientRect();Object.assign(selectionBox.style,{left:(box.left+x/320*box.width)+'px',top:(box.top+y/240*box.height)+'px',width:(tile/320*box.width)+'px',height:(tile/240*box.height)+'px'});selectionBox.setAttribute('aria-label','Selected source tile ('+x+', '+y+') in the p5 output');
}
window.addEventListener('message',event=>{
 if(event.source!==parent||event.origin!==courseOrigin||event.data?.token!==courseToken||event.data.kind!=='course-select')return;
 const {x,y,tile}=event.data;if(![x,y,tile].every(Number.isFinite)||x<0||x>=320||y<0||y>=240||tile<4||tile>40)return;selectedSample={x,y,tile};markSample();
});
function reportSize(){const canvas=document.querySelector('canvas');if(canvas){markSample();tell('course-size',{width:canvas.width,height:canvas.height});}}
window.addEventListener('resize',()=>requestAnimationFrame(reportSize));
${stage>=4?`
const normalDraw=window.draw;
window.draw=function(){
 if(teachingSeconds!==null)paintTiles(teachingSeconds/60*strength);else normalDraw();
 if(teachingSeconds!==null||performance.now()-lastReport>200){lastReport=performance.now();tell('course-time',{seconds:teachingSeconds!==null?teachingSeconds:Math.max(0,Math.min(60,(millis()-start)/1000)),teaching:teachingSeconds!==null});}
};
${stage>=5?`const normalMouse=window.mousePressed;window.mousePressed=function(){teachingSeconds=null;normalMouse();loop();};`:''}
window.addEventListener('message',event=>{
 if(event.source !== parent||event.origin!==courseOrigin||event.data?.token!==courseToken)return;
 if(event.data.kind==='course-seek'){teachingSeconds=Math.max(0,Math.min(60,Number(event.data.seconds)||0));noLoop();redraw();}
 if(event.data.kind==='course-play'){teachingSeconds=null;start=undefined;loop();}
});`:''}
let checks=0;const readyCheck=setInterval(()=>{
 const canvas=document.querySelector('canvas');
 if(canvas&&canvas.getContext('2d')?.getImageData(0,0,1,1).data[3]){clearInterval(readyCheck);tell('course-ready',{version:p5.VERSION,width:canvas.width,height:canvas.height});}
 else if(++checks>150){clearInterval(readyCheck);tell('course-error',{message:'No painted canvas yet. Restart p5 or open the complete local reference.'});}
},100);
`;
  const displayPercent=stage===0&&code.includes('createCanvas(320, 240)')?50:100;
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:#0c121c;overflow:hidden}canvas{display:block;width:'+displayPercent+'%!important;height:auto!important}</style><script src="../vendor/p5.min.js"></script></head><body><main></main><script>'+executable+'\n'+bridge+'</script></body></html>';
 }
 // Runs inside the practice iframe, before either p5 or the learner's script.
 function observePractice(token) {
   const origin = new URL(document.baseURI).origin;
   let failed = false;
   let checks = 0;
   const send = (kind, extra) => parent.postMessage({kind, token, ...extra}, origin);
   const timer = setInterval(checkCanvas, 100);

   function fail(message) {
     if (failed) return;
     failed = true;
     clearInterval(timer);
     send('practice-error', {message: String(message)});
   }

   window.addEventListener('error', event => {
     if (event.message) fail(event.message);
     else if (event.target?.tagName === 'SCRIPT') fail('The p5 library could not load. Run the sketch again.');
   }, true);
   window.addEventListener('unhandledrejection', event => fail(event.reason?.message || event.reason));

   function checkCanvas() {
     const canvas = document.querySelector('canvas');
     if (canvas?.width && canvas.height && window.p5) {
       try {
         // A learner may draw one square on a transparent canvas. Inspect the
         // whole canvas only when the inexpensive corner check is transparent.
         let context = canvas.getContext('2d');
         if (!context) {
           const sampler = document.createElement('canvas');
           sampler.width = canvas.width;
           sampler.height = canvas.height;
           context = sampler.getContext('2d');
           context.drawImage(canvas, 0, 0);
         }
         const painted = context.getImageData(0, 0, 1, 1).data[3] ||
           context.getImageData(0, 0, canvas.width, canvas.height).data.some((v, i) => i % 4 === 3 && v > 0);
         if (painted) {
           clearInterval(timer);
           send('practice-ready', {version: window.p5.VERSION, width: canvas.width, height: canvas.height});
           return;
         }
       } catch (error) {
         fail(error.message);
         return;
       }
     }
     if (++checks >= 150) fail('No painted canvas yet. Check createCanvas() and draw a shape or background, then Run again.');
   }
 }

 function practiceFrameHTML({code, token}) {
   // Keep HTML parsing away from learner strings such as "</script>" while
   // installing the original JavaScript as a classic global-mode sketch.
   const asScriptString = value => JSON.stringify(String(value)).replace(/</g, '\\u003c');
   return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><base href="../assets/">
<style>html,body{margin:0;background:#0c121c}canvas{display:block;width:100%!important;height:auto!important}</style>
<script>(${observePractice.toString()})(${asScriptString(token)});</script>
<script src="../vendor/p5.min.js"></script></head><body><main></main>
<script>(()=>{const sketch=document.createElement('script');sketch.textContent=${asScriptString(code)};document.body.appendChild(sketch);})();</script>
</body></html>`;
 }
 return {lessonProject,frameHTML,meaningForLine,practiceFrameHTML};
});
