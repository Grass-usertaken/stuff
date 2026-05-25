const { ipcRenderer } = require('electron');

window.electronAPI = {
  onTerminalData: (callback) => ipcRenderer.on('terminal-data', (event, value) => callback(value)),
  sendTerminalInput: (data) => ipcRenderer.send('terminal-input', data),
  sendTerminalResize: (cols, rows) => ipcRenderer.send('terminal-resize', cols, rows),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
};
