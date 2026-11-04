# Recovering a practice draft

Outcome: reopening an edited phase must leave the code available to fix, without automatically executing it. The lesson example must still run beside its explanation.

The previous editor called `run()` after every restored phase. A saved edit containing a non-advancing loop could therefore block the preview before it painted or delivered diagnostics. This mechanism was reproduced by the regression tests; it does not establish the content of the learner's inaccessible in-app draft. That browser timed out during reading, navigation, logging and closing. The existing Chrome copy had the correct mosaic code and both canvases running.

The native approach is retained: the existing editor, storage schema, Run button, iframe runner and bundled p5.js 2.3.4. Edited drafts now reopen paused. Use lesson code retains the previous edit and runs the example. Undo restores an edited draft paused. Clean lesson code still follows the phase automatically. No dependency, account, notes or global storage changes.

This is a recovery measure, not a general loop watchdog: explicitly running a non-terminating loop can still stall a browser tab. A watchdog timer on the same JavaScript thread cannot interrupt synchronous code. See [MDN's JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) and [iframe srcdoc replacement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc). Adding a parser or code transformation was rejected for this focused fix.

Verification on 2026-11-03 (America/New_York):

- Before the fix, `node --test tutorial/ecosystem/practice-editor.test.cjs` exited 1: 10 passed, 3 failed. Restoring, returning and Undo all executed edited code.
- After the fix, the same command exited 0: 13 passed. The checks cover retained code, independent phase drafts, explicit Run, lesson replacement, Undo and stale messages.
- `npm test` exited 0: all 130 passed, none skipped.
- `npm run build` exited 0: 88 public assets, seven stages.
- Chrome UI verification: an edited mosaic reopened paused with its comment retained; Use lesson code produced a running 640 × 480 canvas; Undo recovered the edited draft paused.

Acceptance: the lesson is running beside the line explanation; the saved edit is recoverable through Undo; a refresh cannot automatically execute an edited draft.
