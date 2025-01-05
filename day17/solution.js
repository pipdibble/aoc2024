import { readFileSync } from 'node:fs'
import { argv0 } from 'node:process';

let data = readFileSync('input.txt', {
  encoding: 'utf8',
  flag: 'r'
});

let regA = parseInt(/Register A: (\d+)/.exec(data)[1]);
let regB = parseInt(/Register B: (\d+)/.exec(data)[1]);
let regC = parseInt(/Register C: (\d+)/.exec(data)[1]);
let regIP = 0; // Instruction Pointer/Programme Counter
let regSkipInc = false;
let prog = /Program: (\d+(,\d+)*)/.exec(data)[1].split(',');
let stack = [];

const cOp = {
  '0': () => { return 0 },
  '1': () => { return 1 },
  '2': () => { return 2 },
  '3': () => { return 3 },
  '4': () => { return regA },
  '5': () => { return regB },
  '6': () => { return regC },
  '7': () => { return null }
} // Combo Operands

const opcodes = {
  '0' : (op) => { // adv
    regA = Math.floor(regA / (Math.pow(2, cOp[op]())));
    return regA;
  },
  '1': (op) => { // bxl
    regB ^= op;
    return regB;
  },
  '2': (op) => { // bst
    regB = ((cOp[op]() % 8) + 8) % 8;
    return regB;
  },
  '3': (op) => { // jnz
    if (regA != 0) {
      regIP = parseInt(op);
      regSkipInc = true;
      return true;
    } else {
      return false;
    }
  },
  '4': (op) => { // bxc
    regB ^= regC;
    return regB;
  },
  '5': (op) => { // out
    let val = ((cOp[op]() % 8) + 8) % 8;
    stack.push(val);
    return val;
  },
  '6': (op) => {  // bdv
    regB = Math.floor(regA / (Math.pow(2, cOp[op]())));
    return regB;
  },
  '7': (op) => { // cdv
    regC = Math.floor(regA / (Math.pow(2, cOp[op]())));
    return regC;
  }
}

const main = () => {
  while (regIP < prog.length) {
    regSkipInc = false;
    opcodes[prog[regIP]](prog[regIP+1]);
    if (!regSkipInc)
      regIP += 2;
  }
}

main();
console.log(prog.toString());
console.log("Part1",stack.toString());

const main2 = () => {
  let found = false;
  let a = 0;
  let s = 1;
  while (!found) {
    regA = a;
    regIP = 0;
    stack = [];
    main();
    if (stack.toString() === prog.toString()) {
      found = true;
      regA = a;
    } else if (stack.toString() === prog.slice(-1 * s).toString()) {
      a *= 8;
      s++;
    } else {
      a++;
    }
  }
  console.log("part2",regA);
}

main2();


