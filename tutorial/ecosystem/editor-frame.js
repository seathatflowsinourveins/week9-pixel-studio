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
    function element(tag, className, text) {
      var node = doc.createElement(tag);
      node.className = className;
      if (text) node.textContent = text;
      return node;
    }

    var header = element('div', 'p5-native-header');
    header.appendChild(element('strong', 'p5-native-title', 'p5 Web Editor'));
    var open = element('a', 'p5-native-open', 'Open saved example');
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    header.appendChild(open);
    var load = element('button', 'p5-native-load', 'Load saved example');
    load.type = 'button';
    header.appendChild(load);

    var surface = element('div', 'p5-native-surface');
    var iframe = element('iframe', 'p5-official-frame');
    iframe.id = 'p5-official-editor';
    iframe.title = 'p5 Web Editor';
    iframe.allowFullscreen = true;
    surface.appendChild(iframe);

    function setSuggestedProject(url, label) {
      var nextURL = safeURL(url);
      suggestedURL = nextURL;
      open.href = nextURL;
      open.setAttribute('aria-label', label ? 'Open saved example: ' + label + ' in full tab' : 'Open saved example in full tab');
      load.setAttribute('aria-label', label ? 'Load saved example: ' + label : 'Load saved example');
    }
    function loadSuggested() { iframe.src = suggestedURL; }

    setSuggestedProject(suggestedURL, options.label);
    load.addEventListener('click', loadSuggested);
    container.appendChild(header);
    container.appendChild(surface);
    container.appendChild(element('p', 'p5-native-note',
      'Run and edit here. Sign in here to save to p5; guide steps explain the prepared example.'));
    var instance = { iframe: iframe, setSuggestedProject: setSuggestedProject, loadSuggested: loadSuggested };
    mounts.set(container, instance);
    loadSuggested();
    return instance;
  }
  return { mount: mount, safeURL: safeURL };
}));
