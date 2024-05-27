/* const fs = require("node:fs/promises");

async function main() {
  console.time("WriteMany");
  const file = await fs.open("./the-file.txt", "w");
  for (let i = 0; i < 1_000_000; i++) {
    file.write("Life's meant to be lived\n");
  }
  file.close();
  console.timeEnd("WriteMany");
} */

/* const fs = require("node:fs");

async function main() {
  fs.open("./the-file.txt", "w", (err, fd) => {
    console.time("WriteMany");
    for (let i = 0; i < 1_000_000; i++) {
      fs.writeSync(fd, ` ${i} `);
    }
    console.timeEnd("WriteMany");
  });
} */

const { Buffer } = require("node:buffer");
const fs = require("node:fs/promises");

/* Super fast But DONT DO IT THIS WAY IN PROD 
  It uses too much memory
*/
/* async function main() {
  console.time("WriteMany");
  const file = await fs.open("./the-file.txt", "w");
  const stream = file.createWriteStream();

  for (let i = 0; i < 1_000_000; i++) {
    const buff = Buffer.from(` ${1} `, "utf-8");
    stream.write(buff);
  }
  file.close();
  console.timeEnd("WriteMany");
} */

async function main() {
  console.time("WriteMany");
  const file = await fs.open("./the-file.txt", "w");
  const stream = file.createWriteStream();

  let i = 0;
  let drainings = 0;
  const writeMany = () => {
    while (i < 1_000_000) {
      const chunk = Buffer.from(` ${i + 1} `, "utf-8");
      const isWritable = stream.write(chunk);

      if (i === 999999) {
        stream.end(chunk);
      }

      if (!isWritable) {
        console.log("[FULL]: stop");
        break;
      }
      i++;
    }
  };

  writeMany();

  stream.on("drain", () => {
    console.log(`[DRAIN] - ${++drainings}: continue...`);
    writeMany();
  });

  stream.on("finish", () => {
    console.log("[THE END]");
    file.close();
    console.timeEnd("WriteMany");
  });
}

main();
