var circle;
var food = [];
var slowScale = 1;

function setup() {
  createCanvas(600, 600);
  circle = new Circle(0, 0, 64);

  //create little dots to eat
  for (var i = 0; i < 100; i++) {
    food[i] = new Circle(random(-width*2,width*2), random(-height*2, height*2), 16);
  }
}
//maybe this will do it


function draw() {
  background(0);
  //translate the position to the center
  translate(width/2, height/2);
  slowScale = lerp(slowScale, (64 / circle.r), 0.1);

  //scale the world as your character grows
  scale(slowScale);

  //translate the position of the character
  translate(-circle.pos.x, -circle.pos.y);

  //show initial circle and update position when moved
  circle.show();
  circle.update();

  //show all little dots to eat
  for (var i = food.length - 1; i >= 0; i--) {
    if (circle.eat(food[i])) {
      food.splice(i, 1);
    }
    else {
      food[i].show();
    }
  }
}

//class for any circle on screen (Player Circles and food)
class Circle {
  constructor(x, y, r) {
      this.pos = createVector(x, y);
      this.r = r;
  }
  
  update() {
    var mouse = createVector(mouseX - width/2, mouseY - height/2);
    mouse.setMag(3);
    this.pos.add(mouse);
  }

  eat(food) {
    var dist = p5.Vector.dist(this.pos, food.pos);
    
    //if it goes half way into the other blob then eat it and add areas
    if (dist < this.r + food.r/2) {
      var newArea = PI * food.r * food.r  + PI * this.r * this.r;
      this.r = sqrt(newArea / PI);
      return true;
    }
    return false;
  }

  shoot() {

  }

  show() {
      fill(255);
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}

class Bullet {
  constructor(x, y, d) {
    this.pos = createVector(x, y);
    this.r = 8;
    this.d = d;
  }

  hit(enemy) {
    var dist = p5.Vector.dist(this.pos, food.pos);
    
    //if it goes half way into the other blob then eat it and add areas
    if (dist < this.r + enemy.r) {
      //enemy health is deducted by d (damage)
      return true;
    }
    return false;
  }

  show() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}