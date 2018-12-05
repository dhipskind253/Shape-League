var express = require('express');
var app = express();

var circles = [];
var food = [];

function Circle (id, x, y, r, health){
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.health = health;
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

setInterval(heartbeat, 33);

function heartbeat(){
  io.sockets.emit('heartbeat', circles);
};

var firstRandom;
var secondRandom;

for (var i = 0; i < 500; i++) {
  firstRandom = 1;
  secondRandom = 1;

  if(Math.random() > .5){
    firstRandom = -1;
  }
  
  if(Math.random() > .5){
    secondRandom = -1;
  }

  if(Math.random() < .8){
    food[i] = new Circle(0, Math.random() * 2000 * firstRandom, Math.random() * 2000 * secondRandom, 12);
  } else {
    food[i] = new Circle(0, Math.random() * 2000 * firstRandom, Math.random() * 2000 * secondRandom, 16)
  }
}


setInterval(dinner, 33);

function dinner(){
  io.sockets.emit('dinner', food);
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    console.log("Connected: " + socket.id);

    socket.on('start', function(data){
      var circle = new Circle(socket.id, data.x , data.y, data.r, data.health);
      circles.push(circle);
    });

    socket.on('update', function(data){
      var circle;
      for (var i = 0; i < circles.length; i++){
        //update the socket's circle position
        if(socket.id == circles[i].id){
          circle = circles[i];
        }
      }
      circle.x = data.x;
      circle.y = data.y;
      circle.r = data.r;
      circle.health = data.health;
    });

    socket.on('foodUpdate', function(data){
      food = data;
    });

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      
      for (var i = 0; i < circles.length; i++){
        if(socket.id == circles[i].id){
          console.log(circles[i].id);
          circles.splice(i, 1);
        }
      }
    });
  }
);
