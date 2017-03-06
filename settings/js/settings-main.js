const {ipcRenderer} = require('electron')

function navigate(a) {
  ipcRenderer.send('navigate-to', a)
}

function closeSecondWindow(a) {
  ipcRenderer.send(a)
}