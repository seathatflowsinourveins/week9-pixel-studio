(() => {
  'use strict';
  const C = window.progressTransferCore;
  if (!C) return;
  const keys = {workbook:'icm-workbook-v1',session:'icm-study-session-v1',resume:'icm-studio-resume-v1',loop:'icm-loop-lesson-v1'};
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function button(text, id) {
    const node = element('button', text);
    node.type = 'button';
    if (id) node.id = id;
    return node;
  }
  function current() {
    const read = key => JSON.parse(localStorage.getItem(key) || 'null');
    return C.createExport(read(keys.workbook), {session:read(keys.session),resume:read(keys.resume),loop:read(keys.loop)});
  }
  function download(value) {
    const blob = new Blob([JSON.stringify(value,null,2) + '\n'], {type:'application/json'});
    const url = URL.createObjectURL(blob), link = element('a');
    link.href = url;
    link.download = 'icm-learning-progress-' + new Date().toISOString().slice(0,10) + '.json';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function counts(value) {
    const n = C.summarize(value);
    return n.stages + ' of 7 stages · ' + n.foundations + ' foundation lessons · ' + n.notes + ' notes · ' + n.positions + ' saved positions';
  }
  function mount() {
    if (document.getElementById('transfer-dialog')) return;
    const dialog = element('dialog', undefined, 'transfer-dialog');
    dialog.id = 'transfer-dialog';
    dialog.setAttribute('aria-labelledby','transfer-title');
    dialog.setAttribute('aria-describedby','transfer-description');
    const top = element('div', undefined, 'transfer-top');
    const title = element('h2','Your learning progress'); title.id = 'transfer-title';
    const close = button('Close'); close.setAttribute('aria-label','Close learning progress'); close.autofocus = true;
    top.append(title,close);
    const description = element('p','Progress stays in this browser on this site. Export a file to move your notes and saved steps to another browser or computer.');
    description.id = 'transfer-description';
    const summary = element('p',undefined,'transfer-summary');
    const exportButton = button('Export progress','transfer-export');
    const warning = element('p','p5 sketches and unsaved code are not included. Use Save in the p5 editor to keep your code. This is a file transfer, with no cloud sync.','transfer-hint');
    const divider = element('hr');
    const label = element('label','Import a progress JSON file'); label.htmlFor = 'transfer-file';
    const file = element('input'); file.type = 'file'; file.id = 'transfer-file'; file.accept = '.json,application/json';
    file.setAttribute('aria-describedby','transfer-file-help');
    const help = element('p','Choose a Week 9 workbook or Pixel Studio export, up to 2 MB. Notes are limited to 20,000 characters each.','transfer-hint'); help.id = 'transfer-file-help';
    const preview = element('section',undefined,'transfer-preview'); preview.id = 'transfer-preview'; preview.hidden = true;
    const previewTitle = element('h3','Ready to import'), previewCounts = element('p');
    const mergeNote = element('p','Completed lessons are combined. Imported notes, settings and saved positions replace matching values; other progress in this browser is kept. Export first if you want a copy of your current notes.');
    const confirm = button('Import and merge','transfer-confirm'); confirm.disabled = true;
    preview.append(previewTitle,previewCounts,mergeNote,confirm);
    const status = element('p',undefined,'transfer-status'); status.id = 'transfer-status'; status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
    dialog.append(top,description,summary,exportButton,warning,divider,label,file,help,preview,status);
    document.body.append(dialog);
    const openButton = button('Progress','progress-open');
    openButton.setAttribute('aria-haspopup','dialog'); openButton.setAttribute('aria-controls',dialog.id);
    const nav = document.querySelector('.studio-nav') || document.querySelector('.topbar');
    if (nav) nav.append(openButton); else document.body.prepend(openButton);
    let trigger = openButton, pending = null, generation = 0;
    function refreshSummary() {
      try { summary.textContent = 'In this browser: ' + counts(current()); exportButton.disabled = false; }
      catch { summary.textContent = 'Browser progress could not be read. Existing data will be left unchanged.'; exportButton.disabled = true; }
    }
    function open(event) {
      trigger = event?.currentTarget || openButton;
      pending = null; generation++; preview.hidden = true; confirm.disabled = true; file.value = ''; status.textContent = '';
      refreshSummary();
      if (!dialog.open) dialog.showModal();
      close.focus();
    }
    openButton.addEventListener('click',open);
    close.addEventListener('click',() => dialog.close());
    dialog.addEventListener('close',() => { pending = null; generation++; if (trigger.isConnected) trigger.focus(); });
    exportButton.addEventListener('click',() => {
      try { download(current()); status.textContent = 'Export prepared. Keep the downloaded JSON file to move or recover your progress.'; }
      catch { status.textContent = 'Progress could not be exported. Browser storage may be unavailable or unreadable; your data was left unchanged.'; }
    });
    file.addEventListener('change',async () => {
      const selected = file.files[0], attempt = ++generation;
      pending = null; preview.hidden = true; confirm.disabled = true; status.textContent = '';
      if (!selected) return;
      try {
        if (selected.size > C.MAX_BYTES) throw new Error('Choose a JSON file no larger than 2 MB.');
        const incoming = C.parse(await selected.text());
        if (attempt !== generation || !dialog.open) return;
        previewCounts.textContent = 'In this file: ' + counts(incoming);
        pending = incoming; preview.hidden = false; confirm.disabled = false;
        status.textContent = 'Preview ready. Nothing has been imported yet.';
      } catch (error) {
        if (attempt === generation) status.textContent = error.message || 'The progress file could not be read.';
      }
    });
    confirm.addEventListener('click',() => {
      if (!pending) return;
      const previous = new Map();
      let started = false;
      try {
        // Read again at confirmation so notes saved since the preview are retained.
        const merged = C.merge(current(),pending), {studioTransfer,...progress} = merged;
        const writes = [[keys.workbook,JSON.stringify(progress)]];
        for (const key of ['session','resume','loop']) if (Object.hasOwn(studioTransfer,key)) writes.push([keys[key],JSON.stringify(studioTransfer[key])]);
        for (const [key] of writes) previous.set(key,localStorage.getItem(key));
        started = true;
        for (const [key,value] of writes) localStorage.setItem(key,value);
        pending = null; confirm.disabled = true; preview.hidden = true; file.value = '';
        window.dispatchEvent(new Event('icm-progress-restored'));
        window.dispatchEvent(new Event('icm-progress-change'));
        refreshSummary();
        status.textContent = 'Imported. Reopen the lesson to use its saved step. Your p5 editor has stayed open; save your code there before leaving.';
      } catch {
        let restored = true;
        if (started) for (const [key,value] of previous) {
          try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key,value); }
          catch { restored = false; }
        }
        status.textContent = restored
          ? 'Import could not be saved. Your previous progress was kept. Browser storage may be full or unavailable.'
          : 'Import stopped because browser storage failed. Some saved values may have changed. Keep both progress files and reopen this dialog to inspect them.';
      }
    });
    const isLocalBackup = location.protocol === 'http:' && ['localhost','127.0.0.1'].includes(location.hostname) && !document.querySelector('meta[name="studio-hosting"][content="static"]');
    if (!isLocalBackup) {
      document.querySelectorAll('[data-study-backup]').forEach(node => { node.textContent = 'Notes saved in this browser · use Progress to move them.'; });
      const backup = document.getElementById('backup-now');
      if (backup) { backup.textContent = 'Progress'; backup.onclick = open; backup.setAttribute('aria-haspopup','dialog'); backup.setAttribute('aria-controls',dialog.id); }
      const legacyExport = document.getElementById('export-progress');
      if (legacyExport) legacyExport.onclick = open;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
})();
