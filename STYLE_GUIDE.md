# VibeFlow — Style Guide

**Versão:** 1.0.0  
**Última atualização:** Julho 2026

> Este guia é a lei. Consistência é o maior presente que um developer pode dar para o próximo que ler seu código.

---

## 1. TypeScript & React

### 1.1 Estrutura de Componente

```tsx
// ─── 1. Imports externos (React, libs de terceiros) ───────────────────
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

// ─── 2. Imports internos (contexts, lib, components) ──────────────────
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

// ─── 3. Tipos/Interfaces (acima do componente, não em arquivo separado,
//         a menos que sejam compartilhados por múltiplos arquivos) ──────
interface Agent {
  id: string;
  name: string;
  status: "online" | "learning" | "idle" | "paused";
  capabilities: string[];
}

interface AgentCardProps {
  agent: Agent;
  onStatusChange: (id: string, status: Agent["status"]) => void;
  className?: string;
}

// ─── 4. Componente como default export ────────────────────────────────
export default function AgentCard({ agent, onStatusChange, className }: AgentCardProps) {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  // state, effects, handlers — nessa ordem
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // side effects aqui
  }, [agent.id]);

  function handleToggle() {
    setIsExpanded(prev => !prev);
  }

  return (
    <div className={cn("glass-card p-4", className)}>
      <h3>{agent.name}</h3>
    </div>
  );
}
```

### 1.2 Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|---|---|---|
| Componentes React | PascalCase | `AgentHub`, `CommandCenter` |
| Funções utilitárias | camelCase | `formatDate`, `truncateText` |
| Handlers de evento | `handle` + Ação | `handleSendMessage`, `handleStatusChange` |
| Interfaces | PascalCase | `Agent`, `Message`, `User` |
| Props interface | PascalCase + `Props` | `AgentCardProps`, `ButtonProps` |
| Enums / Union types | PascalCase | `"online" \| "idle"` (prefer unions over enums) |
| Arquivos de página | PascalCase | `AgentHub.tsx`, `CommandCenter.tsx` |
| Arquivos de lib | camelCase | `gemini.ts`, `mcp.ts`, `utils.ts` |
| Arquivos de contexto | PascalCase + `Context` | `ThemeContext.tsx` |
| Arquivos CSS | kebab-case | `index.css` |
| Variáveis CSS | `--color-nome` | `--color-primary`, `--color-bg` |
| Classes CSS customizadas | kebab-case | `glass-card`, `status-badge` |

### 1.3 Estado e Side Effects

```tsx
// ✅ Estado local para dados específicos do componente
const [isLoading, setIsLoading] = useState(false);
const [agents, setAgents] = useState<Agent[]>([]);

// ✅ Context para estado global (tema, idioma, toast)
const { t } = useLanguage();
const { theme, toggleTheme } = useTheme();

// ❌ Nunca use Redux ou Zustand sem aprovação da equipe
// A complexidade atual não justifica estado externo global
```

### 1.4 Async & Loading States

```tsx
// ✅ Padrão para operações assíncronas
const [state, setState] = useState<{
  data: Agent[] | null;
  isLoading: boolean;
  error: string | null;
}>({ data: null, isLoading: false, error: null });

async function fetchAgents() {
  setState(prev => ({ ...prev, isLoading: true, error: null }));
  try {
    const data = await api.get<Agent[]>("/agents");
    setState({ data, isLoading: false, error: null });
  } catch (err) {
    setState(prev => ({ ...prev, isLoading: false, error: t("errors.generic") }));
  }
}
```

---

## 2. Internacionalização (i18n)

### 2.1 Regra de Ouro

**NUNCA** escreva strings de UI diretamente em JSX. Sempre use `t('chave')`.

```tsx
// ❌ ERRADO — jamais faça isso
<h2>Dashboard</h2>
<button>Salvar</button>
<p>Nenhum agente encontrado</p>

// ✅ CORRETO — sempre via t()
<h2>{t('dashboard.title')}</h2>
<button>{t('common.save')}</button>
<p>{t('agents.empty')}</p>
```

### 2.2 Estrutura das Chaves de Locale

```
section.subsection.key

Exemplos:
  dashboard.title
  dashboard.kpis.activeAgents
  agents.hub.searchPlaceholder
  command.input.placeholder
  audit.filters.dateRange
  common.save
  common.cancel
  errors.unauthorized
  errors.networkTimeout
```

### 2.3 Interpolação

```typescript
// locales/pt-BR.ts
export const ptBR = {
  agents: {
    count: "{{count}} agente{{count, plural, one{} other{s}}} ativos",
  }
};

// Uso no componente
t('agents.count', { count: activeAgents })
```

### 2.4 Adicionando novo idioma

1. Crie `src/locales/fr-FR.ts` copiando a estrutura de `pt-BR.ts`
2. Preencha todas as chaves (sem deixar nenhuma faltando)
3. Adicione `'fr-FR'` ao tipo `Language` em `LanguageContext.tsx`
4. Adicione a opção no selector de idioma em `Settings.tsx`

---

## 3. CSS & Tailwind

### 3.1 Regras

```tsx
// ✅ Tailwind utility classes para tudo
className="flex items-center gap-3 rounded-xl bg-surface p-4"

// ✅ cn() para classes condicionais
className={cn(
  "glass-card p-4 transition-all",
  isActive && "ring-2 ring-primary",
  isDisabled && "opacity-50 pointer-events-none",
  variant === "danger" && "border-red-500/30"
)}

// ❌ Style inline — apenas para valores dinâmicos impossíveis em Tailwind
style={{ backgroundImage: `url(${logoUrl})` }}  // OK — URL dinâmica

// ❌ NUNCA — style inline para layout/cores fixas
style={{ display: "flex", color: "#8c2bee" }}   // ERRADO — use Tailwind
```

### 3.2 Classes CSS Customizadas (index.css)

Adicione classes customizadas reutilizáveis apenas em `src/index.css`:

```css
/* ✅ Classes de padrão reutilizável */
.glass-card {
  @apply relative overflow-hidden rounded-2xl
         bg-white/5 backdrop-blur-xl
         border border-white/10
         transition-all duration-200;
}

.status-badge {
  @apply inline-flex items-center gap-1.5
         rounded-full px-2.5 py-1
         text-xs font-medium;
}
```

### 3.3 Variáveis CSS (Tema)

```css
/* Definidas em @theme no index.css — use essas, não valores hardcoded */
--color-primary     /* Roxo principal */
--color-bg          /* Background da página */
--color-surface     /* Background de cards */
--color-border      /* Bordas */
--color-text        /* Texto principal */
--color-text-muted  /* Texto secundário */
```

### 3.4 Breakpoints Responsivos

```tsx
// Mobile-aware mas desktop-first
className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"

// Sidebar: escondida em mobile
className="hidden lg:flex flex-col ..."
```

---

## 4. Padrões de Componentes

### 4.1 Botões

```tsx
// Botão primário
<button className="btn-primary">
  <Sparkles size={16} />
  {t('common.create')}
</button>

// Botão secundário (ghost)
<button className="btn-ghost">
  {t('common.cancel')}
</button>

// Botão de perigo
<button className="btn-danger">
  {t('common.delete')}
</button>
```

### 4.2 Cards

```tsx
<div className="glass-card p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-medium text-muted">{t('section.label')}</h3>
    <Icon size={18} className="text-primary" />
  </div>
  <p className="text-2xl font-bold">{value}</p>
</div>
```

### 4.3 Status Badges

```tsx
const statusConfig = {
  online:   { label: t('status.online'),   class: "bg-green-500/20 text-green-400" },
  learning: { label: t('status.learning'), class: "bg-blue-500/20 text-blue-400" },
  idle:     { label: t('status.idle'),     class: "bg-slate-500/20 text-slate-400" },
  paused:   { label: t('status.paused'),   class: "bg-yellow-500/20 text-yellow-400" },
};

<span className={cn("status-badge", statusConfig[status].class)}>
  <span className="size-1.5 rounded-full bg-current" />
  {statusConfig[status].label}
</span>
```

---

## 5. Regras da API (servidor)

### 5.1 Estrutura de Response

```typescript
// Sucesso
res.json({ data: payload, message: "Success" });

// Erro
res.status(400).json({
  error: "VALIDATION_ERROR",
  message: "Email inválido",
  details: errors.array(),
});

// Não autorizado
res.status(401).json({ error: "UNAUTHORIZED", message: "Token inválido ou expirado" });
```

### 5.2 Validação de Input

```typescript
// Sempre valide antes de usar
import { body, validationResult } from "express-validator";

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8, max: 128 }),
];

router.post("/login", loginValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: errors.array() });
  }
  // ...
});
```

---

## 6. Convenções Gerais

| Regra | Detalhe |
|---|---|
| **Sem comentários** em arquivos de source | O código deve ser autoexplicativo |
| **Formato** | Prettier com config padrão (2 espaços, aspas duplas) |
| **Uma export default** por arquivo de página/componente | Sem barrel files de componentes |
| **Imports absolutos** | Use `@/` para `src/` (ex: `import { cn } from "@/lib/utils"`) |
| **Sem `any`** | TypeScript strict mode ativo — use `unknown` e type guards |
| **Sem `console.log`** em produção | Use `logger.ts` (Pino) no servidor; remova do frontend |
| **Convenção de commits** | Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:` |
