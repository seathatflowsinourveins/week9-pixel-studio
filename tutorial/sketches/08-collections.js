const spots = [
  { x: 70, y: 120, size: 30 },
  { x: 160, y: 120, size: 60 },
  { x: 250, y: 120, size: 90 }
];
function setup() {
  createCanvas(320, 240);
  background(240);
  fill(210, 110, 50);
  for (let i = 0; i < spots.length; i++) {
    const spot = spots[i];
    circle(spot.x, spot.y, spot.size);
  }
}
