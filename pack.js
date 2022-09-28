const msgpack = require("@msgpack/msgpack");
const fs = require("fs");
const path = require("path");

const index = {};
function processDirectory(dirpath, root) {
  const entries = fs.readdirSync(dirpath, { withFileTypes: true });
  for (const entry of entries) {
    const fullpath = path.join(dirpath, entry.name);
    if (entry.isFile()) {
      const indexPath = "/" + path.relative(root, fullpath);
      index[indexPath] = fs.readFileSync(fullpath);
    } else {
      processDirectory(fullpath, root);
    }
  }
}

const myArgs = process.argv.slice(2);
if (myArgs.length < 2) {
  console.log("Usage: pack <source> <destination>");
  console.log("Example: pack ./nextjs-example ../next-example.pack");
  process.exit(0);
}

const PACK_TARGET_PATH = path.join(process.cwd(), myArgs[1]);
try {
  fs.rmSync(PACK_TARGET_PATH);
  console.log("Removed old pack file");
} catch (err) {
  // no old pack file...
}

console.log("Indexing file tree...");
const sourceDir = path.join(process.cwd(), myArgs[0])
processDirectory(sourceDir, process.cwd());
console.log("Indexed", Object.keys(index).length, "files");

console.log("Creating pack file...");
const packed = msgpack.encode(index);
fs.writeFileSync(PACK_TARGET_PATH, packed);
console.log("Created pack file");
