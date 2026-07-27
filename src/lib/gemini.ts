import { GoogleGenAI } from "@google/genai";
import { logger } from "./logger";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const models = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
  flashLite: "gemini-3.1-flash-lite-preview",
  flashImage: "gemini-3.1-flash-image-preview",
  flashAudio: "gemini-2.5-flash-native-audio-preview",
  tts: "gemini-2.5-flash-preview-tts",
} as const;

export async function generateText(prompt: string, model: string = models.flash): Promise<string> {
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text ?? "";
  } catch (error) {
    logger.error("gemini", "Erro ao gerar texto", { model, error });
    throw error;
  }
}

export async function generateStream(
  prompt: string,
  model: string = models.flash,
  systemInstruction?: string,
) {
  try {
    return await ai.models.generateContentStream({
      model,
      config: systemInstruction ? { systemInstruction } : undefined,
      contents: prompt,
    });
  } catch (error) {
    logger.error("gemini", "Erro ao gerar stream", { model, error });
    throw error;
  }
}

export async function generateStreamWithHistory(
  history: Array<{ role: "user" | "model"; parts: string }>,
  newMessage: string,
  model: string = models.flash,
) {
  try {
    const contents = [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
      { role: "user" as const, parts: [{ text: newMessage }] },
    ];
    return await ai.models.generateContentStream({ model, contents });
  } catch (error) {
    logger.error("gemini", "Erro ao gerar stream com histórico", { model, error });
    throw error;
  }
}

export async function generateWithThinking(prompt: string, model: string = models.pro) {
  try {
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
  } catch (error) {
    logger.error("gemini", "Erro em Thinking Mode", { model, error });
    throw error;
  }
}

export async function generateSpeech(text: string): Promise<string> {
  try {
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
  try {
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
  } catch (error) {
    logger.error("gemini", "Erro no processamento multimodal", { model, error });
    throw error;
  }
}
