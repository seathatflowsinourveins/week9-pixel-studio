function setup() {
  createCanvas(320, 240);
  background(240);
  drawDot(80, 120, 40);
  drawDot(220, 120, 80);
}
function drawDot(x, y, diameter) {
  fill(70, 145, 125);
  circle(x, y, diameter);
}
