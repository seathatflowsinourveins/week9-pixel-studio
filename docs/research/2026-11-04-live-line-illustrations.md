# Live illustrations for the learning lanes

Outcome: the learner can see the meaning of a code line, its actual values and the p5 result together. New HTML/CSS figures reuse the selected source pixel and existing controls; they never rewrite the sketch or its saved drafts.

Seven figure types cover color-change amount, rule boundary, argument passing, drawing layers, RGB-to-gray, blending and rectangle placement. Phase 4 settings, function calls/definitions and background gain missing examples. Later phases distinguish maximum strength from time-scaled amount. Applicable rectangle and color examples also work in earlier phases.

The existing native approach was retained instead of adding an editor/animation framework or repository dependency. p5.js stays at 2.3.4; the source generator, runtime, minute timing, account handoff and draft recovery remain unchanged. Review the runtime pin when runtime work is requested. Current primary documentation checked for this change: [p5 lerp](https://p5js.org/reference/p5/lerp/) (0=start, 1=target) and [background](https://p5js.org/reference/p5/background/) (RGB canvas base). The gray target is explicitly the course's simple arithmetic average, not a claim of perceptual brightness.

## Evidence and refinements

- Baseline `npm test`: 135 passed, exit 0. New numerical examples first failed 7 cases (9 passed); renderer first failed all 8 missing-figure cases. Separate role and rounding regressions were also observed before their fixes.
- First integrated suite: 149 passed, 1 failed because the older Phase 1 VM fixture did not load the new renderer or model its DOM dependencies. The fixture now loads the real module and provides dataset/ownerDocument; its original iframe-stability assertions remain unchanged.
- Final `npm test`: 151 passed, 0 failed/skipped, exit 0. `npm run build`: 90 public assets, seven stages and 20 foundations. `git diff --check`: exit 0.
- CUA visited nine Phase 4 illustrated lines. Every selected line matched the editable caret and real p5 remained running. An actual source sample at (160,160) returned RGB 172,97,100; its gray figure showed 123 for all three target channels. Next sample changed the formula to (52+93+113)/3=86.
- The Try this control button focused strength or focus as appropriate. Moving focus from 40% to 70% updated both code and diagram; selected sample 55% changed from applying the rule to keeping its color. The rule boundary is shown separately from sampled-grid quantization.
- At teaching time 30s, Phase 5 showed amount=0.5 while const strength remained 1. The editable sketch retained its independent real-time clock. Phase 1 cleared unsupported illustrations.
- Initial charts were only 192px wide inside the meaning column and fell below the visible area. Moving the live example card across both code/meaning columns expanded it to 493px. At a 420px viewport the card was 292px wide with no page overflow. Temporary viewport overrides were reset.
- Independent code and final layout reviews found no material issue. Raw tests, screenshots and browser observations are private in the parent tutorial/evidence directory. Publication is verified against the exact resulting commit and hosted manifest.
