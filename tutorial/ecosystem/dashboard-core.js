(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.studioDashboardCore = factory();
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  function validContext(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || !Number.isInteger(value.stage)) return null;
    if (value.kind === 'stage' && value.stage >= 1 && value.stage <= 7) return {kind:'stage', stage:value.stage};
    if (value.kind === 'loops' && value.stage === 2 && (value.mode === 'row' || value.mode === 'grid')) return {kind:'loops', stage:2, mode:value.mode};
    return null;
  }
  function resumePath(value) {
    const context = validContext(value) || {kind:'stage',stage:1};
    return context.kind === 'stage' ? './learn.html?view=editor#stage-' + context.stage : './loops.html?mode=' + context.mode + '&view=editor';
  }
  function completedStages(workbook) {
    const studio = workbook && workbook.studio;
    return [...new Set((studio && Array.isArray(studio.completed) ? studio.completed : []).filter(id => typeof id === 'string' && /^studio-[0-6]$/.test(id) && id.length === 8))];
  }
  function nextStop(value) {
    const context=validContext(value);
    if(!context)return null;
    if(context.kind==='loops')return context.mode==='row'?{kind:'loops',stage:2,mode:'grid'}:{kind:'stage',stage:2};
    if(context.stage===1)return {kind:'loops',stage:2,mode:'row'};
    if(context.stage===7)return {kind:'finish',section:'Finish'};
    return {kind:'stage',stage:context.stage+1};
  }
  return {validContext, resumePath, completedStages, nextStop};
});
