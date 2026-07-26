# VibeFlow — Security Policy

**Versão:** 1.0.0  
**Última atualização:** Julho 2026  
**Contato de segurança:** security@vibeflow.ai

---

## 📋 Versões Suportadas

| Versão | Suporte de Segurança |
|---|---|
| 1.0.x (latest) | ✅ Suportada — patches em 48h |
| 0.x.x (legacy) | ❌ Não suportada — atualize para 1.0 |

---

## 🚨 Reportando uma Vulnerabilidade

**NÃO abra um GitHub Issue público** para vulnerabilidades de segurança. Isso exporia o problema antes de um patch estar disponível.

### Como reportar

**Opção 1 — GitHub Private Vulnerability Reporting (preferido):**
1. Acesse a aba [Security](https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/security) do repositório
2. Clique em **"Report a vulnerability"**
3. Preencha o formulário com todos os detalhes

**Opção 2 — Email:**
Envie para **security@vibeflow.ai** com o assunto `[SECURITY] Descrição breve`

### O que incluir no relatório

- **Descrição** clara da vulnerabilidade
- **Passos para reproduzir** (quanto mais detalhado, mais rápido o fix)
- **Versão(ões) afetada(s)**
- **Impacto potencial** (CVSS score se possível)
- **Prova de conceito** (PoC) se disponível — sem exploração ativa, por favor
- Seu contato para crédito (opcional)

### SLA de resposta

| Severidade | Reconhecimento | Patch |
|---|---|---|
| Crítica (CVSS 9–10) | 24h | 72h |
| Alta (CVSS 7–8.9) | 48h | 7 dias |
| Média (CVSS 4–6.9) | 72h | 30 dias |
| Baixa (CVSS 0–3.9) | 7 dias | Próxima release |

---

## 🔐 Arquitetura de Segurança

### Autenticação

```
Fluxo de Login:
POST /api/auth/login
  1. Valida formato do email (express-validator)
  2. Busca usuário no SQLite por email (prepared statement — sem SQL injection)
  3. bcrypt.compare(senha, hash) — 12 rounds
  4. Gera JWT com payload: { userId, role, iat, exp: +7d }
  5. Retorna token
  
Cada request protegido:
  → Authorization: Bearer <token>
  → middleware/authenticate.ts: jwt.verify(token, JWT_SECRET)
  → Falha → 401 Unauthorized
  → Sucesso → req.user = { id, role }
```

**Proteções:**
- ✅ Senhas hasheadas com **bcrypt** (12 rounds) — irreversível
- ✅ **JWT** com expiração de 7 dias
- ✅ Logout invalida token no lado do cliente
- ✅ Recuperação de senha via token único com TTL de 1 hora
- ✅ Refresh token flow planejado para fase 2

### Rate Limiting

```
Endpoints de auth: 10 requisições / 15 minutos por IP
API geral:         100 requisições / minuto por IP
Upload:            5 uploads / hora por usuário
```

Implementado com `express-rate-limit`. Bypass por IP whitelist disponível para CI/CD.

### Headers de Segurança (Helmet)

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Proteção de Banco de Dados

- ✅ **Prepared statements** em todas as queries — imune a SQL Injection
- ✅ Nenhuma query via concatenação de strings
- ✅ Inputs validados com `express-validator` antes de chegar ao banco
- ✅ SQLite em modo WAL (Write-Ahead Logging) — integridade mesmo com crash

### Proteção de Dados

| Dado | Proteção |
|---|---|
| Senhas | bcrypt hash (nunca armazenado em texto) |
| JWT Secret | Variável de ambiente (nunca em código) |
| API Keys | Hash SHA-256 (chave raw nunca armazenada) |
| GEMINI_API_KEY | Injetada via env var / secrets manager |
| Uploads | Validação de tipo MIME + limite de tamanho |

---

## 🤖 Segurança de Agentes de IA

### Sistema de Defesa em 3 Camadas

```
┌─────────────────────────────────────────────────────┐
│  CAMADA 3 — Semantic Firewall (LLM-based)           │
│  Detecta prompt injection, jailbreak attempts,      │
│  instruções maliciosas embutidas em conteúdo         │
├─────────────────────────────────────────────────────┤
│  CAMADA 2 — ML Anomaly Detection                    │
│  Identifica padrões anômalos: frequência incomum,   │
│  escopo além do esperado, dados acessados fora do   │
│  contexto normal do agente                          │
├─────────────────────────────────────────────────────┤
│  CAMADA 1 — Deterministic Rules                     │
│  Regras fixas: rate limits por agente, allowlist    │
│  de ferramentas, blocklist de comandos proibidos    │
└─────────────────────────────────────────────────────┘
```

### Human-in-the-Loop (Approval Queue)

Toda ação classificada como `impact: high | critical` requer aprovação explícita antes de executar:

```
Agente detecta ação crítica
  → Cria registro na tabela approvals (status: 'pending')
  → Agente PAUSA a execução
  → Admin recebe alerta no dashboard
  → Admin aprova ou rejeita com comentário
  → Agente recebe resposta e age conforme
  → Audit log registra decisão + quem aprovou
```

**Regra de ouro:** Nenhuma ação de alto impacto é executada automaticamente. Nunca.

---

## 📜 Práticas de Desenvolvimento Seguro

### Secrets Management
```bash
# ✅ Correto — variáveis de ambiente
GEMINI_API_KEY=sua_chave_aqui

# ❌ NUNCA — secrets em código
const apiKey = "AIzaSyXXXXXX"; // não faça isso!
```

- `.env.local` está no `.gitignore`
- `.env.example` nunca contém valores reais
- GitHub Actions Secrets para CI/CD
- AI Studio Secrets para deploy Cloud Run

### Dependências
- `npm audit` executado no CI para detectar vulnerabilidades
- Dependências atualizadas mensalmente
- Sem dependências com CVEs conhecidos em produção

### TypeScript Strict
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```
Previne classes inteiras de bugs em runtime.

### CORS
```typescript
// Produção: apenas origens explicitamente permitidas
const allowedOrigins = [process.env.APP_URL, "https://vibeflow.ai"];
```

---

## 🛡️ Checklist de Segurança para Deploy

Antes de ir para produção, verifique:

- [ ] `JWT_SECRET` é aleatório e tem pelo menos 64 caracteres
- [ ] `GEMINI_API_KEY` está nos secrets do servidor, não em código
- [ ] HTTPS habilitado (automático no Cloud Run)
- [ ] Rate limiting ativo
- [ ] CORS restrito à URL de produção
- [ ] SQLite em diretório com permissões restritas (700)
- [ ] Backup automatizado do banco de dados
- [ ] Logs de acesso monitorados (Pino → Cloud Logging)
- [ ] `npm audit` sem vulnerabilidades críticas/altas
- [ ] Headers de segurança verificados com [securityheaders.com](https://securityheaders.com)

---

## 🏆 Hall of Thanks

Agradecemos publicamente aos pesquisadores de segurança que contribuíram responsavelmente:

*(Nenhum reporte ainda — seja o primeiro!)*

---

*Esta política segue as diretrizes do [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories) e do [OWASP Responsible Disclosure](https://owasp.org/www-community/Vulnerability_Disclosure_Cheat_Sheet).*
