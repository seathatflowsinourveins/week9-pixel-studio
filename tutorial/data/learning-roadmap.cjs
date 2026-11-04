'use strict';

module.exports = [
  {
    number: 1, tag: 'Image', learnFirst: ['00-start', '01-language'],
    build: 'Load one picture and draw it on a canvas.',
    assignment: 'Choose a source image with your partner and name what you want viewers to notice.',
    proof: 'Run your saved sketch and point out the difference between the image size and the canvas size.'
  },
  {
    number: 2, tag: 'Mosaic', learnFirst: ['09-color', '07-loops'],
    build: 'Visit the picture row by row and draw a block in each sampled color.',
    assignment: 'Try two block sizes to see which details of your image become hard to recognize.',
    proof: 'Save your chosen block size and describe one detail it reveals or hides.'
  },
  {
    number: 3, tag: 'RGBA', learnFirst: ['08-collections', '12-rgba'],
    build: 'Find a pixel’s four color entries and draw a block using its red, green and blue.',
    assignment: 'Trace one sampled color so you know exactly which numbers your rule can change.',
    proof: 'For one pixel, show its four addresses and the color values stored there.'
  },
  {
    number: 4, tag: 'Focus', learnFirst: ['04-decisions', '06-mapping'],
    build: 'Keep color on the left and turn blocks beyond a chosen boundary toward gray.',
    assignment: 'Use color to guide attention toward one part of the picture.',
    proof: 'Point to a block on each side and explain why their colors follow different rules.'
  },
  {
    number: 5, tag: 'Minute', learnFirst: ['03-animation', '14-time'],
    build: 'Use a clock to change the colors over one minute, then hold the ending.',
    assignment: 'Shape the beginning, middle and end of a silent one-minute piece.',
    proof: 'Watch one full minute and note what you see at the start, halfway through and at the end.'
  },
  {
    number: 6, tag: 'Present', learnFirst: ['02-coordinates', '05-functions'],
    build: 'Click to replay the minute and resize the canvas to fit the window.',
    assignment: 'Use the fullscreen link to rehearse the same silent piece twice at presentation size.',
    proof: 'Open the shared link, resize the window and compare the two runs at the same moment.'
  },
  {
    number: 7, tag: 'Finish', learnFirst: ['09-color', '19-debug'],
    build: 'Use the same program as Stage 6 while you test and document it together.',
    assignment: 'With your partner, save at least three iterations and watch the piece for a full minute at least three times.',
    proof: 'Share your process and links on the blog and enter your changes and timed observations in the class spreadsheet.'
  }
];
