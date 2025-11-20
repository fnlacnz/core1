import { GoogleGenAI, Schema, Type } from "@google/genai";
import { Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_ID = 'gemini-2.5-flash';

export const generateDailyPlan = async (
  userContext: string, 
  mood: string
): Promise<Partial<Task>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: `You are the Planner AI of NukeCore. 
      The user feels "${mood}" and their current context is: "${userContext}".
      Generate 3 suggested tasks that balance productivity with wellbeing. 
      Return strictly JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              energy: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              category: { type: Type.STRING }
            },
            required: ["title", "energy", "category"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((item: any, index: number) => ({
      id: `ai-gen-${Date.now()}-${index}`,
      completed: false,
      ...item
    }));
  } catch (error) {
    console.error("AI Planner Error:", error);
    return [];
  }
};

export const getReflectionInsight = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: `Analyze this journal entry and provide a brief, profound philosophical insight (max 20 words) using a sophisticated tone: "${text}"`,
    });
    return response.text || "Reflection connects the dots of experience.";
  } catch (error) {
    return "Silence is sometimes the best answer.";
  }
};
