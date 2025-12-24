
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateProfessionalAvatar = async (
  name: string,
  roles: string[],
  base64Image: string | null,
  customPrompt?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const roleString = roles.join(', ');
  
  // Enhanced prompt to include Name as Logo and Roles as typography
  let prompt = `Create a professional, high-quality profile picture/personal branding asset for "${name}". 
    The person's name "${name}" should be included as a stylish, minimalist, modern typography logo or watermark in a clean corner. 
    The roles "${roleString}" should be listed elegantly near the name or at the bottom using professional fonts.
    The overall aesthetic should be like a high-end corporate headshot or a sleek tech-startup team profile. 
    Ensure cinematic lighting and a professional modern office or abstract gradient background.`;
  
  if (customPrompt) {
    prompt += ` Additional style instruction: ${customPrompt}`;
  }

  const contents: any = {
    parts: [{ text: prompt }]
  };

  if (base64Image) {
    // Transform existing photo but add the branding elements
    contents.parts.unshift({
      inlineData: {
        data: base64Image.split(',')[1],
        mimeType: 'image/png'
      }
    });
    prompt = `Transform this photo into a professional branded profile image for "${name}". 
      Maintain the person's facial identity but enhance attire to professional wear.
      CRITICAL: Overlay the name "${name}" as a sleek minimalist logo in one of the corners.
      CRITICAL: Include the professional roles "${roleString}" as elegant, readable typography below or near the name.
      Style: Modern, professional, clean. High resolution. ${customPrompt || ''}`;
    contents.parts[contents.parts.length - 1].text = prompt;
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) throw new Error("No image data returned from API");
    return imageUrl;
  } catch (error: any) {
    console.error("Gemini Image Error:", error);
    throw error;
  }
};

export const editImageWithPrompt = async (
  base64Image: string,
  editPrompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png'
            }
          },
          { text: editPrompt }
        ]
      },
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) throw new Error("No image data returned from API");
    return imageUrl;
  } catch (error: any) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};
