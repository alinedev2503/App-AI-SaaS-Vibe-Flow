# ADR-001: Seleção de Stack Tecnológica (VibeFlow Platform)

- **Status:** Aceito
- **Data:** 2026-09-10
- **Decisores:** Arquiteto de Software & Engenharia Full Stack

---

## 1. Contexto

O VibeFlow necessita de uma arquitetura web e mobile moderna, performática e modular, capaz de operar como SaaS multi-inquilino, executável localmente com zero fricção, além de ser facilmente empacotada como código-fonte para comercialização e white-label.

## 2. Problema

A solução deve atender simultaneamente a:
1. Renderização de UI reativa, fluida e com alto apelo visual (Dark/Light mode, animações ricas, dashboards em tempo real).
2. Backend seguro com baixo consumo de memória, suporte a streaming de LLM (Gemini / OpenAI / Anthropic) e suporte a múltiplos provedores de banco de dados (SQLite local, Supabase PostgreSQL e Firebase Firestore).
3. Compatibilidade multiplataforma (Web, PWA e Mobile com React Native / Capacitor).

## 3. Alternativas Consideradas

- **Opção A:** Next.js (Fullstack) — Alto acoplamento com runtime Vercel, complexidade para empacotar standalone / mobile.
- **Opção B:** React 19 + Vite (Frontend) + Express + TypeScript (Backend) — Desacoplamento limpo, portabilidade extrema, execução nativa em qualquer VPS/Container e bundling unificado com `esbuild`.
- **Opção C:** Python FastAPI + React — Maior pegada de runtime e necessidade de múltiplos gerenciadores de pacotes (pip + npm).

## 4. Decisão

Adotamos a **Opção B**:
- **Frontend:** React 19, Vite 6, Tailwind CSS v4, Motion, Lucide React, React Router 7.
- **Backend:** Express 4.21, TypeScript, Pino Logger, Helmet, Rate Limiter, JWT + bcrypt.
- **IA SDK:** `@google/genai` (Google Gen AI SDK v1.29+) com suporte a Bring-Your-Own-Key (BYOK) para Gemini, OpenAI e Claude.
- **Banco de Dados:** Padrão Adapter Pattern desacoplado (SQLite embedded para zero-config / Supabase PostgreSQL / Firebase Firestore).

## 5. Consequências

- **Positivas:**
  - Inicialização local instantânea (`npm install && npm run dev`).
  - Deploy em comando único no Vercel, Docker, Google Cloud Run ou VPS.
  - Baixíssimo overhead de dependências e total compatibilidade com white-label.
- **Negativas / Mitigações:**
  - Necessidade de gerenciar a compilação do Express via `esbuild` (automatizada no script `npm run build`).
