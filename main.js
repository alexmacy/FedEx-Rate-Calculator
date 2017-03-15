'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain
const Menu = electron.Menu;

let mainWindow = null;
let secondWindow = null;

const menuTemplate = [{
  label: "Application",
  submenu: [
    { label: "Settings...", accelerator: "CmdorCtrl+,", click: loadSettings },
    { role: "toggledevtools", visible: false },
    { type: "separator" },
    { label: "Quit", accelerator: "CmdorCtrl+Q", click: function() { app.quit(); }}
  ]}, {
  label: "Edit",
  submenu: [
    { role: "undo" },
    { role: "redo" },
    { type: "separator" },
    { role: "cut" },
    { role: "copy" },
    { role: "paste" },
    { role: "selectall" }
  ]}
];

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    title: "FedEx Rate Calculator",
    height: 700,
    width: 900
  });

  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  secondWindow = new BrowserWindow({
    frame: false,
    width: 800,
    height: 600,
    show: false,
    parent: mainWindow
  })

  secondWindow.loadURL('file://' + __dirname + '/settings/settings-main.html');
  secondWindow.hide()

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  mainWindow.on('closed', function () {
    app.quit()
  })

});

// since the main window is only one view, the navigate 
// function only applies to the settings window
ipcMain.on('navigate-to', function (event, arg) {
  secondWindow.show()
  secondWindow.loadURL('file://' + __dirname + '/' + arg);
});

ipcMain.on('close-second-window', (event, arg)=> {
  secondWindow.hide()
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');
})

function loadSettings() {
  secondWindow.show()
}
