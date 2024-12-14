import { readFileSync } from 'node:fs';

const data = readFileSync('input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

const dataArr = data.split('\r\n')
  .filter(x => x.length > 0)
  .map( x => {
    return x.split(': ')[1]
      .split(', ')
      .map(x => {
        return x.slice(2);
      });
  });
console.table(dataArr);

const pushButton = (x, y, a, b, offset) => { 
  x = Number(x) + offset;
  y = Number(y) + offset;
  let r = [];
  const denominator = a[0] * b[1] - b[0] * a[1];
  if (denominator != 0) {
    const A = (x * b[1] - b[0] * y) / denominator;
    if(Number.isInteger(A) && A >= 0) {
      const B = (y - A * a[1]) / b[1];
      if(Number.isInteger(B) && B >= 0) {
        r.push([A, B, (A*3)+(B*1)]);
      }
    }
  }
  /*
   * The below was attempt 1, which was brute force and too slow for part 2
  for (let i = 0; x > 0; x -= a[0]) {
    if (x % b[0] == 0) {
      let m = x / b[0];
      if (y == ((a[1] * i) + (b[1] * m)))
        r.push([i, m, (i * 3) + (m * 1)]);
    }
    i++;
  }
  */
  r.sort((a, b) => a[2] - b[2]);
  if (r.length == 0)
    throw new Error("Not possible");
  return r[0];
}
let cost = 0;
let p2Cost = 0;
for (let i = 0; i < dataArr.length; i+= 3) {
  const A = dataArr[i];
  const B = dataArr[i+1];
  const [xt, yt] = dataArr[i+2];
  try {
    const result = pushButton(xt, yt, A, B, 0);
    cost += result[2];
  } catch(e) {
    // ignore
  }
  try {
    const result2 = pushButton(xt, yt, A, B, 10000000000000);
    p2Cost += result2[2];
  } catch(e) {
    // ignore
  }
}
console.log("part1:", cost);
console.log("part2:", p2Cost);
