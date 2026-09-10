# Changelog

Todas as mudanças notáveis do VibeFlow são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

---

## [2.4.0] — 2026-09-10

### 🚀 Push Notifications Nativas via Firebase Cloud Messaging (FCM) & Android Background

- **Push Notifications Nativas (Android / FCM HTTP v1):**
  - Integração com Firebase Cloud Messaging para notificações em segundo plano (*background push*) com suporte a prioridade alta (*Doze Mode / WakeLock*).
  - Canais de Notificação Android nativos (`vibeflow_critical_alerts` e `vibeflow_approvals`).
  - Ações rápidas interativas direto na notificação: botões [Aprovar] e [Rejeitar] com payload disparado para a fila de governança `human-in-the-loop`.
  - Service Worker de mensagens dedicado `/public/firebase-messaging-sw.js` e serviço cliente `src/lib/pushNotifications.ts`.
  - Rotas de backend dedicadas: `POST /api/notifications/fcm/register`, `POST /api/notifications/fcm/unregister`, `POST /api/notifications/fcm/test`, `GET/PUT /api/notifications/preferences`.
  - Interface no painel de configurações para gerenciamento de permissões, token FCM de dispositivo, teste instantâneo de push e toggles de canais, sons e vibração tátil háptica.

---

## [1.0.0] — 2026-07-25

### 🎉 Release para Marketplace — Versão Completa

Esta versão marca o lançamento oficial do VibeFlow no App Marketplace com backend real, autenticação completa e CI/CD configurado.

### ✨ Adicionado

**Backend & Autenticação**
- Servidor Express 4 com TypeScript completo
- Banco de dados SQLite via `better-sqlite3` com migrações versionadas
- Autenticação JWT: login, registro, logout
- Recuperação de senha com token seguro (TTL: 1 hora)
- RBAC: papéis Admin, Operador e Visualizador
- Rate limiting: 100 req/min global, 10/15min em rotas de auth
- Headers de segurança via Helmet (CSP, HSTS, X-Frame-Options)
- Logging estruturado com Pino

**API REST**
- `POST /api/auth/login` — autenticação com JWT
- `POST /api/auth/register` — cadastro de usuários
- `POST /api/auth/forgot-password` — solicitar reset de senha
- `POST /api/auth/reset-password` — confirmar reset
- `GET/POST/PATCH/DELETE /api/agents` — CRUD completo de agentes
- `GET /api/audit` — listagem com filtros e paginação
- `GET/PATCH /api/approvals` — fila de aprovações
- `GET /api/tools` — listagem de ferramentas MCP
- `GET/PUT /api/settings` — configurações da plataforma
- `GET/POST /api/admin/users` — administração de usuários

**Frontend**
- Landing Page com framework PAS (Problem-Agitate-Solution)
- Página de Checkout com 3 planos: Starter, Pro, Enterprise
- Página de administração de usuários (Admin Panel)
- Recuperação de senha (ForgotPassword page)
- Integração do frontend com a API REST real

**Infraestrutura**
- GitHub Actions CI/CD: typecheck, build e testes em cada PR
- Script `npm run setup` para inicialização automatizada
- Script `npm run seed` para dados de demonstração
- Dockerfile multi-stage otimizado para produção
- Health check endpoint: `GET /api/health`

### 🔧 Modificado

- Dashboard atualizado para consumir dados reais da API (não mais mockados)
- Agent Hub conectado ao backend: CRUD persistente no SQLite
- Audit Logs com busca full-text e paginação real no banco de dados
- Approval Queue com workflow de aprovação persistente

### 📚 Documentação

- Reescrita completa de todos os arquivos `.md` do projeto
- `ARCHITECTURE.md` com diagrama completo, schema SQL e fluxos de dados
- `DEPLOY.md` com 6 opções de deploy (local, Docker, Cloud Run, etc.)
- `SECURITY.md` com política completa e SLA de resposta
- `CONTRIBUTING.md` com fluxo de trabalho, convenções e checklist de PR
- `STYLE_GUIDE.md` com padrões TypeScript, CSS e i18n
- `ROADMAP.md` com 6 fases detalhadas e barra de progresso

---

## [0.2.0] — 2026-07-10

### ✨ Adicionado

**Backend**
- Estrutura inicial do servidor Express com `tsx`
- Rotas de autenticação (esqueleto)
- Adaptadores de banco: SQLite, Supabase (stub), Firebase (stub)
- Middleware de autenticação JWT (básico)
- Migrações SQL: `001_users.sql`, `002_agents.sql`

**Frontend**
- Contexto `ToastContext` para notificações in-app
- Melhorias de acessibilidade: ARIA labels, foco visível, ordem de tabulação
- SEO: `react-helmet-async` integrado em todas as páginas
- Testes unitários com Vitest + Testing Library (cobertura inicial)

### 🔧 Modificado

- Refatoração do `ThemeContext` para suporte a SSR
- Melhoria de performance: lazy loading em todas as rotas
- `index.css` refatorado para usar CSS custom properties com `@theme`

### 🐛 Corrigido

- Sidebar não fechava em mobile após navegação
- ThemeContext causava flash de tema incorreto no carregamento inicial
- Streaming de respostas do Gemini interrompia prematuramente em conexões lentas

---

## [0.1.1] — 2026-07-05

### 🐛 Corrigido

- Comando TTS não reproduzia áudio no Firefox (codec AudioContext)
- LanguageContext não persiste idioma selecionado após reload
- Approval Queue exibia itens duplicados na fila
- Layout quebrado no MCP Gateway em resoluções abaixo de 1280px

### 🔧 Modificado

- Atualização: `@google/genai` → 1.4.0 (suporte ao modelo Gemini 3)
- Vite atualizado para 6.3.5

---

## [0.1.0] — 2026-07-01

### 🎉 Release inicial — MVP

Versão inicial do VibeFlow criada no Google AI Studio com todas as funcionalidades de UI completas.

### ✨ Adicionado

**Páginas e Funcionalidades**
- Dashboard com KPIs em tempo real, matriz de status dos agentes e MCP integration hub
- Agent Hub: CRUD de agentes com status, memória, capacidades e controles multimodais
- Command Center: chat em tempo real com Gemini Flash/Pro, streaming e TTS
- MCP Gateway: hub de integração com conectores mockados (Salesforce, PostgreSQL, HubSpot)
- Approval Queue: fila de aprovação human-in-the-loop para ações críticas
- Audit Logs: trilha de auditoria com busca e filtros avançados
- White-Label Branding: customização de logo, cores, tipografia e preview ao vivo
- Settings: configurações de perfil e plataforma
- Login: página de autenticação (UI apenas, sem backend)

**Design System**
- Glassmorphism: `glass-card` com backdrop-blur
- Tema dark/light via `ThemeContext` + CSS custom properties
- Animações fluidas com Motion
- Ícones via Lucide React
- Tipografia Inter via Google Fonts

**Internacionalização**
- Suporte completo a pt-BR, en-US e es-ES
- `LanguageContext` com detecção automática do browser
- Seletor de idioma persistente via localStorage

**IA**
- Integração com `@google/genai` SDK
- Suporte a Gemini 3 Flash Preview (padrão), Pro Preview (Thinking Mode)
- TTS com voz "Puck" a 48kHz via Gemini 2.5 Flash TTS
- Streaming de respostas token a token

### 📚 Documentação inicial
- `README.md`, `PRD.md`, `AGENT.md`, `CLAUDE.md`, `GEMINI.md`
- `SOUL.md`, `ROADMAP.md`, `TASKS.md`, `ARCHITECTURE.md`

### 🔧 Nota histórica
- Projeto renomeado de "JulIA" para "VibeFlow" nesta versão
- Email domain atualizado de `@julia.ai` para `@vibeflow.ai`

---

[Unreleased]: https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/releases/tag/v0.1.0
