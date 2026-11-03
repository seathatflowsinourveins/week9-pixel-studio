let picture;
let start;
let offset;
async function setup() {
  picture = await loadImage("sample.png");
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  picture.pixelDensity(1);
  picture.loadPixels();
  randomSeed(0);
  noiseSeed(0);
  offset = random(1000);
  noStroke();
  describe("An image becomes an inverted, drifting tile landscape over sixty seconds. Click to replay.");
}
function draw() {
  if (start === undefined) {
    start = millis();
  }
  let t = constrain((millis() - start) / 60000, 0, 1);
  background(12, 14, 28);
  for (let y = 0; y < picture.height; y += 8) {
    for (let x = 0; x < picture.width; x += 8) {
      let i = 4 * (x + y * picture.width);
      let r = picture.pixels[i];
      let g = picture.pixels[i + 1];
      let b = picture.pixels[i + 2];
      let drift = (noise(x * 0.02, y * 0.02, offset + t * 2) - 0.5) * t;
      let px = x / picture.width * width + drift * width * 0.12;
      let py = y / picture.height * height;
      fill(lerp(r, 255 - r, t), lerp(g, 255 - g, t), lerp(b, 255 - b, t));
      rect(px, py, 8 / picture.width * width, 8 / picture.height * height);
    }
  }
}
function mousePressed() {
  start = millis();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
