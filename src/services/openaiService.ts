
import { PrescriptionInfo } from "@/components/PrescriptionResult";
import { toast } from "sonner";

export async function analyzePrescription(
  image: File,
  apiKey: string,
  language: string = "english"
): Promise<PrescriptionInfo> {
  try {
    // Convert the image to base64
    const base64Image = await fileToBase64(image);

    // Prepare the API request
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              `You are a precise medical prescription analyzer. Extract detailed information from images of prescriptions. Include medications, dosage, frequency, duration, special instructions, doctor's name, patient's name, patient's age, patient's gender, patient's disease or diagnosis when visible, and date when visible. Also provide a brief explanation of what the diagnosis means in layman's terms and clear instructions on how to take the prescribed medications properly. Format the response as structured JSON that can be parsed by JavaScript. ${language === "hindi" ? "Provide all text output in Hindi language." : "Provide all text output in English language."} Focus on accuracy and completeness.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this prescription image and extract all relevant information. Return the results in JSON format with the following structure: { medications: string[], dosage: string, frequency: string, duration: string, specialInstructions: string, doctorName: string, patientName: string, patientAge: string, patientGender: string, patientDisease: string, diagnosisExplanation: string, medicationInstructions: string, date: string, rawText: string }. For diagnosisExplanation, provide a brief, easy-to-understand explanation of what the diagnosis means. For medicationInstructions, provide clear instructions on how to take the medications properly, including any relevant precautions. ${language === "hindi" ? "Provide all text fields in Hindi language." : "Provide all text fields in English language."}`,
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message ||
          `API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    
    // Parse the response content which should be JSON
    let parsedContent: PrescriptionInfo;
    try {
      // The API response contains the assistant's message with JSON content
      const content = data.choices[0].message.content;
      
      // Try to extract JSON if it's wrapped in backticks
      let jsonContent = content;
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonContent = jsonMatch[1];
      }
      
      parsedContent = JSON.parse(jsonContent);
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error);
      // If JSON parsing fails, provide a fallback using the raw text
      parsedContent = {
        rawText: data.choices[0].message.content,
      };
    }

    return parsedContent;
  } catch (error) {
    console.error("Error analyzing prescription:", error);
    toast.error("Failed to analyze prescription. Please try again.");
    throw error;
  }
}

// Helper function to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}