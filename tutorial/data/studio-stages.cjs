module.exports = [
  {
    id: 'studio-0',
    title: 'Bring your image into the sketch',
    eyebrow: '1 / 7 · Choose your material',
    goal: 'Load an image you understand, then explain the difference between its stored dimensions and the canvas displaying it.',
    foundations: ['00-start', '01-language', '02-coordinates', '10-image'],
    steps: [
      'Begin with the supplied image so you can recognize a working result. Run the complete example once before changing it. Read the line explanations beside it: a named variable remembers the image, setup prepares the sketch, and image draws the loaded material.',
      'Choose your own photograph or an image you have permission to use. With your partner, name what the original depicts and what a different reality might reveal or obscure. A familiar room could become an uncertain memory; your source and interpretation are your choices.',
      'For a saved project, open the p5 Web Editor and follow foundation 00 to use the workbook’s pinned p5 2.3.4 setup. Upload your image and make the quoted filename match exactly, including its folder and extension. Keep a working copy before replacing the example.',
      'Notice the two rectangles: the source image has its own width and height; the canvas has a separate display size. In this v2 sketch, async setup and await loadImage let the file arrive before drawing. Adjust the display size and inspect whether its proportions stretch.'
    ],
    idea: 'Your source is the material; the canvas is the surface where you arrange it. Enlarging its display does not add detail to the file.',
    predict: 'If a 320 × 240 image is drawn across a 640 × 480 canvas, which dimensions describe the source, and which describe the display?',
    practice: [
      {task: 'Show the supplied image at its stored size, then enlarge its display. Describe what changed.', hint: 'Read the final width and height arguments of image. Compare them with the image’s own dimension properties.', solution: 'Drawing at the image’s width and height shows its original size. Larger destination dimensions enlarge the visible picture; the stored source dimensions stay unchanged. Match the width-to-height ratio to avoid stretching.'},
      {task: 'Replace the source with your own image and keep one successful version.', hint: 'Check the uploaded file list before editing the quoted path. A .jpg filename and a .png filename are different.', solution: 'Upload the real file, match its exact path in loadImage, and run. If loading fails, inspect the first error and filename before changing drawing mathematics. Save the working sketch and note your source credit.'}
    ],
    checks: [
      {q: 'Why wait for loadImage before using the picture?', a: 'Fetching a file takes time. Await lets the following setup instructions use the loaded image.'},
      {q: 'Where should a variable used by both setup and draw be declared?', a: 'Outside both functions. A variable declared only inside setup is not available inside draw.'}
    ],
    pitfall: 'Do not mix a v1 preload example into this v2 starter. Follow one version’s loading pattern and check the actual filename first.',
    refs: ['https://p5js.org/reference/p5/loadImage/', 'https://p5js.org/reference/p5/image/', 'https://p5js.org/tutorials/v2_transition/']
  },
  {
    id: 'studio-1',
    title: 'Build a grid from sampled colors',
    eyebrow: '2 / 7 · Read the image',
    goal: 'Make a mosaic and explain how nested loops visit source locations and place corresponding blocks on the canvas.',
    foundations: ['02-coordinates', '05-functions', '06-mapping', '07-loops', '08-collections', '11-sampling'],
    steps: [
      'Choose one tile size. Think of it as the distance between visits to the source image. Follow the illustrated grid from its top-left corner: x moves right, y moves down, and each visit reads one source color.',
      'Read the outer loop as choosing a row and the inner loop as visiting columns in that row. Each counter starts at zero, stays below its dimension, and increases by a positive tile step. One complete row finishes before the next begins.',
      'Use get(x, y) to read a sampled color. Its four array entries describe red, green, blue and alpha. Choose that color for a block, then use source fractions to place the block on the larger canvas.',
      'Change only tile size and compare detail. Record which size lets a viewer recognize the source and which begins to hide it. This is already an artistic decision about how much information survives.'
    ],
    idea: 'A mosaic reads a few locations and makes a new drawing from them. Sampling distance controls both detail and the number of blocks.',
    predict: 'If tile size doubles, will you visit more source locations or fewer? What detail might become difficult to recognize?',
    practice: [
      {task: 'Compare tile sizes 8, 16 and 32 using the same source.', hint: 'Change one value, run, and keep the display dimensions fixed.', solution: 'Larger steps visit fewer locations and create larger blocks. Smaller steps retain more detail but ask the sketch to draw more blocks. Record your actual preference and what becomes obscured.'},
      {task: 'Explain one source-to-canvas position without reading the whole formula aloud.', hint: 'Choose a source x halfway across its width.', solution: 'Dividing that x by the source width gives 0.5. Multiplying by canvas width places the block halfway across the canvas, even when the two rectangles have different dimensions.'}
    ],
    checks: [
      {q: 'Why stop before source width rather than including it?', a: 'Source coordinates start at zero. The final integer column is width minus one.'},
      {q: 'What happens if a loop counter never approaches its stopping condition?', a: 'The loop may never finish and can freeze the preview. Stop or reload it and restore a positive step.'}
    ],
    pitfall: 'Use source dimensions when reading source locations. Using canvas width for both rectangles can sample the wrong place.',
    refs: ['https://p5js.org/reference/p5.Image/get/', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for', 'https://p5js.org/reference/p5/rect/']
  },
  {
    id: 'studio-2',
    title: 'Find the four numbers for a pixel',
    eyebrow: '3 / 7 · Understand the buffer',
    goal: 'Trace a source coordinate to its RGBA address and distinguish an array position from the color stored there.',
    foundations: ['01-language', '07-loops', '08-collections', '12-rgba'],
    steps: [
      'Select a coordinate in the diagram. Although the picture looks rectangular, its pixel buffer is one long list. Each pixel occupies four consecutive entries: red, green, blue and alpha. Array counting begins at zero.',
      'Count y complete source rows, then x additional pixels. At density one, multiply that pixel count by four: i = 4 × (x + y × sourceWidth). The channel addresses are i, i + 1, i + 2 and i + 3.',
      'Set density one for the source image used by this starter, then call its loadPixels before reading. Canvas density and image density belong to different objects; the simple formula needs the buffer’s own dimensions and density assumption.',
      'Compare the get-based mosaic with the buffer-based version. Both read source colors. Keep the source unchanged while calculating new displayed colors. If you deliberately edit a copied image buffer instead, apply those edits with updatePixels on that same image.'
    ],
    idea: 'An address tells you where to look. The number stored at that address tells you a channel amount. They are different kinds of information.',
    predict: 'For a density-one source width of 4, which four addresses belong to pixel (1, 1)?',
    practice: [
      {task: 'Calculate the addresses for (1, 1), then compare with the diagram.', hint: 'Skip one row of four pixels, add one pixel, then multiply by four.', solution: 'The first address is 4 × (1 + 1 × 4) = 20. Red, green, blue and alpha occupy addresses 20, 21, 22 and 23. Those addresses do not tell you their stored colors.'},
      {task: 'Explain a pixel whose values are [100, 40, 180, 255]. Predict an inverted green channel.', hint: 'Green is the second channel. Inversion subtracts its value from 255.', solution: 'The transformed displayed color is [100, 215, 180, 255] if only green is inverted. Red, blue and opacity stay unchanged. Reading from the original again preserves a reliable comparison.'}
    ],
    checks: [
      {q: 'Does colorMode(HSB) turn the pixel buffer into HSB entries?', a: 'No. Raw image pixel data remains RGBA; colorMode controls interpretation of color-function arguments.'},
      {q: 'Are alpha zero and opaque black equivalent?', a: 'No. Alpha zero is transparent; RGB zero with alpha 255 is opaque black.'}
    ],
    pitfall: 'The density-one address formula is not a universal formula for every buffer. Use the source image width, not the fullscreen canvas width.',
    refs: ['https://p5js.org/reference/p5/pixels/', 'https://p5js.org/reference/p5.Image/pixelDensity/', 'https://p5js.org/reference/p5.Image/updatePixels/', 'https://p5js.org/reference/p5/colorMode/']
  },
  {
    id: 'studio-3',
    title: 'Choose what keeps its color',
    eyebrow: '4 / 7 · Direct attention',
    goal: 'Use a spatial condition and transformation strength to test what a viewer notices first.',
    foundations: ['04-decisions', '05-functions', '06-mapping', '09-color', '12-rgba'],
    steps: [
      'Choose a region that should retain its original color. The starter compares a source column’s fraction, x divided by source width, with a threshold. A threshold is simply the boundary where a condition changes its answer.',
      'Outside the retained region, calculate a simple grayscale value by averaging the original red, green and blue. Blend each original channel toward that value. Strength zero keeps the original color; strength one reaches the grayscale result.',
      'Move the region boundary while keeping strength fixed. Then hold the boundary still and change strength. Observe the source subject as well as the altered background; brighter, larger or recognizable content can still compete for attention.',
      'Compare the region treatment with global desaturation or inversion. Choose the rule that supports your intended alternative reality, and describe the visible evidence. A surprising effect is a starting observation, not an explanation of its meaning.'
    ],
    idea: 'A condition chooses where a rule applies; strength chooses how far the rule changes each selected color.',
    predict: 'If the boundary is halfway across the source and the outside strength is zero, should a grayscale region be visible?',
    practice: [
      {task: 'Move the boundary to keep one important subject in color.', hint: 'Look at the subject’s position as a fraction of source width, then compare before and after.', solution: 'Choose a threshold that places the subject within the retained region. Record whether you actually noticed it earlier. The condition is spatial, so other objects in that region also retain color.'},
      {task: 'Compare half strength and full strength without moving the boundary.', hint: 'Keep the original source and all other settings identical.', solution: 'Half strength mixes original channels with the gray target; full strength makes those channels equal outside the region. Note whether partial color better supports the idea than complete desaturation.'}
    ],
    checks: [
      {q: 'Why divide x by source width?', a: 'It expresses source position as a fraction, letting the boundary work with different image sizes.'},
      {q: 'Is the average of RGB a perceptually exact brightness measure?', a: 'No. It is a simple grayscale exercise; human brightness perception weights colors differently.'}
    ],
    pitfall: 'Changing the boundary and strength together makes their effects harder to distinguish. Compare one change at a time.',
    refs: ['https://p5js.org/reference/p5/lerp/', 'https://p5js.org/reference/p5/colorMode/', 'https://github.com/ITPNYU/ICM-2026-Media/blob/c6594912cbbad97b5fbb4058fba264c70c4b8b2b/weeks/02_pixels.md']
  },
  {
    id: 'studio-4',
    title: 'Give the change a real minute',
    eyebrow: '5 / 7 · Compose the experience',
    goal: 'Connect elapsed time to the color transformation and inspect a deliberate beginning, middle and ending.',
    foundations: ['01-language', '03-animation', '06-mapping', '14-time'],
    steps: [
      'Record the starting clock reading after the image is loaded and prepared. During draw, subtract that reading from millis to find elapsed milliseconds. Divide by 60000 to express progress through one minute.',
      'Constrain progress between zero and one. Connect that fraction to the transformation strength so the source changes gradually. After sixty seconds the clamped fraction stays at one, holding the ending rather than continuing beyond it.',
      'Inspect the beginning, thirty-second midpoint and ending using the time controls. Scrubbing helps you compare states; it does not replace watching the complete minute. Describe when attention should move and which visible change encourages that movement.',
      'Rehearse quickly while adjusting one rule, then restore sixty seconds. Watch a real run with a separate timer. A slower computer may show fewer frames, but frame count must not define the intended duration.'
    ],
    idea: 'Time progress and transformation strength are separate values. A minute can travel toward a subtle endpoint or a dramatic one.',
    predict: 'What is progress at thirty seconds? After seventy seconds, what value should constrain preserve?',
    practice: [
      {task: 'Try a six-second rehearsal, then restore the assignment duration.', hint: 'Change the duration setting rather than the pixel or color formulas.', solution: 'Six thousand milliseconds compresses the same progression for inspection. Restore sixty thousand, replay, and verify a complete minute before presenting.'},
      {task: 'Keep a full-minute duration but reduce the final transformation strength.', hint: 'Scale the amount passed to the blend, leaving the clock calculation alone.', solution: 'A final strength of one-half covers only half the color journey over the same minute. Compare whether the quieter endpoint communicates your intended change.'}
    ],
    checks: [
      {q: 'Why begin timing after loading?', a: 'Loading should not consume part of the intended visible experience.'},
      {q: 'Does requesting sixty frames per second guarantee 3600 frames take a minute?', a: 'No. Requested frame rate is a target. Measure elapsed time instead.'}
    ],
    pitfall: 'Do not repeatedly transform already transformed colors unless accumulation is intentional. Recalculate from the unchanged source for this starter.',
    refs: ['https://p5js.org/reference/p5/millis/', 'https://p5js.org/reference/p5/constrain/', 'https://p5js.org/reference/p5/frameRate/', 'https://p5js.org/reference/p5/lerp/']
  },
  {
    id: 'studio-5',
    title: 'Replay and fill the presentation screen',
    eyebrow: '6 / 7 · Make the demo dependable',
    goal: 'Present the same intended journey twice and keep its composition usable at the actual display size.',
    foundations: ['02-coordinates', '04-decisions', '06-mapping', '13-mirror', '15-project'],
    steps: [
      'Replay from the start and compare the beginning, midpoint and ending. This starter needs no randomness. Restarting its clock should repeat its rules while reading the same unchanged source.',
      'Use createCanvas(windowWidth, windowHeight) for the saved presentation sketch. Place and size elements relative to canvas width and height. Test a wide window and a narrow window, checking important content and the color of any uncovered background.',
      'Read the resize handler: windowResized responds to viewport changes and resizeCanvas updates the drawing surface. Verify that the composition still works after resizing. Decide whether a stretched image suits your idea or needs preserved proportions.',
      'In the p5 editor use File → Share to obtain the fullscreen link, and open that actual link. Rehearse the experience twice. If you choose the optional noise extension in lesson 15, set noiseSeed(0) and randomSeed(0) before their respective uses; rehearse any interactions deliberately.'
    ],
    idea: 'Repeatability includes source material, timing, procedural choices and human actions. Seeds address only the procedural generators they control.',
    predict: 'Would setting a random seed make live camera input or an unplanned mouse movement repeat exactly?',
    practice: [
      {task: 'Replay twice and compare three matching moments.', hint: 'Keep the source and controls fixed. Use the same elapsed-time positions for comparison.', solution: 'The default starter should reproduce its displayed states at matching progress values. If results differ, inspect changing inputs or state that was not reset before adding more effects.'},
      {task: 'Test the actual fullscreen link and resize the browser.', hint: 'Check important edges, labels, background and source proportions.', solution: 'Adjust proportional placement where necessary. A viewport-sized canvas does not itself invoke browser fullscreen; the shared fullscreen presentation page must also be tested.'}
    ],
    checks: [
      {q: 'Do randomSeed and noiseSeed replace each other?', a: 'No. They control different generators. The assignment specifies zero when using them.'},
      {q: 'Must you add noise to meet the assignment?', a: 'No. It is an optional visual rule. A deliberate pixel and color transformation can work without randomness.'}
    ],
    pitfall: 'A working workbook preview does not prove your saved editor asset paths or shared fullscreen presentation work. Test both.',
    refs: ['https://p5js.org/reference/p5/windowResized/', 'https://p5js.org/reference/p5/resizeCanvas/', 'https://p5js.org/reference/p5/noiseSeed/', 'https://p5js.org/reference/p5/randomSeed/', 'https://github.com/ITPNYU/ICM-2026-Media/wiki/Homework-Mimi-07#week-9']
  },
  {
    id: 'studio-6',
    title: 'Make, watch and document together',
    eyebrow: '7 / 7 · Finish your Week 9 submission',
    goal: 'Turn your experiments into a silent paired project with real evidence, a rehearsed presentation and complete submission links.',
    foundations: ['05-functions', '09-color', '15-project', '19-debug'],
    steps: [
      'Work in pairs. Sit together through ALL linked Color Theory examples and record 2–3 genuine observations to explore. Agree on the concept, give each partner independent work, then reunite to evaluate it. Record what each person did alone and together.',
      'Make at least three algorithm iterations. Save each version and record what changed and how the output changed. Use the blank iteration template; preserve real evidence rather than filling a log with anticipated results.',
      'Watch the project at least three full times with a timer. Each time record what you notice and its timestamp in seconds. Keep observations separate from interpretations. Compile the iterations and observations in the class spreadsheet linked from the assignment; local templates help prepare that material.',
      'Write the process blog with collaboration, experiments, iterations, timed observations and references to related or inspiring projects. Pick an iteration to post as requested. Prepare blog, sketch-code and fullscreen links. Follow the existing project checklist and the live assignment for submission destinations.',
      'Rehearse the silent one-minute experience twice at presentation size. Keep any imported video silent and plan interaction timing. Complete the separately assigned sound reading and watching, including the specified book exercises; sound preparation is separate from this silent artifact. Confirm the actual calendar deadline with your class.'
    ],
    idea: 'A useful process record lets someone connect a decision, a changed rule and an observed result. Your partner can help question that connection.',
    predict: 'Which observation would help you revise: “the effect is good,” or “at 22 seconds I noticed the doorway before the face”? Why?',
    practice: [
      {task: 'Run one honest iteration-and-viewing cycle with your partner.', hint: 'Choose one rule change, save it, watch the full minute, and write actual timestamps.', solution: 'Record the changed rule and its observed effect. Compare your separate attention notes before agreeing on a revision. Repeat until you have at least three iterations and three full timed viewings; one cycle alone is incomplete.'},
      {task: 'Audit the submission from the viewer’s perspective.', hint: 'Use the project checklist, open every link, and check the class spreadsheet destination.', solution: 'Verify the blog, code and fullscreen links; source and inspiration credits; collaboration record; color observations; iteration evidence; and timed viewings. Rehearse two silent runs. Fill gaps with real work rather than invented documentation.'}
    ],
    checks: [
      {q: 'Do the downloaded blank logs replace the class spreadsheet?', a: 'No. Compile the requested iterations and observations in the spreadsheet linked by the assignment.'},
      {q: 'Does the sound preparation mean adding sound to this project?', a: 'No. The project explicitly has no sound. Complete the assigned sound preparation separately.'}
    ],
    pitfall: 'A polished effect without the required collaborative process, observations and working submission links leaves the assignment incomplete.',
    refs: ['https://github.com/ITPNYU/ICM-2026-Media/wiki/Homework-Mimi-07#week-9', 'https://p5js.org/tutorials/field-guide-to-debugging/']
  }
];
