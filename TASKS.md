# Vibe flow — Tasks & Sprints

## Sprint 1 — Backend & Auth (Weeks 1-2)
- [ ] Implement Express auth routes (POST /auth/login, /auth/register)
- [ ] JWT token generation and middleware
- [ ] Session management with better-sqlite3
- [ ] Create SQLite schema: `users`, `agents`, `audit_logs`, `approvals`
- [ ] Connect Login page UI to real auth API
- [ ] Role-based access control (admin, operator, viewer)
- [ ] API key CRUD endpoints and management UI

## Sprint 2 — MCP & Tool Execution (Weeks 3-4)
- [ ] Replace mock MCP tools with real API calls (cURL / fetch)
- [ ] Salesforce REST connector (read/write contacts, leads)
- [ ] HubSpot API connector
- [ ] PostgreSQL native query tool
- [ ] Tool execution audit trail
- [ ] Error handling and retry logic for MCP calls

## Sprint 3 — Agent Intelligence (Weeks 5-6)
- [ ] Persist agent memory to SQLite (conversation history, context)
- [ ] Agent-to-agent message passing (pub/sub via MCP)
- [ ] Scheduled agent triggers (cron-like)
- [ ] Custom system prompt editor per agent
- [ ] Thinking Mode refinement (stream reasoning tokens)
- [ ] Agent cost tracking (token usage per session)

## Sprint 4 — Integrations & Polish (Weeks 7-8)
- [ ] Slack webhook integration (agent status alerts)
- [ ] Webhook event bus for external systems
- [ ] Email notifications for pending approvals
- [ ] Dashboard real-time updates (WebSocket / SSE)
- [ ] Usage analytics page (cost, requests, latency trends)
- [ ] Responsive layout improvements

## Sprint 5 — Production Readiness (Weeks 9-10)
- [ ] Docker image and docker-compose setup
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Load testing and performance optimization
- [ ] Rate limiting middleware
- [ ] Backup and restore for SQLite
- [ ] Documentation: deployment guide, API reference

## Backlog
- SAML/SSO enterprise auth
- Agent marketplace (community templates)
- On-premise deployment (Kubernetes helm chart)
- Semantic firewall rule builder UI
- Agent A/B split testing
- SOC2-compliant audit export (CSV, JSON, PDF)
