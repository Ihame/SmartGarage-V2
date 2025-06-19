
import { StructuredDiagnosisReport } from "../types";

// Gemini API related imports and setup are removed as per user request.
// const API_KEY = process.env.API_KEY;
// if (!API_KEY) { ... }
// const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Simulates the virtual diagnosis process.
 * Instead of calling an AI, it returns a predefined structure indicating
 * that the user's information has been collected and an e-mechanic will follow up.
 */
export const getVirtualDiagnosis = async (
  carBrand: string, 
  carModel: string,
  vin: string | undefined, 
  issueDescription: string,
  imageBase64?: string | null, // Still accepted, can be passed to e-mechanic
  language: string = 'en' // Language can be used for tailoring the predefined message if needed
): Promise<StructuredDiagnosisReport | string> => {
  
  // Log the received data for simulation purposes
  console.log("Simulating diagnosis data collection for:", { carBrand, carModel, vin, issueDescription, imageProvided: !!imageBase64, language });

  // Simulate a network delay or processing time
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay

  // Return a predefined "report" structure.
  // This structure informs the user that their data is collected and an e-mechanic will contact them.
  // It uses the StructuredDiagnosisReport interface to minimize changes in the calling component,
  // but the content is static and informational rather than diagnostic.
  
  const summaryText = language === 'rw' ? 
    "Amakuru yanyu y'ikibazo cy'imodoka yakusanyijwe neza. Nyamuneka komeza uuzuze amakuru yanyu yo guhamagarwa kugirango itsinda ryacu ry'aba e-mechanic ribashe kubasuzumira ikibazo." :
    "Your vehicle issue information has been successfully collected. Please proceed to provide your contact details so our e-mechanic team can review your submission.";

  const recommendationAction = language === 'rw' ? "E-Mechanic Azabasubiza" : "E-Mechanic Follow-up";
  const recommendationReasoning = language === 'rw' ?
    "Itsinda ryacu ry'aba e-mechanic ryakiriye amakuru watanze. Bazayasuzuma neza kandi bakwandikire mu gihe cya vuba bakoresheje numero watanze mu ntambwe ikurikira. Bazakubwira ibyerekeye ikibazo cyawe, intambwe zishobora guterwa, n'amafaranga yose ajyanye na serivisi yuzuye yo gusuzuma cyangwa gukora imodoka." :
    "Our e-mechanic team has received your submitted information. They will carefully review it and contact you shortly using the details you provide in the next step. They will discuss your case, potential next steps, and any associated service costs for a full diagnosis or repair.";
  
  const urgencyText = language === 'rw' ? "Bigenwa na e-mechanic" : "To be determined by e-mechanic";
  const imageNotesText = imageBase64 
    ? (language === 'rw' ? "Ifoto yoherejwe kugirango isuzumwe." : "Image submitted for review.")
    : (language === 'rw' ? "Nta foto yoherejwe." : "No image submitted.");
  
  const disclaimerText = language === 'rw' ?
    "Iki ni icyemezo cy'uko amakuru yakusanyijwe. Umu e-mechanic wujuje ibisabwa niwe uzatanga isuzuma nyaryo." :
    "This confirms your information has been collected. A qualified e-mechanic will provide the actual assessment.";

  return {
    potentialProblems: [], // No AI problems, this section will be empty or show a placeholder
    immediateChecks: [], // No AI checks
    professionalRecommendations: [
      {
        action: recommendationAction,
        reasoning: recommendationReasoning,
      }
    ],
    estimatedUrgency: urgencyText,
    summary: summaryText,
    imageAnalysisNotes: imageNotesText,
    disclaimer: disclaimerText,
  };
};
