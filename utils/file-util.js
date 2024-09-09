const fs = require("fs");
const lineReader = require("line-reader");
const readline = require("readline");

const FILE_HEADER = "public,secret";

function writeToFile(filePath, datas) {
  const writer = fs.createWriteStream(filePath, {
    flags: "a",
  });

  datas.forEach((data) => {
    writer.write(data);
  });

  writer.end();
}

function processWithFileSecret(filePath, callBack) {
  lineReader.eachLine(filePath, (keyPair) => {
    if (keyPair !== FILE_HEADER) {
      const secret = keyPair.substring(keyPair.indexOf(",") + 1);
      callBack(secret);
    }
  });
}

function readToArray(filePath) {
  const lines = [];
  // const readInterface = readline.createInterface({
  //   input: fs.createReadStream(filePath),
  //   output: process.stdout,
  //   console: false,
  // });

  // readInterface.on("line", (line) => {
  //   lines.push(line);
  // });

  // console.log(`lines: ${lines}`);

  // return lines;

  const text = fs.readFileSync(filePath).toString("utf8");
  var textByLine = text.split("\n");

  return textByLine;
}

module.exports = { processWithFileSecret, readToArray, writeToFile };
