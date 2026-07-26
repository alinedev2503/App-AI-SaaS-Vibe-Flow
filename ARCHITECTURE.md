# VibeFlow — System Architecture

**Versão:** 1.0.0  
**Última atualização:** Julho 2026

---

## 1. Visão Geral

VibeFlow é uma aplicação **full-stack monorepo** com frontend React e backend Express no mesmo repositório. O servidor Express serve os assets compilados do frontend e expõe a API REST — sem infraestrutura separada na fase inicial.

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                           │
│                                                                    │
│  React 19 + Vite + Tailwind 4 + TypeScript                       │
│                                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │Dashboard │  │Agent Hub │  │Command Center│  │MCP Gateway  │  │
│  └──────────┘  └──────────┘  └──────────────┘  └─────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │Approval  │  │Audit Logs│  │Settings      │  │Branding     │  │
│  │Queue     │  │          │  │              │  │(White-Label)│  │
│  └──────────┘  └──────────┘  └──────────────┘  └─────────────┘  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTPS / REST API
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Express Server (Node.js 20)                      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  REST API Routes                                          │     │
│  │  POST /api/auth/login  POST /api/auth/register            │     │
│  │  GET  /api/agents      POST /api/agents                   │     │
│  │  GET  /api/audit       POST /api/audit                    │     │
│  │  GET  /api/approvals   PATCH /api/approvals/:id           │     │
│  │  GET  /api/tools       POST /api/tools/execute            │     │
│  │  GET  /api/settings    PUT  /api/settings                 │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                    │
│  ┌──────────────────┐  ┌─────────────────┐  ┌────────────────┐   │
│  │  Auth Middleware  │  │  Rate Limiting  │  │  Helmet (CSP)  │   │
│  │  (JWT validation) │  │  (100 req/min)  │  │  (HSTS, XFO)   │   │
│  └──────────────────┘  └─────────────────┘  └────────────────┘   │
└───────────┬──────────────────┬────────────────────┬───────────────┘
            │                  │                    │
            ▼                  ▼                    ▼
  ┌──────────────┐    ┌──────────────────┐   ┌──────────────────┐
  │    SQLite    │    │   Google Gemini  │   │  External APIs   │
  │  (embedded)  │    │   API (GenAI)    │   │  Salesforce      │
  │              │    │                  │   │  HubSpot         │
  │  users       │    │  Flash / Pro     │   │  PostgreSQL      │
  │  agents      │    │  TTS / Vision    │   │  Slack           │
  │  audit_logs  │    │                  │   │  (via MCP)       │
  │  approvals   │    └──────────────────┘   └──────────────────┘
  │  api_keys    │
  └──────────────┘
```

---

## 2. Estrutura de Diretórios

```
vibeflow/
├── src/                              # Frontend React
│   ├── App.tsx                       # Roteador principal (React Router v7)
│   ├── main.tsx                      # Entry point (ReactDOM.createRoot)
│   ├── index.css                     # Tailwind v4 + variáveis CSS (light/dark)
│   │
│   ├── components/
│   │   └── layout/
│   │       ├── Layout.tsx            # Shell: Sidebar + Header + <Outlet>
│   │       ├── Sidebar.tsx           # Navegação lateral
│   │       └── Header.tsx            # Search, notificações, perfil
│   │
│   ├── contexts/
│   │   ├── ThemeContext.tsx          # Dark/light toggle (localStorage)
│   │   ├── LanguageContext.tsx       # i18n pt-BR/en-US/es-ES
│   │   └── ToastContext.tsx          # Notificações toast
│   │
│   ├── lib/
│   │   ├── gemini.ts                 # Client Gemini AI + model config + streaming
│   │   ├── mcp.ts                    # MCP tool definitions + executor
│   │   ├── api.ts                    # Fetch wrapper para o backend REST
│   │   └── utils.ts                  # cn() (clsx + twMerge), formatters
│   │
│   ├── locales/
│   │   ├── pt-BR.ts                  # Strings em português
│   │   ├── en-US.ts                  # Strings em inglês
│   │   └── es-ES.ts                  # Strings em espanhol
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx           # /  — marketing + CTA
│   │   ├── Login.tsx                 # /login
│   │   ├── ForgotPassword.tsx        # /forgot-password
│   │   ├── Dashboard.tsx             # /dashboard
│   │   ├── AgentHub.tsx              # /agents
│   │   ├── CommandCenter.tsx         # /command
│   │   ├── MCPGateway.tsx            # /mcp
│   │   ├── ApprovalQueue.tsx         # /approvals
│   │   ├── AuditLogs.tsx             # /audit
│   │   ├── Settings.tsx              # /settings
│   │   ├── Branding.tsx              # /branding
│   │   ├── Admin.tsx                 # /admin
│   │   └── Checkout.tsx              # /checkout
│   │
│   └── __tests__/                    # Testes unitários (Vitest)
│
├── server/                           # Backend Express
│   ├── index.ts                      # Entry point do servidor
│   ├── db/
│   │   ├── adapters/
│   │   │   ├── sqlite.ts             # Adapter SQLite (padrão)
│   │   │   ├── supabase.ts           # Adapter Supabase (opcional)
│   │   │   └── firebase.ts           # Adapter Firebase (opcional)
│   │   └── migrations/
│   │       ├── 001_users.sql
│   │       ├── 002_agents.sql
│   │       ├── 003_audit_logs.sql
│   │       ├── 004_approvals.sql
│   │       └── 005_api_keys.sql
│   ├── lib/
│   │   ├── auth.ts                   # JWT sign/verify helpers
│   │   ├── crypto.ts                 # bcrypt helpers
│   │   └── logger.ts                 # Pino logger config
│   ├── middleware/
│   │   ├── authenticate.ts           # Verifica JWT
│   │   ├── requireAdmin.ts           # Verifica role=admin
│   │   └── rateLimiter.ts            # Express rate-limit config
│   └── routes/
│       ├── auth.ts                   # /api/auth/*
│       ├── agents.ts                 # /api/agents/*
│       ├── audit.ts                  # /api/audit/*
│       ├── approvals.ts              # /api/approvals/*
│       ├── tools.ts                  # /api/tools/*
│       ├── settings.ts               # /api/settings/*
│       └── admin.ts                  # /api/admin/*
│
├── scripts/
│   ├── setup.ts                      # Init banco + verifica config
│   └── seed.ts                       # Popula dados de exemplo
│
├── data/                             # Gerado em runtime
│   ├── vibeflow.db                   # SQLite database
│   └── uploads/                      # Arquivos enviados (logos, etc.)
│
├── tests/                            # Testes de integração
├── public/                           # Assets estáticos servidos pelo Express
└── dist/                             # Build de produção (gerado pelo Vite)
```

---

## 3. Fluxo de Dados

### 3.1 Autenticação

```
POST /api/auth/login
  → Valida email/senha no SQLite (bcrypt.compare)
  → Gera JWT (payload: userId, role, exp)
  → Retorna { token, user }
  → Frontend armazena token em memória (não localStorage)
  → Cada request subsequente envia: Authorization: Bearer <token>
  → Middleware authenticate.ts valida o JWT
```

### 3.2 Chat com Gemini (Command Center)

```
Usuário digita → React state update
  → POST /api/chat (ou chamada direta ao Gemini SDK no frontend)
  → GoogleGenAI.models.generateContentStream()
  → Stream de chunks → SSE ou ReadableStream
  → Frontend acumula texto e renderiza progressivamente
  → TTS opcional: Gemini TTS → base64 MP3 → AudioContext.play()
```

### 3.3 Approval Queue (Human-in-the-Loop)

```
Agente detecta ação crítica
  → POST /api/approvals { agentId, action, payload, impact }
  → Salva no SQLite com status='pending'
  → Dashboard atualiza contador (polling a cada 30s ou WebSocket futuro)
  → Admin visualiza na ApprovalQueue
  → PATCH /api/approvals/:id { status: 'approved' | 'rejected', comment }
  → Agente recebe callback e procede ou aborta
  → Audit log gerado automaticamente
```

### 3.4 MCP Tool Execution

```
Agente solicita ferramenta
  → mcp.ts: executeTool(toolName, params)
  → Lookup no registry de tools
  → Chama API externa (Salesforce, HubSpot, PostgreSQL)
  → Retorna resultado estruturado
  → Log de execução salvo no SQLite
```

---

## 4. Schema do Banco de Dados

```sql
-- Usuários
CREATE TABLE users (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,           -- bcrypt hash
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'operator', -- admin | operator | viewer
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Agentes
CREATE TABLE agents (
  id           TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name         TEXT NOT NULL,
  role         TEXT NOT NULL,
  persona      TEXT,
  status       TEXT NOT NULL DEFAULT 'idle', -- online | learning | idle | paused
  capabilities TEXT NOT NULL DEFAULT '[]',   -- JSON array
  model        TEXT NOT NULL DEFAULT 'gemini-3-flash-preview',
  memory_limit INTEGER NOT NULL DEFAULT 4096,
  created_by   TEXT REFERENCES users(id),
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Audit Logs
CREATE TABLE audit_logs (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  agent_id    TEXT REFERENCES agents(id),
  user_id     TEXT REFERENCES users(id),
  action_type TEXT NOT NULL,   -- message_sent | tool_called | status_changed | etc.
  description TEXT NOT NULL,
  metadata    TEXT,            -- JSON extra data
  status      TEXT NOT NULL,   -- success | failed | pending
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Approval Queue
CREATE TABLE approvals (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  agent_id    TEXT REFERENCES agents(id),
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  payload     TEXT,            -- JSON do payload da ação
  impact      TEXT NOT NULL DEFAULT 'medium', -- low | medium | high | critical
  status      TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  reviewed_by TEXT REFERENCES users(id),
  comment     TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  reviewed_at TEXT
);

-- API Keys
CREATE TABLE api_keys (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id     TEXT REFERENCES users(id),
  name        TEXT NOT NULL,
  key_hash    TEXT NOT NULL,   -- hash da chave (nunca armazenar em texto puro)
  last_used   TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## 5. Design do Frontend

### 5.1 Sistema de Temas

```css
/* index.css — CSS Custom Properties */
:root {
  --color-primary:     hsl(270 85% 60%);   /* Roxo VibeFlow */
  --color-bg:          hsl(224 15% 8%);    /* Dark background */
  --color-surface:     hsl(224 15% 12%);   /* Cards / panels */
  --color-border:      hsl(224 15% 18%);   /* Borders sutis */
  --color-text:        hsl(220 15% 92%);   /* Texto principal */
  --color-text-muted:  hsl(220 10% 60%);   /* Texto secundário */
}

.light {
  --color-bg:          hsl(0 0% 98%);
  --color-surface:     hsl(0 0% 100%);
  /* ... */
}
```

### 5.2 Glassmorphism

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
}
```

### 5.3 Padrão de Componente

```tsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  title: string;
  variant?: "default" | "danger";
}

export default function ExampleComponent({ title, variant = "default" }: Props) {
  const { t } = useLanguage();
  const [active, setActive] = useState(false);

  return (
    <div className={cn(
      "glass-card p-4",
      variant === "danger" && "border-red-500/30"
    )}>
      <h2>{t('section.key')}</h2>
    </div>
  );
}
```

---

## 6. Decisões de Arquitetura

| Decisão | Escolha | Justificativa |
|---|---|---|
| Banco de dados | SQLite (better-sqlite3) | Zero config, embedded, suficiente para fase inicial |
| ORM | Nenhum | SQL direto via better-sqlite3 — mais controle, menos abstração |
| Auth | JWT próprio | Sem dependência de serviços externos na fase 1 |
| Estado global | Context API | Sem necessidade de Redux/Zustand para a escala atual |
| Build | Vite | HMR ultrarrápido, suporte nativo ESM |
| CSS | Tailwind v4 | `@theme` directives, zero purge config, JIT nativo |
| Servidor | Express + tsx | Mesma linguagem (TypeScript) no front e back |
| Deploy padrão | Cloud Run | Auto-scaling, zero config de infra, HTTPS automático |
| Dark mode | Default dark | Target audience (devs/ops) prefere dark-first |
| i18n | Context custom | Sem biblioteca externa — `t('key')` simples e direto |

---

## 7. Segurança em Camadas

```
┌─────────────────────────────────────────────┐
│  Camada 3: Semantic Firewall (LLM-based)     │
│  Detecta prompt injection e jailbreak        │
├─────────────────────────────────────────────┤
│  Camada 2: ML Anomaly Detection              │
│  Identifica padrões de comportamento anômal  │
├─────────────────────────────────────────────┤
│  Camada 1: Deterministic Rules               │
│  Políticas fixas: rate limits, allowlists    │
└─────────────────────────────────────────────┘
         + Human-in-the-Loop (Approval Queue)
         + Audit Log Imutável (SQLite WAL)
```

---

## 8. Plano de Escalabilidade

| Fase | Banco | Deploy | Throughput esperado |
|---|---|---|---|
| Fase 1 (atual) | SQLite embedded | Cloud Run single instance | < 100 usuários simultâneos |
| Fase 2 | Supabase (PostgreSQL) | Cloud Run + CDN | < 1.000 usuários |
| Fase 3 | Supabase + Redis cache | Multi-region | < 10.000 usuários |
| Fase 4 | Sharding + Spanner | Kubernetes | 100k+ usuários |

O adapter pattern em `server/db/adapters/` permite trocar o banco sem alterar a lógica de negócio.
