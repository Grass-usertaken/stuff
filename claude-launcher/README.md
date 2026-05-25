# Claude Launcher

A clean, light-themed Windows GUI launcher for [Free Claude Code](https://github.com/Grass-usertaken/Claude-For-Free).

No terminal commands needed — just double-click and go.

---

## Download

| File | Size | Description |
|------|------|-------------|
| [`Claude-Launcher.exe`](./Claude-Launcher.exe) | ~76 MB | Portable launcher + built-in installer |

---

## What It Does

- **Checks** if Git, Node.js, uv, Claude Code CLI, and Free Claude Code are installed
- **Installs** anything missing automatically with one click
- **Starts** `fcc-server` in the background automatically
- **Launches** `fcc-claude` inside a beautiful embedded terminal

---

## Screenshots

**Setup Screen**
```
┌─────────────────────────────┐
│           ◈                 │
│      Claude Launcher        │
│   Setup & Installer         │
│                             │
│  Git              Installed │
│  Node.js / npm    Installed │
│  Claude Code CLI  Installed │
│  uv               Installed │
│  Free Claude Code Installed │
│                             │
│  [ Launch Claude ]          │
└─────────────────────────────┘
```

**Main Window**
```
┌──────────────────────────────────────────┐
│ ◈ Claude  Free           ● Proxy Online  │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Welcome to Claude Code!            │  │
│  │ > _                                │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

---

## How to Use

1. **Download** `Claude-Launcher.exe` above
2. **Double-click** to run
3. If anything is missing, click **"Install Missing Dependencies"**
4. Once ready, click **"Launch Claude"**
5. Start chatting with Claude Code inside the terminal

---

## Building from Source

Requires [Node.js](https://nodejs.org/).

```bash
cd claude-launcher
npm install
npm run build
```

The built executable will be in `dist/Claude-Launcher.exe`.

---

## Tech Stack

- **Electron** — Desktop app framework
- **xterm.js** — Terminal emulator
- **node-pty** — Pseudo-terminal for running `fcc-claude`
- **Light white UI** — Clean, minimal design

---

## License

MIT
