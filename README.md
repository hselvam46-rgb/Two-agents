# Two Agents, One Truth — MeTTa Multi-Agent Consensus Engine

> *"Two agents. Two conflicting beliefs. Watch them negotiate live using MeTTa reasoning until they reach one answer both can defend."*

**Two Agents, One Truth** is an AI research and dialectic deliberation engine where two opposing autonomous agents scour live web sources from opposing viewpoints, ingest polar knowledge bases, and negotiate across multiple dialectic rounds using **MeTTa symbolic reasoning** (OpenCog Hyperon) to converge on a single, invariant, cited truth.

---

## 🌟 Key Architecture & Features

### 1. Opposing Belief-Splitter Architecture
- 🟢 **Agent A (Thesis / Supports Premise)**: Identifies primary strengths, empirical capabilities, and optimal operating scenarios.
- 🔴 **Agent B (Antithesis / Flags Constraints)**: Identifies failure modes, boundary limits, and adverse trade-offs.
- **Knowledge Base Ingestion**: Grounded in live internet citations `[1]..[N]` with continuous TruthValues `[strength, confidence]`.

### 2. Multi-Round MeTTa Dialectic Negotiation Loop
- **`[ Round 1 ] → [ Round 2 ] → [ Round 3 ] → [ ✓ Consensus ]`**
- Interactive stepper showing:
  - **Round 1**: Primary thesis assertion & initial AtomSpace binding.
  - **Round 2**: Counter-challenge with boundary evidence.
  - **Round 3**: Concession of operational boundaries and introduction of critical conditioning variables.
  - **Round 4**: Invariant consensus reached & shared invariant atom assertion.

### 3. "Agent Memory Updated" (OpenCog Hyperon Rule-Diff)
- Visualizes real-time knowledge space self-modification (`&kb-a` and `&kb-b`):
  - `-` Unchanged baseline premise
  - `+` Added shared invariant condition
  - `!` Flagged contested constraint (retained in memory rather than deleted)

### 4. Flexible Reading Modes
- 📌 **Bullet Points (Default)**: High-impact, categorized breakdown with icons (`🟢 The Case For`, `🔴 Critical Boundaries`, `⚖️ The Negotiated One Truth`, `💡 Practical Rules of Thumb`).
- 📖 **Paragraph View**: Clean executive narrative summary with embedded clickable citations.
- 📑 **Full Breakdown**: Complete analytical report with decision guide.
- 💻 **MeTTa Dialogue**: Symbolic dialectic rounds transcript.

### 5. Contextual "Suggested Next Research" (ChatGPT-Style)
- 4 dynamic, clickable follow-up research questions tailored to the searched topic.
- Clicking any follow-up immediately launches the two-agent engine to investigate that angle deeper.

### 6. Citation Engine & ChatGPT UI Replica
- Perplexity/Claude-style source cards with favicons, snippets, and domain links.
- Interactive modal previews upon clicking any `[1]`, `[2]`, `[3]` in-text citation pill.
- Polished dark and light themes, collapsible sidebar session history, and live status badge (`Negotiating...` / `Consensus Reached` / `Ready to Negotiate`).

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18+ installed

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/hselvam46-rgb/Two-agents.git
cd Two-agents

# Install dependencies
npm run install:all
```

### 3. Run Locally
```bash
# Terminal 1: Backend Server (Port 3001)
npm run server

# Terminal 2: Frontend Client (Port 5173)
npm run client
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Vanilla CSS design tokens (ChatGPT design system), Lucide Icons, Marked parser.
- **Backend**: Node.js, Express 5, Server-Sent Events (SSE) streaming (`/api/chat/stream`).
- **Reasoning**: MeTTa (OpenCog Hyperon) dialectic reduction & TruthValue space evaluation.
- **Search**: Parallel DuckDuckGo & Wikipedia search scraper with zero API key requirement, plus Tavily API support.
- **LLM Synthesis**: Works 100% free out-of-the-box with built-in multi-agent synthesis, with optional BYO keys for Google Gemini, OpenAI, and Groq.
