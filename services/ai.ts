import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePersonalizedMessage = async (
  clientName: string,
  companyName: string,
  offer: string,
  style: 'friendly' | 'formal' | 'funny' = 'friendly'
): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key missing, returning fallback message.");
    return `Olá ${clientName}, feliz aniversário! A ${companyName} tem um presente para você: ${offer}.`;
  }

  try {
    const prompt = `
      Crie uma mensagem curta de aniversário (máximo 250 caracteres) para um cliente chamado "${clientName}".
      O objetivo é reativar este cliente inativo.
      Empresa: ${companyName}
      Oferta: ${offer}
      Estilo: ${style} (em Português do Brasil).
      Não use hashtags. Seja direto mas acolhedor.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("AI Generation Error:", error);
    return `Olá ${clientName}, parabéns! A ${companyName} preparou: ${offer} para você hoje.`;
  }
};