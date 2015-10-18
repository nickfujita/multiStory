

// //holds global options for the game
var socket = io();

var gameOptions = {
  height: 500,
  width: 1000,
  padding:80
};

var players = [];

var avatars = [];
avatars.push('./files/avatars/mario.gif');
avatars.push('./files/avatars/luigi.gif');
avatars.push('./files/avatars/toad.gif');
avatars.push('./files/avatars/yoshi.gif');
avatars.push('./files/avatars/bowser.gif');


var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

//set the gameBoard container
var container = d3.select('.board').append('svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height)
                .attr('margin','0 auto')
                .style('background-color','Wheat')
                .style('outline', 'thin black solid')
                .style('padding', gameOptions.padding);


var drag = d3.behavior.drag()
             //.on('dragstart', function() { //action to perform on mouse click })
             .on('drag', function() {
                console.log(this.id+' - '+d3.event.x+' : '+d3.event.y);
                socket.emit('playerMoving',[{id: this.id, x: (d3.event.x-(d3.select(this).attr('width')/2)), y: (d3.event.y-(d3.select(this).attr('height')/2))}]);
              })
             //.on('dragend', function() { //actions to perform on mouse release });
             ;

function generateNewPlayer() {
  players.push({
    id: players.length,
    x: Math.random()*100,
    y: Math.random()*100,
    avatar: avatars[players.length]
  });
}


function addNewPlayers(){
  var domPlayers = container.selectAll('image.player')
                      .data(players, function(d) { return d.id;});
  //new players player
  domPlayers.enter().append('image')
        .attr('class', 'player')
        .attr('id', function(d) {return d.id;})
        .attr('x', function(d) {return axes.x(d.x);})
        .attr('y', function(d) {return axes.y(d.y);})
        .attr('xlink:href', function(d) {return d.avatar;})
        .attr('height', '80')
        .attr('width', '80')
        .call(drag)
        ;
}

function startGame() {
  generateNewPlayer();
  generateNewPlayer();
  addNewPlayers();
}

startGame();


//when a player move is detected, updated the .player dom node xy position
//this should find the right player that made the move and make the update to the new position
socket.on('playerMoving', function (data) {
  d3.selectAll('.player').data(data, function(d) { return d.id; })
                          .attr('x', function(d) { return d.x; })
                          .attr('y', function(d) { return d.y; });
});





