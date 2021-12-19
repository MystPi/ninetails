const { app, BrowserWindow, ipcMain } = require('electron');
const Datastore = require('@seald-io/nedb');
const path = require('path');

const userConfigDb = new Datastore({ filename: path.join(process.cwd(), './config/user-config.db'), autoload: true });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

ipcMain.handle('save-user-config', async (event, arg) => {
  if (typeof arg === 'object' && arg !== null && arg.hasOwnProperty('key') && arg.hasOwnProperty('value')) {
    const { key, value } = arg
    userConfigDb.update({ key }, {
      key,
      value
    }, { upsert: true }, (err, numReplaced, upsert) => {
      // TODO: handle errors
    })
  }
})

ipcMain.handle('load-user-config', async (event, arg) => {
  if (typeof arg === 'string') {
    return new Promise((resolve, reject) => {
      userConfigDb.findOne({ key: arg }, (err, result) => {
        if (err) {
          reject()
        }
        if (result) {
          resolve(result.value)
        } else {
          resolve(null)
        }
      })
    });
  }
})

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 450,
    minWidth: 450,
    icon: path.join(__dirname, '../appicons/ninetails.png'),
    webPreferences: {
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setMenuBarVisibility(false);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Intercept new windows and make them do nothing (new windows are handled
// in `browser.js` by opening new tabs)
app.on('web-contents-created', function (event, contents) {
  if (contents.getType() === 'webview') {
    contents.on('new-window', function (newWindowEvent) {
      newWindowEvent.preventDefault();
    });
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Auto reload the app on files changes
try {
  require('electron-reloader')(module)
} catch (_) {}