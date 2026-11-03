(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./course-core.js'));
  else root.progressTransferCore = factory(root.projectCore);
})(typeof globalThis === 'object' ? globalThis : this, function (projectCore) {
  'use strict';
  const MAX_BYTES = 2 * 1024 * 1024;
  const foundationIds = new Set([
    '00-start','01-language','02-coordinates','03-animation','04-decisions',
    '05-functions','06-mapping','07-loops','08-collections','09-color',
    '10-image','11-sampling','12-rgba','13-mirror','14-time','15-project',
    '16-slit','17-camera','18-video','19-debug'
  ]);
  const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const bounded = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
  function portable(value) {
    const result = {version:1};
    if (!record(value)) return result;
    const {session, resume, loop} = value;
    if (record(session) && bounded(session.stage,1,7) && bounded(session.line,0,100)) result.session = {stage:session.stage,line:session.line};
    if (record(resume) && bounded(resume.stage,1,7)) {
      if (resume.kind === 'stage') result.resume = {kind:'stage',stage:resume.stage};
      if (resume.kind === 'loops' && resume.stage === 2 && ['row','grid'].includes(resume.mode)) result.resume = {kind:'loops',stage:2,mode:resume.mode};
    }
    if (record(loop) && ['row','grid'].includes(loop.mode) && bounded(loop.index,0,loop.mode === 'grid' ? 78 : 17)) result.loop = {mode:loop.mode,index:loop.index};
    return result;
  }
  function normalize(value, requireIdentity) {
    if (!record(value) || !Array.isArray(value.completed) || !record(value.notes) || (requireIdentity && value.workbook !== 'icm-week9-v1')) {
      throw new Error('Choose a progress JSON exported by the Week 9 workbook or Pixel Studio.');
    }
    const result = {
      workbook:'icm-week9-v1',
      completed:[...new Set(value.completed.filter(id => foundationIds.has(id)))],
      notes:Object.fromEntries(Object.entries(value.notes).filter(([id,note]) => foundationIds.has(id) && typeof note === 'string').map(([id,note]) => [id,note.slice(0,20000)]))
    };
    if (record(value.studio)) {
      result.studio = projectCore.cleanState(value.studio);
      result.studio.completed = result.studio.completed.filter(id => typeof id === 'string');
    }
    if (Object.hasOwn(value, 'studioTransfer')) {
      if (!record(value.studioTransfer) || value.studioTransfer.version !== 1) throw new Error('This progress transfer version is not supported.');
      result.studioTransfer = portable(value.studioTransfer);
    }
    return result;
  }
  function parse(text) {
    if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_BYTES) throw new Error('Choose a JSON file no larger than 2 MB.');
    let value;
    try { value = JSON.parse(text.replace(/^\uFEFF/, '')); }
    catch { throw new Error('This file is not valid JSON. Choose an exported progress file.'); }
    return normalize(value, true);
  }
  function createExport(workbook, positions) {
    const result = normalize(workbook || {completed:[],notes:{}}, false);
    result.studio = projectCore.cleanState(result.studio);
    result.studioTransfer = portable(positions);
    return result;
  }
  function merge(local, incoming) {
    const left = normalize(local, false), right = normalize(incoming, true);
    const before = projectCore.cleanState(left.studio), after = right.studio;
    return {
      workbook:'icm-week9-v1',
      completed:[...new Set([...left.completed,...right.completed])],
      notes:{...left.notes,...right.notes},
      studio:after ? {
        options:{...before.options,...after.options},
        completed:[...new Set([...before.completed,...after.completed])],
        notes:{...before.notes,...after.notes},
        walkthrough:{...before.walkthrough,...after.walkthrough}
      } : before,
      studioTransfer:{version:1,...left.studioTransfer,...right.studioTransfer}
    };
  }
  function summarize(value) {
    const studio = projectCore.cleanState(value.studio), transfer = portable(value.studioTransfer);
    return {
      foundations:value.completed.length,
      stages:studio.completed.length,
      notes:Object.keys(value.notes).length + Object.keys(studio.notes).length,
      positions:Object.keys(studio.walkthrough).length + ['session','resume','loop'].filter(key => Object.hasOwn(transfer,key)).length
    };
  }
  return {MAX_BYTES,parse,createExport,merge,summarize};
});
