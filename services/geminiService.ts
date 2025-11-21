import { GoogleGenAI } from "@google/genai";
import { Trade } from "../types";

export const analyzeTrades = async (trades: Trade[], balance: number): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "API Key is missing. Please configure your environment.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const tradeSummary = JSON.stringify(trades.slice(-10)); // Analyze last 10 trades to save context

    const prompt = `
      You are a world-class trading mentor at 'Chart Decoders'. 
      Current Account Balance: $${balance}.
      
      Here is a JSON list of the user's recent trades:
      ${tradeSummary}

      Please provide a concise, professional analysis (max 3 paragraphs).
      1. Identify any patterns in winning vs losing trades.
      2. Comment on risk management based on the PnL sizes.
      3. Give one actionable piece of advice to improve profitability.
      
      Keep the tone encouraging but strict regarding discipline.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "An error occurred while analyzing your trades. Please try again later.";
  }
};