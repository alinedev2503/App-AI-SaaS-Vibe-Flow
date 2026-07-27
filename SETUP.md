# 🛠️ VibeFlow — Guia de Configuração e Implantação White Label

Este guia orienta a configuração técnica do **VibeFlow**, desde o desenvolvimento local até a implantação em produção com suporte a **SQLite**, **Supabase** e **Firebase**.

---

## ⚡ Quick Start (Desenvolvimento Local)

### 1. Requisitos
- **Node.js**: v18.0.0 ou superior
- **npm** ou **yarn**

### 2. Instalação Automática
Execute o script interativo de setup:

```bash
npm run setup
```

Este script irá:
1. Copiar `.env.example` para `.env.local` se não existir.
2. Criar a pasta `./data` para o banco de dados SQLite.
3. Checar a tipagem do TypeScript.
4. Realizar o build inicial do projeto.

### 3. Iniciar o Servidor e Frontend
```bash
npm run dev:all
```
Acesse o aplicativo no seu navegador em: `http://localhost:3000`

---

## 🔑 Credenciais de Teste Padrão (SQLite)

- **Email:** `admin@vibeflow.ai`
- **Senha:** `admin123`
- **Role:** `admin`

---

## 🗄️ Configuração de Banco de Dados Multi-Backend

O VibeFlow suporta 3 opções de banco de dados sem necessidade de alterar o código-fonte. A escolha é feita via variável de ambiente `DB_TYPE` no arquivo `.env.local`.

### Opção 1: SQLite (Padrão — Zero Configuração)
Ideal para desenvolvimento, testes ou MVPs rodando em VPS.

```env
DB_TYPE=sqlite
DB_PATH=./data/vibeflow.db
```

---

### Opção 2: Supabase (Recomendado para Cloud SaaS)
1. Crie um projeto gratuito em [https://supabase.com](https://supabase.com).
2. Acesse **Project Settings > API** e copie a **Project URL** e a **service_role key** (ou **anon key**).
3. Atualize o seu `.env.local`:

```env
DB_TYPE=supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOi...
```

---

### Opção 3: Firebase / Firestore
1. Crie um projeto em [https://console.firebase.google.com](https://console.firebase.google.com).
2. Ative o **Cloud Firestore**.
3. Copie o **Project ID** do seu projeto.
4. Atualize o seu `.env.local`:

```env
DB_TYPE=firebase
FIREBASE_PROJECT_ID=seu-projeto-id
```

---

## 🤖 Configuração da Inteligência Artificial (Google Gemini API)

1. Obtenha uma chave gratuita da API Gemini em [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Adicione ao arquivo `.env.local`:

```env
GEMINI_API_KEY=sua_chave_aqui
```

---

## 🧪 Executando os Testes Automatizados (QA)

Para rodar a suíte de testes unitários e de integração com Vitest:

```bash
npm run test:run
```

Para verificar erros de tipagem estática no código:

```bash
npm run lint
```

---

## 🚀 Deploy em Produção

O VibeFlow é compatível com os principais provedores de hospedagem:

- **Vercel / Render / Railway / AWS / DigitalOcean**
- Build command: `npm run build`
- Start command: `npm start`
