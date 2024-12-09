import { open } from 'node:fs/promises';
import readline from 'node:readline/promises';

let fd;
try {
  fd = await open('./input.txt', 'r');
  const stream = fd.createReadStream();
  const rd = readline.createInterface({
    input: stream,
    output: process.stdout,
    console: false
  });
  for await (const line of rd) {
    const lineArr = line.split('');
    let fileId = 0;
    let disk = lineArr.reduce((acc,x,y) => {
      const fileEntry = y%2 == 0;
      for (let i = 0; i < x; i++) {
        if (fileEntry) {
          acc.push(fileId);
        } else {
          acc.push('.');
        }
      }
      fileId = fileEntry ? fileId + 1 : fileId;
      return acc;
    }, []);
    console.log("disk:",disk, disk.length);
    for (let i = disk.length-1; i >= 0; i--) {
      const firstSpace = disk.indexOf('.');
      if (firstSpace >= 0 && firstSpace < i && disk[i] != '.') {
        //console.log(firstSpace,disk.slice(0, firstSpace), disk[i], disk.slice(firstSpace+1, disk.length-1), '.');
        //disk = disk.slice(0,firstSpace).concat(disk[i], disk.slice(firstSpace+1, disk.length-1), '.');
        disk[firstSpace] = disk[i];
        disk[i] = '.'
      }
    }
    console.log("disk: ",disk, disk.length);
    let result = 0;
    for (let i = 0; i < disk.length; i++) {
      if (parseInt(disk[i]))
        result += i * parseInt(disk[i]);
    }
    console.log("Result: ", result);
  }
} finally {
  await fd?.close();
}
