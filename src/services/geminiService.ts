
import { StructuredDiagnosisReport } from "../types";

// Gemini API related imports and setup are removed as this service is now simulated.
// const API_KEY = process.env.API_KEY;
// if (!API_KEY) { ... }
// const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Simulates the initial data collection step of virtual diagnosis.
 * Instead of calling an AI, it returns a predefined structure confirming
 * data collection and indicating that an e-mechanic will follow up.
 */
export const getVirtualDiagnosis = async (
  carBrand: string, 
  carModel: string,
  vin: string | undefined, 
  issueDescription: string,
  imageBase64?: string | null, // Image data can still be logged or passed to e-mechanic systems
  language: string = 'en' // Language for tailoring confirmation messages
): Promise<StructuredDiagnosisReport | string> => {
  
  // Log the received data for simulation or backend processing purposes
  console.log("Simulating diagnosis data collection for e-mechanic review:", { carBrand, carModel, vin, issueDescription, imageProvided: !!imageBase64, language });

  // Simulate a network delay or processing time
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5-second delay

  // Return a predefined "report" structure.
  // This informs the user that their data is collected and an e-mechanic will contact them.
  
  const summaryText = language === 'rw' ? 
    "Amakuru yanyu y'ikibazo cy'imodoka yakusanyijwe neza. Nyamuneka komeza uuzuze amakuru yanyu yo guhamagarwa kugirango itsinda ryacu ry'aba e-mechanic ribashe kubasuzumira ikibazo no kubaha raporo irambuye." :
    "Your vehicle issue information has been successfully collected. Please proceed to provide your contact details. Our e-mechanic team will review your submission and contact you for a detailed consultation and full report.";

  const recommendationAction = language === 'rw' ? "E-Mechanic Azabasubiza" : "E-Mechanic Follow-up";
  const recommendationReasoning = language === 'rw' ?
    "Itsinda ryacu ry'aba e-mechanic ryakiriye amakuru watanze. Bazayasuzuma neza kandi bakwandikire mu gihe cya vuba bakoresheje numero watanze mu ntambwe ikurikira. Bazakubwira ibyerekeye ikibazo cyawe, intambwe zishobora guterwa, n'amafaranga yose ajyanye na serivisi yuzuye yo gusuzuma cyangwa gukora imodoka." :
    "Our e-mechanic team has received your submitted information. They will carefully review it and contact you shortly using the details you provide in the next step. They will discuss your case, potential next steps, and any associated service costs for a full diagnosis or repair.";
  
  const urgencyText = language === 'rw' ? "Bigenwa na e-mechanic nyuma yo gusuzuma" : "To be determined by e-mechanic after review";
  
  const imageNotesText = imageBase64 
    ? (language === 'rw' ? "Ifoto yoherejwe kugirango isuzumwe n'umu e-mechanic." : "Image submitted for e-mechanic review.")
    : (language === 'rw' ? "Nta foto yoherejwe." : "No image submitted.");
  
  const disclaimerText = language === 'rw' ?
    "Iki ni icyemezo cy'uko amakuru yakusanyijwe. Umu e-mechanic wujuje ibisabwa niwe uzatanga isuzuma nyaryo n'ubujyanama." :
    "This confirms your information has been collected. A qualified e-mechanic will provide the actual assessment and consultation.";

  return {
    potentialProblems: [], // This section is no longer populated by AI
    immediateChecks: [],   // This section is no longer populated by AI
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