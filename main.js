const { app, BrowserWindow, ipcMain } = require('electron')

var win;

function createWindow () {

  win = new BrowserWindow({
    width: 207,
    height: 135,
    webPreferences: {
      nodeIntegration: true
    },
    alwaysOnTop: true,
    icon: "res/icon.png"
  })

  win.setMenu(null)

  win.loadFile('res/index.html')

  win.setResizable(false)

  //win.webContents.openDevTools()

}

ipcMain.on('focus', (e) => {
    win.focus()
})

ipcMain.on('minimize', (e) => {
    win.minimize()
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

