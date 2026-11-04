(function(){
 'use strict';
 const core=window.groupStudyCore,lessons=window.groupLessons,$=id=>document.getElementById(id),steps=lessons.steps;
 let current=0,seconds=0,playing=false,origin=0,frame=0,ready=false,failure='',source=null,painter=null,wanted={x:160,y:120},selected={x:160,y:120},sample=null;
 const number=value=>Number(value.toFixed(2)).toLocaleString('en-US'),rgb=values=>'rgb('+values.join(',')+')';
 const add=(host,tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;host.append(node);return node;};
 function formula(host,text){return add(host,'div',text,'formula');}
 function flow(host,items){const row=add(host,'div',undefined,'flow');items.forEach((text,i)=>{if(i)add(row,'b','→');add(row,'span',text);});}
 function svgNode(tag,attributes,parent){const node=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attributes).forEach(([key,value])=>node.setAttribute(key,String(value)));parent.append(node);return node;}
 function graphic(host,className,width,height,label){return svgNode('svg',{viewBox:'0 0 '+width+' '+height,role:'img','aria-label':label,class:className},host);}
 function drawDiagram(){
  const host=$('diagram'),step=steps[current],time=core.timeline(seconds);host.replaceChildren();
  const headings={load:'Prepare once. Then draw.',time:'Seconds become progress.',grid:'Down a column. Then right.',pixels:'One address. Four values.',brightness:'RGB numbers become a size.',hue:'Source RGB → painted HSB.',circle:'A sample becomes a circle.'};
  $('diagram-title').textContent=headings[step.visual];
  if(step.visual==='load'){
   flow(host,['wait for image','resize to 400 × 400','read RGBA','draw frames']);
   add(host,'p','setup happens once. draw runs again for each frame. Our model loads sample.png; the original loads COLORFUL.avif.');return;
  }
  if(step.visual==='time'){
   flow(host,[number(seconds)+' seconds',number(seconds*1000)+' ms',number(time.progress)+' progress']);
   formula(host,number(seconds*1000)+' ÷ 60,000 = '+number(time.progress));
   add(host,'p',seconds===60?'Progress stays at 1. The final picture holds.':'Move the time slider. Half a minute gives half the progress.');return;
  }
  if(step.visual==='grid'){
   const svg=graphic(host,'mini-grid',300,120,'Grid traversal: down each column, then right to the next column.');
   for(let col=0;col<7;col++)for(let row=0;row<4;row++)svgNode('circle',{cx:30+col*36,cy:12+row*29,r:3,fill:col===0?'#c5efac':'#647881'},svg);
   svgNode('path',{d:'M 30 15 V 99 M 25 92 L 30 99 L 35 92 M 39 99 H 55 V 12 H 66 M 59 7 L 66 12 L 59 17',fill:'none',stroke:'#8edbe1','stroke-width':2},svg);
   formula(host,'sz = '+time.spacing+' px → '+time.count.toLocaleString('en-US')+' sample positions');
   add(host,'p','Diagram shows the order, not every dot. x chooses a column; y moves down it. Larger spacing means fewer samples.');return;
  }
  if(!sample){add(host,'p',failure||'The source image is loading. Its actual pixel values will appear here.');if(failure){const link=add(host,'a','Open the original sketch ↗');link.href=lessons.source.url;link.target='_blank';link.rel='noopener';}return;}
  if(step.visual==='pixels'){
   formula(host,'('+selected.y+' × 400 + '+selected.x+') × 4 = '+sample.index.toLocaleString('en-US'));
   const slots=add(host,'div',undefined,'slots');sample.rgba.forEach((value,i)=>{const slot=add(slots,'div',['R','G','B','A'][i]+' = '+value);add(slot,'small','['+(sample.index+i)+']');});
   add(host,'p','i is the first address. i + 1 and i + 2 read green and blue. Alpha is the fourth value; this sketch does not use it for the circles.');return;
  }
  if(step.visual==='brightness'){
   formula(host,'('+sample.rgba.slice(0,3).join(' + ')+') ÷ 3 = '+number(sample.bright));
   flow(host,['average '+number(sample.bright),'d = '+number(sample.radius),'diameter '+number(sample.diameter)+' px']);
   add(host,'p','This is an equal RGB average, not perceived brightness. At black, diameter is 0. At white, it is twice the spacing.');return;
  }
  if(step.visual==='hue'){
   const strip=add(host,'div',undefined,'hue-strip');const background=add(strip,'i');background.style.left=(time.hue/360*100)+'%';const circle=add(strip,'i');circle.style.left=(sample.hue/360*100)+'%';circle.style.background='#10191d';
   const swatches=add(host,'div',undefined,'swatches');const back=add(swatches,'span',undefined,'swatch');back.style.background=rgb(core.hsbRGB(time.hue,100));add(swatches,'span','Background '+number(time.hue)+'°');const dot=add(swatches,'span',undefined,'swatch');dot.style.background=rgb(core.hsbRGB(sample.hue,sample.outputBrightness));add(swatches,'span','Circle '+number(sample.hue)+'°');
   formula(host,'('+number(time.hue)+' + 180 + '+number(sample.bright)+' × '+number(time.progress)+') % 360 = '+number(sample.hue)+'°');
   add(host,'p','Drawing saturation = 100. Circle brightness = '+number(sample.outputBrightness)+'. The two hues are opposite at 0 seconds; brightness shifts the circle hue later.');return;
  }
  const svg=graphic(host,'mini-circle',240,220,'A grid cell with a sample at its top-left and a circle centered half a step right and down.');
  svgNode('rect',{x:0,y:0,width:240,height:220,fill:rgb(core.hsbRGB(time.hue,100))},svg);
  svgNode('circle',{cx:120,cy:110,r:sample.bright/255*100,fill:rgb(core.hsbRGB(sample.hue,sample.outputBrightness))},svg);
  svgNode('rect',{x:70,y:60,width:100,height:100,fill:'none',stroke:'#e5efec','stroke-dasharray':'4 3'},svg);
  svgNode('circle',{cx:70,cy:60,r:4,fill:'white',stroke:'#101820'},svg);svgNode('path',{d:'M 113 110 H 127 M 120 103 V 117',stroke:'#fff','stroke-width':2},svg);
  formula(host,'center = ('+number(selected.x+time.spacing/2)+', '+number(selected.y+time.spacing/2)+') · diameter = '+number(sample.diameter)+' px');
  add(host,'p','White dot: sampled corner. Cross: circle center. Dashed square: one grid cell. The circle can extend into nearby cells.');
 }
 function selectStep(index,writeHash=true){
  current=Math.max(0,Math.min(steps.length-1,index));const step=steps[current];
  $('step-section').textContent=step.section.toUpperCase();$('step-position').textContent=(current+1)+' / '+steps.length;
  $('line-number').textContent='SOURCE LINE '+step.line;$('step-title').textContent=step.title;$('step-meaning').textContent=step.meaning;$('step-detail').textContent=step.detail;$('step-try').textContent=step.try;
  $('step-select').value=String(current);$('previous').disabled=current===0;$('next').disabled=current===steps.length-1;
  document.querySelectorAll('[data-section]').forEach(button=>{if(button.dataset.section===step.section)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
  if(writeHash)history.replaceState(null,'','#line-'+step.line);drawDiagram();
 }
 function update(){
  const time=core.timeline(seconds);seconds=time.seconds;selected=core.snapPoint(wanted.x,wanted.y,time.spacing);
  if(ready)sample=core.sampleAt(source.pixels,400,400,selected.x,selected.y,seconds);
  $('seconds').value=String(seconds);$('seconds-output').textContent=number(seconds)+' s / 60 s';$('hue-value').textContent=number(time.hue)+'°';$('spacing-value').textContent=time.spacing+' px';$('count-value').textContent=time.count.toLocaleString('en-US');
  $('time-state').textContent=playing?'Playing':seconds===60?'Final state · held':'Paused';$('play').textContent=playing?'Pause':seconds===60?'Play again':seconds===0?'Play 60 seconds':'Play from here';
  $('sample-marker').style.left=(selected.x/400*100)+'%';$('sample-marker').style.top=(selected.y/400*100)+'%';
  if(sample)$('sample-caption').textContent='('+selected.x+', '+selected.y+')\nRGB '+sample.rgba.slice(0,3).join(', ');
  drawDiagram();if(ready&&painter)painter.redraw();
 }
 function stop(){playing=false;cancelAnimationFrame(frame);}
 function setTime(value){stop();seconds=core.timeline(value).seconds;update();}
 function tick(now){if(!playing)return;seconds=Math.min(60,(now-origin)/1000);if(seconds>=60)playing=false;update();if(playing)frame=requestAnimationFrame(tick);}
 steps.forEach((step,index)=>{const option=document.createElement('option');option.value=String(index);option.textContent='Line '+step.line+' · '+step.title;$('step-select').append(option);});
 $('step-select').addEventListener('change',()=>selectStep(Number($('step-select').value)));
 $('previous').addEventListener('click',()=>selectStep(current-1));$('next').addEventListener('click',()=>selectStep(current+1));
 document.querySelectorAll('[data-section]').forEach(button=>button.addEventListener('click',()=>selectStep(steps.findIndex(step=>step.section===button.dataset.section))));
 $('seconds').addEventListener('input',()=>setTime(Number($('seconds').value)));
 document.querySelectorAll('[data-seconds]').forEach(button=>button.addEventListener('click',()=>setTime(Number(button.dataset.seconds))));
 $('restart').addEventListener('click',()=>setTime(0));$('play').addEventListener('click',()=>{if(playing){stop();update();return;}if(seconds===60)seconds=0;playing=true;origin=performance.now()-seconds*1000;update();frame=requestAnimationFrame(tick);});
 $('show-cell').addEventListener('change',()=>{if(ready)painter.redraw();});
 $('source-pick').addEventListener('click',event=>{if(event.detail===0)return;const box=$('source-pick').getBoundingClientRect();wanted={x:(event.clientX-box.left)/box.width*400,y:(event.clientY-box.top)/box.height*400};update();});
 $('source-pick').addEventListener('keydown',event=>{const deltas={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(!deltas[event.key])return;event.preventDefault();const step=core.timeline(seconds).spacing,delta=deltas[event.key];wanted={x:Math.max(0,Math.min(399,selected.x+delta[0]*step)),y:Math.max(0,Math.min(399,selected.y+delta[1]*step))};update();});
 function view(original){stop();update();$('model-view').hidden=original;$('original-view').hidden=!original;$('show-model').setAttribute('aria-pressed',String(!original));$('show-original').setAttribute('aria-pressed',String(original));
  if(original&&!$('original-frame').firstChild){const iframe=document.createElement('iframe');iframe.title='Samuel Goldman’s original p5 editor';iframe.src=lessons.source.url;iframe.loading='lazy';$('original-frame').append(iframe);}
 }
 $('show-original').addEventListener('click',()=>view(true));$('show-model').addEventListener('click',()=>view(false));
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();update();}});window.addEventListener('pagehide',stop);
 const fromHash=()=>{const line=Number(location.hash.replace('#line-','')),index=steps.findIndex(step=>step.line===line);if(index>=0)selectStep(index,false);};window.addEventListener('hashchange',fromHash);
 selectStep(0,false);fromHash();update();$('play').disabled=true;
 function failed(message){failure=message;$('model-status').textContent=message;$('sample-caption').textContent=message;$('play').disabled=true;drawDiagram();}
 if(typeof window.p5!=='function'){failed('p5 did not load. Reload or open the original.');return;}
 painter=new window.p5(p=>{
  p.setup=async()=>{
   const canvas=p.createCanvas(400,400);canvas.parent('model-canvas');canvas.elt.setAttribute('aria-label','Interactive teaching model: sampled window-and-plant pixels drawn as colored circles.');p.noLoop();p.noStroke();p.colorMode(p.HSB,360,100,100);
   try{source=await p.loadImage('../assets/sample.png');source.resize(400,400);source.loadPixels();if(source.pixels.length!==400*400*4)throw Error('Unexpected source density');ready=true;$('model-status').textContent='p5 ready · model';$('play').disabled=false;update();}
   catch(error){failed('Image did not load. Reload or open the original.');console.error('Group teaching model:',error);}
  };
  p.draw=()=>{
   if(!ready)return;const time=core.timeline(seconds),gap=time.spacing,bytes=source.pixels;p.background(time.hue,100,100);
   // Teaching implementation: owned source, preserving column-first order.
   for(let column=0;column<400;column+=gap)for(let row=0;row<400;row+=gap){
    const address=4*(400*row+column),mean=(bytes[address]+bytes[address+1]+bytes[address+2])/3;
    const hue=(time.hue+180+mean*time.progress)%360,diameter=2*gap*mean/255;
    p.fill(hue,100,50+50*mean/255);p.circle(column+gap/2,row+gap/2,diameter);
   }
   if($('show-cell').checked){p.push();p.noFill();p.stroke(0,0,0);p.strokeWeight(3);p.rect(selected.x,selected.y,gap,gap);p.stroke(0,0,100);p.strokeWeight(1);p.rect(selected.x,selected.y,gap,gap);p.pop();}
  };
 });
})();
