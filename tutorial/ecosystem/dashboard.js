(function () {
  'use strict';
  const C = window.studioDashboardCore;
  const G = window.studioGroupStudy;
  if (!C) return;
  const RESUME = 'icm-studio-resume-v1', WORKBOOK = 'icm-workbook-v1';
  const fallback = {kind:'stage',stage:1};
  function read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
  let context = C.validContext(read(RESUME)) || fallback;
  let hasHostContext = false;
  let data = null, failure = false, mounted = false, section = 'Journey', trigger = null;
  let header, dialog, content, tabs, contextLabel, groupPanel, groupVisible = false;
  const headerButtons = new Map();
  const dataURL = new URL('./dashboard-data.json', document.currentScript ? document.currentScript.src : location.href);
  const sections = ['Journey','Foundations','Group study','References','Finish'];
  const tabID = name => 'studio-tab-' + name.toLowerCase().replace(/\s+/g,'-');
  const requestedGroup = new URL(location.href).searchParams.get('panel') === 'group-study';
  function syncPanelRoute(open) {
    if (!G) return;
    const current = new URL(location.href);
    if (open || current.searchParams.get('panel') === 'group-study') {
      const next = G.panelURL(current.href,open);
      if (next !== current.href) history.replaceState(null,'',next);
    }
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function label() {
    if (context.kind === 'loops') return 'Stage 2 · ' + (context.mode === 'grid' ? 'A grid of squares' : 'One row of squares');
    const stage = data?.stages.find(item => item.number === context.stage);
    return 'Stage ' + context.stage + (stage ? ' · ' + stage.short : '');
  }
  function updateContext() {
    if (!mounted) return;
    contextLabel.textContent = label();
    const current = document.getElementById('dashboard-current');
    if (current) current.textContent = label();
    const resume = document.getElementById('dashboard-resume');
    if (resume) resume.href = C.resumePath(context);
    updateProgress();
  }
  window.studioDashboard = {
    open(name, from) {
      if(!sections.includes(name)||!mounted)return false;
      trigger=from||document.activeElement;section=name;
      if(!dialog.open)dialog.showModal();
      renderDialog();
      dialog.querySelector('.studio-close').focus();
      return true;
    },
    setContext(value) {
      const next = C.validContext(value);
      if (!next) return false;
      hasHostContext = true;
      context = next;
      try { localStorage.setItem(RESUME, JSON.stringify(next)); } catch { /* Reading and navigation still work when storage is unavailable. */ }
      updateContext();
      return true;
    }
  };
  function updateProgress() {
    if (!mounted) return;
    const completed = C.completedStages(read(WORKBOOK));
    for (const card of document.querySelectorAll('[data-studio-stage]')) {
      const number = Number(card.dataset.studioStage), done = completed.includes('studio-' + (number - 1)), current = number === context.stage;
      card.classList.toggle('current', current);
      card.classList.toggle('done', done);
      if (current) card.setAttribute('aria-current', 'step'); else card.removeAttribute('aria-current');
      card.querySelector('.stage-state').textContent = (current ? 'Current stage' : 'Stage ' + number) + (done ? ' · Marked complete' : '');
    }
  }
  window.addEventListener('storage', event => {
    if (!hasHostContext && (event.key === RESUME || event.key === null)) context = C.validContext(read(RESUME)) || fallback;
    if (event.key === RESUME || event.key === WORKBOOK || event.key === null) updateContext();
  });
  window.addEventListener('icm-progress-change', updateProgress);
  window.addEventListener('icm-progress-restored', () => {
    if (!hasHostContext) context = C.validContext(read(RESUME)) || fallback;
    updateContext();
  });
  function stageGrid() {
    const grid = element('div', 'journey-grid');
    for (const stage of data.stages) {
      const card = element('a', 'journey-card');
      card.href = stage.href;
      card.dataset.studioStage = stage.number;
      const visual = element('canvas', 'stage-visual');
      visual.dataset.stage = stage.number;
      visual.width = 240; visual.height = 180;
      visual.setAttribute('role','img');
      visual.setAttribute('aria-label', 'Stage ' + stage.number + ': ' + stage.title);
      card.append(element('span','stage-number',String(stage.number).padStart(2,'0')), visual, element('h3','',stage.title), element('p','stage-description',stage.description));
      if (stage.checkpoint || stage.short) card.append(element('p','stage-checkpoint',stage.checkpoint || stage.short));
      card.append(element('span','stage-state'));
      grid.append(card);
    }
    return grid;
  }
  function foundations() {
    const list = element('div', 'foundation-list'), groups = new Map();
    for (const item of data.foundations) {
      if (!groups.has(item.group)) {
        const group = element('section','foundation-group');
        group.append(element('h3','',item.group));
        const links = element('ul'); group.append(links); list.append(group); groups.set(item.group,links);
      }
      const row = element('li'), link = element('a','',item.title);
      link.href = item.href; row.append(link); groups.get(item.group).append(row);
    }
    return list;
  }
  function references() {
    const list = element('div','reference-list');
    for (const repo of data.repos) {
      const row = element('article','reference-item'), link = element('a','',repo.name);
      link.href = repo.url;
      if (repo.panel === 'group-study' && G) {
        link.href = G.panelURL(location.href,true);
        link.addEventListener('click',event=>{
          if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
          event.preventDefault();window.studioDashboard.open('Group study',link);
        });
      } else { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      row.append(element('p','reference-role',repo.role),element('h3'));
      row.lastChild.append(link); row.append(element('p','',repo.detail)); list.append(row);
    }
    return list;
  }
  function assignment() {
    if (window.assignmentPanel) return window.assignmentPanel.render(data.assignment);
    const wrap = element('div'), intro = element('p','', 'Use this checklist before you submit your work.'), list = element('ul','assignment-list');
    for (const item of data.assignment.items) list.append(element('li','',item));
    const link = element('a','','Open the assignment and submission details ↗');
    link.href = data.assignment.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    wrap.append(intro,list,link); return wrap;
  }
  function renderDialog() {
    if (!mounted) return;
    for (const tab of tabs.children) {
      const selected = tab.textContent === section;
      tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
    }
    content.setAttribute('aria-labelledby',tabID(section));
    const studying = section === 'Group study';
    dialog.classList.toggle('group-study-open',studying && dialog.open);
    document.body.classList.toggle('studio-group-active',studying && dialog.open);
    document.getElementById('studio-dialog-title').textContent = studying ? 'Study together' : 'Your Pixel Studio';
    document.querySelector('.studio-group-standalone').hidden = !studying;
    syncPanelRoute(studying && dialog.open);
    if (studying) {
      if (!dialog.open) { groupPanel?.unmount(); groupVisible=false; return; }
      if (!groupVisible) { content.replaceChildren(); groupVisible=true; }
      if (G) {
        groupPanel ||= G.create({host:content,document,baseURL:dataURL.href});
        groupPanel.mount();
      } else if (!content.children.length) {
        const link=element('a','','Open the group guide');link.href='./group-study.html';content.append(link);
      }
      return;
    }
    groupPanel?.unmount();groupVisible=false;
    content.replaceChildren();
    if (!data) { content.append(element('p','',failure ? 'Dashboard information is unavailable. Reload this page to try again.' : 'Loading your studio…')); return; }
    content.append(section === 'Journey' ? stageGrid() : section === 'Foundations' ? foundations() : section === 'References' ? references() : assignment());
    updateProgress(); window.studioArt?.paintAll(content);
  }
  function renderHome() {
    const journey = document.getElementById('dashboard-journey');
    if (journey) {
      journey.replaceChildren();
      if (data) { journey.append(stageGrid()); window.studioArt?.paintAll(journey); }
      else journey.append(element('p','',failure ? 'The journey could not load. Reload this page to try again.' : 'Loading the seven-stage journey…'));
    }
    const count = document.getElementById('dashboard-foundation-count');
    if (count && data) count.textContent = String(data.foundations.length);
    updateContext();
  }
  function mount() {
    header = document.querySelector('.topbar') || element('header');
    const legacy = element('div','studio-legacy-links'); legacy.hidden = true;
    for (const id of ['external-editor','loop-editor','inline-mode-link','loop-dashboard-link']) {
      const node = document.getElementById(id); if (node) legacy.append(node);
    }
    header.className = 'studio-header topbar';
    const brand = element('a','studio-brand'); brand.href = './';
    brand.append(element('span','','Week 9'),element('strong','','Pixel Studio'));
    brand.setAttribute('aria-label','Week 9 Pixel Studio home');
    const nav = element('nav','studio-nav'); nav.setAttribute('aria-label','Studio navigation');
    for (const name of sections) {
      const button = element('button','',name); button.type = 'button';
      button.setAttribute('aria-haspopup','dialog'); button.setAttribute('aria-controls','studio-dialog');
      headerButtons.set(name,button);
      button.addEventListener('click', () => window.studioDashboard.open(name,button));
      nav.append(button);
    }
    contextLabel = element('span','studio-context');
    header.replaceChildren(brand,nav,contextLabel,legacy);
    if (!header.isConnected) document.body.prepend(header);
    dialog = element('dialog','studio-dialog'); dialog.id = 'studio-dialog'; dialog.setAttribute('aria-labelledby','studio-dialog-title');
    const top = element('div','studio-dialog-header'), close = element('button','studio-close','Close');
    close.type = 'button'; close.setAttribute('aria-label','Close studio dashboard'); close.autofocus = true;
    close.addEventListener('click', () => dialog.close());
    const heading = element('h2','','Your Pixel Studio'); heading.id = 'studio-dialog-title';
    const standalone=element('a','studio-group-standalone','Open standalone ↗');standalone.href='./group-study.html';standalone.target='_blank';standalone.rel='noopener noreferrer';standalone.hidden=true;
    top.append(heading,standalone,close);
    tabs = element('div','studio-dialog-tabs'); tabs.setAttribute('role','tablist'); tabs.setAttribute('aria-label','Dashboard sections');
    for (const name of sections) {
      const tab = element('button','',name); tab.type = 'button'; tab.id = tabID(name);
      tab.setAttribute('role','tab'); tab.setAttribute('aria-controls','studio-dialog-content');
      tab.addEventListener('click', () => { section = name; renderDialog(); });
      tabs.append(tab);
    }
    tabs.addEventListener('keydown', event => {
      const index = [...tabs.children].indexOf(document.activeElement);
      if (index < 0 || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? sections.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + sections.length) % sections.length;
      section = sections[next]; renderDialog(); tabs.children[next].focus();
    });
    content = element('div','studio-dialog-content'); content.id = 'studio-dialog-content'; content.setAttribute('role','tabpanel'); content.tabIndex = 0;
    dialog.append(top,tabs,content); document.body.append(dialog);
    dialog.addEventListener('close', () => {
      if(dialog.open)return;
      groupPanel?.unmount();groupVisible=false;dialog.classList.remove('group-study-open');document.body.classList.remove('studio-group-active');syncPanelRoute(false);
      const back=trigger?.isConnected?trigger:headerButtons.get(section);back?.focus();
    });
    for (const link of document.querySelectorAll('[data-studio-group-open]')) {
      link.addEventListener('click',event=>{
        if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
        event.preventDefault();window.studioDashboard.open('Group study',link);
      });
    }
    mounted = true; renderHome();
    if(requestedGroup)window.studioDashboard.open('Group study',headerButtons.get('Group study'));else renderDialog();
    window.addEventListener('popstate',()=>{
      const wantsGroup=new URL(location.href).searchParams.get('panel')==='group-study';
      if(wantsGroup && (!dialog.open || section!=='Group study'))window.studioDashboard.open('Group study',headerButtons.get('Group study'));
      else if(!wantsGroup && dialog.open && section==='Group study')dialog.close();
    });
    window.addEventListener('message',event=>{
      if(dialog.open && section==='Group study' && event.origin===location.origin &&
        groupPanel?.owns(event.source) && event.data?.kind==='studio-group-close')dialog.close();
    });
    fetch(dataURL).then(response => { if (!response.ok) throw new Error('Dashboard HTTP ' + response.status); return response.json(); }).then(value => {
      if (!value || !Array.isArray(value.stages) || !Array.isArray(value.foundations) || !Array.isArray(value.repos) || !Array.isArray(value.assignment?.items)) throw new Error('Invalid dashboard data');
      data = value; renderHome(); renderDialog();
    }).catch(() => { failure = true; renderHome(); renderDialog(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
})();
