module.exports = [
  {
    id: '10-image', title: 'Open an image: a file becomes material', minutes: 25, stage: 'Media', diagram: 'image', preview: true,
    intro: [
      'An image file is stored information. Your sketch must ask the browser to fetch that information before it can draw it. Here, sample.png is the name of an original image supplied with this tutorial. In your own p5 Web Editor project, upload an image and make the quoted filename match its exact spelling. A name ending in .png is not interchangeable with one ending in .jpg.',
      'This complete sketch uses p5.js 2.3.4. The words async and await mean that setup can wait for a file to arrive. Older videos often put loading in a separate preload function; that is the p5 v1 pattern. Use the version shown here throughout these exercises. A missing file is a loading problem, not evidence that you need to understand more mathematics.',
      'There are two different rectangles: the source image and the canvas displaying it. The supplied image is 320 by 240 pixels; our canvas is 480 by 360. Drawing the image larger does not add detail to the source. The image function receives a position and display size, while picture.width and picture.height describe its own stored dimensions. Think of enlarging a printed photograph with a projector: the wall and the photograph have different sizes.'
    ],
    lines: [
      ['let picture;', 'Reserve a named place to remember the image after loading. The semicolon finishes this instruction.'],
      ['async function setup() {', 'Start the setup instructions, which run once. Async allows an await instruction inside these braces.'],
      ['  picture = await loadImage("sample.png");', 'Fetch sample.png and wait until an image is available, then store it under the name picture.'],
      ['  createCanvas(480, 360);', 'Create a drawing area 480 pixels wide and 360 pixels tall. The first number is width.'],
      ['  pixelDensity(1);', 'Use one stored canvas pixel for each canvas coordinate. This keeps later pixel arithmetic simple.'],
      ['  background(230);', 'Paint a light gray background; a single RGB value sets a gray.'],
      ['  image(picture, 0, 0, width, height);', 'Draw picture at the top-left corner and stretch its display to the complete canvas. Width and height here belong to the canvas.'],
      ['  describe("The sample image enlarged to fill a rectangular canvas.");', 'Supply a short text description for people who cannot see the canvas.'],
      ['}', 'Close setup. With no draw function, this picture is drawn once and stays visible.']
    ],
    predict: 'The source is 320 by 240 and the canvas is 480 by 360. Will the picture occupy just the top-left 320 by 240 area, or the whole canvas? Find the arguments that decide.',
    expect: 'The image fills the whole 480 by 360 canvas. It keeps the same proportions because both rectangles have a four-to-three width-to-height ratio. There is no motion yet.',
    practice: [
      {task: 'Show the image at its original stored size, leaving the rest of the canvas gray. Before running, describe which edges you expect to see.', hint: 'The last two image arguments control its displayed width and height. The source has its own dimension properties.', solution: 'Replace the image line with image(picture, 0, 0, picture.width, picture.height);. The image now occupies 320 by 240 pixels at the top left, with gray remaining to its right and below. The file itself has not changed.'},
      {task: 'Place a 160 by 120 version in the middle of the canvas. Write down the coordinates of its top-left corner before running.', hint: 'Centering a rectangle means subtracting its size from the canvas size and dividing the leftover space by two.', solution: 'Use image(picture, (width - 160) / 2, (height - 120) / 2, 160, 120);. The top-left corner is (160, 120). Dividing the image width alone by two would find a point inside the image, not its centered position.'},
      {task: 'Make a deliberately distorted portrait-shaped display, then restore the original proportions. Explain the difference between resizing the display and editing the source.', hint: 'Keep the filename and picture variable unchanged. Change only the final image arguments.', solution: 'Try image(picture, 0, 0, 180, 320);. It looks squeezed because width and height were scaled differently. Restore image(picture, 0, 0, width, height);. Neither operation rewrites the source file or invents extra source detail.'}
    ],
    check: [
      {q: 'Why is await important before drawing a newly loaded image?', a: 'Fetching a file takes time. Await waits for the image before the following instructions use it.'},
      {q: 'Does width always mean the source image width?', a: 'No. Width by itself is the canvas width; picture.width is the stored image width.'}
    ],
    refs: ['https://p5js.org/reference/p5/loadImage/', 'https://p5js.org/reference/p5/image/', 'https://p5js.org/tutorials/v2_transition/', 'https://github.com/processing/p5.js/blob/v2.3.4/src/image/loading_displaying.js']
  },
  {
    id: '11-sampling', title: 'Sample an image: turn detail into a mosaic', minutes: 30, stage: 'Media', diagram: 'pixels', preview: true,
    intro: [
      'Sampling means choosing some of the available information. A mosaic can take one color from each small area of a photograph and use it to color a much larger square. You are no longer displaying every source pixel individually. You are making a drawing whose instructions come from an image.',
      'Read the two loops as a route through a tiled floor. The outer loop chooses a row, starting at y = 0. The inner loop walks across that row, starting at x = 0. After it finishes, the outer loop moves down to the next row. Tile is the distance between visits. Increasing tile makes fewer, larger blocks; decreasing it retains more detail and asks the computer to draw more rectangles.',
      'The source and destination still have different coordinate systems. Our x and y refer to the source image because that is where we are reading colors. Dividing x by picture.width produces a fraction of the source width. Multiplying that fraction by width places the block at the equivalent position on the canvas. This is why a small source can guide a larger drawing without confusing its dimensions with the screen dimensions.'
    ],
    lines: [
      ['let picture;', 'Declare a name for the image that will guide the mosaic.'],
      ['let tile = 16;', 'Set the sampling distance to sixteen source pixels. This is a changeable variable.'],
      ['async function setup() {', 'Open the once-only setup instructions, allowing asynchronous file loading.'],
      ['  picture = await loadImage("sample.png");', 'Load the supplied image completely before attempting to sample it.'],
      ['  createCanvas(480, 360);', 'Create our destination drawing area.'],
      ['  pixelDensity(1);', 'Keep canvas coordinates and stored canvas pixels at a simple one-to-one scale.'],
      ['  noStroke();', 'Remove rectangle outlines so adjacent colored blocks form a mosaic.'],
      ['  for (let y = 0; y < picture.height; y += tile) {', 'Visit source rows from top to bottom in jumps of tile, stopping before the image ends.'],
      ['    for (let x = 0; x < picture.width; x += tile) {', 'Within this row, visit source columns from left to right in the same-sized jumps.'],
      ['      let shade = picture.get(x, y);', 'Read the source pixel at this coordinate as an array of red, green, blue, and alpha values.'],
      ['      fill(shade[0], shade[1], shade[2], shade[3]);', 'Choose that pixel color for the next rectangle. Array positions begin at zero.'],
      ['      rect(x / picture.width * width, y / picture.height * height, tile / picture.width * width, tile / picture.height * height);', 'Convert the source position and tile size into proportional canvas coordinates, then draw one block.'],
      ['    }', 'Finish the inner loop body. Repeat it for the next column until this row is complete.'],
      ['  }', 'Finish the outer loop body. Repeat for the next row until the image has been sampled.'],
      ['  describe("A block mosaic made from regularly sampled colors in the sample image.");', 'Explain the transformation in text rather than assuming that everyone sees its blocks.'],
      ['}', 'Close setup. The finished mosaic remains on screen.']
    ],
    predict: 'If tile changes from 16 to 32, will the result show more detail or less? Will the computer draw more rectangles or fewer?',
    expect: 'A recognizable but blocky version of the source fills the canvas. Tile 16 samples twenty columns and fifteen rows of a 320 by 240 source: three hundred blocks.',
    practice: [
      {task: 'Compare tile values 8, 16, and 32. Before each run, predict the detail level. Record which value makes the image recognizable but pleasantly abstract.', hint: 'Change only the number in let tile. Leave the rectangle formulas alone so sampling distance and block size stay linked.', solution: 'Eight makes smaller blocks and more detail; thirty-two makes larger blocks and less detail. Sixteen sits between them. At eight, there are 40 columns and 30 rows, giving 1200 blocks. At thirty-two the final row may extend past the canvas edge and be clipped; this is expected.'},
      {task: 'Leave a narrow gap between blocks without changing which source locations are sampled.', hint: 'Keep x += tile and y += tile. Change only the last two rectangle arguments, which specify the displayed block dimensions.', solution: 'Use (tile - 2) / picture.width * width and (tile - 2) / picture.height * height for the final two arguments. Add background(30); after noStroke(); so the gaps have a deliberate dark color. Sampling positions stay unchanged; only the drawn shapes shrink.'},
      {task: 'Use circles instead of rectangles and explain why the resulting image feels different.', hint: 'A circle uses a center and diameter. Use the middle of each tile as its destination position.', solution: 'Replace rect with circle((x + tile / 2) / picture.width * width, (y + tile / 2) / picture.height * height, tile / picture.width * width);. Colored dots leave uncovered corners between neighbors. The same sampled information now produces a different visual language.'}
    ],
    check: [
      {q: 'Why do the loops stop at picture.width and picture.height?', a: 'They visit source locations to read image colors. The canvas could have different dimensions.'},
      {q: 'What does shade[0] mean?', a: 'The first entry in the sampled RGBA array: its red amount. Zero is an array position, not a color here.'}
    ],
    refs: ['https://p5js.org/reference/p5.Image/get/', 'https://p5js.org/reference/p5/for/', 'https://p5js.org/reference/p5/rect/']
  },
  {
    id: '12-rgba', title: 'Read RGBA: four numbers make one pixel', minutes: 35, stage: 'Media', diagram: 'pixels', preview: true,
    intro: [
      'Pixels are stored in one long row of numbers, even though an image looks like a two-dimensional rectangle. Every pixel uses four consecutive entries: red, green, blue, alpha. Alpha means transparency. For ordinary RGBA image data, each channel runs from 0 to 255. A fully opaque pixel has alpha 255; an alpha of zero makes it transparent.',
      'Imagine each pixel as an envelope containing four cards. The first envelope starts at array position 0, the second at 4, the third at 8. To find source pixel (x, y), skip y whole rows, then x more pixels, then multiply the count by four: i = 4 * (x + y * imageWidth). The four channel locations are i, i + 1, i + 2, and i + 3. This formula assumes a density-one buffer.',
      'This exercise makes a copy and changes its green channel once. The original image remains available for comparison. LoadPixels brings a buffer into reach, editing the entries changes that buffer, and updatePixels sends your changes back to the image. ColorMode(HSB) does not rearrange the buffer into hue, saturation, and brightness. The raw entries remain RGBA, even when color functions elsewhere accept HSB inputs.'
    ],
    lines: [
      ['let original;', 'Declare a place to remember the untouched source image.'],
      ['async function setup() {', 'Open setup, which can wait for loading.'],
      ['  original = await loadImage("sample.png");', 'Load the source completely.'],
      ['  createCanvas(640, 240);', 'Create space for two 320 by 240 pictures side by side.'],
      ['  pixelDensity(1);', 'Use density one for this canvas.'],
      ['  let changed = original.get();', 'Copy the image into a separate image object so edits leave the source intact.'],
      ['  changed.pixelDensity(1);', 'Explicitly set the copied image buffer to density one for our simple index formula.'],
      ['  changed.loadPixels();', 'Make the copied image pixel array available for reading and writing.'],
      ['  for (let y = 0; y < changed.height; y += 1) {', 'Visit every row in the copied source image.'],
      ['    for (let x = 0; x < changed.width; x += 1) {', 'Visit every pixel in this row.'],
      ['      let i = 4 * (x + y * changed.width);', 'Calculate the first RGBA entry of this source pixel, using its own image width.'],
      ['      changed.pixels[i + 1] = 255 - changed.pixels[i + 1];', 'Invert only the green channel: a green value of 20 becomes 235, and 200 becomes 55.'],
      ['    }', 'Close the column loop body.'],
      ['  }', 'Close the row loop body.'],
      ['  changed.updatePixels();', 'Apply all the edited channel entries to the copied image.'],
      ['  image(original, 0, 0, 320, 240);', 'Show the untouched source on the left.'],
      ['  image(changed, 320, 0, 320, 240);', 'Show the transformed copy on the right.'],
      ['  describe("Original image on the left; a copy with its green channel inverted on the right.");', 'Describe both the layout and the change.'],
      ['}', 'Close setup; all pixel edits happened once.']
    ],
    predict: 'A source pixel has RGBA values [100, 40, 180, 255]. What are its four values after the green-channel instruction? Which channels stay unchanged?',
    expect: 'The original appears on the left. The right-hand image has surprising altered colors. The example pixel becomes [100, 215, 180, 255]. Its red, blue, and transparency values remain unchanged.',
    practice: [
      {task: 'Change the transformation so it inverts red instead of green. Predict one numerical example before running.', hint: 'The first channel is at i. The green channel is at i + 1. Change both appearances of the channel index.', solution: 'Use changed.pixels[i] = 255 - changed.pixels[i];. A red value of 80 becomes 175. Green, blue, and alpha retain their original numbers. Changing only the destination index would copy information from a different channel rather than invert red itself.'},
      {task: 'Produce a grayscale copy by making red, green, and blue equal to their average.', hint: 'Calculate one local value before replacing the three channel entries. Leave alpha alone.', solution: 'Replace the inversion line with let gray = (changed.pixels[i] + changed.pixels[i + 1] + changed.pixels[i + 2]) / 3; followed by three lines assigning gray to those three channel positions. This simple average is a useful exercise, although it is not a perceptual brightness model.'},
      {task: 'Explain the difference between alpha 0 and black RGB before trying a transparency edit.', hint: 'Black can be fully opaque. Transparency determines whether the background shows through.', solution: 'Replace the inversion with changed.pixels[i + 3] = 100; and add background(240, 120, 40); before drawing the pictures. The copied image is partly transparent and the orange background shows through. By contrast, RGB values of zero with alpha 255 draw solid black.'}
    ],
    check: [
      {q: 'At density one, why is there a multiplication by four in the index formula?', a: 'Each pixel takes four array entries, one each for red, green, blue, and alpha.'},
      {q: 'Why does changing only the buffer sometimes appear to do nothing?', a: 'The changes must be applied with updatePixels on the same image object whose buffer was edited.'}
    ],
    refs: ['https://p5js.org/reference/p5/pixels/', 'https://p5js.org/reference/p5.Image/pixelDensity/', 'https://p5js.org/reference/p5.Image/updatePixels/', 'https://p5js.org/reference/p5/colorMode/']
  },
  {
    id: '13-mirror', title: 'Transform a drawing without damaging its source', minutes: 30, stage: 'Media', diagram: 'transform', preview: true,
    intro: [
      'A transformation changes the coordinate system used for drawing. Imagine picking up the sheet of graph paper underneath your shapes, moving its origin, then reversing its horizontal direction. The source image and its pixel colors stay unchanged. Our familiar mosaic code can draw normal rectangle coordinates while the transformed coordinate system makes the complete drawing appear mirrored.',
      'Push saves the current drawing settings. Translate(width, 0) moves the origin to the right edge. Scale(-1, 1) makes positive x go left while positive y still goes down. Together these place the mirrored mosaic inside the canvas; scaling by minus one without moving the origin would send it off the left edge. Pop restores the saved coordinates and styles after the group. A normal, readable label drawn afterward visibly demonstrates that restoration. The order matters: move the origin first, then reverse the axis.',
      'The source buffer is loaded once and read many times. Every frame redraws the canvas from that unchanged source. This prevents cumulative corruption: subtracting a channel on the already changed image every frame would keep changing the material until it became something else. Think of the source as a negative in a darkroom and the canvas as a fresh print. Later you can sample video frames using related ideas, but this lesson works without a camera or permission dialog.'
    ],
    lines: [
      ['let picture;', 'Keep the source image available to both setup and draw.'],
      ['let tile = 16;', 'Sample source positions every sixteen pixels.'],
      ['async function setup() {', 'Open the loading and initialization instructions.'],
      ['  picture = await loadImage("sample.png");', 'Wait until the source image exists.'],
      ['  createCanvas(480, 360);', 'Make a destination canvas larger than the source.'],
      ['  pixelDensity(1);', 'Set the canvas density to one.'],
      ['  picture.pixelDensity(1);', 'Set the source image density to one for predictable RGBA indexing.'],
      ['  picture.loadPixels();', 'Read the source buffer once. We will not change its entries.'],
      ['  noStroke();', 'Draw colored blocks without borders.'],
      ['  describe("A horizontally mirrored block mosaic with a normal readable label at the top left.");', 'Describe both the transformed mosaic and its untransformed label.'],
      ['}', 'Close setup.'],
      ['function draw() {', 'Begin instructions that redraw the canvas repeatedly.'],
      ['  background(20);', 'Clear the previous frame to a dark gray.'],
      ['  push();', 'Save the current drawing coordinates and styles before changing them for this group.'],
      ['  translate(width, 0);', 'Move the drawing origin from the top-left corner to the top-right corner of the canvas.'],
      ['  scale(-1, 1);', 'Reverse the horizontal axis without changing the vertical axis. Positive x now travels left from the new origin.'],
      ['  for (let y = 0; y < picture.height; y += tile) {', 'Visit each sampled source row.'],
      ['    for (let x = 0; x < picture.width; x += tile) {', 'Visit each sampled source column.'],
      ['      let i = 4 * (x + y * picture.width);', 'Find the RGBA entries of this source pixel.'],
      ['      fill(picture.pixels[i], picture.pixels[i + 1], picture.pixels[i + 2]);', 'Set the block color using the sampled red, green, and blue values.'],
      ['      let blockWidth = tile / picture.width * width;', 'Convert one source tile width into a destination width.'],
      ['      let blockHeight = tile / picture.height * height;', 'Convert one source tile height into a destination height.'],
      ['      let destinationX = x / picture.width * width;', 'Calculate the normal proportional horizontal position in the drawing coordinate system.'],
      ['      rect(destinationX, y / picture.height * height, blockWidth, blockHeight);', 'Draw with normal mosaic coordinates; the active translated and reversed axes mirror the entire rectangle.'],
      ['    }', 'Close the source-column loop.'],
      ['  }', 'Close the source-row loop.'],
      ['  pop();', 'Restore the coordinates and styles saved by push so later drawing is not mirrored.'],
      ['  fill(0);', 'Choose a black fill in the restored drawing settings.'],
      ['  rect(8, 8, 145, 30);', 'Draw a small label background at the ordinary top-left position.'],
      ['  fill(255);', 'Choose white for readable label text.'],
      ['  text("Normal label", 16, 28);', 'Draw normal text after pop; it stays readable while the mosaic behind it is mirrored.'],
      ['}', 'Finish this frame; the next frame starts again from the unchanged source.']
    ],
    predict: 'A bright source detail near the left edge is drawn inside push and pop. The label is drawn after pop. Which will be mirrored? What would scale(-1, 1) do if translate(width, 0) were removed?',
    expect: 'The stable mosaic is flipped left to right, but the label reads normally at the top left. Source colors stay unchanged. Removing translate while keeping the negative scale would place the mosaic beyond the left edge; pop would still restore the label coordinates.',
    practice: [
      {task: 'Restore the unmirrored mosaic while leaving its source sampling and the label unchanged.', hint: 'The reversal comes from the pair translate(width, 0) and scale(-1, 1). Leave the normal rectangle coordinates alone.', solution: 'Remove or comment out both translate(width, 0); and scale(-1, 1);. Keep the matching push and pop. The mosaic now draws in ordinary coordinates. Removing only scale would leave the mosaic shifted off the right edge; removing only translate would leave it reflected off the left edge.'},
      {task: 'Flip vertically instead of horizontally. Sketch where the origin and positive y direction should go before changing the code.', hint: 'Move the origin to the bottom-left corner, then reverse y instead of x. Keep the source index and normal rectangle coordinates.', solution: 'Replace the transform lines with translate(0, height); and scale(1, -1);. The top row appears at the bottom, while left and right stay unchanged. Pop still restores the normal label. An alternative without transforms is rect(destinationX, height - y / picture.height * height - blockHeight, blockWidth, blockHeight);, but do not combine that arithmetic flip with the coordinate-system flip.'},
      {task: 'Make the horizontally mirrored mosaic look like a field of circular lenses rather than a tiled wall.', hint: 'Inside the transformed group, use ordinary block-center coordinates. The coordinate system already supplies the reflection.', solution: 'Restore translate(width, 0); and scale(-1, 1); if needed. Inside the loops replace rect with circle(destinationX + blockWidth / 2, y / picture.height * height + blockHeight / 2, blockWidth * 0.8);. Dark gaps appear around the circles. Keep the separate label-background rect after pop. Do not subtract these circle coordinates from width again, which would apply a second reflection.'}
    ],
    check: [
      {q: 'Why are translate(width, 0) and scale(-1, 1) used together?', a: 'Translation moves the origin to the right edge; negative horizontal scale makes positive x travel left from there, keeping the reflected drawing inside the canvas.'},
      {q: 'What does pop restore, and does mirroring edit the source pixel buffer?', a: 'Pop restores the coordinates and styles saved by push, so the later label is not mirrored. The transformation only changes drawing placement; source pixel entries are read without being overwritten.'}
    ],
    refs: ['https://p5js.org/reference/p5/push/', 'https://p5js.org/reference/p5/pop/', 'https://p5js.org/reference/p5/translate/', 'https://p5js.org/reference/p5/scale/', 'https://p5js.org/reference/p5/pixels/']
  },
  {
    id: '14-time', title: 'A real minute: turn elapsed time into a color journey', minutes: 35, stage: 'Media', diagram: 'timeline', preview: true,
    intro: [
      'A frame is one drawing, not a unit of clock time. A busy laptop may draw fewer frames each second than a fast laptop. Asking for sixty frames per second is a target, not a guarantee. For an artwork that changes over one minute, read elapsed milliseconds with millis rather than assuming that 3600 drawings always take sixty seconds.',
      'We save a starting reading on the first visible draw frame, after the image is ready. The pinned p5 v2 clock resets after setup, so recording this reading inside setup could accidentally add a second delay. Subtracting our first-frame reading from a later millis reading gives the elapsed time for the visible experience. Divide by 60000 for progress zero to one, and constrain the result so the transformation holds its ending.',
      'This sketch gradually inverts all three color channels. Lerp means find a position between two numbers: the original channel at progress zero, its inverted value at progress one, and a mixture between. Around halfway, the image loses contrast because many different colors meet near gray. That is a consequence of this particular color rule, not a loading failure. Click the canvas to replay; the source file is never changed.'
    ],
    lines: [
      ['let picture;', 'Remember the source image.'],
      ['let start;', 'Remember the clock reading at the beginning of the experience.'],
      ['async function setup() {', 'Open the initialization function with loading support.'],
      ['  picture = await loadImage("sample.png");', 'Wait for the image so loading time does not consume the artwork duration.'],
      ['  createCanvas(480, 360);', 'Make the destination canvas.'],
      ['  pixelDensity(1);', 'Use a simple canvas density.'],
      ['  picture.pixelDensity(1);', 'Use density one in the source image buffer as well.'],
      ['  picture.loadPixels();', 'Prepare unchanged source channel values for all later frames.'],
      ['  noStroke();', 'Draw mosaic tiles without outlines.'],
      ['  describe("A mosaic slowly changes from its original colors to inverted colors over one minute; click to replay.");', 'Describe the visual journey and its replay action.'],
      ['}', 'Close setup.'],
      ['function draw() {', 'Start a fresh animation frame.'],
      ['  if (start === undefined) {', 'Check whether this is the first visible drawing frame; start has not been assigned yet.'],
      ['    start = millis();', 'Start the experience after the v2 clock has reset at the end of setup.'],
      ['  }', 'Close the first-frame check. Keep the same starting reading on later frames.'],
      ['  let t = constrain((millis() - start) / 60000, 0, 1);', 'Compute elapsed progress from zero to one, stopping its growth after sixty seconds.'],
      ['  for (let y = 0; y < picture.height; y += 8) {', 'Visit source rows in eight-pixel steps.'],
      ['    for (let x = 0; x < picture.width; x += 8) {', 'Visit source columns in eight-pixel steps.'],
      ['      let i = 4 * (x + y * picture.width);', 'Find the sampled source pixel in the RGBA buffer.'],
      ['      let r = picture.pixels[i];', 'Read its original red channel.'],
      ['      let g = picture.pixels[i + 1];', 'Read its original green channel.'],
      ['      let b = picture.pixels[i + 2];', 'Read its original blue channel.'],
      ['      fill(lerp(r, 255 - r, t), lerp(g, 255 - g, t), lerp(b, 255 - b, t));', 'Blend each original channel toward its inverted value according to the progress fraction.'],
      ['      rect(x / picture.width * width, y / picture.height * height, 8 / picture.width * width, 8 / picture.height * height);', 'Draw the transformed color at the corresponding proportional canvas position.'],
      ['    }', 'Close the inner loop.'],
      ['  }', 'Close the outer loop.'],
      ['}', 'Finish the current drawing.'],
      ['function mousePressed() {', 'Open the instructions triggered when the canvas is clicked.'],
      ['  start = millis();', 'Replay by replacing the stored starting time with the current reading.'],
      ['}', 'Close the replay function.']
    ],
    predict: 'At thirty seconds t is one-half. What does lerp(20, 235, 0.5) return? Would lowering the actual drawing speed make the intended minute become two minutes?',
    expect: 'The image begins in its original colors, passes through a low-contrast gray middle, and finishes inverted after roughly sixty seconds of elapsed time. The example blend is 127.5. A slow frame rate reduces smoothness but does not redefine the elapsed-time calculation.',
    practice: [
      {task: 'Make a quick six-second rehearsal without changing any color calculations.', hint: 'The duration lives in the denominator of the progress calculation. Millis uses milliseconds.', solution: 'Change 60000 to 6000. The same sequence completes ten times faster. Restore 60000 for the assignment. Test the start, midpoint, and end instead of waiting a full minute after every small edit.'},
      {task: 'Make the transformation reach only halfway toward inversion after the full minute.', hint: 'Keep t as the clock progress. Feed a smaller interpolation amount into the color transformation.', solution: 'Replace each final t inside lerp with t * 0.5. The clock still completes a sixty-second journey, but the visual rule covers only half of its original range. This separates duration from strength, two useful independent artistic decisions.'},
      {task: 'Change the endpoint to pure red, while preserving the original colors at the beginning.', hint: 'The second argument of each lerp is its destination channel. Pure red in RGB is (255, 0, 0).', solution: 'Use fill(lerp(r, 255, t), lerp(g, 0, t), lerp(b, 0, t));. The source is gradually absorbed into red. The timing formula stays the same; only the destination color changes. Describe whether losing photographic detail helps your intended mood.'}
    ],
    check: [
      {q: 'Why record start on the first draw frame rather than inside setup?', a: 'Loading is complete and the p5 v2 clock has finished its setup reset, so the minute measures the visible experience without adding a second loading delay.'},
      {q: 'What does constrain do after sixty seconds?', a: 'It keeps progress at one, holding the final transformation instead of continuing beyond the intended endpoint.'}
    ],
    refs: ['https://p5js.org/reference/p5/millis/', 'https://p5js.org/reference/p5/frameRate/', 'https://p5js.org/reference/p5/lerp/', 'https://p5js.org/reference/p5/constrain/']
  },
  {
    id: '15-project', title: 'Your one-minute alternative reality', minutes: 50, stage: 'Media', diagram: 'timeline', preview: true,
    intro: [
      'Your final study combines an image, sampled pixel colors, elapsed time, and a deliberate change of visual rules. This complete starter makes an ordinary image become a drifting, inverted field of small tiles. It is an example to investigate and personalize. Your artwork should make a specific promise: what kind of reality is emerging, and which visible choices let someone feel that change?',
      'The canvas fills the available browser area. Positions are fractions of the source width and height, so the same source can drive a small preview or a large display. The source image itself stays unchanged. Red, green, and blue are read fresh for every block on every frame; new displayed colors are calculated from them. Tile displacement is calculated from the same stable source position and current time, rather than being added to yesterday\'s displaced position.',
      'Both seeds are explicitly zero. Zero is a valid seed, not an empty setting. RandomSeed controls the random sequence, while noiseSeed controls the smooth noise field; one does not replace the other. We make one random choice during setup and reuse it. With the same source, version, calls, and time, this supports a repeatable study. Camera footage or uncontrolled user timing would add other changing inputs. Click to replay the same journey. The sixty-second clock begins after loading.'
    ],
    lines: [
      ['let picture;', 'Remember the unchanged source image.'],
      ['let start;', 'Remember when the current one-minute run began.'],
      ['let offset;', 'Remember one precomputed random offset used to choose a region of the noise field.'],
      ['async function setup() {', 'Begin initialization with asynchronous loading available.'],
      ['  picture = await loadImage("sample.png");', 'Load the image before starting the experience clock.'],
      ['  createCanvas(windowWidth, windowHeight);', 'Make the canvas fill the available browser viewport. This does not request the browser fullscreen API.'],
      ['  pixelDensity(1);', 'Use density one on the destination canvas.'],
      ['  picture.pixelDensity(1);', 'Use density one on the source image so our index formula applies.'],
      ['  picture.loadPixels();', 'Load source channel values once; the drawing code only reads them.'],
      ['  randomSeed(0);', 'Set the random generator to the explicit seed zero.'],
      ['  noiseSeed(0);', 'Independently set the smooth noise generator to seed zero.'],
      ['  offset = random(1000);', 'Make one repeatable random choice now, instead of making fresh random choices every frame.'],
      ['  noStroke();', 'Remove outlines from our tiles.'],
      ['  describe("An image becomes an inverted, drifting tile landscape over sixty seconds. Click to replay.");', 'Explain the change and replay action in text.'],
      ['}', 'Close setup.'],
      ['function draw() {', 'Begin the drawing instructions for one animation frame.'],
      ['  if (start === undefined) {', 'Check whether the visible experience has started yet. Undefined means no start time is assigned.'],
      ['    start = millis();', 'Start on the first visible frame, after the p5 v2 setup clock reset.'],
      ['  }', 'Close the initialization check and preserve start for the rest of this run.'],
      ['  let t = constrain((millis() - start) / 60000, 0, 1);', 'Measure progress through exactly sixty thousand milliseconds and hold at the endpoint.'],
      ['  background(12, 14, 28);', 'Clear old drawings with a dark blue background, preventing accidental trails.'],
      ['  for (let y = 0; y < picture.height; y += 8) {', 'Move through the source image rows in eight-pixel steps.'],
      ['    for (let x = 0; x < picture.width; x += 8) {', 'Move across each source row in eight-pixel steps.'],
      ['      let i = 4 * (x + y * picture.width);', 'Calculate this source pixel\'s first RGBA array position using source width.'],
      ['      let r = picture.pixels[i];', 'Read the original red amount.'],
      ['      let g = picture.pixels[i + 1];', 'Read the original green amount.'],
      ['      let b = picture.pixels[i + 2];', 'Read the original blue amount.'],
      ['      let drift = (noise(x * 0.02, y * 0.02, offset + t * 2) - 0.5) * t;', 'Sample smooth noise, center it around zero, and increase the displacement strength as the minute progresses.'],
      ['      let px = x / picture.width * width + drift * width * 0.12;', 'Place the source column proportionally across the canvas, then add a gentle horizontal displacement.'],
      ['      let py = y / picture.height * height;', 'Place the source row at its proportional vertical position.'],
      ['      fill(lerp(r, 255 - r, t), lerp(g, 255 - g, t), lerp(b, 255 - b, t));', 'Gradually replace the original RGB channels with their inverted counterparts. Raw source pixels remain RGBA.'],
      ['      rect(px, py, 8 / picture.width * width, 8 / picture.height * height);', 'Draw this tile using a size scaled to the canvas. Some displaced edge tiles may leave the visible area.'],
      ['    }', 'Close the source-column loop body.'],
      ['  }', 'Close the source-row loop body.'],
      ['}', 'Finish the frame; later frames recompute from the same unchanged source.'],
      ['function mousePressed() {', 'Begin the click-to-replay instructions.'],
      ['  start = millis();', 'Restart the clock. The stored offset and source remain the same, so this replays the same design.'],
      ['}', 'Close replay.'],
      ['function windowResized() {', 'Begin instructions triggered when the browser viewport changes size.'],
      ['  resizeCanvas(windowWidth, windowHeight);', 'Resize the drawing area. Proportional placement adapts automatically; the elapsed clock continues.'],
      ['}', 'Close the resizing function.']
    ],
    predict: 'Which two visible changes grow with t? At the end of the minute, will the tiles keep drifting forever, or hold their final arrangement? Trace the variables rather than guessing from the title.',
    expect: 'The image begins in its source colors with an orderly layout. Over sixty seconds its colors invert and its blocks drift sideways. Dark gaps may emerge. After the minute, both color and displacement hold still because their time input is clamped. A click replays the study; resizing preserves proportional placement.',
    practice: [
      {task: 'Write a three-sentence creative brief before editing: the ordinary reality, the emerging reality, and the visual evidence of the change. Choose one color rule and one movement rule to express it.', hint: 'Use concrete observations such as warm colors becoming cold, a face breaking into tiles, or a landscape appearing to melt. Name the source and its permission or ownership.', solution: 'Example: My starting image is my own photograph of a familiar room. Over a minute the room becomes an unstable memory. Increasing sideways displacement and fading toward a limited blue palette make its boundaries feel uncertain. This is an example of a brief, not a required theme or a claim that the supplied image depicts a room.'},
      {task: 'Make a version with color change but no movement, then a version with movement but no color change. Compare them before choosing your final combination.', hint: 'The drift expression and the fill expression are independent. Preserve a working copy before each experiment.', solution: 'For the first version set drift = 0. For the second use fill(r, g, b); while restoring drift. Then compare at the beginning, middle, and endpoint. This isolates the effect of each rule. If changing two rules at once makes the result confusing, return to the version whose single visible behavior you can explain.'},
      {task: 'Rehearse in six seconds, restore sixty seconds, then document your finished minute with beginning, middle, and end observations plus a short explanation of your source-pixel rule.', hint: 'Test at t near zero, one-half, and one. Verify replay, resizing, file loading, and the actual final stopping behavior; do not use a frame count as a substitute for duration.', solution: 'Temporarily use 6000, inspect the three stages, click replay, and resize. Restore 60000 and verify a full run. Your explanation should identify where source colors are read, how the RGBA index is computed, which displayed values change with t, and why the original buffer is preserved. Check the live class assignment for its current submission details.'}
    ],
    check: [
      {q: 'Why does replay keep the same offset instead of calling random again?', a: 'The offset was precomputed during setup. Replacing only start replays the same visual rules and choices with a fresh clock.'},
      {q: 'Which part of this work makes it pixel-driven rather than an unrelated animation placed on top of a photo?', a: 'Every drawn tile gets its original RGB channels by indexing the source image pixel buffer; its displayed colors are calculated from those source values.'}
    ],
    refs: ['https://p5js.org/reference/p5/noiseSeed/', 'https://p5js.org/reference/p5/randomSeed/', 'https://p5js.org/reference/p5/noise/', 'https://p5js.org/reference/p5/millis/', 'https://p5js.org/reference/p5/windowResized/', 'https://github.com/processing/p5.js/blob/v2.3.4/package.json', 'https://github.com/ITPNYU/ICM-2026-Media/wiki/Homework-Mimi-07#week-9']
  }
];
