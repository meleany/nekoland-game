class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.input = {'left': false, 'right':false, 'up': false, 'down': false}
    this.animX = 0;          // Position of image in sprite sheet. Use for animation. Images dims: 32x32 pix.
    this.animY = 0;          // Sprite sheets width=96 (3imagex x 32) height = 128 (4 images x 32).  
    this.sprite = [];
    this.spriteSrc = [];
    this.spriteNo = 0;
    this.visible = true;
    this.fX = 1.0;
    this.fY = 1.0;
  }
  
  assignSprites(arr) {
    this.sprite = arr;
  }

  assignSpritesSrc(arr) {
    this.spriteSrc = arr;
  }
  
  assignSprite(animXo, animYo) {
    this.animX = animXo;
    this.animY = animYo;
  }
  
  assignSpriteNo(spriteNo) {
    this.spriteNo = spriteNo;
  }

  drawPlayer(ctx, tileLen, animX, animY, x, y) {
    var tileLenMid = 0.5*tileLen;
    ctx.drawImage(this.sprite[this.spriteNo], animX, animY, tileLen, tileLen, x-tileLenMid, y-tileLenMid, tileLen, tileLen);
  }
  
  drawPlayerAvatar(ctx, tileLen) {
    var tileLenMid = 0.5*tileLen;
    ctx.drawImage(this.sprite[this.spriteNo], this.animX, this.animY, tileLen, tileLen, this.x-tileLenMid, this.y-tileLenMid, tileLen, tileLen);
  }
  
  movePlayer(dir, speed) {
    switch(dir) {
      case 'right':
        this.x = this.x + speed;
        break;
      case 'left':
        this.x = this.x - speed;
        break;
      case 'up':
        this.y = this.y - speed;
        break;
      case 'down':
        this.y = this.y + speed;
        break;
    }
  }
  
  collision(item, factorX=1.0, factorY=1.0) {
    var px = Math.floor(factorX * this.x);
    var py = Math.floor(factorY * this.y);
    var cx = Math.floor(factorX * item.x);
    var cy = Math.floor(factorY * item.y);
    if(px == cx && py == cy) {
      this.score = this.score + item.value;
      return true;
    }else {
      return false;
    }
  }

  calculateRank(playersObj) {
    var totalPlayers = Object.keys(playersObj).length;
    var scoreList = [];
    for(var key in playersObj) {
      scoreList.push(playersObj[key].score);
    }
    
    scoreList.sort((a, b) => b - a);
    var rank = scoreList.indexOf(this.score) + 1;
    return "Rank: " + rank + ' / ' + totalPlayers;
  }
}

export default Player;