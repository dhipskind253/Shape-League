var express = require('express');
var app = express();
var serv = require('http').Server(app);

//if client requests nothing by default it goes to index.html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

//client can only access stuff in client folder
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log("localhost:2000")