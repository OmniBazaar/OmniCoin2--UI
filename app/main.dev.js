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
import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import sudo from 'sudo-prompt';
import kill from 'kill-port';
import log from 'electron-log'; // do not remove
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "omnibazaarerror@gmail.com",
    pass: "klRtm45Js"
  }
});


let mainWindow = null;

const nodePort = 8099;

const nodeDaemonWinOptions = {
  name: 'OmniBazaar',
};

const isProd = () => process.env.NODE_ENV === 'production';

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
  const ls = spawn(path, ['--rpc-endpoint', '127.0.0.1:8098']);
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

const getDevBasePath = () => './app/ob2';

const getProdBasePath = (platform) => {
  switch (platform) {
    case 'win32':
      return `${process.env.LOCALAPPDATA}/OmniBazaar`;
    case 'linux':
      return `${process.env.HOME}/.OmniBazaar`;
    case 'darwin':
      return `${process.env.HOME}/Library/Application Support/OmniBazaar`;
  }
};

const getOb2DevPath = () => {
  const basePath = getDevBasePath();
  switch (process.platform) {
    case 'win32':
      return `${basePath}/windows/ob2.exe`;
    case 'linux':
      return `${basePath}/linux/ob2`;
    case 'darwin':
      return `${basePath}/mac/ob2`;
  }
};

const getOb2ProdPath = () => {
  const basePath = getProdBasePath(process.platform);
  switch (process.platform) {
    case 'win32':
      return `${basePath}/ob2.exe`;
    case 'linux':
      return `${basePath}/ob2`;
    case 'darwin':
      return `${basePath}/ob2`;
  }
};


const getNodeDirProdPath = () => `${getProdBasePath(process.platform)}/witness_node`;

const getNodeDirDevPath = () =>
  getNodeDirProdPath()
  // return getDevBasePath() + '/witness_node';
;

const killNode = async () => {
  if (process.platform === 'win32') {
    exec(`taskkill /F /IM witness_node.exe`);
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  } else {
    await kill(nodePort);
  }
};


const runNode = async () => {
  let path = getNodeDirDevPath();
  if (isProd()) {
    path = getNodeDirProdPath();
  }
  let nodePath = `${path}/witness_node`;
  if (process.platform === 'win32') {
    nodePath = `${path}/witness_node.exe`;
  }
  await killNode();

  const nodeProcess = spawn(nodePath);
  nodeProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  nodeProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  nodeProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
};


const restartNodeIfExists = (witnessId, pubKey, privKey) => {
  let path = getNodeDirDevPath();
  if (isProd()) {
    path = getNodeDirProdPath();
  }
  fs.readFile(`${path}/witness_node_data_dir/config.ini`, 'utf8', (err, data) => {
    if (err) {
      console.log('ERROR ', err);
    } else {
      const wStart = data.indexOf('#witness-id') !== -1 ? data.indexOf('#witness-id') : data.indexOf('witness-id');
      const wEnd = data.indexOf('\n', wStart);
      data = data.replace(data.substring(wStart, wEnd), `witness-id = "${witnessId}"`);
      const pStart = data.indexOf('#private-key') !== -1 ? data.indexOf('#private-key') : data.indexOf('private-key');
      const pEnd = data.indexOf('\n', pStart);
      data = data.replace(data.substring(pStart, pEnd), `private-key = ["${pubKey}", "${privKey}"]`);
      fs.writeFile(`${path}/witness_node_data_dir/config.ini`, data, (err) => {
        console.log('ERROR ', err);
      });
      runNode();
    }
  });
};


const launchNodeDaemon = async () => {
  switch (process.platform) {
    case 'win32':
      await killNode();
      const userName = process.env.USERPROFILE.split(path.sep)[2];
      const nodePath = `C:\\Users\\${userName}\\AppData\\Local\\OmniBazaar\\witness_node\\witness_node`;
      await runNode();
      return sudo.exec(`reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v "OmniBazaar Witness Node" /d ${nodePath}`, nodeDaemonWinOptions);
    case 'linux':
      return sudo.exec('systemctl daemon-reload' +
        'systemctl enable omnibazaar-publisher.service' +
        'systemctl start omnibazaar-publisher.service');
    case 'darwin':
      return exec('launchctl load -w /Library/LaunchAgents/omnibazaar.witness_node.plist && ' +
        'launchctl start -w /Library/LaunchAgents/omnibazaar.witness_node.plist');
  }
};

const stopNodeDaemon = () => {
  switch (process.platform) {
    case 'win32':
      return sudo.exec('reg delete HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v "OmniBazaar Witness Node" /f ', nodeDaemonWinOptions);
    case 'linux':
      return sudo.exec('systemctl stop omnibazaar-publisher.service');
    case 'darwin':
      return exec('launchctl unload /Library/LaunchAgents/omnibazaar.witness_node.plist');
  }
};

const runOb2 = async () => {
  if (isProd()) {
    const path = getOb2ProdPath();
    handleOb2Connection(path);
  } else {
    const path = getOb2DevPath();
    handleOb2Connection(path);
  }
};


const processReferrer = async () => {
  let path = './';
  switch (process.platform) {
    case 'win32':
      path = `${process.env.APPDATA}/OmniBazaar/omnibazaar.set`;
      break;
    case 'linux':
      path = `${process.env.HOME}/.OmniBazaar/omnibazaar.set`;
      break;
    case 'darwin':
      path = `${process.env.HOME}/Library/Preferences/OmniBazaar/omnibazaar.set`;
      break;
  }
  ipcMain.on('get-referrer', (event) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        //console.log('ERR ', err);
        event.sender.send('receive-referrer', { referrer: '' });
      } else {
        let start = data.lastIndexOf('-') + 1;
        const end = data.lastIndexOf('.');

		if (start === 0) {
			start = end;
		}

        event.sender.send('receive-referrer', { referrer: data.substring(start, end) });
      }
    });
  });
};

const getAppVersion = () => {
  ipcMain.on('get-app-version', (event) => {
    event.sender.send('receive-app-version', { appVersion: app.getVersion() });
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

const runBitcoinCli = async () => {
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
 // if (process.platform !== 'darwin') {
    app.quit();
 // }
});

// shouldQuit will be truthy if another instance of this app attempts to start
// and therefore, we'll finish the process
const shouldQuit = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.focus();
  }
});

if (shouldQuit) {
  app.quit();
}


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }
  await processReferrer();
  await runOb2();
  await processMacAddress();
  await runBitcoinCli();
  getAppVersion();

  ipcMain.on('restart-node', (event, witnessId, pubKey, privKey) => {
    restartNodeIfExists(witnessId, pubKey, privKey);
  });
  ipcMain.on('launch-node-daemon', () => launchNodeDaemon());
  ipcMain.on('stop-node-daemon', () => stopNodeDaemon());
  ipcMain.on('exit', () => app.quit());
  ipcMain.on('open-pdf', (event, pdf) => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        plugins: true
      }
    });
    win.loadURL(pdf);
  });
  ipcMain.on('report-error', (event, errorLog, username) => {
    const mailOptions = {
      from: 'sender@email.com',
      to: 'swoopyyy@gmail.com, kate.f@scopicsoftware.com',
      subject: 'Omnibazar error report - ' + username,
      html: errorLog
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err);
      else
        console.log(info);
    });
  });

  mainWindow = new BrowserWindow({
    show: false,
    width: 1124,
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
