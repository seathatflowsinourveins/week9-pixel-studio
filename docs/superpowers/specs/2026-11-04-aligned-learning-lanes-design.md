# Aligned learning lanes

Outcome: a beginner can follow one exact code line beside its meaning while the p5 picture remains running.

Acceptance: selecting a guide line updates the actual editable row, its visible highlight and its explanation; subsequent typing cannot silently target an older row. Navigation does not steal focus or restart p5. A differing draft retains its text and selection and does not claim to match the guide.

The existing editor route and source generator remain. Keep p5.js 2.3.4, native textarea, current draft schema, paused-draft recovery and account handoff. No dependency or runtime changes.

Approaches considered: keep the gutter-only mark (leaves the old caret and hides the matching meaning); replace the editor framework (unnecessary dependencies and migration); retain the native editor and synchronize its selected row (chosen, smallest change). This implements the user's repeated request for exact code/explanation alignment within the already authorized dashboard.

Show the current line and plain meaning as a readable pair, including desktop. Add a persistent current-row highlight in the textarea viewport. When navigation originates outside the textarea and the source exactly matches the guide, move the caret to the current row without moving keyboard focus. Preserve an active editor selection on click/key navigation. Derive the highlight/scroll position from the actual line height and padding so the gutter and code stay aligned.

The guide and editor remain independently scrollable. This fix synchronizes the chosen line; it does not pretend arbitrary user edits share guide line numbers. Verify the Phase 4 background and gray-rule lines, long wrapped callouts, small screens and existing recovery behavior.
