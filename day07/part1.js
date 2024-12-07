import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

const dataArr = data.split('\r\n');
const findSolution = (accumulator, test, operands) => {
  if (operands.length == 0 && accumulator == test) {
    return true;
  }
  if (operands.length == 0 && accumulator != test)
    return false;
  if (accumulator > test)
    return false;
  const i = operands.shift();
  const add = findSolution(accumulator + i, test, [...operands]);
  const multSum = accumulator == 0 ? i : accumulator * i;
  const mult = findSolution(multSum, test, [...operands]);
  return mult || add;
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
