import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});
const WIDTH = data.indexOf('\r\n');
const BOUND = WIDTH*WIDTH;

const d = data.replaceAll('\r\n','').split('');
const checkCell = (letter, index, origin, array) => {
  origin[index] = [];
  let area = 1;
  let perimeter = 0;
  if (index - 1 < 0 || (index > 0 && index % WIDTH == 0) || array[index-1] != letter) {
    origin[index].push('l'+index % WIDTH);
    perimeter++;
  } else if (!origin[index-1] && array[index-1] == letter) {
    let [a, p, acc] = checkCell(letter, index-1, origin, array);
    area += a;
    perimeter += p;
    origin[index] = [...origin[index], ...acc];
  }
  if (index + 1 > BOUND || (index + 1) % WIDTH == 0 || array[index+1] != letter) {
    origin[index].push('r'+index % WIDTH);
    perimeter++;
  } else if (!origin[index+1] && array[index+1] == letter) {
    let [a, p, acc] = checkCell(letter, index+1, origin, array);
    area += a;
    perimeter += p;
    origin[index] = [...origin[index], ...acc];
  }
  if (index + WIDTH > BOUND || array[index+WIDTH] != letter) {
    origin[index].push('d'+Math.floor(index/WIDTH));
    perimeter++;
  } else if (!origin[index+WIDTH] && array[index+WIDTH] == letter) {
    let [a, p, acc] = checkCell(letter, index+WIDTH, origin, array);
    area += a;
    perimeter += p;
    origin[index] = [...origin[index], ...acc];
  }
  if (index - WIDTH < 0 || array[index-WIDTH] != letter) {
    origin[index].push('u'+Math.floor(index/WIDTH));
    perimeter++;
  } else if (!origin[index-WIDTH] && array[index-WIDTH] == letter) {
    let [a, p, acc] = checkCell(letter, index-WIDTH, origin, array);
    area += a;
    perimeter += p;
    origin[index] = [...origin[index], ...acc];
  }
  return [area, perimeter, origin[index]];  
}

const build = d.reduce((a, e, i) => {
      if (!a.hasOwnProperty(i)) {
        let [area, perimeter, arr] = checkCell(e, i, a, d);
        a[''.concat(e, i)] = [area, perimeter, arr];
      }
      return a;
  }, {});
let result = 0;
let part2 = 0;
for (let key of Object.keys(build)) {
  const m = key.match(/([A-z]+)(\d+)/i);
  if (m && m.length == 3) {
    result += build[key][0] * build[key][1];
    console.log(build[key][0]);
    console.log(build[key][2]);
    part2 += Object.keys(build[key][2].reduce((a, e) => {
      a[e] = true;
      return a;
    }, {})).length * build[key][0];
  }
}
console.log("part2:",result);
console.log("part2:", part2);
