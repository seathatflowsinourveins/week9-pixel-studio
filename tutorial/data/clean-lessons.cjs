'use strict';

// Keep the original action order so saved studio.walkthrough positions still
// identify the same learning task. The clean view uses its own control labels.
const guided = require('./guided-walkthroughs.cjs');

const lessons = [
  {
    title: 'Show one image',
    subtitle: 'A file becomes a picture on your drawing surface.',
    outcome: 'Display sample.png, then explain why its source size and canvas size are different.',
    illustrationHint: 'This is a real p5 sketch. The source is 320 × 240 pixels; its canvas is 640 × 480. A still image is the expected result.',
    experiment: {
      instruction: 'In your p5 editor, change only createCanvas(640, 480) to createCanvas(320, 240). Run, compare, then restore 640, 480 and save.',
      expect: 'The displayed picture becomes smaller. The original image file stays 320 × 240.'
    },
    checkpoint: 'I can load the image, save the sketch, and explain that loadImage loads while image draws.',
    actions: [
      {
        here: 'Keep this lesson visible beside your usual browser’s p5 editor. Read one action here, then perform its editor instruction. You can revisit any action without starting your project again.',
        editor: 'Open your saved Stage 1 sketch. You already confirmed its image runs in your usual browser. Keep that browser for editing if the in-app preview is blank.'
      },
      {
        here: 'Press Restart p5. Look for the window, sun, hills and plant in the illustration. This establishes the result you will recognize when you run your own sketch.',
        editor: 'Keep your saved sketch as it is. Compare its preview with this illustration. Stage 1 draws once; it does not yet animate.'
      },
      {
        here: 'Choose Download sample.png and locate the downloaded image file. Its stored size is 320 × 240. Keep its exact filename for the upload step.',
        editor: 'Your prepared Stage 1 already has this image. When rebuilding the exercise, upload the actual file. A Downloads folder path pasted into code does not upload it.'
      },
      {
        here: 'Identify the three jobs: index.html loads the page and p5 library, sketch.js contains your program, and sample.png supplies the image. Your existing saved project is ready; these steps also let you recreate it.',
        editor: 'Open the file panel with Open Sketch files navigation. Find index.html, sketch.js and sample.png. Use a new sketch if you want to rebuild the exercise separately from your saved version.'
      },
      {
        here: 'Choose Copy index.html. This copies the complete page setup for p5 2.3.4. Use the HTML explanation link when you want to understand its 17 lines.',
        editor: 'Select index.html. Click inside its code, press Ctrl+A, then Ctrl+V to replace that whole file. The prepared Stage 1 already has this setup. Keep sketch.js as a separate file.'
      },
      {
        here: 'Have the downloaded sample.png file ready. Its name in the project must match the quoted text in loadImage("sample.png"). The supplied image lets you recognize a working result before choosing your own material.',
        editor: 'If sample.png is already beside sketch.js, this step is done. Otherwise use the + button next to Sketch Files, choose upload file, then Drop files here or click to use the file browser. Select sample.png and confirm it appears in the file list.'
      },
      {
        here: 'Choose Copy sketch.js. It copies this stage’s complete eight-line program. Select a code line to read its explanation, or use Next line to move through the program in order.',
        editor: 'Select sketch.js, click inside its code, press Ctrl+A, then paste. Replace the entire old program. The first line is let picture; and there is one async function setup().'
      },
      {
        here: 'Press Restart p5 and compare the illustration with your editor. Write two short statements: “source: 320 × 240” and “canvas: 640 × 480.” Seeing the result and saving the project are separate checks.',
        editor: 'Press the Run triangle. Confirm the image appears, give the sketch a recognizable title and choose File → Save. Reopen its actual saved address to check that your code and asset were saved.'
      },
      {
        here: 'Select the createCanvas line and read its explanation. Predict what a smaller canvas will do. This lesson’s reference stays available while you make the practice change in your editor.',
        editor: 'Change only createCanvas(640, 480) to createCanvas(320, 240), then Run. Compare the display. Restore 640, 480, Run again and Save. Explain what changed before continuing.'
      }
    ]
  },
  {
    title: 'Make a mosaic',
    subtitle: 'Read one color, draw one block, and repeat.',
    outcome: 'Build a mosaic and explain how the sampling step controls its detail.',
    illustrationHint: 'Each block uses one color sampled from the source. The loops visit a row from left to right, then move to the next row.',
    experiment: {
      instruction: 'Compare tile values 8, 16 and 40 while keeping the source image fixed. Inspect the illustration and the generated const tile line after each change.',
      expect: 'The three settings use 1,200, 300 and 48 samples. Larger steps make fewer, larger blocks.'
    },
    checkpoint: 'I can explain why increasing tile makes the mosaic coarser, and I saved one tested version.',
    actions: [
      {
        here: 'Set tile to 16 and press Restart p5. Compare this mosaic with the smooth Stage 1 picture. Keep the same source image while learning the sampling rule.',
        editor: 'Choose Copy sketch.js, select all of sketch.js in the editor, and replace it. Run and Save this stage. Keep the same sample.png and index.html.'
      },
      {
        here: 'Look at the block edges: they form a grid even though no outline is drawn. At tile 16, the 320 × 240 source is visited in 20 columns and 15 rows. Trace one row with your eyes, then move down.',
        editor: 'Keep the program unchanged. Find noStroke(), which removes rectangle outlines. The blocks still meet along grid boundaries because rect places them next to one another.',
        expect: 'Twenty block columns and fifteen rows cover the image.',
        question: 'Why can you recognize a grid without drawn outlines?',
        choices: ['The filled rectangles meet along regular boundaries', 'The image must contain a hidden grid file'],
        correct: 0,
        explanation: 'The rectangle positions create the grid; outlines are optional.',
        repair: 'Use tile 40 temporarily so the block edges are easier to count, then restore 16.'
      },
      {
        here: 'The step selects the sampling line. In Follow one pixel, try source (0, 0), then Next sample for (16, 0). Each visit reads a color before drawing its rectangle. Stage 3 adds an address inspector.',
        editor: 'Read const shade = picture.get(x, y); as “remember the color at this source location.” Read shade[0], shade[1], shade[2], shade[3] as red, green, blue and alpha.',
        expect: 'You can follow a source color from get into fill and then into one block.',
        repair: 'Read the get and fill explanations consecutively with Next line.'
      },
      {
        here: 'Select the line beginning for (let y, then the following for (let x line. Use Next line to reach rect. Say: “choose a row, visit its columns, then choose the next row.”',
        editor: 'Find the same two loops without changing them. At tile 16, calculate 320 ÷ 16 = 20 columns and 240 ÷ 16 = 15 rows. Multiply to get 300 samples.'
      },
      {
        here: 'Change tile to 8, then 40. Compare the detail in the window and plant. Only one setting changes, so you can connect that setting with the result.',
        editor: 'Change only const tile = 16; to const tile = 8; and Run. Then try 40 and Run. Keep the two loop steps as y += tile and x += tile.'
      },
      {
        here: 'Restore tile 16. Select the rect line and read its explanation. x / picture.width gives a fraction of the source; multiplying by width finds the matching position on the canvas.',
        editor: 'Restore const tile = 16; and Run. Work out one example: source x 160 is halfway across 320, so its destination is halfway across 640, at x 320.'
      },
      {
        here: 'Choose a tested tile value and write what became easier or harder to recognize. Include the setting and a specific feature, such as the doorway or plant. This is evidence for a design decision.',
        editor: 'Run and Save your chosen version. Preserve its complete code before trying a different stage if you want to keep this iteration.'
      }
    ]
  },
  {
    title: 'Find a pixel’s four numbers',
    subtitle: 'A rectangular picture is stored as a long list.',
    outcome: 'Connect a source coordinate to the red, green, blue and alpha entries in its pixel buffer.',
    illustrationHint: 'The mosaic can look exactly like Stage 2. The change is how the program reads colors: this stage uses picture.pixels instead of get.',
    experiment: {
      instruction: 'At tile 16, inspect source sample (16, 16). Calculate 4 × (16 + 16 × 320) before reading the inspector’s answer.',
      expect: 'The red address is 20544; green, blue and alpha are at 20545, 20546 and 20547. Their stored values are separate numbers.'
    },
    checkpoint: 'I can calculate one pixel’s four addresses and distinguish an address from a color amount.',
    actions: [
      {
        here: 'Set tile 16 and press Restart p5. A mosaic matching Stage 2 is correct. Select picture.pixelDensity(1) and picture.loadPixels() to see how the source buffer is prepared.',
        editor: 'Choose Copy sketch.js, replace all editor sketch.js, then Run and Save. Check that picture.pixelDensity(1); and picture.loadPixels(); appear after loading.'
      },
      {
        here: 'Read the source coordinate beside the sample inspector. Begin with sample (0, 0); use Next sample to follow the row and return through the sequence if necessary. Its channel addresses are 0, 1, 2 and 3.',
        editor: 'Find const i = 4 * (x + y * picture.width);. Substitute x = 0 and y = 0 on paper. The first red address is zero, not one.',
        repair: 'Use the inspector’s coordinate label to distinguish sample (0, 0) from a later sample.'
      },
      {
        here: 'With tile 16, press the (16, 16) shortcut in Follow one pixel. Predict the red address before comparing it with the readout. The source width is 320 even though the canvas is 640 wide.',
        editor: 'Calculate: 16 complete rows × 320 pixels = 5120; add x = 16 to get 5136 pixels; multiply by 4 RGBA entries to get address 20544.',
        repair: 'Confirm tile 16 and coordinate (16, 16), then calculate using source width 320.'
      },
      {
        here: 'Read the selected sample’s RGBA values. Write one channel address and its stored value with separate labels: “where” and “how much.” A large address can hold an ordinary channel amount between 0 and 255.',
        editor: 'Find const g = picture.pixels[i + 1];. Say: “go to the green address and remember the amount found there.” The +1 changes the address; it does not increase the green amount.'
      },
      {
        here: 'Inspect alpha, the fourth channel. The supplied image is opaque, so its alpha is 255. Compare the explanations for picture.pixelDensity(1) and pixelDensity(1): they belong to different drawing objects.',
        editor: 'Keep both density lines. This starter reads source RGB and draws opaque tiles with fill(r, g, b). It does not copy arbitrary source transparency into the result.'
      },
      {
        here: 'Select fill(r, g, b). Compare a sampled source color with its mosaic block. The program reads the original buffer, then draws new rectangles; it leaves the source values available for later comparisons.',
        editor: 'Find the three channel-reading lines. There is no assignment back into picture.pixels and no picture.updatePixels() call. Reading a buffer does not require updating that buffer.'
      }
    ]
  },
  {
    title: 'Choose what keeps its color',
    subtitle: 'A condition decides where a color rule applies.',
    outcome: 'Keep a chosen left-hand region colored while changing the remaining samples toward gray.',
    illustrationHint: 'focus chooses where the boundary sits. strength chooses how far the selected colors move toward their targets. Change one at a time.',
    experiment: {
      instruction: 'First compare focus 40% and 70% at full strength. Restore 40%, then compare strength 50% and 100%.',
      expect: 'Changing focus moves the region boundary. Changing strength changes the color amount outside that boundary.'
    },
    checkpoint: 'I can explain the position test and blend amount, and describe one visual consequence I actually observed.',
    actions: [
      {
        here: 'Choose the focus color rule, tile 16, focus 40% and strength 100%. Press Restart p5. Samples in the left-hand region keep their color; the remaining samples become gray.',
        editor: 'Choose Copy sketch.js, replace all sketch.js, then Run and Save. Find const focus = 0.4; and const strength = 1; near the top.'
      },
      {
        here: 'Select if (x / picture.width >= focus). Read it as a sentence: “If this sample is at or beyond the boundary, use gray targets.” At focus 0.4, source x 128 is exactly on the boundary.',
        editor: 'Find the same condition. The >= symbol means “greater than or equal to,” so a sample exactly at the boundary is included in the transformed region.'
      },
      {
        here: 'Keep strength 100% and change focus from 40% to 70%. Inspect which parts of the source now retain color. Restore 40% before the next experiment.',
        editor: 'Change only const focus = 0.4; to const focus = 0.7; and Run. Compare, then restore 0.4 and Run again.'
      },
      {
        here: 'Keep focus 40% and lower strength to 50%. Look outside the retained region. Select the fill line containing lerp to connect the partial color change with the code.',
        editor: 'Change only const strength = 1; to const strength = 0.5; and Run. Find paintTiles(strength): the chosen amount is passed into the drawing rule.'
      },
      {
        here: 'Restore strength 100% and choose the invert rule. Read the regenerated targetR, targetG and targetB explanations. For any channel, the inverted target is 255 minus its original value.',
        editor: 'Choose Copy sketch.js again and replace the complete file, then Run. Changing a rule generates a complete matching program; do not combine the old focus branch with the new inversion branch.'
      },
      {
        here: 'Return to the focus rule, focus 40% and strength 100%. Write one actual comparison and what you noticed first. The rule tests horizontal position; it does not recognize objects automatically.',
        editor: 'Copy the restored complete code, replace sketch.js, Run and Save. Preserve a different tested version separately if you want to return to it.'
      }
    ]
  },
  {
    title: 'Shape one minute',
    subtitle: 'Use elapsed time to move gradually toward an ending.',
    outcome: 'Turn the static rule into a sixty-second transformation that holds its final state.',
    illustrationHint: 'Restart p5 begins the real timed preview. Teaching time lets you inspect a selected moment; it does not move your separate editor’s clock or change the exported 60000 milliseconds.',
    experiment: {
      instruction: 'Inspect teaching times 0, 30 and 60 seconds. Then restart the actual p5 sketch and watch a full minute with a separate timer.',
      expect: 'Progress is 0, 0.5 and 1 at those checkpoints. After a minute, constrain keeps progress at 1 and the ending holds.'
    },
    checkpoint: 'I can explain elapsed progress and final strength separately, and I watched a real full-minute run.',
    actions: [
      {
        here: 'Choose the focus rule, focus 40%, strength 100% and tile 16. Press Restart p5. Its real timed run starts near zero; the separate Teaching time control is for inspecting moments.',
        editor: 'Choose Copy sketch.js, replace every line of sketch.js and Run. Find let start; and function draw(). Keep a separate timer ready.',
        question: 'Does moving Teaching time here move the separate editor’s clock?',
        choices: ['No, they are independent', 'Yes, both clocks are connected'],
        correct: 0
      },
      {
        here: 'Select if (start === undefined), then start = millis(). Use Next line to reach the progress calculation. The start reading is assigned on the first draw frame and retained on later frames.',
        editor: 'Keep this first-frame condition inside draw. Moving the start assignment into every frame would keep resetting elapsed time; moving it into async setup can conflict with this p5 version’s startup clock reset.'
      },
      {
        here: 'Set Teaching time to 0, then 30, then 60 seconds. Compare the three states. Calculate t = elapsed milliseconds ÷ 60000 before checking the displayed fraction.',
        editor: 'Find constrain((millis() - start) / 60000, 0, 1). Leave the actual run and divisor unchanged while inspecting the teaching states.',
        repair: 'Choose one Teaching time value at a time and compare the displayed progress with seconds divided by 60.'
      },
      {
        here: 'Set Teaching time to 30 seconds. Lower strength from 100% to 50%, compare, then restore 100%. At t = 0.5 and strength = 0.5, the drawing amount is 0.25.',
        editor: 'For one experiment, change only const strength = 1; to 0.5 and Run. Read paintTiles(t * strength). Restore 1 before continuing. The divisor remains 60000.'
      },
      {
        here: 'Move Teaching time quickly from 0 to 60 to rehearse the sequence of states. This is a quick inspection, not a full-minute viewing. Read the generated progress line: its divisor remains 60000.',
        editor: 'Keep the divisor at 60000. If you manually tried a shorter duration such as 6000, restore 60000 before saving or presenting. Controls on this page do not edit your online sketch.',
        expect: 'You can inspect the ending quickly while the copied program still uses 60000 milliseconds.',
        question: 'Does quick inspection with Teaching time export a shorter sketch?',
        choices: ['No, the generated divisor stays 60000', 'Yes, inspection changes the exported duration'],
        correct: 0,
        explanation: 'Teaching inspection and the exported elapsed-time program serve different purposes.'
      },
      {
        here: 'Prepare notes for the beginning, middle and ending. A quiz answer or a scrubbed image does not count as watching the whole experience. Record what you actually see and when you see it.',
        editor: 'Press Run and start a separate timer as the image appears. Watch sixty seconds and a few seconds beyond. Confirm the ending holds, record actual timestamps and Save the working version.'
      }
    ]
  },
  {
    title: 'Replay and present',
    subtitle: 'Make the same journey work again at the viewing size.',
    outcome: 'Restart by clicking and check the composition in wide and narrow viewports.',
    illustrationHint: 'This stage uses the viewport dimensions. A click restarts its clock. The starter stretches to fit; wide and narrow previews help you notice that design choice.',
    experiment: {
      instruction: 'Compare the wide and narrow preview widths, then click inside the running p5 canvas after it has changed.',
      expect: 'The drawing follows the viewport and its proportions can change. Clicking returns the color journey to its beginning.'
    },
    checkpoint: 'I tested replay and resizing, then opened and watched my actual saved presentation link.',
    actions: [
      {
        here: 'Press Restart p5. Read the lines for createCanvas(windowWidth, windowHeight), mousePressed and windowResized. Keep the source and color settings fixed while testing presentation behavior.',
        editor: 'Choose Copy sketch.js, replace all sketch.js, then Run and Save. Confirm those three functions or calls appear in the new version.'
      },
      {
        here: 'Compare Teaching time 0, 30 and 60 without changing the source or rules. Repeat the same three values. Press Restart p5 when you want to begin a real timed preview again.',
        editor: 'Keep your project unchanged during this comparison. Note the same three moments you will look for during full runs.',
        expect: 'Matching teaching times show matching states; Restart p5 starts a new actual preview.',
        question: 'Does Restart p5 on this page also save your online editor project?',
        choices: ['No, editor saving is a separate action', 'Yes, restarting saves both workspaces'],
        correct: 0,
        explanation: 'The local preview and your saved editor project are separate.'
      },
      {
        here: 'Select the mousePressed explanation. Let the actual p5 preview change, then click inside its canvas. Watch the return to original colors before the journey develops again.',
        editor: 'Click your running sketch’s canvas after it has progressed. Restart your separate timer. Repeat once with the same source and rule, then compare matching moments.'
      },
      {
        here: 'Use the wide and narrow preview widths. Inspect the window, plant and edges. Select resizeCanvas(windowWidth, windowHeight), then the rect line. The source fractions adapt positions, but independent width and height can stretch shapes.',
        editor: 'Resize your browser or editor preview and inspect the actual sketch. Decide whether stretching suits your idea. Record any presentation size that makes important content hard to read.'
      },
      {
        here: 'Keep your notes ready for a link check. This local illustration demonstrates the mechanism; it cannot verify the asset paths or latest saved version of a separate online project.',
        editor: 'Save. Use File → Share to obtain the actual fullscreen link and open it in a new tab. Keep the sketch-code link separately. Verify that the intended image and behavior load.'
      },
      {
        here: 'Record two full presentation rehearsals and any resizing issue. The starter uses no randomness. The optional seeded extension remains available in the foundations if your own concept needs it.',
        editor: 'At the intended display size, watch two complete silent runs and restart deliberately. Save the tested version and preserve its full code. These checks do not replace the class’s required iterations and observations.'
      }
    ]
  },
  {
    title: 'Refine and document together',
    subtitle: 'Turn a working mechanism into an observed creative project.',
    outcome: 'Preserve real experiments, timed observations, collaboration and checked submission links.',
    illustrationHint: 'The starter code is the same as Stage 6. This stage adds your creative decisions, genuine iterations and documentation; a new visual effect is not required just to show progress.',
    experiment: {
      instruction: 'With your partner, preserve one version, change one rule, save the new version and watch a whole minute. Compare your independent notes before deciding what to revise.',
      expect: 'You have a specific changed rule and an actual observed result. Continue until the assignment’s full iteration, viewing and documentation requirements are satisfied.'
    },
    checkpoint: 'I checked the live assignment against actual work, tested every submitted link and named any remaining work honestly.',
    actions: [
      {
        here: 'Open the full workbook’s submission checklist and follow its Week 9 assignment link. With your partner, work through all linked Color Theory examples. Write two or three genuine observations you might explore.',
        editor: 'Keep your working sketch saved while examining examples in separate tabs. An answer on this learning card does not complete the example exploration.'
      },
      {
        here: 'Open Finish and expand Concept and partner. Together, name your source, intended alternative reality and first rule to test. Divide concrete independent work, then agree when to reunite and compare.',
        editor: 'Save a baseline version both partners can identify. Preserve each person’s actual tested variation or agreed contribution before discussing the results.'
      },
      {
        here: 'Open Finish and expand Iterations. For each version, record the rule changed, your prediction, what actually happened and the next decision. Keep the source and settings identifiable. Blank rows are not evidence of completed work.',
        editor: 'Develop, test and preserve at least three algorithm iterations. Save the complete code for each before replacing it. Copy sketch.js here supplies a starting program; your tested changes make the iterations.'
      },
      {
        here: 'Open Finish and expand Full-minute viewings. Prepare rows for viewing number, actual timestamp, what you noticed and your interpretation. Keep each partner’s initial attention notes separate before discussing them.',
        editor: 'Watch at least three complete runs with a separate timer. Restart deliberately, keep the project silent and record real moments. Inspecting a few slider states does not replace watching the entire minute.'
      },
      {
        here: 'Compile real iterations and observations in the class spreadsheet linked from the live assignment. Use the full workbook’s blog outline to organize collaboration, experiments, timed observations, credits and related projects.',
        editor: 'Choose the iteration you will post, Save it and verify its title and links. Preserve other versions so your blog can show meaningful differences.'
      },
      {
        here: 'Open Finish and use Links and the self-checklist to audit actual deliverables: blog, sketch-code link, fullscreen link, source and inspiration credits, collaboration record, iterations and timed observations.',
        editor: 'Open the exact saved code and fullscreen links. Check the intended image and behavior, then rehearse two silent runs at presentation size. Repair any failed link or unintended sound before submitting.'
      },
      {
        here: 'Return to the live assignment for separate sound preparation, its specified reading or exercises and the actual deadline. List completed evidence and remaining work. Mark a learning checkpoint only when you can support it with your own work.',
        editor: 'Keep this one-minute project silent. Save after tested changes and retain a backup of the exact code and image used by the submitted version.'
      }
    ]
  }
];

module.exports = lessons.map((lesson, stage) => ({
  ...lesson,
  vocabulary: guided[stage].vocabulary.map(({term, meaning}) => ({term, meaning})),
  actions: guided[stage].actions.map((action, position) => {
    const change = lesson.actions[position];
    if (!change) throw new Error('Missing clean lesson action: ' + stage + '/' + position);
    return {
      title: action.title,
      here: change.here,
      editor: change.editor,
      why: change.why || action.why,
      expect: change.expect || action.expect,
      question: change.question || action.question,
      choices: change.choices || [...action.choices],
      correct: change.correct === undefined ? action.correct : change.correct,
      explanation: change.explanation || action.explanation,
      repair: change.repair || action.repair
    };
  })
}));
