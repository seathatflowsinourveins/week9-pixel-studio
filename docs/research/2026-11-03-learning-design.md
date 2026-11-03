# Learning-design checkpoint · 2026-11-03

The outcome is a visible chain from one source coordinate through RGBA values and color transformation to a rectangle in the real p5 illustration, plus a blank place to record actual assignment work. The seven stages, 47 saved action positions, existing notes and official p5 editor remain in the existing app.

## Acceptance criteria

- At tile 16, source `(16, 16)` in a 320 × 240 image reads address 20544 and the next three RGBA entries; its marker maps to the real preview canvas.
- At 30 seconds and 50% strength, the transformation amount is 0.25, using the same transformation as the source generator.
- Step changes focus a relevant semantic line for each color rule; manual selection still works. Guide controls do not reload the official editor.
- Finish begins blank, saves entered fields, exports notes and joins Progress transfer without erasing unrelated fields. Checked boxes describe learner self-reports, not verified completion.
- The loop comparison distinguishes a single read before the loops from a separate read for each tile inside them. It explains the supplied code.

These are the change's acceptance criteria. This source checkpoint does not substitute for native tests, browser checks or hosted-asset verification.

## Decision and alternatives

Retain native HTML, DOM controls, Canvas and the pinned p5 illustration. The existing source generator provides the code and color rule; the official embedded editor retains account saving and sketch editing. No runtime dependency was added.

Code Hike's [focus documentation](https://codehike.org/docs/code/focus) demonstrates changing the emphasized code in response to interaction. That pattern informed the action-to-line connection. Its documented implementation uses React components and Code Hike annotation handlers; installing it would introduce a different rendering stack into this app. A React/MDX rewrite and a separate custom code editor were considered and declined because the existing controls can express this interaction while keeping saved steps and the official editing surface. Code Hike offers richer code presentation, but this change does not require it. No Code Hike source was copied.

## Primary sources and drift check

The [p5.Image pixels reference](https://p5js.org/reference/p5.Image/pixels/) specifies four consecutive RGBA entries and requires `loadPixels()` before access. The supplied code fixes image density at one before applying `4 * (x + y * width)`. The pinned [image implementation](https://github.com/processing/p5.js/blob/v2.3.4/src/image/p5.Image.js) and [pixel tests](https://github.com/processing/p5.js/blob/v2.3.4/test/unit/image/pixels.js) were also consulted.

| Item | Observed 2026-11-03 | Decision |
| --- | --- | --- |
| Local p5.js | 2.3.4; SHA-256 `bb8b82b97fcbcd5bb2d5475d1b6a3904f3ab4ed01b821134fd8f1e7710fce559` | Retain unchanged |
| [Latest p5 release](https://github.com/processing/p5.js/releases/tag/v2.3.4) | v2.3.4; published `2026-09-25T20:01:55Z` | Local pin matches latest release at this checkpoint |
| Code Hike documentation | Focus page displays version 1.1.0 | Design reference only |
| [Code Hike main](https://github.com/code-hike/codehike/commit/12d0c5f4ed6f584e2d8beb4bdd3b7185d4eed1be) | `12d0c5f4ed6f584e2d8beb4bdd3b7185d4eed1be`; committer date `2026-03-17T09:09:59Z` | No installation or vendoring |

Hold existing library and deployment pins: the mechanism uses supported APIs and does not need a dependency upgrade. Recheck upstream documentation, implementation/tests and release drift when changing these APIs, dependencies or deployment pins. A completed task does not establish future alignment.

## Reproducible checkpoint evidence

Run from the repository root in PowerShell. The command invocation below exited 0 on 2026-11-03; the selected response fields are recorded in the table above. The two pinned raw source requests each returned HTTP 200 (`p5.Image.js`: 65,089 bytes; `pixels.js`: 5,601 bytes). No source lookup failed in this checkpoint; no fallback was needed.

```powershell
Get-FileHash -Algorithm SHA256 tutorial/vendor/p5.min.js
$release = Invoke-RestMethod -Uri 'https://api.github.com/repos/processing/p5.js/releases/latest'
$release | Select-Object tag_name,published_at,html_url | ConvertTo-Json -Compress
$head = Invoke-RestMethod -Uri 'https://api.github.com/repos/code-hike/codehike/commits/main'
[pscustomobject]@{sha=$head.sha;date=$head.commit.committer.date;url=$head.html_url} | ConvertTo-Json -Compress
$tree = Invoke-RestMethod -Uri 'https://api.github.com/repos/processing/p5.js/git/trees/v2.3.4?recursive=1'
$tree.tree | Where-Object { $_.path -match '(^src/image/p5.Image.js$|^test/unit/image/)' } | Select-Object -ExpandProperty path
```

The native regression coverage lives in [pixel-flow-core.test.cjs](../../tutorial/ecosystem/pixel-flow-core.test.cjs), [course-selection.test.cjs](../../tutorial/ecosystem/course-selection.test.cjs), [assignment-core.test.cjs](../../tutorial/ecosystem/assignment-core.test.cjs) and [progress-transfer-core.test.cjs](../../tutorial/ecosystem/progress-transfer-core.test.cjs). Source/version checks establish provenance; those tests and browser QA establish behavior separately.
