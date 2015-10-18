var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('.'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('playerMoving', function(msg){
    console.log('player '+msg[0].id+' is moving to: '+msg[0].x+' '+msg[0].y);
    io.emit('playerMoving', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});