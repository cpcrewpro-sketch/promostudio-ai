import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AdScript {
  slogan: string;
  targetAudience: string;
  scenes: {
    visualDescription: string;
    narration: string;
    duration: number;
  }[];
  keyFeatures: string[];
}

export async function generateAdScript(appTitle: string, appDescription: string, vibe: string): Promise<AdScript> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a professional 30-second advertisement script for an Android app.
      App Title: ${appTitle}
      Description: ${appDescription}
      Desired Vibe: ${vibe}
      
      Instructions:
      - If this is a gaming bot or automation tool, emphasize high win rates, ease of use, and advanced technology.
      - If the description is in Arabic, provide the 'narration' and 'slogan' in Arabic. Otherwise, use English.
      - Ensure the 'visualDescription' provides clear instructions for an editor (e.g. "Zoom into the board", "Overlay showing AI analysis path").`,
    config: {
      systemInstruction: "You are a professional ad agency creative director. Write compelling, high-conversion scripts for Android apps.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["slogan", "targetAudience", "scenes", "keyFeatures"],
        properties: {
          slogan: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          keyFeatures: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["visualDescription", "narration", "duration"],
              properties: {
                visualDescription: { type: Type.STRING, description: "Detailed visual description for an animator" },
                narration: { type: Type.STRING, description: "The voiceover text" },
                duration: { type: Type.NUMBER, description: "Duration in seconds" }
              }
            }
          }
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Could not generate a valid script. Please try again.");
  }
}
