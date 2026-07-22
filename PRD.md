# Vibe flow — Product Requirements Document

## 1. Product Overview
**Vibe flow** is a SaaS platform for orchestrating autonomous AI agents. It provides a unified command center to deploy, monitor, and manage digital workers that handle sales, support, research, marketing, and data analysis — all powered by Google Gemini.

## 2. Problem Statement
Businesses need to coordinate multiple AI agents across CRM, support, marketing, and analytics without switching between disparate tools. Current solutions lack a unified hub for human-in-the-loop approval, audit logging, and brand white-labeling.

## 3. Target Audience
- Operations teams managing AI workloads
- Sales and support teams using AI assistants
- Platform administrators requiring governance and audit trails
- Enterprises needing white-label branding

## 4. Core Features

| Feature | Description | Priority |
|---|---|---|
| Agent Hub | Deploy, pause, duplicate, configure AI agents with multimodal capabilities | P0 |
| Command Center | Real-time chat with Gemini Flash/Pro, streaming, TTS audio output | P0 |
| Dashboard | KPIs, agent status matrix, MCP integration health, security insights | P0 |
| MCP Gateway | Connect external tools (Salesforce, HubSpot, PostgreSQL) via MCP protocol | P0 |
| Approval Queue | Human-in-the-loop oversight for critical agent actions | P0 |
| Audit Logs | Immutable event trail for compliance and debugging | P0 |
| White-Label Branding | Custom logos, colors, typography, and domain | P1 |
| Multi-language | i18n support (pt-BR, en-US, es-ES) | P1 |
| Theme | Light/dark mode toggle | P1 |
| Login & Auth | Email/password + OAuth (GitHub, Google) | P1 |

## 5. User Stories
- As an ops manager, I want to monitor all active agents on a single dashboard so I can spot issues instantly.
- As a sales rep, I want to chat with the Command Center to generate leads and update CRM records.
- As an admin, I want to approve or reject agent-proposed actions before they execute.
- As a compliance officer, I want a tamper-proof audit log of every agent action.

## 6. Technical Architecture
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4
- **AI**: Google GenAI SDK (Gemini 3 Flash/Pro, TTS)
- **Backend**: Express (embedded server via tsx)
- **Database**: Better-SQLite3 (embedded)
- **MCP**: Model Context Protocol for tool integrations

## 7. Success Metrics
- Agent response time < 500ms (p95)
- Dashboard load < 2s
- Zero unapproved critical actions
- 99.9% audit log integrity
