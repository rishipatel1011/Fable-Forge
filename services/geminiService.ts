
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Chapter, Story } from "../types";

// Initialize strictly according to guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Utility to extract clean JSON from potentially markdown-wrapped strings
 */
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
    contents: `Create an immersive, long-form 5-chapter ${genre} story with a ${tone} tone based on: "${prompt}". 
    The output must be a valid JSON object. 
    Each chapter must be lengthy (at least 3-4 paragraphs) and highly descriptive.
    
    Structure:
    {
      "title": "Epic Story Title",
      "summary": "Compelling one-sentence hook",
      "chapters": [
        { 
          "title": "Chapter Name", 
          "content": "Extremely detailed and lengthy narrative content with rich world-building...", 
          "imagePrompt": "A hyper-realistic cinematic photograph, shot on 35mm lens, 8k resolution, detailed textures, natural lighting..." 
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
            maxItems: 5,
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

  if (!response.text) throw new Error("The forge returned an empty script.");

  const storyData = extractJson(response.text);
  return {
    ...storyData,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    genre
  };
};

export const generateChapterImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `Hyper-realistic, photorealistic cinematic masterpiece: ${prompt}. Professional color grading, depth of field, sharp focus, 8k, highly detailed, realistic skin and environmental textures.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Visual manifestation failed.");
};

export const generateNarration = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this narratively with depth and character: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
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

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
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
