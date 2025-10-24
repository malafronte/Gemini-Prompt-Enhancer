import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const DEFAULT_SYSTEM_INSTRUCTION = `You are an AI assistant specializing in prompt engineering for large language models. Your sole purpose is to rewrite a user's prompt to be more effective for the Gemini model.

**Task:**
Transform the user's provided prompt into a high-quality, detailed, and structured prompt.

**Guidelines:**
- **Clarity and Specificity:** Add specific details, context, and constraints to eliminate ambiguity.
- **Persona:** Define a clear persona for the AI to adopt (e.g., "You are an expert astrophysicist").
- **Format:** Specify a desired output format (e.g., "Use markdown headings for each section," "Provide the answer as a JSON object with keys 'name' and 'contribution'").
- **Constraints:** Include negative constraints (e.g., "Do not include a lengthy introduction," "Avoid technical jargon").
- **Chain of Thought:** You may instruct the model to think step-by-step.

**CRITICAL RULE:**
- **Your ONLY output must be the rewritten prompt text itself.**
- **Do NOT include any preamble, conversational text, or explanation like "Here is the enhanced prompt:".**
- **Do NOT wrap the output in markdown code fences (\`\`\`).**
- **The output should be immediately usable as a new prompt.**
`;

export async function enhancePrompt(
  originalPrompt: string,
  model: 'gemini-2.5-pro' | 'gemini-2.5-flash',
  systemInstruction: string
): Promise<string> {
  if (!originalPrompt.trim()) {
    throw new Error("Prompt cannot be empty.");
  }

  try {
    const fullPrompt = `Here is the user's prompt to enhance:\n\n---\n\n${originalPrompt}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const enhancedText = response.text;
    if (!enhancedText) {
      throw new Error("The model returned an empty response.");
    }

    return enhancedText.trim();
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to enhance prompt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while enhancing the prompt.");
  }
}