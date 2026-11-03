(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.projectCore=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
function clamp(n,lo,hi,fallback){n=Number(n);return Number.isFinite(n)?Math.max(lo,Math.min(hi,n)):fallback;}
function cleanState(value){const s=value&&typeof value==='object'?value:{},o=s.options||{},valid=id=>/^studio-[0-6]$/.test(id);return {options:{tile:Math.round(clamp(o.tile,4,40,16)),mode:['focus','gray','invert'].includes(o.mode)?o.mode:'focus',focus:clamp(o.focus,0,1,.4),strength:clamp(o.strength,0,1,1)},completed:[...new Set((Array.isArray(s.completed)?s.completed:[]).filter(valid))],notes:Object.fromEntries(Object.entries(s.notes&&typeof s.notes==='object'&&!Array.isArray(s.notes)?s.notes:{}).filter(([k,v])=>valid(k)&&typeof v==='string').map(([k,v])=>[k,v.slice(0,20000)])),walkthrough:Object.fromEntries(Object.entries(s.walkthrough&&typeof s.walkthrough==='object'&&!Array.isArray(s.walkthrough)?s.walkthrough:{}).filter(([k,v])=>valid(k)&&typeof v==='number'&&Number.isFinite(v)).map(([k,v])=>[k,Math.floor(clamp(v,0,50,0))]))};}
function guidePosition(state,stage,count){return Math.max(0,Math.min(Math.max(1,count)-1,cleanState(state).walkthrough[stage]||0));}
function transformRGB(rgb,options,x,amount){const r=rgb[0],g=rgb[1],b=rgb[2],gray=(r+g+b)/3,a=clamp(amount,0,1,0);let target=[gray,gray,gray];if(options.mode==='invert')target=[255-r,255-g,255-b];else if(options.mode==='focus'&&x<options.focus)target=[r,g,b];return rgb.slice(0,3).map((v,i)=>Math.round(v+(target[i]-v)*a));}
function sampleAt(order,tile,w,h){const cols=Math.ceil(w/tile),rows=Math.ceil(h/tile),count=cols*rows,n=((order%count)+count)%count,column=n%cols,row=Math.floor(n/cols),x=column*tile,y=row*tile;return {x,y,index:4*(y*w+x),column,row,count};}
function buildProject(stage,value){stage=Math.round(clamp(stage,0,6,0));const o=cleanState({options:value}).options,lines=[],add=(s,e)=>lines.push([s,e]);
 add('let picture;','Declare a variable that will remember the source image. Outside the functions, both setup and drawing code can use it.');
 if(stage>=1)add(`const tile = ${o.tile};`,'Name the sampling distance in source pixels. A larger number visits fewer positions and makes a coarser mosaic.');
 if(stage>=3)add(`const strength = ${o.strength};`,'Name the maximum transformation amount: 0 keeps the source colors and 1 reaches the full target colors.');
 if(stage>=3&&o.mode==='focus')add(`const focus = ${o.focus};`,'Choose the source-width fraction that keeps its original colors. For example, 0.4 means the left forty percent.');
 if(stage>=4)add('let start;','Reserve a start time without assigning it yet. It is undefined until the first draw frame starts.');
 add('async function setup() {','Define the once-only setup function. Async permits waiting for a file with await.');
 add('  picture = await loadImage("sample.png");','Load the source image and wait for it. In the Web Editor, upload sample.png beside sketch.js.');
 add(stage>=5?'  createCanvas(windowWidth, windowHeight);':'  createCanvas(640, 480);',stage>=5?'Fill the available viewport. The shared fullscreen page and browser fullscreen are separate presentation steps.':'Create a destination canvas twice the supplied source width and height.');
 add('  pixelDensity(1);','Use one stored canvas pixel per coordinate unit so the coordinate arithmetic stays simple.');
 if(stage>=2){add('  picture.pixelDensity(1);','Keep the source image buffer at density one too. The RGBA index formula below assumes this.');add('  picture.loadPixels();','Expose the original source channel array once. We read it later without changing it.');}
 if(stage>=1)add('  noStroke();','Remove outlines so neighboring color tiles meet cleanly.');
 if(stage===0)add('  image(picture, 0, 0, width, height);','Draw the loaded source across the canvas. These final dimensions describe the display, not the stored source.');
 if(stage>=1&&stage<=2)tileLoop('  ',stage,false);
 if(stage===3)add('  paintTiles(strength);','Call our reusable drawing rule with the chosen static transformation strength.');
 let description=stage===0?'The original source image displayed across a larger canvas.':stage<3?'A static block mosaic built from sampled source image colors.':o.mode==='focus'?'Original colors remain in a left-hand region while the rest becomes gray.':o.mode==='gray'?'The whole sampled image loses color and becomes gray.':'The sampled image changes toward inverted red, green and blue channels.';
 if(stage>=4)description+=' The change unfolds over sixty elapsed seconds and holds its ending.';
 if(stage>=5)description+=' Click to replay the same journey.';
 add('  describe('+JSON.stringify(description)+');','Provide an accurate text description of this stage and color rule for people who cannot see the canvas. Revise it when your concept changes.');
 add('}','Close setup. p5 calls draw after asynchronous setup has finished.');
 if(stage>=4){
  add('function draw() {','Define the instructions p5 repeats for each visible frame.');
  add('  if (start === undefined) {','Ask whether this is the first visible frame. This avoids recording a time in setup before the v2 clock resets.');
  add('    start = millis();','Remember the clock reading when the visible experience actually begins.');
  add('  }','Close the first-frame check. Later frames keep the same starting reading.');
  add('  const t = constrain((millis() - start) / 60000, 0, 1);','Subtract the start, divide milliseconds by sixty thousand, then clamp to a progress fraction from 0 to 1.');
  add('  paintTiles(t * strength);','Use elapsed progress to grow the transformation toward the chosen strength. No source pixels are overwritten.');
  add('}','Close this drawing frame.');
 }
 if(stage>=3){add('function paintTiles(amount) {','Define one reusable rule. Its parameter amount receives the current color-change fraction.');add('  background(12, 18, 28);','Clear previous canvas marks. The original image buffer remains unchanged.');tileLoop('  ',stage,true);add('}','Close the reusable tile drawing function.');}
 if(stage>=5){add('function mousePressed() {','Define a replay action triggered by a mouse press on the sketch.');add('  start = millis();','Start a fresh minute while preserving the same source and color rules.');add('}','Close the replay action.');add('function windowResized() {','Define what happens when the available viewport dimensions change.');add('  resizeCanvas(windowWidth, windowHeight);','Resize the canvas. Fraction-based destination positions adapt to the new dimensions.');add('}','Close the resizing action.');}
 function tileLoop(p,s,colors){
  add(p+'for (let y = 0; y < picture.height; y += tile) {','Visit source rows from top to bottom. Each step adds tile; the test stops before the source height.');
  add(p+'  for (let x = 0; x < picture.width; x += tile) {','For the current row, visit columns from left to right. The source width determines the valid column range.');
  if(s===1){add(p+'    const shade = picture.get(x, y);','Sample one source pixel as a four-value RGBA list: red, green, blue and opacity.');add(p+'    fill(shade[0], shade[1], shade[2], shade[3]);','Choose the sampled channels. The first list index is 0, not 1.');}
  else{
   add(p+'    const i = 4 * (x + y * picture.width);','Skip y whole source rows, then x source pixels, then multiply by four RGBA entries per pixel.');
   add(p+'    const r = picture.pixels[i];','Read the original red channel at the first entry of this sampled pixel.');add(p+'    const g = picture.pixels[i + 1];','Read green from the next entry. The +1 changes the channel position, not the green value.');add(p+'    const b = picture.pixels[i + 2];','Read blue. Alpha is at i+3; this opaque-source starter draws opaque tiles.');
   if(!colors)add(p+'    fill(r, g, b);','Use the source red, green and blue without transforming them.');
   else{
    if(o.mode==='invert'){add(p+'    const targetR = 255 - r;','Choose an inverted red endpoint. Subtracting from 255 reverses the channel.');add(p+'    const targetG = 255 - g;','Choose the inverted green endpoint.');add(p+'    const targetB = 255 - b;','Choose the inverted blue endpoint.');}
    else{add(p+'    const gray = (r + g + b) / 3;','Average three channels to make a simple gray target. This exercise is not a perceptual brightness model.');
     if(o.mode==='focus'){add(p+'    let targetR = r;','Begin by keeping the original red endpoint. Let allows reassigning it in the outside-region branch.');add(p+'    let targetG = g;','Begin by keeping the original green endpoint.');add(p+'    let targetB = b;','Begin by keeping the original blue endpoint.');add(p+'    if (x / picture.width >= focus) {','Convert source x to a width fraction. Only the region at or beyond the chosen boundary loses color.');add(p+'      targetR = gray;','Set the outside-region red endpoint to the shared gray value.');add(p+'      targetG = gray;','Set green to that same gray endpoint.');add(p+'      targetB = gray;','Set blue to that same gray endpoint. Equal RGB channels form a gray.');add(p+'    }','Close the region condition. Inside samples keep their original endpoints.');}
     else{add(p+'    const targetR = gray;','Choose gray as the red endpoint for every sampled position.');add(p+'    const targetG = gray;','Choose the same gray as the green endpoint.');add(p+'    const targetB = gray;','Choose the same gray as the blue endpoint.');}}
    add(p+'    fill(lerp(r, targetR, amount), lerp(g, targetG, amount), lerp(b, targetB, amount));','Blend original channels toward their endpoints. Lerp at amount 0 gives the original; at 1 it gives the target.');
   }
  }
  add(p+'    rect(x / picture.width * width, y / picture.height * height, tile / picture.width * width, tile / picture.height * height);','Convert source positions and tile dimensions to fractions of the canvas, then draw one destination rectangle.');add(p+'  }','Close the column loop. After it finishes, the row loop advances y.');add(p+'}','Close the row loop after every sampled row has been drawn.');
 }
 return {lines,code:lines.map(l=>l[0]).join('\n'),options:o};
}
function mergeProgress(base,local,remote){
 const b=base||{},l=local||{},r=remote||{},bs=cleanState(b.studio),ls=cleanState(l.studio),rs=cleanState(r.studio);
 function maps(before,after,newest){before=before||{};after=after||{};const result={...newest};for(const k of new Set([...Object.keys(before),...Object.keys(after)])){if(before[k]!==after[k]){if(Object.hasOwn(after,k))result[k]=after[k];else delete result[k];}}return result;}
 function lists(before,after,newest){const a=new Set(before||[]),z=new Set(after||[]),result=new Set(newest||[]);for(const id of new Set([...a,...z]))if(a.has(id)!==z.has(id)){if(z.has(id))result.add(id);else result.delete(id);}return [...result];}
 return {...r,completed:lists(b.completed,l.completed,r.completed),notes:maps(b.notes,l.notes,r.notes),studio:{...rs,options:maps(bs.options,ls.options,rs.options),completed:lists(bs.completed,ls.completed,rs.completed),notes:maps(bs.notes,ls.notes,rs.notes),walkthrough:maps(bs.walkthrough,ls.walkthrough,rs.walkthrough)}};
}
return {cleanState,guidePosition,transformRGB,sampleAt,buildProject,mergeProgress};
});
