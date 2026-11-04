# Aligned Learning Lanes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement task-by-task. Steps use checkbox syntax.

**Goal:** Keep the selected guide line, editable source and plain meaning visibly synchronized beside the live p5 picture.

**Architecture:** Preserve the native practice editor and line callbacks. Fix caret/highlight synchronization inside the editor and display the existing meaning beside its corresponding code. No source/runtime rewrites.

**Tech Stack:** Native JavaScript, CSS, textarea, Node test runner; bundled p5.js 2.3.4 remains.

**Spec:** ../specs/2026-11-04-aligned-learning-lanes-design.md

## Constraints and review focus

- Preserve all edited drafts, storage, Undo recovery and account state.
- Guide navigation must not steal focus, trigger code input, persist or restart a preview.
- Textarea click/key navigation must preserve the user's selection.
- Differing source must never receive a false guide-row highlight.
- Long lines, manual scrolling, responsive layout and computed row metrics must remain usable.

## Task 1: Synchronize and display the selected line

**Files:** tutorial/ecosystem/practice-editor.js; tutorial/ecosystem/practice-editor.css; tutorial/ecosystem/practice-editor.test.cjs.

- [ ] Add behavior tests for clean guide navigation, unchanged keyboard focus, actual row/caret position, preserved active-editor selection, scroll/highlight tracking and edited-draft exclusion.
- [ ] Run `node --test tutorial/ecosystem/practice-editor.test.cjs` and record the real failing assertions.
- [ ] Make the smallest native-editor change that passes; expose the existing meaning in a paired code/meaning callout with a mobile stack.
- [ ] Run targeted tests, `npm test`, `npm run build`, and `git diff --check`.

## Task 2: Browser review and publication

- [ ] Inspect the rendered Phase 4 view through CUA. Select lines 16 and 23 and navigate with Next line and a textarea click. Verify exact source/meaning/highlight agreement and a running canvas.
- [ ] Check a harmless local edit: navigation preserves it and avoids false matching. Restore the local lesson example through Tools.
- [ ] Inspect narrow and desktop layouts, preserve focus and live rendering, and save proof images.
- [ ] Obtain a fresh reviewer check, fix material findings and rerun applicable checks.
- [ ] Commit, fast-forward the publication branch, push the authorized update, verify its exact Pages run and hosted assets, then open the final Phase 4 learning view.

## Environment evidence

The native app worktree tool rejected the publication subfolder because it only accepts the chat's workspace roots. Git's native fallback created the sibling worktree `published/week9-aligned-lanes` on `codex/aligned-lanes` from 025ef42; the original publication checkout remains available.
