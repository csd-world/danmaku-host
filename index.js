const { app, BrowserWindow, globalShortcut, dialog } = require('electron');
const { isHidden, toggleHidden, tryShow } = require('./mylib');

const DEBUG = false;
// const DEBUG = true;

if (process.platform == 'linux') {
  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.commandLine.appendSwitch('disable-gpu');
}


if (!app.requestSingleInstanceLock()) {
  app.quit();
  return; // Do we really need return?
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const windows = {};
let lastWindow = null;
let windowId = 0;
const args = process.argv.slice(2);

let winIndex = null;
let namedWins = {};

const shared = global.shared = {};

function createWindow(fullscreen, options) {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800, height: 600,
    fullscreen: fullscreen, frame: !fullscreen, resizable: !fullscreen,
    // transparent: fullscreen,
    // thick: fullscreen,
    skipTaskbar: fullscreen,
    webPreferences: { nodeIntegration: true },
    // alwaysOnTop: true,
    show: false,
    autoHideMenuBar: true,
    ...options // Oh... JavaScript is freaking awesome!
  });
  const id = windowId++;
  windows[id] = win;
  lastWindow = win;

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object
    delete windows[id];
    if (lastWindow === win) {
      lastWindow = null;
    }
  });
  return win;
}

function openIndex() {
  if (tryShow(winIndex)) return;
  const win = winIndex = createWindow(false, {
    width: 300, height: 250,
    maximizable: false,
  });
  win.loadFile('index.html');
  win.show();
  win.on('close', () => app.quit());
  return win;
}

function openOverlay() {
  const win = createWindow(!DEBUG, {
    transparent: !DEBUG,
    alwaysOnTop: !DEBUG,
  });
  win.loadFile('overlay.html');
  win.showInactive();
  win.setAlwaysOnTop(true, 'screen-saver') //set topWindow
  if (!DEBUG)
    win.setIgnoreMouseEvents(true);
}

function openNamedPage(file, url) {
  if (tryShow(namedWins[file])) return;
  const win = namedWins[file] = createWindow(false);
  if (url) {
    win.loadURL(url);
  } else {
    win.loadFile(file);
  }
  win.show();
}

shared.openIndex = openIndex;
shared.openNamedPage = openNamedPage;
shared.quit = () => app.quit();


app.on('second-instance', (event, commandLine, workingDirectory) => {
  // openIndex();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const index = openIndex();
  openOverlay();
  globalShortcut.register('F1', () => {
    index.webContents.executeJavaScript("toggle()");
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // // On macOS it's common to re-create a window in the app when the
  // // dock icon is clicked and there are no other windows open.
  // if (win === null) {
  //   createWindow()
  // }
});;

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
