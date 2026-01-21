
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ModelType, Message, Role } from "../types";

export const chatWithGemini = async (
  modelType: ModelType,
  history: Message[],
  systemInstruction: string,
  onChunk: (chunk: string) => void
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Format history for Gemini API
  const contents = history.map(msg => ({
    role: msg.role === Role.USER ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const responseStream = await ai.models.generateContentStream({
      model: modelType,
      contents: contents,
      config: {
        systemInstruction: systemInstruction || "You are a helpful, creative, and professional AI assistant.",
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const chunkText = chunk.text || "";
      fullText += chunkText;
      onChunk(chunkText);
    }
    
    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
