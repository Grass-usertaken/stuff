const fs = require('fs');
const path = require('path');
const os = require('os');

const logFile = path.join(os.tmpdir(), 'claude-launcher.log');
function log(msg) {
  const line = `[${new Date().toISOString()}] [RENDERER] ${msg}\n`;
  try { fs.appendFileSync(logFile, line); } catch (e) { console.error(line); }
}

window.onerror = (msg, url, line, col, err) => {
  log('WINDOW ERROR: ' + msg + ' at ' + url + ':' + line + ':' + col + ' ' + (err ? err.stack : ''));
};
window.addEventListener('unhandledrejection', (e) => {
  log('UNHANDLED REJECTION: ' + e.reason);
});

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode') || 'setup';

const setupView = document.getElementById('setup-view');
const mainView = document.getElementById('main-view');
const installBtn = document.getElementById('install-btn');
const launchBtn = document.getElementById('launch-btn');
const progressArea = document.getElementById('progress-area');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const setupError = document.getElementById('setup-error');

function setDepStatus(id, status, text) {
  const el = document.getElementById(id);
  if (!el) return;
  const badge = el.querySelector('.dep-status');
  badge.className = 'dep-status ' + status;
  badge.textContent = text;
}

async function checkAllDeps() {
  const deps = await window.electronAPI.checkDependencies();
  setDepStatus('dep-git', deps.git ? 'ok' : 'missing', deps.git ? 'Installed' : 'Missing');
  setDepStatus('dep-npm', deps.npm ? 'ok' : 'missing', deps.npm ? 'Installed' : 'Missing');
  setDepStatus('dep-claude', deps.claude ? 'ok' : 'missing', deps.claude ? 'Installed' : 'Missing');
  setDepStatus('dep-uv', deps.uv ? 'ok' : 'missing', deps.uv ? 'Installed' : 'Missing');
  
  const fccReady = deps.fccServer && deps.fccClaude;
  setDepStatus('dep-fcc', fccReady ? 'ok' : 'missing', fccReady ? 'Installed' : 'Missing');
  
  const allReady = deps.git && deps.npm && deps.claude && deps.uv && fccReady;
  
  if (allReady) {
    installBtn.classList.add('hidden');
    launchBtn.classList.remove('hidden');
  } else {
    installBtn.classList.remove('hidden');
    launchBtn.classList.add('hidden');
  }
  
  return allReady;
}

if (mode === 'setup') {
  setupView.classList.remove('hidden');
  mainView.classList.add('hidden');
  checkAllDeps();
  
  installBtn.addEventListener('click', async () => {
    installBtn.disabled = true;
    setupError.textContent = '';
    progressArea.classList.remove('hidden');
    
    window.electronAPI.onInstallProgress((update) => {
      progressFill.style.width = update.percent + '%';
      progressText.textContent = update.step;
    });
    
    const result = await window.electronAPI.installAll();
    
    if (result.success) {
      progressFill.style.width = '100%';
      progressText.textContent = 'Installation complete!';
      await checkAllDeps();
    } else {
      setupError.textContent = result.error;
      installBtn.disabled = false;
    }
  });
  
  launchBtn.addEventListener('click', async () => {
    launchBtn.disabled = true;
    setupError.textContent = '';
    progressArea.classList.remove('hidden');
    progressText.textContent = 'Starting proxy server & Claude...';
    progressFill.style.width = '50%';
    
    await window.electronAPI.openMain();
  });
} else if (mode === 'main') {
  log('Main mode started');
  setupView.classList.add('hidden');
  mainView.classList.remove('hidden');
  
  try {
    const { Terminal } = require('xterm');
    log('xterm loaded');
  const { FitAddon } = require('xterm-addon-fit');
  const { WebLinksAddon } = require('xterm-addon-web-links');
  
  const term = new Terminal({
    cursorBlink: true,
    cursorStyle: 'block',
    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, monospace',
    fontSize: 14,
    theme: {
      background: '#ffffff',
      foreground: '#1a1a1a',
      cursor: '#e57035',
      selectionBackground: 'rgba(229, 112, 53, 0.15)',
      black: '#1a1a1a',
      red: '#c0392b',
      green: '#2a9d3f',
      yellow: '#d4ac0d',
      blue: '#2980b9',
      magenta: '#8e44ad',
      cyan: '#16a085',
      white: '#f5f5f5',
      brightBlack: '#666666',
      brightRed: '#e74c3c',
      brightGreen: '#2ecc71',
      brightYellow: '#f1c40f',
      brightBlue: '#3498db',
      brightMagenta: '#9b59b6',
      brightCyan: '#1abc9c',
      brightWhite: '#ffffff'
    },
    allowProposedApi: true,
    scrollback: 10000
  });
  
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());
    log('addons loaded');
    
    const terminalEl = document.getElementById('terminal');
    term.open(terminalEl);
    fitAddon.fit();
    log('terminal opened');
  
  term.onData((data) => {
    window.electronAPI.sendTerminalInput(data);
  });
  
  term.onResize(({ cols, rows }) => {
    window.electronAPI.sendTerminalResize(cols, rows);
  });
  
  window.electronAPI.onTerminalData((data) => {
    term.write(data);
  });
  
  window.addEventListener('resize', () => {
    fitAddon.fit();
  });
  
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalEl);
    log('terminal setup complete');
  } catch (e) {
    log('TERMINAL ERROR: ' + e.stack);
  }
}
