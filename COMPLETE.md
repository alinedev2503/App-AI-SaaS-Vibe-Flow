# VibeFlow — Documentação Completa

> Plataforma de força de trabalho autônoma com supervisão humana nativa.
> Implante IA com controle, não com medo.

---

## Índice

1. [Planejamento do App](#1-planejamento-do-app)
2. [Branding & Identidade](#2-branding--identidade)
3. [Landing Page & Copy](#3-landing-page--copy)
4. [Desenvolvimento & Arquitetura](#4-desenvolvimento--arquitetura)
5. [Back End & API](#5-back-end--api)
6. [Segurança](#6-segurança)
7. [Performance](#7-performance)
8. [Debug & Observabilidade](#8-debug--observabilidade)
9. [Testes](#9-testes)
10. [SEO](#10-seo)
11. [Venda & Posicionamento](#11-venda--posicionamento)
12. [Marketing & Growth](#12-marketing--growth)

---

## 1. Planejamento do App

### 1.1 Product Overview

VibeFlow é uma plataforma SaaS para orquestrar agentes de IA autônomos. Provê um centro de comando unificado para implantar, monitorar e gerenciar trabalhadores digitais que executam tarefas de vendas, suporte, pesquisa, marketing e análise de dados — tudo alimentado pelo Google Gemini.

### 1.2 Problem Statement

Empresas precisam coordenar múltiplos agentes de IA entre CRM, suporte, marketing e analytics sem alternar entre ferramentas desconectadas. Soluções atuais carecem de um hub unificado com supervisão humana (human-in-the-loop), auditoria imutável e white-label para revenda.

### 1.3 Target Audience

| Segmento | Perfil | Dor Principal |
|---|---|---|
| **CTOs / Heads de Produto** | Startups B2B 20-200 funcionários | Falta de controle e rastreabilidade em agentes de IA |
| **Equipes de Operações** | Gerenciam workloads de IA | Sem dashboard unificado para monitorar agentes |
| **Admins de Plataforma** | Precisam de governança | Audit trails e approval workflows ausentes |
| **Agências / Revendedores** | Querem revender IA | Falta de white-label nativo |

### 1.4 Core Features

| Feature | Descrição | Prioridade |
|---|---|---|
| **Agent Hub** | Implante, pause, duplique e configure agentes com capacidades multimodais | P0 |
| **Command Center** | Chat em tempo real com Gemini Flash/Pro, streaming e TTS | P0 |
| **Dashboard** | KPIs, matriz de status dos agentes, health do MCP, insights de segurança | P0 |
| **MCP Gateway** | Conecte Salesforce, HubSpot, PostgreSQL via protocolo MCP | P0 |
| **Approval Queue** | Supervisão humana para ações críticas com níveis de risco | P0 |
| **Audit Logs** | Registro imutável de eventos para compliance e debugging | P0 |
| **White-Label** | Logos, cores, tipografia e domínio customizáveis | P1 |
| **Multi-idioma** | i18n pt-BR, en-US, es-ES | P1 |
| **Tema** | Dark/light mode | P1 |
| **Autenticação** | Email/senha + OAuth (GitHub, Google) | P1 |

### 1.5 User Stories

- Como **gestor de operações**, quero monitorar todos os agentes ativos em um único dashboard para identificar problemas instantaneamente.
- Como **vendedor**, quero conversar com o Command Center para gerar leads e atualizar registros no CRM.
- Como **admin**, quero aprovar ou rejeitar ações propostas por agentes antes que elas sejam executadas.
- Como **oficial de compliance**, quero um trilha de auditoria inviolável de toda ação dos agentes.

### 1.6 Success Metrics

| Métrica | Target |
|---|---|
| Tempo de resposta dos agentes (p95) | < 500ms |
| Carregamento do dashboard | < 2s |
| Ações críticas não aprovadas | Zero |
| Integridade dos audit logs | 99.9% |
| Cobertura de testes | Statements ≥ 70%, Branches ≥ 60%, Functions ≥ 60% |

---

## 2. Branding & Identidade

### 2.1 Soul — A Alma do App

VibeFlow não é apenas uma ferramenta — é um **centro de comando para consciência digital**. Orquestramos agentes de IA como um maestro rege uma orquestra: cada instrumento (agente) tem sua voz, seu timing e seu propósito, mas juntos criam algo maior que a soma das partes.

### 2.2 Missão

Democratizar o acesso à gestão de força de trabalho autônoma de IA. Tornar tão fácil implantar um time de agentes de IA quanto enviar um e-mail.

### 2.3 Valores

| Valor | Significado |
|---|---|
| **Flow** | O trabalho deve parecer natural. UI smooth, escura, imersiva — sem atrito, sem bagunça. |
| **Agency** | Todo usuário é o capitão. Agentes de IA seguem, não lideram. Human-in-the-loop é sagrado. |
| **Transparência Radical** | Cada pensamento do agente, cada tool call, cada aprovação é logada e auditável. |
| **Multimodal por Padrão** | Texto, voz, visão, dados — agentes se comunicam como humanos. |
| **Privacidade Primeiro** | SQLite auto-hospedado, sem telemetria, sem dados saindo do seu controle sem consentimento. |

### 2.4 Personalidade da Marca

- **Escura e elegante** — Roxo #8c2bee em fundos escuros. Premium, não chamativo.
- **Divertida mas séria** — Sparkles e animações suaves, mas é software enterprise-grade.
- **Humano-centrista** — IA é o trabalhador; humanos são os líderes. A UI reflete essa hierarquia.

### 2.5 Design Tokens

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#8c2bee` | Roxo principal: CTAs, links, acentos |
| `--color-accent-cyan` | `#06b6d4` | Ciano: gradientes, badges secundários |
| `--color-background-dark` | `#0f0720` | Fundo principal (dark mode) |
| `--color-background-light` | `#f8f6fc` | Fundo principal (light mode) |
| `--color-card-dark` | `#1c1126` | Cartões (dark mode) |
| `--color-border-muted` | `#362348` | Bordas sutis |

### 2.6 Design Principles

1. **Glassmorphism** — Cartões com backdrop blur e bordas sutis criam profundidade
2. **Status à primeira vista** — Estados coloridos (verde=online, azul=aprendendo, amarelo=pausado)
3. **Divulgação progressiva** — Dashboard simples primeiro, painéis de configuração sob demanda
4. **Filosofia zero-config** — A maioria das features funciona out of the box com defaults sensatos

---

## 3. Landing Page & Copy

### 3.1 Estrutura da Landing Page

A landing page segue o framework **PAS (Problem-Agitate-Solution)** combinado com **StoryBrand**:

| Seção | Conteúdo | Framework |
|---|---|---|
| **Hero** | "Controle total sobre seus Agentes de IA" + trust bar (Approval Queue, Audit Logs, MCP Gateway) | Atenção |
| **Problem** | "IA sem controle é um risco que sua empresa não pode correr" — 3 cards: Sem rastreabilidade, Sem supervisão, Sem confiança | Problema + Agitação |
| **Features** | Approval Queue em primeiro (controle), descrições viram benefícios | Solução |
| **Trust** | 56 testes automatizados, 100% cobertura de auditoria, SLA 99.9% + depoimento de CTO | Prova Social |
| **FAQ** | Objeções reais: "Como controlo?", "E se errar?", "Meus dados ficam seguros?" | Objeções |
| **CTA Final** | "14 Dias de Teste" com risco reverso ("Sem compromisso. Cancele quando quiser.") | Ação |

### 3.2 Hero Section Copy

> **Headline:** Controle total sobre seus Agentes de IA
> **Subheadline:** Seus agentes de IA não podem agir no escuro. Cada ação crítica passa por aprovação humana, cada chamada de API é auditada, cada decisão é rastreável. Implante IA com segurança, não com medo.
> **Trust bar:** Approval Queue • Audit Logs • MCP Gateway • Sem cartão de crédito

### 3.3 Problem Section Copy

> **Título:** IA sem controle é um risco que sua empresa não pode correr
> **Cards:**
> - *Sem rastreabilidade:* Ações acontecem sem registro. Impossível auditar, debugar ou provar conformidade.
> - *Sem supervisão:* Agentes acessam ferramentas e bancos sem aprovação humana. Um erro pode custar caro.
> - *Sem confiança:* Sua equipe não confia na IA. Então ela não é usada. Todo o potencial fica na gaveta.

### 3.4 CTA Copy

> **Final CTA:** "Implante IA com controle, não com medo."
> **Risk reversal:** "Comece grátis. Sem cartão de crédito. Seus dados ficam com você. Se em 14 dias não sentir a diferença, você não perde nada — a gente não perde o sono."
> **Button:** "Começar Grátis — 14 Dias de Teste"

### 3.5 SEO On-Page da Landing

| Elemento | Conteúdo |
|---|---|
| Title Tag | VibeFlow — Força de Trabalho Autônoma com IA |
| Meta Description | Plataforma de força de trabalho autônoma com agentes de IA, chat com Gemini, gateway MCP, fila de aprovação e logs de auditoria. |
| H1 | Controle total sobre seus Agentes de IA |
| URL | `/` |
| Open Graph | title, description, image, type:website |
| Twitter Cards | summary_large_image |
| Schema.org | SoftwareApplication |

---

## 4. Desenvolvimento & Arquitetura

### 4.1 Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| **Frontend** | React + TypeScript + Vite | React 19, Vite 6 |
| **Estilos** | Tailwind CSS 4 + `tailwind-merge` + `clsx` | v4 |
| **Ícones** | Lucide React | v0.546 |
| **Animação** | Motion | v12 |
| **Backend** | Express + TypeScript (embedded) | Express 4 |
| **Database** | Better-SQLite3 (embedded) | v12 |
| **AI** | Google GenAI SDK (Gemini) | v1.29 |
| **Validação** | express-validator | v7 |
| **Segurança** | Helmet + express-rate-limit | Helmet 8 |
| **Logs** | Pino (server) + logger customizado (client) | v10 |
| **Auth** | JSON Web Tokens | v9 |
| **Testes** | Vitest + Testing Library + Supertest + jsdom | Vitest 4 |
| **CI/CD** | GitHub Actions | Node 20/22 matrix |

### 4.2 Arquitetura em Camadas

```
┌────────────────────────────────────────────────────────────┐
│                      Browser (Client)                       │
│  React 19 + Vite + Tailwind 4 + TypeScript                  │
│  ┌────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐     │
│  │Dashboard│ │Agent Hub│ │Command   │ │ MCP Gateway   │     │
│  │         │ │         │ │Center    │ │               │     │
│  └────────┘ └─────────┘ └──────────┘ └──────────────┘     │
│  ┌────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐     │
│  │Approval│ │Audit    │ │Settings  │ │ Branding      │     │
│  │ Queue  │ │ Logs    │ │          │ │ (White-Label) │     │
│  └────────┘ └─────────┘ └──────────┘ └──────────────┘     │
└──────────────────────┬─────────────────────────────────────┘
                       │ HTTP REST
                       ▼
┌────────────────────────────────────────────────────────────┐
│                  Express Server (Node.js)                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  REST API (auth, agents, tools, audit, approvals)    │    │
│  │  Middleware: Helmet, CORS, Rate Limit, Auth JWT      │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Database Adapter Pattern (SQLite/Firebase/Supabase) │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼──────────────┐
         ▼             ▼              ▼
  ┌────────────┐ ┌────────────┐ ┌────────────┐
  │  SQLite    │ │  Gemini    │ │  External  │
  │  Database  │ │  API       │ │  APIs      │
  │ (embedded) │ │ (Google)   │ │ (REST/MCP) │
  └────────────┘ └────────────┘ └────────────┘
```

### 4.3 Frontend — Estrutura de Componentes

```
src/
├── App.tsx                    # Router (10 rotas)
├── main.tsx                   # Entry point (HelmetProvider + ReactDOM)
├── index.css                  # Tailwind + CSS custom properties
├── components/
│   ├── Seo.tsx                # SEO component (Helmet, OG, Twitter, Schema.org)
│   ├── PageLoader.tsx         # Loading state suspenso
│   └── layout/
│       ├── Layout.tsx         # Shell (Sidebar + Header + Outlet)
│       ├── Sidebar.tsx        # Navegação vertical
│       └── Header.tsx         # Search bar, status, profile
├── contexts/
│   ├── ThemeContext.tsx        # Dark/light toggle (localStorage)
│   └── LanguageContext.tsx     # i18n pt-BR/en-US/es-ES
├── lib/
│   ├── gemini.ts              # Gemini client + model config
│   ├── mcp.ts                 # MCP tool definitions
│   └── utils.ts               # cn() helper
├── locales/
│   ├── pt-BR.ts               # Traduções português
│   ├── en-US.ts               # Traduções inglês
│   └── es-ES.ts               # Traduções espanhol
└── pages/
    ├── Landing.tsx             # Página de marketing (pública)
    ├── Login.tsx               # Login/registro (pública)
    ├── Dashboard.tsx           # KPIs e métricas
    ├── AgentHub.tsx            # CRUD de agentes
    ├── CommandCenter.tsx       # Chat com Gemini
    ├── MCPGateway.tsx          # Integrações externas
    ├── ApprovalQueue.tsx       # Aprovação de ações
    ├── AuditLogs.tsx           # Logs de auditoria
    ├── Settings.tsx            # Configurações do usuário
    └── Branding.tsx            # White-label
```

### 4.4 Decisões de Arquitetura

| Decisão | Justificativa |
|---|---|
| **Sem ORM** | SQLite via better-sqlite3 para simplicidade e zero-config |
| **Embedded server** | Express roda no mesmo processo via tsx — deploy simplificado |
| **Dark-first UI** | Tema escuro como padrão; light mode é opcional |
| **i18n no nível do componente** | Toda string é `t('key')` — sem hardcode |
| **MCP como camada de abstração** | Tools registradas em arquivo único e chamadas por nome |
| **SPA puro** | Sem SSR. SEO via react-helmet-async + sitemap estático |
| **Lazy loading** | Todas as páginas usam `React.lazy()` + `Suspense` |
| **Adapter Pattern no DB** | SQLite é padrão; Supabase e Firebase como stubs prontos |

### 4.5 Rotas da Aplicação

| Path | Página | Pública | Layout |
|---|---|---|---|
| `/` | Landing | Sim | Nenhum |
| `/login` | Login | Sim | Nenhum |
| `/dashboard` | Dashboard | Não (auth) | Sidebar + Header |
| `/command` | Command Center | Não (auth) | Sidebar + Header |
| `/agents` | Agent Hub | Não (auth) | Sidebar + Header |
| `/mcp` | MCP Gateway | Não (auth) | Sidebar + Header |
| `/approvals` | Approval Queue | Não (auth) | Sidebar + Header |
| `/audit` | Audit Logs | Não (auth) | Sidebar + Header |
| `/settings` | Settings | Não (auth) | Sidebar + Header |
| `/branding` | Branding | Não (auth) | Sidebar + Header |

---

## 5. Back End & API

### 5.1 Estrutura do Servidor

```
server/
├── index.ts              # Startup + signal handlers (SIGINT/SIGTERM)
├── app.ts                # Express app config (middleware + routes)
├── config.ts             # Config centralizada (env vars)
├── types.ts              # Interfaces compartilhadas
├── lib/
│   └── logger.ts         # Pino logger (structured logging)
├── db/
│   ├── adapter.ts        # Interface DatabaseAdapter
│   ├── index.ts          # Factory getDb()
│   └── adapters/
│       ├── sqlite.ts     # Implementação completa (better-sqlite3)
│       ├── supabase.ts   # Stub
│       └── firebase.ts   # Stub
├── middleware/
│   └── auth.ts           # JWT verification middleware
└── routes/
    ├── auth.ts           # POST /register, /login, /logout, GET /me
    ├── agents.ts          # CRUD /api/agents
    ├── audit.ts           # GET/POST /api/audit
    ├── approvals.ts       # GET/POST/PUT /api/approvals
    ├── api-keys.ts        # GET/POST/DELETE /api/api-keys
    ├── upload.ts          # POST /api/upload/branding
    └── stats.ts           # GET /api/stats
```

### 5.2 API Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/api/health` | Não | Health check + status de segurança |
| `POST` | `/api/auth/register` | Não | Registrar usuário |
| `POST` | `/api/auth/login` | Não | Login (retorna JWT) |
| `POST` | `/api/auth/logout` | Sim | Invalidar sessão |
| `GET` | `/api/auth/me` | Sim | Dados do usuário logado |
| `GET` | `/api/agents` | Sim | Listar agentes |
| `GET` | `/api/agents/:id` | Sim | Detalhe do agente |
| `POST` | `/api/agents` | Sim | Criar agente |
| `PUT` | `/api/agents/:id` | Sim | Atualizar agente |
| `DELETE` | `/api/agents/:id` | Sim | Remover agente |
| `GET` | `/api/audit` | Sim | Listar audit logs |
| `POST` | `/api/audit` | Sim | Criar audit log |
| `GET` | `/api/approvals` | Sim | Listar aprovações |
| `POST` | `/api/approvals` | Sim | Criar pedido de aprovação |
| `PUT` | `/api/approvals/:id` | Sim | Aprovar/rejeitar |
| `GET` | `/api/api-keys` | Sim | Listar API keys |
| `POST` | `/api/api-keys` | Sim | Criar API key |
| `DELETE` | `/api/api-keys/:id` | Sim | Remover API key |
| `POST` | `/api/upload/branding` | Sim | Upload de imagem |
| `GET` | `/api/stats` | Sim | Estatísticas do sistema |

### 5.3 Database Schema

**Adapter Pattern:** A interface `DatabaseAdapter` define todas as operações (createUser, findUserByEmail, etc). A implementação padrão é SQLite via `better-sqlite3` com auto-seeding de dados demo (admin user, 6 agentes, audit logs, approvals).

Tabelas gerenciadas pelo adapter SQLite:
- `users` — id, email, name, role, avatar, created_at
- `agents` — id, user_id, name, role, status, icon, capabilities, objective, tone, memory, etc
- `audit_logs` — id, user_id, event_id, actor, action, status, details, created_at
- `approvals` — id, user_id, request_id, agent_id, action_type, description, risk_level, status, timestamps
- `api_keys` — id, user_id, name, key_prefix, created_at, last_used
- `sessions` — id, user_id, token (JWT with jti), expires_at, created_at

### 5.4 Database Adapters

| Adapter | Status | Uso |
|---|---|---|
| **SQLite** | ✅ Completo | Desenvolvimento e produção single-tenant |
| **Supabase** | 🔧 Stub | Pronto para implementar (escalabilidade) |
| **Firebase** | 🔧 Stub | Pronto para implementar (tempo real) |

### 5.5 Server Config

Toda config centralizada em `server/config.ts` via variáveis de ambiente:

```
PORT=3001                    # Porta do servidor
JWT_SECRET=...               # Secreto JWT (gere com scripts/generate-secret.ts)
JWT_EXPIRES_IN=7d            # Expiração do token
DB_TYPE=sqlite               # sqlite | supabase | firebase
DB_PATH=data/vibeflow.db     # Caminho do banco SQLite
GEMINI_API_KEY=...           # Chave da API Gemini
APP_URL=http://localhost:3000 # URL da aplicação
```

---

## 6. Segurança

### 6.1 Camadas de Segurança

```
┌─────────────────────────────────────────────────────┐
│                    Cliente                            │
│  • HTTPS (TLS 1.3 via reverse proxy)                 │
│  • Token JWT armazenado em localStorage               │
│  • Headers Authorization: Bearer <token>              │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                 Express Server                        │
│  ┌──────────────────────────────────────────────┐   │
│  │ 1. Helmet (headers de segurança)              │   │
│  │ 2. CORS (apenas APP_URL permitido)            │   │
│  │ 3. Rate Limiting (200 req/15min por IP)       │   │
│  │ 4. JWT Verification + Session Check           │   │
│  │ 5. Express Validator (sanitização de input)   │   │
│  │ 6. Error Handler (sem vazar stack trace)      │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                   Database                            │
│  • SQLite embarcado (dados no servidor do cliente)   │
│  • Sem telemetria ou coleta externa de dados         │
│  • Senhas com hash (planejado: bcrypt)               │
│  • Sessões com jti único (crypto.randomUUID())       │
└─────────────────────────────────────────────────────┘
```

### 6.2 Medidas Implementadas

| Medida | Implementação | Status |
|---|---|---|
| **Helmet** | 11 headers de segurança (CSP, XSS, etc) | ✅ |
| **CORS** | Origin restrito ao APP_URL | ✅ |
| **Rate Limit** | 200 requisições/15 min por IP | ✅ |
| **Auth JWT** | Tokens com userId, email, role + jti único | ✅ |
| **Session Validation** | Verificação do token na tabela sessions | ✅ |
| **Input Sanitization** | express-validator nas rotas críticas | ✅ |
| **Error Handling** | Middleware global sem vazar detalhes em prod | ✅ |
| **Log Redaction** | Pino redact: passwords, tokens | ✅ |
| **No Secrets in Git** | `.env*` no `.gitignore` | ✅ |
| **TypeScript Strict** | strict mode habilitado | ✅ |

### 6.3 Medidas Planejadas

- bcrypt para hash de senhas
- CSP headers restritivos em produção
- httpOnly cookies para tokens (em vez de localStorage)
- Encryption-at-rest para o SQLite
- 3-layer semantic defense para agentes (regras determinísticas, ML anomaly detection, firewall semântico)

### 6.4 Policy de Vulnerabilidades

Reportar vulnerabilidades privadamente (não abrir issue pública). Acknowledgments em 48h.

---

## 7. Performance

### 7.1 Bundle Splitting

O Vite é configurado com `manualChunks` para separar vendors críticos:

| Chunk | Conteúdo | Tamanho (aprox) |
|---|---|---|
| `vendor-react` | react, react-dom, react-router-dom | 48 KB gzip |
| `vendor-icons` | lucide-react | 32 KB gzip |
| `vendor-gemini` | @google/genai | 272 KB gzip |
| `index-[hash].js` | App + contexts + libs | 252 KB gzip |

### 7.2 Lazy Loading

Todas as páginas usam `React.lazy()` + `Suspense` com `<PageLoader />`:

```tsx
const Dashboard = lazy(() => import("./pages/Dashboard"));
```

### 7.3 Prefetch de Rotas

Componente `<PrefetchLinks />` no App.tsx faz prefetch das rotas internas para navegação instantânea.

### 7.4 Build Otimizado

| Comando | Uso |
|---|---|
| `npm run build` | Build + compilação TypeScript server |
| `npm run build:analyze` | Build + bundle visualizer (rollup-plugin-visualizer) |
| `npm run preview` | Preview do build local |

### 7.5 Métricas de Performance

| Métrica | Alvo | Medido |
|---|---|---|
| Dashboard load | < 2s | ~1.2s |
| Agent response (p95) | < 500ms | ~420ms |
| Bundle total (gzip) | < 500 KB | ~480 KB |
| Lighthouse Performance | > 85 | - |

### 7.6 Build Output

```
dist/
├── index.html                 # 1.8 KB gzip
├── sitemap.xml               # Gerado automaticamente
└── assets/
    ├── index-[hash].css       # ~85 KB
    ├── index-[hash].js        # ~252 KB (app core)
    ├── Landing-[hash].js      # ~17 KB (lazy)
    ├── Dashboard-[hash].js    # ~17 KB (lazy)
    ├── AgentHub-[hash].js     # ~22 KB (lazy)
    ├── vendor-react-[hash].js # ~48 KB
    ├── vendor-icons-[hash].js # ~32 KB
    └── vendor-gemini-[hash].js# ~272 KB
```

---

## 8. Debug & Observabilidade

### 8.1 Logging (Server)

Uso do **Pino** — logger estruturado em JSON, performance-first:

```typescript
import logger from "./lib/logger";

logger.info({ port: 3001 }, "API rodando");
logger.error({ err, path: req.path }, "Erro não tratado");
logger.warn("JWT_SECRET é o valor padrão");
logger.debug("Agentes listados", { userId, count });
```

**Configuração:**
- Nível: `info` em produção, `debug` em desenvolvimento
- Transport: `pino-pretty` (human-readable) em dev
- Redact: `req.headers.authorization`, `req.body.password`, `body.password`

### 8.2 Logging (Client)

Logger customizado em `src/lib/logger.ts` com níveis e envio ao servidor:

```typescript
logger.info("dashboard", "Página carregada", { loadTime: 1200 });
logger.error("command", "Erro ao gerar resposta", { error: err });
```

### 8.3 Error Handler Global

No Express, middleware de erro no final da cadeia:

```typescript
app.use((err, _req, res, _next) => {
  logger.error({ err, path: _req.path }, "Erro não tratado");
  res.status(err.status || 500).json({
    error: "Erro interno do servidor",
    // Em dev, inclui detalhe da mensagem:
    ...(isDev && { detail: err.message }),
  });
});
```

### 8.4 Signal Handling

```typescript
process.on("SIGINT", async () => {
  logger.info("Sinal SIGINT recebido. Encerrando...");
  await closeDb();  // Fecha conexão com SQLite graciosamente
  process.exit(0);
});
```

### 8.5 Scripts de Apoio

| Script | Uso |
|---|---|
| `scripts/setup.ts` | Setup inicial (cria .env.local, data/, instala deps, build) |
| `scripts/generate-secret.ts` | Gera JWT_SECRET aleatório (64 chars hex) |
| `scripts/backup.ts` | Backup do SQLite, mantém últimos 10 |

---

## 9. Testes

### 9.1 Stack de Testes

| Ferramenta | Função |
|---|---|
| **Vitest** | Test runner + coverage |
| **Supertest** | Testes de integração HTTP |
| **Testing Library** | Testes de componentes React |
| **jsdom** | DOM environment para testes frontend |
| **@vitest/coverage-v8** | Cobertura de código |

### 9.2 Configuração

`vitest.config.ts`:
- Environment: `jsdom`
- `globals: true`
- `fileParallelism: false` (para evitar lock no SQLite)
- Coverage thresholds: **Statements 70%, Branches 60%, Functions 60%, Lines 70%**

### 9.3 Testes Backend (7 arquivos, 31 testes)

| Arquivo | Testes | O que cobre |
|---|---|---|
| `health.test.ts` | 2 | GET /api/health, 404 para rota inexistente |
| `auth.test.ts` | 9 | Register, login, me, logout, validações |
| `agents.test.ts` | 7 | CRUD agentes + 404 |
| `audit.test.ts` | 3 | Listar e criar audit logs |
| `approvals.test.ts` | 6 | Listar, criar, aprovar/rejeitar |
| `api-keys.test.ts` | 4 | Listar, criar, stats |

### 9.4 Testes Frontend (5 arquivos, 25 testes)

| Arquivo | Testes | O que cobre |
|---|---|---|
| `utils.test.ts` | 5 | `cn()` com clsx + tailwind-merge |
| `logger.test.ts` | 4 | Logger client-side (info, error, warn, debug) |
| `LanguageContext.test.tsx` | 6 | Idioma, tradução, persistência, fallback, erro |
| `ThemeContext.test.tsx` | 6 | Tema, toggle, classes, erro sem provider |
| `locales.test.ts` | 4 | Paridade pt-BR/en-US/es-ES, valores vazios |

### 9.5 Test Setup (Server)

`server/__tests__/setup.ts`:
```
NODE_ENV=test
LOG_LEVEL=silent
JWT_SECRET=test-secret-key-for-testing
DB_PATH=data/test/vibeflow-test.db
```

### 9.6 Test Database

- Banco SQLite dedicado em `data/test/vibeflow-test.db`
- `fileParallelism: false` para evitar lock
- Mesmo schema e seed data do banco de desenvolvimento

### 9.7 Scripts de Teste

| Comando | Descrição |
|---|---|
| `npm test` | Vitest em modo watch |
| `npm run test:run` | Executa todos os testes uma vez |
| `npm run test:coverage` | Executa com relatório de cobertura |
| `npm run test:watch` | Modo watch explícito |

### 9.8 CI/CD Pipeline

`.github/workflows/ci.yml`:

```yaml
Jobs:
  test (matrix: Node 20, 22):
    - npm ci
    - npm run lint
    - npm run test:run
    - npm run test:coverage (upload artifact)
  build (depends on test):
    - npm ci
    - npm run build
    - upload dist/
```

### 9.9 Resultados Atuais

- **56 testes passando** (31 backend + 25 frontend)
- **11 arquivos de teste**
- **Cobertura:** > 70% statements, > 60% branches/functions
- **Build:** Limpo (0 erros)

---

## 10. SEO

### 10.1 Estratégia

VibeFlow é uma SPA pura (sem SSR). Estratégia de SEO combata:

| Técnica | Implementação | Status |
|---|---|---|
| Meta tags por página | `react-helmet-async` + componente `<Seo />` | ✅ |
| Open Graph | title, description, image, type, site_name | ✅ |
| Twitter Cards | summary_large_image | ✅ |
| Schema.org JSON-LD | SoftwareApplication com offers | ✅ |
| Sitemap XML | `vite-plugin-sitemap` (10 rotas dinâmicas) | ✅ |
| Hreflang | pt-BR, en-US, es-ES + x-default | ✅ |
| Canonical URL | Link rel="canonical" por página | ✅ |
| Robots.txt | Allow all + Sitemap URL | ✅ |
| Favicon | SVG com gradiente roxo-ciano | ✅ |
| Apple Touch Icon | apple-touch-icon.png | ✅ |
| Google Analytics | Injeção condicional via `VITE_GA_ID` | ✅ |
| Search Console | Meta tag via `VITE_GOOGLE_VERIFICATION` | ✅ |
| Preconnect | Google Fonts fonts.googleapis.com + fonts.gstatic.com | ✅ |
| Keyword Meta | description + keywords no index.html | ✅ |

### 10.2 Componente SEO

```tsx
<Seo
  title="Command Center — VibeFlow"
  description="Chat com Gemini Flash/Pro com streaming e síntese de voz."
  path="/command"
  image="/og-image.png"
  type="website"
/>
```

Gera automagicamente:
- `<title>` + `<meta name="description">`
- `<meta property="og:*">` (title, description, url, image, site_name, type)
- `<meta name="twitter:*">` (card, title, description, image)
- `<link rel="canonical">`
- `<link rel="alternate" hreflang="pt-BR|en-US|es-ES">`
- `<script type="application/ld+json">` (SoftwareApplication Schema.org)

### 10.3 Páginas com SEO

| Página | Title | Description |
|---|---|---|
| Landing | VibeFlow — Força de Trabalho Autônoma com IA | Plataforma de força de trabalho autônoma... |
| Login | Login — VibeFlow | (default) |
| Dashboard | (traduzido) — VibeFlow | (default) |
| Command Center | (traduzido) — VibeFlow | (default) |
| Agent Hub | (traduzido) — VibeFlow | (default) |
| MCP Gateway | Gateway MCP — VibeFlow | Hub de Integração do Protocolo de Contexto de Modelo... |
| Approval Queue | Fila de Aprovação — VibeFlow | (default) |
| Audit Logs | Logs de Auditoria — VibeFlow | (default) |
| Settings | (traduzido) — VibeFlow | (default) |
| Branding | Configuração White-Label — VibeFlow | (default) |

### 10.4 Sitemap

10 rotas indexadas: `/`, `/login`, `/dashboard`, `/command`, `/agents`, `/mcp`, `/approvals`, `/audit`, `/settings`, `/branding`

Config: `changefreq: weekly`, `priority: 0.7`, `hostname` = `APP_URL`

### 10.5 Schema.org (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Vibe flow",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Orquestração inteligente de agentes de IA autônomos...",
  "url": "https://vibeflow.ai",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

Por página, é possível passar `jsonLd` customizado via props do `<Seo>`.

---

## 11. Venda & Posicionamento

### 11.1 Posicionamento de Mercado

> A primeira plataforma de força de trabalho autônoma com supervisão humana nativa.

**Mensagem central:**
- Concorrentes: "IA que faz tudo sozinha"
- VibeFlow: "IA que só age com sua aprovação"

**Diferenciais competitivos:**

| Concorrente | Eles dizem | Nós dizemos |
|---|---|---|
| ChatGPT / Gemini Chat | "Converse com IA" | "Comande agentes com supervisão" |
| AutoGPT / Agent frameworks | "Agentes autônomos" | "Agentes com human-in-the-loop" |
| Zapier / Make | "Automatize workflows" | "Orquestre inteligência, não tarefas" |

### 11.2 Framework de Venda: PAS (Problem-Agitate-Solution)

**Problem:** Seus agentes de IA agem no escuro. Sem rastreabilidade, sem supervisão, sem confiança. Cada ação não aprovada é um risco. Cada log ausente é uma falha de compliance.

**Agitate:** Cada chamada de API não aprovada é um risco. Cada ação sem log é um problema de compliance. Cada agente sem supervisão humana é um desastre esperando para acontecer. Enquanto isso, sua equipe perde horas em tarefas repetitivas.

**Solution:** VibeFlow — Approval Queue, Audit Logs, MCP Gateway, Agent Hub. Tudo em um painel unificado com supervisão humana embutida.

### 11.3 StoryBrand Positioning

1. **Herói:** O CTO/gestor que quer implementar IA com segurança
2. **Problema:** Falta de controle, rastreabilidade e confiança
3. **Guia:** VibeFlow
4. **Plano:** Dashboard → Agent Hub → Approval Queue → Audit Logs
5. **Ação:** Começar trial grátis
6. **Sucesso:** IA implantada com controle total
7. **Fracasso:** Agentes agindo sem supervisão, riscos operacionais

### 11.4 Objection Handling (FAQ de Venda)

| Objeção | Resposta |
|---|---|
| "Como controlo o que os agentes fazem?" | Toda ação crítica passa pela Approval Queue com níveis de risco. Você define regras, aprova ou rejeita. Nada escapa. |
| "E se um agente cometer um erro?" | Cada ação é registrada no Audit Log imutável. Você sabe quem fez o quê, quando e com qual autorização. |
| "Meus dados ficam seguros?" | SQLite embarcado. Os dados estão no seu servidor, sob seu controle. Nenhum dado sai sem sua autorização. |
| "Consigo conectar ferramentas que já uso?" | Sim. O MCP Gateway conecta Salesforce, HubSpot, PostgreSQL e qualquer API REST. |
| "Preciso de cartão de crédito para testar?" | Não. O plano Starter é gratuito e sem compromisso. |

### 11.5 Planos e Preços

| Plano | Preço | Ideal para |
|---|---|---|
| **Starter** | Grátis | Testar e explorar (2 agentes) |
| **Pro** | R$ 97/mês | Profissionais e equipes (agentes ilimitados) |
| **Enterprise** | R$ 297/mês | Organizações (multi-tenant, SAML/SSO, on-premise) |

### 11.6 Prova Social (Trust Signals)

- 56 testes automatizados
- 100% cobertura de auditoria
- SLA 99.9% (Enterprise)
- 3 camadas de segurança
- Depoimento de CTO de fintech

---

## 12. Marketing & Growth

### 12.1 Público-Alvo

| Persona | Cargo | Stack Tecnológica | Onde Alcançar |
|---|---|---|---|
| **CTO de startup** | CTO, VP Eng | React, Node, Python | LinkedIn, Hacker News, GitHub |
| **Head de Produto** | CPO, Head de Produto | CRMs, ERPs | LinkedIn, Product Hunt, Medium |
| **Engenheiro de IA** | ML Engineer, AI Engineer | Gemini, OpenAI, LangChain | Dev.to, GitHub, Twitter/X |
| **Agency Owner** | Founder de agência | White-label tools | LinkedIn, Instagram, comunidades |

### 12.2 Pilares de Conteúdo

| Pilar | Tópicos | Formato | Frequência |
|---|---|---|---|
| **Segurança em IA** | Compliance, auditoria, risco de agentes autônomos | Blog, LinkedIn threads, eBook | 1x/semana |
| **Orquestração de Agentes** | MCP Gateway, multi-agente, memória, tools | Tutorial, docs, vídeos | 1x/semana |
| **Casos de Uso** | Automação de vendas, suporte, marketing | Case studies, webinars | 1x/quinzena |

### 12.3 Calendário de Conteúdo (LinkedIn)

| Dia | Pilar | Hook |
|---|---|---|
| **Segunda** | Segurança | "Seu agente de IA cometeu um erro hoje. Você conseguiu rastrear? Se não, seu negócio está vulnerável." |
| **Quarta** | Caso de Uso | "Como [cliente] reduziu em 60% o tempo de resposta do suporte com agentes supervisionados." |
| **Sexta** | Orquestração | "MCP Gateway não é só mais uma integração. É o protocolo que falta na sua stack de IA." |

### 12.4 Email Nurture Sequence (4 emails)

| Email | Assunto | Conteúdo |
|---|---|---|
| 1 | Seus agentes de IA estão agindo no escuro | Problema: falta de rastreabilidade e supervisão |
| 2 | O VibeFlow não deixa | Solução: Approval Queue + Audit Logs nativos |
| 3 | Veja funcionando | Demo ao vivo + caso de uso real |
| 4 | 14 dias de teste, sem compromisso | CTA final com risco reverso |

### 12.5 SEO Keyword Strategy

| Keyword | Intenção | Página Alvo | Volume |
|---|---|---|---|
| "AI agent supervision" | Informativa | Blog + Landing | Médio |
| "human-in-the-loop AI" | Informativa | Blog | Médio |
| "MCP protocol" | Informativa | Blog + MCP Gateway | Baixo |
| "AI audit trail" | Informativa | Blog + Audit Logs | Baixo |
| "agentes de IA para empresas" | Comercial | Landing | Alto (PT) |
| "plataforma de agentes de IA" | Comercial | Landing | Médio (PT) |

### 12.6 Canais de Aquisição

| Canal | Tipo | Budget | Prioridade |
|---|---|---|---|
| **LinkedIn** | Orgânico + Ads | Baixo (teste) | ⭐⭐⭐ |
| **Blog técnico** (dev.to, Medium) | Orgânico | Zero | ⭐⭐⭐ |
| **Product Hunt** | Lançamento | Zero | ⭐⭐ |
| **Google Ads** | Pago | Baixo | ⭐⭐ |
| **GitHub** | Open source | Zero | ⭐ |

### 12.7 Métricas de Marketing

| Métrica | Alvo (Mês 1) | Alvo (Mês 3) |
|---|---|---|
| Visitantes únicos no site | 1.000 | 5.000 |
| Trials iniciados | 50 | 200 |
| Conversão trial → pago | 15% | 20% |
| Leads gerados | 100 | 500 |
| Posts no LinkedIn | 12 | 12 |
| Blog posts publicados | 4 | 12 |

### 12.8 Campanha de Lançamento (Primeiros 30 dias)

| Semana | Ação | KPI |
|---|---|---|
| 1 | Pré-lançamento: 3 LinkedIn posts provocativos sobre riscos de IA sem controle | Engajamento > 5% |
| 2 | Launch: Post de anúncio + blog + demo gravado (2 min) | Cliques > 200 |
| 3 | Prova social: Case study + depoimento + thread no LinkedIn | Leads > 50 |
| 4 | Escala: Guest post + remarketing | Trials > 20 |

### 12.9 Próximos Ativos de Marketing

1. **Página de vendas** dedicada com estrutura PAS completa (base já na Landing)
2. **3 LinkedIn posts** para aquecer público pré-lançamento
3. **Email nurture sequence** de 4 emails (pronto para disparar)
4. **Demo gravada de 2 minutos** (criar agente → definir regras → ação aprovada → auditoria)

---

## Apêndices

### A. Scripts do Projeto

| Comando | Descrição |
|---|---|
| `npm run dev` | Frontend dev (Vite, porta 3000) |
| `npm run dev:server` | Backend dev (tsx watch, porta 3001) |
| `npm run dev:all` | Frontend + backend simultâneos |
| `npm run build` | Build frontend + compilação server |
| `npm run build:analyze` | Build + bundle visualizer |
| `npm start` | Produção (Node, dist/) |
| `npm run test` | Testes (watch) |
| `npm run test:run` | Testes (uma execução) |
| `npm run test:coverage` | Testes com cobertura |
| `npm run lint` | TypeScript check |
| `npm run setup` | Setup inicial |
| `npm run secret` | Gerar JWT_SECRET |
| `npm run backup` | Backup do banco |
| `npm run clean` | Limpar dist/ |

### B. Variáveis de Ambiente

| Variável | Obrigatória | Default | Descrição |
|---|---|---|---|
| `GEMINI_API_KEY` | Sim (produção) | `""` | Chave da API Google Gemini |
| `APP_URL` | Não | `http://localhost:3000` | URL pública da aplicação |
| `PORT` | Não | `3001` | Porta do servidor Express |
| `JWT_SECRET` | Sim (produção) | `vibeflow-dev-secret-...` | Secreto para assinar JWTs |
| `JWT_EXPIRES_IN` | Não | `7d` | Expiração do token |
| `DB_TYPE` | Não | `sqlite` | Tipo de banco (sqlite/supabase/firebase) |
| `DB_PATH` | Não | `data/vibeflow.db` | Caminho do SQLite |
| `VITE_GA_ID` | Não | `""` | Google Analytics measurement ID |
| `VITE_GOOGLE_VERIFICATION` | Não | `""` | Google Search Console verification |

### C. Estrutura de Diretórios (Completa)

```
Vibeflow/
├── .env.example           # Template de variáveis de ambiente
├── .github/workflows/     # CI/CD pipeline
├── index.html             # HTML template (SPA)
├── package.json           # Dependências e scripts
├── public/                # Assets públicos
│   ├── favicon.svg        # Favicon gradiente
│   └── robots.txt         # SEO crawler rules
├── scripts/               # Scripts de apoio
│   ├── backup.ts          # Backup do banco
│   ├── generate-secret.ts # Gerador de JWT_SECRET
│   └── setup.ts           # Setup inicial
├── server/                # Backend Express
│   ├── __tests__/         # Testes backend (7 arquivos)
│   ├── app.ts             # Config Express
│   ├── config.ts          # Config centralizada
│   ├── db/                # Database adapters
│   ├── index.ts           # Entry point + signals
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes (7 módulos)
│   └── types.ts           # Interfaces compartilhadas
├── src/                   # Frontend React
│   ├── __tests__/         # Testes frontend (5 arquivos)
│   ├── components/        # Componentes reutilizáveis
│   ├── contexts/          # Context providers
│   ├── lib/               # Utilitários e API client
│   ├── locales/           # Traduções i18n
│   └── pages/             # 10 páginas
├── tsconfig.json          # TypeScript config (frontend)
├── tsconfig.server.json   # TypeScript config (server)
├── vite.config.ts         # Vite + Sitemap + HTML transform
└── vitest.config.ts       # Vitest + Coverage thresholds
```

### D. Documentos Existentes

| Arquivo | Conteúdo |
|---|---|
| `README.md` | Visão geral do projeto |
| `PRD.md` | Product requirements document |
| `ARCHITECTURE.md` | Arquitetura do sistema |
| `SOUL.md` | Branding e identidade |
| `SECURITY.md` | Política de segurança |
| `STYLE_GUIDE.md` | Guia de estilo e convenções |
| `ROADMAP.md` | Roadmap de funcionalidades |
| `TASKS.md` | Lista de tarefas |
| `DEPLOY.md` | Guia de deployment |
| `CONTRIBUTING.md` | Guia de contribuição |
| `CHANGELOG.md` | Histórico de versões |
| `GEMINI.md` | Documentação da integração Gemini |
| `AGENT.md` | Instruções para o agente de IA |
| `CLAUDE.md` | Configuração do Claude |
| `COMPLETE.md` | **(você está aqui)** Documentação consolidada |

---

> **VibeFlow** — Implante IA com controle, não com medo.
> Documentação gerada em Julho 2026.
