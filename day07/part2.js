import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

const dataArr = data.split('\r\n');
const findSolution = (accumulator, test, operands) => {
  if (operands.length == 0) 
    return accumulator == test;
  if (accumulator > test)
    return false;
  const i = operands.shift();
  const concat = findSolution(Number(''.concat(accumulator,i)), test, [...operands]); 
  const add = findSolution(accumulator + i, test, [...operands]);
  const multSum = accumulator == 0 ? i : accumulator * i;
  const mult = findSolution(multSum, test, [...operands]);
  return mult || add || concat;
}
let result = 0;
for (const line of dataArr) {
  if (!line)
    break;
  let [test, operands] = line.split(': ');
  test = Number(test);
  operands = operands.split(" ").map(x=> Number(x));
  if (findSolution(0, test, operands)) {
    result += test;
  }
}
console.log(result);
