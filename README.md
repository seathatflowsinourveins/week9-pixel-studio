# Week 9 · Pixel Studio

**[Open the interactive dashboard](https://seathatflowsinourveins.github.io/week9-pixel-studio/)**

A dark, illustrated p5.js studio for someone starting from zero. Follow one small step, read one line in plain words, and try the code in the real p5 editor beside the guide.

<img src="tutorial/assets/sample.png" width="320" alt="Practice source: a window, sun, hills and a plant">

## Start learning

1. Open the dashboard and choose **Continue with p5** or **Start at Stage 1**.
2. Read the current line and its meaning. From Stage 2, use **Follow one pixel** to connect a source coordinate, its RGBA values and the marked tile in the real p5 illustration.
3. Press **Next step** to focus the relevant code line. You can still choose any line yourself. Change one thing in p5, Run, and notice what changes.
4. Save your own sketch with p5 Save. Record observations in your own words.

Try the [pixel-address step](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/learn.html?view=editor#stage-3): with tile size 16, select **(16, 16)** and follow address 20544 through read → fill → rectangle. Later stages show original, target and current color; at 30 seconds and 50% strength, the transformation amount is 0.25. Guide steps and illustration controls keep the official p5 editor open.

**Journey** shows all seven stages. **Foundations** contains 20 lessons. **References** identifies the libraries and design references. The [loop lesson](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/loops.html?mode=row&view=editor) compares reading one color before the loops with reading a color for every tile. These diagrams explain the supplied guide code.

Open **Finish** to record your concept, partner roles, iterations, full-minute viewing notes and submission links. The desk starts blank and saves in this browser. Download process notes as Markdown or iteration/viewing rows as CSV. Its self-checks are your own record; the desk does not verify links or submit the assignment.

Desktop uses the guide and p5 side by side. Small screens stack the panes. The supplied window-and-plant image is a practice asset, not a required assignment template. The final creative concept, source and observations are yours.

## Continue on another device

Open the same dashboard URL. To move learning notes, saved steps and the Finish desk: **Progress → Export progress**, then **Progress → Import** on the other device. Review the preview and choose **Import and merge**. Matching imported lesson notes and positions replace local values; unrelated notes remain. In Finish, nonempty imported fields replace matching fields, other fields remain, and self-checks are combined.

Progress stays in each browser until you transfer it. It is not automatically synced or uploaded to GitHub. p5 sketches and unsaved editor changes are separate: use the official p5 account Save. If embedded sign-in or uploads are blocked, use **Open saved example** to open p5 directly. p5 has its own theme setting.

## The learning order

| Stage | Build | Understand |
| --- | --- | --- |
| 1 | Show one image | Files, async / await, canvas, drawing |
| 2 | Make a mosaic | One square → row → grid → sampling |
| 3 | Read a pixel | Coordinates, array addresses, RGBA |
| 4 | Choose the focus | Conditions, gray targets, interpolation |
| 5 | Shape one minute | Elapsed time, progress, change |
| 6 | Replay and present | Responsive sizing and repeatable playback |
| 7 | Refine and document | Iterations, timed observations, collaboration |

See the **[complete manifest](MANIFEST.md)** for every stage, action count, foundation and direct link. See the **[original assignment](https://github.com/ITPNYU/ICM-2026-Media/wiki/Homework-Mimi-07#week-9)** for class requirements and submission details.

## Run or edit locally

Use Node.js 22 or newer; Node 24 is used for deployment. No dependency installation is needed for the dashboard.

```sh
npm run build
npm run preview
```

Open the preview address printed in the terminal. For the Windows study service with local file backups, use `tutorial/Start-Week-9.cmd`; stop it with `tutorial/Stop-Week-9.cmd`.

```sh
npm test
```

Edit browser files under `tutorial/ecosystem/`; lesson content lives under `tutorial/data/`. The source code generator is `tutorial/project-core.cjs`. Pushing to `main` runs tests, builds only public assets and publishes GitHub Pages through [.github/workflows/pages.yml](.github/workflows/pages.yml).

The build creates the seven reference sketches from source in a fresh temporary folder. It does not copy your working project, journals, browser progress, backups or runtime files into the website. `dist/site-manifest.json` records the published file hashes.

The two complete workbooks and the PNG are included. Optional full-workbook/image regeneration uses `node tutorial/build.cjs` and requires Sharp (`npm install --no-save sharp`); normal site builds do not need it.

## Source map

- `tutorial/ecosystem/` — dashboard, pixel flow, illustrated guide, loop lesson, Finish desk and progress transfer.
- `tutorial/data/` — canonical stages, actions, foundation lessons and reference metadata.
- `tutorial/assets/`, `tutorial/vendor/` — supplied artwork and pinned p5.js 2.3.4.
- `tutorial/templates/` — blank observation, iteration, collaboration and blog templates.
- `scripts/` — public static build, preview and project-subpath checks.
- `MANIFEST.md` — ordered learning map.

See [third-party notices](THIRD-PARTY-NOTICES.md) for p5 licensing and the distinction between actual dependencies and design references.

The [learning-design checkpoint](docs/research/2026-11-03-learning-design.md) records the primary sources and the decision to keep the native HTML/Canvas app without adding React, MDX or Code Hike dependencies.
