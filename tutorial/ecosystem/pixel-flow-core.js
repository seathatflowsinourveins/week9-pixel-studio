(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('../project-core.cjs'));else root.pixelFlowCore=factory(root.projectCore);})(typeof globalThis==='object'?globalThis:this,function(C){
 'use strict';
 const ACTION_TARGETS=[['setup','image','load','setup','setup','load','load','image','canvas'],['tile','loop-y','sample','loop-y','tile','rect','rect'],['loadpixels','index','index','green','picture-density','fill'],['condition','condition','focus','fill','target','condition'],['clock-init','clock-init','progress','amount','progress','progress'],['canvas','progress','replay','resize','resize','replay'],['setup','setup','amount','progress','setup','canvas','setup']];
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
 return {sample,position,role,targetLine,actionLine,ACTION_TARGETS};
});
