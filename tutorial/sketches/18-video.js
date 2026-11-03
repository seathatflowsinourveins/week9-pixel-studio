let clip;
let ready = false;
let playButton;
function setup() {
  createCanvas(480, 360);
  pixelDensity(1);
  clip = createVideo("clip.mp4", videoReady);
  clip.hide();
  clip.volume(0);
  playButton = createButton("Play video when ready");
  playButton.mousePressed(startVideo);
  describe("An uploaded silent video appears on the canvas after loading and a Play video button click.");
}
function videoReady() {
  ready = true;
}
function startVideo() {
  if (ready) {
    clip.loop();
  }
}
function draw() {
  background(25);
  if (ready && clip.width > 0 && clip.elt.readyState >= 2) {
    image(clip, 0, 0, width, height);
  } else {
    fill(255);
    text("Upload clip.mp4, wait, then press Play video.", 15, 30);
  }
}
