# Contributing to Vibe flow

Thanks for your interest in contributing! Here's how to get started.

## Code of Conduct
Be respectful, constructive, and inclusive. We're all here to build something great.

## Getting Started

1. **Clone the repo**
   ```bash
   gh repo clone alinedev2503/-AI-SaaS-Vibe-Flow
   cd -AI-SaaS-Vibe-Flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your GEMINI_API_KEY
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming
- `feat/` — New features (e.g. `feat/agent-scheduling`)
- `fix/` — Bug fixes (e.g. `fix/mcp-timeout`)
- `docs/` — Documentation (e.g. `docs/api-reference`)
- `refactor/` — Code improvements (e.g. `refactor/auth-flow`)

### Commit Messages
Use conventional commits:
```
feat: add scheduled agent tasks
fix: resolve MCP tool timeout on slow connections
docs: update deployment guide
refactor: simplify theme context
```

### Before Submitting
- [ ] Run `npm run lint` — no TypeScript errors
- [ ] Run `npm run build` — builds successfully
- [ ] Test all affected pages manually
- [ ] Update locale files if adding/changing UI strings
- [ ] Update relevant .md docs if changing architecture

## Pull Request Process
1. Open a PR with a clear title and description
2. Link any related issues
3. Wait for review and address feedback
4. Squash-merge when approved

## Project Structure

```
src/
├── components/layout/   # Layout shell (Sidebar, Header)
├── contexts/            # React contexts (Theme, Language)
├── lib/                 # Core libs (Gemini, MCP, utils)
├── locales/             # i18n translation files
└── pages/               # Route page components
```

## Need Help?
Open a GitHub Discussion or check the existing docs:
- `CLAUDE.md` — Project conventions and commands
- `ARCHITECTURE.md` — System architecture overview
- `STYLE_GUIDE.md` — Code style and patterns
