import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, DietPlan } from '../types';

// Ensure API key is present
const apiKey = process.env.API_KEY || ''; 
// NOTE: In a real production app, never expose keys in client code without a proxy.
// For this demo environment, we assume process.env.API_KEY is injected safely.

const ai = new GoogleGenAI({ apiKey });

export const geminiService = {
  /**
   * Generates a personalized diet plan based on user profile.
   */
  generateDietPlan: async (profile: UserProfile): Promise<DietPlan> => {
    if (!apiKey) throw new Error("API Key missing");

    const prompt = `
      Create a detailed daily diet plan for a person with the following profile:
      Age: ${profile.age}, Gender: ${profile.gender}, Height: ${profile.height}cm, Weight: ${profile.weight}kg.
      Goal: ${profile.goal}.
      Diet Preference: ${profile.dietPreference}.
      Allergies: ${profile.allergies.join(', ') || 'None'}.
      Level: ${profile.level}.
      
      Return a JSON object with breakfast, lunch, snack, dinner details, total calories, and total protein.
      Ensure the meals are culturally appropriate based on the diet preference (especially if Indian).
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        breakfast: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        },
        lunch: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        },
        snack: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        },
        dinner: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        },
        totalCalories: { type: Type.NUMBER },
        totalProtein: { type: Type.NUMBER }
      }
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema
        }
      });
      
      if (response.text) {
        return JSON.parse(response.text) as DietPlan;
      }
      throw new Error("Empty response from AI");
    } catch (error) {
      console.error("AI Generation Error", error);
      throw error;
    }
  },

  /**
   * Checks text for violent or inappropriate content.
   */
  checkContentSafety: async (text: string): Promise<boolean> => {
     if (!apiKey) return true; // Fail open if no key for demo purposes
     
     const prompt = `
       Analyze the following text for violent, threatening, or extremely offensive content.
       Text: "${text}"
       
       Respond with JSON: { "isSafe": boolean, "reason": string }
     `;

      const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        isSafe: { type: Type.BOOLEAN },
        reason: { type: Type.STRING }
      }
    };

     try {
       const response = await ai.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: prompt,
         config: {
           responseMimeType: 'application/json',
           responseSchema: responseSchema
         }
       });

       if (response.text) {
         const result = JSON.parse(response.text);
         return result.isSafe;
       }
       return true;
     } catch (e) {
       console.error("Moderation check failed", e);
       return true; // Allow if check fails to avoid blocking legitimate users on error
     }
  },

  /**
   * Ask for advice
   */
  getFitnessAdvice: async (query: string): Promise<string> => {
     if (!apiKey) return "AI services are currently unavailable.";

     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a helpful, encouraging, and knowledgeable fitness coach named NutriFit AI. Answer this user question briefly and helpfully: ${query}`
     });
     
     return response.text || "I couldn't generate a response.";
  }
};
