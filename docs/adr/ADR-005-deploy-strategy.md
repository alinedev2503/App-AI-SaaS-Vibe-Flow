# ADR-005: Estratégia de Deploy, CI/CD e Publicação Multi-Ambiente

- **Status:** Aceito
- **Data:** 2026-09-10
- **Decisores:** Engenheiro DevOps / Cloud & Product Manager

---

## 1. Contexto

Como o produto é comercializado como código-fonte, SaaS e solução white-label, o comprador deve conseguir realizar o deploy na plataforma de sua preferência com esforço mínimo.

## 2. Decisão

1. **Vercel (Frontend + Serverless API):**
   - Configurado via `vercel.json` na raiz com roteamento SPA e funções serverless integradas.
2. **Google Cloud Run / Docker (Full-Stack Container):**
   - Imagem de container leve baseada em `node:20-alpine` com build multi-stage, executando o servidor compilado em `dist/server.cjs` na porta 3000.
3. **PWA & Mobile (Capacitor / React Native Bridge):**
   - PWA com manifesto e service worker para instalação em navegadores mobile.
   - Estrutura pronta para empacotamento com Capacitor ou React Native para gerar APK / AAB para Google Play Store.
4. **CI/CD via GitHub Actions:**
   - Pipeline automatizado em `.github/workflows/ci.yml` cobrindo lint, typecheck, suíte de testes Vitest e verificação de build.

## 3. Consequências

- O comprador recebe tutoriais completos em `DEPLOY.md` para Vercel, Docker, VPS, Cloud Run e Play Store.
