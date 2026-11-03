function setup() {
  createCanvas(320, 240);
}
function draw() {
  background(240);
  if (mouseIsPressed) {
    fill(240, 90, 60);
  } else {
    fill(40, 130, 190);
  }
  circle(mouseX, mouseY, 50);
}
