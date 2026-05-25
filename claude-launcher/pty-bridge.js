const pty = require('node-pty');
const os = require('os');

const shell = process.platform === 'win32' ? 'powershell.exe' : (process.env.SHELL || 'bash');

const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 120,
  rows: 30,
  cwd: os.homedir(),
  env: process.env
});

// Wait a moment then start fcc-claude
setTimeout(() => {
  const cmd = process.platform === 'win32' ? 'fcc-claude\r\n' : 'fcc-claude\n';
  ptyProcess.write(cmd);
}, 2000);

ptyProcess.onData((data) => {
  process.stdout.write(JSON.stringify({ type: 'data', data }) + '\n');
});

ptyProcess.onExit((code) => {
  process.stdout.write(JSON.stringify({ type: 'exit', code }) + '\n');
  process.exit(0);
});

const rl = require('readline').createInterface({ input: process.stdin });
rl.on('line', (line) => {
  try {
    const msg = JSON.parse(line);
    if (msg.type === 'input') {
      ptyProcess.write(msg.data);
    } else if (msg.type === 'resize') {
      ptyProcess.resize(msg.cols, msg.rows);
    }
  } catch (e) {
    // ignore invalid lines
  }
});
