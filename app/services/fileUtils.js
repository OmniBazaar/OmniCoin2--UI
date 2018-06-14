import fs from 'fs';
import electron from 'electron';

export const isDir = (path) => {
  return fs.lstatSync(path).isDirectory();
}

export const checkDir = (dir) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir) || !isDir(dir)) {
      fs.mkdir(dir,  (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
};

export const getUserDataFolder = () => {
  return (electron.app || electron.remote.app).getPath('userData');
}

export const copyFile = (source, target) => {
  return new Promise((resolve, reject) => {
    const r = fs.createReadStream(source);
    r.on('error', err => {
      reject(err);
    });
    const w = fs.createWriteStream(target);
    w.on("error", err => {
      reject(err);
    });
    w.on("close", () => {
      resolve(target);
    });
    r.pipe(w);
  });
}

export const isExist = (path) => {
  return fs.existsSync(path);
}

export const writeFile = (path, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

export const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(content.toString('utf8'));
    });
  });
}