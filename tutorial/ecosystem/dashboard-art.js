(function(){
 'use strict';
 const image=new Image();let pixels=null;
 function pixel(x,y){const p=(Math.floor(y)*320+Math.floor(x))*4;return pixels.slice(p,p+3);}
 function mosaic(ctx,w,h,tile,seconds=0,focus=false){
  const t=Math.max(0,Math.min(1,seconds/60));
  for(let y=0;y<240;y+=tile)for(let x=0;x<320;x+=tile){
   const [r,g,b]=window.projectCore.transformRGB(Array.from(pixel(x,y)),{mode:focus?'focus':'gray',focus:.4},x/320,focus?t:0);
   ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fillRect(x*w/320,y*h/240,Math.ceil(tile*w/320),Math.ceil(tile*h/240));
  }
 }
 function outline(ctx,w,h){ctx.strokeStyle='#c9ef9b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w*.4,0);ctx.lineTo(w*.4,h);ctx.stroke();}
 function paint(canvas){
  if(!pixels)return;
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,stage=Number(canvas.dataset.stage);
  ctx.clearRect(0,0,w,h);ctx.imageSmoothingEnabled=false;
  if(stage===1)ctx.drawImage(image,0,0,w,h);
  else if(stage===2)mosaic(ctx,w,h,16);
  else if(stage===3){
   ctx.drawImage(image,0,0,w,h);ctx.fillStyle='rgba(11,15,18,.92)';ctx.fillRect(0,h-55,w,55);
   const values=pixels.slice(4*(120*320+160),4*(120*320+160)+4),colors=['#ed9c9c','#afdba8','#9dd8eb','#e9e9da'];
   values.forEach((v,i)=>{ctx.fillStyle=colors[i];ctx.fillRect(12+i*57,h-26,45*v/255,4);ctx.font='11px Consolas,monospace';ctx.fillText('RGBA'[i]+' '+v,12+i*57,h-34);});
   ctx.strokeStyle='#c9ef9b';ctx.lineWidth=2;ctx.strokeRect(w/2-5,h/2-5,10,10);
  }else if(stage===4||stage===5){mosaic(ctx,w,h,8,stage===4?60:35,true);outline(ctx,w,h);}
  else if(stage===6){ctx.fillStyle='#10161c';ctx.fillRect(0,0,w,h);ctx.drawImage(image,8,26,w*.62,h*.65);ctx.drawImage(image,w*.69,26,w*.27,h*.65);ctx.strokeStyle='#9dd8eb';ctx.strokeRect(8,26,w*.62,h*.65);ctx.strokeRect(w*.69,26,w*.27,h*.65);ctx.fillStyle='#d8dfd6';ctx.font='11px Consolas,monospace';ctx.fillText('wide',10,h-12);ctx.fillText('narrow',w*.69,h-12);}
  else{[32,16,8].forEach((tile,i)=>{ctx.save();ctx.beginPath();ctx.rect(i*w/3,0,w/3,h);ctx.clip();mosaic(ctx,w,h,tile,i*30,true);ctx.restore();});ctx.fillStyle='#0e141bea';ctx.fillRect(0,h-24,w,24);ctx.fillStyle='#d8dfd6';ctx.font='11px Consolas,monospace';['try 1','try 2','try 3'].forEach((s,i)=>ctx.fillText(s,i*w/3+12,h-8));}
 }
 function paintAll(parent=document){parent.querySelectorAll('canvas[data-stage]').forEach(paint);}
 function hero(){const canvas=document.getElementById('dashboard-demo'),slider=document.getElementById('dashboard-time');if(!canvas||!slider||!pixels)return;const seconds=Number(slider.value),ctx=canvas.getContext('2d');mosaic(ctx,canvas.width,canvas.height,8,seconds,true);outline(ctx,canvas.width,canvas.height);document.getElementById('dashboard-time-value').textContent=seconds+' s';document.getElementById('dashboard-demo-caption').textContent=seconds===0?'Start · all the image has color.':seconds===60?'60 seconds · the focus keeps its color.':'The outside slowly loses color.';}
 window.studioArt={paintAll};
 function init(){const slider=document.getElementById('dashboard-time');if(slider)slider.addEventListener('input',hero);paintAll();hero();}
 image.onload=()=>{const c=document.createElement('canvas');c.width=320;c.height=240;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);pixels=ctx.getImageData(0,0,320,240).data;paintAll();hero();};
 image.onerror=()=>{document.querySelectorAll('canvas[data-stage]').forEach(c=>{const p=document.createElement('p');p.textContent='Source image unavailable. Open this stage for the guide.';c.replaceWith(p);});const caption=document.getElementById('dashboard-demo-caption');if(caption)caption.textContent='Source image unavailable. Check the local service.';};
 image.src='../assets/sample.png';if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
