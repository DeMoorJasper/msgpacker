#!/usr/bin/env node
const command = process.argv[2];
switch (command) {
  case "pack":
    require("./pack");
    break;
  case "unpack":
    require("./unpack");
    break;
  default:
    console.log("Available commands:");
    console.log("msgpacker pack");
    console.log("msgpacker unpack");
    break;
}
