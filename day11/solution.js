import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

const dataArr = data.split(' ').map(x => parseInt(x));
console.table(dataArr);

const blinkProcess = (elem, r) => {
  if (r == 0) {
    return 1;
  }
  r -= 1;
  let retVal = 0;
  if (elem == 0) {
    retVal = blinkProcess(1, r);
  } else if (elem.toString().length % 2 == 0) {
    const mid = elem.toString().length / 2;
    const n1 = parseInt(elem.toString().slice(0,mid));
    const n2 = parseInt(elem.toString().slice(mid));
    retVal += blinkProcess(n1, r);
    retVal += blinkProcess(n2, r);
  } else {
    retVal += blinkProcess(elem * 2024, r);
  }
  return retVal;
}
let blinks = 25;
let result = dataArr.reduce((a, e) => a + blinkProcess(e, blinks), 0);
console.log("part1:",result);

blinks = 75;
result = dataArr.reduce((a, e) => a + blinkProcess(e, blinks), 0);
console.log("part2:",result);


