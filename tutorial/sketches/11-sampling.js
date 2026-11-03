let picture;
let tile = 16;
async function setup() {
  picture = await loadImage("sample.png");
  createCanvas(480, 360);
  pixelDensity(1);
  noStroke();
  for (let y = 0; y < picture.height; y += tile) {
    for (let x = 0; x < picture.width; x += tile) {
      let shade = picture.get(x, y);
      fill(shade[0], shade[1], shade[2], shade[3]);
      rect(x / picture.width * width, y / picture.height * height, tile / picture.width * width, tile / picture.height * height);
    }
  }
  describe("A block mosaic made from regularly sampled colors in the sample image.");
}
