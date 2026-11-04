(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.groupStudyCore=api;})(typeof window==='object'?window:this,function(){
 'use strict';
 const finite=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
 const clamp=(value,lo,hi)=>Math.max(lo,Math.min(hi,value));
 function timeline(value){
  const seconds=clamp(finite(value),0,60),progress=seconds/60,spacing=Math.floor(5+20*progress);
  return {seconds,progress,hue:30+190*progress,spacing,count:Math.ceil(400/spacing)**2};
 }
 function snapPoint(x,y,spacing){
  const step=clamp(Math.floor(finite(spacing,5)),1,400);
  return {x:Math.floor(clamp(finite(x),0,399)/step)*step,y:Math.floor(clamp(finite(y),0,399)/step)*step};
 }
 function sampleAt(pixels,width,height,x,y,seconds){
  if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=width||y>=height)throw Error('Sample outside the source image.');
  if(!pixels||pixels.length!==width*height*4)throw Error('Expected a one-density RGBA image buffer.');
  const index=4*(width*y+x),rgba=Array.from(pixels.slice(index,index+4)),bright=(rgba[0]+rgba[1]+rgba[2])/3;
  const time=timeline(seconds),radius=time.spacing*bright/255;
  return {index,rgba,bright,radius,diameter:2*radius,hue:(time.hue+180+bright*time.progress)%360,outputBrightness:50+50*bright/255,outputAlpha:255};
 }
 function hsbRGB(hue,brightness){
  const h=((finite(hue)%360)+360)%360,v=clamp(finite(brightness),0,100)/100;
  const c=v,x=c*(1-Math.abs((h/60)%2-1));
  const channels=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
  return channels.map(value=>Math.round(value*255));
 }
 return {timeline,snapPoint,sampleAt,hsbRGB};
});
