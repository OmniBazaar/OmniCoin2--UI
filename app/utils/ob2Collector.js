/* eslint-disable */
import * as fs from 'fs';

const basePath = './app/ob2';
const outputPath = './app/dist/ob2';
const copy = path => fs.createReadStream(path).pipe(fs.createWriteStream(outputPath));

switch (process.platform) {
  case 'win32':
    copy(basePath + '/windows/ob2.exe');
    break;
  case 'linux':
    copy(basePath + '/linux/ob2');
    break;
  case 'darwin':
    copy(basePath + '/mac/ob2');
}
