var socket;
var id;
var selfIndex;

var circle;
var food = [];
var enemies = [];
var slowScale = 1;
var bullets = [];
var enemiesBullets = [];


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  //start socket connection to the server
  socket = io.connect('http://localhost:2000');

  circle = new Circle(random(-1900,1900), random(-1900,1900), 64, 100);
  
  var data = {
    x: circle.pos.x,
    y: circle.pos.y,
    r: circle.r,
    health: circle.health
  };

  //send start to server to add circle to array
  socket.emit('start', data);

  //gets the enemies from server list
  socket.on('heartbeat', function(data){
    enemies = data;
  });

  //gets the food from the server list
  socket.on('dinner', function(data){
    food = data;
  });

  socket.on('arsenal', function(data){
    enemiesBullets = data;
  });

}

function draw() {
  background(0);

  //translate the position to the center
  translate(width/2, height/2);
  slowScale = lerp(slowScale, (32 / circle.r), 0.1);

  //scale the world as your character grows
  scale(slowScale);
  
  //set selfIndex
  for (var i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].id == socket.id) {
      selfIndex = i;
    }
  }
  
  //reset your circle if it dies
  if (circle.health <= 0) {
    circle.pos.x = random(-2000,2000);
    circle.pos.y = random(-2000,2000);
    enemies[selfIndex].health = 100;

    //emit the update health data for enemies
    socket.emit('enemyUpdate', selfIndex, enemies[selfIndex].health);    
  }

  //translate the position of the character
  translate(-circle.pos.x, -circle.pos.y);
  
  //show bullet and move it
  for(var i = bullets.length - 1; i >= 0; i--) {
    for (var j = enemies.length - 1; j >= 0; j--) {
      if (bullets[i]) {
        if (bullets[i].x > 2000 || bullets[i].y > 2000 || bullets[i].x < -2000 || bullets[i].y < -2000){
          bullets.splice(i,1);
        }
      }
      if (bullets[i]) {      
        if (bullets[i].hit(enemies[j]) && enemies[j].id !== socket.id) {
          enemies[j].health -= 5;
          
          //emit the update health data for enemies
          socket.emit('enemyUpdate', j, enemies[j].health);
          bullets.splice(i,1);
        }
      } 
      if (bullets[i]) {
        bullets[i].showBullet();
        bullets[i].move();
      }
    }
  }

  //display enemies bullets
  for(var i = enemiesBullets.length - 1; i >= 0; i--){
    if(enemiesBullets[i]){
      var x = parseFloat(enemiesBullets[i].x);
      var y = parseFloat(enemiesBullets[i].y);

      var vel = createVector(parseFloat(enemiesBullets[i].mx), parseFloat(enemiesBullets[i].my));
      vel.setMag(15);
      var pos = createVector(x, y);
      pos.add(vel);
    }

    for (var j = enemies.length - 1; j >= 0; j--) {

        //make sure bullet can't hit self
        if(enemiesBullets[i]){
          if(enemiesBullets[i].id != socket.id){ 
            if (x > 2000 || y > 2000 || x < -2000 || y < -2000){
              enemiesBullets.splice(i,1);
            }
          } else{
            enemiesBullets.splice(i,1);
          }
        }

        if (enemiesBullets[i]) {
          var enemyPos = createVector(enemies[j].x, enemies[j].y);
          var dist = p5.Vector.dist(pos, enemyPos);
          
          //if it hits the enemy blob then return true
          if (dist < 79 && enemies[j].id !== socket.id) {
            enemiesBullets.splice(i,1);
          }
        }

        if(enemiesBullets[i]){
          fill(255);
          ellipse(x, y, 15, 15);
          enemiesBullets[i].x = pos.x;
          enemiesBullets[i].y = pos.y;
          socket.emit('updatebulletpos', enemiesBullets[i].x, enemiesBullets[i].y, i);
        }
      
    }
  }
  

  //draw the enemies on screen
  for (var i = enemies.length - 1; i >=0; i--){
    var enemId = enemies[i].id;
    if(enemId !== socket.id){
      fill(255, 0, 0);
      ellipse(enemies[i].x, enemies[i].y, enemies[i].r * 2, enemies[i].r * 2);

      //shows health
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

  //gets circle data and sends it to update pos in server
  var data = {
    x: circle.pos.x,
    y: circle.pos.y,
    r: circle.r,
  };
  socket.emit('update', data);

  //show your own health
  for (var i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].id == socket.id) {
      selfIndex = i;
      circle.health = enemies[selfIndex].health;
    }
  }
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(30);
  text(circle.health, circle.pos.x, circle.pos.y);

  var foodIndex;
  //show all little dots to eat
  for (var i = food.length - 1; i >= 0; i--) {

    //if food is eaten remove it and add new random food
    if (circle.eat(food[i])) {
      //reassign own health
      if (food[i].r == 16) {
        enemies[selfIndex].health = enemies[selfIndex].health + 15;
      }
      else {
        enemies[selfIndex].health = enemies[selfIndex].health - 5;
      }
      
      //emit the update health data for enemies
      socket.emit('enemyUpdate', selfIndex, enemies[selfIndex].health);

      food.splice(i, 1);
      foodIndex = i;
      if(food.length != 0){
        //socket.emit('foodUpdate', food);
        socket.emit('foodUpdate', foodIndex);
      }

     
    }
    else {
      if(food[i].r == 16){
        //show green food
        fill(100,255,0);
        ellipse(food[i].x, food[i].y, food[i].r * 2, food[i].r * 2);
      } else {
        //show white food
        fill(255);
        rect(food[i].x, food[i].y, food[i].r * 2, food[i].r * 2);
      }
    }
  }
  
}

//allows for the screen to be resized and not mess up the drawing
function windowResized(){
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function mouseClicked(){
    var bullet = new Bullet(circle.pos.x, circle.pos.y);
    bullets.push(bullet);
    for(var i = 0; i < bullets.length; i++){
      socket.emit('bulletfire', socket.id, bullets[i].x, bullets[i].y, bullets[i].mx, bullets[i].my);
    }
}
