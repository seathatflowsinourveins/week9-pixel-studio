(function(){
 'use strict';const F=window.pixelFlowCore,C=window.projectCore;if(!F||!C)return;
 function node(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
 function button(text,fn){const b=node('button',text);b.type='button';b.addEventListener('click',fn);return b;}
 const rgb=v=>'rgb('+v.slice(0,3).join(',')+')',fmt=n=>Number.isInteger(n)?String(n):n.toFixed(2);
 function mount({container,pixels,onSample,onTarget,preview}){
  const root=node('section',undefined,'pixel-flow'),head=node('div',undefined,'flow-head');root.setAttribute('aria-label','Follow one source pixel');
  head.append(node('h3','Follow one pixel'),node('span','Click the source. Use arrow keys.','flow-hint'));root.append(head);
  const images=node('div',undefined,'flow-images'),sourceFigure=node('figure'),destinationFigure=node('figure'),source=node('canvas'),destination=node('canvas');
  for(const canvas of [source,destination]){canvas.width=320;canvas.height=240;canvas.setAttribute('role','img');}
  source.id='flow-source';source.tabIndex=0;source.setAttribute('aria-label','Source image. Arrow keys move one sampled tile.');source.setAttribute('aria-keyshortcuts','ArrowLeft ArrowRight ArrowUp ArrowDown');
  const sourceLabel=node('figcaption','SOURCE · 320 × 240'),destinationLabel=node('figcaption','REAL p5 · 640 × 480');sourceFigure.append(sourceLabel,source);destinationFigure.append(destinationLabel,preview||destination);images.append(sourceFigure,destinationFigure);root.append(images);
  const form=node('div',undefined,'flow-location'),x=node('input'),y=node('input');
  for(const [input,label] of [[x,'Source x'],[y,'Source y']]){input.type='number';input.min='0';input.max=input===x?'319':'239';input.setAttribute('aria-label',label);const wrap=node('label',label);wrap.append(input);form.append(wrap);}
  let state={},current=null,activeRole='source',lastPoint='';
  const go=()=>onSample(Number(x.value),Number(y.value));
  form.append(button('Go',go));const jump=button('(16, 16)',()=>onSample(16,16));jump.title='Select source (16,16) when tile is 16';form.append(jump);root.append(form);
  const nav=node('div',undefined,'flow-samples');nav.append(button('← Sample',()=>onSample(current.x-current.tile,current.y,true,-1)),button('Next sample →',()=>onSample(current.x+current.tile,current.y,true,1)));root.append(nav);
  const phases=node('div',undefined,'flow-phases');phases.setAttribute('aria-label','Follow the code');const phaseNodes={};
  for(const [key,label,target] of [['source','1 · Read','sample'],['values','2 · RGBA','green'],['fill','3 · Fill','fill'],['draw','4 · Draw','rect']]){const b=button(label,()=>onTarget(target));b.dataset.flowRole=key;phases.append(b);phaseNodes[key]=b;}root.append(phases);
  const address=node('p',undefined,'flow-address'),values=node('div',undefined,'flow-values');root.append(address,values);
  const channelNodes=['R','G','B','A'].map((name,i)=>{const d=node('div',undefined,'flow-channel'),n=node('strong'),where=node('small'),bar=node('i');d.style.setProperty('--channel',['#ed9c9c','#a5d8a3','#9dd8eb','#d2ddca'][i]);d.append(node('span',name),n,where,bar);values.append(d);return {n,where,bar};});
  const explain=node('p',undefined,'flow-explain'),swatches=node('div',undefined,'flow-swatches'),colorNodes={};
  for(const key of ['original','target','current']){const box=node('div'),swatch=node('i'),value=node('span');box.append(node('small',key==='original'?'Original':key==='target'?'Target':'Now'),swatch,value);swatches.append(box);colorNodes[key]={swatch,value};}
  const clock=node('p',undefined,'flow-equation'),drawLine=node('code',undefined,'flow-draw-line'),status=node('p',undefined,'sr-only');status.setAttribute('aria-live','polite');root.append(explain,swatches,clock,drawLine,status);container.append(root);
  const original=document.createElement('canvas');original.width=320;original.height=240;original.getContext('2d').putImageData(new ImageData(pixels,320,240),0,0);
  source.addEventListener('click',event=>{const box=source.getBoundingClientRect();onSample((event.clientX-box.left)/box.width*320,(event.clientY-box.top)/box.height*240);});
  source.addEventListener('keydown',event=>{const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(!directions[event.key]||!current)return;event.preventDefault();const [dx,dy]=directions[event.key];onSample(current.x+dx*current.tile,current.y+dy*current.tile);});
  for(const input of [x,y])input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();go();}});
  function outline(ctx,x,y,w,h){ctx.strokeStyle='#091015';ctx.lineWidth=5;ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.strokeStyle='#d0efa0';ctx.lineWidth=2;ctx.strokeRect(x+.5,y+.5,w-1,h-1);}
  function paint(){
   const s=current,ctx=source.getContext('2d'),out=destination.getContext('2d');ctx.drawImage(original,0,0);ctx.strokeStyle='#eaf5ed40';ctx.lineWidth=.5;ctx.beginPath();for(let xx=0;xx<320;xx+=s.tile){ctx.moveTo(xx,0);ctx.lineTo(xx,240);}for(let yy=0;yy<240;yy+=s.tile){ctx.moveTo(0,yy);ctx.lineTo(320,yy);}ctx.stroke();outline(ctx,s.x,s.y,s.tile,s.tile);
   if(!preview){out.clearRect(0,0,320,240);for(let yy=0;yy<240;yy+=s.tile)for(let xx=0;xx<320;xx+=s.tile){const at=4*(yy*320+xx),v=Array.from(pixels.slice(at,at+3)),color=state.stage>=3?C.transformRGB(v,state.options,xx/320,s.amount):v;out.fillStyle=rgb(color);out.fillRect(xx,yy,s.tile,s.tile);}outline(out,s.x,s.y,s.tile,s.tile);}
   destination.setAttribute('aria-label','Mosaic output. Highlighted tile at canvas ('+fmt(s.destination.x)+', '+fmt(s.destination.y)+'), RGB '+s.current.join(', ')+'.');
  }
  function focus(role){activeRole=role||activeRole;root.dataset.focus=activeRole;for(const [key,b] of Object.entries(phaseNodes))b.setAttribute('aria-pressed',String(key===activeRole||(key==='values'&&activeRole==='address')||(key==='fill'&&activeRole==='transform')));}
  function update(next){state={...state,...next};state.options=C.cleanState({options:state.options}).options;current=F.sample(pixels,state);const s=current;root.hidden=state.stage===0;if(root.hidden)return;
   if(document.activeElement!==x)x.value=s.x;if(document.activeElement!==y)y.value=s.y;x.step=y.step=s.tile;jump.disabled=s.tile!==16;
   destinationLabel.textContent='REAL p5 · '+s.canvasW+' × '+s.canvasH;
   address.textContent='i = 4 × ('+s.x+' + '+s.y+' × 320) = '+s.index;
   channelNodes.forEach((part,i)=>{part.n.textContent=s.rgba[i];part.where.textContent='address '+s.addresses[i];part.bar.style.width=(s.rgba[i]/255*100)+'%';});
   explain.textContent='Address = where. Value = how much color.';
   for(const [key,part] of Object.entries(colorNodes)){part.swatch.style.backgroundColor=rgb(s[key]);part.value.textContent=s[key].join(', ');}swatches.hidden=state.stage<3;
   clock.hidden=state.stage<3;clock.textContent=state.stage>=4?s.seconds.toFixed(1)+' / 60 = '+s.t.toFixed(2)+' · × '+state.options.strength.toFixed(2)+' = '+s.amount.toFixed(2)+' amount'+(state.teaching?' · paused inspection':' · real clock'):'Static strength = '+s.amount.toFixed(2);
   const d=s.destination;drawLine.textContent='rect('+[d.x,d.y,d.w,d.h].map(fmt).join(', ')+');';
   const point=s.x+','+s.y;if(point!==lastPoint){status.textContent='Source ('+s.x+', '+s.y+'), RGBA '+s.rgba.join(', ');lastPoint=point;}focus(state.role);paint();
  }
  return {update,focus,element:root,attachPreview(){if(preview&&preview.parentElement!==destinationFigure)destinationFigure.append(preview);}};
 }
 function bridge(container){
  const root=node('section',undefined,'sampling-bridge');root.append(node('p','NEXT · CHANGE WHERE YOU READ','eyebrow'),node('h3','One color → many colors.'),node('p','Outside the loops: read once. Inside: read again for every tile.','quiet'));
  const images=node('div',undefined,'flow-images'),pairs=[];
  for(const [label,code] of [['Read once','get(160, 120) before the loops'],['Read each tile','get(x, y) inside the loops']]){const fig=node('figure'),canvas=node('canvas');canvas.width=320;canvas.height=240;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',label+' comparison');fig.append(node('figcaption',label),canvas,node('p',code));images.append(fig);pairs.push(canvas);}root.append(images);
  const slider=node('input');slider.type='range';slider.min='8';slider.max='40';slider.step='8';slider.value='16';slider.setAttribute('aria-label','Comparison tile size');const label=node('label','Try tile size '),value=node('output','16');label.append(value,slider);root.append(label);const link=node('a','Then build the mosaic →');link.href='./learn.html?view=editor#stage-2';root.append(link);container.append(root);
  const image=new Image();let data;function paint(){if(!data)return;const tile=Number(slider.value);value.textContent=tile;const center=4*(120*320+160),one=Array.from(data.slice(center,center+3));for(let side=0;side<2;side++){const ctx=pairs[side].getContext('2d');ctx.clearRect(0,0,320,240);for(let y=0;y<240;y+=tile)for(let x=0;x<320;x+=tile){const i=4*(y*320+x);ctx.fillStyle=rgb(side?Array.from(data.slice(i,i+3)):one);ctx.fillRect(x,y,tile,tile);}}}
  image.onload=()=>{const c=document.createElement('canvas');c.width=320;c.height=240;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);data=ctx.getImageData(0,0,320,240).data;paint();};image.onerror=()=>{label.textContent='The source image could not load.';};image.src='../assets/sample.png';slider.addEventListener('input',paint);
 }
 window.pixelFlow={mount,bridge};
})();
