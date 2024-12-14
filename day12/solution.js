import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});
const WIDTH = data.indexOf('\r\n');
const BOUND = WIDTH*WIDTH;

const d = data.replaceAll('\r\n','').split('');
const checkCell = (letter, index, origin, array) => {
  let area = 1;
  let perimeter = 0;
  let corners = 0;
  let l = false;
  let r = false;
  let u = false;
  let d = false;
  origin[index] = true;
  if (index - 1 < 0 || (index > 0 && index % WIDTH == 0) || array[index-1] != letter) {
    perimeter++;
    l = true;
  } else if (!origin[index-1] && array[index-1] == letter) {
    let [a, p, c] = checkCell(letter, index-1, origin, array);
    area += a;
    perimeter += p;
    corners += c;
  }
  if (index + 1 > BOUND || (index + 1) % WIDTH == 0 || array[index+1] != letter) {
    perimeter++;
    r = true;
  } else if (!origin[index+1] && array[index+1] == letter) {
    let [a, p, c] = checkCell(letter, index+1, origin, array);
    area += a;
    perimeter += p;
    corners += c;
  }
  if (index + WIDTH > BOUND || array[index+WIDTH] != letter) {
    perimeter++;
    d = true;
  } else if (!origin[index+WIDTH] && array[index+WIDTH] == letter) {
    let [a, p, c] = checkCell(letter, index+WIDTH, origin, array);
    area += a;
    perimeter += p;
    corners += c;
  }
  if (index - WIDTH < 0 || array[index-WIDTH] != letter) {
    perimeter++;
    u = true;
  } else if (!origin[index-WIDTH] && array[index-WIDTH] == letter) {
    let [a, p, c] = checkCell(letter, index-WIDTH, origin, array);
    area += a;
    perimeter += p;
    corners += c;
  }
  // external corners, easy
  corners += u && r ? 1 : 0;
  corners += r && d ? 1 : 0;
  corners += d && l ? 1 : 0;
  corners += l && u ? 1 : 0;
  // internal corners, hard
  corners += u && r && array[index-1] == letter && array[index+WIDTH] == letter && array[index+(WIDTH-1)] != letter ? 1 : 0;
  corners += r && d && array[index-1] == letter && array[index-WIDTH] == letter && array[index-(WIDTH+1)] != letter ? 1 : 0;
  corners += d && l && array[index+1] == letter && array[index-WIDTH] == letter && array[index-(WIDTH-1)] != letter ? 1 : 0;
  corners += l && u && array[index+1] == letter && array[index+WIDTH] == letter && array[index+(WIDTH+1)] != letter ? 1 : 0;

  origin[index] = [l, r, u, d, corners];
  return [area, perimeter, corners];  
}

const build = d.reduce((a, e, i) => {
      if (!a.hasOwnProperty(i)) {
        let [area, perimeter, edges] = checkCell(e, i, a, d);
        a[''.concat(e, i)] = [area, perimeter, edges];
      }
      return a;
  }, {});
let result = 0;
let part2 = 0;
for (let key of Object.keys(build)) {
  const m = key.match(/([A-z]+)(\d+)/i);
  if (m && m.length == 3) {
    result += build[key][0] * build[key][1];
    part2 += build[key][0] * build[key][2];
  }
}
console.table(build);
console.log("part1:",result);
console.log("part2:", part2);
