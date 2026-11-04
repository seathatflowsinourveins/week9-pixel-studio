# Live Line Illustrations Implementation Plan

> **For agentic workers:** Use the existing subagent-driven-development and TDD workflow, then independent review.

**Goal:** Put understandable live mini diagrams beside the current code line.

**Architecture:** Add a pure visual-data field to existing pixel examples and a small DOM/CSS renderer. The existing guide and controls drive it; p5 source and timing are unchanged.

**Tech Stack:** Existing native JavaScript/CSS and Node tests; p5.js remains 2.3.4.

**Spec:** ../specs/2026-11-04-live-line-illustrations-design.md

## Tasks and ownership

- [ ] Root: test first, then extend pixel-flow-core.js/.test.cjs with actual-value visual payloads, correct static/time argument behavior and boundary behavior. Integrate learn.js/learn.html and export the two new public assets.
- [ ] Worker: own line-illustration.js, line-illustration.css, line-illustration.test.cjs. Test first; implement accessible native diagrams and responsive sizing without touching any other file.
- [ ] Root: run full tests/build, CUA-check gray/region/function/background diagrams, control updates, source-line alignment, mobile overflow and p5 playback.
- [ ] Independent reviewer: verify full diff, calculations, current/target distinctions, draft preservation and export wiring.
- [ ] Root: commit and integrate into publication branch, verify exact Pages run and hosted assets, then open the newest illustrated view.

## Renderer contract

`lineIllustration.render(host, visual)` replaces host content and returns the new figure (or null for absent/unknown data). UMD exports for the browser and CommonJS tests. Render with DOM nodes and CSS, not innerHTML, canvas screenshots or a new library.

Visual payloads:

- `amount`: `{type, value, label}`; value is 0–1; label names strength/amount. Show 0–100% and clarify color-change amount.
- `region`: `{type, fraction, position, changes}`; map the rule boundary and selected sample. Before boundary keeps color; at/after changes.
- `call`: `{type, argumentName, parameterName, value}`; show argument/value → paintTiles → amount/value.
- `layers`: `{type, background:[r,g,b], block:[r,g,b]}`; show background first, one sample-colored block above it.
- `gray`: `{type, original:[r,g,b], gray:number}`; show three original bars and three equal target bars on a 0–255 scale.
- `blend`: `{type, original:[r,g,b], target:[r,g,b], current:[r,g,b], value}`; show from/now/target swatches and current 0–1 amount.
- `position`: `{type, x,y,w,h,canvasW,canvasH,rgb:[r,g,b]}`; show one rectangle at its actual fraction of the teaching canvas.

Review edge cases: protected-region samples, tile-grid boundary quantization, zero/full strength, time × strength in later phases, non-square canvases, long captions and unknown visuals. No changes to user's sketch text or saved data.
