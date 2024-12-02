import { open } from 'node:fs/promises';
import readline from 'node:readline/promises';

let fd;
try {
  fd = await open('input.txt', 'r');
  const stream = fd.createReadStream();

  const rd = readline.createInterface({
    input: stream,
    output: process.stdout,
    console:false
  });

  let safeCount = 0;

  for await (const line of rd) {
    const numList = line.split(' ');
    let lastNum = 0;
    let direction = "unknown";
    if (numList.length >= 1) 
      lastNum = Number(numList[0]);
    let lineSafe = true;
    for (let i = 1; i < numList.length && lineSafe; i++) {
      const currentNum = Number(numList[i]);
      if (lastNum < currentNum) {
        if (direction == "unknown") 
          direction = "increasing";
        if (direction == "decreasing") {
          lineSafe = false;
        }
      } else if (lastNum > currentNum) {
        if (direction == "unknown")
          direction = "decreasing";
        if (direction == "increasing") {
          lineSafe = false;
        }
      } else {
        // The numbers are the same, can't have that
        lineSafe = false;
      }
      const difference = Math.abs(lastNum - numList[i]);
      if (!(difference >= 1 && difference <= 3)) {
        lineSafe = false;
      }
      lastNum = currentNum;
    }
    if (lineSafe)
      safeCount++;
  }
  console.log(safeCount);
} finally {
  fd?.close();
}
