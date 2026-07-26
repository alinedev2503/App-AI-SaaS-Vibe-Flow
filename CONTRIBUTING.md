# Contribuindo com o VibeFlow

Obrigado pelo interesse em contribuir! Este guia explica tudo que você precisa saber para contribuir de forma eficaz.

---

## 📋 Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Começar](#como-começar)
3. [Fluxo de Trabalho](#fluxo-de-trabalho)
4. [Convenções de Branch](#convenções-de-branch)
5. [Convenções de Commit](#convenções-de-commit)
6. [Checklist antes do PR](#checklist-antes-do-pr)
7. [Processo de Pull Request](#processo-de-pull-request)
8. [Reportando Bugs](#reportando-bugs)
9. [Sugerindo Features](#sugerindo-features)
10. [Estilo de Código](#estilo-de-código)

---

## 🤝 Código de Conduta

Este projeto segue o [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

**Em resumo:**
- Seja respeitoso e construtivo
- Critique ideias, não pessoas
- Acolha diferentes perspectivas e experiências
- Denuncie comportamentos abusivos: security@vibeflow.ai

---

## 🚀 Como Começar

### 1. Fork e Clone

```bash
# Fork via GitHub UI, depois:
git clone https://github.com/SEU_USUARIO/-AI-SaaS-Vibe-Flow.git
cd -AI-SaaS-Vibe-Flow

# Adicione o upstream para manter seu fork atualizado
git remote add upstream https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow.git
```

### 2. Instale as Dependências

```bash
node --version   # Deve ser 18+ (recomendado: 20 LTS)
npm install
```

### 3. Configure o Ambiente

```bash
cp .env.example .env.local
# Edite .env.local:
#   GEMINI_API_KEY=sua_chave_gemini
#   JWT_SECRET=um_secret_de_64_caracteres_aleatorios
```

### 4. Execute o Setup

```bash
npm run setup    # Cria o banco SQLite e popula dados de exemplo
```

### 5. Inicie o Servidor de Desenvolvimento

```bash
npm run dev:all  # Frontend (porta 5173) + Backend (porta 3000) simultâneos
```

Acesse **http://localhost:3000** e faça login com `admin@vibeflow.ai` / `admin123`.

---

## 🔄 Fluxo de Trabalho

```
1. Atualize seu fork com o upstream
   git fetch upstream
   git merge upstream/master

2. Crie um branch para sua feature/fix
   git checkout -b feat/minha-feature

3. Desenvolva, commitando incrementalmente
   git add .
   git commit -m "feat: adiciona X"

4. Sincronize com upstream antes de abrir PR
   git fetch upstream
   git rebase upstream/master

5. Abra o Pull Request no GitHub
```

---

## 🌿 Convenções de Branch

| Prefixo | Uso | Exemplo |
|---|---|---|
| `feat/` | Nova funcionalidade | `feat/agent-scheduling` |
| `fix/` | Correção de bug | `fix/mcp-timeout` |
| `docs/` | Documentação apenas | `docs/api-reference` |
| `refactor/` | Refatoração sem nova feature | `refactor/auth-flow` |
| `test/` | Adição/correção de testes | `test/approval-queue` |
| `chore/` | Atualizações de deps, config | `chore/update-gemini-sdk` |
| `perf/` | Melhoria de performance | `perf/audit-log-pagination` |

**Regras:**
- Use kebab-case após o prefixo
- Seja descritivo mas conciso (max 50 chars totais)
- Um branch = uma responsabilidade

---

## 📝 Convenções de Commit

Seguimos o padrão **[Conventional Commits](https://www.conventionalcommits.org/)**.

### Formato

```
<tipo>(<escopo opcional>): <descrição em minúsculo, imperativo>

[corpo opcional — explica o "porquê", não o "o quê"]

[rodapé opcional — refs, breaking changes]
```

### Tipos

| Tipo | Quando usar |
|---|---|
| `feat` | Adiciona uma nova funcionalidade |
| `fix` | Corrige um bug |
| `docs` | Altera apenas documentação |
| `style` | Formatação, sem mudança de lógica |
| `refactor` | Refatoração sem correção de bug ou nova feature |
| `test` | Adiciona ou corrige testes |
| `chore` | Atualização de deps, scripts de build, config |
| `perf` | Melhoria de performance |
| `ci` | Mudanças em CI/CD (GitHub Actions) |
| `revert` | Reverte um commit anterior |

### Exemplos

```bash
# ✅ Bons exemplos
git commit -m "feat(agents): adiciona suporte a agentes com capacidade de visão"
git commit -m "fix(auth): corrige expiração prematura do JWT em UTC+3"
git commit -m "docs(deploy): adiciona instruções para Google Cloud Run"
git commit -m "refactor(mcp): simplifica executor de ferramentas MCP"
git commit -m "chore: atualiza @google/genai para 1.5.0"

# ❌ Maus exemplos (evite)
git commit -m "changes"
git commit -m "WIP"
git commit -m "fix bug"
git commit -m "update stuff"
```

### Breaking Changes

```bash
git commit -m "feat(api)!: altera formato de resposta da rota /api/agents

BREAKING CHANGE: O campo 'agent_status' foi renomeado para 'status'.
Clientes da API precisam atualizar suas integrações."
```

---

## ✅ Checklist antes do PR

Execute todos os itens antes de abrir um Pull Request:

**Código**
- [ ] `npm run lint` — zero erros de TypeScript (`tsc --noEmit`)
- [ ] `npm run build` — build de produção bem-sucedido
- [ ] `npm run test` — todos os testes passando
- [ ] Nenhum `console.log` esquecido no código

**i18n**
- [ ] Se adicionou/alterou texto na UI: atualizou `pt-BR.ts`, `en-US.ts` e `es-ES.ts`
- [ ] Nenhum string hardcoded em JSX (tudo via `t('chave')`)

**Documentação**
- [ ] Se alterou arquitetura ou estrutura: atualizou `ARCHITECTURE.md`
- [ ] Se adicionou comando ou script: atualizou `CLAUDE.md`
- [ ] Se alterou fluxo de deploy: atualizou `DEPLOY.md`
- [ ] `CHANGELOG.md` atualizado com a mudança

**Testes**
- [ ] Código novo tem cobertura de testes (quando aplicável)
- [ ] Cenários de erro testados

**Segurança**
- [ ] Nenhum secret commitado (`.env.local` está no `.gitignore`)
- [ ] Input de usuário validado antes de usar
- [ ] Novo endpoint tem autenticação/autorização quando necessário

---

## 🔀 Processo de Pull Request

### Abrindo o PR

1. Use o template de PR ao criar (disponível em `.github/PULL_REQUEST_TEMPLATE.md`)
2. Título deve seguir o formato de Conventional Commit: `feat: descrição clara`
3. Descreva:
   - **O quê** foi alterado
   - **Por quê** foi alterado
   - **Como testar** a mudança
4. Linke issues relacionadas: `Closes #123`
5. Adicione screenshots/gravações para mudanças de UI

### Revisão

- Aguarde pelo menos **1 aprovação** antes de fazer merge
- Responda a todos os comentários antes do merge
- Para mudanças de arquitetura ou segurança: aguarde **2 aprovações**
- Não force-push em branches com PR aberto — use commits adicionais

### Merge

- **Squash and merge** para features/fixes (histórico limpo)
- **Merge commit** para releases e mudanças de breaking change
- Delete o branch após o merge

---

## 🐛 Reportando Bugs

Use o template de issue de bug. Inclua:

```markdown
## Descrição
[Descrição clara e concisa do bug]

## Passos para reproduzir
1. Acesse '...'
2. Clique em '...'
3. Veja o erro

## Comportamento esperado
[O que deveria acontecer]

## Comportamento atual
[O que está acontecendo]

## Screenshots / Logs
[Se aplicável]

## Ambiente
- OS: [ex: Ubuntu 22.04 / macOS 14]
- Node.js: [ex: 20.11.0]
- Navegador: [ex: Chrome 124]
- Versão do VibeFlow: [ex: 1.0.2]
```

---

## 💡 Sugerindo Features

1. Verifique primeiro se já existe uma [issue](https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/issues) ou [discussion](https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/discussions) sobre o tema
2. Abra uma **Discussion** (não uma Issue) com o label `feature-request`
3. Descreva o problema que a feature resolve (não apenas a solução)
4. Se a ideia tiver apoio da comunidade, abriremos uma Issue formal e adicionaremos ao ROADMAP

---

## 📖 Estilo de Código

Consulte o [STYLE_GUIDE.md](./STYLE_GUIDE.md) completo. Resumo:

- **TypeScript strict** — sem `any`, sem `// @ts-ignore`
- **Sem comentários** no código (o código deve ser autoexplicativo)
- **i18n obrigatório** — toda string de UI via `t('chave')`
- **Imports absolutos** — use `@/` para `src/`
- **cn() para classes condicionais** — clsx + tailwind-merge
- **Prettier** para formatação (2 espaços, aspas duplas)

---

## 🆘 Precisa de Ajuda?

- 💬 [GitHub Discussions](https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/discussions) — dúvidas gerais
- 🐛 [GitHub Issues](https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/issues) — bugs e feature requests
- 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) — entenda a arquitetura
- 📖 [CLAUDE.md](./CLAUDE.md) — comandos e convenções rápidas

---

Obrigado por ajudar a construir o futuro da força de trabalho digital! 🤖✨
