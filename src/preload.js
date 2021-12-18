const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'userConfig', {
    save: async (arg) => await ipcRenderer.invoke('save-user-config', arg),
    load: async (arg) => await ipcRenderer.invoke('load-user-config', arg)
  }
)