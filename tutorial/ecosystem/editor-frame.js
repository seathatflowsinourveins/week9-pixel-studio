(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.p5EditorHost = factory();
}(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var mounts = new WeakMap();

  function safeURL(value) {
    var parsed;
    if (typeof value !== 'string' || value !== value.trim()) {
      throw new TypeError('Expected a public p5 Web Editor project URL.');
    }
    try { parsed = new URL(value); }
    catch (_) { throw new TypeError('Expected a public p5 Web Editor project URL.'); }
    if (parsed.origin !== 'https://editor.p5js.org' || parsed.username || parsed.password ||
        parsed.search || parsed.hash ||
        !/^\/[A-Za-z0-9_-]+\/sketches\/[A-Za-z0-9_-]+$/.test(parsed.pathname)) {
      throw new TypeError('Expected a public p5 Web Editor project URL.');
    }
    return parsed.href;
  }

  function mount(options) {
    var container = options.container;
    var suggestedURL = safeURL(options.url);
    if (!container || !container.ownerDocument || typeof container.appendChild !== 'function') {
      throw new TypeError('Expected an editor container.');
    }
    if (mounts.has(container)) return mounts.get(container);

    var doc = container.ownerDocument;
    var view = doc.defaultView;
    var savedURL = '';
    function element(tag, className, text) {
      var node = doc.createElement(tag);
      node.className = className;
      if (text) node.textContent = text;
      return node;
    }
    function externalLink(className, text) {
      var link = element('a', className, text);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      return link;
    }

    var header = element('div', 'p5-native-header');
    var toolbar = element('div', 'p5-native-toolbar');
    toolbar.appendChild(element('strong', 'p5-native-title', 'p5 Web Editor'));
    var open = externalLink('p5-native-open', 'Open p5 & save ↗');
    toolbar.appendChild(open);
    var copy = element('button', 'p5-native-copy', 'Copy guide code');
    copy.type = 'button';
    toolbar.appendChild(copy);
    header.appendChild(toolbar);

    var help = element('details', 'p5-native-help');
    help.appendChild(element('summary', '', 'Sign in & keep your edits'));
    var steps = element('ol', 'p5-native-save-steps');
    steps.appendChild(element('li', '',
      'Keep your latest edits: click the code in the p5 pane, then Ctrl+A and Ctrl+C (⌘ on Mac), or use p5 File → Download. Copy guide code copies only the prepared guide, not your pane edits.'));
    steps.appendChild(element('li', '',
      'Open p5 & save opens a full tab for sign-in. For your first copy, choose File → Duplicate. Paste your latest code into sketch.js, then Run and Save.'));
    var remember = element('li', '', 'Optional: keep your saved sketch URL here. It also appears in Finish.');
    var fieldLabel = element('label', 'p5-native-project-field');
    fieldLabel.appendChild(element('span', '', 'Your saved p5 sketch'));
    var projectInput = element('input', 'p5-native-project-url');
    projectInput.type = 'url';
    projectInput.autocomplete = 'url';
    projectInput.spellcheck = false;
    projectInput.placeholder = 'https://editor.p5js.org/you/sketches/…';
    fieldLabel.appendChild(projectInput);
    var projectActions = element('div', 'p5-native-project-actions');
    projectActions.appendChild(fieldLabel);
    var keep = element('button', 'p5-native-keep', 'Keep link');
    keep.type = 'button';
    projectActions.appendChild(keep);
    remember.appendChild(projectActions);
    steps.appendChild(remember);
    help.appendChild(steps);
    var examples = element('div', 'p5-native-examples');
    var example = externalLink('p5-native-example', 'Open prepared example ↗');
    examples.appendChild(example);
    var load = element('button', 'p5-native-load', 'Load example here');
    load.type = 'button';
    examples.appendChild(load);
    examples.appendChild(element('span', 'p5-native-replace-note', 'Loading replaces the code in this pane. Copy your edits first.'));
    help.appendChild(examples);
    header.appendChild(help);
    var status = element('p', 'p5-native-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    header.appendChild(status);

    var surface = element('div', 'p5-native-surface');
    var iframe = element('iframe', 'p5-official-frame');
    iframe.id = 'p5-official-editor';
    iframe.title = 'p5 Web Editor';
    iframe.allowFullscreen = true;
    surface.appendChild(iframe);

    function updateOpenLink() {
      open.href = savedURL || suggestedURL;
      open.setAttribute('aria-label', savedURL ? 'Open your saved p5 sketch in a full tab to sign in and save' :
        'Open the prepared p5 example in a full tab to sign in and save');
    }
    function refreshSavedProject() {
      var candidate;
      try {
        candidate = typeof options.readProjectURL === 'function' ? options.readProjectURL() : '';
        savedURL = candidate ? safeURL(candidate) : '';
      } catch (_) { savedURL = ''; }
      updateOpenLink();
      if (doc.activeElement !== projectInput) projectInput.value = savedURL;
    }
    function setSuggestedProject(url, label) {
      var nextURL = safeURL(url);
      suggestedURL = nextURL;
      example.href = nextURL;
      example.setAttribute('aria-label', label ? 'Open prepared example: ' + label + ' in a full tab' : 'Open prepared example in a full tab');
      load.setAttribute('aria-label', label ? 'Load prepared example: ' + label + '; replaces pane edits' : 'Load prepared example; replaces pane edits');
      updateOpenLink();
    }
    function loadSuggested() { iframe.src = suggestedURL; }
    function keepProject() {
      var nextURL;
      try { nextURL = safeURL(projectInput.value.trim()); }
      catch (_) {
        projectInput.setAttribute('aria-invalid', 'true');
        status.textContent = 'Paste a public p5 sketch URL without a query or # fragment. Your kept link is unchanged.';
        return;
      }
      try {
        if (typeof options.saveProjectURL !== 'function' || options.saveProjectURL(nextURL) !== true) {
          throw new Error('Project link was not saved.');
        }
        savedURL = nextURL;
        projectInput.value = nextURL;
        projectInput.setAttribute('aria-invalid', 'false');
        updateOpenLink();
        status.textContent = 'Link kept here and in Finish. Save your code in the full p5 tab.';
      } catch (_) {
        status.textContent = 'This link could not be kept. Copy the URL somewhere safe and try again.';
      }
    }
    async function copyGuideCode() {
      try {
        var code = typeof options.getGuideCode === 'function' ? options.getGuideCode() : '';
        if (typeof code !== 'string' || !code.trim() || !view || !view.navigator.clipboard) {
          throw new Error('Guide code or clipboard unavailable.');
        }
        await view.navigator.clipboard.writeText(code);
        status.textContent = 'Prepared guide code copied. Your p5 pane edits were not copied.';
      } catch (_) {
        status.textContent = 'Copy unavailable. Use Download sketch.js in the guide to keep the prepared guide code. Keep pane edits with p5 File → Download.';
      }
    }

    setSuggestedProject(suggestedURL, options.label);
    refreshSavedProject();
    load.addEventListener('click', loadSuggested);
    keep.addEventListener('click', keepProject);
    copy.addEventListener('click', copyGuideCode);
    if (view) {
      view.addEventListener('icm-progress-restored', refreshSavedProject);
      view.addEventListener('icm-progress-change', refreshSavedProject);
      view.addEventListener('icm-assignment-change', refreshSavedProject);
      view.addEventListener('storage', refreshSavedProject);
    }
    doc.addEventListener('DOMContentLoaded', refreshSavedProject);
    container.appendChild(header);
    container.appendChild(surface);
    container.appendChild(element('p', 'p5-native-note',
      'Run and edit here. Sign in and save in the full p5 tab. Pane edits stay here until you copy or download them.'));
    var instance = { iframe: iframe, setSuggestedProject: setSuggestedProject, loadSuggested: loadSuggested };
    mounts.set(container, instance);
    iframe.src = savedURL || suggestedURL;
    return instance;
  }
  return { mount: mount, safeURL: safeURL };
}));
