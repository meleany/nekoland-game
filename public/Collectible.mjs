class Collectible {
  constructor({x, y, id}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.collected = false;
    this.value = 0;
    this.sprite = [];
    this.spriteXo = '';
    this.spriteYo = '';
  }

  drawCollectible(ctx, tileLen) {
    var factor = 0.5;           // Resize item to make it smaller than character.
    ctx.drawImage(this.sprite[0], this.spriteXo, this.spriteYo, tileLen, tileLen, this.x, this.y, factor*tileLen, factor*tileLen);   
  }
  
  assignSprites(arr) {
    this.sprite =  arr;
  }
  
  assignValue(val) {
    this.value = val;
  }
  
  newCollectible(x, y) {
    this.x = x;
    this.y = y;
  }
  
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
