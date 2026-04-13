const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('jarvis', {
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  saveApiKey: (key) => ipcRenderer.invoke('save-api-key', key),
  minimize: () => ipcRenderer.invoke('minimize'),
  hide: () => ipcRenderer.invoke('hide'),
  togglePin: (pin) => ipcRenderer.invoke('toggle-pin', pin),
  closeApp: () => ipcRenderer.invoke('close-app')
})
