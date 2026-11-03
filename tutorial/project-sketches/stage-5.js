let picture;
const tile = 16;
const strength = 1;
const focus = 0.4;
let start;
async function setup() {
  picture = await loadImage("sample.png");
  createCanvas(640, 480);
  pixelDensity(1);
  picture.pixelDensity(1);
  picture.loadPixels();
  noStroke();
  describe("Original colors remain in a left-hand region while the rest becomes gray. The change unfolds over sixty elapsed seconds and holds its ending.");
}
function draw() {
  if (start === undefined) {
    start = millis();
  }
  const t = constrain((millis() - start) / 60000, 0, 1);
  paintTiles(t * strength);
}
function paintTiles(amount) {
  background(12, 18, 28);
  for (let y = 0; y < picture.height; y += tile) {
    for (let x = 0; x < picture.width; x += tile) {
      const i = 4 * (x + y * picture.width);
      const r = picture.pixels[i];
      const g = picture.pixels[i + 1];
      const b = picture.pixels[i + 2];
      const gray = (r + g + b) / 3;
      let targetR = r;
      let targetG = g;
      let targetB = b;
      if (x / picture.width >= focus) {
        targetR = gray;
        targetG = gray;
        targetB = gray;
      }
      fill(lerp(r, targetR, amount), lerp(g, targetG, amount), lerp(b, targetB, amount));
      rect(x / picture.width * width, y / picture.height * height, tile / picture.width * width, tile / picture.height * height);
    }
  }
}
