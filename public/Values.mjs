// Declaration of global constants to control game size.
const spritesList = [
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin019.png?v=1601933420791",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin020.png?v=1602099156106",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin018.png?v=1602099332487",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin017.png?v=1602099368903",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin016.png?v=1602099483955",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin014.png?v=1602099550511",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin013.png?v=1602099594525",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin011.png?v=1602099797038",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin010.png?v=1602099834857",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin009.png?v=1602099874459",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin008.png?v=1602099912622",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin004.png?v=1602099981612",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin002.png?v=1602100036820",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin001.png?v=1602100997930",
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin012.png?v=1602099739099",  // Swimming character
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2Fpipo-nekonin015.png?v=1602100862506",  // Warrior character
  "https://cdn.glitch.com/4559f8bc-2204-499c-a064-39c8fa1e5718%2FEnemy%2006-1.png?v=1602101190353"      // Enemy - skeleton
];

const tileLen = 32;
const tileMid = 0.5 * tileLen;
const gameMapRows = 25;
const gameMapCols = 50;
const gameMapWidth = gameMapCols * tileLen;
const gameMapHeight = gameMapRows * tileLen;

// KeyCode values for movement using WASD or arrows to use with event listener for keyboard. 
// Arrows: Up: 38, Down: 40, Right:39, Left:37. A:65, D:68, W:87, S:83
const keyMap = {
  38: 'up',
  40: 'down',
  39: 'right',
  37: 'left',
  65: 'left',
  68: 'right',
  87: 'up',
  83: 'down'
}

const Values = {
  tileLen: tileLen,
  tileMid: tileMid,
  gameMapRows: gameMapRows,
  gameMapCols: gameMapCols,
  gameMapWidth: gameMapWidth,
  gameMapHeight: gameMapHeight,
  spritesList: spritesList,
  keyMap: keyMap
}

export default Values;