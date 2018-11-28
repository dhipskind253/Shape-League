var socket;

var circle;
var food = [];
var slowScale = 1;
var bullets = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  //start socket connection to the server
  socket = io.connect('http://localhost:2000');

  circle = new Circle(0, 0, 64);
  
  //bullet = new Bullet(circle.pos.x, circle.pos.y);

  //create little dots to eat
  for (var i = 0; i < 500; i++) {

    if(random(0,10) < 7){
      food[i] = new Circle(random(-width*4,width*4), random(-height*4, height*4), 16);
    } else {
      food[i] = new Circle(random(-width*4,width*4), random(-height*4, height*4), 15)
    }
  }
}

function draw() {
  background(0);

  //translate the position to the center
  translate(width/2, height/2);
  slowScale = lerp(slowScale, (32 / circle.r), 0.1);

  //scale the world as your character grows
  scale(slowScale);
  
  //translate the position of the character
  translate(-circle.pos.x, -circle.pos.y);

  //show bullet and move it
  for(var i = 0; i < bullets.length; i++){
    bullets[i].showBullet();
    bullets[i].move();
  }


  //show initial circle and update position when moved
  circle.showCircle();
  circle.update();
  circle.constrain();

  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(30);
  text(circle.health, circle.pos.x, circle.pos.y);

  //show all little dots to eat
  for (var i = food.length - 1; i >= 0; i--) {
    if (circle.eat(food[i])) {
      food.splice(i, 1);
      if(random(0,10) < 7){
        snack = new Circle(random(-width*4,width*4), random(-height*4, height*4), 16);
      } else {
        snack = new Circle(random(-width*4,width*4), random(-height*4, height*4), 15)
      }
      food.push(snack);
    }
    else {
      if(food[i].r == 15){
        //show green food
        food[i].showHealth();
      } else {
        //show white food
        food[i].showFood();
      }
    }
  }
}

function mousePressed(){
  if(mouseIsPressed){
    var bullet = new Bullet(circle.pos.x, circle.pos.y);
    bullets.push(bullet);
  }
}