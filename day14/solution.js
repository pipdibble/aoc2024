import { readFileSync } from 'node:fs';

const WIDTH = 101;
const HEIGHT = 103;
const SECONDS = 100;

const data = readFileSync('input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

class Robot {
  constructor(s) {
    const { px, py, vx, vy } = /p=(?<px>-{0,1}\d+),(?<py>-{0,1}\d+) v=(?<vx>-{0,1}\d+),(?<vy>-{0,1}\d+)/.exec(s).groups;
    this.px = parseInt(px);
    this.py = parseInt(py);
    this.vx = parseInt(vx);
    this.vy = parseInt(vy);
  }

  move() {
    this.px += this.vx;
    this.py += this.vy;
    if (this.px < 0)
      this.px += WIDTH;
    if (this.py < 0)
      this.py += HEIGHT;
    if (this.px >= WIDTH)
      this.px -= WIDTH;
    if (this.py >= HEIGHT)
      this.py -= HEIGHT;
  }

  get position() {
    return [this.px, this.py];
  }
  
  isBound(topLeft, bottomRight) {
    return topLeft[0] <= this.px && bottomRight[0] > this.px && topLeft[1] <= this.py && bottomRight[1] > this.py;
  }
}

const robots = [];
data.split('\n')
  .filter(x => x.length > 0)
  .map((y) => {
    const r = new Robot(y);
    robots.push(r);
    return y;
  });

for (let i = 0; i < SECONDS; i++) {
  for (const robot of robots) {
    robot.move();
  }
}

const q1 = robots.reduce((a, x) => {
  return x.isBound([0, 0], [Math.floor(WIDTH/2), Math.floor(HEIGHT/2)]) ? a + 1 : a;
}, 0);
const q2 = robots.reduce((a, x) => {
  return x.isBound([Math.ceil(WIDTH/2), 0], [WIDTH, Math.floor(HEIGHT/2)]) ? a + 1 : a;
}, 0);
const q3 = robots.reduce((a, x) => {
  return x.isBound([0, Math.ceil(HEIGHT/2)], [Math.floor(WIDTH/2), HEIGHT]) ? a + 1: a;
}, 0);
const q4 = robots.reduce((a, x) => {
  return x.isBound([Math.ceil(WIDTH/2), Math.ceil(HEIGHT/2)], [WIDTH, HEIGHT]) ? a + 1 : a;
}, 0);
console.log(q1*q2*q3*q4);

for (let i = SECONDS; i < 19000; i++) {
  let count = 0;
  const arr = new Array(HEIGHT);
  for (let x = 0; x < arr.length; x++) {
    arr[x] = new Array(WIDTH).fill('.');
  }
  robots.map(a => {
    const [x, y] = a.position;
    arr[y][x] = '#';
    if (a.isBound([Math.floor(WIDTH*0.25), Math.floor(HEIGHT*0.25)], [Math.floor(WIDTH*0.75), Math.floor(HEIGHT*0.75)]))
      count = count + 1;
    a.move();
  });
  if (count >= Math.floor(robots.length/2)) {
    console.log(i);
    for (let x = 0; x < arr.length; x++) {
      console.log(arr[x].join(''));
    }
  }
}
