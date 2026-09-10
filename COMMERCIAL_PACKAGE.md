# VibeFlow — Pacote de Comercialização e Guia White-Label

**Versão do Produto:** 1.0.0  
**Formatos de Venda Suportados:** Código-Fonte Completo, SaaS Multi-Tenant, Solução White-Label, Template/Boilerplate, Aplicativo Mobile (Google Play).

---

## 1. Proposta de Valor e Modelos de Monetização

O **VibeFlow** é projetado para permitir que o comprador monetize a plataforma de 4 maneiras complementares:

1. **SaaS por Assinatura (B2B):**
   - Planos: Starter ($49/mês), Pro ($149/mês) e Enterprise ($499/mês).
   - Cobrança por assentos de agentes ativos ou chamadas de IA.
2. **Venda de Código-Fonte / Boilerplate:**
   - Licença comercial única para desenvolvedores e agências criarem seus próprios SaaS.
3. **White-Label para Agências de IA:**
   - Agências configuram o VibeFlow com a marca do cliente final e cobram mensalidades de consultoria e automação.
4. **Distribuição em Lojas de Aplicativos (Google Play):**
   - App freemium com compras no app (IAP) ou login corporativo.

---

## 2. Personalização White-Label (Guia do Comprador)

O comprador pode customizar 100% da plataforma sem alterar a lógica de negócio central:

### 2.1 Alteração de Marca e Logotipo
- **Configuração no Painel:** Acesse a rota `/branding` como Administrador para alterar:
  - Nome da Plataforma (ex: *MinhaIA Flow*).
  - Logotipo e Favicon (upload direto).
  - Cores Primárias e Secundárias (paleta customizada).
  - Informações de rodapé e links de suporte.

### 2.2 Troca de Provedor de Banco de Dados
No arquivo `.env`:
```env
# Opções: sqlite | supabase | firebase
DATABASE_PROVIDER=supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-chave-secreta
```

---

## 3. Demonstração Segura (Demo Environment vs Production)

A aplicação inclui isolamento nativo para ambientes de demonstração:
- **Demo Mode:** Permite que clientes em potencial testem o Command Center, criem agentes temporários e visualizem a fila de aprovações com dados fictícios.
- **Limite de Uso da Demo:** O Command Center permite até 2 consultas experimentais gratuitas antes de solicitar a criação de conta ou inserção de chave própria (BYOK).

---

## 4. Checklist de Instalação e Teste do Comprador

1. `git clone <repo>` e `npm install`
2. `cp .env.example .env.local`
3. Inserir chave de API da IA (Google Gemini gratuita ou OpenAI)
4. Executar `npm run dev` para desenvolvimento ou `npm run build && npm start` para produção
5. Testar o suite de testes automatizados com `npm test`
