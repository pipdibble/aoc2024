import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

const trailHeads = {};
const mapArr = data.split('\r\n')
  .map((line) => line.split(''))
  .filter(line => line.length > 0)
  .map((l, y) => {
    l.map((val, x) => {
      if (val == '0')
        trailHeads[[x, y]] = new Set();
      return val;
    })
    return l;
  });
let [sizeX, sizeY] = Array(2).fill(mapArr[0].length);
const directions = {
  up: {
    x: 0,
    y: -1,
    move: ['up', 'left', 'right'] 
  },
  down: {
    x: 0,
    y: 1,
    move: ['down', 'left', 'right'] 
  },
  left: {
    x: -1,
    y: 0,
    move: ['up', 'down', 'left'] 
  },
  right: {
    x: 1,
    y: 0,
    move: ['up', 'down', 'right'] 
  }
}
const hike = (point, direction, x, y, elevation, map) => {
  let trailRating = 0;
  let keys = []; 
  if (direction) {
    keys = direction.move;
  } else {
    keys = Object.keys(directions);
  }

  for (const d of keys) {
    const newX = parseInt(x) + directions[d].x;
    const newY = parseInt(y) + directions[d].y;
    if (newX < 0 || newY < 0) {
      // off map
    } else if (newY == sizeY || newX == sizeX) {
      // off map
    } else {
      const newElevation = parseInt(map[newY][newX]);
      const travellable = newElevation - elevation == 1;
      if (travellable && newElevation == 9) {
        trailHeads[point].add(''.concat(newX,',',newY));
        trailRating++;
      } else if (travellable) {
        trailRating += hike(point, directions[d], newX, newY, newElevation, map);
      }
    }
  }
  return trailRating;
}

let result = 0;
let part2 = 0;
for (const point in trailHeads) {
  const x = parseInt(point.split(',')[0]);
  const y = parseInt(point.split(',')[1]);
  part2 += hike(point, null, x, y, 0, mapArr);
  result += trailHeads[point].size;
}
console.log("part1:",result);
console.log("part2:", part2);


