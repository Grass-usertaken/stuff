# 🎙️ Rocket League AI Commentator

A live AI-powered commentator for Rocket League bot tournaments. Uses Groq Cloud AI + Edge-TTS neural voice to call the action in real-time.

---

## 📦 What's Included

| File | Description |
|------|-------------|
| `RL_AI_Commentator.exe` | Main dashboard / commentator application |
| `RLCommentatorPlugin.dll` | BakkesMod plugin that broadcasts live match data |

---

## 🚀 Quick Start

### 1. Install the BakkesMod Plugin

Open `RL_AI_Commentator.exe`, enter your access key, and click **📦 Install Plugin** from the dashboard. This auto-copies the DLL to your BakkesMod plugins folder.

If auto-detect fails, browse manually to:
```
%APPDATA%\bakkesmod\bakkesmod\plugins\
```

### 2. Inject BakkesMod

Click **🚀 Inject BakkesMod** from the dashboard, or launch Rocket League with BakkesMod already running.

### 3. Set Your Groq API Key

Click **🔑 Set Groq API Key** and paste your key. It saves to `config.json` next to the EXE for future sessions.

> Get a free Groq API key at: https://console.groq.com/keys

### 4. Start Commentating

Click **▶️ Start Commentator** and jump into a match (RLBot, offline, or online). The caster will begin calling the action immediately.

---

## 🎮 Features

- **Real-time commentary** — goals, saves, shots, clears, aerials, flip resets, big hits, and more
- **Team-only casting** — refers to Blue / Orange team (no bot name spam)
- **Goal interrupt** — cuts current audio immediately when a goal happens
- **Neural voice** — uses Microsoft Edge-TTS (GuyNeural) for human-like speech
- **Local fallback** — if Groq rate-limits, switches to creative offline lines
- **Auto-install** — one-click plugin install & BakkesMod injector launch

---

## 🖥️ System Requirements

- Windows 10/11
- Rocket League with BakkesMod installed
- Internet connection (for Groq AI + Edge-TTS)

---

## 🔧 Manual Plugin Load (if needed)

If the plugin doesn't auto-load, open the BakkesMod console in-game (`F2`) and type:
```
plugin load RLCommentatorPlugin
```

---

## 📝 Notes

- The plugin broadcasts match data via UDP on `127.0.0.1:5005`
- The Groq free tier is capped at ~14 requests/minute — bursts of events may briefly fall back to local lines
- First-time setup requires: access key → Groq API key → install plugin → start commentator
