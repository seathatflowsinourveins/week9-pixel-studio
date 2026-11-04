(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.groupLessons = factory();
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';

  const source = {
    url: 'https://editor.p5js.org/samuelgoldman/sketches/Q1TY34oqc',
    author: 'samuelgoldman',
    title: 'Week 008: Partner Assignment copy',
    checked: '2026-11-04',
    p5: '2.3.4'
  };

  function step(line, section, visual, title, meaning, detail, action) {
    return {line, section, title, meaning, detail, try: action, visual};
  }

  const steps = [
    step(1, 'Prepare', 'load', 'Name the image', 'img will hold the picture.',
      'let gives the name a place in the sketch. Its value is undefined until setup assigns the image on line 13.',
      'Find img again on line 13.'),
    step(2, 'Prepare', 'grid', 'Name the spacing', 'sz will hold the grid spacing.',
      'No number is assigned here, so sz is undefined for now. Later the sketch gives it the distance between two samples.',
      'Find the first value for sz on line 24.'),
    step(3, 'Prepare', 'time', 'Name the start time', 'startTime will hold a clock reading.',
      'Its value is undefined until setup reads the clock. Later, draw subtracts that saved number to work out progress.',
      'Find where startTime gets a number on line 15.'),
    step(5, 'Prepare', 'load', 'Set up once', 'Prepare the sketch before drawing starts.',
      'p5 runs setup once. The word async lets this function wait for the picture on line 10.',
      'Find the word await on line 10.'),
    step(6, 'Prepare', 'load', 'Make the canvas', 'Make a 400 × 400 drawing surface.',
      'Both width and height are 400 pixels. The top-left corner is (0, 0).',
      'Open the original and find the square canvas.'),
    step(7, 'Prepare', 'circle', 'Remove outlines', 'Draw filled circles without an outline.',
      'noStroke turns off the pen line around shapes. The circles can still have a fill color.',
      'Look at a circle’s edge in the preview.'),
    step(8, 'Prepare', 'hue', 'Choose HSB', 'Paint using hue, saturation and brightness.',
      'Hue uses a 360-degree color wheel. Saturation and brightness each go from 0 to 100. The image still supplies red, green, blue and alpha (RGBA) numbers.',
      'Find the three drawing-color numbers on line 38.'),
    step(10, 'Prepare', 'load', 'Wait for the picture', 'Load Samuel’s image before using it.',
      'await waits for COLORFUL.avif to finish loading. Only then does loadedImage refer to the picture that the next line resizes.',
      'Open the original and find COLORFUL.avif in its files.'),
    step(11, 'Prepare', 'load', 'Resize the image', 'Fit the picture to the 400 × 400 canvas.',
      'Resizing changes the image used for sampling. Now an image coordinate and a canvas coordinate use the same scale.',
      'Compare the two canvas dimensions on line 6.'),
    step(12, 'Prepare', 'pixels', 'Read the pixels', 'Make the image’s color numbers available.',
      'loadPixels fills a list with four numbers per pixel. Their order is red, green, blue, then alpha.',
      'Select one source pixel in the guide.'),
    step(13, 'Prepare', 'load', 'Keep the image', 'Give the prepared image to img.',
      'loadedImage belongs to setup. Assigning the same image to img lets draw read its pixels later.',
      'Find img in the address calculation on line 28.'),
    step(15, 'Prepare', 'time', 'Save the clock reading', 'Store the millisecond reading after loading the picture.',
      'p5 2.3.4 resets its clock before draw, but startTime keeps the earlier reading. The clock note explains what happens on the first frame.',
      'Move the guide timeline to 0 seconds.'),
    step(16, 'Prepare', 'load', 'Finish setup', 'The closing brace ends the preparation.',
      'This brace pairs with the opening brace on line 5. The picture and the start time are ready for draw.',
      'Find the opening brace on line 5.'),

    step(18, 'Time', 'time', 'Start each frame', 'p5 runs draw again for each frame.',
      'Each frame reads the clock again and paints the background and circles. Setup has already run.',
      'Move the timeline ahead by one second.'),
    step(19, 'Time', 'time', 'Measure one minute', 'Turn elapsed time into a fraction.',
      'Subtract the saved reading from the current clock and divide by 60,000 milliseconds. min sets only an upper limit of 1, so the first result can be negative. The guide timeline shows 0 to 60 seconds.',
      'Move the timeline to 30 seconds.'),
    step(21, 'Time', 'hue', 'Move the background hue', 'Turn progress into a hue from 30 to 220.',
      'map pairs change = 0 with hue 30 and change = 1 with hue 220. At 0.5, colorValue is 125.',
      'Move the timeline to 30 seconds to see hue 125.'),
    step(22, 'Time', 'hue', 'Paint the background', 'Cover the previous frame with one color.',
      'colorValue supplies the hue. Saturation and brightness are both 100, so the background is fully saturated and bright.',
      'Move the timeline to 60 seconds and look at the background.'),

    step(24, 'Grid', 'grid', 'Widen the spacing', 'Space the samples farther apart over time.',
      'map turns progress into a spacing from 5 to 25 pixels. floor rounds down to a whole number, so 5.9 becomes 5 and halfway gives 15.',
      'Move the timeline to 30 seconds to see a 15-pixel step.'),
    step(26, 'Grid', 'grid', 'Choose a column', 'The outer loop moves x to the right.',
      'Start at x = 0. After the whole column is done, add sz and continue while x is less than the canvas width.',
      'At 0 seconds, find the column at x = 5.'),
    step(27, 'Grid', 'grid', 'Go down the column', 'The inner loop moves y downward.',
      'For this one x, y starts at 0 and advances by sz until it reaches or passes the canvas height. The next column starts again at y = 0.',
      'At 0 seconds, follow the first column from y = 0 to y = 5.'),

    step(28, 'Color', 'pixels', 'Find the address', 'i tells where this pixel’s numbers start.',
      'Count past y rows of image width, then across by x pixels. Multiply by four to get the first address in the RGBA list. The color value is read on the next line.',
      'Select a different source pixel and check its address.'),
    step(29, 'Color', 'pixels', 'Read red', 'Read the red number at address i.',
      'The first slot for this pixel holds its red amount, from 0 to 255. r stores that amount for this one circle.',
      'Pick a source pixel and read its red number.'),
    step(30, 'Color', 'pixels', 'Read green', 'Read green from the next slot.',
      'i + 1 is one slot after red. It gives the green amount for the same pixel.',
      'Read the green number for the same source pixel.'),
    step(31, 'Color', 'pixels', 'Read blue', 'Read blue from the third slot.',
      'i + 2 gives the blue amount. The fourth slot holds alpha, or opacity. This sketch skips alpha when calculating the circle.',
      'Read the blue number for the same source pixel.'),
    step(33, 'Color', 'brightness', 'Average the channels', 'Give red, green and blue equal weight.',
      'Add the three amounts and divide by 3 to get bright. This simple average can give red and green the same score even though they look different to the eye.',
      'Select a source pixel and compare its three numbers with their average.'),
    step(34, 'Color', 'brightness', 'Scale the circle size', 'Map the average to a size called d.',
      'As bright goes from 0 to 255, d goes from 0 to the grid spacing sz. Here d is half the actual circle diameter because line 39 doubles it.',
      'Select a brighter source pixel and check d.'),
    step(36, 'Color', 'hue', 'Turn the circle hue', 'Move around the wheel from the background hue.',
      'When change is 0, adding 180° gives the opposite hue. As change increases, bright times change shifts brighter samples farther around the wheel. The remainder after division by 360 wraps the hue, so 405° becomes 45°.',
      'Move the timeline to 0 seconds and compare the two hues.'),

    step(38, 'Draw', 'hue', 'Set the circle fill', 'Choose the color for the next circle.',
      'Use the circle hue and full saturation. map turns a source average of 0–255 into a fill brightness of 50–100.',
      'Select a darker sample and check the fill brightness.'),
    step(39, 'Draw', 'circle', 'Draw the circle', 'Put a circle in the sampled grid cell.',
      'The cell starts at (x, y). Adding half the spacing centers the circle, and doubling d gives both its width and height. Bright circles can be wider than the spacing and overlap nearby circles.',
      'Select a bright source pixel and compare circle diameter with grid spacing.'),
    step(40, 'Draw', 'grid', 'Finish one grid cell', 'Close the inner y loop’s drawing instructions.',
      'This brace matches the loop on line 27. If another y fits, the sketch moves down in the same column.',
      'Find the matching opening brace on line 27.'),
    step(41, 'Draw', 'grid', 'Finish one column', 'Close the outer x loop’s instructions.',
      'This brace matches the loop on line 26. If another x fits, the sketch starts that column at the top.',
      'Find the matching opening brace on line 26.'),
    step(42, 'Draw', 'time', 'Finish one frame', 'Close draw so the next frame can begin.',
      'This brace matches line 18. Once change reaches 1, each new frame draws with the same final values.',
      'Move the timeline to 60 seconds and look at the final frame.')
  ];

  return {steps, source};
});
