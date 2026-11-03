'use strict';

// Understanding checks never certify completion of class activities.
module.exports = [
  {
    "stage": "studio-0",
    "welcome": "Keep this workbook and the p5 Web Editor visible beside each other. The workbook is your instruction sheet and small experiment space. The editor holds the separate project you will save and share. Start with the supplied image so you can recognize a successful result before choosing personal material. You do not need to type a whole program from memory.",
    "vocabulary": [
      {
        "term": "Sketch",
        "meaning": "A small p5 program. Your editor project contains the program and its supporting files."
      },
      {
        "term": "Source and canvas",
        "meaning": "The source is the stored picture, 320 × 240 pixels here. The canvas is the drawing surface, initially 640 × 480."
      },
      {
        "term": "File and path",
        "meaning": "A file has a name such as sample.png. A path tells the program where that file sits inside its project."
      },
      {
        "term": "setup",
        "meaning": "Instructions p5 performs once when this sketch starts. Await waits for the picture to finish loading."
      }
    ],
    "actions": [
      {
        "title": "Put the two workspaces beside each other",
        "workbook": "Keep this page open. Open a second browser window for https://editor.p5js.org/ and place the workbook on the left half of your screen. On Windows, drag its window to the left edge or press Windows+Left.",
        "editor": "Place the editor window on the right half using Windows+Right. Keep both windows visible. Click inside each once to learn which window receives your typing.",
        "why": "Separate pages hold separate code.",
        "expect": "Both windows remain readable.",
        "target": "",
        "question": "Where will your saved, shareable sketch live?",
        "choices": [
          "In the p5 Web Editor project",
          "Only in this instruction page"
        ],
        "correct": 0,
        "explanation": "Save and share through the editor.",
        "repair": "Narrow each window by dragging its edge."
      },
      {
        "title": "Run the untouched workbook example",
        "workbook": "Find “Run this stage in p5” below the code explanation and click it once. Wait for the actual p5 preview to appear. Compare its picture with “Original source · unchanged” above.",
        "editor": "Leave the editor unchanged for this step. Do not paste anything yet; first establish what a working example looks like.",
        "why": "Recognize a working baseline first.",
        "expect": "A still enlarged source appears.",
        "target": "run",
        "question": "Should this first stage already animate for a minute?",
        "choices": [
          "Yes, every stage animates",
          "No, this stage displays the original"
        ],
        "correct": 1,
        "explanation": "Animation arrives in a later stage.",
        "repair": "Read the Run status and first error."
      },
      {
        "title": "Download the actual image file",
        "workbook": "Click “Download sample.png” in the image area. Locate sample.png in your browser downloads. Keep this filename; changing an extension does not convert an image.",
        "editor": "Keep the editor open. Do not paste the downloaded file path into code. You will upload the image itself in a later step.",
        "why": "The editor needs its own asset.",
        "expect": "Downloads contains a 320 × 240 source.",
        "target": "saveimage",
        "question": "Does a 640 × 480 display make the source file 640 × 480?",
        "choices": [
          "No, display size and stored size differ",
          "Yes, displaying it doubles the stored pixels"
        ],
        "correct": 0,
        "explanation": "Display enlargement leaves the source unchanged.",
        "repair": "Check downloads, allow downloading, then retry."
      },
      {
        "title": "Create a project and find its files",
        "workbook": "Leave the example and downloaded sample.png available. Read the next instruction before switching attention to the right window.",
        "editor": "Log in to the Web Editor so uploading and saving are available. Create a new sketch. Open the file panel using “Open Sketch files navigation”. Find sketch.js and index.html in the file list.",
        "why": "Each file has a different purpose.",
        "expect": "Both named project files are visible.",
        "target": "",
        "question": "Which file will hold the drawing instructions?",
        "choices": [
          "sample.png",
          "sketch.js"
        ],
        "correct": 1,
        "explanation": "sketch.js contains the drawing program.",
        "repair": "Log in, then reopen the file panel."
      },
      {
        "title": "Copy the complete pinned editor page",
        "workbook": "Click “Copy editor page HTML”. If clipboard access fails, click inside the supplied read-only HTML, press Ctrl+A, then Ctrl+C. This complete template loads p5 2.3.4 before sketch.js and keeps this project silent.",
        "editor": "Select index.html in the file panel. Click inside its text, press Ctrl+A, then Ctrl+V to replace ALL of that file with the copied HTML. Leave the separate sketch.js file in place; you will replace its code in a later step.",
        "why": "index.html loads the library and sketch.",
        "expect": "The complete page pins p5 2.3.4.",
        "target": "setup",
        "question": "Where should the complete copied HTML go?",
        "choices": [
          "Over all text in index.html",
          "Below the JavaScript in sketch.js"
        ],
        "correct": 0,
        "explanation": "The HTML template belongs in index.html.",
        "repair": "If pasted into the wrong file, select index.html and replace its whole text correctly. Restore sketch.js with the complete stage code at the later copy step."
      },
      {
        "title": "Upload the real sample.png file",
        "workbook": "Locate the sample.png you downloaded earlier. Keep the file itself ready; copying its filename or your computer’s Downloads path does not upload the image.",
        "editor": "In Sketch Files, open “Toggle open/close sketch file options” and choose “Upload file”. In “Drop files here or click to use the file browser”, select sample.png and wait. Confirm it appears beside sketch.js, at the project root.",
        "why": "The saved project needs its own image.",
        "expect": "sample.png appears in the project file list.",
        "target": "",
        "question": "For sample.png beside sketch.js, which quoted path matches?",
        "choices": [
          "\"sample.png\"",
          "Your computer’s Downloads folder path"
        ],
        "correct": 0,
        "explanation": "Use the project-relative filename in loadImage.",
        "repair": "If upload says “Log in to upload files”, log in first. Check the actual folder: an image under assets needs \"assets/sample.png\" instead."
      },
      {
        "title": "Replace every line of sketch.js",
        "workbook": "Click “Copy complete code” under this stage’s code. If clipboard access fails, open “Edit the complete sketch yourself”, click its text, press Ctrl+A, then Ctrl+C.",
        "editor": "Select sketch.js. Click inside its code area, press Ctrl+A, then Ctrl+V. The old starter must disappear. Check that the first line is let picture; and that there is only one async function setup().",
        "why": "Avoid duplicate programs and declarations.",
        "expect": "Only this complete stage remains.",
        "target": "code",
        "question": "How should you paste a complete stage?",
        "choices": [
          "Below the existing program",
          "Over all of the existing sketch.js text"
        ],
        "correct": 1,
        "explanation": "Complete stages replace the whole file.",
        "repair": "Select all and paste the complete stage again."
      },
      {
        "title": "Run, compare and save your first version",
        "workbook": "Compare the workbook’s supplied image with the editor result. In your stage observation, write one sentence naming the source size and one naming the canvas size.",
        "editor": "Press the Run triangle. Wait for the picture. Give the sketch a recognizable title and use File → Save. In the browser developer console, p5.VERSION can confirm \"2.3.4\"; it is a property, without parentheses.",
        "why": "Running and saving are separate checks.",
        "expect": "The editor picture matches and is saved.",
        "target": "notes",
        "question": "If loading fails, what should you inspect first?",
        "choices": [
          "The uploaded filename and quoted path",
          "The color mathematics from a later stage"
        ],
        "correct": 0,
        "explanation": "Fix missing assets before pixel mathematics.",
        "repair": "Compare the first error with the filename."
      },
      {
        "title": "Try one reversible size change",
        "workbook": "Read the explanation for createCanvas(640, 480). Predict what a smaller drawing surface would do before touching code. Keep the original example available as your rollback.",
        "editor": "Optionally change only createCanvas(640, 480) to createCanvas(320, 240), then Run. Compare the display. Restore createCanvas(640, 480), Run again, and Save the restored working version.",
        "why": "One change isolates display size.",
        "expect": "Smaller canvas; unchanged source file.",
        "target": "code",
        "question": "What did changing createCanvas change?",
        "choices": [
          "The original image’s stored dimensions",
          "The destination drawing surface"
        ],
        "correct": 1,
        "explanation": "createCanvas changes the destination surface.",
        "repair": "Restore this complete stage if syntax breaks."
      }
    ]
  },
  {
    "stage": "studio-1",
    "welcome": "Now replace the smooth display with a mosaic. A mosaic uses one sampled color to fill each larger rectangle. Keep the same image while learning this rule; changing both the source and the sampling step would make the comparison harder to explain. Your acceptance check is a working editor mosaic and an explanation of why larger sampling steps produce fewer blocks.",
    "vocabulary": [
      {
        "term": "Sample",
        "meaning": "Read a color at one chosen source location rather than drawing every original pixel."
      },
      {
        "term": "tile",
        "meaning": "The named source-pixel step between samples. It also determines each displayed block’s size."
      },
      {
        "term": "Loop",
        "meaning": "An instruction that repeats while its condition stays true. The row loop contains a column loop."
      },
      {
        "term": "Coordinate",
        "meaning": "A location written as x and y: x increases rightward, y increases downward, starting at the top left."
      }
    ],
    "actions": [
      {
        "title": "Establish the stage’s baseline",
        "workbook": "Set “Sampling step” to 16. Click “Run this stage in p5”. Compare the original with the mosaic before changing any other value.",
        "editor": "Copy this stage’s complete code. Select sketch.js, click its code area, press Ctrl+A, then paste. Press Run. Keep the same sample.png and index.html; Save this new stage version.",
        "why": "Keep the sampling comparison controlled.",
        "expect": "Rectangular blocks replace the smooth display.",
        "target": "tile",
        "question": "What does tile = 16 measure here?",
        "choices": [
          "Sixteen source pixels between samples",
          "Sixteen seconds of animation"
        ],
        "correct": 0,
        "explanation": "tile measures source-pixel sampling distance.",
        "repair": "Confirm this stage replaced all sketch.js text."
      },
      {
        "title": "Make the invisible sampling grid visible",
        "workbook": "Click “Show sampling grid”. Look across one row, then down to the next. Click the top-left part of the original image and look for the white sample marker.",
        "editor": "Leave the code unchanged. Compare the block boundaries in your editor with the grid in the workbook; the helper grid itself is not part of your exported sketch.",
        "why": "Reveal where samples originate.",
        "expect": "Outlined cells correspond to mosaic blocks.",
        "target": "grid",
        "question": "Does the helper grid have to appear in the saved sketch?",
        "choices": [
          "Yes, otherwise the mosaic is broken",
          "No, it helps explain the sampling"
        ],
        "correct": 1,
        "explanation": "The grid is a teaching overlay.",
        "repair": "Toggle the grid and compare both states."
      },
      {
        "title": "Read one color and move to its neighbor",
        "workbook": "Click “Next sampled pixel →” once. Read the source coordinate and the source RGBA values below the images. Move once more and notice which coordinate changes.",
        "editor": "Find const shade = picture.get(x, y); in sketch.js. Read it as “remember the color at the current source location”. Read fill(shade[0], shade[1], shade[2], shade[3]) as choosing that color for the next rectangle.",
        "why": "Read color before drawing its block.",
        "expect": "The marker advances along a row.",
        "target": "pixel",
        "question": "What does picture.get(x, y) supply?",
        "choices": [
          "A source color at that location",
          "A new canvas size"
        ],
        "correct": 0,
        "explanation": "get supplies the sampled source color.",
        "repair": "Click near the original’s top-left corner."
      },
      {
        "title": "Follow the two loops without editing them",
        "workbook": "In the code reader, select the line beginning for (let y. Then select the following for (let x line. Read each explanation before moving on to rect.",
        "editor": "Find those same two lines. Do not change their punctuation or steps. Say aloud: “choose one row; visit its columns; then choose the next row.”",
        "why": "Columns finish before rows advance.",
        "expect": "Twenty columns × fifteen rows = 300 samples.",
        "target": "code",
        "question": "How many samples does this baseline make?",
        "choices": [
          "35",
          "300"
        ],
        "correct": 1,
        "explanation": "Multiply rows by columns: 300.",
        "repair": "Calculate both divisions; never set tile zero."
      },
      {
        "title": "Change only the sampling step",
        "workbook": "Move “Sampling step” to 8. Compare detail with 16, then try 40. Keep the image unchanged. Read the sample count after each change.",
        "editor": "Change only const tile = 16; to const tile = 8; and Run. Then change only that number to 40 and Run. Do not alter the loop steps themselves.",
        "why": "Change one spatial rule.",
        "expect": "Step 8: 1200 samples; step 40: 48.",
        "target": "tile",
        "question": "Which has fewer sampled blocks?",
        "choices": [
          "Step 40",
          "Step 8"
        ],
        "correct": 0,
        "explanation": "Larger sampling steps visit fewer locations.",
        "repair": "Check tile in both separate windows."
      },
      {
        "title": "Explain how a source position reaches the canvas",
        "workbook": "Restore sampling step 16. Select the rect line in the code reader. Locate x / picture.width * width and read its explanation slowly.",
        "editor": "Restore const tile = 16; and Run. Find the same rect line without editing it. Picture a source location halfway across: its x fraction is 0.5, so its destination is halfway across the canvas.",
        "why": "Fractions connect differently sized rectangles.",
        "expect": "Source x 160 maps to canvas x 320.",
        "target": "code",
        "question": "Where does source x = 160 map on a 640-wide display?",
        "choices": [
          "x = 160",
          "x = 320"
        ],
        "correct": 1,
        "explanation": "Half of 640 is 320.",
        "repair": "Divide first; label source and canvas widths."
      },
      {
        "title": "Keep one observed result",
        "workbook": "In “Your observation”, write which step you preferred, what became recognizable or hidden, and the actual sample count. Turn off the grid if it distracts from comparing the images.",
        "editor": "Choose one tested tile value, Run, and Save. Copy or download the complete working sketch before moving on if you want to preserve this iteration.",
        "why": "Connect a decision to visible evidence.",
        "expect": "A saved mosaic and actual observation remain.",
        "target": "notes",
        "question": "Which note can guide your next decision?",
        "choices": [
          "“At step 40 the doorway disappeared”",
          "“I probably did the mosaic”"
        ],
        "correct": 0,
        "explanation": "Concrete observations guide further decisions.",
        "repair": "Compare 8 and 40 again before writing."
      }
    ]
  },
  {
    "stage": "studio-2",
    "welcome": "The mosaic will look much like the last stage. What changes is how the program finds each color: it reads a long list of channel numbers directly. Take this slowly. The goal is to distinguish a location in that list from the color amount stored there, then trace one pixel by hand.",
    "vocabulary": [
      {
        "term": "Buffer or array",
        "meaning": "An ordered list of numbers. Its first position is numbered zero."
      },
      {
        "term": "RGBA",
        "meaning": "Four consecutive channel amounts: red, green, blue and alpha. Alpha describes opacity."
      },
      {
        "term": "Address or index",
        "meaning": "The numbered position in the list, rather than the channel amount stored at that position."
      },
      {
        "term": "Density one",
        "meaning": "One stored pixel per image coordinate here. This stage’s simple address formula depends on that assumption."
      }
    ],
    "actions": [
      {
        "title": "Install the buffer-reading stage",
        "workbook": "Set sampling step 16 and Run this stage. Compare its mosaic with your previous saved version; a similar appearance is expected.",
        "editor": "Copy this stage’s complete code, select all sketch.js text and replace it. Run and Save. Check that picture.pixelDensity(1); and picture.loadPixels(); now appear after loading.",
        "why": "Prepare the buffer before reading it.",
        "expect": "Same mosaic, now read from picture.pixels.",
        "target": "run",
        "question": "Must a new reading method make a new visible effect?",
        "choices": [
          "No, it can read the same colors",
          "Yes, the picture must look different"
        ],
        "correct": 0,
        "explanation": "Different methods can produce matching colors.",
        "repair": "Check loadPixels and the uploaded image path."
      },
      {
        "title": "Start with pixel zero",
        "workbook": "Click the very top-left area of the original. Read the coordinate and address display; aim for sample (0, 0). Read the four channel addresses beneath the color values.",
        "editor": "Find const i = 4 * (x + y * picture.width);. Do not edit it. Substitute x = 0 and y = 0 on paper.",
        "why": "Array counting begins at zero.",
        "expect": "First pixel addresses: 0, 1, 2, 3.",
        "target": "address",
        "question": "What is the first pixel’s red address?",
        "choices": [
          "1",
          "0"
        ],
        "correct": 1,
        "explanation": "The first array address is zero.",
        "repair": "Click nearer the original’s upper-left corner."
      },
      {
        "title": "Calculate one later address by hand",
        "workbook": "At step 16, click inside the second tile of the second row in the original. Use the readout to confirm sample (16, 16). Calculate its address before comparing.",
        "editor": "Use the source width 320 in the formula: 16 rows × 320 pixels = 5120; add x = 16 to get 5136 pixels; multiply by 4 to get 20544 entries.",
        "why": "Convert pixels into channel entries.",
        "expect": "Selected pixel starts at address 20544.",
        "target": "address",
        "question": "Which width belongs in this source-buffer calculation?",
        "choices": [
          "Source width 320",
          "Canvas width 640"
        ],
        "correct": 0,
        "explanation": "Source-buffer calculations use source width.",
        "repair": "Recalculate with 320; confirm sample (16,16)."
      },
      {
        "title": "Separate the address from the amount",
        "workbook": "Read “Source channels → displayed channels” for the selected sample. Write one address and the value stored there as two separately labeled numbers.",
        "editor": "Find const g = picture.pixels[i + 1];. Read it as “go to the green address, then remember the amount found there”. Do not add one to the green amount.",
        "why": "Distinguish location from stored amount.",
        "expect": "Large addresses hold values within 0–255.",
        "target": "channels",
        "question": "Does an address of 20545 mean a green amount of 20545?",
        "choices": [
          "Yes, they are the same number",
          "No, an address points to a stored amount"
        ],
        "correct": 1,
        "explanation": "Addresses locate values; they are not amounts.",
        "repair": "Label each number “where” or “how much”."
      },
      {
        "title": "Read alpha and the density assumption",
        "workbook": "Look at the fourth source channel. For an opaque sample it is 255. Read the explanation for picture.pixelDensity(1), then the one for pixelDensity(1).",
        "editor": "Keep both density lines. Notice that one applies to picture and the other to the canvas. This starter reads RGB and draws opaque tiles; it does not copy source alpha into fill.",
        "why": "Image density differs from canvas density.",
        "expect": "This opaque starter draws alpha 255.",
        "target": "channels",
        "question": "Are transparent pixels and opaque black equivalent?",
        "choices": [
          "No, their opacity differs",
          "Yes, both are simply black"
        ],
        "correct": 0,
        "explanation": "Transparent pixels differ from opaque black.",
        "repair": "Use the supplied source for this exercise."
      },
      {
        "title": "Keep the original buffer unchanged",
        "workbook": "Select the fill(r, g, b) explanation. Compare source and displayed channels for one sample; they should match at this stage.",
        "editor": "Find the three channel-reading lines and fill(r, g, b). Leave picture.pixels unchanged. Notice that there is no assignment back into picture.pixels and no picture.updatePixels call.",
        "why": "Preserve a reliable original source.",
        "expect": "Source and displayed RGB match.",
        "target": "code",
        "question": "Do these reads need updatePixels to become visible?",
        "choices": [
          "Yes, every read needs it",
          "No, fill and rect draw the result"
        ],
        "correct": 1,
        "explanation": "Reading needs no updatePixels; drawing uses rect.",
        "repair": "Restore the complete stage after accidental assignments."
      }
    ]
  },
  {
    "stage": "studio-3",
    "welcome": "You can now choose which part of the mosaic keeps its color. Begin with a simple left-hand region. The rule selects samples by their horizontal position; it does not recognize a person or object. First move the boundary, then change the amount of color loss. Keeping those experiments separate makes their effects understandable.",
    "vocabulary": [
      {
        "term": "Condition",
        "meaning": "A question in code with a true or false answer. Here it asks whether a sample lies beyond the boundary."
      },
      {
        "term": "focus",
        "meaning": "The source-width fraction that keeps its color, initially 0.4: the left forty percent."
      },
      {
        "term": "strength",
        "meaning": "How far the displayed color moves toward the target: zero keeps the original; one reaches the target."
      },
      {
        "term": "lerp",
        "meaning": "A blend between a starting number and a target number, controlled by an amount from zero to one."
      }
    ],
    "actions": [
      {
        "title": "Set a known color-rule baseline",
        "workbook": "Choose “Keep color in a region”. Set sampling step 16, region 40%, and transformation strength 100%. Run this stage and compare the two images.",
        "editor": "Copy this stage’s complete code and replace all of sketch.js. Run and Save. Find const focus = 0.4; and const strength = 1; near the top.",
        "why": "Set a reproducible color-rule baseline.",
        "expect": "Left forty percent colored; outside gray.",
        "target": "mode",
        "question": "Does this rule recognize the main subject automatically?",
        "choices": [
          "No, it tests source position",
          "Yes, focus detects the subject"
        ],
        "correct": 0,
        "explanation": "focus tests position, not object identity.",
        "repair": "Confirm focus mode and strength 100%."
      },
      {
        "title": "Read the condition as a sentence",
        "workbook": "Select if (x / picture.width >= focus) in the code reader. Read the explanation, then inspect samples on opposite sides of the division.",
        "editor": "Find the same line without changing it. Say: “if the sample’s horizontal fraction is at or beyond focus, use gray targets”. At focus 0.4, source x = 128 is exactly at the boundary.",
        "why": "Convert position to a fraction.",
        "expect": "Boundary samples join the transformed region.",
        "target": "focus",
        "question": "At the boundary itself, does this condition select gray?",
        "choices": [
          "No, only samples strictly beyond it",
          "Yes, >= includes equality"
        ],
        "correct": 1,
        "explanation": "The >= comparison includes equality.",
        "repair": "Compare one sample’s fraction with 0.4."
      },
      {
        "title": "Move only the region boundary",
        "workbook": "Keep strength 100%. Move “Region that keeps color” from 40% to 70%. Compare which recognizable features now remain colored. Restore 40% after observing.",
        "editor": "Change only const focus = 0.4; to const focus = 0.7; and Run. Compare. Restore 0.4 and Run again before the next experiment.",
        "why": "Change where, not how much.",
        "expect": "At 70%, more left-side samples retain color.",
        "target": "focus",
        "question": "What did this experiment change?",
        "choices": [
          "Where color is retained",
          "How long the sketch runs"
        ],
        "correct": 0,
        "explanation": "focus changes a spatial boundary.",
        "repair": "Check focus, then Run the edited sketch."
      },
      {
        "title": "Blend toward gray at half strength",
        "workbook": "Keep region 40% and lower strength to 50%. Compare this with 100%, looking especially outside the retained region. Leave 50% visible while reading the blend explanation.",
        "editor": "Change only const strength = 1; to const strength = 0.5; and Run. Find paintTiles(strength) and the fill line containing lerp.",
        "why": "Separate region selection from blending.",
        "expect": "Half strength retains some outside color.",
        "target": "strength",
        "question": "What does strength zero display?",
        "choices": [
          "Fully transformed target colors",
          "Original source colors"
        ],
        "correct": 1,
        "explanation": "Amount zero returns original channel values.",
        "repair": "Inspect a colorful sample outside the region."
      },
      {
        "title": "Compare one different target rule",
        "workbook": "Restore strength 100%. Choose “Invert every channel” and inspect the channel readout for one sample. Compare it with the original before trying another rule.",
        "editor": "Copy the newly generated complete stage code and replace sketch.js; Run. Find targetR = 255 - r and the corresponding green and blue lines. Do not try to keep an old focus branch alongside them.",
        "why": "Inversion chooses different channel targets.",
        "expect": "Each channel targets 255 minus its source.",
        "target": "mode",
        "question": "What is the inverted target for a channel amount of 40?",
        "choices": [
          "215",
          "40"
        ],
        "correct": 0,
        "explanation": "255 minus 40 equals 215.",
        "repair": "Return to focus mode for boundary control."
      },
      {
        "title": "Choose and record a deliberate rule",
        "workbook": "Return to “Keep color in a region”, region 40%, strength 100% for the next stage. In the observation field, describe one actual comparison and what it made you notice first.",
        "editor": "Copy this restored complete stage, replace sketch.js, Run and Save. Keep an earlier tested variation separately if it supports your concept.",
        "why": "Meaning needs an observed consequence.",
        "expect": "A saved rule and specific comparison remain.",
        "target": "notes",
        "question": "Which statement is supported by your single viewing?",
        "choices": [
          "Every viewer must look at the same feature",
          "I noticed a particular feature first"
        ],
        "correct": 1,
        "explanation": "Your viewing supports your own observation.",
        "repair": "Compare two boundaries with everything else fixed."
      }
    ]
  },
  {
    "stage": "studio-4",
    "welcome": "Turn the static color rule into a visible journey lasting one minute. The workbook’s time slider is an inspection tool; the actual p5 sketch has its own clock. Use the slider to understand states, then watch the editor run in real time. The acceptance check is a beginning, midpoint and held ending produced over sixty elapsed seconds.",
    "vocabulary": [
      {
        "term": "draw",
        "meaning": "The function p5 calls repeatedly to make visible frames."
      },
      {
        "term": "millisecond",
        "meaning": "One thousandth of a second: 60000 milliseconds is sixty seconds."
      },
      {
        "term": "Elapsed time",
        "meaning": "The current clock reading minus a remembered starting reading."
      },
      {
        "term": "Progress t",
        "meaning": "The fraction of the minute completed, constrained between zero and one. It is multiplied by strength."
      }
    ],
    "actions": [
      {
        "title": "Install the timed version",
        "workbook": "Choose the focus rule, region 40%, strength 100%, and tile 16. Run this stage in p5. The actual preview begins from its own zero even if the teaching slider shows 30 seconds.",
        "editor": "Copy the complete new stage, replace every line of sketch.js, and Run. Find let start; and function draw(). Keep a separate timer ready.",
        "why": "Start timing at the first draw.",
        "expect": "The actual p5 run begins near zero.",
        "target": "run",
        "question": "Does moving the workbook slider move the editor’s clock?",
        "choices": [
          "No, they are independent",
          "Yes, both clocks are connected"
        ],
        "correct": 0,
        "explanation": "Teaching and editor clocks are independent.",
        "repair": "Press editor Run to restart its minute."
      },
      {
        "title": "Locate where the clock starts",
        "workbook": "Select if (start === undefined), then start = millis(), in the code reader. Read both explanations before the progress line.",
        "editor": "Find those lines inside draw. Leave them there. They assign a start reading on the first visible frame and keep it for later frames.",
        "why": "Avoid the p5 v2 startup-clock reset.",
        "expect": "Later frames keep the original start.",
        "target": "code",
        "question": "Should start be reassigned on every frame?",
        "choices": [
          "Yes, so it always stays current",
          "No, retain the original starting reading"
        ],
        "correct": 1,
        "explanation": "Repeated resets would prevent elapsed progress.",
        "repair": "Restore the first-frame condition if progress stalls."
      },
      {
        "title": "Inspect three states without waiting",
        "workbook": "Move “Explore elapsed time” to 0, then 30, then 60 seconds. Compare the images at each stop. Read the t value beside the slider.",
        "editor": "Leave your real run alone while inspecting the workbook. Locate constrain((millis() - start) / 60000, 0, 1) without editing it.",
        "why": "Inspect states without claiming elapsed viewing.",
        "expect": "At 0/30/60 seconds, t = 0/0.5/1.",
        "target": "time",
        "question": "What progress should remain after seventy seconds?",
        "choices": [
          "1",
          "1.1667 continuing beyond the endpoint"
        ],
        "correct": 0,
        "explanation": "constrain holds the ending at one.",
        "repair": "Pause teaching playback before positioning the slider."
      },
      {
        "title": "Distinguish progress from final strength",
        "workbook": "Keep the slider at 30 seconds. Lower strength from 100% to 50%, compare, then restore 100%. Leave the region and tile size fixed.",
        "editor": "For this one experiment, change only const strength = 1; to 0.5 and Run. Read paintTiles(t * strength). Restore 1 and Run before continuing.",
        "why": "Progress and strength control different quantities.",
        "expect": "Half strength ends halfway after sixty seconds.",
        "target": "strength",
        "question": "Does half strength shorten the duration?",
        "choices": [
          "Yes, it finishes in thirty seconds",
          "No, it changes the endpoint amount"
        ],
        "correct": 1,
        "explanation": "Strength changes endpoint, not duration.",
        "repair": "Check that the divisor remains 60000."
      },
      {
        "title": "Use a quick rehearsal correctly",
        "workbook": "Click “Rehearse in 6 seconds”. Watch it reach the teaching ending, then press “Replay from 0”. Notice that “Play 60 seconds” is a separate choice.",
        "editor": "Keep the editor divisor at 60000. Do not assume the workbook’s quick rehearsal edited your code. If you manually tested 6000 in the editor, restore 60000 before saving or presenting.",
        "why": "Quick inspection differs from full pacing.",
        "expect": "Six-second rehearsal; generated divisor remains 60000.",
        "target": "play",
        "question": "Does the quick workbook rehearsal export a six-second sketch?",
        "choices": [
          "No, generated code stays at 60000",
          "Yes, it changes the exported duration"
        ],
        "correct": 0,
        "explanation": "Quick teaching playback does not change exports.",
        "repair": "Inspect and restore any manually changed divisor."
      },
      {
        "title": "Watch one real minute and record it",
        "workbook": "Prepare your observation field for beginning, middle and ending notes. Use “Play 60 seconds” only if you also want to watch the teaching version afterward.",
        "editor": "Press Run and start a separate timer as the picture appears. Watch through sixty seconds and a few seconds beyond. Write actual timestamps and what you noticed; then Save the working version.",
        "why": "Measure the visible experience directly.",
        "expect": "The ending holds beyond sixty seconds.",
        "target": "notes",
        "question": "What verifies the pacing more directly?",
        "choices": [
          "Counting a requested number of frames",
          "Watching a full run with a separate timer"
        ],
        "correct": 1,
        "explanation": "Frame-rate requests do not guarantee elapsed duration.",
        "repair": "Time from visible start; inspect a stalled clock."
      }
    ]
  },
  {
    "stage": "studio-5",
    "welcome": "Make the minute dependable in the place where someone will see it. This stage adds click-to-replay and a canvas that follows the available window size. A workbook preview cannot establish whether your saved project’s files or share links work. Test the actual editor project and its presentation page, with the same image and rule each time.",
    "vocabulary": [
      {
        "term": "Viewport",
        "meaning": "The available browser page area. windowWidth and windowHeight describe its current size."
      },
      {
        "term": "Replay",
        "meaning": "Restart the clock while keeping the same source and visual rules."
      },
      {
        "term": "Resize handler",
        "meaning": "A named function, windowResized, that p5 calls when the available page size changes."
      },
      {
        "term": "Fullscreen link",
        "meaning": "The editor’s shareable presentation-page link. It differs from the code link and from the browser’s own fullscreen mode."
      }
    ],
    "actions": [
      {
        "title": "Install replay and window sizing",
        "workbook": "Run this stage and inspect its complete code. Keep the same focus, strength and sampling values you intend to test.",
        "editor": "Copy this stage’s complete sketch, replace all of sketch.js, then Run and Save. Find createCanvas(windowWidth, windowHeight), mousePressed, and windowResized.",
        "why": "Test the actual saved project.",
        "expect": "Viewport canvas and click replay are available.",
        "target": "run",
        "question": "Which version should receive your final share links?",
        "choices": [
          "The saved editor project you test",
          "An unsaved workbook control state"
        ],
        "correct": 0,
        "explanation": "Share links belong to the editor project.",
        "repair": "Confirm the new stage replaced sketch.js completely."
      },
      {
        "title": "Compare replay states in the workbook",
        "workbook": "Press Pause, then “Replay from 0”. Inspect 0, 30 and 60 seconds with the slider. Repeat the same positions without changing any visual controls.",
        "editor": "Leave the project unchanged during this teaching comparison. Record the same three checkpoints you will inspect in its real runs.",
        "why": "Check matching states under unchanged rules.",
        "expect": "Replay returns to zero, awaiting Play.",
        "target": "replay",
        "question": "What does workbook “Replay from 0” do first?",
        "choices": [
          "Immediately saves the editor project",
          "Returns the teaching state to its beginning"
        ],
        "correct": 1,
        "explanation": "Workbook replay controls only its teaching view.",
        "repair": "Compare source, settings and selected sample first."
      },
      {
        "title": "Restart the actual sketch with a click",
        "workbook": "Read the mousePressed explanation. Keep your timer and three checkpoint notes beside the editor.",
        "editor": "Click inside the running sketch’s canvas after it has progressed. Restart your timer and watch the return to original colors. Repeat once with the same rule and compare the beginning and midpoint.",
        "why": "Restart timing without changing source.",
        "expect": "Clicking the sketch begins its journey again.",
        "target": "code",
        "question": "What needs resetting for this default replay?",
        "choices": [
          "The starting clock reading",
          "Every original source channel"
        ],
        "correct": 0,
        "explanation": "The unchanged source needs no restoration.",
        "repair": "Click the canvas; verify mousePressed exists."
      },
      {
        "title": "Test a wide and a narrow window",
        "workbook": "Read the rect explanation again: source fractions determine destination positions and block dimensions. Keep the workbook available as a reference.",
        "editor": "Make the editor preview wider, then narrower by resizing its window. Inspect important image features and edges. Find resizeCanvas(windowWidth, windowHeight) in windowResized.",
        "why": "Check composition in real presentation spaces.",
        "expect": "The canvas fits; proportions may stretch.",
        "target": "code",
        "question": "Does filling any viewport automatically preserve image proportions?",
        "choices": [
          "Yes, every aspect ratio stays identical",
          "No, this starter stretches to fit"
        ],
        "correct": 1,
        "explanation": "Independent width and height can distort proportions.",
        "repair": "Record the failed size before revising layout."
      },
      {
        "title": "Open the actual presentation link",
        "workbook": "Keep your notes ready for link checks. The workbook’s preview is useful for learning but cannot verify another project’s published asset paths.",
        "editor": "Save. Use File → Share and copy the fullscreen link. Open that link in a new browser tab. Also keep the sketch-code link separately. Run or click the presentation as needed and check that its image loads.",
        "why": "Verify the actual share destination.",
        "expect": "Saved fullscreen page loads the intended sketch.",
        "target": "notes",
        "question": "What is the strongest check of the fullscreen link?",
        "choices": [
          "Open the exact link and watch it",
          "Assume the workbook preview proves it"
        ],
        "correct": 0,
        "explanation": "Only opening a link checks its destination.",
        "repair": "Verify assets, Save, and reopen the link."
      },
      {
        "title": "Rehearse twice and preserve the result",
        "workbook": "Record two presentation rehearsals and any resizing problem in your notes. Do not mark class documentation finished solely because these local checks worked.",
        "editor": "At the intended display size, watch two full silent runs, restarting deliberately. Save your tested sketch and preserve its code. No randomness is needed; explore lesson 15 only if you intentionally want the optional seeded extension.",
        "why": "Test the complete presentation twice.",
        "expect": "Matching moments repeat with unchanged inputs.",
        "target": "notes",
        "question": "Are randomSeed and noiseSeed interchangeable?",
        "choices": [
          "Yes, either controls both generators",
          "No, each controls its own generator"
        ],
        "correct": 1,
        "explanation": "Each seed controls its own generator.",
        "repair": "Compare inputs; restore the simple working version."
      }
    ]
  },
  {
    "stage": "studio-6",
    "welcome": "The mechanism is ready to become your paired class project. This final stage organizes work you must actually do: explore the assigned color examples, make iterations, watch complete timed runs, and document your decisions. Answering these questions or ticking a workbook box does not perform those activities. Keep the live Week 9 assignment open for its links, destinations and actual deadline.",
    "vocabulary": [
      {
        "term": "Iteration",
        "meaning": "A preserved version with a deliberate rule change and a record of the result you actually observed."
      },
      {
        "term": "Observation",
        "meaning": "What you noticed and when. An interpretation explains what you think that observation means."
      },
      {
        "term": "Collaboration record",
        "meaning": "An honest account of what each partner did independently and what you decided or tested together."
      },
      {
        "term": "Deliverable",
        "meaning": "An item the assignment asks you to submit, such as a process blog, code link or fullscreen link."
      }
    ],
    "actions": [
      {
        "title": "Review the actual assignment and color examples together",
        "workbook": "Open the full submission checklist and follow its Week 9 assignment link. With your partner, open and work through ALL linked Color Theory examples. Write two or three genuine observations you might explore in your project.",
        "editor": "Keep your working sketch saved and unchanged while you examine the examples. Use separate browser tabs for examples so you do not replace your project accidentally.",
        "why": "Base ideas on shared exploration.",
        "expect": "Two or three genuine color observations exist.",
        "target": "checklist",
        "question": "What counts as completing the example exploration?",
        "choices": [
          "Both partners working through all linked examples",
          "Selecting the answer on this card"
        ],
        "correct": 0,
        "explanation": "Answering cards does not perform class activities.",
        "repair": "Finish all actual examples together before claiming completion."
      },
      {
        "title": "Agree on a concept and divide real responsibilities",
        "workbook": "Download “Partner log CSV” from the templates. Together, name your source, intended alternative reality and first rule to test. Assign each partner independent work, then plan when to reunite and compare.",
        "editor": "Save a shared baseline version you can both identify. Each partner should preserve their own tested variation or other agreed contribution before bringing it back for discussion.",
        "why": "Make contributions and shared decisions visible.",
        "expect": "Named roles precede actual contribution records.",
        "target": "templates",
        "question": "Which record describes collaboration accurately?",
        "choices": [
          "“We both did everything” without detail",
          "What each did alone and what you decided together"
        ],
        "correct": 1,
        "explanation": "Specific records show how collaboration shaped work.",
        "repair": "Assign concrete tasks and reunite to compare."
      },
      {
        "title": "Preserve at least three algorithm iterations",
        "workbook": "Download “Iteration CSV”. For each version, record the rule changed, your prediction, the actual output and your next decision. Keep source and settings identifiable. A blank template is only a place to record work.",
        "editor": "Develop and save at least three algorithm iterations. Change one rule per comparison, Run, inspect and preserve that complete version before replacing it. If using this stage’s generated starter, copy all of it over sketch.js as in earlier stages.",
        "why": "Connect changed rules with observed results.",
        "expect": "Three preserved tested algorithm versions exist.",
        "target": "downloadcode",
        "question": "Which is useful iteration evidence?",
        "choices": [
          "A saved changed version plus its observed result",
          "Three planned filenames with no tested sketches"
        ],
        "correct": 0,
        "explanation": "Planned filenames alone are not iterations.",
        "repair": "Recover overwritten versions or test another honestly."
      },
      {
        "title": "Watch at least three full runs with a timer",
        "workbook": "Download “Timed observation CSV”. Prepare separate rows for viewing number, actual timestamp in seconds, what you noticed, and interpretation. Keep your partner’s initial attention notes separate before discussing.",
        "editor": "Watch the project at least three complete times with a separate timer. Restart deliberately, watch the entire minute each time, and record real moments such as “at 22 seconds I noticed the doorway”. Keep playback silent.",
        "why": "Watch pacing, not just isolated states.",
        "expect": "Three full viewings have real timestamped observations.",
        "target": "templates",
        "question": "Can inspecting 0, 30 and 60 seconds on a slider replace a full viewing?",
        "choices": [
          "Yes, those three states are enough",
          "No, watch the complete minute"
        ],
        "correct": 1,
        "explanation": "Scrubbing cannot replace complete timed viewing.",
        "repair": "Label interruptions and watch another full run."
      },
      {
        "title": "Compile the class spreadsheet and write the process blog",
        "workbook": "Use your real logs to compile the iterations and observations in the class spreadsheet linked from the assignment. Open “Blog outline” as a writing aid. Include collaboration, experiments, iterations, timed observations and related or inspiring projects.",
        "editor": "Choose the iteration you will post as requested. Save it and verify its title and links. Preserve other versions so the blog can point to meaningful differences rather than describing only the final effect.",
        "why": "Prepare evidence for actual submission destinations.",
        "expect": "Spreadsheet and blog contain real process evidence.",
        "target": "templates",
        "question": "Do downloaded local logs replace the class spreadsheet?",
        "choices": [
          "No, compile the requested material there too",
          "Yes, downloading the blank files submits it"
        ],
        "correct": 0,
        "explanation": "Local templates do not replace class submissions.",
        "repair": "Consult live instructions for unclear destinations."
      },
      {
        "title": "Check the actual blog, code and fullscreen links",
        "workbook": "Use the full submission checklist to audit the deliverables against your actual work. Collect the blog link, sketch-code link and fullscreen link. Include source and inspiration credits and the collaboration record.",
        "editor": "Save the chosen project. Open its exact code and fullscreen links in separate tabs and verify the image and behavior. Rehearse two silent runs at presentation size; check any planned interaction timing and imported video silence.",
        "why": "Check what your intended viewer opens.",
        "expect": "All three links reach intended current artifacts.",
        "target": "checklist",
        "question": "What proves a link is usable?",
        "choices": [
          "Its label looks complete in a note",
          "Opening the exact link and checking the result"
        ],
        "correct": 1,
        "explanation": "A candidate URL needs actual destination verification.",
        "repair": "Repair failed links, Save, and test again."
      },
      {
        "title": "Finish separate preparation and make an honest final audit",
        "workbook": "Return to the live assignment for the separate sound reading and watching, including its specified book exercises. Confirm the actual class deadline. In your final note, list completed evidence and any remaining work before using the completion checkbox.",
        "editor": "Keep the submitted one-minute artifact silent. Make final saves after tested changes and retain a backup of the exact complete code that your shared project runs.",
        "why": "Audit real work without invented completion.",
        "expect": "Required evidence and separate preparation are accounted for.",
        "target": "notes",
        "question": "Does separate sound preparation change this project’s silent requirement?",
        "choices": [
          "No, complete that preparation separately",
          "Yes, add sound to satisfy it"
        ],
        "correct": 0,
        "explanation": "Sound preparation remains separate; this artifact stays silent.",
        "repair": "Name missing work and complete the actual activity."
      }
    ]
  }
];
