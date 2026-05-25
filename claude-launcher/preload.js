const { ipcRenderer } = require('electron');

window.electronAPI = {
  checkDependencies: () => ipcRenderer.invoke('check-deps'),
  installAll: () => ipcRenderer.invoke('install-all'),
  startServer: () => ipcRenderer.invoke('start-server'),
  openMain: () => ipcRenderer.invoke('open-main'),
  onInstallProgress: (callback) => ipcRenderer.on('install-progress', (event, value) => callback(value)),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
};
