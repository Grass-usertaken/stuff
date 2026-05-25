# Claude Launcher

A clean, light-themed Windows GUI launcher for [Free Claude Code](https://github.com/Grass-usertaken/Claude-For-Free).

No terminal commands needed — just double-click and go.

---

## Download

| File | Size | Description |
|------|------|-------------|
| [`Claude-Launcher.exe`](https://github.com/Grass-usertaken/stuff/raw/main/claude-launcher/Claude-Launcher.exe) | ~76 MB | Portable launcher + built-in installer |

---

## What It Does

- **Checks** if Git, Node.js, uv, Claude Code CLI, and Free Claude Code are installed
- **Installs** anything missing automatically with one click
- **Starts** `fcc-server` in the background automatically
- **Launches** `fcc-claude` inside a beautiful embedded terminal

---

## How to Use

1. **Download** `Claude-Launcher.exe` above
2. **Double-click** to run
3. If anything is missing, click **"Install Missing Dependencies"**
4. Once ready, click **"Launch Claude"**
5. Start chatting with Claude Code inside the terminal

---

## Choose A Provider

Pick one provider, enter its key or local URL in the Admin UI, and set `MODEL` to a provider-prefixed model slug. `MODEL` is the fallback. `MODEL_OPUS`, `MODEL_SONNET`, and `MODEL_HAIKU` can override routing for Claude Code's model tiers.

### 1. NVIDIA NIM

Get a key at [build.nvidia.com/settings/api-keys](https://build.nvidia.com/settings/api-keys).

In the Admin UI, paste it into `NVIDIA_NIM_API_KEY`. The default `MODEL` is `nvidia_nim/nvidia/nemotron-3-super-120b-a12b`.

**Popular examples:**

- `nvidia_nim/nvidia/nemotron-3-super-120b-a12b`
- `nvidia_nim/z-ai/glm5.1`
- `nvidia_nim/moonshotai/kimi-k2.5`
- `nvidia_nim/minimaxai/minimax-m2.5`

Browse models at [build.nvidia.com](https://build.nvidia.com).

### 2. OpenRouter

Get a key at [openrouter.ai/keys](https://openrouter.ai/keys).

In the Admin UI, paste it into `OPENROUTER_API_KEY`, then set `MODEL` to an OpenRouter slug such as `open_router/stepfun/step-3.5-flash:free`.

Browse [all models](https://openrouter.ai/models) or [free models](https://openrouter.ai/models?max_price=0).

### 3. Google AI Studio (Gemini)

Get a Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey) (see [Google's Gemini OpenAI compatibility docs](https://ai.google.dev/gemini-api/docs/openai)).

In the Admin UI, paste it into `GEMINI_API_KEY`, then set `MODEL` to a Gemini model slug such as `gemini/gemini-2.5-flash` or `gemini/gemini-3.1-flash-lite`.

The Gemini API exposes an OpenAI-compatible endpoint at `https://generativeai.googleapis.com/v1beta/openai/`. Free tier quotas are per-model.

**Popular examples:**

- `gemini/gemini-2.5-flash`
- `gemini/gemini-3.1-flash-lite`

### 4. DeepSeek

Get a key at [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys).

In the Admin UI, paste it into `DEEPSEEK_API_KEY`, then set `MODEL` to a DeepSeek slug such as `deepseek/deepseek-chat`.

This provider uses DeepSeek's Anthropic-compatible endpoint, not the OpenAI chat-completions endpoint.

### 5. Mistral La Plateforme

Activate the Experiment plan on [console.mistral.ai](https://console.mistral.ai) for free-tier API access.

In the Admin UI, paste your API key into `MISTRAL_API_KEY`, then set `MODEL` to a Mistral model slug such as `mistral/devstral-small-latest` or `mistral/mistral-small-latest`.

**Popular examples:**

- `mistral/devstral-small-latest`
- `mistral/mistral-small-latest`

Browse models at [Mistral documentation](https://docs.mistral.ai/).

### 6. Mistral Codestral

Mistral's Codestral gateway uses a separate API key from La Plateforme: provision `CODESTRAL_API_KEY`, then route with the `mistral_codestral/` prefix. The default upstream is `https://codestral.mistral.ai/v1`.

**Popular examples:**

- `mistral_codestral/codestral-latest`

### 7. OpenCode Zen

Get an API key at [opencode.ai/auth](https://opencode.ai/auth).

In the Admin UI, paste it into `OPENCODE_API_KEY`, then set `MODEL` to an OpenCode Zen model slug such as `opencode/gpt-5.3-codex`. The same `OPENCODE_API_KEY` powers OpenCode Go (below); use `opencode_go/` slugs there.

**Popular examples:**

- `opencode/gpt-5.3-codex`
- `opencode/claude-sonnet-4`
- `opencode/deepseek-v4-flash-free` (free)
- `opencode/gemini-3-flash`
- `opencode/big-pickle` (free)
- `opencode/glm-5.1`

Browse available models at [opencode.ai](https://opencode.ai).

### 8. OpenCode Go

Get an API key at [opencode.ai/auth](https://opencode.ai/auth) (same as OpenCode Zen).

In the Admin UI, use `OPENCODE_API_KEY`, then set `MODEL` to an OpenCode Go model slug such as `opencode_go/minimax-m2.7`.

**Popular examples:**

- `opencode_go/minimax-m2.7`

Browse available models at [opencode.ai](https://opencode.ai).

### 9. Wafer

Get a key from [wafer.ai](https://wafer.ai).

In the Admin UI, paste it into `WAFER_API_KEY`, then set `MODEL` to a Wafer Pass model such as `wafer/DeepSeek-V4-Pro`.

**Popular examples:**

- `wafer/DeepSeek-V4-Pro`
- `wafer/MiniMax-M2.7`
- `wafer/Qwen3.5-397B-A17B`
- `wafer/GLM-5.1`

This provider uses Wafer's Anthropic-compatible endpoint at `https://pass.wafer.ai/v1/messages`.

### 10. Kimi

Get a key at [platform.moonshot.ai/console/api-keys](https://platform.moonshot.ai/console/api-keys).

In the Admin UI, paste it into `KIMI_API_KEY`, then set `MODEL` to a Kimi slug such as `kimi/kimi-k2.5`.

This provider calls Kimi's Anthropic-compatible Messages API (`https://api.moonshot.ai/anthropic/v1/messages`).

Browse models at [platform.moonshot.ai](https://platform.moonshot.ai).

### 11. Cerebras Inference

Sign up and create an API key in the [Cerebras Cloud Console](https://cloud.cerebras.ai/) (see [Quickstart](https://docs.cerebras.ai/en/latest/)).

In the Admin UI, set `CEREBRAS_API_KEY`, then route with `MODEL` such as `cerebras/llama3.1-8b` or `cerebras/gpt-oss-120b`.

Cerebras exposes an OpenAI-compatible API at `https://api.cerebras.ai/v1`.

### 12. Groq

Get an API key at [console.groq.com/keys](https://console.groq.com/keys).

In the Admin UI, paste it into `GROQ_API_KEY`, then set `MODEL` to a Groq OpenAI-compat model slug such as `groq/llama-3.3-70b-versatile`.

Groq routes through `https://api.groq.com/openai/v1`.

Browse models at [console.groq.com/docs/models](https://console.groq.com/docs/models).

### 13. Fireworks AI

Get an API key at [fireworks.ai/account/api-keys](https://fireworks.ai/account/api-keys).

In the Admin UI, paste it into `FIREWORKS_API_KEY`, then set `MODEL` to a Fireworks model slug such as `fireworks/accounts/fireworks/models/llama-v3p3-70b-instruct`.

Fireworks exposes an Anthropic-compatible Messages API at `https://api.fireworks.ai/inference/v1/messages`.

Browse models at [fireworks.ai/models](https://fireworks.ai/models).

### 14. Z.ai

Get an API key at [Z.ai/manage-apikey/apikey-list](https://Z.ai/manage-apikey/apikey-list).

In the Admin UI, paste it into `ZAI_API_KEY`, then set `MODEL` to a Z.ai model slug such as `zai/glm-5.1`.

This provider calls Z.ai's Anthropic-compatible Messages API (`https://api.z.ai/api/anthropic/v1/messages`).

**Popular examples:**

- `zai/glm-5.1`
- `zai/glm-5-turbo`

Browse models at [Z.ai](https://Z.ai).

### 15. LM Studio

Start LM Studio's local server and load a model. In the Admin UI, keep or update `LM_STUDIO_BASE_URL`, then set `MODEL` to the model identifier shown by LM Studio, prefixed with `lmstudio/`.

Prefer models with tool-use support for Claude Code workflows.

### 16. llama.cpp

Start `llama-server` with an Anthropic-compatible `/v1/messages` endpoint and enough context for Claude Code requests.

In the Admin UI, keep or update `LLAMACPP_BASE_URL`, then set `MODEL` to the local model slug, prefixed with `llamacpp/`.

For local coding models, context size matters. If llama.cpp returns HTTP 400 for normal Claude Code requests, increase `--ctx-size` and verify the model/server build supports the requested features.

### 17. Ollama

Run Ollama and pull a model:

```bash
ollama pull llama3.1
ollama serve
```

In the Admin UI, keep or update `OLLAMA_BASE_URL`, then set `MODEL` to the same tag shown by `ollama list`, prefixed with `ollama/`.

`OLLAMA_BASE_URL` is the Ollama server root; do not append `/v1`. Example model slugs include `ollama/llama3.1` and `ollama/llama3.1:8b`.

### 18. Mix Providers By Model Tier

Each model tier can use a different provider by setting `MODEL_OPUS`, `MODEL_SONNET`, and `MODEL_HAIKU` in the Admin UI. Leave a tier blank to inherit `MODEL`.

**For example**, you can route:
- **Opus** → `nvidia_nim/moonshotai/kimi-k2.5`
- **Sonnet** → `open_router/deepseek/deepseek-r1-0528:free`
- **Haiku** → `lmstudio/unsloth/GLM-4.7-Flash-GGUF`
- **Fallback** `MODEL` → `zai/glm-5.1`

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

## Messaging Integrations

For every integration below, change **managed proxy settings** only in the **Admin UI** at `/admin`: edit fields, click **Validate**, then **Apply**. The footer shows where the managed config is stored; this README does not walk through editing that file by hand.

### Discord And Telegram Bots

The bot wrapper runs Claude Code sessions remotely, streams progress, supports reply-based conversation branches, and can stop or clear tasks.

**Discord**

1. Create the bot in the [Discord Developer Portal](https://discord.com/developers/applications).
2. Enable **Message Content Intent**.
3. Invite the bot with read, send, and message history permissions.
4. Copy the bot token and the numeric channel ID (or IDs) where the bot should respond.

**Telegram**

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy the bot token.
2. Get your numeric user ID from [@userinfobot](https://t.me/userinfobot) so only you can use the bot.

**Configure in the Admin UI**

1. With `fcc-server` running, open the **Admin UI** URL from the terminal output.
2. In the sidebar, choose **Messaging**.
3. Set **Messaging Platform** to **discord** or **telegram**.
4. For Discord, paste **Discord Bot Token** and **Allowed Discord Channels**. For Telegram, paste **Telegram Bot Token** and **Allowed Telegram User ID**.
5. Set **Allowed Directory** to an absolute path on the machine running the proxy—the workspace root the bot may use.
6. Click **Validate**, then **Apply**. Restart the server if the UI says one is required.

**Useful commands**

- `/stop` cancels a task; reply to a task message to stop only that branch.
- `/clear` resets sessions; reply to clear one branch.
- `/stats` shows session state.

### Voice Notes

Voice notes work on Discord and Telegram after you extend your Free Claude Code install with the matching optional extras.

macOS/Linux:

```bash
# NVIDIA NIM transcription (Riva gRPC)
curl -fsSL "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.sh?raw=1" | sh -s -- --voice-nim

# Local Whisper (CPU or CUDA)
curl -fsSL "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.sh?raw=1" | sh -s -- --voice-local

# Both backends
curl -fsSL "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.sh?raw=1" | sh -s -- --voice-all

# Local Whisper with CUDA
curl -fsSL "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.sh?raw=1" | sh -s -- --voice-local --torch-backend cu130
```

Windows PowerShell:

```powershell
# NVIDIA NIM transcription (Riva gRPC)
& ([scriptblock]::Create((irm "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.ps1?raw=1"))) -VoiceNim

# Local Whisper (CPU or CUDA)
& ([scriptblock]::Create((irm "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.ps1?raw=1"))) -VoiceLocal

# Both backends
& ([scriptblock]::Create((irm "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.ps1?raw=1"))) -VoiceAll

# Local Whisper with CUDA
& ([scriptblock]::Create((irm "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.ps1?raw=1"))) -VoiceLocal -TorchBackend cu130
```

Restart `fcc-server` after reinstalling.

In the **Admin UI**, open **Messaging** and scroll to **Voice**. Turn on **Voice Notes**, choose **Whisper Device** (`cpu`, `cuda`, or `nvidia_nim`), set **Whisper Model**, and enter **Hugging Face Token** when your setup needs it. For **nvidia_nim** transcription, install the voice extra and set **NVIDIA NIM API Key** on the **Providers** view.

---

## How It Works

Important pieces:

- FastAPI exposes Anthropic-compatible routes such as `/v1/messages`, `/v1/messages/count_tokens`, and `/v1/models`.
- Model routing resolves the Claude model name to `MODEL_OPUS`, `MODEL_SONNET`, `MODEL_HAIKU`, or `MODEL`.
- NIM, OpenCode Zen, and OpenCode Go use OpenAI chat streaming translated into Anthropic SSE.
- Wafer, OpenRouter, DeepSeek, Kimi, Fireworks AI, Z.ai, LM Studio, llama.cpp, and Ollama use Anthropic Messages style transports where applicable (with provider-specific quirks and model-list URLs).
- The proxy normalizes thinking blocks, tool calls, token usage metadata, and provider errors into the shape Claude Code expects.
- Request optimizations answer trivial Claude Code probes locally to save latency and quota.

---

## License

MIT
