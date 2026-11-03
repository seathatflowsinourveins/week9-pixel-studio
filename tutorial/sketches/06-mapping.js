function setup() {
  createCanvas(320, 240);
}
function draw() {
  background(240);
  let diameter = map(mouseX, 0, width, 10, 120);
  diameter = constrain(diameter, 10, 120);
  fill(160, 90, 190);
  circle(width / 2, height / 2, diameter);
}
