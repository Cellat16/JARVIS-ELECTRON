const { app, BrowserWindow, globalShortcut, Tray, Menu, ipcMain, nativeImage } = require('electron')
const path = require('path')
const Store = require('electron-store')

const store = new Store({ encryptionKey: 'jarvis-stark-2024' })

let mainWindow, tray

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 750,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    icon: path.join(__dirname, '../assets/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    titleBarStyle: 'hidden'
  })

  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'))

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow.hide()
  })
}

function createTray() {
  const icon = nativeImage.createEmpty()
  tray = new Tray(icon)
  const menu = Menu.buildFromTemplate([
    { label: 'J.A.R.V.I.S. Göster', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Çıkış', click: () => { app.exit() } }
  ])
  tray.setContextMenu(menu)
  tray.setToolTip('J.A.R.V.I.S.')
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
}

app.whenReady().then(() => {
  createWindow()
  createTray()

  globalShortcut.register('CommandOrControl+Shift+J', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('get-api-key', () => store.get('apiKey', ''))
ipcMain.handle('save-api-key', (_, key) => { store.set('apiKey', key); return true })
ipcMain.handle('minimize', () => mainWindow.minimize())
ipcMain.handle('hide', () => mainWindow.hide())
ipcMain.handle('toggle-pin', (_, pin) => mainWindow.setAlwaysOnTop(pin))
ipcMain.handle('close-app', () => app.exit())
