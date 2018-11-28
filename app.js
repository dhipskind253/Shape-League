var express = require('express');
var app = express();
/*var serv = require('http').Server(app);

//if client requests nothing by default it goes to index.html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

//client can only access stuff in client folder
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log("localhost:2000")*/

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
