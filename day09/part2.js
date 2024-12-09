import { open } from 'node:fs/promises';
import { argv0 } from 'node:process';
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
    let fileSize = 0;
    //console.log(disk);
    for (let i = disk.length-1; i >= 0; i -= fileSize) {
      fileSize = 0;
      if (disk[i] != '.') {
        while ((i - fileSize >= 0) && disk[i] == disk[i - fileSize]) {
          fileSize++;
        }

        let firstSpace;
        let count = 0;
        for (firstSpace = disk.indexOf('.'); count != fileSize && firstSpace >= 0; firstSpace++) {
          if (disk[firstSpace] == '.') {
            count++;
          } else {
            count = 0;
          }
          if (firstSpace > i)
            firstSpace = -2;
        }
        if (firstSpace >= 0)
          firstSpace -= fileSize;

        if (firstSpace >= 0 && firstSpace <= i) {
          for (let x = 0; x < fileSize; x++) {
            disk[firstSpace + x] = disk[i - x];
            disk[i - x] = '.';
          }
        }
        //console.log("i", i, "fileSize", fileSize, "firstSpace", firstSpace);
        //console.log(disk);
      } else {
        while(disk[i] == '.' && i >= 0) {
          i--;
        }
      }
    }
    let result = 0;
    for (let i = 0; i < disk.length; i++) {
      if (disk[i] != '.')
        result += i * parseInt(disk[i]);
    }
    console.log("Result: ", result);
  }
} finally {
  await fd?.close();
}
