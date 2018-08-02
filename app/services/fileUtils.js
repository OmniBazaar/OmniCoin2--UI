import fs from 'fs';
import electron from 'electron';

export const isDir = (path) => fs.lstatSync(path).isDirectory();

export const checkDir = (dir) => new Promise((resolve, reject) => {
  if (!fs.existsSync(dir) || !isDir(dir)) {
    fs.mkdir(dir, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  } else {
    resolve();
  }
});

export const getUserDataFolder = () => (electron.app || electron.remote.app).getPath('userData');

export const copyFile = (source, target) => new Promise((resolve, reject) => {
  const r = fs.createReadStream(source);
  r.on('error', err => {
    reject(err);
  });
  const w = fs.createWriteStream(target);
  w.on('error', err => {
    reject(err);
  });
  w.on('close', () => {
    resolve(target);
  });
  r.pipe(w);
});

export const isExist = (path) => fs.existsSync(path);

export const writeFile = (path, content) => new Promise((resolve, reject) => {
  fs.writeFile(path, content, (err) => {
    if (err) {
      reject(err);
      return;
    }

    resolve();
  });
});

export const readFile = (path) => new Promise((resolve, reject) => {
  fs.readFile(path, (err, content) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(content.toString('utf8'));
  });
});
