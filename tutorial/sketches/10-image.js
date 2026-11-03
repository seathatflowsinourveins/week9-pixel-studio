let picture;
async function setup() {
  picture = await loadImage("sample.png");
  createCanvas(480, 360);
  pixelDensity(1);
  background(230);
  image(picture, 0, 0, width, height);
  describe("The sample image enlarged to fill a rectangular canvas.");
}
