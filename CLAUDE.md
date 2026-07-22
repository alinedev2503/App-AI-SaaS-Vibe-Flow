# CLAUDE.md — Vibe flow Project Guide

## Project Overview
SaaS platform for AI agent orchestration. React 19 + Vite + TypeScript + Tailwind 4 frontend, Express backend, SQLite database, Google Gemini AI.

## Commands
```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # TypeScript type-check (tsc --noEmit)
npm run clean    # Remove dist/
```

## Code Style
- **No comments** in source files unless absolutely necessary
- Use `cn()` from `@/lib/utils` for conditional class names (clsx + tailwind-merge)
- Use `useLanguage()` hook for all UI strings (i18n via `t('key')`)
- Use `useTheme()` for light/dark theme toggling
- Import paths: use `@/` alias for `src/` (e.g. `import { cn } from "@/lib/utils"`)

## Project Structure
```
src/
├── components/layout/   # Layout, Sidebar, Header
├── contexts/            # ThemeContext, LanguageContext
├── lib/                 # gemini.ts, mcp.ts, utils.ts
├── locales/             # pt-BR, en-US, es-ES
└── pages/               # Dashboard, AgentHub, CommandCenter, MCPGateway,
                        # ApprovalQueue, AuditLogs, Settings, Branding, Login
```

## Key Conventions
- All UI text lives in locale files (`src/locales/`), not inline
- Agents are defined with `Agent` interface in `AgentHub.tsx`
- Gemini models are configured in `src/lib/gemini.ts`
- MCP tools are registered in `src/lib/mcp.ts`
- Routes are defined in `src/App.tsx`
- CSS uses Tailwind v4 with `@theme` directives in `index.css`

## AI Studio Context
- App was created in Google AI Studio
- `GEMINI_API_KEY` is auto-injected at runtime from user secrets
- `APP_URL` is auto-injected with the Cloud Run service URL
- HMR is disabled when `DISABLE_HMR=true`
