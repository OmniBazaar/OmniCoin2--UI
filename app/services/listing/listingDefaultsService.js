import { app } from 'electron';
import fs from 'fs';
import uuid from 'uuid/v4';
import path from 'path';
import { getStoredCurrentUser } from '../blockchain/auth/services';

const isDir = (path) => {
  return fs.lstatSync(path).isDirectory();
}

const checkDir = (dir) => {
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

const getImageFolder = () => {
  return path.resolve(app.getAppPath(), '/listingDefaults');
}

const copyFile = (source, target) => {
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

export const saveImage = (file) => {
  return new Promise(async (resolve, reject) => {
    try{
      const saveFolder = getImageFolder();
      console.log(saveFolder);
      await checkDir(saveFolder);
      const ext = file.name.split('.').pop();
      const fileName = uuid() + `.${ext}`;
      const filePath = await copyFile(file.path, path.resolve(saveFolder, fileName));

      resolve({
        path: filePath,
        fileName
      });
    } catch (err) {
      reject(err);
    }
  });
}

export const deleteImage = (fileName) => {
  return new Promise((resolve, reject) => {
    const saveFolder = getImageFolder();
    const filePath = path.resolve(saveFolder, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  });
}

const listingDefautlStorageKey = 'listingDefault';

export const getStoredListingDefautls = () => {
  const user = getStoredCurrentUser();
  const key = `${listingDefautlStorageKey}_${user.username}`;
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }

  return null;
}

export const storeListingDefaults = (listingDefaults) => {
  const user = getStoredCurrentUser();
  const key = `${listingDefautlStorageKey}_${user.username}`;
  localStorage.setItem(key, JSON.stringify(listingDefaults));
}