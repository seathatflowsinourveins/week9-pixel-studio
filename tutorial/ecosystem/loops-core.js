(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.loopLesson = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  function isGrid(mode) { return mode === 'grid'; }

  function build(mode = 'row') {
    const grid = isGrid(mode);
    const lines = [
      ['async function setup() {', 'Run setup once; async lets us wait for the image.'],
      ['  let picture = await loadImage("sample.png");', 'Wait until the sample image has loaded.'],
      ['  createCanvas(640, 480);', 'Make a canvas 640 pixels wide and 480 pixels tall.'],
      ['  pixelDensity(1);', 'Use density 1 for the canvas pixel buffer.'],
      ['  background(18, 24, 32);', 'Paint an opaque dark background.'],
      ['  image(picture, 50, 30, width, height);', 'Draw the image from (50, 30), stretched to the canvas size.'],
      ['  let pixelColor = picture.get(160, 120);', 'Read one color from the original image at (160, 120).'],
      ['  noStroke();', 'Remove outlines from the squares.'],
      ['  fill(pixelColor);', 'Use the sampled color inside every square.']
    ];
    if (grid) {
      lines.push(
        ['  for (let y = 40; y < 400; y = y + 100) {', 'Start y at 40; repeat rows while y is below 400.'],
        ['    for (let x = 40; x < 500; x = x + 100) {', 'Restart x at 40 for each row; repeat while x is below 500.'],
        ['      rect(x, y, 80, 80);', 'Draw an 80-pixel square at the current x and y.'],
        ['    }', 'End this square; return to the inner loop update.'],
        ['  }', 'End this row; return to the outer loop update.']
      );
    } else {
      lines.push(
        ['  for (let x = 40; x < 500; x = x + 100) {', 'Start x at 40; repeat while x is below 500.'],
        ['    rect(x, 40, 80, 80);', 'Draw an 80-pixel square at x, always 40 pixels down.'],
        ['  }', 'End this square; return to the loop update.']
      );
    }
    lines.push(
      [grid
        ? '  describe("Twenty sampled-color squares in four rows of five over an image.");'
        : '  describe("Five sampled-color squares in one row over an image.");',
      'Describe the finished picture for people using screen readers.'],
      ['}', 'Finish setup.']
    );
    return { code: lines.map(([source]) => source).join('\n'), lines };
  }

  function trace(mode = 'row') {
    const grid = isGrid(mode), built = build(mode), total = grid ? 20 : 5;
    const frames = [];
    let drawn = 0;
    function step(line, focus, meaning, x, y, phase) {
      frames.push({ code: built.lines[line][0], focus, meaning, line, x, y, drawn, total, phase });
    }
    function row(y) {
      const header = grid ? 10 : 9, rectangle = grid ? 11 : 10;
      step(header, 'let x = 40', grid ? 'Start this row: reset x to 40.' : 'Start x at 40.', 40, y, 'start');
      let x = 40;
      while (true) {
        const allowed = x < 500;
        step(header, 'x < 500', `${x} < 500 is ${allowed}. ${allowed ? 'Draw the next square.' : 'This row is finished.'}`, x, y, 'check');
        if (!allowed) break;
        drawn += 1;
        step(rectangle, null, `Draw square ${drawn} at (${x}, ${y}).`, x, y, 'draw');
        x += 100;
        step(header, 'x = x + 100', `Add 100 to x. It is now ${x}.`, x, y, 'update');
      }
    }
    if (grid) {
      let y = 40;
      step(9, 'let y = 40', 'Start the first row at y = 40.', null, y, 'start');
      while (true) {
        const allowed = y < 400;
        step(9, 'y < 400', `${y} < 400 is ${allowed}. ${allowed ? 'Start a row.' : 'All rows are finished.'}`, null, y, 'check');
        if (!allowed) break;
        row(y);
        y += 100;
        step(9, 'y = y + 100', `Add 100 to y. It is now ${y}.`, null, y, 'update');
      }
    } else row(40);
    step(built.lines.length - 2, null, `${total} squares are finished. Describe the picture.`, null, null, 'finish');
    return frames;
  }

  function preview(mode = 'row', count) {
    const grid = isGrid(mode), total = grid ? 20 : 5;
    const limit = typeof count === 'number' && Number.isFinite(count)
      ? Math.max(0, Math.min(total, Math.floor(count))) : 0;
    const lines = build(mode).lines.map(([source]) => source);
    lines.splice(9, 0, '  let revealed = 0;');
    const rectangle = grid ? 12 : 11;
    const indent = grid ? '      ' : '    ';
    lines[rectangle] = `${indent}if (revealed < ${limit}) ${lines[rectangle].trim()}`;
    lines.splice(rectangle + 1, 0, `${indent}revealed = revealed + 1;`);
    const description = grid ? 'four rows of five' : 'one row of five';
    lines[lines.length - 2] = `  describe("Loop lesson preview: ${limit} of ${total} squares revealed in ${description} over an image.");`;
    return lines.join('\n');
  }

  return { build, trace, preview };
});
