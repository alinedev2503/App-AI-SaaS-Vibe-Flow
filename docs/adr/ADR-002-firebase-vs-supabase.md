# ADR-002: Abstração Dual de Persistência (Firebase vs Supabase vs SQLite)

- **Status:** Aceito
- **Data:** 2026-09-10
- **Decisores:** Arquiteto de Software & Engenheiro de Banco de Dados

---

## 1. Contexto

O comprador do código-fonte ou template do VibeFlow precisa de flexibilidade para escolher a infraestrutura de dados que melhor atende ao seu modelo de negócio, custos e infraestrutura existente (Supabase PostgreSQL para modelos relacionais ou Firebase Firestore para ecossistema Google Cloud e NoSQL em tempo real).

## 2. Problema

Acoplar o backend diretamente a bibliotecas específicas de fornecedores (como `@supabase/supabase-js` ou `firebase-admin`) nos controladores e rotas quebra o isolamento, impede a troca de provedor e aumenta o débito técnico.

## 3. Alternativas Consideradas

- **Opção A: Acoplamento Único (Apenas Supabase ou Apenas Firebase):** Limita a comercialização e força o comprador a migrar toda a base.
- **Opção B: Adapter / Repository Pattern Unificado:** Uma interface TypeScript comum (`DatabaseAdapter`) implementada por drivers independentes (`SQLiteAdapter`, `SupabaseAdapter`, `FirebaseAdapter`), instanciados dinamicamente via variável de ambiente `DATABASE_PROVIDER`.

## 4. Decisão

Adotamos a **Opção B**.
- Criamos a interface `DatabaseAdapter` em `server/db/adapter.ts`.
- Implementamos `SQLiteAdapter` (`server/db/adapters/sqlite.ts`) para desenvolvimento local e pequenos servidores sem dependências externas.
- Implementamos `SupabaseAdapter` (`server/db/adapters/supabase.ts`) para instâncias com PostgreSQL, RLS e autenticação enterprise.
- Implementamos `FirebaseAdapter` (`server/db/adapters/firebase.ts`) para Firestore, Firebase Auth e regras de segurança Google.
- A seleção é configurada via `DATABASE_PROVIDER=sqlite | supabase | firebase` no `.env`.

## 5. Comparativo Técnico para o Comprador

| Critério | SQLite (Local/Embed) | Supabase (Postgres) | Firebase (Firestore) |
|---|---|---|---|
| **Custo Inicial** | Grátis (0 USD) | Tier Gratuito generoso | Tier Gratuito (Spark) |
| **Modelo de Dados** | Relacional SQL | Relacional Postgres (SQL/RLS) | NoSQL Hierárquico de Documentos |
| **Escala** | Até 100k requisições/dia | Milhões de registros | Bilhões de operações globais |
| **Lock-in** | Zero | Baixo (Postgres padrão) | Médio (Ecossistema Google) |
| **Deploy Recomendado** | VPS / Docker / Cloud Run | Vercel + Supabase Cloud | GCP / Firebase Hosting |

## 6. Consequências

- O comprador troca o backend inteiro modificando apenas uma linha no `.env`.
- Todos os endpoints da API (Agentes, Aprovações, Logs de Auditoria, Usuários) operam sem qualquer alteração de código.
