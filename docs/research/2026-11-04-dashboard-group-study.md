# Group study dashboard integration checkpoint

## Outcome and implementation choice

The user requested the group companion inside the main dashboard and clarified it need not be tied to Phase 5. Group study is a top-level dashboard section between Foundations and References, with an illustrated home card. It is available from home, all seven phases and loops. A `panel=group-study` deep link keeps the host page's phase hash and unrelated query settings. The reference card opens this same in-page area; normal link behavior remains available for modifier clicks.

Existing native dialog chrome hosts a compact local iframe using the same lesson, diagrams and bundled p5 model. Replacing the phase editor or introducing a new phase would risk learner work; a standalone link would not satisfy this request. No library was added. Continue p5 2.3.4, which matches both source and studio; reference-source review and the clock caveat remain in [the preceding checkpoint](2026-11-04-group-study.md). The [HTML dialog standard](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element), current 4 November 2026 revision, was checked for this native approach.

`dashboard-group.js` owns one iframe, copies only a validated source line and seconds into transient memory, and removes that iframe on Close or section change. It never replaces the current editor or stores group state in learner progress/drafts. `groupStudySession.snapshot()` is available before p5 loading completes. The embedded variant starts paused, preserves author credit, and has one internal vertical scrolling surface. Background scrolling is locked while the group panel is open. The existing phase runners retain their state; this does not claim to pause arbitrary user code in another iframe.

## Contrary evidence and fixes

Independent review found a native queued-close race and missing Back/Forward synchronization. Regression checks first showed 4 passing / 2 failing, then all 6 passing after guarding stale close events when the dialog is open and reconciling `panel` on popstate.

Real browser testing showed Escape inside the owned guide did not close its parent dialog. The guide now forwards an Escape request; the parent accepts only the correct message kind, current group frame window and exact origin while Group study is active. Regression: 6 passing / 1 failing before the fix, then 7 passing. Escape inside the cross-origin original p5 editor belongs to that external site; the parent dashboard Close button remains available. Independent recheck found no remaining material issue in the changed paths.

Initial implementation accidentally removed the loop page's dashboard-core script while editing its head; it was restored before the browser/build acceptance checks. An initial read-only browser evaluation could not read an iframe contentDocument through the automation surface; subsequent checks used supported frame-scoped DOM locators. These were corrected paths, not successful evidence from the failed attempts.

## Verification commands and observations

```
node --test tutorial/ecosystem/dashboard-group.test.cjs
node --test tutorial/ecosystem/dashboard-integration.test.cjs
node --test tutorial/ecosystem/group-study-core.test.cjs
node tutorial/ecosystem/build.cjs
npm test
npm run build
npm run preview
git diff --cached --check
```

Controller red check: missing module, exit 1; green: 4 tests. Integration first red: 0/4; initial green: 4/4, expanded to 7/7 after the navigation and Escape regressions. Session validation red: 5 passing / 2 failing; green: 7 tests including existing mathematics. These meaningful tests cover route preservation, repeated render, late data after close, invalid/failed snapshots, exact tab IDREFs, queued close and request-source validation. Final full-suite output and hosted verification are retained privately; the CI run identifies the deployed source revision.

Browser checks under the GitHub project prefix:

- From Phase 5: one group frame; line 28 and 30 seconds displayed with p5 ready. Close preserved textarea bytes, both selection endpoints, selected guide line and #stage-5. Focus returned to Group study. Reopen restored line 28 / 30 seconds paused.
- Native Back from Group/Phase 5 moved to Phase 4 and removed the group frame. Forward restored Group/Phase 5. Escape inside the owned guide removed it and returned focus.
- Home feature card, References internal entry and a direct loop-page deep link each opened exactly one in-page group frame. Switching to References removed the frame.
- At 420px viewport: parent scroll width 420; modal bounds 0–420 and height 820; child width/scroll width both 405; stacked panels stayed inside it. Temporary viewport override reset.

Build remains seven stages, 47 actions, 20 foundations and now 97 public assets. Pinned vendor bytes and private/public boundaries remain covered by existing build tests. The browser evidence contains no account credentials or user source copying, and stays outside the public build allowlist.
