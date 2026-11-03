(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.assignmentCore = factory();
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const STORAGE_KEY = 'icm-assignment-desk-v1';
  const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const own = (value, key) => record(value) && Object.hasOwn(value, key) ? value[key] : undefined;
  const text = (value, limit = 20000) => typeof value === 'string' ? value.slice(0, limit) : '';
  const filled = value => typeof value === 'string' && value.trim().length > 0;
  function safeUrl(value) {
    if (typeof value !== 'string') return '';
    const candidate = value.trim();
    if (candidate.length > 2048 || !/^https?:\/\//i.test(candidate)) return '';
    try {
      const parsed = new URL(candidate);
      return ['http:', 'https:'].includes(parsed.protocol) ? candidate : '';
    } catch { return ''; }
  }
  function rows(value, clean) {
    const input = Array.isArray(value) ? value : [];
    return Array.from({length: Math.min(12, Math.max(3, input.length))}, (_, index) => clean(input[index]));
  }
  function normalize(value) {
    const project = own(value, 'project'), links = own(value, 'links'), checked = own(value, 'checked');
    return {
      version:1,
      project:{title:text(own(project, 'title'), 200), concept:text(own(project, 'concept')),
        source:text(own(project, 'source')), partner:text(own(project, 'partner')), roles:text(own(project, 'roles'))},
      iterations:rows(own(value, 'iterations'), row => ({change:text(own(row, 'change')), result:text(own(row, 'result')), url:safeUrl(own(row, 'url'))})),
      viewings:rows(own(value, 'viewings'), row => ({notes:text(own(row, 'notes')), fullMinute:own(row, 'fullMinute') === true})),
      links:{blog:safeUrl(own(links, 'blog')), code:safeUrl(own(links, 'code')), fullscreen:safeUrl(own(links, 'fullscreen')), spreadsheet:safeUrl(own(links, 'spreadsheet'))},
      checked:Array.isArray(checked) ? [...new Set(checked.filter(index => Number.isInteger(index) && index >= 0 && index < 9))].sort((a, b) => a - b) : []
    };
  }
  function summary(value) {
    const state = normalize(value);
    const iterations = state.iterations.filter(row => filled(row.change) && filled(row.result)).length;
    const viewings = state.viewings.filter(row => row.fullMinute && filled(row.notes)).length;
    const links = Object.values(state.links).filter(filled).length;
    const unfinished = [];
    if (!filled(state.project.title) || !filled(state.project.concept)) unfinished.push('Add a title and concept.');
    if (!filled(state.project.source)) unfinished.push('Record your image source or references.');
    if (!filled(state.project.partner) || !filled(state.project.roles)) unfinished.push('Record your partner and roles.');
    if (iterations < 3) unfinished.push('Record at least three iterations with a change and result.');
    if (viewings < 3) unfinished.push('Record at least three full-minute viewings with notes.');
    if (links < 4) unfinished.push('Add the four submission links.');
    if (state.checked.length < 9) unfinished.push('Review the nine assignment self-checks.');
    return {iterations, viewings, selfChecked:state.checked.length, links, unfinished};
  }
  function merge(local, incoming) {
    const left = normalize(local), right = normalize(incoming);
    const combine = (before, after) => Object.fromEntries(Object.keys(before).map(key => [key,
      typeof before[key] === 'boolean' ? before[key] || after[key] === true : filled(after[key]) ? after[key] : before[key]
    ]));
    const combineRows = (before, after, blank) => Array.from({length:Math.max(before.length, after.length)}, (_, index) => combine(before[index] || blank, after[index] || blank));
    return normalize({
      project:combine(left.project, right.project), links:combine(left.links, right.links),
      iterations:combineRows(left.iterations, right.iterations, {change:'', result:'', url:''}),
      viewings:combineRows(left.viewings, right.viewings, {notes:'', fullMinute:false}),
      checked:[...left.checked, ...right.checked]
    });
  }
  // An intentional edit is different from an import: an empty value clears a field.
  function patch(value, path, next) {
    const state = normalize(value);
    if (typeof path !== 'string') return state;
    const parts = path.split('.');
    if (parts.length === 2 && ['project', 'links'].includes(parts[0]) && Object.hasOwn(state[parts[0]], parts[1])) {
      if (typeof next === 'string') state[parts[0]][parts[1]] = next;
    } else if (parts.length === 2 && parts[0] === 'checked' && /^[0-8]$/.test(parts[1]) && typeof next === 'boolean') {
      const index = Number(parts[1]);
      state.checked = next ? [...state.checked, index] : state.checked.filter(item => item !== index);
    } else if (parts.length === 3 && ['iterations', 'viewings'].includes(parts[0]) && /^(?:[0-9]|1[01])$/.test(parts[1])) {
      const blank = parts[0] === 'iterations' ? {change:'', result:'', url:''} : {notes:'', fullMinute:false};
      if (!Object.hasOwn(blank, parts[2]) || typeof next !== typeof blank[parts[2]]) return state;
      while (state[parts[0]].length <= Number(parts[1])) state[parts[0]].push({...blank});
      state[parts[0]][Number(parts[1])][parts[2]] = next;
    }
    return normalize(state);
  }
  function csvCell(value) {
    let result = String(value);
    // Keep user text as text when a spreadsheet opens the downloaded file.
    if (/^[\s]*[=+@-]/.test(result) || /^[\t\r\n]/.test(result)) result = "'" + result;
    return /[",\r\n]/.test(result) ? '"' + result.replace(/"/g, '""') + '"' : result;
  }
  function iterationsCsv(value) {
    const lines = ['iteration,change,result,url'];
    normalize(value).iterations.forEach((row, index) => {
      if (Object.values(row).some(filled)) lines.push([index + 1, row.change, row.result, row.url].map(csvCell).join(','));
    });
    return lines.join('\r\n') + '\r\n';
  }
  function observationsCsv(value) {
    const lines = ['viewing,notes,full_minute_self_reported'];
    normalize(value).viewings.forEach((row, index) => {
      if (filled(row.notes) || row.fullMinute) lines.push([index + 1, row.notes, row.fullMinute].map(csvCell).join(','));
    });
    return lines.join('\r\n') + '\r\n';
  }
  const markdownText = value => value.replace(/[\\`*_{}[\]<>#|]/g, '\\$&');
  function toMarkdown(value, items = []) {
    const state = normalize(value), lines = ['# Week 9 process notes', '', 'These are entered notes and self-checks. Links have not been verified by this page.', ''];
    for (const [key, label] of Object.entries({title:'Title', concept:'Concept', source:'Source / references', partner:'Partner', roles:'Partner roles'})) {
      if (filled(state.project[key])) lines.push('## ' + label, '', markdownText(state.project[key]), '');
    }
    state.iterations.forEach((row, index) => {
      if (!Object.values(row).some(filled)) return;
      lines.push('## Iteration ' + (index + 1), '');
      if (filled(row.change)) lines.push('Change:', '', markdownText(row.change), '');
      if (filled(row.result)) lines.push('Observed result:', '', markdownText(row.result), '');
      if (row.url) lines.push('Version link: ' + markdownText(row.url), '');
    });
    state.viewings.forEach((row, index) => {
      if (!filled(row.notes) && !row.fullMinute) return;
      lines.push('## Viewing ' + (index + 1), '', 'Full minute watched (self-reported): ' + (row.fullMinute ? 'yes' : 'not checked'), '');
      if (filled(row.notes)) lines.push(markdownText(row.notes), '');
    });
    const links = Object.entries(state.links).filter(([, url]) => url);
    if (links.length) {
      lines.push('## Submission links', '');
      for (const [label, url] of links) lines.push('- ' + label + ': ' + markdownText(url));
      lines.push('');
    }
    if (state.checked.length) {
      lines.push('## Checked by me', '');
      for (const index of state.checked) lines.push('- [x] ' + markdownText(typeof items[index] === 'string' ? items[index] : 'Assignment item ' + (index + 1)));
      lines.push('');
    }
    return lines.join('\n');
  }
  return {STORAGE_KEY, normalize, summary, merge, patch, toMarkdown, iterationsCsv, observationsCsv};
});
