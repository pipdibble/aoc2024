import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

const orderRegex = /(\d+)\|(\d+)/gi;
const updateRegex = /(\d+)(,\d+)+/gi;
const orders = [...data.matchAll(orderRegex)];
const updates = [...data.matchAll(updateRegex)];

let result = 0;

const forwardAllow = {};

for (const o of orders) {
  if (forwardAllow[o[1]])
    forwardAllow[o[1]].push(o[2]);
  else
    forwardAllow[o[1]] = [o[2]]
}

for (const u of updates) {
  let valid = true;
  let corrected = false;
  const nums = u[0].split(',');
  for (let numIndex in nums) {
    numIndex = Number(numIndex);
  do {
      valid = true;
      for (let i = 0; i < nums.length; i++) {
        if (i < numIndex) {
          if (forwardAllow[nums[numIndex]]?.indexOf(nums[i]) >= 0)
            valid = false;
        } else if (i > numIndex) {
          if (forwardAllow[nums[numIndex]]?.indexOf(nums[i]) < 0)
            valid = false;
        }
        if (!valid) {
          const temp = nums[i];
          nums[i] = nums[numIndex];
          nums[numIndex] = temp;
          corrected = true;
        }
      }
    }while(!valid);
  }

  if (corrected) {
    const midIndex = Math.floor(nums.length / 2);
    result += Number(nums[midIndex]);
  }
}
console.log(result);
