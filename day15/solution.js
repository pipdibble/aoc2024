import { readFileSync } from 'node:fs';

const data = readFileSync('input.txt', {
  encoding: 'utf8',
  flag: 'r'
});
let robot = [0, 0];

const dataParts = data.split('\r\n\r\n');
let map = dataParts[0];
map = map.split('\r\n').map((x,i) => {
  let row = x.split('');
  if (row.indexOf('@') >= 0) {
    robot = [i, row.indexOf('@')];
  }
  return row;
});
const directions = dataParts[1];

let map2 = map.map(x => {
  return x.map(r => {
    if (r == '@') {
      return ['@', '.'];
    } else if (r == 'O') {
      return ['[', ']'];
    } else {
      return Array(2).fill(r);
    }
  }).flat();
});

const move = (x, y) => {
  const mapVal = map[y][x];
  if (mapVal == '.') {
    map[robot[0]][robot[1]] = '.';
    map[y][x] = '@';
    robot = [y, x];
  } else if (mapVal == 'O') {
    const xDiff = x - robot[1];
    const yDiff = y - robot[0];
    let newX = x;
    let newY = y;
    while (map[newY][newX] != '.' && map[newY][newX] != '#') {
      newX += xDiff;
      newY += yDiff;
    }
    if (map[newY][newX] == '.') {
      map[newY][newX] = 'O';
      map[robot[0]][robot[1]] = '.';
      map[y][x] = '@';
      robot = [y, x];
    }
  }
}

console.log(directions);
console.table(map);

for (let i in directions) {
  switch (directions[i]) {
    case '<':
      move(robot[1]-1, robot[0]);
      break;
    case '^':
      move(robot[1], robot[0]-1);
      break;
    case '>':
      move(robot[1]+1, robot[0]);
      break;
    case 'v':
      move(robot[1], robot[0]+1);
      break;
    default:
      break;
  }
}

console.table(map);

let result = 0;
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (map[y][x] == 'O') {
      result += (100 * y) + x;
    }
  }
}
console.log(result);

console.table(map2);
for (let y = 0; y < map2.length; y++) {
  for (let x = 0; x < map2[y].length; x++) {
    if (map2[y][x] == '@')
      robot = [y, x];
  }
}
const canMoveBox = (m, x, y, d) => {
  let retVal = false;
  let v1 = null;
  let v2 = null;
  switch(d) {
    case '<':
      v1 = m[y][x-1];
      if (v1 == '.')
        retVal = true;
      else if (v1 == ']')
        retVal = canMoveBox(m, x-2, y, d);
      break;
    case '>':
      v1 = m[y][x+2];
      if (v1 == '.')
        retVal = true;
      else if (v1 == '[')
        retVal = canMoveBox(m, x+2, y, d);
      break;
    case '^':
      v1 = m[y-1][x];
      v2 = m[y-1][x+1];
      if (v1 == '.' && v2 == '.')
        retVal = true;
      else if (v1 != '#' && v2 != '#') {
        let s1 = true;
        let s2 = true;
        let s3 = true;
        if (v1 == '[')
          s1 = canMoveBox(m, x, y-1, d);
        if (v2 == '[')
          s2 = canMoveBox(m, x+1, y-1, d);
        if (v1 == ']')
          s3 = canMoveBox(m, x-1, y-1, d);
        retVal = s1 && s2 && s3;
      }
      break;
    case 'v':
      v1 = m[y+1][x];
      v2 = m[y+1][x+1];
      if (v1 == '.' && v2 == '.')
        retVal = true;
      else if (v1 != '#' && v2 != '#'){
        let s1 = true;
        let s2 = true;
        let s3 = true;
        if (v1 == '[')
          s1 = canMoveBox(m, x, y+1, d);
        if (v2 == '[')
          s2 = canMoveBox(m, x+1, y+1, d);
        if (v1 == ']')
          s3 = canMoveBox(m, x-1, y+1, d);
        retVal = s1 && s2 && s3;
      }
      break;
    default:
      throw new Error("Shouldn't get here!");
  }
  return retVal;
}

const moveBox = (m, x, y, d) => {
  let v = null;
  let v1 = null;
  let v2 = null;
  switch(d) {
    case '<':
      v = m[y][x-1];
      if (v == ']')
        moveBox(m, x-2, y, d);
      m[y][x-1] = '[';
      m[y][x] = ']';
      m[y][x+1] = '.';
      break;
    case '>':
      v = m[y][x+2];
      if (v == '[')
        moveBox(m, x+2, y, d);
      m[y][x] = '.';
      m[y][x+2] = ']';
      m[y][x+1] = '[';
      break;
    case '^':
      v1 = m[y-1][x];
      v2 = m[y-1][x+1];
      if (v1 == '[') 
        moveBox(m, x, y-1, d);
      if (v1 == ']') 
        moveBox(m, x-1, y-1, d);
      if (v2 == '[') 
        moveBox(m, x+1, y-1, d);
      m[y-1][x] = '[';
      m[y-1][x+1] = ']';
      m[y][x] = '.';
      m[y][x+1] = '.';
      break;
    case 'v':
      v1 = m[y+1][x];
      v2 = m[y+1][x+1];
      if (v1 == '[') 
        moveBox(m, x, y+1, d);
      if (v1 == ']') 
        moveBox(m, x-1, y+1, d);
      if (v2 == '[') 
        moveBox(m, x+1, y+1, d);
      m[y+1][x] = '[';
      m[y+1][x+1] = ']';
      m[y][x] = '.';
      m[y][x+1] = '.';
      break;
  }
}

const moveRobot = (m, x, y, d) => {
  const mapVal = m[y][x];
  let moved = false;
  if (mapVal == '.') {
    moved = true;
  }
  if (mapVal == '[') {
    if(canMoveBox(m, x, y, d)) {
      moveBox(m, x, y, d);
      moved = true;
    }
  }
  if (mapVal == ']') {
    if(canMoveBox(m, x-1, y, d)) {
      moveBox(m, x-1, y, d);
      moved = true;
    }
  }
  if (moved) {
    m[robot[0]][robot[1]] = '.';
    m[y][x] = '@';
    robot = [y, x];
  }
}
for (let i in directions) {
  switch (directions[i]) {
    case '<':
      moveRobot(map2, robot[1]-1, robot[0], '<');
      break;
    case '^':
      moveRobot(map2, robot[1], robot[0]-1, '^');
      break;
    case '>':
      moveRobot(map2, robot[1]+1, robot[0], '>');
      break;
    case 'v':
      moveRobot(map2, robot[1], robot[0]+1, 'v');
      break;
    default:
      break;
  }
}
console.table(map2);

result = 0;
for (let y = 0; y < map2.length; y++) {
  for (let x = 0; x < map2[y].length; x++) {
    if (map2[y][x] == '[') {
      result += (100 * y) + x;
    }
  }
}
console.log(result);


