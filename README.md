# TildaMCP — Autonomous AI Layout Designer for Tilda Publishing

> **Autonomous AI-Powered Frontend Engineering System for Tilda Publishing via Model Context Protocol (MCP)**.  
> Enables LLM orchestrators (Claude 3.7 / Gemini 2.0 / GPT-4o) to plan, code, inject, visually verify across Desktop and Mobile viewports via Vision feedback loops, refine, and publish responsive web layouts directly into Tilda.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LLM Orchestrator                          │
│     (Plans Structure -> Generates Code -> Inspects Vision)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Model Context Protocol (stdio)
┌──────────────────────────────▼──────────────────────────────┐
│                       TildaMCP Server                        │
│             Tools: create_page, append_block,                │
│             update_block, inspect_visuals, publish           │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
│  CSS/HTML Guardrails Engine │ │       SessionManager        │
│  - Zero-Collision Scoping   │ │   - storage_state.json      │
│  - Tilda 4-tier Breakpoints │ │   - Headless check          │
└──────────────┬──────────────┘ └──────────────┬──────────────┘
               │                               │
┌──────────────▼───────────────────────────────▼──────────────┐
│                    TildaPlaywrightDriver                     │
│  - Resilient UI multi-tier selector engine                   │
│  - Zero-lag Ace Editor direct JS context injection           │
│  - Dual-viewport screenshot capture (1440x900 & 390x844)     │
│  - Automatic page publishing and live URL parser             │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
d:/TildaMCP/
├── src/
│   ├── index.ts               # MCP Server entry point (StdioServerTransport, Zod tools)
│   ├── config.ts              # Global timeouts, viewports, breakpoints, paths
│   ├── types/
│   │   └── index.ts           # Interfaces and data contracts
│   ├── auth/
│   │   ├── session-manager.ts # Headless session validation and health check
│   │   └── login-helper.ts    # Interactive headful login utility (saves storage_state.json)
│   ├── driver/
│   │   ├── selectors.ts       # Resilient multi-tier selectors for Tilda UI
│   │   ├── ace-helper.ts      # Direct Ace Editor evaluated JS injection
│   │   └── tilda-driver.ts    # Playwright automation core for Tilda editor
│   └── builder/
│       ├── guardrails.ts      # CSS/HTML validation & auto-scoping engine
│       └── block-packager.ts  # Packages HTML + CSS + JS into isolated T123 snippet
├── prompts/
│   └── system-prompt.md       # Orchestrator LLM system prompt (Vision feedback loop)
├── storage/
│   ├── storage_state.json     # Saved Tilda cookies and local storage
│   └── screenshots/           # Desktop & Mobile preview captures
├── test-builder.ts            # Guardrails and packager verification test
├── package.json
├── tsconfig.json
└── README.md
```

---

## Quick Start & Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- An active **Tilda Publishing** account

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
npx playwright install chromium
```

### 3. Session Authentication (One-Time Setup)
Run the interactive login helper to authenticate and export session cookies:
```bash
npm run login
```
1. A visible Chrome/Chromium window will open at `https://tilda.cc/identity/login/`.
2. Enter your credentials, complete 2FA / Captcha if required.
3. Once you reach your project list, the script automatically exports cookies to `storage/storage_state.json` and closes the browser.

### 4. Build & Start
```bash
# Build TypeScript
npm run build

# Start MCP Server on stdio
npm start

# Or run in development mode with tsx
npm run dev
```

---

## Configuring MCP in AI Clients

### Claude Desktop (`claude_desktop_config.json`)
Add the following to your Claude Desktop configuration file:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "tilda": {
      "command": "node",
      "args": ["d:/TildaMCP/dist/index.js"],
      "env": {
        "TILDA_STORAGE_STATE_PATH": "d:/TildaMCP/storage/storage_state.json"
      }
    }
  }
}
```

### Cursor / Antigravity / Other MCP Clients
Configure as a standard stdio MCP server:
- **Command**: `node`
- **Args**: `["<path_to_TildaMCP>/dist/index.js"]`

---

## MCP Tools Reference

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `tilda_check_auth` | *(none)* | Verifies if current session cookies are valid. |
| `tilda_create_page` | `projectId`, `title?` | Creates a new blank page in the specified Tilda project. |
| `tilda_append_html_block` | `pageId`, `blockName`, `htmlMarkup`, `cssStyles`, `jsCode?`, `targetRecordId?` | Packages, validates, and injects a new `T123` block into the page. |
| `tilda_update_html_block` | `pageId`, `recordId`, `updatedCode` | Rewrites code in an existing `T123` block to fix design flaws. |
| `tilda_inspect_visuals` | `pageId` | Captures Desktop (1440x900) and Mobile (390x844) preview screenshots for vision analysis. |
| `tilda_publish` | `pageId` | Clicks "Publish" in Tilda, closes popup, and returns live public URL. |

---

## Critical CSS/HTML Guardrails for AI

1. **Zero Collision (Container Scoping)**:  
   Every block is wrapped in `#block-ai-[hash]`. All CSS selectors must be prefixed or scoped. Global resets on `html`, `body`, `h1`, `p`, `button`, etc. are strictly prohibited.
2. **Standard Tilda Breakpoints**:  
   All styles must implement responsive overrides for:
   - `@media (max-width: 1200px)` — Small desktops / large tablets
   - `@media (max-width: 960px)` — Tablets in landscape
   - `@media (max-width: 640px)` — Tablets in portrait / large phones
   - `@media (max-width: 480px)` — Mobile phones
3. **Ace Editor Direct Injection**:  
   Bypasses simulated keyboard typing. Evaluates `editor.setValue(code, -1)` directly in the page DOM context to eliminate input latency and dropped characters.
4. **Autonomous Vision Feedback Loop**:  
   After injecting blocks, the AI takes dual screenshots, inspects them for mobile overlap or text clipping, applies fixes via `tilda_update_html_block`, and publishes only when verified.
