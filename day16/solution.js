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
  alive = true;

  constructor(x, y, direction = 'east', score = 0, path = [], alive = true) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.score = score;
    this.path = path;
    this.path.push([x, y]);
    this.alive = alive;
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

  kill() {
    this.alive = false;
  }

  get alive() {
    return this.alive;
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
let players = [];
let winners = [];
const steps = {};

const main = (x, y) => {
  const p1 = new Player(x, y);
  players.push(p1);
  let moved = true;
  while (moved) {
    moved = false;
    let newDirections = [];
    for (let x in players) {
      let [newx, newy] = players[x].nextLocation;
      let [oldx, oldy] = players[x].location;

      let tryLeft = new Player(oldx, oldy, players[x].direction, players[x].score, [...players[x].path]);
      tryLeft.turnLeft();
      let [leftx, lefty] = tryLeft.nextLocation;
      let lv = dataArr[lefty][leftx];
      let ls = tryLeft.location.toString() + ':' + tryLeft.direction;
      if (lv == '.' || lv == 'x' && (!steps.hasOwnProperty(ls) || steps[ls] >= tryLeft.score)) {
        newDirections.push(tryLeft);
        steps[ls] = tryLeft.score;
        moved = true;
      }

      let tryRight = new Player(oldx, oldy, players[x].direction, players[x].score, [...players[x].path]);
      tryRight.turnRight();
      let [rightx, righty] = tryRight.nextLocation;
      let rv = dataArr[righty][rightx];
      let rs = tryRight.location.toString() + ":" + tryRight.direction;
      if (rv == '.' || rv == 'x' && (!steps.hasOwnProperty(rs) || steps[rs] >= tryRight.score)) {
        newDirections.push(tryRight);
        steps[rs] = tryRight.score;
        moved = true;
      }

      if (dataArr[newy][newx] == '.' || dataArr[newy][newx] == 'x') {
        steps[players[x].location.toString() + ':' + players[x].direction] = players[x].score;
        players[x].move();
        dataArr[newy][newx] = 'x';
        moved = true;
      }
      if (dataArr[newy][newx] == '#') {
        players[x].kill();
      }
      if (dataArr[newy][newx] == 'E') {
        players[x].move();
        moved = true;
        winners.push(players[x]);
        players[x].kill();
      }
    }
    players = players.concat(newDirections);
    players = players.filter(x => x.alive);
  }
}


main(initX, initY);
winners.sort((a, b) => a.score - b.score);
console.table(winners);
if (winners.length >= 1) {
  console.log("Part1:", winners[0].score);
  let score = winners[0].score;
  winners = winners.filter(x => x.score == score);
  let tiles = [];
  for (let a of winners) {
    for (let b of a.path) {
      if (!tiles.includes(b.toString()))
        tiles.push(b.toString());
    }
  }
  console.log("Part2:", tiles.length);
}
