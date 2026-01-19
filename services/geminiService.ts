import { GoogleGenAI, Type } from "@google/genai";
import { APIResponse, SWFData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchSovereignWealthFunds = async (country: string): Promise<APIResponse> => {
  try {
    const model = "gemini-3-flash-preview";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `Find detailed information about the Sovereign Wealth Funds (SWFs) for ${country}. 
      Use Google Search to find the most recent Assets Under Management (AUM) figures and their latest sector allocation breakdowns.
      
      Specifically, look for the percentage holdings in major sectors like Technology, Financials, Real Estate, Energy, Healthcare, Transportation, Industrials, etc.
      
      Return the data in a strict JSON format matching the schema provided. 
      Convert all asset values to Billions of USD.
      If there are multiple funds, list them all.
      If exact sector percentages are not available, provide your best estimate based on their known major investments or strategic focus (e.g. "Oil & Gas": 80% for a commodity fund).
      If the country has no major SWFs, provide an empty funds array and a summary explaining this.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            country: { type: Type.STRING },
            summary: { type: Type.STRING, description: "A 2-3 sentence summary of the sovereign wealth landscape in this country." },
            currency: { type: Type.STRING, description: "The currency code used for reporting if not USD, generally USD for this report." },
            funds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  assets_in_billions: { type: Type.NUMBER, description: "Assets under management in Billions USD" },
                  inception_year: { type: Type.STRING },
                  description: { type: Type.STRING, description: "Brief description of the fund's source of wealth (e.g., Oil, Non-commodity)" },
                  sector_allocations: {
                    type: Type.ARRAY,
                    description: "List of top sector allocations with percentages.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        sector: { type: Type.STRING, description: "Name of the sector (e.g. Technology, Healthcare)" },
                        percentage: { type: Type.NUMBER, description: "Percentage of portfolio (0-100)" }
                      },
                      required: ["sector", "percentage"]
                    }
                  }
                },
                required: ["name", "assets_in_billions", "inception_year", "description", "sector_allocations"]
              }
            }
          },
          required: ["country", "summary", "funds"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const parsedData: SWFData = JSON.parse(text);
    
    // Extract grounding metadata safely
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as any || null;

    return {
      data: parsedData,
      groundingMetadata: groundingMetadata
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};