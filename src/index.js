const { app,
        BrowserWindow,
        ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Remove the border on MacOS and Windows
  const border = !(process.platform === 'darwin' || process.platform == 'win32')

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 450,
    minWidth: 450,
    frame: border,
    show: false,
    webPreferences: {
      webviewTag: true,
      preload: path.join(__dirname, 'js/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false
    }
  });

  // Handle ipc messages
  ipcMain.on('toMain', (event, arg) => {
    switch (arg) {
      // Send OS info to renderer
      case 'platform': {
        event.sender.send('platform', {
          platform: process.platform,
          chromium: process.versions.chrome,
          electron: process.versions.electron
        });

        event.sender.send('maximized', mainWindow.isMaximized());
        break;
      }
      // Close the window
      case 'close': {
        mainWindow.close();
        break;
      }
      // Minimize the window
      case 'minimize': {
        mainWindow.minimize();
        break;
      }
      // Maximize the window
      case 'maximize': {
        if (!mainWindow.isMaximized()) {
          mainWindow.maximize();
        } else {
          mainWindow.unmaximize();
        }
        break;
      }
      // Handle unknown messages
      default: {
        console.error(`Unknown event: ${arg}`);
      }
    }
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('maximized', false);
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('maximized', true);
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setMenuBarVisibility(false);
  // Show the window when it's ready
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });
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
} catch (_) { }