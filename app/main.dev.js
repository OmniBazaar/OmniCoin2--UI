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

const isProd = () => {
  return process.env.NODE_ENV === 'production';
};

if (isProd()) {
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
  let ls = spawn(path, ["--rpc-endpoint", "127.0.0.1:8098"]);
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    setTimeout(() => handleOb2Connection(path), 1500);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    ls.kill();
    setTimeout(() => handleOb2Connection(path), 1500);
  });
};

const getDevBasePath = () => {
  return './app/ob2';
};

const getProdBasePath = (platform) => {
  switch (platform) {
    case 'win32':
      return process.env.LOCALAPPDATA + '/OmniBazaar 2';
    case 'linux':
      return process.env.HOME + '/.OmniBazaar';
    case 'darwin':
      return process.env.HOME + '/Library/Application Support/OmniBazaar 2';
  }
};

const getOb2DevPath = () => {
  const basePath = getDevBasePath();
  switch (process.platform) {
    case 'win32':
      return basePath + '/windows/ob2.exe';
    case 'linux':
      return basePath + '/linux/ob2';
    case 'darwin':
      return basePath + '/mac/ob2';
  }
};

const getOb2ProdPath = () => {
  const basePath = getProdBasePath(process.platform);
  switch (process.platform) {
    case 'win32':
      return  basePath + '/ob2.exe';
    case 'linux':
      return basePath + '/ob2';
    case 'darwin':
      return basePath + '/ob2';
  }
};


const getNodeDirProdPath = () => {
  return getProdBasePath(process.platform) + '/witness_node';
};

const getNodeDirDevPath = () => {
  return getNodeDirProdPath();
 // return getDevBasePath() + '/witness_node';
};


const runNode = () => {
  let path = getNodeDirDevPath();
  if (isProd()) {
    path = getNodeDirProdPath();
  }
  let nodePath =  path + '/witness_node';
  if (process.platform === 'win32') {
    nodePath = path + '/witness_node.exe'
  }
  let ls = spawn(nodePath);
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
};


const restartNodeIfExists = (witnessId, pubKey, privKey) => {
  let path = getNodeDirDevPath();
  if (isProd()) {
    path = getNodeDirProdPath();
  }
  console.log('WITNESS ID ', witnessId);
  fs.readFile(path + '/witness_node_data_dir/config.ini', 'utf8', function (err, data) {
    if (err) {
      console.log('ERROR ', err);
    } else {
      const wStart = data.indexOf('#witness-id') !== -1 ? data.indexOf('#witness-id') : data.indexOf('witness-id');
      const wEnd = data.indexOf('\n', wStart);
      data = data.replace(data.substring(wStart, wEnd), `witness-id = "${witnessId}"`);
      const pStart = data.indexOf('#private-key') !== -1 ? data.indexOf('#private-key') : data.indexOf('private-key');
      const pEnd = data.indexOf('\n', pStart);
      data = data.replace(data.substring(pStart, pEnd), `private-key = ["${pubKey}", "${privKey}"]`);
      fs.writeFile(path + '/witness_node_data_dir/config.ini', data, function(err) {
        console.log('ERROR ', err);
      });
      runNode();
    }
  });
};

const runOb2 = async () => {
  if (isProd()) {
    const path = getOb2ProdPath();
    handleOb2Connection(path);
   }
   else {
    const path = getOb2DevPath();
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
        const start = data.lastIndexOf('-') + 1;
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

  ipcMain.on('restart-node', (event, witnessId, pubKey, privKey) => {
    restartNodeIfExists(witnessId, pubKey, privKey);
  });


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
