# VibeFlow — Roadmap

**Última atualização:** Julho 2026

> O roadmap reflete nossa visão de longo prazo, equilibrada com as necessidades imediatas dos usuários. Prioridades podem mudar com base em feedback.

---

## Legenda

| Símbolo | Status |
|---|---|
| ✅ | Concluído |
| 🔄 | Em andamento |
| 📅 | Planejado |
| 💡 | Ideia / Backlog |
| ❌ | Cancelado / Descartado |

---

## 🏗️ Fase 1 — Foundation (Concluída)

> **Objetivo:** Validar o produto com uma UI completa e integração real com Gemini.

| Feature | Status | Notas |
|---|---|---|
| Dashboard com KPIs e matriz de agentes | ✅ | Dados mockados + estrutura real |
| Agent Hub — CRUD completo | ✅ | Status, memória, capacidades, multimodal |
| Command Center — Chat + Streaming | ✅ | Gemini Flash/Pro, TTS com voz "Puck" |
| MCP Gateway — UI de conexões | ✅ | Conectores mockados (Salesforce, HubSpot, PostgreSQL) |
| Approval Queue — Human-in-the-loop | ✅ | Fila completa com aprovar/rejeitar |
| Audit Logs — Trilha de auditoria | ✅ | Busca, filtros, paginação |
| White-Label Branding | ✅ | Logo, cores, nome, preview ao vivo |
| Internacionalização (pt-BR, en-US, es-ES) | ✅ | Context API + locale files |
| Dark/Light theme | ✅ | ThemeContext + CSS vars |
| Landing Page (framework PAS) | ✅ | Hero, features, CTA, pricing |
| Página de Checkout (UI) | ✅ | 3 planos: Starter, Pro, Enterprise |

---

## 🔒 Fase 2 — Backend Real & Auth (Concluída)

> **Objetivo:** Substituir dados mockados por um backend funcional com autenticação real.

| Feature | Status | Notas |
|---|---|---|
| Express server com TypeScript | ✅ | tsx watch para dev, build para prod |
| SQLite schema completo | ✅ | users, agents, audit_logs, approvals, api_keys |
| Auth — POST /auth/login + /auth/register | ✅ | JWT + bcrypt 12 rounds |
| Recuperação de senha (token 1h) | ✅ | E-mail simulado — SMTP real na fase 4 |
| RBAC (Admin, Operator, Viewer) | ✅ | Middleware requireAdmin |
| Rate limiting (helmet + rate-limit) | ✅ | 100 req/min global, 10/15min no auth |
| API REST de agentes | ✅ | CRUD completo com validação |
| API REST de audit logs | ✅ | GET com filtros e paginação |
| API REST de approvals | ✅ | GET + PATCH (aprovar/rejeitar) |
| Admin panel de usuários | ✅ | Listar, criar, desativar usuários |
| CI/CD — GitHub Actions | ✅ | Build, typecheck, testes |

---

## 🧠 Fase 3 — Agent Intelligence (Em andamento)

> **Objetivo:** Tornar os agentes mais inteligentes, autônomos e persistentes.

| Feature | Status | Prioridade | Notas |
|---|---|---|---|
| Memória persistente dos agentes | 🔄 | P0 | SQLite-backed conversation history |
| Thinking Mode refinado | 🔄 | P0 | Stream de tokens de raciocínio |
| Custom system prompt por agente | 📅 | P0 | Editor de persona com preview |
| Agent-to-agent messaging | 📅 | P1 | Pub/sub via MCP interno |
| Agendamento de tarefas (cron) | 📅 | P1 | Triggers baseados em tempo |
| Custo e uso por agente (tokens) | 📅 | P1 | Rastreamento de token usage Gemini |
| RAG — Base de conhecimento própria | 📅 | P2 | Embeddings + vector search |
| Agent templates marketplace | 📅 | P2 | Templates prontos: SDR, Support, etc. |

---

## 🔗 Fase 4 — Integrations & Scale (Planejada — Q3 2026)

> **Objetivo:** Conectar o VibeFlow ao ecossistema de ferramentas que as equipes já usam.

| Feature | Status | Prioridade |
|---|---|---|
| Salesforce OAuth + API real | 📅 | P0 |
| HubSpot OAuth + API real | 📅 | P0 |
| Slack — notificações de aprovação | 📅 | P0 |
| E-mail SMTP real (SES / SendGrid) | 📅 | P0 |
| Webhook event bus (entrada/saída) | 📅 | P1 |
| Dashboard de analytics (custo, latência, uso) | 📅 | P1 |
| WebSocket para atualizações em tempo real | 📅 | P1 |
| PostgreSQL conector real (via MCP) | 📅 | P1 |
| Zapier / Make webhook trigger | 📅 | P2 |
| Google Calendar integration | 📅 | P2 |
| Notion integration | 📅 | P2 |

---

## 🏢 Fase 5 — Enterprise (Planejada — Q4 2026)

> **Objetivo:** Tornar o VibeFlow apto para clientes enterprise com compliance rigoroso.

| Feature | Status | Prioridade |
|---|---|---|
| SAML / SSO (Okta, Azure AD) | 📅 | P0 |
| Multi-tenant isolation completo | 📅 | P0 |
| SOC2 audit trail export (CSV/JSON/PDF) | 📅 | P0 |
| On-premise deployment (Docker Compose) | 📅 | P1 |
| Kubernetes Helm chart | 📅 | P1 |
| Advanced semantic firewall rule builder | 📅 | P1 |
| Agent A/B testing framework | 💡 | P2 |
| Custom domain por organização | 💡 | P2 |
| Rate limiting + cost controls por agente | 💡 | P2 |
| Compliance reports (LGPD, GDPR) | 💡 | P2 |

---

## 🌟 Fase 6 — Ecosystem (Visão de Longo Prazo)

> Além do produto core — construindo um ecossistema.

| Ideia | Status |
|---|---|
| Marketplace de agentes da comunidade | 💡 |
| SDK público para criar agentes customizados | 💡 |
| API pública documentada (OpenAPI) | 💡 |
| App mobile (iOS + Android) | 💡 |
| VibeFlow Academy — treinamentos e certificações | 💡 |
| Integração com modelos além do Gemini (Claude, GPT) | 💡 |

---

## 📊 Status Geral

```
Fase 1 ████████████████████ 100% ✅
Fase 2 ████████████████████ 100% ✅
Fase 3 ████░░░░░░░░░░░░░░░░  20% 🔄
Fase 4 ░░░░░░░░░░░░░░░░░░░░   0% 📅
Fase 5 ░░░░░░░░░░░░░░░░░░░░   0% 📅
Fase 6 ░░░░░░░░░░░░░░░░░░░░   0% 💡
```

---

*Quer influenciar o roadmap? Abra uma [issue](https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/issues) ou uma [discussion](https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/discussions) com sua sugestão.*
