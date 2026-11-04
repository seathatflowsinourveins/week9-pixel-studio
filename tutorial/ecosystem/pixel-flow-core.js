(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('../project-core.cjs'));else root.pixelFlowCore=factory(root.projectCore);})(typeof globalThis==='object'?globalThis:this,function(C){
 'use strict';
 const ACTION_TARGETS=[['setup','image','load','setup','setup','load','load','image','canvas'],['tile','loop-y','sample','loop-y','tile','rect','rect'],['index','index','index','green','picture-density','fill'],['condition','condition','focus','fill','target','condition'],['clock-init','clock-init','progress','amount','progress','progress'],['canvas','progress','replay','resize','resize','replay'],['setup','setup','amount','progress','setup','canvas','setup']];
 const patterns={setup:/^async function setup/,image:/^image\(/,load:/await loadImage/,canvas:/createCanvas\(/,tile:/^const tile/, 'loop-y':/^for \(let y/,'loop-x':/^for \(let x/,sample:/picture\.get\(/,loadpixels:/picture\.loadPixels/,index:/^const i =/,green:/^const g =/,red:/^const r =/,blue:/^const b =/,'picture-density':/^picture\.pixelDensity/,fill:/^fill\(/,condition:/^if \(x \/ picture.width/,focus:/^const focus/,target:/^(?:let|const) targetR/, 'clock-init':/^if \(start === undefined/,progress:/^const t =/,amount:/^paintTiles\(t \* strength/,replay:/^function mousePressed/,resize:/resizeCanvas\(/,rect:/^rect\(/};
 function targetLine(lines,target){const pattern=patterns[target];if(!pattern)return -1;return lines.findIndex(item=>pattern.test((Array.isArray(item)?item[0]:item).trim()));}
 function actionLine(lines,target){const fallback={condition:['target'],focus:['target'],green:['sample','index'],sample:['index']};for(const key of [target,...(fallback[target]||[]),'fill','setup']){const index=targetLine(lines,key);if(index>=0)return index;}return -1;}
 function role(code){code=String(code||'').trim();if(/60000|millis\(|^let start|^function draw/.test(code))return 'time';if(/^const i =/.test(code))return 'address';if(/picture\.pixels\[/.test(code))return 'values';if(/target|gray|focus|lerp|paintTiles\(t/.test(code))return 'transform';if(/^fill\(/.test(code))return 'fill';if(/^rect\(|^image\(/.test(code))return 'draw';if(/picture\.get|loadPixels|loadImage/.test(code))return 'source';if(/^for |^const tile/.test(code))return 'source';return 'source';}
 const bounded=(n,max,fallback)=>Number.isFinite(Number(n))?Math.max(0,Math.min(max,Number(n))):fallback;
 function position(x,y,tile=16,w=320,h=240){tile=Math.max(1,Math.round(Number(tile)||16));x=Math.floor(bounded(x,w-1,0)/tile)*tile;y=Math.floor(bounded(y,h-1,0)/tile)*tile;return {x,y,order:Math.floor(y/tile)*Math.ceil(w/tile)+Math.floor(x/tile)};}
 function sample(pixels,value={}){
  const w=value.sourceW||320,h=value.sourceH||240;if(!pixels||pixels.length!==w*h*4)throw Error('A complete density-one source buffer is required.');
  const options=C.cleanState({options:value.options}).options,tile=value.tile||options.tile,p=position(value.x,value.y,tile,w,h),index=4*(p.x+p.y*w),rgba=Array.from(pixels.slice(index,index+4));
  const stage=Number(value.stage)||0,seconds=bounded(value.seconds,60,0),t=seconds/60,amount=stage>=4?t*options.strength:stage>=3?options.strength:0;
  const original=rgba.slice(0,3),target=stage>=3?C.transformRGB(original,options,p.x/w,1):original.slice(),current=stage>=3?C.transformRGB(original,options,p.x/w,amount):original.slice();
  const canvasW=value.canvasW||640,canvasH=value.canvasH||480;
  return {...p,index,rgba,addresses:[index,index+1,index+2,index+3],original,target,current,seconds,t,amount,tile,sourceW:w,sourceH:h,canvasW,canvasH,destination:{x:p.x/w*canvasW,y:p.y/h*canvasH,w:tile/w*canvasW,h:tile/h*canvasH}};
 }
 function lineExample(pixels,state,code){
  if(Number(state.stage)<1)return null;
  const s=sample(pixels,state),text=String(code).trim(),n=value=>Number.isInteger(value)?String(value):String(Number(value.toFixed(2)));
  const context='Selected source ('+s.x+', '+s.y+') · Teaching preview';
  const result=(title,expression,meaning,swatch)=>({title,expression,meaning,context,swatch});
  if(/^const i =/.test(text))return result('Find the first address','4 × ('+s.x+' + '+s.y+' × '+s.sourceW+') = '+s.index,'Address '+s.index+' is where this pixel’s red amount is stored.');
  const channel=text.match(/picture\.pixels\[i(?:\s*\+\s*([123]))?\]/);
  if(channel){const offset=Number(channel[1]||0),name=['red','green','blue','alpha'][offset],value=s.rgba[offset];return result('Read '+name,'pixels['+s.addresses[offset]+'] → '+value,offset===3?'Alpha '+value+(value===255?' makes this pixel opaque.':value===0?' makes this pixel transparent.':' gives this pixel partial opacity.'):'Address '+s.addresses[offset]+' stores '+value+' for '+name+'.');}
  if(/picture\.get\(/.test(text))return result('Read one pixel','get('+s.x+', '+s.y+') → ['+s.rgba.join(', ')+']','These four amounts are red, green, blue and alpha.',s.original);
  if(/^fill\(/.test(text)){if(Number(state.stage)>=3)return result('Drawing color · rounded RGB','Output RGB ≈ ['+s.current.join(', ')+']','These whole-number color amounts fill the next teaching-preview rectangle.',s.current);const values=/shade\[3\]/.test(text)?s.rgba:s.current;return result('Choose the drawing color','fill('+values.join(', ')+')','This color will fill the next rectangle in the teaching preview.',s.current);}
  if(/^rect\(/.test(text)){const d=s.destination;return result('Draw one block','rect('+[d.x,d.y,d.w,d.h].map(n).join(', ')+')','Place a block at canvas ('+n(d.x)+', '+n(d.y)+'), '+n(d.w)+' wide and '+n(d.h)+' tall.',s.current);}
  if(/^const tile|^for /.test(text)){const cols=Math.ceil(s.sourceW/s.tile),rows=Math.ceil(s.sourceH/s.tile);return result('Repeat across the picture',cols+' columns × '+rows+' rows = '+cols*rows+' blocks','A sampling step of '+s.tile+' visits one source pixel for each block.');}
  if(/^if \(x \/ picture.width/.test(text)){const focus=C.cleanState({options:state.options}).options.focus,changes=s.x/s.sourceW>=focus;return result('Test this pixel’s position',s.x+' ÷ '+s.sourceW+' ≥ '+n(focus)+' → '+changes,changes?'This sample is at or beyond the boundary: use the changed colors.':'This sample is before the boundary: keep its original colors.');}
  if(/^const gray =/.test(text)){const gray=s.original.reduce((sum,value)=>sum+value,0)/3;return result('Find an average gray','('+s.original.join(' + ')+') ÷ 3 = '+n(gray),'Use equal red, green and blue amounts for the gray target.');}
  if(/paintTiles\(t \* strength\)/.test(text)){const strength=C.cleanState({options:state.options}).options.strength;return result('Combine time and strength',n(s.seconds)+' ÷ 60 × '+n(strength)+' = '+n(s.amount),'This is the teaching preview’s change amount. Your sketch has its own clock.');}
  if(/^const t =/.test(text))return result('Read progress through a minute',n(s.seconds)+' ÷ 60 = '+n(s.t),'The teaching preview is '+n(s.t*100)+'% through the minute. Your sketch runs independently.');
  return null;
 }
 return {sample,position,role,targetLine,actionLine,ACTION_TARGETS,lineExample};
});
