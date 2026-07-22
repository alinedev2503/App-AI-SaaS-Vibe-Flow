# Vibe flow — Agent Architecture

## Overview
Vibe flow manages **AI agents** — autonomous digital workers powered by Gemini models. Each agent has an identity, capabilities, memory, and tool access via the MCP protocol.

## Agent Model

```
Agent
├── Identity (name, role, persona)
├── Status (Online | Learning | Idle | Paused)
├── Capabilities (Text | Vision | Voice | Web | Data)
├── Memory
│   ├── Working memory (short-term context)
│   └── Long-term memory (persistent across sessions)
├── Multimodal Controls
│   ├── Voice latency / synthesis
│   └── Audio output (TTS via Gemini)
└── MCP Tool Access
    ├── Salesforce (read/write CRM)
    ├── HubSpot (marketing automation)
    └── PostgreSQL (internal DB)
```

## Agent Types

| Agent | Role | Capabilities | Status |
|---|---|---|---|
| Sales Specialist | Prospecting & CRM | Text, Vision, Voice | Online |
| Support Specialist | Customer Success | Text, Vision | Learning |
| Research Analyst | Market intelligence | Text, Web | Idle |
| Data Analyst | Processing & Viz | Text, Data | Online |
| Marketing Specialist | Content & SEO | Text, Vision, Web | Paused |
| Project Coordinator | Task & Team Mgmt | Text, Voice | Online |

## MCP (Model Context Protocol)
Agents access external tools through the MCP Gateway:
- **search_crm** — Query customer records
- **send_email** — Compose and dispatch emails
- Extensible via `/src/lib/mcp.ts`

## AI Engine
- **Fast path**: Gemini 3 Flash Preview (default for Command Center)
- **Deep reasoning**: Gemini 3.1 Pro Preview (Thinking Mode)
- **Audio**: Gemini 2.5 Flash TTS (voice synthesis)
- Streaming responses via `generateContentStream`

## Security Layers
1. **Layer 1** — Deterministic Rules: Fixed policy enforcement
2. **Layer 2** — ML Anomaly Detection: Behavioral pattern recognition
3. **Layer 3** — Semantic Firewall: LLM prompt injection protection
