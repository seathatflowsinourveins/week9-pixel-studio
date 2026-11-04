# Phase playground implementation

Spec: ../specs/2026-11-03-phase-playgrounds.md

- [x] Add tested per-phase Try / Notice / control metadata (worker owns roadmap and coverage test).
- [x] Show cues in the lesson player and clarify which p5 surface the controls update.
- [x] Add the two Stage7 comparison buttons using the current tile/time handlers.
- [x] Verify all seven real p5 players, row/grid, clock, resize, A/B and phone layout through the native browser.
- [ ] Run native checks, review, publish and verify the hosted bundle; leave the learner's current stage ready.

Native checks: 103 tests passed, none failed/skipped; build exports 86 public files. Review caught and resolved a late-clock race in A/B through an explicit new-frame seek; its actual-handler regression failed against the prior handler and passes with the fix. Source-pixel selection is keyboard reachable. Native browser checked the full 18-step row, the grid through its second row (step 25/79, six squares), teaching 30/60, advancing real clock, wide/narrow dimensions and both A/B tile values paused at30. Phone viewport390 has375px document client/scroll width. Final hosted verification is recorded separately in session evidence.
