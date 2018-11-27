var circle;

function setup() {
  createCanvas(600, 600);
  circle = new Circle();
}

function draw() {
  background(0);
  circle.show();
}


class Circle {
  constructor() {
      this.pos = createVector(width/2, height/2);
      this.r = 50;
  }
  
  show() {
      fill(200);
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}