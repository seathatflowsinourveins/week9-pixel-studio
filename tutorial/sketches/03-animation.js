let x = 0;
function setup() {
  createCanvas(320, 240);
}
function draw() {
  background(240);
  fill(220, 80, 90);
  circle(x, height / 2, 40);
  x = x + 2;
  if (x > width) {
    x = 0;
  }
}
