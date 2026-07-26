# AGENT.md — VibeFlow Agent Architecture

**Versão:** 1.0.0  
**Última atualização:** Julho 2026

> Referência completa para entender como os agentes de IA funcionam no VibeFlow — sua estrutura, modelos, tipos, segurança e integração com MCP.

---

## 1. O que é um Agente no VibeFlow?

Um **agente** é um trabalhador digital autônomo alimentado pelo Google Gemini. Cada agente tem:

- Uma **identidade** (nome, papel, persona)
- Um **escopo de ação** (capacidades e ferramentas MCP)
- Um **ciclo de vida** (status: online, aprendendo, ocioso, pausado)
- **Memória** (contexto de curto e longo prazo)
- **Guardrails** (limites de segurança em 3 camadas)

Os agentes não são chatbots genéricos. São colaboradores especializados, com persona definida, que operam dentro de limites explícitos e submetem ações críticas à aprovação humana.

---

## 2. Modelo de Dados do Agente

```typescript
interface Agent {
  id:           string;           // UUID gerado automaticamente
  name:         string;           // Ex: "Maya", "Atlas", "Raven"
  role:         AgentRole;        // Papel funcional
  persona:      string;           // System prompt / instrução de personalidade
  status:       AgentStatus;      // Estado atual
  capabilities: AgentCapability[]; // O que o agente pode fazer
  model:        GeminiModel;      // Modelo Gemini usado
  memoryLimit:  number;           // Max tokens de contexto (default: 4096)
  created_by:   string;           // userId do criador
  created_at:   string;           // ISO 8601 timestamp
}

type AgentRole =
  | "sales_specialist"
  | "support_specialist"
  | "research_analyst"
  | "data_analyst"
  | "marketing_specialist"
  | "project_coordinator"
  | "custom";

type AgentStatus = "online" | "learning" | "idle" | "paused";

type AgentCapability = "text" | "vision" | "voice" | "web" | "data";

type GeminiModel =
  | "gemini-3-flash-preview"        // Padrão
  | "gemini-3.1-pro-preview"        // Thinking Mode
  | "gemini-3.1-flash-lite-preview" // Tarefas leves
  | "gemini-3.1-flash-image-preview"; // Visão
```

---

## 3. Estrutura Interna de um Agente

```
Agent
├── Identity
│   ├── name:    string              (ex: "Maya")
│   ├── role:    AgentRole           (ex: "sales_specialist")
│   └── persona: string             (system prompt completo)
│
├── Status
│   └── online | learning | idle | paused
│
├── Capabilities
│   ├── text    → Geração e análise de texto (sempre presente)
│   ├── vision  → Análise de imagens (requer flashImage model)
│   ├── voice   → Síntese de voz TTS + reconhecimento de áudio
│   ├── web     → Busca e extração de dados web (via MCP tool)
│   └── data    → Análise de datasets, SQL, CSV (via MCP tool)
│
├── Memory
│   ├── Working Memory    → Contexto da sessão atual (descartado ao fechar)
│   └── Long-term Memory  → Persistido no SQLite (agent_memory table)
│       ├── conversation_history: Message[]
│       ├── user_preferences:     Record<string, unknown>
│       └── learned_facts:        string[]
│
├── Multimodal Controls
│   ├── tts_enabled:     boolean   (habilita síntese de voz)
│   ├── voice_latency:   "low" | "medium" | "high"
│   └── audio_format:    "mp3" | "wav"
│
└── MCP Tool Access
    ├── search_crm        → Consulta registros de CRM (Salesforce/HubSpot)
    ├── update_crm        → Atualiza registros (requer aprovação)
    ├── send_email        → Envia e-mail (requer aprovação)
    ├── query_database    → Executa queries SQL read-only
    ├── web_search        → Busca na web (DuckDuckGo API)
    └── analyze_file      → Analisa CSV/XLSX/PDF
```

---

## 4. Tipos de Agentes

### 4.1 Sales Specialist
```
Papel:         Prospecção, qualificação e fechamento de vendas
Modelo padrão: gemini-3-flash-preview
Capacidades:   text, vision, voice
Ferramentas:   search_crm, update_crm, send_email
Persona:       Focado em ROI, orientado a dados, persuasivo mas honesto
Aprovações:    update_crm → impact: medium | send_email → impact: low
```

### 4.2 Support Specialist
```
Papel:         Suporte ao cliente, resolução de problemas, escalação
Modelo padrão: gemini-3-flash-preview
Capacidades:   text, vision
Ferramentas:   search_crm, query_database
Persona:       Empático, paciente, orientado à solução
Aprovações:    update_crm → impact: high (envolve dados do cliente)
```

### 4.3 Research Analyst
```
Papel:         Inteligência de mercado, análise competitiva, relatórios
Modelo padrão: gemini-3.1-pro-preview (Thinking Mode)
Capacidades:   text, web, data
Ferramentas:   web_search, analyze_file, query_database
Persona:       Analítico, detalhista, baseado em evidências
Aprovações:    Raramente — ações são principalmente leitura
```

### 4.4 Data Analyst
```
Papel:         Análise de datasets, visualizações, insights de negócio
Modelo padrão: gemini-3.1-pro-preview
Capacidades:   text, data
Ferramentas:   query_database, analyze_file
Persona:       Preciso, quantitativo, comunicador claro de números
Aprovações:    query_database com DELETE/UPDATE → impact: critical
```

### 4.5 Marketing Specialist
```
Papel:         Criação de conteúdo, SEO, campanhas, copy
Modelo padrão: gemini-3.1-flash-image-preview
Capacidades:   text, vision, web
Ferramentas:   web_search, analyze_file
Persona:       Criativo, orientado à conversão, voz da marca
Aprovações:    send_email (campanha) → impact: high
```

### 4.6 Project Coordinator
```
Papel:         Gestão de tarefas, acompanhamento de prazos, comunicação
Modelo padrão: gemini-3-flash-preview
Capacidades:   text, voice
Ferramentas:   search_crm, query_database
Persona:       Organizado, proativo, comunicativo
Aprovações:    Atualizações de status → impact: low
```

---

## 5. MCP Gateway — Integração de Ferramentas

O **Model Context Protocol (MCP)** é o protocolo que permite aos agentes usar ferramentas externas de forma segura e padronizada.

### 5.1 Registro de Ferramentas

```typescript
// src/lib/mcp.ts
export const mcpTools: MCPTool[] = [
  {
    name: "search_crm",
    description: "Busca registros no CRM (contatos, leads, oportunidades)",
    parameters: {
      query: { type: "string", required: true },
      entity: { type: "string", enum: ["contact", "lead", "opportunity"] },
      limit: { type: "number", default: 10 },
    },
    impact: "low",
    requiresApproval: false,
  },
  {
    name: "update_crm",
    description: "Atualiza um registro no CRM",
    parameters: {
      id: { type: "string", required: true },
      entity: { type: "string", required: true },
      fields: { type: "object", required: true },
    },
    impact: "medium",
    requiresApproval: true, // → vai para Approval Queue
  },
  {
    name: "send_email",
    description: "Envia um e-mail em nome do agente",
    parameters: {
      to: { type: "string", required: true },
      subject: { type: "string", required: true },
      body: { type: "string", required: true },
    },
    impact: "high",
    requiresApproval: true,
  },
];
```

### 5.2 Execução de Ferramentas

```typescript
export async function executeTool(
  toolName: string,
  params: Record<string, unknown>,
  agentId: string,
): Promise<ToolResult> {
  const tool = mcpTools.find(t => t.name === toolName);
  if (!tool) throw new Error(`Tool '${toolName}' not found`);

  // Ações que requerem aprovação → cria entrada na Approval Queue
  if (tool.requiresApproval) {
    await createApproval({ agentId, toolName, params, impact: tool.impact });
    return { status: "pending_approval", message: "Aguardando aprovação humana" };
  }

  // Executa a ferramenta
  const result = await callExternalAPI(tool, params);

  // Log no audit trail
  await createAuditLog({
    agentId,
    action_type: "tool_called",
    description: `${toolName} executado`,
    metadata: { params, result },
    status: "success",
  });

  return result;
}
```

---

## 6. Ciclo de Vida de uma Ação de Agente

```
1. Usuário envia mensagem no Command Center
         ↓
2. Agente processa com Gemini (streaming)
         ↓
3. Gemini identifica necessidade de ferramenta
         ↓
4. mcp.ts: executeTool(toolName, params)
         ↓
5. Impacto da ferramenta?
   ├── low/none   → Executa imediatamente
   └── medium/high/critical → Cria Approval
              ↓
6. Approval Queue notifica admins
              ↓
7. Admin aprova ou rejeita
              ↓
8. Agente recebe callback e age conforme
         ↓
9. Audit log gerado automaticamente
```

---

## 7. Arquitetura de Segurança dos Agentes

### Camada 1 — Regras Determinísticas
```typescript
// Regras fixas e imutáveis
const HARD_RULES = {
  maxTokensPerRequest: 8192,
  blockedCommands: ["DROP TABLE", "DELETE FROM users", "rm -rf"],
  allowedDomains: ["salesforce.com", "hubspot.com", "internal.vibeflow.ai"],
  rateLimit: { requestsPerMinute: 20 },
};
```

### Camada 2 — Detecção de Anomalias (ML)
- Frequência incomum de chamadas a ferramentas
- Acesso a dados fora do contexto esperado do agente
- Padrões de comportamento que desviam da baseline histórica

### Camada 3 — Firewall Semântico (LLM-based)
- Detecção de prompt injection em conteúdo de entrada
- Detecção de jailbreak attempts
- Análise de intenção antes de executar ações críticas

### Human-in-the-Loop (Aprovação Obrigatória)
```
impact: low      → Executa automaticamente + audit log
impact: medium   → Opcional: espera aprovação (configurável)
impact: high     → Sempre espera aprovação humana
impact: critical → Sempre espera aprovação + notificação imediata
```

---

## 8. Configurando um Agente

### Via API

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maya",
    "role": "sales_specialist",
    "persona": "Você é Maya, especialista em vendas B2B SaaS. Foque em ROI e tempo de fechamento. Nunca invente dados.",
    "capabilities": ["text", "vision", "voice"],
    "model": "gemini-3-flash-preview",
    "memoryLimit": 8192
  }'
```

### Via Agent Hub (UI)

1. Acesse `/agents`
2. Clique em **Novo Agente**
3. Preencha: nome, papel, persona, capacidades
4. Selecione o modelo Gemini
5. Configure as ferramentas MCP disponíveis
6. Clique em **Criar e Iniciar**

---

## 9. Monitoramento de Agentes

| Métrica | Como ver | Frequência |
|---|---|---|
| Status atual | Dashboard → Matriz de Agentes | Tempo real |
| Ações recentes | Audit Logs → filtrar por agente | Histórico |
| Aprovações pendentes | Approval Queue | Tempo real |
| Uso de tokens | Dashboard → Analytics (fase 3) | Diário |
| Taxa de erros | Audit Logs → filtrar `status: failed` | Sob demanda |
