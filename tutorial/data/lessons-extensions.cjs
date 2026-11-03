module.exports = [
  {
    id: '16-slit', title: 'Optional: draw time with a slit scan', minutes: 30, stage: 'Extensions', diagram: 'timeline', preview: true,
    intro: [
      'A normal picture places different spatial locations beside one another. A slit scan can place different moments beside one another. We copy a narrow vertical strip from a moving scene, place it in one column, then place the next moment in the next column. The vertical axis still represents height in the scene; the horizontal axis now records the order of sampled moments.',
      'This example needs no photograph, camera, or uploaded file. CreateGraphics makes a second drawing surface called scene. We draw an original moving circle there, then borrow its center strip for the visible canvas. Methods beginning scene. affect that separate surface. Copy receives the source surface, four source-region numbers, and four destination-region numbers.',
      'We deliberately preserve the visible canvas between frames, so earlier strips remain. This accumulation is the intended artwork. It differs from accidentally damaging a source image: scene is freshly drawn each frame, while the destination records history. One column is added per drawing frame, so column spacing does not promise an exact number of seconds. Use the earlier elapsed-time lesson for a timed assignment. Click to clear and begin another scan.'
    ],
    lines: [
      ['let scene;', 'Declare a name for an offscreen drawing surface.'],
      ['let column = 0;', 'Remember the next destination column to fill, beginning at the left edge.'],
      ['function setup() {', 'Open the once-only preparation instructions.'],
      ['  createCanvas(480, 240);', 'Create the visible destination image.'],
      ['  pixelDensity(1);', 'Use one stored pixel per canvas coordinate.'],
      ['  scene = createGraphics(320, 240);', 'Make a separate, offscreen 320 by 240 drawing surface. It is our synthetic source.'],
      ['  scene.pixelDensity(1);', 'Use density one on that source surface too.'],
      ['  scene.noStroke();', 'Disable outlines for shapes drawn on scene.'],
      ['  background(20);', 'Clear the destination once, before accumulating strips.'],
      ['  describe("A slit scan records successive vertical slices of a synthetic moving circle; left to right represents successive sampled moments. Click to clear.");', 'Describe both the picture and its unusual time axis.'],
      ['}', 'Close setup.'],
      ['function draw() {', 'Start one drawing frame.'],
      ['  let seconds = millis() / 1000;', 'Convert the clock reading from milliseconds into seconds.'],
      ['  scene.background(30, 50, 90);', 'Erase only the offscreen source with a dark blue color.'],
      ['  scene.fill(255, 170, 60);', 'Choose an orange fill on the source surface.'],
      ['  scene.circle(160, 120 + sin(seconds * 2) * 75, 90);', 'Draw a circle whose center moves smoothly up and down, crossing the fixed source strip.'],
      ['  copy(scene, 160, 0, 1, 240, column, 0, 1, 240);', 'Copy the source strip at x=160, y=0, width=1, height=240 into the current one-pixel-wide destination column.'],
      ['  column = column + 1;', 'Move the destination position one column to the right for the next moment.'],
      ['  if (column >= width) {', 'Check whether the destination has reached its right edge.'],
      ['    column = 0;', 'Wrap back to the left and begin replacing the oldest strips.'],
      ['  }', 'Close the edge-check instructions.'],
      ['}', 'Finish this frame without clearing the visible history.'],
      ['function mousePressed() {', 'Open the reset action triggered by a click.'],
      ['  background(20);', 'Erase the visible record.'],
      ['  column = 0;', 'Start writing at the left edge again. The source clock continues running.'],
      ['}', 'Close reset.']
    ],
    predict: 'If background(20) moved into draw, would the previously recorded strips remain? What does the horizontal direction represent in this image?',
    expect: 'An orange ribbon gradually appears across a dark blue record. Its curved boundaries come from the circle moving vertically as successive center strips are recorded. The blank area ahead of the writing column is gradually filled. After reaching the edge, new strips replace earlier ones.',
    practice: [
      {task: 'Change the sampled strip from x=160 to x=130. Predict why the ribbon becomes narrower even though the circle diameter stays unchanged.', hint: 'A vertical slice away from a circle center intersects a shorter portion of the circle.', solution: 'Change the first coordinate after scene in copy to 130. The recorded orange segment becomes shorter because the source slice passes through the side of the circle. This changes what information is sampled, rather than changing the displayed circle size.'},
      {task: 'Make each recorded moment occupy three destination columns, then compare the resulting time texture.', hint: 'The source can stay one pixel wide. Change the destination strip width and the amount by which column advances together.', solution: 'Use copy(scene, 160, 0, 1, 240, column, 0, 3, 240); and column = column + 3;. The destination fills with fewer sampled moments and each one is wider. Copy scales the source region to the destination region; it does not create three new moments.'},
      {task: 'Explain why clearing scene is necessary while clearing the main canvas every frame would defeat this particular effect.', hint: 'Give the two drawing surfaces different jobs: current source versus recorded history.', solution: 'Scene must describe the current circle position, so its old shapes are erased before the new circle is drawn. The main canvas stores earlier samples, so it is preserved. Try the extra background call briefly, observe the single surviving strip, then remove it.'}
    ],
    check: [
      {q: 'Which four numbers choose the source region in copy?', a: '160, 0, 1, 240: source x, source y, source width, and source height.'},
      {q: 'Does one recorded column necessarily mean one-sixtieth of a second?', a: 'No. This example samples once per draw frame, and real drawing speed can vary.'}
    ],
    refs: ['https://p5js.org/reference/p5/createGraphics/', 'https://p5js.org/reference/p5/copy/', 'https://github.com/processing/p5.js/blob/v2.3.4/src/image/pixels.js', 'https://p5js.org/reference/p5/millis/']
  },
  {
    id: '17-camera', title: 'Optional: sample a live camera in the editor', minutes: 35, stage: 'Extensions', diagram: 'pixels', preview: false,
    intro: [
      'This exercise runs only when you choose to paste it into the p5 Web Editor and run it there. The tutorial does not start a camera preview. Your browser will ask for camera permission in that editor. Use a secure HTTPS page, choose VIDEO so no microphone capture is requested, and stop the sketch when finished. You can complete the core one-minute assignment with a still image instead.',
      'A camera supplies changing images rather than one fixed photograph. We hide its ordinary video element because we want to draw our own canvas mosaic. Hide does not stop capture. Size requests a small 320 by 240 video display/buffer so the sampling exercise stays manageable; the actual device stream may have different native dimensions.',
      'Permission, device startup, and decoded frames take time. A video object can exist before it has usable image data. The guard checks that video.width is positive and that its underlying browser element has current frame data. LoadPixels must then run again for each fresh frame. If the browser denies permission or no camera is available, the waiting message may remain; inspect the browser and editor messages rather than assuming the pixel arithmetic is wrong.'
    ],
    lines: [
      ['let video;', 'Declare a name for the camera media element.'],
      ['function setup() {', 'Open the setup instructions.'],
      ['  createCanvas(480, 360);', 'Make a canvas for our camera-derived mosaic.'],
      ['  pixelDensity(1);', 'Use density one on the canvas.'],
      ['  video = createCapture(VIDEO);', 'Ask for video-only camera capture. The browser controls permission; this does not request a microphone.'],
      ['  video.size(320, 240);', 'Request a small media element size for the exercise.'],
      ['  video.hide();', 'Hide the ordinary HTML video element; capture can continue while we draw its content ourselves.'],
      ['  noStroke();', 'Disable outlines around mosaic blocks.'],
      ['  describe("A live camera image rendered as a coarse color mosaic after permission and frame readiness.");', 'Describe the intended canvas output.'],
      ['}', 'Close setup.'],
      ['function draw() {', 'Begin one frame of the drawing.'],
      ['  background(25);', 'Clear the canvas before drawing current information.'],
      ['  if (video.width <= 0 || video.elt.readyState < 2) {', 'Wait if dimensions are unavailable OR the underlying browser video element has no current decoded frame.'],
      ['    fill(255);', 'Choose a readable white message color.'],
      ['    text("Waiting for camera permission or a frame...", 15, 30);', 'Show a useful waiting message instead of reading unavailable pixel data.'],
      ['    return;', 'End this draw call early. The next frame will check readiness again.'],
      ['  }', 'Close the readiness guard.'],
      ['  video.loadPixels();', 'Read the current camera frame into its pixel buffer. Repeat this for every new frame.'],
      ['  if (video.pixels.length === 0) {', 'Check whether pixel reading still produced an empty buffer.'],
      ['    return;', 'Skip sampling until a nonempty frame is available.'],
      ['  }', 'Close the empty-buffer guard.'],
      ['  for (let y = 0; y < video.height; y += 16) {', 'Visit rows of the current video buffer in sixteen-pixel steps.'],
      ['    for (let x = 0; x < video.width; x += 16) {', 'Visit columns within each row.'],
      ['      let i = 4 * (x + y * video.width);', 'Locate this source video pixel in its RGBA array, using video width rather than canvas width.'],
      ['      fill(video.pixels[i], video.pixels[i + 1], video.pixels[i + 2]);', 'Set the next block color from the current frame red, green, and blue values.'],
      ['      rect(x / video.width * width, y / video.height * height, 16 / video.width * width, 16 / video.height * height);', 'Draw one proportional destination block for this sampled video position.'],
      ['    }', 'Close the column loop.'],
      ['  }', 'Close the row loop.'],
      ['}', 'Finish the frame; the next draw call reads a fresh camera image.']
    ],
    predict: 'What would happen if loadPixels ran only once in setup? Why can an object named video exist while it still cannot provide a useful frame?',
    expect: 'After permission and device startup, a blocky live image follows movement in front of the camera. The hidden ordinary video does not appear as a second picture. Camera access is not requested anywhere inside this tutorial app.',
    practice: [
      {task: 'Convert the live mosaic into a grayscale brightness mirror.', hint: 'Average each sampled pixel red, green, and blue channels before choosing its fill.', solution: 'Replace the fill line inside the loops with let gray = (video.pixels[i] + video.pixels[i + 1] + video.pixels[i + 2]) / 3; followed by fill(gray);. Moving a bright object changes the corresponding blocks. This simple average is an exercise, not a perceptually weighted brightness measurement.'},
      {task: 'Mirror the mosaic horizontally so it responds like a familiar bathroom mirror.', hint: 'Change destination placement, not the source index. Subtract the block width as well as its normal position.', solution: 'Use rect(width - x / video.width * width - 16 / video.width * width, y / video.height * height, 16 / video.width * width, 16 / video.height * height);. The source buffer stays unchanged. A detail from the source left appears on the drawn right.'},
      {task: 'Plan an alternative that works without camera permission, and explain which parts of the pixel lesson remain identical.', hint: 'Return to a still image with loadImage and retain its source dimensions in the index formula.', solution: 'Use the earlier image mosaic or mirror sketch. A still image loads once, whereas the camera buffer must be refreshed repeatedly. Both sample RGBA channels, translate source coordinates to destination positions, and use those values to choose shapes or colors. Hardware is an optional input, not a prerequisite for understanding pixels.'}
    ],
    check: [
      {q: 'Does video.hide stop the camera?', a: 'No. It hides the ordinary media element. Use the editor stop control when you finish and confirm the browser camera indicator.'},
      {q: 'Why is video.loadPixels inside draw?', a: 'The camera image changes, so each drawing needs the current frame buffer rather than an old stored image.'}
    ],
    refs: ['https://p5js.org/reference/p5/createCapture/', 'https://p5js.org/reference/p5.MediaElement/loadPixels/', 'https://p5js.org/reference/p5.Element/hide/', 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState']
  },
  {
    id: '18-video', title: 'Optional: use your own silent video file', minutes: 30, stage: 'Extensions', diagram: 'image', preview: false,
    intro: [
      'This editor-only exercise uses a file you supply. Record or choose a short video you have permission to use, upload it to your p5 Web Editor project, and name it clip.mp4. That video is not included in this tutorial. The built-in sample.png belongs to the image exercises; renaming an image extension to .mp4 does not turn it into a video. Browser support also depends on how a video was encoded, not just its filename.',
      'A video is a media element with playback controls and a changing image. CreateVideo begins loading the element. Its optional callback tells us when it is ready to play; it does not mean setup waits in the same way as await loadImage. We keep a ready flag, then check decoded-frame readiness before drawing. The Play video button calls a named function in direct response to your click, which is friendlier to browser playback restrictions than trying to start automatically.',
      'The clip is deliberately silent with volume(0). No sound library is needed for these visual exercises. If you later choose sound as a separate topic, read the current p5 sound documentation and verify version compatibility: older p5 v1 sound examples do not automatically work with p5 v2. The core Week 9 preparation can stay entirely visual.'
    ],
    lines: [
      ['let clip;', 'Declare a name for the uploaded video media element.'],
      ['let ready = false;', 'Remember that loading is not ready at the beginning.'],
      ['let playButton;', 'Remember an ordinary HTML button placed below the canvas.'],
      ['function setup() {', 'Begin setup.'],
      ['  createCanvas(480, 360);', 'Create the drawing area.'],
      ['  pixelDensity(1);', 'Use density one on the canvas.'],
      ['  clip = createVideo("clip.mp4", videoReady);', 'Begin loading your uploaded file and register videoReady as the function to call when playback is ready. Do not put parentheses after the callback name here.'],
      ['  clip.hide();', 'Hide the ordinary video element so only our canvas version appears.'],
      ['  clip.volume(0);', 'Set this video element volume to zero. This is a media control, not sound-library code.'],
      ['  playButton = createButton("Play video when ready");', 'Create a labeled, clickable HTML button.'],
      ['  playButton.mousePressed(startVideo);', 'Register startVideo as the button action; the function runs when the user clicks.'],
      ['  describe("An uploaded silent video appears on the canvas after loading and a Play video button click.");', 'Describe the expected result and its playback action.'],
      ['}', 'Close setup.'],
      ['function videoReady() {', 'Open the callback that the loader calls when the clip is ready to play.'],
      ['  ready = true;', 'Remember that the file has reached playback readiness.'],
      ['}', 'Close the loader callback.'],
      ['function startVideo() {', 'Open the action called directly by the button click.'],
      ['  if (ready) {', 'Only attempt playback after the loading callback has marked the file ready.'],
      ['    clip.loop();', 'Start playing the clip and repeat it when it reaches the end.'],
      ['  }', 'Close the readiness condition. An early click simply requires another click after loading.'],
      ['}', 'Close the click action.'],
      ['function draw() {', 'Begin the repeated canvas drawing instructions.'],
      ['  background(25);', 'Clear old canvas content with dark gray.'],
      ['  if (ready && clip.width > 0 && clip.elt.readyState >= 2) {', 'Require loading readiness AND a positive width AND a current decoded frame before drawing the media.'],
      ['    image(clip, 0, 0, width, height);', 'Draw the current video frame across the canvas. Its proportions follow the chosen destination size.'],
      ['  } else {', 'Choose the following instructions when frame readiness is still incomplete.'],
      ['    fill(255);', 'Set the message text color to white.'],
      ['    text("Upload clip.mp4, wait, then press Play video.", 15, 30);', 'Give the user an actionable loading and playback instruction.'],
      ['  }', 'Close the drawing condition.'],
      ['}', 'Finish the frame.']
    ],
    predict: 'Will hide make the clip impossible to draw with image? Will a click before ready becomes true start playback later by itself?',
    expect: 'In your editor project, the uploaded video loads and a button appears. Click after it is ready to start silent repeated playback on the canvas. A paused first frame may be visible before playback. An early click does not queue playback; click again after loading. This tutorial app does not load or play an uploaded clip for you.',
    practice: [
      {task: 'Add a separate Pause video button using a named function, keeping the Play action intact.', hint: 'Create another button in setup, register a mousePressed callback, then write that callback outside setup.', solution: 'Inside setup add let pauseButton = createButton("Pause video"); and pauseButton.mousePressed(pauseVideo);. Outside setup add function pauseVideo() { clip.pause(); }. Pause stops playback at the current position; the canvas can continue drawing that same frame. Keep each brace matched.'},
      {task: 'Show a smaller centered video without changing the uploaded file.', hint: 'Only the image destination arguments need changing. You do not need to re-encode the file.', solution: 'Use image(clip, (width - 320) / 2, (height - 240) / 2, 320, 240);. This draws a 320 by 240 display with a dark border. If your source has a different aspect ratio, this may stretch it; choose matching destination proportions to preserve its shape.'},
      {task: 'If the video never appears, inspect the first actual error before changing the animation code.', hint: 'Check filename spelling, the project file list, loading/network messages, browser encoding support, and whether you clicked after loading.', solution: 'Verify that clip.mp4 is really uploaded and that its exact path matches createVideo. A missing-file error calls for a path fix; an unsupported media format calls for a compatible video export. A ready clip that has not started needs a user click. The readiness guard prevents invalid drawing, but it cannot repair an unavailable or unsupported file.'}
    ],
    check: [
      {q: 'Why pass videoReady rather than videoReady() to createVideo?', a: 'The loader needs the function to call later. Parentheses would call it immediately instead of registering the callback.'},
      {q: 'What starts playback in this example?', a: 'A click on the HTML button calls startVideo, which calls clip.loop if loading is ready.'}
    ],
    refs: ['https://p5js.org/reference/p5/createVideo/', 'https://p5js.org/reference/p5.MediaElement/loop/', 'https://p5js.org/reference/p5.MediaElement/volume/', 'https://p5js.org/reference/p5.MediaElement/pause/', 'https://p5js.org/reference/p5/createButton/', 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState']
  },
  {
    id: '19-debug', title: 'Practice: find the first error and repair one thing', minutes: 35, stage: 'Practice', diagram: 'transform', preview: true,
    intro: [
      'Debugging means comparing what you intended with what the computer actually did. Begin with a small working example, make one change, run it, and read the first error message if one appears. Fixing the first error often removes several later messages. A reported line is a starting clue: a missing brace may be noticed much later than the place where it belongs.',
      'There are different kinds of problems. A syntax error means the computer cannot read the structure, such as unmatched braces. A reference error can mean a name does not exist in that location. A logic error means readable code does something unintended, such as assigning a value when you meant to compare two values. A missing or not-yet-loaded image is an asset/readiness problem. Do not expect one kind of repair to solve every kind of failure.',
      'The sketch below is intentionally correct and needs no asset. A circle advances horizontally and resets when its center reaches the canvas width. Use the practices to break a duplicate, observe the specific failure, and repair it. Keep a working version so you have evidence of what changed. A browser message about an unavailable file deserves a different investigation from a circle that refuses to move.'
    ],
    lines: [
      ['let x = 60;', 'Declare a global position variable that setup and draw could both access.'],
      ['function setup() {', 'Open the once-only setup function.'],
      ['  createCanvas(480, 240);', 'Make a canvas with a width that our three-pixel steps can reach exactly.'],
      ['  pixelDensity(1);', 'Use density one for the canvas.'],
      ['  describe("A blue circle moves right and resets to the left when its center reaches the right edge.");', 'Describe the intended motion so there is a clear expectation to compare with observation.'],
      ['}', 'Close setup before defining draw.'],
      ['function draw() {', 'Open one frame of repeated drawing.'],
      ['  background(240);', 'Clear the previous circle so motion does not leave a trail.'],
      ['  fill(30, 100, 230);', 'Choose a blue RGB fill.'],
      ['  circle(x, 120, 50);', 'Draw a circle at the current horizontal position.'],
      ['  x = x + 3;', 'Assign a new position three pixels to the right. One equals sign stores a value.'],
      ['  if (x === width) {', 'Compare position with canvas width. Three equals signs test equality without assigning.'],
      ['    x = 0;', 'Reset position to the left edge when the condition is true.'],
      ['  }', 'Close the condition block.'],
      ['}', 'Close draw. Every opening brace has a matching closing brace.']
    ],
    predict: 'If you replace the comparison x === width with the assignment x = width, will the code necessarily produce a syntax error? Predict the visible behavior before trying it in a duplicate.',
    expect: 'The correct sketch moves the blue circle to the right and resets it. Assignment inside the condition is readable JavaScript but a logic mistake here: it stores width in x, treats that nonzero number as true, and resets x to zero every frame. The circle appears stuck at the left.',
    practice: [
      {task: 'Break and repair assignment versus comparison. Keep the original correct version, then replace only the if condition with x = width.', hint: 'A program can run successfully and still be wrong. Read the condition as an action and then as a question.', solution: 'Observe that the circle stays at the left after the first frame. Restore x === width to test equality. For a more robust boundary rule use x >= width, because equality could be skipped if the movement step changed. The original three-pixel step reaches 480 exactly; a different step might jump over it.'},
      {task: 'Remove the final closing brace, run the duplicate, and read the first syntax error. Then restore it.', hint: 'Count the blocks: setup, draw, and the if statement each need a closing brace. The error may point at the end of the file.', solution: 'Put the final } back to close draw. Do not rewrite every line reported after the parser lost track of the structure. Indentation helps you see the intended blocks, but spaces alone do not close a JavaScript function.'},
      {task: 'Move let x = 60 from the top of the sketch into setup, then explain the first reference error and repair the variable scope.', hint: 'A variable declared inside a function belongs to that function. Draw is a separate function.', solution: 'Draw can no longer find x, so the first attempted use can report that x is not defined. Restore let x = 60 above both functions. Alternatively declare let x globally and assign x = 60 inside setup. Do not declare a new let x inside draw each frame, because that would reset the position repeatedly.'},
      {task: 'Diagnose an image that is blank or fails to load in your image lesson. Separate a wrong filename from using an image before loading finishes.', hint: 'Use the project file list and the first loading message as evidence. The tutorial image preview supplies sample.png, but a separate editor project needs an uploaded file.', solution: 'For a missing file, upload your image and make the quoted filename and path match exactly. For readiness in p5 v2.3.4, declare the image name outside setup, write async function setup(), and assign picture = await loadImage("your-file.png"); before image(picture, ...). A variable declared only inside setup is unavailable to draw. Do not try to fix a missing file with pixel-index arithmetic.'}
    ],
    check: [
      {q: 'Why fix the first error before chasing every later message?', a: 'A single unreadable statement or missing brace can cause later messages that disappear when the original structure is repaired.'},
      {q: 'Does a program that runs without an error message necessarily do what you intended?', a: 'No. Logic errors such as accidental assignment may run; compare actual output against a specific prediction.'}
    ],
    refs: ['https://p5js.org/tutorials/field-guide-to-debugging/', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#variable_scope', 'https://p5js.org/reference/p5/loadImage/']
  }
];
