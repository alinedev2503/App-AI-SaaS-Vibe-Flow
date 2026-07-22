# Style Guide

## TypeScript & React

### Component Structure
```tsx
// 1. Imports (grouped: external → internal)
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "../contexts/LanguageContext";

// 2. Types/interfaces inline above component (not in separate file unless shared)
interface Props {
  title: string;
}

// 3. Component as default export
export default function MyComponent({ title }: Props) {
  const { t } = useLanguage();
  // state, effects, handlers
  return <div>{title}</div>;
}
```

### Naming Conventions
| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `AgentHub`, `CommandCenter` |
| Functions | camelCase | `handleSendMessage`, `toggleAgentStatus` |
| Interfaces | PascalCase | `Agent`, `Message` |
| Props | PascalCase | `ButtonProps` |
| CSS classes | kebab-case in strings | `"glass-card"` |
| Files (pages) | PascalCase | `AgentHub.tsx` |
| Files (lib) | camelCase | `gemini.ts`, `mcp.ts` |

### State Management
- Local state with `useState` for component-specific data
- Context (`ThemeContext`, `LanguageContext`) for global preferences
- No external state library (Redux, Zustand) — keep it simple

### i18n Strings
- All user-facing text goes in locale files (`src/locales/`)
- Access via `t('section.key')` — dot notation matching locale object structure
- Never hardcode strings in JSX:

```tsx
// ❌ Bad
<h2>Dashboard</h2>

// ✅ Good
<h2>{t('dashboard.title')}</h2>
```

### CSS & Tailwind
- Use Tailwind utility classes exclusively
- Reusable card patterns use `cn()` from `@/lib/utils`
- Glassmorphism: `glass-card` component class in `index.css`
- Custom colors via CSS variables in `@theme` / `:root` / `.dark`

### Styling Rules
```tsx
// Conditional classes
className={cn(
  "base-class",
  isActive && "bg-primary text-white",
  !isActive && "text-slate-400"
)}
```

## Project Conventions
- Do **not** add comments to source files
- Format with Prettier (default config)
- One default export per page/component file
- All pages go in `src/pages/`
- All locale keys follow `section.subsection.key` pattern
