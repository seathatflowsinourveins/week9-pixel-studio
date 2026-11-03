(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./assignment-core.js'),require('./editor-frame.js'));
  else root.accountProject=factory(root.assignmentCore,root.p5EditorHost);
})(typeof globalThis==='object'?globalThis:this,function(A,H){
  'use strict';
  function current(storage){
    const raw=storage.getItem(A.STORAGE_KEY);
    if(raw===null)return A.normalize({});
    const value=JSON.parse(raw);
    if(!value||typeof value!=='object'||Array.isArray(value)||(value.version!==undefined&&value.version!==1))throw Error('The Finish desk could not be read. Its saved data was kept.');
    return A.normalize(value);
  }
  function read(storage){
    const state=current(storage);
    try{return H.safeURL(state.links.code);}catch{return '';}
  }
  function save(storage,url){
    const safe=H.safeURL(url),state=current(storage);
    storage.setItem(A.STORAGE_KEY,JSON.stringify(A.patch(state,'links.code',safe)));
    return true;
  }
  return {read,save};
});
