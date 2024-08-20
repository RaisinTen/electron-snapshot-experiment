require('./v8-snapshots-util.js');

const { TraceEvents, trackRequires } = require('perftrace');
const { performance } = require('node:perf_hooks');

const traceEvents = new TraceEvents();

trackRequires(true);

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

process.on('exit', () => {
  const events = traceEvents.getEvents();
  traceEvents.destroy();
  require('fs').writeFileSync('events.json', JSON.stringify(events));
});

performance.mark('requires');

require('./unsnapshottable');

const semver = require('semver');
const circularJSON = require('circular-json');
const _ = require('lodash');
const async = require('async');
const i18n = require('i18next');
const jsonStorage = require('electron-json-storage');
const uuidV4 = require('uuid/v4');
const nedb = require('nedb');
const sentry = require('@sentry/node');
const sh = require('shelljs');
const sudo = require('sudo-prompt');
const SerializedError = require('serialised-error');
const initializeUpdater = require('@postman/app-updater').init;
const { WebSocketServer } = require('ws');
const { encryptAES, decryptAES } = require('@raisinten/aes-crypto-js');

performance.measure('requires', 'requires');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

performance.measure('startup');
