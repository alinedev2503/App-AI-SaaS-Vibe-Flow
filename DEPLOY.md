# Deploy Guide

## Prerequisites
- Node.js 20+
- A Google Gemini API key
- A Cloud Run account (or any Docker host)

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `APP_URL` | Yes | Public URL of the deployed app |

## Option 1 — Local Development

```bash
cp .env.example .env.local
# Edit .env.local with your GEMINI_API_KEY
npm install
npm run dev
```

Open http://localhost:3000

## Option 2 — Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/server/index.js"]
```

Build and run:

```bash
docker build -t vibeflow .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key vibeflow
```

## Option 3 — Google Cloud Run

```bash
# Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build and deploy
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/vibeflow
gcloud run deploy vibeflow \
  --image gcr.io/YOUR_PROJECT_ID/vibeflow \
  --platform managed \
  --set-env-vars GEMINI_API_KEY=your_key \
  --allow-unauthenticated
```

## Option 4 — AI Studio Deployment

1. Open the app in AI Studio: https://ai.studio/apps/48a63ad9-6ded-4fa6-9ebf-ed01b82f9cc7
2. Set `GEMINI_API_KEY` in the Secrets panel
3. Click **Deploy** — AI Studio auto-injects the secrets and provides a Cloud Run URL

## Post-Deploy Checklist

- [ ] SSL/TLS enabled (auto on Cloud Run)
- [ ] `GEMINI_API_KEY` injected and working
- [ ] SQLite database path is writable
- [ ] CORS configured if using custom domain
- [ ] Audit logs rotation plan in place
