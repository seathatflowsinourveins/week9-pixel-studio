# Automatic p5 Practice Implementation Plan

**Goal:** Change phases and immediately see editable running p5 beside its explanation.

**Architecture:** Add a local practice component to the existing editor host. The host keeps its official iframe stable in Account mode; the guide supplies current source and line information after rebuilding. A generic runner reuses pinnedp5 without lesson-only hooks.

**Tech stack:** Existing native HTML/CSS/JavaScript and bundledp5.js2.3.4; no dependency changes.

**Spec:** ../specs/2026-11-03-automatic-practice.md

**Constraints:** Preserve account source/auth, notes/progress,47actions, original source asset, phase IDs and static allowlist privacy. Practice drafts are local only and never part of public exports.

**Review focus:** Edited drafts versus updated templates; storage parse/version/quota failures; early syntax errors; late/foreign frame events; phase change after a local reset.

- [x] Runtime worker: testfirst and implement `courseRuntime.practiceFrameHTML({code,token})` in course-runtime.js with practice-runtime.test.cjs. Preserve existing frameHTML.
- [x] Root: testfirst `practiceEditor.mount({container,storage,runtime,onLine})` in practice-editor.js/test.cjs. Return setLesson({id,title,code,line,meaning}), setLine(index,meaning), getCode(). Save perphase drafts; reset/undo; actual-copy/download; safe message handling.
- [x] Root: opt-in practice support in editor-frame.js and hosttests, add scripts/styles to both lesson pages/staticallowlist. Integrate after learn.rebuildCode and loops.openChapter, synchronize selected guide line without resetting source.
- [x] Root: native fulltests/build, independent review, browser phase/draft/error/line/resize/account checks, phone.

Release verification is recorded in the session's private evidence: Pages run/head, hosted manifest hashes and final live screenshot. Public exports contain no learner drafts. Preserve this distinction from passing native tests.

Review resolved cross-phase and same-phase stale-tab overwrites: only explicit input/replacement/undo persists; writes merge the active record into a fresh validated store. Late ready/error messages identify pending unrun edits. Desktop1440 and phone390 fit without document overflow; actual canvas452×339 fits its451.86×338.61 frame within subpixel rounding. All seven phase code outputs match the guide and paint; row/grid both run. Syntax error, reset, undo, slider preservation and reload verified in native browser. Normal narrow desktop remains side by side from680px. Current implementation tests117pass/0fail/0skip.
