<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="VibeFlow Banner" width="100%" />
</div>

<h1 align="center">🚀 VibeFlow — Autonomous AI Workforce Platform</h1>

<p align="center">
  <strong>Orquestre, monitore e gerencie agentes de IA autônomos com supervisão humana nativa.</strong>
  <br />
  Implante IA com controle, não com medo.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License MIT" />
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite" alt="SQLite" />
  <img src="https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss" alt="Tailwind CSS v4" />
</p>

---

## 📋 Sobre o VibeFlow

VibeFlow é uma plataforma SaaS completa para **orquestração de agentes de IA autônomos**, alimentada pelo **Google Gemini**. Ela fornece um centro de comando unificado para implantar, monitorar e gerenciar trabalhadores digitais que executam tarefas de vendas, suporte, pesquisa, marketing e análise de dados.

**🎯 Público-alvo:** Startups B2B (20-200 funcionários), equipes de operações, agências que revendem IA como serviço, e CTOs que precisam de governança sobre agentes de IA.

---

## ✨ Funcionalidades

### 🤖 Agent Hub
Implante, pause, duplique e configure agentes com capacidades multimodais (texto, áudio, imagem). Interface intuitiva com busca e categorização.

### 🎮 Command Center
Chat em tempo real com Gemini Flash/Pro, suporte a streaming de respostas e conversão de texto para fala (TTS).

### 📊 Dashboard
KPIs em tempo real, matriz de status dos agentes, health do MCP Gateway, insights de segurança e métricas de uso.

### 🔌 MCP Gateway
Conecte ferramentas externas (CRM, e-mail, banco de dados, APIs REST) aos seus agentes de forma segura e centralizada.

### ✅ Approval Queue
Workflow de aprovação humana (human-in-the-loop) para ações críticas executadas por agentes.

### 📜 Audit Logs
Trilha de auditoria imutável de todas as ações dos agentes com busca e filtros avançados.

### 🎨 White-Label / Branding
Customização completa da identidade visual: logo, cores, favicon, nome da plataforma — ideal para revenda.

### 👥 Multi-tenant & Permissões
Três níveis de acesso (Admin, Operador, Visualizador) com painel de administração de usuários.

### 🔐 Autenticação & Segurança
- Login/registro com JWT
- Recuperação de senha por token
- Rate limiting e helmet
- Sessões gerenciadas pelo servidor

### 🌐 Internacionalização
Interface em **Português (BR)**, **English (US)** e **Español (ES)** — extensível para mais idiomas.

---

## 🖥️ Demonstração

| Página | Descrição |
|---|---|
| `/` | Landing page com framework PAS (Problem-Agitate-Solution) |
| `/login` | Login e registro de usuários |
| `/dashboard` | KPIs e métricas da plataforma |
| `/agents` | Agent Hub — gerencie seus agentes |
| `/command` | Command Center — chat com IA |
| `/mcp` | MCP Gateway — conexões externas |
| `/approvals` | Approval Queue — fila de aprovações |
| `/audit` | Audit Logs — trilha de auditoria |
| `/settings` | Configurações do perfil e plataforma |
| `/branding` | Personalização white-label |
| `/admin` | Painel administrativo de usuários |
| `/forgot-password` | Recuperação de senha |
| `/checkout` | Planos e assinatura |

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 19** + TypeScript 5.8
- **Vite 6** (build ultrarrápido)
- **Tailwind CSS v4** (design system moderno)
- **React Router v7** (rotas lazy-loaded)
- **Lucide React** (ícones)
- **Motion** (animações)
- **react-helmet-async** (SEO)

### Backend
- **Express 4** + TypeScript
- **SQLite** (via better-sqlite3) — zero configuração
- Suporte a **Supabase** e **Firebase** (opcional)
- **JWT** para autenticação
- **Helmet** + **express-rate-limit** (segurança)
- **Multer** (upload de arquivos)
- **Pino** (logging estruturado)

### IA
- **Google Gemini API** (modelos Flash e Pro)
- Suporte multimodal (texto, áudio, imagem)

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm 9+
- Uma chave de API do **Google Gemini** ([gratuita](https://aistudio.google.com/apikey))

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/vibeflow.git
cd vibeflow

# 2. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local e adicione sua GEMINI_API_KEY

# 3. Instale as dependências
npm install

# 4. Inicie o setup (cria banco, verifica tipos, build)
npm run setup

# 5. Inicie o servidor de desenvolvimento
npm run dev:all
```

O app estará disponível em **http://localhost:3000** 🎉

### Credenciais de teste (SQLite)
```
Email: admin@vibeflow.ai
Senha: admin123
```

---

## 🚀 Deploy

### Build de produção
```bash
npm run build
```

### Servidor de produção
```bash
# Configure .env.local com as variáveis de produção
# Inicie o servidor
npm start
```

### GitHub Pages
```bash
GH_PAGES=true npm run deploy
```

### Docker
*(em breve)*

---

## 📁 Estrutura do Projeto

```
vibeflow/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizáveis
│   ├── contexts/           # Contextos (tema, idioma, toast)
│   ├── lib/                # Utilitários e API client
│   ├── pages/              # Páginas da aplicação
│   └── __tests__/          # Testes unitários
├── server/                 # Backend Express
│   ├── db/                 # Camada de banco de dados
│   │   ├── adapters/       # SQLite, Supabase, Firebase
│   │   └── migrations/     # Migrations SQL
│   ├── lib/                # Utilitários do servidor
│   ├── middleware/          # Middlewares (auth, admin)
│   └── routes/             # Rotas da API
├── scripts/                # Scripts de setup/utilitários
├── data/                   # Dados locais (SQLite, uploads)
├── public/                 # Assets estáticos
├── COMPLETE.md             # Documentação completa (12 seções)
├── LICENSE                 # Licença MIT
└── .env.example            # Exemplo de variáveis de ambiente
```

---

## 🔒 Segurança

- ✅ Autenticação via JWT com expiração configurável
- ✅ Senhas hasheadas com bcrypt
- ✅ Rate limiting por IP (100 req/min)
- ✅ Headers de segurança (Helmet)
- ✅ Sessões gerenciadas pelo servidor
- ✅ Recuperação de senha com token + validade 1h
- ✅ Validação de entrada (express-validator)
- ✅ Proteção contra XSS e CSRF
- ✅ Trilha de auditoria imutável

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

## 🤝 Suporte

- 📧 Email: suporte@vibeflow.ai
- 🐛 Issues: [GitHub Issues](https://github.com/alinedev2503/-AI-SaaS-Vibe-Flow/issues)

---

<p align="center">
  <strong>VibeFlow</strong> — Autonomia com supervisão. IA com controle.
</p>
