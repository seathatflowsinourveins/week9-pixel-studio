let original;
async function setup() {
  original = await loadImage("sample.png");
  createCanvas(640, 240);
  pixelDensity(1);
  let changed = original.get();
  changed.pixelDensity(1);
  changed.loadPixels();
  for (let y = 0; y < changed.height; y += 1) {
    for (let x = 0; x < changed.width; x += 1) {
      let i = 4 * (x + y * changed.width);
      changed.pixels[i + 1] = 255 - changed.pixels[i + 1];
    }
  }
  changed.updatePixels();
  image(original, 0, 0, 320, 240);
  image(changed, 320, 0, 320, 240);
  describe("Original image on the left; a copy with its green channel inverted on the right.");
}
