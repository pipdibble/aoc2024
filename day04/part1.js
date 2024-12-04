import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

let result = 0;

const dataArr = data.split('\n');
const MAXY = dataArr.length;
const MAXX = dataArr[0].length;
const direction = {
  north: [0, -1],
  south: [0, 1],
  east: [1, 0],
  west: [-1, 0],
  northeast: [1, -1],
  southeast: [1, 1],
  southwest: [-1, 1],
  northwest: [-1, -1]
}
let words = [['X','M', 'A', 'S']];

const doSearch = (x, y, word, index, dir) => {
  let retVal = 0;
  let newX = Number(x) + direction[dir][0];
  let newY = Number(y) + direction[dir][1];
  let newIndex = index + 1;
  if (newIndex >= word.length)
    return retVal;
  if (newX < 0 || newY < 0)
    return retVal;
  if (newX >= MAXX || newY >= MAXY)
    return retVal;
  if (dataArr[newY][newX] == word[newIndex]) {
    if (newIndex == word.length-1) {
      retVal = 1;
    } else {
      retVal = doSearch(newX, newY, word, newIndex, dir);
    }
  }
  return retVal;
}

for (const word of words) {
  for (const row in dataArr) {
    for (const character in dataArr[row]) {
      const letter = dataArr[row][character];
      if (letter == word[0]) {
        for (const d of Object.keys(direction)) {
          result += doSearch(character, row, word, 0, d);
        }
      }
    }
  }
}

console.log(result);
