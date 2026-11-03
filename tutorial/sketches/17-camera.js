let video;
function setup() {
  createCanvas(480, 360);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  noStroke();
  describe("A live camera image rendered as a coarse color mosaic after permission and frame readiness.");
}
function draw() {
  background(25);
  if (video.width <= 0 || video.elt.readyState < 2) {
    fill(255);
    text("Waiting for camera permission or a frame...", 15, 30);
    return;
  }
  video.loadPixels();
  if (video.pixels.length === 0) {
    return;
  }
  for (let y = 0; y < video.height; y += 16) {
    for (let x = 0; x < video.width; x += 16) {
      let i = 4 * (x + y * video.width);
      fill(video.pixels[i], video.pixels[i + 1], video.pixels[i + 2]);
      rect(x / video.width * width, y / video.height * height, 16 / video.width * width, 16 / video.height * height);
    }
  }
}
