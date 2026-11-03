let picture;
const tile = 16;
async function setup() {
  picture = await loadImage("sample.png");
  createCanvas(640, 480);
  pixelDensity(1);
  picture.pixelDensity(1);
  picture.loadPixels();
  noStroke();
  for (let y = 0; y < picture.height; y += tile) {
    for (let x = 0; x < picture.width; x += tile) {
      const i = 4 * (x + y * picture.width);
      const r = picture.pixels[i];
      const g = picture.pixels[i + 1];
      const b = picture.pixels[i + 2];
      fill(r, g, b);
      rect(x / picture.width * width, y / picture.height * height, tile / picture.width * width, tile / picture.height * height);
    }
  }
  describe("A static block mosaic built from sampled source image colors.");
}
