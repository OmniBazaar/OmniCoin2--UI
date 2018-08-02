import fs from 'fs';
import uuid from 'uuid/v4';
import path from 'path';
import { getStoredCurrentUser } from '../blockchain/auth/services';
import { getUserDataFolder, checkDir, copyFile } from '../fileUtils';

const getImageFolder = () => {
  const userDataPath = getUserDataFolder();
  return path.resolve(userDataPath, 'listingDefaults');
};

export const getImageFilePath = (fileName) => path.resolve(getImageFolder(), fileName);

export const saveImage = (file) => new Promise(async (resolve, reject) => {
  try {
    const saveFolder = getImageFolder();
    console.log(saveFolder);
    await checkDir(saveFolder);
    const ext = file.name.split('.').pop();
    const fileName = `${uuid()}.${ext}`;
    const filePath = await copyFile(file.path, path.resolve(saveFolder, fileName));

    resolve({
      path: filePath,
      fileName
    });
  } catch (err) {
    reject(err);
  }
});

export const deleteImage = (fileName) => new Promise((resolve, reject) => {
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
  } else {
    resolve();
  }
});

const listingDefautlStorageKey = 'listingDefault';

export const getStoredListingDefautls = () => {
  const user = getStoredCurrentUser();
  if (user) {
    const key = `${listingDefautlStorageKey}_${user.username}`;
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  }

  return {};
};

export const storeListingDefaults = (listingDefaults) => {
  const user = getStoredCurrentUser();
  if (user) {
    const key = `${listingDefautlStorageKey}_${user.username}`;
    localStorage.setItem(key, JSON.stringify(listingDefaults));
  }
};
