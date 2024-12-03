import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
 encoding: 'utf8',
 flag: 'r'
});
const doSplit = data.split("do()");
const mulRegex = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/gim;
let result = 0;

for (const dos of doSplit) {
  if (dos.indexOf("don't()") >= 0) {
    const dontSplit = dos.split("don't()");
    const mulArray = [...dontSplit[0].matchAll(mulRegex)];
    for (const mul of mulArray) {
      result += Number(mul[1]) * Number(mul[2]);
    }
  } else {
    const mulArray = [...dos.matchAll(mulRegex)];
    for (const mul of mulArray) {
      result += Number(mul[1]) * Number(mul[2]);
    }
  }
}

console.log(result);
