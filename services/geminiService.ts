
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Chapter, Story } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const cleaned = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleaned);
  }
};

export const generateStoryContent = async (prompt: string, genre: string, tone: string): Promise<Partial<Story>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write an exceptionally long, deep, and immersive 5-chapter ${genre} story with a ${tone} tone based on: "${prompt}". 
    The tone should be sophisticated and realistic, avoiding AI clichés.
    
    Structure your response as JSON:
    {
      "title": "A sophisticated title",
      "summary": "An editorial summary",
      "chapters": [
        { 
          "title": "Chapter Heading", 
          "content": "Provide a very lengthy narrative (300+ words per chapter). Rich prose, complex characters, and visceral descriptions.", 
          "imagePrompt": "A highly specific photorealistic scene. Describe lighting, camera lens (e.g. 35mm f/1.4), weather, and textures. Avoid words like 'fantasy' or 'cartoon'—aim for National Geographic or high-end film stills." 
        }
      ]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          chapters: {
            type: Type.ARRAY,
            minItems: 5,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
              },
              required: ["title", "content", "imagePrompt"]
            }
          }
        },
        required: ["title", "summary", "chapters"]
      }
    }
  });

  if (!response.text) throw new Error("The Digital Archivist encountered a script failure.");
  const storyData = extractJson(response.text);
  return { ...storyData, id: crypto.randomUUID(), createdAt: Date.now(), genre };
};

export const generateChapterImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A hyper-realistic RAW photograph, unedited, high dynamic range, shot on Sony A7R IV, 35mm lens, f/1.8. Scene: ${prompt}. Atmospheric, photorealistic textures, realistic skin, cinematic color grading, natural light, ultra-detailed 8k.` }]
    },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Visual manifestation failed.");
};

export const generateNarration = async (text: string, voiceName: string = 'Kore'): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Narrate this chapter with a professional, human voice, emphasizing realistic emotion and pacing: ${text.substring(0, 1000)}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName } },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Voice synthesis failed.");
  return base64Audio;
};

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number = 24000, numChannels: number = 1): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
