# Group study: source and verification

## Source identity

Requested sketch: [samuelgoldman / Q1TY34oqc](https://editor.p5js.org/samuelgoldman/sketches/Q1TY34oqc), public title **Week 008: Partner Assignment copy**. The title is retained; it is not relabeled as a Week 9 source. Public project JSON fetched 2026-11-04 via `GET https://editor.p5js.org/editor/samuelgoldman/projects/Q1TY34oqc`. Reported source update: 2026-11-04T18:01:47.779Z. Private capture SHA-256: `5d1fc3dbce10198790b0cde0f1dfb83ab09f8e96e3141e354d66890e92d3dca1`.

The public GET route was checked in [processing/p5.js-web-editor](https://github.com/processing/p5.js-web-editor/blob/c8bc3f1d56070941acd1fe96b4c22fe308afee9e/server/routes/project.routes.ts), develop revision `c8bc3f1d56070941acd1fe96b4c22fe308afee9e`. `gh api` of project/API/embed route files succeeded. The initial web open failed and in-app editor navigation timed out; direct public project retrieval succeeded. Those failed page lookups are not evidence of a broken sketch.

No license for the individual sketch or its image was provided in that response. The companion credits and links the original and offers the official editor iframe. It does not republish the original complete source, JSON or COLORFUL.avif. The locally authored mathematical teaching model uses this studio’s existing sample.png.

## Versions and contrary evidence

The source index.html uses p5 2.3.4 and includes p5.sound 0.4.1. The source has no sound calls. Retain the studio's bundled p5 2.3.4: same version, no additional dependencies. A future update needs source compatibility and existing studio checks; no reason to change the pin was found.

Official [colorMode](https://p5js.org/reference/p5/colorMode/), [p5.Image.pixels](https://p5js.org/reference/p5.Image/pixels/) and [ellipse](https://p5js.org/reference/p5/ellipse/) documentation checked, with Context7 primary implementation lookup. Source RGBA is still byte data; HSB governs drawing-color arguments. The unweighted RGB average is not perceived luminance. The original's x loop is outer, y loop inner; bright circle diameter can be twice the spacing.

Crucial pinned-version difference: [v2.3.4 main.js](https://github.com/processing/p5.js/blob/v2.3.4/src/core/main.js#L240-L277), tag identity `248584a0c6bc9c7368a00b5d4ad1d17f9d846425`, sets the millis epoch before setup and again after setup/postsetup. The original saves startTime during setup, so its first progress may be negative. The original's `min(...,1)` provides only an upper bound. Source review implies a sufficiently slow setup could produce zero or negative spacing and nonadvancing loops; no such original stall was observed. The guide explicitly distinguishes its selected 0–60 elapsed timeline from that side effect and shows a first-draw clock correction for a separate revision. It leaves the original unchanged.

## Alternatives and acceptance

Use a standalone native page instead of adding an eighth draft phase: the seven-stage editor and progress contracts remain intact. A remote-editor-only guide would depend on the observed failing navigation; the separate local model provides reliable interaction, with optional official embedding/direct links. Native HTML/SVG and bundled p5 supply the needed diagrams; no UI library change.

Commands in isolated branch codex/group-study:

```
node --test tutorial/ecosystem/group-study-core.test.cjs
node --test tutorial/ecosystem/group-lessons.test.cjs
node tutorial/ecosystem/build.cjs
npm test
npm run build
npm run preview
git diff --check
```

Core red check: missing module, exit 1; implemented green: 5 tests, exit 0. Lesson checks: initial 0/6 then 6/6, strengthened to 7/7; clock regressions 5/7 then 7/7. Final suite: 163 passed, zero failed/skipped, exit 0. Build: 95 public files, seven stages, 20 foundations, exit 0. Build tests verify local links and version stamping beneath a project prefix and unchanged pinned vendor bytes.

Browser check below `/week9-pixel-studio/`: all 32 line numbers matched, diagram headings updated, 0/30/60 states were hue 30/125/220 and grid step 5/15/25 with 6400/729/256 positions. At 30 seconds selecting source (195,195) returned [172,97,100,255], address 312780; ArrowRight moved to (210,195), address 312840. Optional cell marker worked. Original iframe/direct links and return to model worked; this does not assert remote iframe rendering. Visible playback 59.9→60 held the final state; Restart returned paused at zero. A hidden tab pauses playback by design. At 420px viewport document scroll width was 405px: no horizontal overflow; panels stayed within the viewport. Temporary viewport override was reset.

Deliberately blocked p5 and sample-image requests on separate local QA servers each produced consistent status, source-caption and dependent-diagram failure messages with an original link and disabled playback. These failures did not affect the production server. Servers stopped after checks. Reviewed SVG: center (120,110), maximum radius 100 fits viewBox 240×220; opaque circle, dashed cell drawn on top. Independent review's clipping, failure-state and playback-label findings were corrected and rechecked with no material finding remaining. Private screenshots/JSON retain raw browser evidence outside public assets.
