import { open } from 'node:fs/promises';
import readline from 'node:readline/promises';

const reportCheck = (report) => {
  let lastNum = Number(report[0]);
  let direction = "unknown";
  let safe = true;
  for (let i = 1; i < report.length && safe; i++) {
    const currentNum = Number(report[i]);
    if (direction == "unknown")
      direction = lastNum < currentNum ? "increasing" : "decreasing";
    safe = lastNum < currentNum && direction != "increasing" ? false : safe;
    safe = lastNum > currentNum && direction != "decreasing" ? false : safe;
    const difference = Math.abs(lastNum - currentNum);
    if (difference < 1 || difference > 3)
      safe = false;
    lastNum = currentNum;
  }
  return safe;
}

const problemDampener = (report) => {
  let safe = false;
  for (let i = 0; i < report.length && !safe; i++) {
    safe = reportCheck(report.toSpliced(i, 1));
  }
  return safe;
}

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
    let numbers = line.split(" ");
    let safe = reportCheck(numbers);
    if (!safe) {
      safe = problemDampener(numbers);
    }
    if (safe)
      safeCount++;
  }

  console.log(safeCount);

} finally {
  fd?.close();
}
