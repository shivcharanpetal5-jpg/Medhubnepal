
import { GoogleGenAI, Type } from "@google/genai";
import { BloodAnalysisResult, UrineAnalysisResult, SkinAnalysisResult, XrayAnalysisResult } from "../types";

const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

export const analyzeBloodSlide = async (base64Image: string): Promise<BloodAnalysisResult> => {
  const apiKey = getApiKey();
  
  const mockResponse: BloodAnalysisResult = {
    bloodGroup: "Unknown",
    confidence: 0,
    antibodies: "Cannot determine without API Key",
    agglutinationDetails: "Please configure a valid API Key to use the AI analysis feature. Returning mock data.",
    recommendation: "Consult a lab technician."
  };

  if (!apiKey) {
    console.warn("No API Key found. Returning mock response.");
    return new Promise(resolve => setTimeout(() => resolve(mockResponse), 2000));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const schema = {
      type: Type.OBJECT,
      properties: {
        bloodGroup: { type: Type.STRING, description: "The probable blood group (e.g., A+, B-, O+)." },
        confidence: { type: Type.NUMBER, description: "Confidence level between 0 and 100." },
        antibodies: { type: Type.STRING, description: "Likely antibodies present in plasma based on the group." },
        agglutinationDetails: { type: Type.STRING, description: "Description of visual clumping patterns." },
        recommendation: { type: Type.STRING, description: "Safety recommendation." }
      },
      required: ["bloodGroup", "confidence", "antibodies", "agglutinationDetails", "recommendation"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `Analyze this image of a blood typing slide test. Identify clumping patterns. Deduce blood group. Educational only.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");
    return JSON.parse(text) as BloodAnalysisResult;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return { ...mockResponse, agglutinationDetails: "Analysis failed. Please try again." };
  }
};

export const analyzeUrineImage = async (base64Image: string, type: 'standard' | 'pregnancy'): Promise<UrineAnalysisResult[]> => {
  const apiKey = getApiKey();
  
  const mockResponse: UrineAnalysisResult[] = [{
    parameter: "General",
    finding: "Unavailable",
    interpretation: "API Key missing",
    severity: "Normal",
    advice: "Check API configuration."
  }];

  if (!apiKey) return new Promise(resolve => setTimeout(() => resolve(mockResponse), 2000));

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Schema matches the UrineAnalysisResult interface
    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          parameter: { type: Type.STRING },
          finding: { type: Type.STRING },
          interpretation: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["Normal", "Trace", "Moderate", "High", "Positive", "Negative", "Invalid"] },
          advice: { type: Type.STRING }
        },
        required: ["parameter", "finding", "interpretation", "severity", "advice"]
      }
    };

    let prompt = "";
    if (type === 'pregnancy') {
      prompt = `Analyze this image of a pregnancy test strip (HCG urine test). 
      Look for the Control Line (C) and Test Line (T).
      If 2 lines are visible => Positive.
      If 1 line (C only) => Negative.
      If no lines or T only => Invalid.
      Return a single result item with parameter="HCG Pregnancy Test", finding="Positive/Negative", interpretation="Pregnant/Not Pregnant", severity="Positive/Negative/Invalid".`;
    } else {
      prompt = `Analyze this urine dipstick or lab report. Identify parameters like Glucose, Protein, pH, Leukocytes. Compare colors. Return list of findings. Educational only.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as UrineAnalysisResult[];

  } catch (error) {
    console.error("Urine analysis failed:", error);
    return [{ parameter: "Error", finding: "Failed", interpretation: "Could not process image.", severity: "Normal", advice: "Try again." }];
  }
};

export const analyzeSkinImage = async (base64Image: string): Promise<SkinAnalysisResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const schema = {
      type: Type.OBJECT,
      properties: {
        condition: { type: Type.STRING, description: "Name of the potential skin condition (e.g. Eczema, Ringworm, Acne)." },
        probability: { type: Type.NUMBER, description: "Confidence score 0-100." },
        description: { type: Type.STRING, description: "Visual description of the rash/lesion." },
        severity: { type: Type.STRING, enum: ["Mild", "Moderate", "Severe", "Unknown"] },
        recommendation: { type: Type.STRING, description: "Home care advice or 'See Doctor'." }
      },
      required: ["condition", "probability", "description", "severity", "recommendation"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze this skin image. Identify potential dermatological conditions. Educational use only. Be cautious." }
        ]
      },
      config: { responseMimeType: "application/json", responseSchema: schema }
    });

    return JSON.parse(response.text!) as SkinAnalysisResult;
  } catch (e) {
    console.error(e);
    return { condition: "Error", probability: 0, description: "Analysis failed", severity: "Unknown", recommendation: "Consult a doctor." };
  }
};

export const analyzeXrayImage = async (base64Image: string): Promise<XrayAnalysisResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const schema = {
      type: Type.OBJECT,
      properties: {
        bodyPart: { type: Type.STRING, description: "The body part shown (e.g. Chest, Hand, Knee)." },
        findings: { type: Type.STRING, description: "Key visual findings (e.g. clear lungs, hairline fracture)." },
        impression: { type: Type.STRING, description: "Educational summary." },
        abnormalityDetected: { type: Type.BOOLEAN },
        advice: { type: Type.STRING }
      },
      required: ["bodyPart", "findings", "impression", "abnormalityDetected", "advice"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze this medical X-ray image. Identify the body part and any obvious abnormalities (fractures, opacity). Educational only." }
        ]
      },
      config: { responseMimeType: "application/json", responseSchema: schema }
    });

    return JSON.parse(response.text!) as XrayAnalysisResult;
  } catch (e) {
    console.error(e);
    return { bodyPart: "Unknown", findings: "Analysis failed", impression: "Error", abnormalityDetected: false, advice: "Consult a radiologist." };
  }
};
