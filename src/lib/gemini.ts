import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// The API key is injected by the environment
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const models = {
  // Text models
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
  flashLite: "gemini-3.1-flash-lite-preview",
  
  // Multimodal
  flashImage: "gemini-3.1-flash-image-preview",
  
  // Audio
  flashAudio: "gemini-2.5-flash-native-audio-preview-12-2025",
  tts: "gemini-2.5-flash-preview-tts",
};

export async function generateText(prompt: string, model = models.flash) {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
}

export async function generateStream(prompt: string, model = models.flash) {
  try {
    const response = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
    });
    return response;
  } catch (error) {
    console.error("Error generating stream:", error);
    throw error;
  }
}

export async function generateSpeech(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: models.tts,
      contents: {
        parts: [{ text }]
      },
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Puck" }
          }
        }
      }
    });
    
    // Extract base64 audio
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error("No audio data received");
    
    return audioData;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
}
