# Exact current-line alignment

The intended result is one exact lesson line, its meaning, an editable source row and the live picture in the same learning view. A gutter mark alone does not establish that the editor's typing position follows the guide.

## Observed failure

On hosted release `b4f29298e4e83742` / source `025ef42`, CUA selected Phase 4 line 16. The guide and editor callout showed `background(12, 18, 28);`, while the textarea caret remained at line 36, character 1136. The existing `.practice-line-meaning` had computed `display: none` on desktop. The textarea/gutter already used matching 24px line heights; the defect was selection synchronization and presentation, not a 20px/24px mismatch.

The learner's edited draft differed from the guide. Its actual text was backed up outside the publication repository, then Tools → Use lesson code restored the current guide while retaining the previous draft for Undo. No learner code, notes or backups belong in the public export.

## Native approach retained

Keep the existing textarea and p5.js 2.3.4 runner. Show an actual source-row highlight and matching explanation. Guide navigation can update the caret without moving keyboard focus; active textarea navigation must retain its own selection. A differing draft must not receive a claim of exact guide alignment. No dependency change or source-code transformation is needed.

Primary references checked 2026-11-04:

- [MDN: textarea selection range](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/setSelectionRange) for code-unit offsets and native selection updates.
- [MDN: computed style](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle) for the resolved line-height and padding of the rendered editor.

Replacing the editor framework was rejected: it would add migration and dependency work without addressing a requirement the native control can satisfy. The existing p5 pin is held; review it again when a runtime or dependency change is requested. Current upstream DOM documentation was checked for this change.

## Environment and evidence

The app's managed-worktree call rejected the nested publication repository as outside its allowed workspace-root identities. Git's worktree fallback succeeded in the existing workspace. Baseline generation used `node tutorial/ecosystem/build.cjs` because the seven reference workspaces are generated, ignored files. Baseline `npm test` exited 0 with 130 tests passed, none skipped.

Raw browser observations, user-draft backups, test logs and proof images are kept in the private parent tutorial/evidence directory. Browser actions use CUA. Publication is verified against the exact resulting commit and exported manifest.

## Checks before publication

- Targeted red run reproduced three alignment failures; an additional selection-direction guard reproduced a fourth. After implementation, 17 targeted tests passed.
- Native browser QA found a horizontal-scroll edge: line 33 scrolled 505.7px right; guide navigation to short line 34 retained that offset. A regression test failed with the same value, then passed after clean external navigation reset horizontal scroll. Active-editor and differing-draft scroll remained preserved.
- Final `node --test tutorial/ecosystem/practice-editor.test.cjs`: 18/18 passed. Final `npm test`: 135/135 passed, no failures or skipped checks. `npm run build`: 88 public files. `git diff --check`: exit 0.
- Rendered guide line 16 matched caret line 16, showed a real row highlight and a visible meaning. Next line selected row 17 while leaving focus on the Next button. Keyboard navigation inside the source moved the guide to row 24 while retaining source focus.
- A harmless local edit retained its text, hid the exact-match highlight and reopened paused. Use lesson code restored matching text and caret line 16.
- At 420px viewport width the code/meaning pair stacked, the page had no horizontal overflow and the real p5 canvas kept running. The temporary viewport override was reset.
- Independent review found no material issue in the final source, CSS, tests and integration. Publication verification is recorded separately against the resulting commit.
