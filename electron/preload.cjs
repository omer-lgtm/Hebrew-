const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Use Codex / AI to analyze Hebrew text and decide the action
  analyzeCommand: (text) => ipcRenderer.invoke('analyze-hebrew-command', text),
  
  // Directly execute terminal commands returned by the AI
  executeCommand: (cmd) => ipcRenderer.invoke('execute-system-command', cmd),
});
