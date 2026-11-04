# The complete learning manifest

Open the [dashboard](https://seathatflowsinourveins.github.io/week9-pixel-studio/). Read → try → notice → next. These are learning stages; completion is marked only by the learner.

## Seven stages · 47 small actions

| Order | Stage | Actions | Mechanism |
| --- | --- | --- | --- |
| 1 | [Show one image](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/learn.html?view=editor#stage-1) | 9 | Image → canvas |
| 2 | [Make a mosaic](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/learn.html?view=editor#stage-2) | 7 | Square → row → grid |
| 3 | [Find a pixel’s four numbers](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/learn.html?view=editor#stage-3) | 6 | Position → RGBA |
| 4 | [Choose what keeps its color](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/learn.html?view=editor#stage-4) | 6 | Position test → color |
| 5 | [Shape one minute](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/learn.html?view=editor#stage-5) | 6 | Seconds → progress |
| 6 | [Replay and present](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/learn.html?view=editor#stage-6) | 6 | Replay → resize |
| 7 | [Refine and document together](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/learn.html?view=editor#stage-7) | 7 | Test → observe → share |

Before the Stage 2 mosaic, use the [row → grid loop lesson](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/loops.html?mode=row&view=editor). Each click highlights the next operation and illustrates the squares drawn so far. The normal p5 Run draws the full loop immediately. Its sampling comparison shows one color read before the loops beside a new color read for each tile inside the loops.

## Follow the mechanism

From Stage 2, **Follow one pixel** connects the supplied source image to its RGBA addresses, channel values and selected rectangle in the real p5 illustration. Click the source, use its arrow keys, enter coordinates or move to the previous/next sample. Coordinates snap to the current sampling grid.

In [Stage 3](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/learn.html?view=editor#stage-3), set tile 16 and select **(16, 16)**: `4 × (16 + 16 × 320) = 20544`. The next three addresses hold green, blue and alpha. Stage 4 adds original/target/current color; Stage 5 separates elapsed progress from strength, so `30 / 60 × 0.5 = 0.25`.

Changing steps focuses a relevant line by its role in the code, including when the color rule changes. Manual line selection remains available. These controls explain the supplied code and retain the official p5 editor beside the guide.

## Read in this order

**Image → one row → grid → mosaic → RGBA → focus → one minute → replay / resize → Finish.**

Every stage shows Learn first, Make and For the assignment. Use Next line to read every code line and First line to start over. More detail expands the longer explanation; the numbered All lines table keeps code beside meaning. Closing braces name the block they end.

| Stage | Learn first | Practice to show |
| --- | --- | --- |
| 1 | First code, variables | Explain loading an image and drawing it |
| 2 | RGB color, loops | Draw a row, add rows, sample a mosaic |
| 3 | Arrays, RGBA | Trace addresses and stored color values |
| 4 | Decisions, mapping | Explain the colored region and changed region |
| 5 | Animation, elapsed time | Watch a real minute from beginning to end |
| 6 | Coordinates, functions | Replay twice and test window sizes |
| 7 | Color, debugging | Keep Stage 6 code; document actual experiments |

Stage 1’s continuation opens the loop lesson. Row → grid stays in that lesson; grid → mosaic opens Stage 2. Save or copy pane edits before changing pages. Stage 7 opens Finish in place, keeping p5 available. Additional foundations are practice links; the advanced project example is optional.

## Twenty foundations

### 01 · Drawing and code

1. [Meet your drawing machine](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#00-start)
2. [Read code and name values](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#01-language)
3. [Place shapes and control drawing order](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#02-coordinates)
4. [Understand setup draw and motion](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#03-animation)
5. [React to the mouse and make decisions](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#04-decisions)
6. [Reuse a rule with functions](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#05-functions)
7. [Convert one range into another](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#06-mapping)
8. [Repeat instructions across a grid](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#07-loops)
9. [Store lists and related information](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#08-collections)
10. [Use color to direct attention](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#09-color)

### 02 · Pixels and this project

11. [Open an image: a file becomes material](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#10-image)
12. [Sample an image: turn detail into a mosaic](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#11-sampling)
13. [Read RGBA: four numbers make one pixel](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#12-rgba)
14. [Transform a drawing without damaging its source](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#13-mirror)
15. [A real minute: turn elapsed time into a color journey](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#14-time)
16. [Your one-minute alternative reality](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#15-project)

### 03 · Optional media and debugging

17. [Optional: draw time with a slit scan](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#16-slit)
18. [Optional: sample a live camera in the editor](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#17-camera)
19. [Optional: use your own silent video file](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#18-video)
20. [Practice: find the first error and repair one thing](https://seathatflowsinourveins.github.io/week9-pixel-studio/Week-9-Project-Studio.html#19-debug)

## Assignment finish check

Open **Finish** in the [dashboard](https://seathatflowsinourveins.github.io/week9-pixel-studio/) or beside [Stage 7](https://seathatflowsinourveins.github.io/week9-pixel-studio/ecosystem/learn.html?view=editor#stage-7). Its blank desk has space for concept and partner roles, iteration results, timestamped full-minute viewings, submission links and the following self-checks. Enter what you actually made and watched.

- Work with your partner on a pixel-level image or video alternative reality.
- Make a silent piece that changes over one minute. Use color to guide attention.
- Make the result repeatable for two demonstrations. Seed randomness if you use it.
- Use windowWidth, windowHeight and relative sizing. Test the fullscreen p5 link.
- Together, record 2–3 observations from the color theory examples.
- Keep at least three algorithm iterations: what changed and what happened.
- Watch the complete minute at least three times. Write timestamped observations.
- Record iterations and observations in the class spreadsheet. Explain partner roles in your blog; include references and tested code / fullscreen / blog links.
- Complete the separate sound reading / viewing task. Keep this visual piece silent.

Use the [assignment source](https://github.com/ITPNYU/ICM-2026-Media/wiki/Homework-Mimi-07#week-9) for authoritative links and instructions.

Finish saves in this browser. Download process notes as Markdown and iteration/viewing rows as CSV, or use **Progress → Export progress** to transfer the whole desk with your lesson notes and saved steps. Links and checked boxes are self-reported; this page does not submit or verify your work.

## References

- [processing / p5.js](https://github.com/processing/p5.js) — Used · local drawing library. The lesson previews run p5.js 2.3.4, pinned in this kit. Learn image, get, pixels, loops and time.
- [processing / p5.js-web-editor](https://github.com/processing/p5.js-web-editor) — Used · official embedded editor. Practice beside the guide. Use Open p5 & save for sign-in and saving in a full browser tab. Keep your saved sketch URL in Finish.
- [radix-ui / primitives](https://github.com/radix-ui/primitives) — Design reference · no installed dependency. Reference for clear component states and accessible dialog behavior. This dashboard uses the browser’s native dialog.
- [Code Hike focus](https://codehike.org/docs/code/focus) — Design reference · no installed dependency or copied source. The guide uses the idea of focusing code in response to a learner’s action, implemented with its existing native DOM controls.
- [p5 reference](https://p5js.org/reference/) — Primary learning reference. Look up the exact drawing command when a word is new.
- [p5.Image pixels](https://p5js.org/reference/p5.Image/pixels/) — Primary reference for the RGBA buffer and the required `loadPixels()` call before reading it.
- [HTML dialog standard](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element) — Primary interface reference. The dashboard opens above your lesson. Close or Escape returns to the same editor.

## Keep your own work

Use Open p5 & save for account saving in the full p5 tab. Keep current pane edits by copying or downloading them first. Copy guide code copies only the prepared lesson. Your kept p5 sketch link appears in Finish and travels with Progress. Use Progress Export/Import for lesson notes, saved steps and the Finish desk. Keep screenshots, source files, tested iterations and actual timed observations with your project. The dashboard never invents observations or marks your work complete.
