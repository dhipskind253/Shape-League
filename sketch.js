var circle;
var food = [];
var slowScale = 1;
var bullet;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  circle = new Circle(0, 0, 64);
  bullet = new Bullet(circle.pos.x, circle.pos.y);

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

  //show bullet only on mouse press and move it
  if(mouseIsPressed){
    bullet.showBullet();
    bullet.move();
  }

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