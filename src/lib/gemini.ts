import { GoogleGenAI } from "@google/genai";
import { logger } from "./logger";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const models = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
  flashLite: "gemini-3.1-flash-lite-preview",
  flashImage: "gemini-3.1-flash-image-preview",
  flashAudio: "gemini-2.5-flash-native-audio-preview-12-2025",
  tts: "gemini-2.5-flash-preview-tts",
};

export async function generateText(prompt: string, model = models.flash) {
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    logger.error("gemini", "Erro ao gerar texto", { model, error });
    throw error;
  }
}

export async function generateStream(prompt: string, model = models.flash) {
  try {
    const response = await ai.models.generateContentStream({ model, contents: prompt });
    return response;
  } catch (error) {
    logger.error("gemini", "Erro ao gerar stream", { model, error });
    throw error;
  }
}

export async function generateSpeech(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: models.tts,
      contents: { parts: [{ text }] },
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
        },
      },
    });
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error("No audio data received");
    return audioData;
  } catch (error) {
    logger.error("gemini", "Erro ao gerar fala", { text: text.slice(0, 50), error });
    throw error;
  }
}
