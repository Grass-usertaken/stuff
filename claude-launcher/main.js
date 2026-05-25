const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const logFile = path.join(os.tmpdir(), 'claude-launcher.log');
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { fs.appendFileSync(logFile, line); } catch (e) { console.error(line); }
}

process.on('uncaughtException', (err) => {
  log('UNCAUGHT EXCEPTION: ' + err.stack);
});
process.on('unhandledRejection', (reason) => {
  log('UNHANDLED REJECTION: ' + reason);
});

let mainWindow;
let setupWindow;
let serverProcess = null;
let ptyBridge = null;

function createSetupWindow() {
  setupWindow = new BrowserWindow({
    width: 600,
    height: 520,
    resizable: false,
    maximizable: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: false
    },
    show: false
  });

  setupWindow.loadFile('index.html', { query: { mode: 'setup' } });
  setupWindow.once('ready-to-show', () => setupWindow.show());
  setupWindow.on('closed', () => { setupWindow = null; });
}

function createMainWindow() {
  log('Creating main window');
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#fafafa',
    titleBarStyle: 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload-main.js'),
      contextIsolation: false,
      nodeIntegration: true
    },
    show: false
  });

  mainWindow.loadFile('index.html', { query: { mode: 'main' } });
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (ptyBridge) {
      ptyBridge.kill();
      ptyBridge = null;
    }
    stopServer();
  });
}

function commandExists(cmd) {
  return new Promise((resolve) => {
    const checker = process.platform === 'win32' ? 'where' : 'which';
    exec(`${checker} ${cmd}`, (error) => {
      resolve(!error);
    });
  });
}

function runCommand(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      ...options
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (data) => { stdout += data.toString(); });
    child.stderr?.on('data', (data) => { stderr += data.toString(); });
    child.on('close', (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr || `Exit code ${code}`));
    });
    child.on('error', reject);
  });
}

async function checkDependencies() {
  const deps = {
    git: await commandExists('git'),
    npm: await commandExists('npm'),
    claude: await commandExists('claude'),
    uv: await commandExists('uv'),
    fccServer: await commandExists('fcc-server'),
    fccClaude: await commandExists('fcc-claude')
  };
  return deps;
}

async function installGit(progress) {
  progress({ step: 'Downloading Git installer...', percent: 5 });
  const gitUrl = 'https://github.com/git-for-windows/git/releases/download/v2.54.0.windows.1/Git-2.54.0-64-bit.exe';
  const tmpFile = path.join(os.tmpdir(), 'git-installer.exe');
  
  await runCommand('powershell', [
    '-Command',
    `Invoke-WebRequest -Uri "${gitUrl}" -OutFile "${tmpFile}" -UseBasicParsing -MaximumRedirection 5`
  ]);
  
  progress({ step: 'Installing Git (silent)...', percent: 20 });
  await runCommand(tmpFile, ['/VERYSILENT', '/NORESTART', '/NOCANCEL', '/SP-', '/CLOSEAPPLICATIONS', '/RESTARTAPPLICATIONS', '/SUPPRESSMSGBOXES']);
  progress({ step: 'Git installed', percent: 35 });
}

async function installNode(progress) {
  progress({ step: 'Downloading Node.js installer...', percent: 40 });
  const nodeUrl = 'https://nodejs.org/dist/v24.16.0/node-v24.16.0-x64.msi';
  const tmpFile = path.join(os.tmpdir(), 'node-installer.msi');
  
  await runCommand('powershell', [
    '-Command',
    `Invoke-WebRequest -Uri "${nodeUrl}" -OutFile "${tmpFile}" -UseBasicParsing -MaximumRedirection 5`
  ]);
  
  progress({ step: 'Installing Node.js...', percent: 55 });
  await runCommand('msiexec', ['/i', tmpFile, '/qn', '/norestart']);
  progress({ step: 'Node.js installed', percent: 70 });
}

async function installUv(progress) {
  progress({ step: 'Installing uv...', percent: 75 });
  await runCommand('powershell', [
    '-Command',
    'irm https://astral.sh/uv/install.ps1 | iex'
  ]);
  progress({ step: 'uv installed', percent: 80 });
}

async function installClaudeCode(progress) {
  progress({ step: 'Installing Claude Code CLI...', percent: 85 });
  await runCommand('npm', ['install', '-g', '@anthropic-ai/claude-code']);
  progress({ step: 'Claude Code CLI installed', percent: 90 });
}

async function installFreeClaudeCode(progress) {
  progress({ step: 'Installing Free Claude Code...', percent: 92 });
  const repoUrl = 'git+https://github.com/Grass-usertaken/Claude-For-Free.git';
  await runCommand('uv', ['tool', 'install', '--force', repoUrl]);
  progress({ step: 'Free Claude Code installed', percent: 100 });
}

async function runInstallation(progressCallback) {
  const deps = await checkDependencies();
  
  if (!deps.git) await installGit(progressCallback);
  if (!deps.npm) await installNode(progressCallback);
  if (!deps.uv) await installUv(progressCallback);
  
  // Refresh PATH
  process.env.PATH = [
    path.join(os.homedir(), 'AppData', 'Roaming', 'npm'),
    path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Git', 'cmd'),
    path.join(os.homedir(), 'AppData', 'Local', 'Microsoft', 'WindowsApps'),
    path.join(os.homedir(), '.local', 'bin'),
    path.join(os.homedir(), '.cargo', 'bin'),
    process.env.PATH
  ].join(';');
  
  const refreshed = await checkDependencies();
  if (!refreshed.claude) await installClaudeCode(progressCallback);
  if (!refreshed.fccServer || !refreshed.fccClaude) await installFreeClaudeCode(progressCallback);
}

function startServer() {
  return new Promise((resolve, reject) => {
    if (serverProcess) { resolve(); return; }
    
    serverProcess = spawn('fcc-server', [], {
      shell: true,
      stdio: 'pipe',
      windowsHide: true,
      env: process.env
    });
    
    let output = '';
    let resolved = false;
    
    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      if (!resolved && (output.includes('Admin UI') || output.includes('Uvicorn running') || output.includes('Application startup complete'))) {
        resolved = true;
        resolve();
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    setTimeout(() => {
      if (!resolved) { resolved = true; resolve(); }
    }, 10000);
    
    serverProcess.on('error', (err) => {
      if (!resolved) { resolved = true; reject(err); }
    });
  });
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

function createTerminal() {
  if (ptyBridge) { return; }
  
  const basePath = __dirname.replace('app.asar', 'app.asar.unpacked');
  const bridgePath = path.join(basePath, 'pty-bridge.js');
  log('Bridge path: ' + bridgePath);
  log('Bridge exists: ' + fs.existsSync(bridgePath));
  const nodeCmd = process.platform === 'win32' ? 'node.exe' : 'node';
  
  ptyBridge = spawn(nodeCmd, [bridgePath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: basePath,
    env: process.env,
    shell: false
  });
  log('PTY bridge spawned with pid: ' + (ptyBridge.pid || 'unknown'));
  
  const rl = require('readline').createInterface({ input: ptyBridge.stdout });
  rl.on('line', (line) => {
    try {
      const msg = JSON.parse(line);
      if (msg.type === 'data' && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('terminal-data', msg.data);
      }
    } catch (e) {
      // ignore
    }
  });
  
  ptyBridge.stderr.on('data', (data) => {
    console.error('pty-bridge stderr:', data.toString());
  });
  
  ptyBridge.on('exit', () => {
    ptyBridge = null;
  });
}

// IPC
ipcMain.handle('check-deps', checkDependencies);

ipcMain.handle('install-all', async (event) => {
  try {
    await runInstallation((update) => {
      event.sender.send('install-progress', update);
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('start-server', async () => {
  try {
    await startServer();
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('open-main', async () => {
  if (setupWindow && !setupWindow.isDestroyed()) {
    setupWindow.close();
  }
  await startServer();
  createMainWindow();
  setTimeout(createTerminal, 1000);
  return { success: true };
});

ipcMain.on('terminal-input', (event, data) => {
  if (ptyBridge && ptyBridge.stdin && !ptyBridge.stdin.destroyed) {
    ptyBridge.stdin.write(JSON.stringify({ type: 'input', data }) + '\n');
  }
});

ipcMain.on('terminal-resize', (event, cols, rows) => {
  if (ptyBridge && ptyBridge.stdin && !ptyBridge.stdin.destroyed) {
    ptyBridge.stdin.write(JSON.stringify({ type: 'resize', cols, rows }) + '\n');
  }
});

// App lifecycle
app.whenReady().then(async () => {
  log('App ready');
  createSetupWindow();
  
  const deps = await checkDependencies();
  const allReady = deps.git && deps.npm && deps.claude && deps.uv && deps.fccServer && deps.fccClaude;
  
  if (allReady) {
    log('All deps ready, starting server and opening main window');
    await startServer();
    if (setupWindow) setupWindow.close();
    createMainWindow();
    setTimeout(() => { log('Creating terminal'); createTerminal(); }, 1500);
  } else {
    log('Deps missing, staying on setup');
  }
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
      setTimeout(createTerminal, 1500);
    }
  });
});

app.on('window-all-closed', () => {
  stopServer();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  stopServer();
  if (ptyBridge) {
    ptyBridge.kill();
    ptyBridge = null;
  }
});
