# ADR-003: Estratégia de Autenticação, Autorização e Sessões

- **Status:** Aceito
- **Data:** 2026-09-10
- **Decisores:** Engenheiro de Segurança & Arquiteto Full Stack

---

## 1. Contexto

A plataforma atende a múltiplos perfis operacionais: Administrador da Organização, Operador de Agentes e Visualizador/Auditor. Além disso, no modelo white-label e SaaS, o sistema deve permitir login por e-mail/senha, recuperação segura e compatibilidade com Auth externa (Supabase Auth / Firebase Auth).

## 2. Problema

Garantir controle de acesso baseado em papéis (RBAC - Role-Based Access Control), proteção contra roubo de sessão, rate limiting em rotas sensíveis e conformidade com OWASP Top 10.

## 3. Decisão

1. **Tokens JWT com Assinatura HMAC-SHA256:**
   - `accessToken`: Curta duração (24h padrão, configurável via `JWT_EXPIRES_IN`).
   - Hashing de senhas: `bcrypt` com fator de custo 12 (`SALT_ROUNDS=12`).
2. **Middleware de Autorização:**
   - `authenticateToken`: Valida assinatura e injeta dados do usuário em `req.user`.
   - `requireAdmin`: Garante que ações de gerenciamento de equipe e branding sejam exclusivas de administradores.
3. **Proteção contra Brute Force:**
   - Rate limit específico para `/api/auth/*` (5 tentativas por minuto por IP).
4. **Recuperação de Senha:**
   - Geração de tokens criptográficos aleatórios com TTL de 1 hora e revogação pós-uso.
5. **BYOK (Bring Your Own Key):**
   - Chaves de API de IA (Gemini, OpenAI, Anthropic) são isoladas por usuário/tenant e transmitidas com máscara segura por padrão no frontend.

## 4. Consequências

- Segurança robusta e auditável sem dependências externas obrigatórias.
- Compatibilidade direta com pontes para Supabase Auth ou Firebase Auth quando habilitados.
