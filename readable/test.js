// index.js
const fs = require("fs");

function test() {
  setTimeout(() => console.log(`$this is setTimeout 1`), 0);

  fs.readFile(__filename, () => {
    console.log(`$this is readFile 1`);
  });
}

for (let i = 0; i <= 10; i++) {
  setTimeout(() => test(i), i);
}
