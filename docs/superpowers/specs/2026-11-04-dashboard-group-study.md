# Group study inside the dashboard

## Outcome

Add a native **Group study** dashboard area accessible from home, every stage and loops. The user clarified this should not be tied to Phase 5. Keep the existing 32-line credited companion single-sourced in a compact local iframe within the existing dashboard dialog.

Acceptance: the Group study header/tab opens an in-page panel, with explanations and p5 side by side on desktop and stacked on phones. Closing or choosing another dashboard tab disposes its iframe and restores focus. Current phase hash, code/selection and stored drafts remain unchanged. Reopening retains its selected source line and elapsed seconds in memory, paused. Repeated opens/data refreshes create one iframe. A shareable `panel=group-study` query opens it directly without changing the phase. Mobile page/dialog have no horizontal overflow. All regression checks and hosted file checks pass.

## Design

Use existing native dashboard chrome with a wider Group study dialog, compact chapter/author header, one vertical scrolling surface and a quiet home feature card: image → pixels → circles. Add Group study after Foundations and before References; do not create an eighth course phase or a draft schema. Keep close and section switching in the parent dashboard; preserve the child's accessible controls and source credit.

Continue bundled p5 2.3.4, native dialog/HTML/SVG. No dependency update. Reuse the existing companion rather than duplicate its lesson/maths/renderer inside learn.js. A link-only card does not meet the in-dashboard request. Replacing the current phase editor would risk drafts and mix the reference with learner work. Existing phase runners remain mounted and retain their state; do not claim to pause arbitrary user code. The group iframe is removed on leaving, preventing its playback from continuing behind the dashboard.

The child exports only `groupStudySession.snapshot()` → `{line,seconds}`, with validated query initialization. Parent remembers this transient state and never copies group data into progress/drafts. Internal reference cards open the same area with a normal shareable URL fallback. Keep standalone group-study.html available for direct sharing.
