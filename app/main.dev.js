/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import { machineId } from 'node-machine-id';
import getmac from 'getmac';
import MenuBuilder from './menu';
import bitcoincli from 'blockchain-wallet-service';
import { spawn } from 'child_process';
import fs from 'fs';

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}


if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};

const handleOb2Connection = (path) => {
  let ls = spawn(path);
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    ls.kill();
    handleOb2Connection(path);
  });
};

const runOb2 = async () => {
  const getOb2DevPath = () => {
    switch (process.platform) {
      case 'win32':
        return './app/ob2/windows/ob2.exe';
      case 'linux':
        return './app/ob2/linux/ob2';
      case 'darwin':
        return './app/ob2/mac/ob2';
    }
  };
  const getOb2ProdPath = () => {
    switch (process.platform) {
      case 'win32':
        return process.env.LOCALAPPDATA + '/OmniBazaar 2/ob2.exe';
      case 'linux':
        return process.env.HOME + '/.OmniBazaar/ob2';
      case 'darwin':
        return process.env.HOME + '/Library/Application Support/OmniBazaar 2/ob2';
    }
  };
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    const path = getOb2DevPath();
    handleOb2Connection(path);
   }
   else {
    const path = getOb2ProdPath();
    handleOb2Connection(path);
   }
};

const processReferrer = async () => {
  let path = './';
  switch (process.platform) {
    case 'win32':
      path = process.env.LOCALAPPDATA + '/OmniBazaar 2/omnibazaar.set';
      break;
    case 'linux':
      path = process.env.HOME + '/.OmniBazaar/omnibazaar.set';
      break;
    case 'darwin':
      path = '/Library/Preferences/OmniBazaar 2/omnibazaar.set';
      break;
  }
  ipcMain.on('get-referrer', (event) => {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        console.log('ERR ', err);
        event.sender.send('receive-referrer', { referrer: null });
      } else {
        const start = data.lastIndexOf('_') + 1;
        const end = data.lastIndexOf('.');
        event.sender.send('receive-referrer', { referrer: data.substring(start, end) });
      }
    });

  });
};

const processMacAddress = async () => {
  getmac.getMac((err, macAddress) => {
    if (err) throw err;
    machineId().then((hardDriveId) => {
      if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
        macAddress += Math.random();
        hardDriveId += Math.random();
      }
      ipcMain.on('get-pc-ids', (event) => {
        event.sender.send('receive-pc-ids', { macAddress, hardDriveId });
      });
    });
  });
};

const runBitcoinCli =  async () => {
  bitcoincli.start({
    port: 3000,
    bind: 'localhost',
    logLevel: 'info'
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }
  await processReferrer();
  await runOb2();
  await processMacAddress();
  await runBitcoinCli();


  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });


  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
