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
let onMap = true;
let turns = [];
let loops = new Set();
while(onMap) {
  const oldY = guardPosition[0];
  const oldX = guardPosition[1];
  const newY = oldY + guardDirection[0];
  const newX = oldX + guardDirection[1];
  dataArr[oldY][oldX] = 'X';
  if (newY < 0 || newY >= dataArr.length)
    onMap = false;
  if (newX < 0 || newX >= dataArr[newY].length)
    onMap = false;
  if (dataArr[newY][newX] == '#') {
    turns.push([oldY,oldX]);
    // uh-on we hit an obstruction!
    switch(guardDirection.toString()) {
      case "-1,0":
        guardDirection = [0, 1];
        break;
      case "0,1":
        guardDirection = [1, 0];
        break;
      case "1,0":
        guardDirection = [0, -1];
        break;
      case "0,-1":
        guardDirection = [-1, 0];
        break;
      default:
        console.log("case go brrrrrrrrrrr");
    }
  } else {
    guardPosition = [newY, newX];
    const t = turns.filter((p) => {
      return !(p[0] == oldY && p[1] == oldX) && (p[0] == oldY || p[1] == oldX);
    });
    if (t.length >= 2) {
      // Got a potential box with 2 other turning points on the same plane
      const yVals = [];
      const xVals = [];
      for (const vals of t) {
       if (vals[0] != oldY)
         yVals.push(vals[0])
       if (vals[1] != oldX)
         xVals.push(vals[1])
      }
      for (const y of yVals) {
        for (const x of xVals) {
          // Have travelled to a 4th point to make a box/circle?
          if (dataArr[y][x] == 'X') {
            loops.add([newY, newX].toString());
          }
        }
      }
    }
  }
}
console.log(dataArr.flat().filter((x) => x == 'X').length);
console.log(loops.size);
