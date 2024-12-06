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
while(onMap) {
  const oldY = guardPosition[0];
  const oldX = guardPosition[1];
  dataArr[oldY][oldX] = 'X';
  const newY = oldY + guardDirection[0];
  const newX = oldX + guardDirection[1];
  if (newY < 0 || newY >= dataArr.length)
    onMap = false;
  if (newX < 0 || newX >= dataArr[newY].length)
    onMap = false;
  if (dataArr[newY][newX] == '#') {
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
  }
}
console.table(dataArr);
console.log(dataArr.flat().filter((x) => x == 'X').length);
