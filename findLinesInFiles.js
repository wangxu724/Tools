const fs = require('fs');
const path = require('path');
var os = require('os')

let targetStringRegex = /<some string>/g;
let targetFilenameRegex = /^SomeFileName$/g;
let folderPath = '<some folder path>';
let outputFile = '<output file name>';

function main() {
    try {
        let filePaths = getSortedLogFileFullPath(folderPath);
        let outputStream = fs.createWriteStream(outputFile);

        filePaths.forEach(fileName => {
            console.log(`Processing file: ${fileName}`);
            let lines = processFile(fileName);
            if (lines.length > 0) {
                //outputStream.write(`${fileName}${os.EOL}`);
                lines.forEach(rlt => outputStream.write(`${rlt}${os.EOL}`))
                //outputStream.write(`${os.EOL}${os.EOL}`);
            }
        });
        outputStream.end();
    } catch (err) {
        console.log(err);
    }
}

function getSortedLogFileFullPath(folderPath) {
    try {
        return fs.readdirSync(folderPath)
            .map(fileName => path.join(folderPath, fileName))
            .filter(fileName => targetFilenameRegex.test(fileName) && fs.lstatSync(fileName).isFile())
            .sort();
    } catch(err) {
        console.log(err);
    }
}

function processFile(fileFullPath) {
    try {
        const content = fs.readFileSync(fileFullPath, 'utf8');
        return findMatchedLines(content.split(os.EOL));
    } catch (err) {
        console.error(err);
    }
}

function findMatchedLines(lines) {
    return (lines||[]).filter(line => targetStringRegex.test(line));
}

main();