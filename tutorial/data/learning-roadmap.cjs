'use strict';

module.exports = [
  {
    number: 1, tag: 'Image', learnFirst: ['00-start', '01-language'],
    play: {
      try: 'Show the picture at 320 × 240, then at 640 × 480.',
      notice: 'The canvas width and height double. The source picture stays 320 × 240.',
      control: 'larger-size'
    },
    build: 'Load one picture and draw it on a canvas.',
    assignment: 'Choose a source image with your partner and name what you want viewers to notice.',
    proof: 'Run your saved sketch and point out the difference between the image size and the canvas size.'
  },
  {
    number: 2, tag: 'Mosaic', learnFirst: ['09-color', '07-loops'],
    play: {
      try: 'Set the sampling step to 16, then 8. Look at the same edge both times.',
      notice: 'At 8, each block is smaller. More blocks trace the same edge.',
      control: 'tile'
    },
    build: 'Visit the picture row by row and draw a block in each sampled color.',
    assignment: 'Try two block sizes to see which details of your image become hard to recognize.',
    proof: 'Save your chosen block size and describe one detail it reveals or hides.'
  },
  {
    number: 3, tag: 'RGBA', learnFirst: ['08-collections', '12-rgba'],
    play: {
      try: 'Click near the middle of the source picture. Press the right arrow to select the next block.',
      notice: 'The outline moves right. The four addresses below now point to the red, green, blue and alpha values for that block.',
      control: 'flow-source'
    },
    build: 'Find a pixel’s four color entries and draw a block using its red, green and blue.',
    assignment: 'Trace one sampled color so you know exactly which numbers your rule can change.',
    proof: 'For one pixel, show its four addresses and the color values stored there.'
  },
  {
    number: 4, tag: 'Focus', learnFirst: ['04-decisions', '06-mapping'],
    play: {
      try: 'Choose “Keep a region colored.” Set “Transformation strength” to 100%. Move “Width that keeps its color” from 25% to 75%.',
      notice: 'The edge of the colored region moves right. More blocks on the left keep their original colors.',
      control: 'color-rule'
    },
    build: 'Keep color on the left and turn blocks beyond a chosen boundary toward gray.',
    assignment: 'Use color to guide attention toward one part of the picture.',
    proof: 'Point to a block on each side and explain why their colors follow different rules.'
  },
  {
    number: 5, tag: 'Minute', learnFirst: ['03-animation', '14-time'],
    play: {
      try: 'Move Teaching time to 0, 30 and 60 seconds. Then choose “Play actual 60 seconds” to watch the full minute.',
      notice: 'Teaching time holds each frame still. During the real minute, the clock advances on its own.',
      control: 'teaching-time'
    },
    build: 'Use a clock to change the colors over one minute, then hold the ending.',
    assignment: 'Shape the beginning, middle and end of a silent one-minute piece.',
    proof: 'Watch one full minute and note what you see at the start, halfway through and at the end.'
  },
  {
    number: 6, tag: 'Present', learnFirst: ['02-coordinates', '05-functions'],
    play: {
      try: 'Choose Wide preview, then Narrow preview. Choose “Replay from the start.”',
      notice: 'The canvas fits the narrower space. Replay sends the clock back to the start.',
      control: 'narrow-preview'
    },
    build: 'Click to replay the minute and resize the canvas to fit the window.',
    assignment: 'Use the fullscreen link to rehearse the same silent piece twice at presentation size.',
    proof: 'Open the shared link, resize the window and compare the two runs at the same moment.'
  },
  {
    number: 7, tag: 'Finish', learnFirst: ['09-color', '19-debug'],
    play: {
      try: 'Compare A (16) and B (8), both paused at 30 seconds. Save your own versions and watch each full minute for your class notes.',
      notice: 'B shows smaller blocks than A. The clock stays at 30 seconds, so you can compare the same moment.',
      control: 'compare-a'
    },
    build: 'Use the same program as Stage 6 while you test and document it together.',
    assignment: 'With your partner, save at least three iterations and watch the piece for a full minute at least three times.',
    proof: 'Share your process and links on the blog and enter your changes and timed observations in the class spreadsheet.'
  }
];
