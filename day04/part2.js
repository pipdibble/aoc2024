import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

let result = 0;

const dataArr = data.split('\n');

// A   B
//  'A'
// C   D
const doSearch = (row, character) => {
  let retVal = 0;
  const A = dataArr[Number(row)-1][Number(character)-1];
  const B = dataArr[Number(row)-1][Number(character)+1];
  const C = dataArr[Number(row)+1][Number(character)-1];
  const D = dataArr[Number(row)+1][Number(character)+1];
  if (A == 'M' && D == 'S' && B == 'M' && C == 'S')
    retVal = 1;
  if (B == 'M' && C == 'S' && D == 'M' && A == 'S')
    retVal = 1;
  if (D == 'M' && A == 'S' && C == 'M' && B == 'S')
    retVal = 1;
  if (A == 'M' && D == 'S' && C == 'M' && B == 'S')
    retVal = 1;
  return retVal;
}

for (const row in dataArr) {
  if (row > 0 && row < dataArr.length-1) {
    for (const character in dataArr[row]) {
      if (character > 0 && character < dataArr[row].length-1) {
        const letter = dataArr[row][character];
        if (letter == 'A') {
          result += doSearch(row, character);
        }
      }
    }
  }
}

console.log(result);
