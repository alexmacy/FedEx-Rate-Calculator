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
    { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
    { label: "Settings...", click: loadSettings },
    { role: "toggledevtools" },
    { type: "separator" },
    { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
  ]}, {
  label: "Edit",
  submenu: [
    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
    { type: "separator" },
    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
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
