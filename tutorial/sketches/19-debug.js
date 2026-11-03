let x = 60;
function setup() {
  createCanvas(480, 240);
  pixelDensity(1);
  describe("A blue circle moves right and resets to the left when its center reaches the right edge.");
}
function draw() {
  background(240);
  fill(30, 100, 230);
  circle(x, 120, 50);
  x = x + 3;
  if (x === width) {
    x = 0;
  }
}
