# VibeFlow — Tasks & Sprints

**Última atualização:** Julho 2026  
**Sprint atual:** Sprint 3 — Agent Intelligence

---

## Legenda

| Símbolo | Significado |
|---|---|
| ✅ | Concluído |
| 🔄 | Em andamento |
| 📅 | Planejado |
| ⏸️ | Bloqueado |
| 💡 | Backlog / Ideia |
| ❌ | Cancelado |

---

## ✅ Sprint 1 — Backend & Auth (Semanas 1-2) — CONCLUÍDO

### Autenticação
- ✅ `POST /api/auth/login` — JWT com bcrypt
- ✅ `POST /api/auth/register` — cadastro com validação
- ✅ `POST /api/auth/forgot-password` — geração de token temporário
- ✅ `POST /api/auth/reset-password` — confirmação via token (TTL: 1h)
- ✅ `POST /api/auth/logout` — invalidação do token no cliente
- ✅ Middleware `authenticate.ts` — verifica JWT em rotas protegidas
- ✅ Middleware `requireAdmin.ts` — restringe rotas ao papel admin

### Banco de Dados
- ✅ Schema SQLite: `users`, `agents`, `audit_logs`, `approvals`, `api_keys`
- ✅ Migrações versionadas em `server/db/migrations/`
- ✅ Adapter pattern: SQLite (ativo), Supabase (stub), Firebase (stub)
- ✅ Script `npm run setup` para inicialização automatizada
- ✅ Script `npm run seed` para dados de demonstração

### Segurança
- ✅ Rate limiting: 100 req/min global, 10/15min em auth
- ✅ Helmet: headers CSP, HSTS, X-Frame-Options
- ✅ Input validation com express-validator em todas as rotas
- ✅ Logging estruturado com Pino (JSON)

### RBAC
- ✅ Papéis: Admin, Operador, Visualizador
- ✅ `GET/POST/PATCH /api/admin/users` — gestão de usuários

---

## ✅ Sprint 2 — API REST & Integração (Semanas 3-4) — CONCLUÍDO

### API de Agentes
- ✅ `GET /api/agents` — listagem com filtros
- ✅ `POST /api/agents` — criação de agente
- ✅ `PATCH /api/agents/:id` — atualização parcial
- ✅ `DELETE /api/agents/:id` — remoção (soft delete)
- ✅ Frontend Agent Hub conectado à API real

### API de Audit
- ✅ `GET /api/audit` — listagem com busca, filtros e paginação
- ✅ `POST /api/audit` — criação de log (interno)
- ✅ Geração automática de logs em ações críticas

### API de Approvals
- ✅ `GET /api/approvals` — listagem por status
- ✅ `PATCH /api/approvals/:id` — aprovar ou rejeitar com comentário
- ✅ Frontend Approval Queue conectado à API real

### API de Settings
- ✅ `GET /api/settings` — configurações da plataforma
- ✅ `PUT /api/settings` — atualização de configurações
- ✅ Upload de logo via Multer

### CI/CD
- ✅ GitHub Actions: typecheck (`tsc --noEmit`) em cada PR
- ✅ GitHub Actions: build de produção validado
- ✅ GitHub Actions: testes automatizados
- ✅ Health check endpoint: `GET /api/health`

---

## 🔄 Sprint 3 — Agent Intelligence (Semanas 5-6) — EM ANDAMENTO

### Memória de Agentes
- 🔄 Schema para `agent_memory` (conversation history, context windows)
- 📅 API `GET/POST /api/agents/:id/memory`
- 📅 Persistência do histórico de chat no Command Center
- 📅 Limite de contexto configurável por agente (ex: últimas 50 mensagens)
- 📅 Compressão de memória antiga via sumarização Gemini

### Thinking Mode
- 🔄 Stream de tokens de raciocínio visível na UI
- 🔄 Toggle de Thinking Mode no Command Center
- 📅 Tempo de resposta estimado com base na complexidade
- 📅 Indicador visual de "pensando..." animado

### Custom Personas
- 📅 Editor de system prompt por agente (textarea + preview)
- 📅 Templates pré-definidos: SDR, Support, Analyst, Coordinator
- 📅 Validação do prompt contra injeção de instruções maliciosas
- 📅 Histórico de versões do system prompt (rollback)

### Custo e Token Usage
- 📅 Rastreamento de tokens consumidos por agente e sessão
- 📅 Dashboard de uso: tokens/dia, custo estimado, tendências
- 📅 Alertas de limite de uso configuráveis

---

## 📅 Sprint 4 — Integrations & Real-time (Semanas 7-8)

### Integrações MCP Reais
- 📅 Salesforce REST API: OAuth 2.0, read/write contacts e leads
- 📅 HubSpot API: OAuth, criação de deals e contatos
- 📅 PostgreSQL: conexão direta com query parameterizada
- 📅 Log de execução de ferramentas no audit log
- 📅 Retry automático com backoff exponencial

### Notificações
- 📅 SMTP real: SendGrid ou Amazon SES integrado
- 📅 Email para aprovações pendentes (digest ou imediato)
- 📅 Webhook de saída para sistemas externos (n8n, Zapier, Make)
- 📅 Slack: notificações de status de agentes via incoming webhook

### Real-time
- 📅 WebSocket ou SSE para atualizações do dashboard sem polling
- 📅 Contador de aprovações pendentes atualizado em tempo real
- 📅 Status de agentes em tempo real (online/offline)

### Analytics
- 📅 Página de analytics: custo, latência, taxa de sucesso por agente
- 📅 Gráficos de uso: Chart.js ou Recharts
- 📅 Export de dados: CSV e JSON

---

## 📅 Sprint 5 — Produção & Estabilização (Semanas 9-10)

### Performance
- 📅 Paginação cursor-based no SQLite (sem OFFSET para grandes volumes)
- 📅 Cache de configurações e settings (memória + TTL 5min)
- 📅 Lazy loading aprimorado: prefetch nas rotas mais visitadas
- 📅 Imagens otimizadas: WebP + srcset responsivo

### Observabilidade
- 📅 Integração com Cloud Monitoring (métricas de latência, erros)
- 📅 Sentry para error tracking (frontend e backend)
- 📅 Alertas automáticos: p95 > 2s, error rate > 1%

### Operacional
- 📅 Backup automatizado do SQLite (cronjob diário → GCS)
- 📅 Restore procedure documentado e testado
- 📅 Load testing: 100 usuários simultâneos sem degradação
- 📅 Runbook de incidentes (SLA, escalação, rollback)

### Documentação Final
- 📅 API Reference (OpenAPI/Swagger)
- 📅 Guia de onboarding (vídeo ou tutorial interativo)
- 📅 FAQ atualizado com perguntas dos primeiros usuários

---

## 💡 Backlog (Sem sprint definida)

### Enterprise
- 💡 SAML / SSO (Okta, Azure AD, Google Workspace)
- 💡 Multi-tenant isolation completo com schema separado por org
- 💡 SOC2 audit trail export (PDF certificado)
- 💡 Kubernetes Helm chart para on-premise
- 💡 Agent A/B split testing framework

### IA Avançada
- 💡 RAG — base de conhecimento própria com vector embeddings
- 💡 Agent-to-agent messaging (pub/sub interno via MCP)
- 💡 Scheduled tasks — gatilhos baseados em tempo (cron-like)
- 💡 Fine-tuning de modelos customizados
- 💡 Análise de sentimento de conversas de suporte

### Produto
- 💡 App mobile (React Native ou Flutter)
- 💡 Marketplace de templates de agentes da comunidade
- 💡 SDK público para criar agentes customizados
- 💡 VibeFlow Academy — cursos e certificações

---

## 📊 Métricas de Sprint

| Sprint | Duração | Tasks | Concluídas | Velocidade |
|---|---|---|---|---|
| Sprint 1 | 2 semanas | 24 | 24 | 12/semana |
| Sprint 2 | 2 semanas | 18 | 18 | 9/semana |
| Sprint 3 | 2 semanas | 20 | 4 | Em andamento |
| Sprint 4 | 2 semanas | 16 | 0 | Planejado |
| Sprint 5 | 2 semanas | 18 | 0 | Planejado |

---

*Para sugerir uma nova task, abra uma [issue](https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/issues) com o label `task`.*
