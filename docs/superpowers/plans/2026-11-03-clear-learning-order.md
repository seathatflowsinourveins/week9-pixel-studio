# Clear learning order implementation

Spec: ../specs/2026-11-03-clear-learning-order.md
Stack: existing native browser UI, generated course data and pinned p5.js.

- [x] Test explanation coverage and contextual closing braces. Worker owns course-runtime.js, short-line-meanings.cjs, learning-roadmap.cjs and learning-coverage.test.cjs.
- [x] Test the sequential navigation model; connect ordered stage prerequisites and the assignment bridge to generated data.
- [x] Add visible line position, first-line navigation, compact stage route, responsive code/meaning columns and explicit row/grid/mosaic continuation.
- [x] Connect Stage 7 directly to Finish without reloading the editor. Update README and the manifest.
- [ ] Run focused/full native checks, independent review, desktop/mobile browser checks and publish/verify the existing Pages site.

Preserve native p5 authentication and saved project, all notes and self-reported completion. No dependency changes or new public services.

Local verification:101 native tests pass; generated explanation coverage614 line occurrences plus355 foundation lines. Browser checks verified first-use start, image/row/grid/mosaic route, contextual endings, line navigation, responsive columns and Finish in place. Publishing follows these checks.
