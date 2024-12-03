import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
 encoding: 'utf8',
 flag: 'r'
});
const mulRegex = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/gim;
const mulArray = [...data.matchAll(mulRegex)];
let result = 0;

for (const mul of mulArray) {
  result += Number(mul[1]) * Number(mul[2]);
}

console.log(result);
