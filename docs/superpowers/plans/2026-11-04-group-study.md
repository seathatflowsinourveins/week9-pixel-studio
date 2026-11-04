# Group study implementation plan

> **For agentic workers:** Use subagent-driven-development for the independent lesson content and direct execution for the model/UI.

**Goal:** Explain Samuel's linked sketch to a beginner group with a working, credited, interactive companion.

**Architecture:** Standalone native page linked in dashboard References, pure mathematics and data separated from browser UI; bundled p5 draws an independently authored teaching model.

**Tech stack:** Existing HTML/CSS/JavaScript, p5 2.3.4, Node tests, GitHub Pages. No dependency changes.

**Spec:** ../specs/2026-11-04-group-study-design.md

## Constraints and review focus

Preserve seven phases and learner drafts; do not republish the original source/image. Time cap, fractional grid rounding, RGB/HSB distinction, ignored alpha, square image stretching and final hold must be accurate. Deep links, source click sampling, keyboard navigation, failed remote embed and narrow viewport need browser checks.

## Tasks

- [x] Write failing pure-math tests: 0/30/60 timeline, out-of-range input, RGBA offsets, dark/bright circle size, hue wrapping and grid snapping.
- [x] Implement group-study-core.js using independently written functions and verify targeted tests.
- [x] Delegate group-lessons.js/test: all 32 nonblank lines, concise explanations and source metadata; review factual accuracy.
- [x] Build group-study.html/css/js: step navigation, source pixel, selected diagram, p5 model, time controls, original links/optional iframe and group speaking guide.
- [x] Add page/assets to build allowlist and local-link/version tests; add dashboard reference.
- [x] Run all tests/build, browser test under project prefix at desktop and narrow widths, review changes independently.
- [ ] Integrate, push existing authorized GitHub repository, confirm exact Pages run and hosted asset hashes; open verified group lesson and capture proof.
