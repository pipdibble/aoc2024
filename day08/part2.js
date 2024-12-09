import { readFileSync } from 'node:fs';

const data = readFileSync('./input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

const map = {};
const mapSize = {};
const dataArr = data.split('\r\n')
  .map(line => line.split(''))
  .filter(line => line.length > 0)
  .map((a,y) => {
    a.map((b,x) => {
      if(b != '.') {
        if (map[b])
          map[b].push([x, y]);
        else {
          map[b] = [];
          map[b].push([x, y]);
        }
      }
      return b;
    })
    mapSize.y = a.length;
    return a;
  });
mapSize.x = dataArr.length;
const points = new Set();
for (const antennae of Object.keys(map)) {
  const count = map[antennae].length;
  for (const coord in map[antennae]) {
    const a1 = map[antennae][coord];
    for (let comp = 0; comp < count; comp++) {
      if (coord != comp) {
        const a2 = map[antennae][comp];
        const xDiff = a2[0] - a1[0];
        const yDiff = a2[1] - a1[1];
        let bx = a2[0] + xDiff;
        let by = a2[1] + yDiff;
        while (bx >= 0 && bx < mapSize.x && by >= 0 && by < mapSize.y)  {
          points.add(''.concat(bx,",",by));
          dataArr[by][bx] = '#';
          bx += xDiff;
          by += yDiff;
        }
      }
    }
  }
}
console.table(map);
//console.log("result:",points.size);
console.log("result:",dataArr.flat().filter(x => x != '.').length);

