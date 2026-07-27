import { GoogleGenAI } from "@google/genai";
import { logger } from "./logger";

function getApiKey(): string {
  if (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("vibeflow_gemini_api_key");
    if (saved) return saved;
  }
  return "";
}

export const models = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
  flashLite: "gemini-3.1-flash-lite-preview",
  flashImage: "gemini-3.1-flash-image-preview",
  flashAudio: "gemini-2.5-flash-native-audio-preview",
  tts: "gemini-2.5-flash-preview-tts",
} as const;

function getClient() {
  const key = getApiKey();
  return key ? new GoogleGenAI({ apiKey: key }) : null;
}

export async function generateText(prompt: string, model: string = models.flash): Promise<string> {
  const client = getClient();
  if (!client) {
    logger.warn("gemini", "GEMINI_API_KEY não encontrada. Usando modo de demonstração.");
    return `[Modo Demonstração VibeFlow] Recebi sua solicitação: "${prompt.slice(0, 80)}...". Para habilitar respostas em tempo real da IA Gemini, adicione sua GEMINI_API_KEY no arquivo .env.local ou na página de Configurações.`;
  }

  try {
    const response = await client.models.generateContent({ model, contents: prompt });
    return response.text ?? "";
  } catch (error) {
    logger.error("gemini", "Erro ao gerar texto", { model, error });
    return `[VibeFlow Demo] Resposta para: "${prompt}". (Para usar respostas completas via Gemini, verifique sua chave de API nas Configurações).`;
  }
}

export async function* generateStream(
  prompt: string,
  model: string = models.flash,
  systemInstruction?: string,
) {
  const client = getClient();
  if (!client) {
    const demoResponse = `[Modo Demonstração VibeFlow]\n\nRecebi sua mensagem: "${prompt}".\n\nEste aplicativo está em modo de demonstração. O código-fonte está 100% pronto! Para ativar o atendimento em tempo real via IA, basta configurar sua chave em .env.local ou no painel de Configurações.`;
    const chunks = demoResponse.split(" ");
    for (const chunk of chunks) {
      await new Promise(r => setTimeout(r, 60));
      yield { text: chunk + " " };
    }
    return;
  }

  try {
    const stream = await client.models.generateContentStream({
      model,
      config: systemInstruction ? { systemInstruction } : undefined,
      contents: prompt,
    });
    for await (const chunk of stream) {
      yield chunk;
    }
  } catch (error) {
    logger.error("gemini", "Erro no stream", { model, error });
    yield { text: `[Erro no Gemini API] Verifique sua chave de API ou conexão.` };
  }
}

export async function* generateStreamWithHistory(
  history: Array<{ role: "user" | "model"; parts: string }>,
  newMessage: string,
  model: string = models.flash,
) {
  const client = getClient();
  if (!client) {
    const demoResponse = `[Modo Demonstração VibeFlow]\n\nRecebi seu contexto de conversa com ${history.length} mensagens e a nova instrução: "${newMessage}".\n\nPara ativar o raciocínio real via Gemini, adicione sua chave de API no arquivo .env.local.`;
    const chunks = demoResponse.split(" ");
    for (const chunk of chunks) {
      await new Promise(r => setTimeout(r, 60));
      yield { text: chunk + " " };
    }
    return;
  }

  try {
    const contents = [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
      { role: "user" as const, parts: [{ text: newMessage }] },
    ];
    const stream = await client.models.generateContentStream({ model, contents });
    for await (const chunk of stream) {
      yield chunk;
    }
  } catch (error) {
    logger.error("gemini", "Erro no stream com histórico", { model, error });
    yield { text: `[Erro no Gemini API] Verifique se sua chave está válida.` };
  }
}

export async function generateWithThinking(prompt: string, model: string = models.pro) {
  const client = getClient();
  if (!client) {
    return {
      thinking: "1. Analisando entrada do usuário em modo de demonstração...\n2. Verificando estrutura de regras de negócio...\n3. Gerando recomendação de ação segura para aprovação...",
      response: `[Modo Demonstração Thinking Mode] Análise concluída para: "${prompt}". Para ver o raciocínio real do Gemini Pro, adicione sua GEMINI_API_KEY.`,
    };
  }

  try {
    const response = await client.models.generateContent({
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
  } catch (error) {
    logger.error("gemini", "Erro em Thinking Mode", { model, error });
    return {
      thinking: "Erro ao consultar API do Gemini.",
      response: "Não foi possível concluir o raciocínio. Verifique sua chave de API.",
    };
  }
}

export async function generateSpeech(text: string): Promise<string> {
  const client = getClient();
  if (!client) {
    throw new Error("Adicione sua GEMINI_API_KEY para utilizar síntese de voz (TTS).");
  }

  try {
    const response = await client.models.generateContent({
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
    return audioData;
  } catch (error) {
    logger.error("gemini", "Erro ao gerar fala", { text: text.slice(0, 50), error });
    throw error;
  }
}

export async function generateFromImage(
  prompt: string,
  imageBase64: string,
  mimeType: "image/png" | "image/jpeg" | "image/webp" = "image/png",
  model: string = models.flashImage,
): Promise<string> {
  const client = getClient();
  if (!client) {
    return `[Modo Demonstração Visão] Imagem recebida com sucesso. Para analisar o conteúdo visual da imagem via Gemini Vision, adicione sua GEMINI_API_KEY.`;
  }

  try {
    const response = await client.models.generateContent({
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
  } catch (error) {
    logger.error("gemini", "Erro no processamento multimodal", { model, error });
    throw error;
  }
}
