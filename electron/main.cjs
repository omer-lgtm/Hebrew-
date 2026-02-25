const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

// Determine if we are running in dev mode via Vite
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: true, // Optional, depending on strict security
      contextIsolation: true // Security best practice
    }
  });

  if (isDev) {
    // Wait for vite to start
    win.loadURL('http://localhost:5174').catch(() => {
      // fallback if port differs
      win.loadURL('http://localhost:5173');
    });
    win.webContents.openDevTools();
  } else {
    // In production, load the built index.html
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ============================================
// IPC Handlers for AI / Computer execution
// ============================================

ipcMain.handle('execute-system-command', async (event, command) => {
  return new Promise((resolve, reject) => {
    console.log(`Executing on system: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        resolve({ success: false, error: error.message, stderr });
        return;
      }
      resolve({ success: true, stdout });
    });
  });
});

ipcMain.handle('analyze-hebrew-command', async (event, hebrewText) => {
  console.log(`Hebrew Command Received: ${hebrewText}`);
  
  return new Promise((resolve) => {
    // We will use the local Codex CLI directly via child_process
    // We use a bash command escaping the input text to prevent injection.
    const safeText = hebrewText.replace(/"/g, '\\"');
    
    // We ask the codex CLI to output JSON format
    const prompt = `You are a Hebrew-to-Code parser. Respond ONLY with a raw JSON object: {"actionType": "system_execute" or "state_update", "code": "the payload or shell command", "message": "hebrew confirmation"}. User input: ${safeText}`;
    
    // Execute the codex CLI command
    exec(`codex "${prompt}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("CLI Evaluation Error:", error);
        return resolve({ success: false, error: error.message, stderr });
      }
      
      try {
        // Find the first { and last } to extract JSON safely from the CLI output
        const jsonStart = stdout.indexOf('{');
        const jsonEnd = stdout.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
           const jsonStr = stdout.substring(jsonStart, jsonEnd + 1);
           const resultObj = JSON.parse(jsonStr);
           resolve({ success: true, ...resultObj });
        } else {
           resolve({ success: false, error: "CLI did not return JSON. Output: " + stdout });
        }
      } catch (parseError) {
        console.error("CLI JSON Parse Error:", parseError, stdout);
        resolve({ success: false, error: "JSON parsing failed: " + parseError.message });
      }
    });
  });
});
