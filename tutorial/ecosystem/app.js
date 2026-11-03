'use strict';
(() => {
  const byId = (id) => document.getElementById(id);
  document.querySelectorAll('[data-copy-source]').forEach((button) => {
    button.addEventListener('click', async () => {
      const source = byId(button.dataset.copySource);
      try {
        await navigator.clipboard.writeText(source.textContent);
        byId('copy-status').textContent = 'Copied. In p5, open the matching file, select all its contents, then paste.';
        button.textContent = button.dataset.copySource === 'stage-one-code' ? 'sketch.js copied' : 'index.html copied';
      } catch (_) {
        byId('copy-status').textContent = 'Automatic copy was unavailable. Select the complete code block above, then use Ctrl + C.';
      }
    });
  });
  let map;
  let previewGeneration = 0;
  const frame = byId('project-preview');
  function link(id, url) {
    const element = byId(id);
    if (!url) { element.removeAttribute('href'); element.setAttribute('aria-disabled', 'true'); return; }
    element.href = url;
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
    element.removeAttribute('aria-disabled');
  }
  function preview(url, title) {
    const generation = ++previewGeneration;
    byId('preview-title').textContent = title;
    byId('preview-status').textContent = 'Loading the local project…';
    frame.title = title + ' · local p5 preview';
    frame.onload = () => {
      if (generation !== previewGeneration) return;
      let attempts = 0;
      function inspect() {
        if (generation !== previewGeneration) return;
        try {
          const view = frame.contentWindow;
          const canvas = view.document.querySelector('canvas');
          const painted = canvas && (Number(view.frameCount) > 0 || canvas.getContext('2d')?.getImageData(0, 0, 1, 1).data[3] > 0);
          if (painted) {
            canvas.style.maxWidth = '100%';
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            frame.parentElement.style.aspectRatio = canvas.width + ' / ' + canvas.height;
            byId('preview-status').textContent = 'Local project ready · canvas output is rendered.';
            return;
          }
        } catch (_) { /* An unavailable preview cannot establish a successful run. */ }
        if (++attempts < 40) window.setTimeout(inspect, 150);
        else byId('preview-status').textContent = 'Page loaded; rendered canvas output has not been confirmed. Open the stage guide to check the expected result.';
      }
      inspect();
    };
    frame.src = url;
  }
  function selectStage() {
    const stage = map.stages.find((item) => String(item.number) === byId('stage-select').value);
    if (!stage) return;
    byId('stage-title').textContent = stage.title;
    byId('stage-goal').textContent = stage.goal;
    link('stage-guide', stage.guide || map.guide);
    link('stage-explanation', stage.explanation || stage.guide || map.guide);
    link('stage-code', stage.files.code);
    link('stage-html', stage.files.editorHTML);
    link('stage-image', stage.files.image);
    preview(stage.preview, 'Stage ' + stage.number + ' reference');
  }
  async function initialize() {
    try {
      const response = await fetch('./study-map.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Study map request returned ' + response.status);
      map = await response.json();
      if (!Array.isArray(map.stages) || !map.stages.length) throw new Error('The study map has no stages');
      document.title = map.title || document.title;
      const select = byId('stage-select');
      select.replaceChildren(...map.stages.map((stage) => {
        const option = document.createElement('option');
        option.value = stage.number;
        option.textContent = stage.number + '. ' + stage.title;
        return option;
      }));
      select.disabled = false;
      select.addEventListener('change', selectStage);
      link('editor-link', map.editor);
      byId('versions').textContent = 'Local reference: p5 ' + map.p5Version + ' · Node ' + map.nodeVersion;
      if (Array.isArray(map.saveRoutine) && map.saveRoutine.length) {
        byId('save-routine').replaceChildren(...map.saveRoutine.map((text) => {
          const item = document.createElement('li'); item.textContent = text; return item;
        }));
      }
      byId('resources').replaceChildren(...(map.resources || []).map((resource) => {
        const item = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.textContent = resource.label; anchor.href = resource.url;
        anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
        item.append(anchor); return item;
      }));
      byId('run-my-project').disabled = false;
      byId('run-my-project').addEventListener('click', () => preview(map.initialProject, 'My project · local files'));
      selectStage();
    } catch (error) {
      byId('stage-goal').textContent = 'The study map could not load. Start the supplied study launcher, then reopen its local address.';
      byId('preview-status').textContent = error.message;
    }
  }
  async function checkService() {
    try {
      const response = await fetch('/api/health', { cache: 'no-store' });
      if (!response.ok) throw new Error('Service returned ' + response.status);
      const health = await response.json();
      if (health.app !== 'icm-week9-study' || !health.rootId || !health.p5) throw new Error('Unexpected study service');
      byId('service-status').textContent = 'Study service connected · local previews are available.';
    } catch (_) {
      byId('service-status').textContent = 'Study service connection not confirmed. Open this page through the supplied study launcher.';
    }
  }
  async function checkSetup() {
    try {
      const response = await fetch('/api/ready', { cache: 'no-store' });
      if (!response.ok) throw new Error('Setup check unavailable');
      const report = await response.json();
      byId('setup-status').textContent = report.ok ? 'Setup ready · 7 stages · automatic local backups' : 'A setup check needs attention. Run Check-Week-9.cmd.';
    } catch (_) { byId('setup-status').textContent = 'Run Start-Week-9.cmd to check and resume your course.'; }
  }
  initialize();
  checkService();
  checkSetup();
})();
