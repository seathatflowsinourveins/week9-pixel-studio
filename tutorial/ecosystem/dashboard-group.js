(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./group-study-core.js'));
 else root.studioGroupStudy=factory(root.groupStudyCore);
})(typeof window==='object'?window:this,function(core){
 'use strict';
 function panelURL(href,open){const url=new URL(href);if(open)url.searchParams.set('panel','group-study');else url.searchParams.delete('panel');return url.href;}
 function create({host,document:doc,baseURL}){
  let frame=null,state=core.session({});
  function mount(){
   if(frame)return frame;
   const url=new URL('./group-study.html',baseURL),version=new URL(baseURL).searchParams.get('v');
   if(version)url.searchParams.set('v',version);
   url.searchParams.set('embedded','dashboard');url.searchParams.set('seconds',String(state.seconds));url.hash='line-'+state.line;
   frame=doc.createElement('iframe');frame.className='studio-group-frame';frame.title='Group study: source lines and interactive p5';frame.setAttribute('referrerpolicy','same-origin');frame.src=url.href;host.appendChild(frame);return frame;
  }
  function unmount(){
   if(!frame)return;
   try{const snapshot=frame.contentWindow?.groupStudySession?.snapshot();if(snapshot)state=core.session(snapshot);}catch{/* A failed child must still be removable. */}
   frame.remove();frame=null;
  }
  return {mount,unmount,owns:source=>!!frame&&frame.contentWindow===source};
 }
 return {panelURL,create};
});
