# Gemini API — Integration Guide

## Overview
Vibe flow uses **Google GenAI SDK** (`@google/genai`) to interface with Gemini models for agent reasoning, chat, and audio synthesis.

## Models Available

| Model ID | Usage | Endpoint |
|---|---|---|
| `gemini-3-flash-preview` | Default — fast responses, Command Center | `models.flash` |
| `gemini-3.1-pro-preview` | Deep reasoning, Thinking Mode | `models.pro` |
| `gemini-3.1-flash-lite-preview` | Lightweight tasks | `models.flashLite` |
| `gemini-3.1-flash-image-preview` | Vision / multimodal | `models.flashImage` |
| `gemini-2.5-flash-native-audio-preview` | Audio processing | `models.flashAudio` |
| `gemini-2.5-flash-preview-tts` | Text-to-Speech (voice "Puck") | `models.tts` |

## Usage

### Text Generation
```ts
import { generateText, models } from "@/lib/gemini";

const response = await generateText("Your prompt here", models.flash);
```

### Streaming (Command Center)
```ts
import { generateStream, models } from "@/lib/gemini";

const stream = await generateStream("Your prompt", models.flash);
for await (const chunk of stream) {
  // append chunk.text to UI
}
```

### Text-to-Speech
```ts
import { generateSpeech } from "@/lib/gemini";

const audioBase64 = await generateSpeech("Text to speak");
// returns base64-encoded MP3 audio data
```

## Configuration
- **API Key**: Set `GEMINI_API_KEY` in `.env.local` or via AI Studio Secrets panel
- **Client init**: `new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })`
- **Injection**: Vite injects `process.env.GEMINI_API_KEY` at build time via `vite.config.ts`

## Best Practices
- Use streaming (`generateStream`) for real-time chat UX
- Enable Thinking Mode (`models.pro`) for complex reasoning tasks
- TTS uses voice "Puck" at 48kHz fidelity
- Handle errors gracefully with fallback messages in locale files
