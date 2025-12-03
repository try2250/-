import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuestions = async (
  topic: string,
  count: number,
  difficulty: string
): Promise<any[]> => {
  try {
    const ai = getClient();
    const prompt = `Generate ${count} ${difficulty} level questions about "${topic}" for middle school students.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING, description: "The question text" },
              difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
              subject: { type: Type.STRING, description: "The subject area (e.g. History, Math)" },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Keywords related to the question" 
              }
            },
            required: ["content", "difficulty", "subject", "tags"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};