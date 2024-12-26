import { readFileSync } from 'node:fs';

const data = readFileSync('input.txt', {
  encoding: 'utf8',
  flags: 'r'
});

const dataArr = data.split('\r\n')
  .map(x => x.split(''))
  .filter(x => x.length > 0);

const height = dataArr.length;
const width = dataArr[0].length;

const directions = {
  north: {
    y: -1,
    x: 0,
    moves: ['west', 'east']
  },
  east: {
    y: 0,
    x: 1,
    moves: ['north', 'south']
  },
  south: {
    y: 1,
    x: 0,
    moves: ['east', 'west']
  },
  west: {
    y: 0,
    x: -1,
    moves: ['south', 'north']
  }
}

class Player {
  x = 0;
  y = 0;
  direction = 'east';
  score = 0;
  path = [];

  constructor(x, y, direction='east', score = 0, path = []) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.score = score;
    this.path = path;
  }

  get location() {
    return [this.x, this.y];
  }
  
  get direction() {
    return this.direction;
  }

  get score() {
    return this.score;
  }

  get nextLocation() {
    return [this.x + directions[this.direction].x, this.y + directions[this.direction].y];
  }

  get path() {
    return this.path;
  }

  move() {
    this.x += directions[this.direction].x;
    this.y += directions[this.direction].y;
    this.path.push([this.x, this.y]);
    this.score += 1;
  }

  turnLeft() {
    this.direction = directions[this.direction].moves[0];
    this.score += 1000;
  }
  
  turnRight() {
    this.direction = directions[this.direction].moves[1];
    this.score += 1000;
  }
}

let initX = 0;
let initY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (dataArr[y][x] == 'S') {
      initX = x;
      initY = y;
    }
  }
}
const players = [];
const winners = [];

const main = (x, y) => {
  const p1 = new Player(x, y);
  players.push(p1);
  while (players.length > 0) {
    for (let x in players) {
      console.log('x', x);
      let [newx, newy] = players[x].nextLocation;
      let [oldx, oldy] = players[x].location;
      let left = directions[players[x].direction].moves[0];
      let right = directions[players[x].direction].moves[1];
      if (dataArr[oldy + directions[left].y][oldx + directions[left].x] != '#') {
        const p1 = new Player(oldx, oldy, left, players[x].score, ...players[x].path);
        p1.turnLeft();
        p1.move();
        players.push(p1);
        console.table(p1);
      }
      if (dataArr[oldy + directions[right].y][oldx + directions[right].x] != '#') {
        const p1 = new Player(oldx, oldy, right, players[x].score, ...players[x].path);
        p1.turnRight();
        p1.move();
        players.push(p1);
        console.table(p1);
      }
      if (dataArr[newy][newx] == 'E') {
        winners.push(players.splice(x,1));
      }
      if (dataArr[newy][newx] != '#') {
        players[x].move();
      }
    }
  }
}


console.table(dataArr);
main(initX, initY);

