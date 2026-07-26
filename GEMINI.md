# GEMINI.md — Guia de Integração com a API Gemini

**Versão:** 1.0.0  
**SDK:** `@google/genai`  
**Última atualização:** Julho 2026

---

## Visão Geral

O VibeFlow usa o **Google GenAI SDK** (`@google/genai`) para toda a inteligência artificial da plataforma: geração de texto, chat com streaming, síntese de voz (TTS), visão computacional e raciocínio avançado (Thinking Mode).

A configuração central está em `src/lib/gemini.ts`.

---

## Modelos Disponíveis

| Constante | Model ID | Uso Recomendado | Notas |
|---|---|---|---|
| `models.flash` | `gemini-3-flash-preview` | Padrão — Command Center | Resposta rápida, uso geral |
| `models.pro` | `gemini-3.1-pro-preview` | Thinking Mode, raciocínio profundo | Mais lento, mais capaz |
| `models.flashLite` | `gemini-3.1-flash-lite-preview` | Tarefas leves, classificação | Menor custo de tokens |
| `models.flashImage` | `gemini-3.1-flash-image-preview` | Visão / multimodal | Aceita imagens no input |
| `models.flashAudio` | `gemini-2.5-flash-native-audio-preview` | Processamento de áudio | Input de áudio |
| `models.tts` | `gemini-2.5-flash-preview-tts` | Text-to-Speech | Voz "Puck", 48kHz |

---

## Configuração

### Variável de Ambiente

```bash
# .env.local
GEMINI_API_KEY=sua_chave_aqui
```

**Como obter:** [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) (gratuito)

### Inicialização do Client

```typescript
// src/lib/gemini.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const models = {
  flash:      "gemini-3-flash-preview",
  pro:        "gemini-3.1-pro-preview",
  flashLite:  "gemini-3.1-flash-lite-preview",
  flashImage: "gemini-3.1-flash-image-preview",
  flashAudio: "gemini-2.5-flash-native-audio-preview",
  tts:        "gemini-2.5-flash-preview-tts",
} as const;
```

**Nota sobre injeção do Vite:** O Vite injeta `process.env.GEMINI_API_KEY` em build time via `define` no `vite.config.ts`. Em runtime no servidor Node.js, é lido diretamente das variáveis de ambiente.

---

## Uso — Geração de Texto

### Resposta Simples (non-streaming)

```typescript
import { generateText, models } from "@/lib/gemini";

const response = await generateText("Resuma os leads do dia em 3 pontos", models.flash);
console.log(response); // string com a resposta completa
```

**Implementação:**
```typescript
export async function generateText(prompt: string, model: string): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });
  return response.text ?? "";
}
```

---

## Uso — Streaming (Command Center)

Para o Command Center, use sempre streaming para exibir respostas progressivamente:

```typescript
import { generateStream, models } from "@/lib/gemini";

const stream = await generateStream("Quais são as tendências de vendas deste mês?", models.flash);

for await (const chunk of stream) {
  if (chunk.text) {
    setMessage(prev => prev + chunk.text); // acumula no state do React
  }
}
```

**Implementação:**
```typescript
export async function generateStream(
  prompt: string,
  model: string,
  systemInstruction?: string,
) {
  return await ai.models.generateContentStream({
    model,
    config: systemInstruction ? { systemInstruction } : undefined,
    contents: prompt,
  });
}
```

### Streaming com histórico de conversa

```typescript
export async function generateStreamWithHistory(
  history: Array<{ role: "user" | "model"; parts: string }>,
  newMessage: string,
  model: string,
) {
  const contents = [
    ...history.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
    { role: "user" as const, parts: [{ text: newMessage }] },
  ];

  return await ai.models.generateContentStream({ model, contents });
}
```

---

## Uso — Thinking Mode (Raciocínio Avançado)

Ativa o raciocínio passo a passo do Gemini Pro. Ideal para análises complexas.

```typescript
import { generateWithThinking, models } from "@/lib/gemini";

const { thinking, response } = await generateWithThinking(
  "Analise os dados de churn do último trimestre e identifique as 3 principais causas",
  models.pro
);

// thinking: string com o processo de raciocínio (visível ao usuário)
// response: string com a resposta final
```

**Implementação:**
```typescript
export async function generateWithThinking(prompt: string, model: string) {
  const response = await ai.models.generateContent({
    model,
    config: {
      thinkingConfig: { includeThoughts: true },
    },
    contents: prompt,
  });

  let thinking = "";
  let finalResponse = "";

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.thought) {
      thinking += part.text ?? "";
    } else {
      finalResponse += part.text ?? "";
    }
  }

  return { thinking, response: finalResponse };
}
```

---

## Uso — Text-to-Speech (TTS)

```typescript
import { generateSpeech } from "@/lib/gemini";

const audioBase64 = await generateSpeech(
  "Olá! Aqui é o VibeFlow. Você tem 3 aprovações pendentes."
);

// Reproduz no navegador via Web Audio API
const audioData = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
const audioBlob = new Blob([audioData], { type: "audio/mp3" });
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
```

**Implementação:**
```typescript
export async function generateSpeech(text: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: models.tts,
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Puck" },
        },
      },
    },
    contents: text,
  });

  const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioData) throw new Error("Nenhum áudio gerado");
  return audioData; // base64 MP3
}
```

---

## Uso — Visão (Multimodal)

```typescript
import { generateFromImage, models } from "@/lib/gemini";

// imageBase64: string base64 de uma imagem PNG/JPEG
const description = await generateFromImage(
  "Descreva os dados neste gráfico",
  imageBase64,
  "image/png",
  models.flashImage,
);
```

**Implementação:**
```typescript
export async function generateFromImage(
  prompt: string,
  imageBase64: string,
  mimeType: "image/png" | "image/jpeg" | "image/webp",
  model: string,
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: prompt },
        ],
      },
    ],
  });
  return response.text ?? "";
}
```

---

## Uso — System Instructions (Persona de Agente)

```typescript
const agentPersona = `Você é Maya, uma especialista em vendas do VibeFlow.
Seu estilo é direto, profissional e baseado em dados.
Fale sempre em português brasileiro.
Nunca invente dados — se não souber, diga que vai verificar.`;

const stream = await generateStream(
  "Quais leads devo priorizar hoje?",
  models.flash,
  agentPersona // system instruction
);
```

---

## Tratamento de Erros

```typescript
import { GoogleGenAIError } from "@google/genai";

async function safeGenerate(prompt: string) {
  try {
    return await generateText(prompt, models.flash);
  } catch (error) {
    if (error instanceof GoogleGenAIError) {
      if (error.status === 429) {
        // Rate limit — aguarda e tenta novamente
        await sleep(2000);
        return await generateText(prompt, models.flash);
      }
      if (error.status === 400) {
        // Input inválido — retorna mensagem de fallback
        return t("errors.aiInvalidInput");
      }
      if (error.status === 403) {
        // API key inválida
        throw new Error(t("errors.aiKeyInvalid"));
      }
    }
    throw error;
  }
}
```

---

## Boas Práticas

| Prática | Detalhe |
|---|---|
| **Use streaming para chat** | `generateStream()` melhora drasticamente a UX |
| **Use Flash por padrão** | `models.flash` é 3x mais rápido que Pro |
| **Reserve Pro para raciocínio** | Use `models.pro` apenas quando Thinking Mode for necessário |
| **System instructions são poderosas** | Defina a persona do agente no system prompt, não no user prompt |
| **Nunca exponha a API key** | Sempre via variável de ambiente, nunca no código |
| **Trate erros graciosamente** | Exiba mensagem de fallback, nunca crash na UI |
| **Cancele streams desnecessários** | Use `AbortController` quando o usuário navegar durante streaming |
| **Cache respostas repetitivas** | Resultados de análises estáticas podem ser cacheados por 5min |

---

## Configuração no AI Studio

1. Acesse [https://aistudio.google.com](https://aistudio.google.com)
2. Crie um projeto e gere uma API key gratuita
3. Adicione `GEMINI_API_KEY` nos **Secrets** do AI Studio (não no código)
4. Para deploy: o AI Studio injeta automaticamente via `process.env`

---

## Limites e Cotas (Tier Gratuito)

| Modelo | RPM | TPM | RPD |
|---|---|---|---|
| Gemini Flash | 15 | 1.000.000 | 1.500 |
| Gemini Pro | 2 | 32.000 | 50 |
| Gemini TTS | 10 | 250.000 | — |

*RPM = Requests Per Minute, TPM = Tokens Per Minute, RPD = Requests Per Day*

Para produção, use o [Tier Pay-as-you-go](https://ai.google.dev/pricing) para limites maiores.
