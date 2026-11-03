let picture;
let start;
async function setup() {
  picture = await loadImage("sample.png");
  createCanvas(480, 360);
  pixelDensity(1);
  picture.pixelDensity(1);
  picture.loadPixels();
  noStroke();
  describe("A mosaic slowly changes from its original colors to inverted colors over one minute; click to replay.");
}
function draw() {
  if (start === undefined) {
    start = millis();
  }
  let t = constrain((millis() - start) / 60000, 0, 1);
  for (let y = 0; y < picture.height; y += 8) {
    for (let x = 0; x < picture.width; x += 8) {
      let i = 4 * (x + y * picture.width);
      let r = picture.pixels[i];
      let g = picture.pixels[i + 1];
      let b = picture.pixels[i + 2];
      fill(lerp(r, 255 - r, t), lerp(g, 255 - g, t), lerp(b, 255 - b, t));
      rect(x / picture.width * width, y / picture.height * height, 8 / picture.width * width, 8 / picture.height * height);
    }
  }
}
function mousePressed() {
  start = millis();
}
