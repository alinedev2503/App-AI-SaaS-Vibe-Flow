# VibeFlow — Deploy Guide

**Versão:** 1.0.0  
**Última atualização:** Julho 2026

---

## Pré-requisitos

| Requisito | Mínimo | Recomendado |
|---|---|---|
| Node.js | 18.x | 20.x LTS |
| npm | 9.x | 10.x |
| Memória RAM (servidor) | 512 MB | 1 GB |
| Armazenamento | 500 MB | 2 GB |
| Chave Gemini API | Obrigatória | — |

---

## Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

| Variável | Obrigatória | Default | Descrição |
|---|---|---|---|
| `GEMINI_API_KEY` | ✅ Sim | — | Chave da API do Google Gemini |
| `JWT_SECRET` | ✅ Sim | — | Secret para assinar tokens JWT (min 64 chars) |
| `PORT` | Não | `3000` | Porta do servidor Express |
| `NODE_ENV` | Não | `development` | `development` ou `production` |
| `APP_URL` | Não | `http://localhost:3000` | URL pública da aplicação |
| `DB_PATH` | Não | `./data/vibeflow.db` | Caminho do arquivo SQLite |
| `DISABLE_HMR` | Não | `false` | Desabilita HMR (Cloud Run: `true`) |
| `LOG_LEVEL` | Não | `info` | `debug`, `info`, `warn`, `error` |

### Gerando um JWT_SECRET seguro

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Opção 1 — Desenvolvimento Local

```bash
# 1. Clone o repositório
git clone https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow.git
cd -AI-SaaS-Vibe-Flow

# 2. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com sua GEMINI_API_KEY e JWT_SECRET

# 3. Instale as dependências
npm install

# 4. Execute o setup inicial (cria banco + dados de exemplo)
npm run setup

# 5. Inicie em modo desenvolvimento (frontend + backend simultâneos)
npm run dev:all
```

Acesse: **http://localhost:3000**

Credenciais de teste:
```
Email: admin@vibeflow.ai
Senha: admin123
```

### Scripts disponíveis

```bash
npm run dev          # Frontend apenas (Vite HMR)
npm run dev:server   # Backend apenas (tsx watch)
npm run dev:all      # Frontend + Backend simultâneos
npm run build        # Build de produção
npm run start        # Servidor de produção (requer build)
npm run setup        # Init banco + verifica config
npm run seed         # Popula dados de exemplo
npm run lint         # TypeScript typecheck (tsc --noEmit)
npm run test         # Testes unitários (Vitest)
npm run clean        # Remove dist/
```

---

## Opção 2 — Build de Produção (servidor próprio)

```bash
# 1. Build do frontend e backend
npm run build

# 2. Configure as variáveis de ambiente de produção
export GEMINI_API_KEY="sua_chave"
export JWT_SECRET="seu_secret_seguro"
export NODE_ENV="production"
export PORT="3000"

# 3. Execute o servidor de produção
npm start
```

O servidor Express servirá os assets estáticos do frontend compilado em `dist/`.

---

## Opção 3 — Docker

### Dockerfile

```dockerfile
# ── Estágio 1: Build ───────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

# ── Estágio 2: Produção ────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Cria usuário não-root
RUN addgroup -S vibeflow && adduser -S vibeflow -G vibeflow

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts

# Cria diretório de dados com permissões corretas
RUN mkdir -p ./data && chown -R vibeflow:vibeflow ./data

USER vibeflow

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist/server/index.js"]
```

### Docker Compose (recomendado para dev)

```yaml
# docker-compose.yml
version: "3.9"

services:
  vibeflow:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    volumes:
      - vibeflow_data:/app/data
    restart: unless-stopped

volumes:
  vibeflow_data:
```

```bash
# Build e executa
docker compose up -d

# Logs
docker compose logs -f

# Para
docker compose down
```

### Docker sem Compose

```bash
# Build
docker build -t vibeflow:latest .

# Executa
docker run -d \
  --name vibeflow \
  -p 3000:3000 \
  -e GEMINI_API_KEY="sua_chave" \
  -e JWT_SECRET="seu_secret" \
  -e NODE_ENV=production \
  -v vibeflow_data:/app/data \
  --restart unless-stopped \
  vibeflow:latest
```

---

## Opção 4 — Google Cloud Run (Recomendado para produção)

### Pré-requisitos
- `gcloud` CLI instalado e autenticado
- Projeto GCP configurado com billing ativo
- Artifact Registry habilitado

```bash
# 1. Autentique na GCP
gcloud auth login
gcloud config set project SEU_PROJETO_ID

# 2. Habilite APIs necessárias
gcloud services enable run.googleapis.com artifactregistry.googleapis.com

# 3. Configure o Artifact Registry
gcloud artifacts repositories create vibeflow \
  --repository-format=docker \
  --location=us-central1

# 4. Build e push da imagem
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/SEU_PROJETO/vibeflow/vibeflow:latest

# 5. Deploy no Cloud Run
gcloud run deploy vibeflow \
  --image us-central1-docker.pkg.dev/SEU_PROJETO/vibeflow/vibeflow:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars NODE_ENV=production,DISABLE_HMR=true \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest,JWT_SECRET=jwt-secret:latest
```

### Configurando Secrets no Cloud Run

```bash
# Cria os secrets (uma vez)
echo -n "sua_gemini_api_key" | gcloud secrets create gemini-api-key --data-file=-
echo -n "seu_jwt_secret_64_chars" | gcloud secrets create jwt-secret --data-file=-

# Dá permissão ao service account do Cloud Run
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:SEU_SA@SEU_PROJETO.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Persistência do SQLite no Cloud Run

> ⚠️ **Atenção:** Cloud Run é stateless. O SQLite em `/app/data` é perdido a cada deploy.

Para persistência em produção, use uma das opções:

**Opção A — Cloud Storage FUSE (simples):**
```bash
# Monte um bucket GCS como filesystem
gcloud run deploy vibeflow --add-volume name=data,type=cloud-storage,bucket=vibeflow-data \
  --add-volume-mount volume=data,mount-path=/app/data
```

**Opção B — Supabase (recomendado para escala):**
- Configure `DATABASE_ADAPTER=supabase` nas variáveis de ambiente
- O adapter `server/db/adapters/supabase.ts` assume o controle automaticamente

---

## Opção 5 — GitHub Pages (Frontend estático)

> ⚠️ Para o frontend estático apenas — sem backend. Funcionalidades de auth e banco não estarão disponíveis.

```bash
# Deploy automático
GH_PAGES=true npm run deploy
```

Configure em `vite.config.ts`:
```typescript
export default defineConfig({
  base: process.env.GH_PAGES ? "/nome-do-repo/" : "/",
});
```

---

## Opção 6 — AI Studio

1. Abra: https://aistudio.google.com/app/your-app-id
2. Em **Secrets**, adicione `GEMINI_API_KEY`
3. Clique em **Deploy** — o AI Studio injeta os secrets e provisiona Cloud Run automaticamente
4. `APP_URL` e `DISABLE_HMR=true` são injetados automaticamente

---

## ✅ Checklist Pós-Deploy

### Segurança
- [ ] HTTPS habilitado (automático no Cloud Run / GitHub Pages)
- [ ] `JWT_SECRET` é aleatório e tem ≥ 64 caracteres
- [ ] `GEMINI_API_KEY` está em secrets, não em variáveis de ambiente versionadas
- [ ] Rate limiting ativo e testado
- [ ] Headers de segurança verificados em [securityheaders.com](https://securityheaders.com)

### Funcionalidade
- [ ] Login funcionando com credenciais de teste
- [ ] Command Center respondendo (streaming ativo)
- [ ] Audit logs sendo gravados
- [ ] Approval Queue funcionando

### Banco de dados
- [ ] SQLite gravável (`chmod 700` no diretório de data)
- [ ] Backup automatizado configurado
- [ ] Migrações executadas (`npm run setup`)

### Monitoramento
- [ ] Logs visíveis (Cloud Logging ou stdout)
- [ ] Health check endpoint respondendo: `GET /api/health → 200`
- [ ] Alertas de erro configurados (Cloud Monitoring ou Sentry)

---

## Rollback

```bash
# Cloud Run — listar revisões
gcloud run revisions list --service vibeflow --region us-central1

# Redirecionar tráfego para revisão anterior
gcloud run services update-traffic vibeflow \
  --to-revisions REVISAO_ANTERIOR=100 \
  --region us-central1
```

---

## Troubleshooting

| Problema | Causa provável | Solução |
|---|---|---|
| `401 Unauthorized` em todas as rotas | `JWT_SECRET` incorreto ou ausente | Verifique a variável de ambiente |
| `Database is readonly` | Permissões do diretório `data/` | `chmod 700 ./data` |
| Gemini não responde | `GEMINI_API_KEY` inválida | Verifique no AI Studio |
| HMR não funciona | Cloud Run não suporta WebSocket de HMR | Defina `DISABLE_HMR=true` |
| Build falha em `tsc` | Erros de tipo TypeScript | Execute `npm run lint` localmente |
| `EADDRINUSE: port 3000` | Outro processo na porta | `kill $(lsof -ti:3000)` |
