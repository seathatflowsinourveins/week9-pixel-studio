'use strict';

// Keep the original action order so saved studio.walkthrough positions still
// identify the same learning task. The clean view uses its own control labels.
const guided = require('./guided-walkthroughs.cjs');

const lessons = [
  {
    title: 'Show one image',
    subtitle: 'A file becomes a picture on your drawing surface.',
    outcome: 'Display sample.png, then explain why its source size and canvas size are different.',
    illustrationHint: 'The source picture is 320 × 240 pixels. The canvas can show the same picture at a different size.',
    experiment: {
      instruction: 'Choose Show at 320 × 240. Then choose Show at 640 × 480. Compare the window in each picture.',
      expect: 'The displayed picture becomes smaller. The original image file stays 320 × 240.'
    },
    checkpoint: 'I can load the image, save the sketch, and explain that loadImage loads while image draws.',
    actions: [
      {
        title: 'Find the window and plant',
        here: 'Look for the window and plant in Your sketch. Practice has already drawn the picture.',
        editor: 'When you want a shareable version, use Save in p5 to open your account sketch.',
        why: 'Recognizing the picture gives you a result to compare as you change the code.',
        expect: 'The window, sun and plant appear on the canvas.',
        question: 'What should you see at this point?',
        choices: ['A still picture with a window and plant', 'A new color on every frame'],
        correct: 0,
        explanation: 'This first sketch draws the image once.',
        repair: 'In Practice, choose Run and look at Your sketch.'
      },
      {
        title: 'Watch the picture stay still',
        here: 'Look at the sun for a moment. This sketch draws the image once, so the sun stays in place.',
        editor: 'Keep your saved sketch as it is. Compare its preview with this illustration. Stage 1 draws once; it does not yet animate.'
      },
      {
        title: 'Find the image file',
        here: 'Read the filename inside loadImage("sample.png"). That file holds the original 320 × 240 picture.',
        editor: 'If rebuilding an account sketch from scratch, download sample.png and upload that file to the sketch.',
        why: 'loadImage uses the filename to find the picture.',
        expect: 'The filename in the code matches the source image.',
        repair: 'Read the letters between the quote marks in loadImage.'
      },
      {
        title: 'Name the three files',
        here: 'Find sketch.js in the guide. It contains your drawing instructions. index.html loads p5, and sample.png supplies the picture.',
        editor: 'If you open a p5 account sketch, its file panel lists index.html, sketch.js and sample.png.',
        expect: 'You can name the page, drawing program and picture file.',
        repair: 'Read the file roles above, then find the program name ending in .js.'
      },
      {
        title: 'See how the page starts',
        here: 'Open “Explain the page setup / HTML.” Find where the page loads p5 before sketch.js.',
        editor: 'For a fresh account sketch, use Copy index.html to install the supplied page setup. Practice already has it.',
        expect: 'You can point to the script that loads p5.',
        question: 'Which file loads the p5 library for the page?',
        choices: ['index.html', 'sample.png'],
        correct: 0,
        explanation: 'The script tags in index.html load p5 and sketch.js.',
        repair: 'Open “Explain the page setup / HTML” and look for the script tags.'
      },
      {
        title: 'Match the filename',
        here: 'Read the quoted text "sample.png" in the loading line. Its spelling tells p5 which image file to open.',
        editor: 'For a fresh account sketch, place sample.png beside sketch.js in the file panel.',
        expect: 'The program asks p5 to open the supplied picture.',
        repair: 'Check that the quoted name includes the .png ending.'
      },
      {
        title: 'Read the loading line',
        here: 'Select the line containing await loadImage. Read its meaning. The picture must finish loading before p5 can draw it.',
        editor: 'Practice has the complete eight-line sketch. To keep your edited version in an account, copy your code and paste it into a duplicate.',
        expect: 'The name picture holds the loaded image.',
        why: 'Loading the file makes the image available to the drawing code.',
        question: 'What does picture hold after await loadImage finishes?',
        choices: ['The loaded image', 'The canvas width'],
        correct: 0,
        explanation: 'await lets the image finish loading before setup continues.',
        repair: 'Read the name on the left of the equals sign, then the call on the right.'
      },
      {
        title: 'Compare picture and canvas',
        here: 'Choose Show at 640 × 480. The source is still 320 × 240. Compare the drawing size with the file size.',
        editor: 'To check your shareable account version, save it in p5 and reopen its saved address.',
        why: 'The canvas can display the same source at a different size.',
        expect: 'The canvas is 640 × 480 and the image file is still 320 × 240.'
      },
      {
        here: 'Select createCanvas. Choose Show at 320 × 240, then return to 640 × 480. Watch the canvas change size.',
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
      instruction: 'Set Sampling step to 16, then 8. Compare the same edge of the window.',
      expect: 'At 8, smaller blocks follow the edge more closely. The number of samples rises from 300 to 1,200.'
    },
    checkpoint: 'I can explain why increasing tile makes the mosaic coarser, and I saved one tested version.',
    actions: [
      {
        title: 'Find one block',
        here: 'Look at the edge of the window in Your sketch. Each square takes its color from one place in the source picture.',
        editor: 'In Practice, select const tile. It sets the distance between samples.',
        repair: 'Look for a straight edge of the window where neighboring blocks meet.'
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
        here: 'Set Sampling step to 16, then 8. Look at the same window edge after each change.',
        editor: 'Find const tile in Practice. At 8, each loop moves eight source pixels between samples.',
        expect: 'Smaller blocks trace the same edge with more detail.',
        question: 'Which setting draws fewer blocks?',
        choices: ['Step 16', 'Step 8'],
        correct: 0,
        explanation: 'At 16, the loop visits fewer places in the same picture.',
        repair: 'Look at the same edge at 16 and 8.'
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
    outcome: 'Choose one point in the source picture and read its red, green, blue and alpha values.',
    illustrationHint: 'The mosaic can look exactly like Stage 2. The change is how the program reads colors: this stage uses picture.pixels instead of get.',
    experiment: {
      instruction: 'Set Sampling step to 16. Choose (16, 16). Follow this point from its four values to its block.',
      expect: 'At (16, 16), RGBA is [148, 201, 207, 255]. Green is stored at address 20545 and its value is 201.'
    },
    checkpoint: 'I can calculate one pixel’s four addresses and distinguish an address from a color amount.',
    actions: [
      {
        title: 'Choose one pixel',
        here: 'With Sampling step at 16, choose (16, 16). Find the outlined point on the source picture and its block in Teaching preview.',
        editor: 'Read the selected guide line in Practice. picture.loadPixels() makes the image’s color values available to the sketch.',
        why: 'Following one point connects the color numbers to a block you can see.',
        expect: 'The outline marks the same sample in both pictures.',
        repair: 'Set Sampling step to 16 so the (16, 16) shortcut is available.'
      },
      {
        here: 'Look at the top-left sample (0, 0). Its four color values start at addresses 0, 1, 2 and 3.',
        editor: 'Find const i = 4 * (x + y * picture.width);. Substitute x = 0 and y = 0 on paper. The first red address is zero, not one.',
        repair: 'Use the inspector’s coordinate label to distinguish sample (0, 0) from a later sample.'
      },
      {
        here: 'Choose (16, 16) again. Read the address line. It uses the source width of 320 and finds the red address 20544.',
        editor: 'Calculate: 16 complete rows × 320 pixels = 5120; add x = 16 to get 5136 pixels; multiply by 4 RGBA entries to get address 20544.',
        repair: 'Confirm tile 16 and coordinate (16, 16), then calculate using source width 320.'
      },
      {
        here: 'Read green for (16, 16). Address 20545 holds the value 201. The address tells you where to look. The value tells you how much green.',
        editor: 'Find const g = picture.pixels[i + 1];. Say: “go to the green address and remember the amount found there.” The +1 changes the address; it does not increase the green amount.'
      },
      {
        here: 'Read the fourth value for (16, 16). Alpha 255 means fully opaque. This sketch uses one physical pixel per source position.',
        editor: 'Keep both density lines. This starter reads source RGB and draws opaque tiles with fill(r, g, b). It does not copy arbitrary source transparency into the result.'
      },
      {
        here: 'Select fill(r, g, b). For (16, 16), fill(148, 201, 207) sets the color for the block drawn by rect.',
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
      instruction: 'Choose “Keep a region colored.” Set strength to 100%. Move the width from 40% to 70%.',
      expect: 'The color boundary moves right. More of the window keeps its original color.'
    },
    checkpoint: 'I can explain the position test and blend amount, and describe one visual consequence I actually observed.',
    actions: [
      {
        title: 'Find the color boundary',
        here: 'Choose “Keep a region colored.” Set strength to 100% and width to 40%. Find the edge between color and gray.',
        editor: 'In Practice, find const focus = 0.4 and const strength = 1. They match the two settings.',
        why: 'A position test decides which blocks keep their original colors.'
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
        editor: 'Look at targetR in the guide code. The invert rule now uses 255 - r. If Practice has your own edits, Use lesson code loads the example there.'
      },
      {
        here: 'Return to the focus rule, focus 40% and strength 100%. Write one actual comparison and what you noticed first. The rule tests horizontal position; it does not recognize objects automatically.',
        editor: 'To save this version in your p5 account, choose Copy my code in Practice. Use Save in p5, duplicate your sketch, paste the code, Run and Save.'
      }
    ]
  },
  {
    title: 'Shape one minute',
    subtitle: 'Use elapsed time to move gradually toward an ending.',
    outcome: 'Turn the static rule into a sixty-second transformation that holds its final state.',
    illustrationHint: 'Teaching time pauses Teaching preview at a chosen moment. Your sketch follows its own clock.',
    experiment: {
      instruction: 'Inspect 0, 30 and 60 seconds in Teaching preview. Then choose Play actual 60 seconds and watch the full minute.',
      expect: 'Progress is 0, 0.5 and 1 at those checkpoints. After a minute, constrain keeps progress at 1 and the ending holds.'
    },
    checkpoint: 'I can explain elapsed progress and final strength separately, and I watched a real full-minute run.',
    actions: [
      {
        title: 'Pause at 30 seconds',
        here: 'Move Teaching time to 30 seconds. Teaching preview holds that moment. Your sketch follows its own clock.',
        editor: 'In Practice, find let start and draw(). They let Your sketch keep time as it draws.',
        expect: 'Teaching preview shows the halfway point. Your sketch keeps its own time.',
        question: 'Does moving Teaching time change the clock in Your sketch?',
        choices: ['No, they are independent', 'Yes, both clocks are connected'],
        correct: 0,
        why: 'The slider lets you inspect the middle of the minute.',
        explanation: 'Teaching preview and Your sketch have separate clocks.',
        repair: 'Look for the paused label on Teaching preview.'
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
        title: 'Change the viewing shape',
        here: 'Choose Wide preview, then Narrow preview. Watch the picture fit the new space in Teaching preview.',
        editor: 'In Practice, find createCanvas(windowWidth, windowHeight). It uses the width and height of its own window.',
        why: 'The same sketch can be shown in windows with different shapes.',
        expect: 'The canvas changes shape with the preview.',
        question: 'What changes when you choose Narrow preview?',
        choices: ['The shape of the teaching canvas', 'The original image file'],
        correct: 0,
        explanation: 'The program fits its canvas to the available window.',
        repair: 'Choose Wide preview again to compare the two shapes.'
      },
      {
        title: 'Compare three moments',
        here: 'Inspect 0, 30 and 60 seconds in Teaching preview. Repeat the three times and look at the same detail.',
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
        title: 'Compare two versions',
        here: 'Choose A, then B. Look at the same window edge in Teaching preview. Both versions show 30 seconds.',
        editor: 'With your partner, follow the Week 9 brief to explore all linked Color Theory examples. Record two or three observations from what you see.',
        why: 'Comparing the same moment makes a change in block size easier to see.',
        expect: 'B shows smaller blocks than A. Keep your own observations for the class record.'
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
      title: change.title || action.title,
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
