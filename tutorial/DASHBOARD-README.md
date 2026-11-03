# Week 9 Pixel Studio

A local learning dashboard with seven illustrated stages, 20 foundation lessons, and the official p5 Web Editor beside the guide.

## Start on Windows

1. Extract the ZIP into a new folder. Install Node.js 18 or newer if `node --version` is unavailable.
2. Double-click `Start-Week-9.cmd`. Keep the extracted folder together.
3. Use **Continue with p5**. Journey, Foundations, References, and Finish open from the shared navigation.
4. Use `Stop-Week-9.cmd` to stop this folder’s service.

Setup creates blank working folders and reference sketches in `workspace/`; repeat setup preserves existing learner files. Save online code with the p5 editor’s normal Save action. Sign-in is required for account saving and uploads; guest authentication and editor theme controls remain the official editor’s behavior. The embedded editor needs an internet connection. Local examples and the bundled workbook use pinned **p5.js 2.3.4**.

Notes and self-marked completion use browser storage; export workbook progress to keep a portable copy. Local startup backups protect saved local files, not unsaved online edits. The shared dashboard never marks stages complete for you.

## Develop and check

No package installation is needed for the dashboard, local service, source packaging, or native tests.

```powershell
node ecosystem/build.cjs
node ecosystem/build-course.cjs
node --test *.test.cjs ecosystem/*.test.cjs
node ecosystem/doctor.cjs
```

`ecosystem/build.cjs` generates reference projects without overwriting existing files. `build-course.cjs` builds course/dashboard JSON and copies the source code generator. The generated workbook HTML and PNG are included. The older full-workbook builder `build.cjs` also regenerates the image and currently requires Sharp at its configured path; it is not needed to start or rebuild the dashboard.

To rebuild the filtered source ZIP on Windows:

```powershell
node package-dashboard.cjs --verify
```

The script uses Windows PowerShell’s native archive commands, checks source hashes, extracts into a new temporary folder, regenerates the course and reference projects, runs the native tests, and probes its own in-process server. `--list` previews the positive allowlist without creating an archive. `SOURCE-MANIFEST.json` records SHA-256 hashes of packaged files; `PACKAGE-VALIDATION.json` beside the resulting ZIP records verification commands, exits, and the retained raw test log path.

The archive excludes learner workspaces, backups, runtime files, browser evidence, private research notes, progress files, and other archives. `data/research.json` contains public upstream source metadata used by the workbook builder. Vendor p5 and its LGPL license remain under `vendor/`. Radix Primitives is a design reference, with no installed dependency; the dashboard uses native HTML dialog and Canvas APIs.
