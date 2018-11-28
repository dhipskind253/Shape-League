var circle;
var food = [];
var slowScale = 1;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  circle = new Circle(0, 0, 64);

  //create little dots to eat
  for (var i = 0; i < 100; i++) {

    if(random(0,10) < 7){
      food[i] = new Circle(random(-width*2,width*2), random(-height*2, height*2), 16);
    } else {
      food[i] = new Circle(random(-width*2,width*2), random(-height*2, height*2), 15)
    }
  }
}

function draw() {
  background(0);

  fill(255);
  noStroke();
  textSize(20);
  text(circle.health, 30, 30);

  //translate the position to the center
  translate(width/2, height/2);
  slowScale = lerp(slowScale, (32 / circle.r), 0.1);

  //scale the world as your character grows
  scale(slowScale);
  
  //translate the position of the character
  translate(-circle.pos.x, -circle.pos.y);

  //show initial circle and update position when moved
  circle.showCircle();
  circle.update();

  //show all little dots to eat
  for (var i = food.length - 1; i >= 0; i--) {
    if (circle.eat(food[i])) {
      food.splice(i, 1);
    }
    else {
      if(food[i].r == 15){
        food[i].showHealth();
      } else {
        food[i].showFood();
      }
    }
  }
}

//class for any circle on screen (Player Circles and food)
class Circle {
  constructor(x, y, r) {
      this.pos = createVector(x, y);
      this.r = r;
      this.health = 0;
  }
  
  update() {
    var mouse = createVector(mouseX - width/2, mouseY - height/2);
    
    //checks to see if its - and + in order for speed to work properly
    var mx = mouseX - width/2;
    var my = mouseY - height/2;

    var m;
    if(mx > 0 && my < 0){
      m = mx - my;
    } else if(mx < 0 && my > 0){
      m = my - mx;
    } else {
      m = mx + my;
    }

    if(m < 0){
      m = m * -1;
    }

    //gets magnitude and sets it so movement is based on magnitude
    var magnitude = sqrt(m);
    mouse.setMag(magnitude * 1/3);
    this.pos.add(mouse);
  }

  eat(food) {
    var dist = p5.Vector.dist(this.pos, food.pos);
    
    //if it goes half way into the other blob then eat it and add areas
    if (dist < this.r + food.r/2) {
      /*var newArea = PI * food.r * food.r  + PI * this.r * this.r;
      this.r = sqrt(newArea / PI);*/

      //updates objects health if food is eaten
      if(food.r == 15){
        this.health = this.health + 25;
      } else {
        this.health = this.health + 5;
      }
      return true;
    }
    return false;
  }

  shoot() {

  }

  showCircle() {
      fill(200,123,33);
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
  showFood(){
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  showHealth(){
    fill(100,255,0);
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
    var dist = p5.Vector.dist(this.pos, enemy.pos);
    
    //if it goes half way into the other blob then detract health
    if (dist < this.r + enemy.r) {
      //enemy health is deducted by d (damage)
      return true;
    }
    return false;
  }

  showBullet() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}