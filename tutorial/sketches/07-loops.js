function setup() {
  createCanvas(320, 240);
  background(240);
  noStroke();
  fill(45, 130, 150);
  for (let y = 20; y < height; y += 40) {
    for (let x = 20; x < width; x += 40) {
      circle(x, y, 18);
    }
  }
}
