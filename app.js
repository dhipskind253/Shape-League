var express = require('express');
var app = express();

var circles = [];

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
        if(socket.id == circles[i].id){
          circle = circles[i];
        }
      }
      circle.x = data.x;
      circle.y = data.y;
      circle.r = data.r;
      circle.health = data.health;
    });

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      /*for (var i = 0; i < circles.length; i++){
        if(socket.id == circles[i].id){
          console.log(circles[i].id);
          circles.splice(i, 1);
        }
      }*/
    });
  }
);
