const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const fetch = require("cross-fetch");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}
const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		minHeight: 450,
		minWidth: 450,
		icon: path.join(__dirname, "../appicons/ninetails.png"),
		webPreferences: {
			webviewTag: true,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "index.html"));
	mainWindow.setMenuBarVisibility(false);
  checkForUpdate(mainWindow)
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// Intercept new windows and make them do nothing (new windows are handled
// in `browser.js` by opening new tabs)
app.on("web-contents-created", function (event, contents) {
	if (contents.getType() === "webview") {
		contents.on("new-window", function (newWindowEvent) {
			newWindowEvent.preventDefault();
		});
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function checkForUpdate(mainWindow) {
	try {
    const githubFetch = await fetch("https://api.github.com/repos/MystPi/ninetails/releases");
    if (!githubFetch.ok) {
      // this means that 
      return;
    }
    const releaseJSON = await githubFetch.json();
    const replacerRegex = /["."]/gm;
    const appVersionStr = app.getVersion();
    const tagVersionInt = Number(appVersionStr.replace(replacerRegex, ""));
    for (let i in releaseJSON) {
      const release = releaseJSON[i];
      if (release.draft || release.prerelease) continue;
      if (tagVersionInt < Number(release["tag_name"].replace(replacerRegex, "").slice(1))) {
        dialog.showMessageBox(mainWindow, {
          message: "An update is available for Ninetails.",
          detail: `Go to github.com/MystPi/Ninetails/releases to install Ninetails ${release["tag_name"]}`,
          type: "info"
        })
        return;
      }
    }
	} catch (error) {console.error(error)}
}
// Auto reload the app on files changes
try {
	require("electron-reloader")(module);
} catch (_) {}
