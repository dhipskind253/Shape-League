var socket;
var id;

var circle;
var food = [];
var enemies = [];
var slowScale = 1;
var bullets = [];


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  //start socket connection to the server
  socket = io.connect('http://localhost:2000');

  circle = new Circle(0, 0, 64, 100);

  var data = {
    x: circle.pos.x,
    y: circle.pos.y,
    r: circle.r,
    health: circle.health
  };
  socket.emit('start', data);

  socket.on('heartbeat', function(data){
    enemies = data;
  });

  
  //create little dots to eat
  for (var i = 0; i < 500; i++) {

    if(random(0,10) < 8){
      food[i] = new Circle(random(-2000,2000), random(-2000, 2000), 12);
    } else {
      food[i] = new Circle(random(-2000,2000), random(-2000, 2000), 16)
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
  
  //reset your circle if it dies
  if (circle.health <= 0) {
    circle = new Circle(random(-2000,2000), random(-2000, 2000), 64, 100);
  }

  //translate the position of the character
  translate(-circle.pos.x, -circle.pos.y);

  //show bullet and move it
  for(var i = bullets.length - 1; i >= 0; i--){
    if (bullets[i].x > 2000 || bullets[i].y > 2000 || bullets[i].x < -2000 || bullets[i].y < -2000 
     || bullets[i].x > window.innerWidth || bullets[i].y > window.innerHeight){
      bullets.splice(i,1);
    }
    else {
      bullets[i].showBullet();
      bullets[i].move();
    }
    /*for (var i = 0; i < enemies.length; i++) {
      if (bullets[i].hit(enemies[i])) {
        bullets.splice(i,1);
        enemies[i].health -= 5;
      }
    }*/
  }

  //draw the enemies on screen
  for (var i = enemies.length - 1; i >=0; i--){
    var enemId = enemies[i].id;
    if(enemId !== socket.id){
      fill(255, 0, 0);
      ellipse(enemies[i].x, enemies[i].y, enemies[i].r * 2, enemies[i].r * 2);

      fill(255);
      textAlign(CENTER);
      textSize(30);
      text(enemies[i].health,enemies[i].x, enemies[i].y);
    }
  }


  //show initial circle and update position when moved
  circle.showCircle();
  circle.update();
  circle.constrain();

  var data = {
    x: circle.pos.x,
    y: circle.pos.y,
    r: circle.r,
    health: circle.health
  };
  socket.emit('update', data);

  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(30);
  text(circle.health, circle.pos.x, circle.pos.y);

  //show all little dots to eat
  for (var i = food.length - 1; i >= 0; i--) {
    if (circle.eat(food[i])) {
      food.splice(i, 1);
      if(random(0,10) < 8){
        snack = new Circle(random(-2000,2000), random(-2000, 2000), 12);
      } else {
        snack = new Circle(random(-2000,2000), random(-2000, 2000), 16)
      }
      food.push(snack);
    }
    else {
      if(food[i].r == 16){
        //show green food
        food[i].showHealth();
      } else {
        //show white food
        food[i].showFood();
      }
    }
  }
}

//allows for the screen to be resized and not mess up the drawing
function windowResized(){
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function mousePressed(){
  if(mouseIsPressed){
    var bullet = new Bullet(circle.pos.x, circle.pos.y);
    bullets.push(bullet);
  }
}