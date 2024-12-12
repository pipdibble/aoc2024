import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

const dataArr = data.split(' ').map(x => parseInt(x));
console.table(dataArr);
const lookup = {};

const blinkProcess = (elem, r) => {
  const l = ''.concat(elem, ':', r);
  if (Object.hasOwn(lookup, l))
    return lookup[l];
  if (r == 0) {
    return 1;
  }
  r -= 1;
  let retVal = 0;
  if (elem == 0) {
    retVal = blinkProcess(1, r);
  } else if (Math.log10(elem) % 2 >= 1) {
    const nStr = elem.toString();
    const mid = nStr.length / 2;
    const n1 = parseInt(nStr.slice(0,mid));
    const n2 = parseInt(nStr.slice(mid));
    retVal += blinkProcess(n1, r);
    retVal += blinkProcess(n2, r);
  } else {
    retVal += blinkProcess(elem * 2024, r);
  }
  lookup[l] = retVal;
  return retVal;
}
let blinks = 25;
let result = dataArr.reduce((a, e) => a + blinkProcess(e, blinks), 0);
console.log("part1:",result);

blinks = 75;
result = dataArr.reduce((a, e) => a + blinkProcess(e, blinks), 0);
console.log("part2:",result);


