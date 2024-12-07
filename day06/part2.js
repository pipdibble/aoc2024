import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});
let guardDirection = [-1,0]; // start y,x movement
const dataArr = data.split('\r\n').map((x) => x.split(''));
let guardPosition = null;
for (let y = 0; y < dataArr.length; y++) {
  for (let x = 0; x < dataArr[y].length; x++) {
    if (dataArr[y][x] == '^')
      guardPosition = [y, x];
  }
}
const walkGuard = (start, direction, map, route) => {
  let onMap = true;
  let steps = 0;
  while (onMap) {
    const oldY = start[0];
    const oldX = start[1];
    const newY = oldY + direction[0];
    const newX = oldX + direction[1];
    map[oldY][oldX] = 'X';
    if (newY < 0 || newY >= map.length)
      onMap = false;
    if (onMap && (newX < 0 || newX >= map[newY].length))
      onMap = false;
    if (onMap && map[newY][newX] == '#') {
      switch(direction.toString()) {
        case "-1,0":
          direction = [0, 1];
          break;
        case "0,1":
          direction = [1,0];
          break;
        case "1,0":
          direction = [0,-1];
          break;
        case "0,-1":
          direction = [-1,0];
          break;
      }
    } else {
      const routeId = direction.toString() + ',' + oldY.toString() + ',' + oldX.toString();
      if (onMap) {
        if (route.has(routeId)) {
          return [Infinity, map, route];
        } else {
          route.add(routeId);
        }
        steps++
        start = [newY, newX];
      }
    }
  }
  return [steps, map, route];
}
const [steps,,route] = walkGuard([...guardPosition], [...guardDirection], dataArr, new Set());
console.log("steps:", steps);
console.log("Unique locations: ", (dataArr.flat().filter(x => x == 'X')).length);
// Part 2
const partTwo = new Set();
/*
for (const r of route.values()) {
  const rArr = r.split(',');
  const y = rArr[2];
  const x = rArr[3];
  const newMap = data.split('\r\n').map(x => x.split(''));
  newMap[y][x] = '#';
  const [steps,,] = walkGuard([...guardPosition], [...guardDirection], newMap, new Set());
  if (steps == Infinity)
    partTwo.add(y + ',' + x);
}
*/
for (let y = 0; y < dataArr.length; y++) {
  for (let x = 0; x <  dataArr[y].length; x++) {
    const newMap = data.split('\r\n').map(x => x.split(''));
    newMap[y][x] = '#';
    const [steps,,] = walkGuard([...guardPosition], [...guardDirection], newMap, new Set());
    if (steps == Infinity)
      partTwo.add(y + ',' + x);
  }
}
console.log("Infinite loops: ",partTwo.size);

