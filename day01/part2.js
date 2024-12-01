import { open } from 'node:fs/promises';
import readline from 'node:readline/promises';

let fd;
try {
  fd = await open('input.txt', 'r');
  const stream = fd.createReadStream();

  const rd = readline.createInterface({
    input: stream,
    output: process.stdout,
    console: false
  });
  let columnA = [];
  let columnB = [];
  for await (const line of rd) {
    console.log(line);
    let columns = line.split("  ");
    if (columns.length == 2) {
      columnA.push(Number(columns[0]));
      columnB.push(Number(columns[1]));
    }
  }
  if (columnA.length != columnB.length) {
    throw(Error("Columns not same length!"));
  }
  columnA = columnA.sort();
  columnB = columnB.sort();
  let differentArr = [];
  columnA.forEach((a) => {
    differentArr.push(a * columnB.filter((b) => b == a).length);
  });
  const result = differentArr.reduce((a, b) => a + b);
  console.log(result);

} finally {
  await fd?.close();
}
