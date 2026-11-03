(function () {
  'use strict';
  if (window.assignmentPanel) return;
  const core = window.assignmentCore;
  let currentMount = null;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function readSaved() {
    let raw;
    try { raw = localStorage.getItem(core.STORAGE_KEY); }
    catch { return {state:core.normalize(), error:'This browser blocked access to saved Finish notes. Download your notes before leaving.'}; }
    try { return {state:core.normalize(raw ? JSON.parse(raw) : undefined), error:''}; }
    catch { return {state:core.normalize(), error:'Saved Finish notes could not be read. Download any current notes before leaving.'}; }
  }
  function externalLink(label, href) {
    const link = element('a', '', label);
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }
  function render(assignmentData) {
    const source = assignmentData && typeof assignmentData === 'object' ? assignmentData : {};
    const checklist = Array.isArray(source.items) ? source.items.filter(item => typeof item === 'string').slice(0, 9) : [];
    const loaded = readSaved();
    let state = loaded.state;
    let storageError = loaded.error;
    const pendingEdits = new Map();
    const wrap = element('section', 'assignment-desk');
    wrap.setAttribute('aria-label', 'Finish your Week 9 work');
    const intro = element('div', 'assignment-intro');
    intro.append(element('h3', '', 'Bring your one-minute piece together'), element('p', '', 'Keep your concept, experiments and viewing notes here. Then use them in your blog and class spreadsheet.'));
    const stats = element('div', 'assignment-stats');
    const next = element('p', 'assignment-next');
    const status = element('p', 'assignment-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    const sections = element('div', 'assignment-sections');
    const counts = new Map();

    function setStatus(message, error = false) {
      status.textContent = message;
      status.classList.toggle('is-error', error);
    }
    function section(number, title, hint, open = false) {
      const details = element('details', 'assignment-section');
      details.open = open;
      details.dataset.section = String(number);
      const heading = element('summary');
      heading.append(element('span', 'assignment-step', String(number).padStart(2, '0')), element('strong', '', title));
      const count = element('span', 'assignment-section-count');
      heading.append(count);
      counts.set(number, count);
      const body = element('div', 'assignment-section-body');
      body.append(element('p', 'assignment-hint', hint));
      details.append(heading, body);
      sections.append(details);
      return body;
    }
    function field(parent, label, path, value, options = {}) {
      const group = element('div', 'assignment-field' + (options.wide ? ' assignment-field-wide' : ''));
      const labelNode = element('label');
      labelNode.append(element('span', '', label));
      const input = element(options.multiline ? 'textarea' : 'input');
      if (!options.multiline) input.type = options.url ? 'url' : 'text';
      if (options.multiline) input.rows = 3;
      input.maxLength = options.url ? 2048 : path === 'project.title' ? 200 : 20000;
      input.value = value;
      input.dataset.field = path;
      if (options.placeholder) input.placeholder = options.placeholder;
      labelNode.append(input);
      group.append(labelNode);
      if (options.url) {
        input.spellcheck = false;
        const link = externalLink('Open ↗', value || 'https://example.com');
        link.className = 'assignment-open';
        link.dataset.open = path;
        link.setAttribute('aria-label', 'Open ' + label.toLowerCase() + ' in a new tab');
        link.hidden = !value;
        const error = element('span', 'assignment-url-error');
        error.dataset.error = path;
        error.id = 'assignment-error-' + path.replace(/\./g, '-');
        input.setAttribute('aria-describedby', error.id);
        group.append(link, error);
      }
      parent.append(group);
      return input;
    }
    function check(parent, label, path, checked) {
      const labelNode = element('label', 'assignment-check');
      const input = element('input');
      input.type = 'checkbox';
      input.dataset.field = path;
      input.checked = checked;
      labelNode.append(input, element('span', '', label));
      parent.append(labelNode);
    }
    function button(label, action) {
      const node = element('button', 'assignment-button', label);
      node.type = 'button';
      node.dataset.action = action;
      return node;
    }
    function row(kind, entry, index) {
      const box = element('fieldset', 'assignment-entry');
      box.append(element('legend', '', (kind === 'iterations' ? 'Iteration ' : 'Viewing ') + (index + 1)));
      if (kind === 'iterations') {
        const fields = element('div', 'assignment-fields');
        field(fields, 'What changed?', 'iterations.' + index + '.change', entry.change, {multiline:true, placeholder:'Which rule or value did you change?'});
        field(fields, 'What happened?', 'iterations.' + index + '.result', entry.result, {multiline:true, placeholder:'Describe what you actually saw.'});
        field(fields, 'Version link (optional)', 'iterations.' + index + '.url', entry.url, {url:true, wide:true, placeholder:'https://…'});
        box.append(fields);
      } else {
        field(box, 'Timestamped observations', 'viewings.' + index + '.notes', entry.notes, {multiline:true, placeholder:'12 s: ...'});
        check(box, 'I watched the complete minute.', 'viewings.' + index + '.fullMinute', entry.fullMinute);
      }
      return box;
    }
    function buildSections(openSections) {
      sections.replaceChildren();
      counts.clear();
      const concept = section(1, 'Concept & partner', 'Describe the alternative reality you are making. Record your source and who is doing what.', true);
      const fields = element('div', 'assignment-fields');
      field(fields, 'Working title', 'project.title', state.project.title);
      field(fields, 'Partner', 'project.partner', state.project.partner);
      field(fields, 'Concept', 'project.concept', state.project.concept, {multiline:true, wide:true, placeholder:'What should the viewer notice as the minute unfolds?'});
      field(fields, 'Image source / references', 'project.source', state.project.source, {multiline:true, placeholder:'Where did the image or idea come from?'});
      field(fields, 'Partner roles', 'project.roles', state.project.roles, {multiline:true, placeholder:'What did each of you make, test or revise?'});
      concept.append(fields);
      for (const [kind, number, title, hint] of [
        ['iterations', 2, 'At least 3 iterations', 'Change one rule or value, then describe the result. Keep a version link if you have one.'],
        ['viewings', 3, 'Watch the whole minute 3 times', 'After each full viewing, write what you noticed and when. Check the box only after watching all 60 seconds.']
      ]) {
        const body = section(number, title, hint);
        const entries = element('div', 'assignment-entries');
        entries.dataset.rows = kind;
        state[kind].forEach((entry, index) => entries.append(row(kind, entry, index)));
        const add = button(kind === 'iterations' ? 'Add iteration' : 'Add viewing', 'add-' + kind);
        add.disabled = state[kind].length >= 12;
        body.append(entries, add);
      }
      const links = section(4, 'Submission links', 'Paste your actual links. Open each one yourself and check it works for someone else. This page does not verify links or submit your work.');
      const linkFields = element('div', 'assignment-fields');
      for (const [key, label] of Object.entries({blog:'Blog post', code:'p5 code', fullscreen:'p5 fullscreen', spreadsheet:'Class spreadsheet'})) {
        field(linkFields, label, 'links.' + key, state.links[key], {url:true, placeholder:'https://…'});
      }
      links.append(linkFields);
      const review = section(5, 'Assignment self-check', 'These boxes are your own review. Entered notes and checked boxes do not prove the assignment is complete.');
      const checks = element('div', 'assignment-checklist');
      checklist.forEach((item, index) => check(checks, item, 'checked.' + index, state.checked.includes(index)));
      review.append(checks);
      const sourceUrl = core.normalize({links:{blog:source.url}}).links.blog;
      if (sourceUrl) review.append(externalLink('Read the assignment & submission details ↗', sourceUrl));
      if (openSections) for (const details of sections.children) details.open = openSections.has(details.dataset.section);
    }
    function valueAt(value, path) {
      return path.split('.').reduce((part, key) => part?.[key], value);
    }
    function updateSummary() {
      const clean = core.normalize(state), summary = core.summary(clean);
      stats.replaceChildren();
      for (const [amount, label] of [[summary.iterations + ' / 3', 'iterations recorded'], [summary.viewings + ' / 3', 'full viewings recorded'], [summary.links + ' / 4', 'links entered'], [summary.selfChecked + ' / 9', 'self-checks']]) {
        const stat = element('div', 'assignment-stat');
        stat.append(element('strong', '', amount), element('span', '', label));
        stats.append(stat);
      }
      next.textContent = summary.unfinished.length ? 'Next: ' + summary.unfinished[0] : 'Your notes and self-checks are filled in. Review the assignment, test your links, and submit through the class instructions.';
      counts.get(2).textContent = summary.iterations + ' recorded';
      counts.get(3).textContent = summary.viewings + ' recorded';
      counts.get(4).textContent = summary.links + ' / 4 entered';
      counts.get(5).textContent = summary.selfChecked + ' / 9 checked';
      for (const link of wrap.querySelectorAll('[data-open]')) {
        const href = valueAt(clean, link.dataset.open);
        link.hidden = !href;
        if (href) link.href = href;
        else link.removeAttribute('href');
      }
    }
    function applyPending(value) {
      let updated = value;
      for (const [path, nextValue] of pendingEdits) updated = core.patch(updated, path, nextValue);
      return updated;
    }
    function syncFields(activeInput) {
      for (const kind of ['iterations', 'viewings']) {
        const entries = wrap.querySelector('[data-rows="' + kind + '"]');
        while (entries.children.length > state[kind].length) entries.lastElementChild.remove();
        for (let index = entries.children.length; index < state[kind].length; index++) entries.append(row(kind, state[kind][index], index));
        wrap.querySelector('[data-action="add-' + kind + '"]').disabled = state[kind].length >= 12;
      }
      for (const input of wrap.querySelectorAll('[data-field]')) {
        if (input === activeInput) continue;
        if (input.dataset.field.startsWith('checked.')) input.checked = state.checked.includes(Number(input.dataset.field.split('.')[1]));
        else if (input.type === 'checkbox') input.checked = valueAt(state, input.dataset.field);
        else input.value = valueAt(state, input.dataset.field);
      }
    }
    function save(activeInput) {
      try {
        const latest = readSaved();
        if (latest.error) throw new Error(latest.error);
        state = applyPending(latest.state);
        localStorage.setItem(core.STORAGE_KEY, JSON.stringify(state));
        pendingEdits.clear();
        storageError = '';
        setStatus('Notes saved in this browser.');
      } catch {
        storageError = 'Finish notes could not be saved in this browser. Download your notes before leaving.';
        setStatus(storageError, true);
      }
      syncFields(activeInput);
      updateSummary();
      window.dispatchEvent(new CustomEvent('icm-assignment-change'));
    }
    function capture(input) {
      const path = input.dataset.field;
      const nextValue = input.type === 'checkbox' ? input.checked : input.value;
      pendingEdits.set(path, nextValue);
      state = core.patch(state, path, nextValue);
      save(input);
    }
    function validateUrl(input) {
      const valid = !input.value.trim() || Boolean(valueAt(core.normalize(state), input.dataset.field));
      input.setAttribute('aria-invalid', String(!valid));
      const error = document.getElementById(input.getAttribute('aria-describedby'));
      if (error) error.textContent = valid ? '' : 'Use a complete http:// or https:// link. This link has not been saved.';
    }
    wrap.addEventListener('input', event => {
      const input = event.target.closest('[data-field]');
      if (!input || input.type === 'checkbox') return;
      capture(input);
      if (input.type === 'url' && input.getAttribute('aria-invalid') === 'true') validateUrl(input);
    });
    wrap.addEventListener('change', event => {
      const input = event.target.closest('[data-field]');
      if (!input) return;
      if (input.type === 'checkbox') capture(input);
      if (input.type === 'url') validateUrl(input);
    });
    function download(filename, content, type) {
      try {
        const url = URL.createObjectURL(new Blob([content], {type}));
        const link = element('a');
        link.href = url;
        link.download = filename;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus(storageError || 'Download requested. Keep these notes with your project files.', Boolean(storageError));
      } catch { setStatus('The notes download could not start. Copy your entries before leaving this page.', true); }
    }
    wrap.addEventListener('click', event => {
      const action = event.target.closest('[data-action]');
      if (!action) return;
      if (action.dataset.action.startsWith('add-')) {
        const kind = action.dataset.action.slice(4);
        const latest = readSaved();
        if (!latest.error) state = applyPending(latest.state);
        if (state[kind].length >= 12) return;
        const index = state[kind].length;
        const path = kind + '.' + index + '.' + (kind === 'iterations' ? 'change' : 'notes');
        pendingEdits.set(path, '');
        state = core.patch(state, path, '');
        save();
        wrap.querySelector('[data-field="' + path + '"]').focus();
      } else if (action.dataset.action === 'markdown') download('week9-process-notes.md', core.toMarkdown(state, checklist), 'text/markdown;charset=utf-8');
      else if (action.dataset.action === 'iterations-csv') download('week9-iterations.csv', core.iterationsCsv(state), 'text/csv;charset=utf-8');
      else if (action.dataset.action === 'observations-csv') download('week9-observations.csv', core.observationsCsv(state), 'text/csv;charset=utf-8');
    });
    const exports = element('div', 'assignment-exports');
    exports.append(element('h4', '', 'Take your notes with you'));
    const actions = element('div', 'assignment-actions');
    actions.append(button('Download process notes', 'markdown'), button('Iterations CSV', 'iterations-csv'), button('Observations CSV', 'observations-csv'));
    exports.append(actions, element('p', 'assignment-hint', 'Downloads contain what you entered. Copy the relevant notes into your blog and class spreadsheet.'));
    const templates = element('div', 'assignment-templates');
    templates.append(element('span', '', 'Prefer a blank template?'));
    for (const [file, label] of [['iterations.csv', 'Iterations'], ['observations.csv', 'Observations'], ['partner-log.csv', 'Partner log'], ['blog-outline.txt', 'Blog outline']]) {
      const link = element('a', '', label);
      link.href = '../templates/' + file;
      link.download = file;
      templates.append(link);
    }
    const storageNote = element('p', 'assignment-storage-note', 'Saved in this browser. Use Progress to transfer; keep code and image separately.');
    buildSections();
    wrap.append(intro, stats, next, status, sections, exports, templates, storageNote);
    updateSummary();
    setStatus(storageError || 'Your entries save as you type.', Boolean(storageError));
    currentMount = {element:wrap, refresh() {
      const restored = readSaved();
      state = applyPending(restored.state);
      storageError = restored.error;
      const openSections = new Set([...sections.children].filter(details => details.open).map(details => details.dataset.section));
      buildSections(openSections);
      updateSummary();
      setStatus(storageError || 'Finish notes refreshed from your restored progress.', Boolean(storageError));
    }};
    return wrap;
  }
  // One listener owns the current panel. Reopening the dialog does not add listeners.
  window.addEventListener('icm-progress-restored', () => {
    if (currentMount?.element.isConnected) currentMount.refresh();
  });
  window.assignmentPanel = {render};
})();
