const {
    contextBridge,
    ipcRenderer
} = require('electron');

// Expose sandboxed ipc module to renderer process
contextBridge.exposeInMainWorld('ipc', {
    send: (channel, data) => {
        const validChannels = [
            'toMain'
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    on: (channel, callback) => {
        const validChannels = [
            'platform',
            'maximized',
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => {
                callback(...args);
            });
        }
    }
});