let picture;
async function setup() {
  picture = await loadImage("sample.png");
  createCanvas(640, 480);
  pixelDensity(1);
  image(picture, 0, 0, width, height);
  describe("The original source image displayed across a larger canvas.");
}
