var express = require('express');
var app = express();

var circles = [];
var food = [];
var bullets = [];

function Circle (id, x, y, r, health){
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.health = health;
}

function Bullet (id, x, y, mx, my){
  this.id = id;
  this.x = x;
  this.y = y;
  this.mx = mx;
  this.my = my;
}

//process.env.PORT used with deploying on heroku
var server = app.listen(process.env.PORT || 2000, listen);

function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("listening at http://" + host + ":" + port);
}

app.use(express.static('client'));

var io = require('socket.io')(server);

//interval for enemies
setInterval(heartbeat, 33);

//sends all enemies to clients
function heartbeat(){
  io.sockets.emit('heartbeat', circles);
};

setInterval(arsenal, 10);
function arsenal(){
  io.sockets.emit('arsenal', bullets);
};

var firstRandom;
var secondRandom;

//create the food
for (var i = 0; i < 500; i++) {
  firstRandom = 1;
  secondRandom = 1;

  if(Math.random() > .5){
    firstRandom = -1;
  }
  
  if(Math.random() > .5){
    secondRandom = -1;
  }

  //decides if it should be health or not
  if(Math.random() < .8){
    food[i] = new Circle(0, Math.random() * 2000 * firstRandom, Math.random() * 2000 * secondRandom, 12);
  } else {
    food[i] = new Circle(0, Math.random() * 2000 * firstRandom, Math.random() * 2000 * secondRandom, 16)
  }
}

//interval for food
setInterval(dinner, 33);

//sends food to clientes
function dinner(){
  io.sockets.emit('dinner', food);
}



// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    console.log("Connected: " + socket.id);

    //on start up create circle in circles array
    socket.on('start', function(data){
      var circle = new Circle(socket.id, data.x , data.y, data.r, 100);
      circles.push(circle);
    });

    socket.on('enemyUpdate', function(index, newHealth) {
        circles[index].health = newHealth;
    });

    socket.on('update', function(data){
      var circle;
      for (var i = 0; i < circles.length; i++){
        //update the socket's circle position
        if(socket.id == circles[i].id){
          circle = circles[i];
        }
      }
      if(circle){
        circle.x = data.x;
        circle.y = data.y;
        circle.r = data.r; 
      }
    });

    //update the food on display
    socket.on('foodUpdate', function(index){
      food.splice(index, 1);

      var firstRandom = 1;
      var secondRandom = 1;

      if(Math.random() > .5){
        firstRandom = -1;
      }
      
      if(Math.random() > .5){
        secondRandom = -1;
      }

      //decides if it should be health or not
      var newFood;
      if(Math.random() < .8){
        newFood = new Circle(0, Math.random() * 2000 * firstRandom, Math.random() * 2000 * secondRandom, 12);
      } else {
        newFood = new Circle(0, Math.random() * 2000 * firstRandom, Math.random() * 2000 * secondRandom, 16)
      }
      food.push(newFood);
    });

    socket.on('bulletfire', function(id, x, y, mx, my){
      //bullets = data;
      var bullet;
      bullet = new Bullet(id, x, y, mx, my);
      bullets.push(bullet);
    });

    socket.on('updatebulletpos', function(x, y, i){
      if(bullets[i]){
        if (x > 2000 || y > 2000 || x < -2000 || y < -2000){
          bullets.splice(i,1);
        } else {
          bullets[i].x = x;
          bullets[i].y = y;
        }
      }
    });

    //if player disconnects remove them from circles array
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      
      for (var i = 0; i < circles.length; i++){
        if(socket.id == circles[i].id){
          circles.splice(i, 1);
        }
      }
    });
  }
);

