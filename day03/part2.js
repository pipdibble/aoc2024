import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
 encoding: 'utf8',
 flag: 'r'
});

let result = 0;
const mulRegex = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/gim;
const doSplit = data.split("do()");
for (const dos of doSplit) {
  const dontSplit = dos.split("don't()");
  const mulArray = [...dontSplit[0].matchAll(mulRegex)];
  for (const mul of mulArray) {
    result += Number(mul[1]) * Number(mul[2]);
  }
}

console.log(result);
