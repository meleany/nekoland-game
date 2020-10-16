'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');


const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

// Added Helmet for security. Modify what security feature to use following user stories.
const helmet = require('helmet');
app.use(helmet());

app.use(helmet.hidePoweredBy({setTo: 'PHP 7.4.3'}));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.noCache());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});


/* * * * * * Socket.io Setup  * * * * * */
const io = socket(server);
var players = {};                // Create empty object to store players. 
var collectibles = [{id: 'food', x:20, y:10, value: 1},  // Distances given in no row and col cells.
                    {id: 'book', x:10, y: 8, value: 2},  
                    {id: 'potion', x:15, y: 9, value: 4}, 
                    {id: 'money', x:20, y:12, value: 3}];

const N_ASSETS = collectibles.length; 

/* * * * * *  Start listening for events  * * * * * */
io.on('connection', function(socket) {
  console.log("Socket connection succesful.");
  console.log("Player connected: ", socket.id);
  
  // Listen for new player data
  socket.on('new player', function(player) {
    var id = player.id;
    players[id] = player;
    console.log("new player", Object.keys(players));
    socket.emit('collectibles', collectibles);
    socket.emit('players', players);     // Send the list of connected players to the new player
    socket.broadcast.emit('late player', player);
    socket.emit('display', players);
  });
  
  // Listen for player update
  socket.on('update player', function(player) {
    var id = player.id;
    if(players[id]){
      players[id].x = player.x;
      players[id].y = player.y;
      players[id].score = player.score;
      players[id].animX = player.animX;
      players[id].animY = player.animY;
      players[id].spriteNo = player.spriteNo;
      players[id].visible = player.visible;
      socket.broadcast.emit('update', players[id]);
    }
  });
  
  // Listen for collected asset and creation of a new collectible.
  socket.on('new collectible', function(asset) {
    for(var n=0; n<N_ASSETS; n++) {
      if(collectibles[n].id == asset.id) {
        collectibles[n].x = asset.x;
        collectibles[n].y = asset.y;
        io.emit('new asset', collectibles[n]);  // Send to all clients 
        break;
      }
    }
  });
  
  // Listen for player disconnection.
  socket.on('disconnect', function() {
    console.log('Player disconnected:', socket.id);
    delete players[socket.id];
    socket.broadcast.emit('remove player', socket.id);
    console.log(Object.keys(players));
  });
  
});
module.exports = app; // For testing