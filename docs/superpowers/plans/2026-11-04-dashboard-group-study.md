# Dashboard group study implementation plan

> **For agentic workers:** Use subagent-driven-development for independent compact guide work; root owns dashboard integration.

**Goal:** Put the group companion inside the studio with clear navigation and intact learner work.

**Architecture:** Existing dashboard native dialog hosts one local compact guide iframe. A small focused controller owns group frame creation, transient snapshot and cleanup; dashboard retains native section navigation and routing.

**Tech stack:** Existing HTML/CSS/JavaScript, p5 2.3.4, Node tests, GitHub Pages.

**Spec:** ../specs/2026-11-04-dashboard-group-study.md

## Constraints / review focus

Seven phases and 20 foundations stay intact. No storage writes, draft edits, copied original source/image, new UI dependency or authentication change. Check valid tab IDs, source/seconds validation, repeated render, late fetch after close, focus restoration, deep links without phase hash change, modifier-click links, playback disposal and small widths.

- [x] Write failing tests for frame lifecycle, transient state, safe share URLs and invalid initialization.
- [x] Implement focused dashboard group controller and compact child variant; targeted checks green.
- [x] Integrate Group study into header/dialog/reference navigation and add an illustrated home card.
- [x] Verify all tests/build; exercise from Phase 5, another phase, home and loops. Confirm saved code/selection unchanged, reopen state paused, no duplicates after async renders, accessible focus/Escape and responsive layout.
- [ ] Independently review, correct findings, integrate and publish; verify exact CI head and hosted assets, open live dashboard Group study and capture screenshot.
