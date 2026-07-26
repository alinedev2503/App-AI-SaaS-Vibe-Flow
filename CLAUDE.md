# CLAUDE.md — VibeFlow Developer Quick Reference

> Referência rápida para desenvolvedores e agentes de IA trabalhando no codebase do VibeFlow.

---

## Visão Geral do Projeto

**VibeFlow** é uma plataforma SaaS de orquestração de agentes de IA autônomos.

| Item | Detalhe |
|---|---|
| **Stack frontend** | React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS 4 |
| **Stack backend** | Express 4 + TypeScript + better-sqlite3 |
| **IA** | Google GenAI SDK (@google/genai) — Gemini Flash/Pro/TTS |
| **Auth** | JWT (jsonwebtoken) + bcrypt |
| **Porta dev** | 3000 (Express serve frontend + API) |
| **Banco** | SQLite em `./data/vibeflow.db` |

---

## Comandos Essenciais

```bash
# ── Desenvolvimento ────────────────────────────────────────────────────
npm run dev           # Frontend apenas (Vite, porta 5173)
npm run dev:server    # Backend apenas (tsx watch, porta 3000)
npm run dev:all       # Frontend + Backend simultâneos (USE ESTE)

# ── Build & Produção ───────────────────────────────────────────────────
npm run build         # Compila frontend (dist/) + backend (dist/server/)
npm run start         # Servidor de produção (requer build prévio)
npm run preview       # Preview do build de produção

# ── Qualidade ──────────────────────────────────────────────────────────
npm run lint          # TypeScript typecheck (tsc --noEmit) — sem JS errors
npm run test          # Testes unitários e integração (Vitest)
npm run test:watch    # Testes em modo watch
npm run test:coverage # Testes com relatório de cobertura

# ── Banco de Dados ─────────────────────────────────────────────────────
npm run setup         # Inicializa banco SQLite + verifica configuração
npm run seed          # Popula dados de demonstração (users, agents, logs)
npm run db:reset      # CUIDADO: apaga e recria o banco (pede confirmação)

# ── Utilitários ───────────────────────────────────────────────────────
npm run clean         # Remove dist/ e arquivos de build
```

---

## Estrutura de Arquivos

```
src/
├── App.tsx                     ← Roteador principal (React Router v7)
├── main.tsx                    ← Entry point (ReactDOM.createRoot)
├── index.css                   ← Tailwind v4 + variáveis CSS de tema
│
├── components/layout/
│   ├── Layout.tsx              ← Shell: Sidebar + Header + <Outlet>
│   ├── Sidebar.tsx             ← Navegação lateral com ícones
│   └── Header.tsx              ← Barra superior: search, notif, perfil
│
├── contexts/
│   ├── ThemeContext.tsx         ← dark/light toggle (localStorage)
│   ├── LanguageContext.tsx      ← i18n: pt-BR / en-US / es-ES
│   └── ToastContext.tsx         ← Notificações toast
│
├── lib/
│   ├── gemini.ts               ← Client Gemini AI + model config + fns
│   ├── mcp.ts                  ← MCP tool registry + executor
│   ├── api.ts                  ← Fetch wrapper para a API REST
│   └── utils.ts                ← cn() (clsx+twMerge), formatters
│
├── locales/
│   ├── pt-BR.ts                ← Strings em português (idioma base)
│   ├── en-US.ts                ← Strings em inglês
│   └── es-ES.ts                ← Strings em espanhol
│
└── pages/
    ├── LandingPage.tsx          ← /  — marketing
    ├── Login.tsx                ← /login
    ├── ForgotPassword.tsx       ← /forgot-password
    ├── Dashboard.tsx            ← /dashboard
    ├── AgentHub.tsx             ← /agents
    ├── CommandCenter.tsx        ← /command
    ├── MCPGateway.tsx           ← /mcp
    ├── ApprovalQueue.tsx        ← /approvals
    ├── AuditLogs.tsx            ← /audit
    ├── Settings.tsx             ← /settings
    ├── Branding.tsx             ← /branding
    ├── Admin.tsx                ← /admin
    └── Checkout.tsx             ← /checkout

server/
├── index.ts                    ← Entry point (Express app)
├── db/
│   ├── adapters/sqlite.ts      ← Adapter ativo (padrão)
│   └── migrations/             ← 001_users.sql .. 005_api_keys.sql
├── lib/
│   ├── auth.ts                 ← jwt.sign / jwt.verify helpers
│   ├── crypto.ts               ← bcrypt.hash / bcrypt.compare
│   └── logger.ts               ← Pino logger config
├── middleware/
│   ├── authenticate.ts         ← Verifica JWT em cada request
│   ├── requireAdmin.ts         ← Verifica role === 'admin'
│   └── rateLimiter.ts          ← express-rate-limit config
└── routes/
    ├── auth.ts                 ← POST /api/auth/*
    ├── agents.ts               ← GET/POST/PATCH/DELETE /api/agents
    ├── audit.ts                ← GET /api/audit
    ├── approvals.ts            ← GET/PATCH /api/approvals
    ├── tools.ts                ← GET/POST /api/tools
    ├── settings.ts             ← GET/PUT /api/settings
    └── admin.ts                ← GET/POST /api/admin/*
```

---

## Convenções de Código

### Imports
```typescript
// ✅ Sempre use o alias @/ para imports de src/
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// ❌ Nunca use caminhos relativos longos
import { cn } from "../../../lib/utils";
```

### i18n — Regra de ouro
```tsx
const { t } = useLanguage();

// ✅ SEMPRE via t()
<h1>{t('dashboard.title')}</h1>

// ❌ NUNCA strings hardcoded em JSX
<h1>Dashboard</h1>
```

### Classes CSS condicionais
```tsx
import { cn } from "@/lib/utils";

// ✅ Use cn() para condicionais
className={cn("base-class", isActive && "text-primary", variant === "danger" && "text-red-400")}

// ❌ Não concatene strings
className={"base-class " + (isActive ? "text-primary" : "")}
```

### Estado de loading
```typescript
// ✅ Estado estruturado para dados assíncronos
const [state, setState] = useState<{
  data: T | null;
  isLoading: boolean;
  error: string | null;
}>({ data: null, isLoading: false, error: null });
```

### Handlers de evento
```tsx
// ✅ Prefixo handle + verbo
function handleSendMessage() {}
function handleStatusChange(id: string) {}
function handleDeleteAgent(agentId: string) {}
```

---

## Contextos Globais

### ThemeContext
```tsx
import { useTheme } from "@/contexts/ThemeContext";

const { theme, isDark, toggleTheme } = useTheme();
// theme: 'dark' | 'light'
// isDark: boolean (atalho)
// toggleTheme: () => void
```

### LanguageContext
```tsx
import { useLanguage } from "@/contexts/LanguageContext";

const { language, t, setLanguage } = useLanguage();
// language: 'pt-BR' | 'en-US' | 'es-ES'
// t(key: string, vars?: Record<string, unknown>): string
// setLanguage: (lang: Language) => void
```

### ToastContext
```tsx
import { useToast } from "@/contexts/ToastContext";

const { showToast } = useToast();
showToast("Agente criado com sucesso!", "success");
showToast("Erro ao conectar", "error");
showToast("Aprovação pendente", "warning");
```

---

## Gemini AI — Uso rápido

```typescript
import { generateText, generateStream, generateSpeech, models } from "@/lib/gemini";

// Texto simples
const text = await generateText("Seu prompt", models.flash);

// Streaming (use no Command Center)
const stream = await generateStream("Seu prompt", models.flash);
for await (const chunk of stream) {
  setOutput(prev => prev + (chunk.text ?? ""));
}

// Text-to-Speech
const audioBase64 = await generateSpeech("Texto para falar");

// Modelos disponíveis
models.flash       // gemini-3-flash-preview (padrão)
models.pro         // gemini-3.1-pro-preview (Thinking Mode)
models.flashLite   // gemini-3.1-flash-lite-preview
models.flashImage  // gemini-3.1-flash-image-preview (visão)
models.tts         // gemini-2.5-flash-preview-tts
```

---

## API REST — Referência Rápida

Todas as rotas protegidas exigem: `Authorization: Bearer <token>`

```
POST   /api/auth/login              → { token, user }
POST   /api/auth/register           → { token, user }
POST   /api/auth/forgot-password    → { message }
POST   /api/auth/reset-password     → { message }

GET    /api/agents                  → Agent[]
POST   /api/agents                  → Agent
PATCH  /api/agents/:id              → Agent
DELETE /api/agents/:id              → { message }

GET    /api/audit?page=1&limit=50   → { logs: AuditLog[], total }
GET    /api/approvals?status=pending → Approval[]
PATCH  /api/approvals/:id           → Approval

GET    /api/settings                → Settings
PUT    /api/settings                → Settings

GET    /api/admin/users             → User[] (admin only)
POST   /api/admin/users             → User (admin only)

GET    /api/health                  → { status: "ok", uptime }
```

---

## Variáveis de Ambiente

```bash
# Obrigatórias
GEMINI_API_KEY=sua_chave_gemini    # API key do Google AI Studio
JWT_SECRET=secret_64_chars_min    # Secret para JWT (gere com: openssl rand -hex 32)

# Opcionais
PORT=3000                         # Porta do servidor (default: 3000)
NODE_ENV=development              # development | production
APP_URL=http://localhost:3000     # URL pública (para links em emails)
DB_PATH=./data/vibeflow.db        # Caminho do SQLite
DISABLE_HMR=false                 # true para Cloud Run
LOG_LEVEL=info                    # debug | info | warn | error
```

---

## Contexto do AI Studio

- App criado originalmente no **Google AI Studio**
- `GEMINI_API_KEY` é injetada automaticamente via Secrets do AI Studio
- `APP_URL` é injetada com a URL do Cloud Run no deploy
- `DISABLE_HMR=true` é definido automaticamente no Cloud Run
- Build de produção: `npm run build` — frontend em `dist/`, servidor em `dist/server/`

---

## Credenciais de Teste (SQLite local)

```
Admin:     admin@vibeflow.ai    / admin123
Operador:  operator@vibeflow.ai / operator123
Viewer:    viewer@vibeflow.ai   / viewer123
```

---

## Documentação Adicional

| Documento | Conteúdo |
|---|---|
| [README.md](./README.md) | Visão geral, instalação, stack |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Diagrama, schema SQL, fluxos de dados |
| [AGENT.md](./AGENT.md) | Arquitetura de agentes, MCP, segurança |
| [GEMINI.md](./GEMINI.md) | Integração com Gemini AI — todos os modos |
| [STYLE_GUIDE.md](./STYLE_GUIDE.md) | Padrões TypeScript, CSS, i18n |
| [DEPLOY.md](./DEPLOY.md) | Deploy: local, Docker, Cloud Run |
| [SECURITY.md](./SECURITY.md) | Política de segurança e vulnerabilidades |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Como contribuir com o projeto |
| [ROADMAP.md](./ROADMAP.md) | Fases e features planejadas |
| [TASKS.md](./TASKS.md) | Sprints e tasks detalhadas |
| [CHANGELOG.md](./CHANGELOG.md) | Histórico de versões |
| [SOUL.md](./SOUL.md) | Filosofia, valores e identidade |
