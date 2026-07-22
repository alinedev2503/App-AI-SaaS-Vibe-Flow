# Vibe flow — System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  React 19 + Vite + Tailwind 4 + TypeScript               │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │Dashboard│ │Agent Hub │ │Command   │ │ MCP Gateway│  │
│  │         │ │          │ │Center    │ │            │  │
│  └─────────┘ └──────────┘ └──────────┘ └────────────┘  │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │Approval │ │Audit     │ │Settings  │ │ Branding   │  │
│  │ Queue   │ │ Logs     │ │          │ │ (White-Lbl)│  │
│  └─────────┘ └──────────┘ └──────────┘ └────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / WebSocket
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Express Server (Node.js)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  REST API (auth, agents, tools, audit, settings)  │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  MCP Protocol Layer (tool execution)              │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│  SQLite    │ │  Gemini   │ │ External   │
│  Database  │ │  API      │ │ APIs       │
│  (embedded)│ │  (Google) │ │(Salesforce,│
│            │ │           │ │ HubSpot)   │
└────────────┘ └────────────┘ └────────────┘
```

## Frontend Architecture

```
src/
├── App.tsx                  # Router (8 routes + login)
├── main.tsx                 # ReactDOM entry
├── index.css                # Tailwind + CSS vars (light/dark)
├── components/
│   └── layout/
│       ├── Layout.tsx       # Shell (Sidebar + Header + Outlet)
│       ├── Sidebar.tsx      # Navigation
│       └── Header.tsx       # Search bar, status, profile
├── contexts/
│   ├── ThemeContext.tsx      # Dark/light toggle (localStorage)
│   └── LanguageContext.tsx   # i18n pt-BR/en-US/es-ES
├── lib/
│   ├── gemini.ts            # Gemini AI client + model config
│   ├── mcp.ts               # MCP tool definitions and executor
│   └── utils.ts             # cn() helper (clsx + twMerge)
├── locales/
│   ├── pt-BR.ts
│   ├── en-US.ts
│   └── es-ES.ts
└── pages/
    ├── Dashboard.tsx
    ├── AgentHub.tsx
    ├── CommandCenter.tsx
    ├── MCPGateway.tsx
    ├── ApprovalQueue.tsx
    ├── AuditLogs.tsx
    ├── Settings.tsx
    ├── Branding.tsx
    └── Login.tsx
```

## Data Flow

```
User Action → React Component → State Update → Re-render
                                        ↓
                              API Call (future)
                                        ↓
                              SQLite + Gemini Response
                                        ↓
                              State Update → UI
```

## Key Design Decisions
- **No ORM** — SQLite via better-sqlite3 for simplicity and zero-config
- **Embedded server** — Express runs in the same process via `tsx`
- **Dark-first UI** — Default theme is dark; light mode is an option
- **i18n at the component level** — Every string is a `t('key')` call
- **MCP as abstraction layer** — Tools are registered in a single file and called by name
