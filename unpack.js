const msgpack = require("@msgpack/msgpack");
const fs = require("fs");
const path = require("path");

const myArgs = process.argv.slice(3);
if (myArgs.length < 2) {
  console.log("Usage: unpack <source> <destination>");
  console.log("Example: unpack ./next-example.pack ./next-example");
  process.exit(0);
}

console.log("Reading pack file...");
const sourceFilePath = path.join(process.cwd(), myArgs[0]);
const pack = fs.readFileSync(sourceFilePath);

console.log("Decoding pack file...");
const index = msgpack.decode(pack);

const targetDir = path.join(process.cwd(), myArgs[1]);

console.log("Creating target directory...");
fs.mkdirSync(targetDir, { recursive: true });

console.log("Writing files...");
for (const [filepath, content] of Object.entries(index)) {
  const absolutePath = path.join(targetDir, filepath.substring(1));

  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content);
}

console.log("Done");
