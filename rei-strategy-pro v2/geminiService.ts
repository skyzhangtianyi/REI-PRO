
import { GoogleGenAI, Type } from "@google/genai";

export const extractPropertyData = async (pastedText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Extract property information from this text (likely from Redfin or Zillow). 
    If a field is missing, estimate a reasonable value based on the location.
    Text: ${pastedText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          address: { type: Type.STRING },
          city: { type: Type.STRING },
          zip: { type: Type.STRING },
          price: { type: Type.NUMBER, description: 'Listing price' },
          rent: { type: Type.NUMBER, description: 'Estimated monthly rent' },
        },
        required: ["address", "city", "zip", "price", "rent"]
      },
    },
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};

export const analyzeRedfinLink = async (url: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Using gemini-3-flash-preview with googleSearch tool to analyze the live link
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find real estate details for this property link: ${url}. 
    I need the current listing price, the city, the zip code, the full address, and a realistic estimated monthly rent for a long-term tenant.`,
    config: {
      tools: [{ googleSearch: {} }],
      // Use systemInstruction to guide output format; grounding text still returns citations
      systemInstruction: "You are a real estate analyst. Always respond with a raw JSON object containing: address, city, zip, price, rent. Do not include markdown code blocks or extra text."
    },
  });

  try {
    const text = response.text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(text);
    // Extract grounding chunks for compliance with Search Grounding rules
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { data, sources };
  } catch (e) {
    console.error("Failed to analyze link", e);
    return null;
  }
};
