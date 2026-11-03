let scene;
let column = 0;
function setup() {
  createCanvas(480, 240);
  pixelDensity(1);
  scene = createGraphics(320, 240);
  scene.pixelDensity(1);
  scene.noStroke();
  background(20);
  describe("A slit scan records successive vertical slices of a synthetic moving circle; left to right represents successive sampled moments. Click to clear.");
}
function draw() {
  let seconds = millis() / 1000;
  scene.background(30, 50, 90);
  scene.fill(255, 170, 60);
  scene.circle(160, 120 + sin(seconds * 2) * 75, 90);
  copy(scene, 160, 0, 1, 240, column, 0, 1, 240);
  column = column + 1;
  if (column >= width) {
    column = 0;
  }
}
function mousePressed() {
  background(20);
  column = 0;
}
