var express = require('express');
var app = express();

//process.env.PORT used with deploying on heroku
var server = app.listen(process.env.PORT || 2000, listen);

function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("listening at http://" + host + ":" + port);
}

app.use(express.static('client'));

var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    console.log("Connected: " + socket.id);

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);
