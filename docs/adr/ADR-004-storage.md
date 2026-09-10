# ADR-004: Gerenciamento de Armazenamento e Uploads

- **Status:** Aceito
- **Data:** 2026-09-10
- **Decisores:** Arquiteto de Software & Engenheiro DevOps

---

## 1. Contexto

O VibeFlow permite uploads de avatares de agentes, logos para white-label, arquivos de contexto para o MCP Gateway e exportação de relatórios de auditoria.

## 2. Problema

Diferentes compradores terão infraestruturas variadas: desde um servidor VPS simples até buckets no AWS S3, Supabase Storage ou Google Cloud Storage (Firebase).

## 3. Decisão

1. **Camada de Upload Unificada com Multer:**
   - Limite de tamanho de arquivo rigoroso (máximo 5MB por padrão).
   - Validação estrita de tipos MIME (apenas PNG, JPEG, SVG e WebP para imagens; JSON/CSV para contexto).
   - Sanitização de nomes de arquivos para prevenção de Directory Traversal (`path traversal`).
2. **Estratégia Híbrida de Armazenamento:**
   - **Modo Local:** Gravação em `./data/uploads` com rota segura de entrega de estáticos.
   - **Modo Cloud Storage:** Suporte a conectores Supabase Storage Buckets e Firebase Storage Buckets via adapter.

## 4. Consequências

- Segurança contra injeção de arquivos maliciosos e DoS por arquivos gigantes.
- Zero dependência externa para execução inicial e escalabilidade para nuvem quando configurado.
