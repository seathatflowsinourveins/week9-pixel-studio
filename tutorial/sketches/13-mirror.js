let picture;
let tile = 16;
async function setup() {
  picture = await loadImage("sample.png");
  createCanvas(480, 360);
  pixelDensity(1);
  picture.pixelDensity(1);
  picture.loadPixels();
  noStroke();
  describe("A horizontally mirrored block mosaic with a normal readable label at the top left.");
}
function draw() {
  background(20);
  push();
  translate(width, 0);
  scale(-1, 1);
  for (let y = 0; y < picture.height; y += tile) {
    for (let x = 0; x < picture.width; x += tile) {
      let i = 4 * (x + y * picture.width);
      fill(picture.pixels[i], picture.pixels[i + 1], picture.pixels[i + 2]);
      let blockWidth = tile / picture.width * width;
      let blockHeight = tile / picture.height * height;
      let destinationX = x / picture.width * width;
      rect(destinationX, y / picture.height * height, blockWidth, blockHeight);
    }
  }
  pop();
  fill(0);
  rect(8, 8, 145, 30);
  fill(255);
  text("Normal label", 16, 28);
}
