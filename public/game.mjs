import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import Map from './Map.mjs';
import Values from './Values.mjs';

const dX = 1;
const dY = 1;
var gameMap;                // Variable assigned to canvas background.
var fX, fY;
var localPlayer, playerId;

const socket = io();
var collectiblesList = [];  // Array of collectible objects. 
var playersList = {};       // Array of connected players in the game.


/* * * * * *  Keyboard Events Handler (WASD & Arrows input) * * * * * */
function keyHandler(event, playerObj, keydownBool) {
  if(playerObj){
    var key = Values.keyMap[event.keyCode]; 
    switch(key) {
      case 'up':
        playerObj.input[key] = keydownBool;
      break;
      case 'down':
        playerObj.input[key] = keydownBool;
      break;
      case 'left':
        playerObj.input[key] = keydownBool;
      break;
      case 'right':
        playerObj.input[key] = keydownBool;
      break;
    }
    event.preventDefault();
  }
}

window.addEventListener('keydown', (e) => { return keyHandler(e, localPlayer, true); });

window.addEventListener('keyup', (e) => { return keyHandler(e, localPlayer, false); });


/* * * * * * * * *  CANVAS SETUP  * * * * * * */
// Check if Canvas supported by browser
function initCanvas() {
  if(canvasSupported){
    var gameCanvas = document.getElementById('canvas');
    var context = document. getElementById("canvas").getContext("2d");
    gameCanvas.width = canvasDimensions(window.innerWidth, Values.gameMapWidth);
    gameCanvas.height = canvasDimensions(window.innerHeight, Values.gameMapHeight);
    fX = Values.gameMapCols / gameCanvas.width;
    fY = Values.gameMapRows / gameCanvas.height;
    loadGameBackground(context, gameCanvas.width, gameCanvas.height);
    initGame(context, gameCanvas.width, gameCanvas.height);
  }
}

// Check if Canvas is supported by browser.
function canvasSupported() {
  var supportCanvas = document.createElement('canvas').getContext;
  return !!supportCanvas;
}

// Calculate Canvas best dimension for viewport based on gameMap and windows size.
function canvasDimensions(windowDim, gameDim) {
  var idealDim = Values.tileLen * Math.floor(windowDim/Values.tileLen);
  if(idealDim > gameDim) {
    idealDim = gameDim
  }
  return idealDim;
}

// Background is a single spritesheet.
function loadGameBackground(ctx, width, height) {
  gameMap = new Image();
  gameMap.src =  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2FFieldGame.png?v=1601932764587";
  gameMap.onload = function() {
    ctx.drawImage(gameMap, 0, 0, width, height);  
  }
}

// Render background in game main loop.
function renderGameBackground(ctx, width, height) {
  ctx.drawImage(gameMap, 0, 0, width, height);
}

/* * * * * *  Create Game Assets, Players, Keyboard setup  * * * * */
function initGame(ctx, width, height) {
  // Local player connects to game
  socket.on('connect', function() {
    playerId = socket.id;
    console.log("this client id: ", playerId);
    localPlayer = createNewPlayer(playerId);
    // Send new local player to server.
    socket.emit('new player', localPlayer);

    // Create avatar and render local player
    var sprite = new Image();
    sprite.src = localPlayer.spriteSrc[0];
    var waterSprite = new Image();
    waterSprite.src = localPlayer.spriteSrc[1];
    localPlayer.sprite = [sprite, waterSprite];
    localPlayer.sprite[0].onload = function() {
      localPlayer.drawPlayerAvatar(ctx, Values.tileLen);
    }
    
    window.requestAnimationFrame( function() {gameMainLoop(ctx, width, height);} );
  });
  
  // Receive assets data to create collectibles.
  socket.on('collectibles', function(assets) {
    createCollectibles(ctx, assets);    
  });
  
  // Receive list of connected players.
  socket.on('players', function(playersObj) {
    var otherPlayer, id, sprite1, sprite2;
    for(var key in playersObj) {
      id = playersObj[key].id;
      if(id != playerId){         
        playersList[id] = loadPlayer(playersObj[key]);
        sprite1 = new Image();
        sprite1.src = playersList[id].spriteSrc[0];
        sprite2 = new Image();
        sprite2.src = playersList[id].spriteSrc[1];
        playersList[id].sprite = [sprite1, sprite2];
      }
    }
    createPlayersAvatar(ctx, playersList);
  });
  
  // Receive updated player data.
  socket.on('update', function(player){
    var id = player.id;
    if(playersList[id]) {
      playersList[id].x = player.x * player.fX / fX;
      playersList[id].y = player.y * player.fY / fY;
      playersList[id].score = player.score;
      playersList[id].animX = player.animX;
      playersList[id].animY = player.animY;
      playersList[id].spriteNo = player.spriteNo;
      playersList[id].visible = player.visible;      
    }
  });
  
  // Add new player connected later to the game.
  socket.on('late player', function(player) {
    console.log("new player joined", player.id);
    var id, sprite1, sprite2;
    id = player.id;
    if(id != playerId) {
     playersList[id] = loadPlayer(player); 
      sprite1 = new Image();
      sprite1.src = player.spriteSrc[0];
      sprite2 = new Image();
      sprite2.src = player.spriteSrc[1];
      playersList[id].sprite = [sprite1, sprite2];
      player.sprite[player.spriteNo].onload = function() {
        player.drawPlayerAvatar(ctx, Values.tileLen);
      }
    }
  });
  
  // Receive players data to calculate local player details for display.
  socket.on('display', function(players) {
    displayCharacterInfo(players);
  });
  
  // Receive data of new collectible added to the game.
  socket.on('new asset', function(asset) {
    for(var n=0; n<collectiblesList.length; n++) {
      if(collectiblesList[n].id == asset.id){
        collectiblesList[n].x = asset.x/fX;
        collectiblesList[n].y = asset.y/fY;
        break;
      }
    }    
  });
  
  // Remove the disconnected player from the game
  socket.on('remove player', function(id) {
    delete playersList[id];
    console.log("players in list after disconnection", playerId, Object.keys(playersList));    
  });
}

/* * * * * *  Local Player  * * * * * */
// Create local new player, needs unique id from socket.io connection. 
function createNewPlayer(id) {
  var Xo = 25/fX;
  var Yo = 14/fY;
  var n = Math.floor(Math.random() * (Values.spritesList.length - 3));  // Random selection of sprite from spritesList. 
  var sprite = Values.spritesList[n];
  var waterSprite = Values.spritesList[14];
  var player = new Player({x:Xo, y:Yo, score:0, id: id});
  player.assignSpritesSrc([sprite, waterSprite]);
  player.fX = fX;
  player.fY = fY;  
  return player;
}

/* * * * * *  Other players connected  * * * * * */
function loadPlayer(p) {
  var x = p.x*p.fX/fX;
  var y = p.y*p.fY/fY;
  var player = new Player({x:x, y:y, score: p.score, id: p.id}); 
  player.assignSpritesSrc(p.spriteSrc);
  return player;
}

function createPlayersAvatar(ctx, playersObj) {
  var num = Object.keys(playersObj).length;
  var counter = 0;
  for(var key in playersObj) {
    playersObj[key].sprite[0].onload = function() {
      counter++;
      if(num <= counter) {
        renderPlayerAvatar(ctx, playersObj);
      }
    }
  }
}

function renderPlayerAvatar(ctx, p){
  var ids = [];
  for(var key in p) {
     p[key].drawPlayer(ctx, p[key].sprite[0], Values.tileLen, p[key].animX, p[key].animY, p[key].x, p[key].y);
    ids.push(key);
  }
}

function preloadImgs(ctx, imgURLs, sprites, playersObj, callback) {  // Maybe preload all the images outside the socket.io
  var counter = 0;
  for(var i=0; i<imgURLs.length; i++) {
    var avatar = new Image();
    avatar.src = imgURLs[i]; // The source should be after the onload and not before.
    sprites.push(avatar);
    avatar.onload = function() {
      counter++;
      if(imgURLs.length <= counter) {
        for(var key in playersObj) {
          if(key != playerId){
            playersObj[key].drawPlayer(ctx, sprites[i], Values.tileLen, playersObj[key].animX, playersObj[key].animY, playersObj[key].x, playersObj[key].y);
          }
        }
      }
    }
  }  
}

// Render all the players including local player.
function renderPlayers(ctx, playersObj) {
  if(localPlayer) {
    if(localPlayer.visible) {
      localPlayer.drawPlayerAvatar(ctx, Values.tileLen);
    }
  }
  for(var key in playersObj) {
    if(playersObj[key].visible) {
      playersObj[key].drawPlayerAvatar(ctx, Values.tileLen);
    }      
  }
}

// Update local player
function updateLocalPlayer(width, height) {
  var matX, matY;
  localPlayer.animX = 0;
  
  if(localPlayer.input['up'] == true) {
    localPlayer.assignSprite(64, 96);
    matX = Math.floor(Values.gameMapCols*(localPlayer.x)/width);
    matY = Math.floor(Values.gameMapRows*(localPlayer.y - dY)/height);
    if(Map[matY][matX] <= 8) {
      localPlayer.movePlayer('up', dY);
      // Visibility of character
      if(Map[matY][matX] < 8){
        localPlayer.visible = true;
      }else{
        localPlayer.visible = false;  
      }      
    }
  }
  
  if(localPlayer.input['down'] == true) {
    localPlayer.assignSprite(64, 0);
    matX = Math.floor(Values.gameMapCols*(localPlayer.x)/width);
    matY = Math.floor(Values.gameMapRows*(localPlayer.y + dY + Values.tileMid)/height);
    if(Map[matY][matX] <= 8) {
      localPlayer.movePlayer('down', dY);
      if(Map[matY][matX] < 8){
        localPlayer.visible = true;
      }else{
        localPlayer.visible = false;  
      }        
    }
  }
  
  if(localPlayer.input['left'] == true) {
    localPlayer.assignSprite(64, 32);
    matX = Math.floor(Values.gameMapCols *(localPlayer.x - dX)/width);
    matY = Math.floor(Values.gameMapRows*(localPlayer.y + Values.tileMid)/height);
    if(Map[matY][matX] <= 8) {
      localPlayer.movePlayer('left', dX);
      if(Map[matY][matX] < 8){
        localPlayer.visible = true;
      }else{
        localPlayer.visible = false;  
      }
    }      
  }
  
  if(localPlayer.input['right'] == true) {
    localPlayer.assignSprite(64, 64);
    matX = Math.floor(Values.gameMapCols *(localPlayer.x + dX)/width);
    matY = Math.floor(Values.gameMapRows*(localPlayer.y + Values.tileMid)/height);
    if(Map[matY][matX] <= 8) {
      localPlayer.movePlayer('right', dX);
      if(Map[matY][matX] < 8){
        localPlayer.visible = true;
      }else{
        localPlayer.visible = false;  
      }
    }     
  }
  
  // Check Map for water and change sprite accordingly.
  matX = Math.floor(Values.gameMapCols *(localPlayer.x)/width);
  matY = Math.floor(Values.gameMapRows*(localPlayer.y)/height);
  if(Map[matY][matX] == 7) {
    localPlayer.assignSpriteNo(1); 
  }else {
    localPlayer.assignSpriteNo(0);
  }
}

/* * * * * *  Collectibles  * * * * * */
// Create local collectibles. Collectibles/items are in a single spritesheet.
function createCollectibles(ctx, assets) {
  var num = assets.length;
  var vals = [1, 2, 4, 3];

  // Position of items in spritesheet. 
  var foodXo = 0; var foodYo = 14*Values.tileLen;
  var bookXo = 6*Values.tileLen; var bookYo = 13*Values.tileLen;
  var healthXo = 11*Values.tileLen; var healthYo = 9*Values.tileLen;
  var coinXo = 7*Values.tileLen; var coinYo = 12*Values.tileLen;

  var initXo = [foodXo, bookXo, healthXo, coinXo];
  var initYo = [foodYo, bookYo, healthYo, coinYo];

  var sprite = new Image();
  sprite.src = "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2F%231%20-%20Transparent%20Iconsb.png?v=1602105475257";
  
  for(var n=0; n<num; n++) {
    collectiblesList[n] = new Collectible({x:assets[n].x/fX, y:assets[n].y/fY, id:assets[n].id});
    collectiblesList[n].spriteXo = initXo[n];
    collectiblesList[n].spriteYo = initYo[n];
    collectiblesList[n].assignValue(vals[n]);
    collectiblesList[n].assignSprites([sprite]);
  }
  sprite.onload = function() {
    for(var i=0; i<collectiblesList.length; i++) {
      collectiblesList[i].drawCollectible(ctx, Values.tileLen);
    }    
  }
}

// Render collectibles in main loop
function rendeCollectibles(ctx, items) {
  var numItems = items.length;
  for(var n=0; n<numItems; n++) {
    items[n].drawCollectible(ctx, Values.tileLen);
  }
}

// Upadate collectibles in main loop
function updateCollectibles(collectibles, width, height) {
  var numCollectibles = collectibles.length;
  var collision;
  for(var n=0; n<numCollectibles; n++) {
    collision = localPlayer.collision(collectibles[n], fX, fY);
    if(collision) {
      var counter = 0; 
      while(counter < 10) {
        var posx = Math.floor(Math.random() * width);
        var posy  = Math.floor(Math.random() * height);
        var matX = Math.floor(fX*posx);
        var matY = Math.floor(fY*posy);
        if(Map[matY][matX] <= 8) {
          collectibles[n].newCollectible(-10, -10);  //Avoid the local collectible still present while updating.
          socket.emit('new collectible', {id: collectibles[n].id, x: matX, y: matY, score: localPlayer.score}); // server side use socket.id and score to update player 
          counter = 10;
        }
        counter++;
      }
    }
  } 
  socket.emit('update player', localPlayer);
}

/* * * * * *  Management of Game Info Display * * * * * */
// Load the initial values to show in the game info area.
function displayCharacterInfo(players){
  var totalPlayers = Object.keys(players).length;
  if(0 < totalPlayers){
    document.getElementById("avatar").src = players[playerId].spriteSrc[0];
    document.getElementById("scoreval").innerHTML = players[playerId].score;
    document.getElementById("rankval").innerHTML = localPlayer.calculateRank(players);
  }
}

function renderDisplayInfo(players){
  var totalPlayers = Object.keys(players).length + 1;
  if(0 < totalPlayers){
    players[playerId] = localPlayer;
    document.getElementById("avatar").src = localPlayer.spriteSrc[0];
    document.getElementById("scoreval").innerHTML = localPlayer.score;
    document.getElementById("rankval").innerHTML = localPlayer.calculateRank(players);
  }
}

/* * * * * *  Game Main Loop  * * * * * */
function gameMainLoop(ctx, canvasWidth, canvasHeight) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Update collectibles and players before rendering
  updateLocalPlayer(canvasWidth, canvasHeight);
  updateCollectibles(collectiblesList, canvasWidth, canvasHeight);

  renderGameBackground(ctx, canvasWidth, canvasHeight);
  rendeCollectibles(ctx, collectiblesList);
  renderPlayers(ctx, playersList);
  renderDisplayInfo(playersList);
  
  window.requestAnimationFrame( function() {gameMainLoop(ctx, canvasWidth, canvasHeight);} );  
}

initCanvas();