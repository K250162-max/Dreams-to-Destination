export type EligibilityAnswers = {
  goal: string;
  destination: string;
  ageBand: string;
  education: string;
  experience: string;
  language: string;
  funds: string;
  passportValidity: string;
};

export type EligibilityResult = {
  score: number;
  label: string;
  summary: string;
  strengths: string[];
  nextSteps: string[];
};

export const emptyEligibilityAnswers: EligibilityAnswers = {
  goal: "",
  destination: "",
  ageBand: "",
  education: "",
  experience: "",
  language: "",
  funds: "",
  passportValidity: "",
};

export function calculateEligibility(answers: EligibilityAnswers): EligibilityResult {
  let score = 12;
  const strengths: string[] = [];
  const nextSteps: string[] = [];

  if (answers.goal) score += 8;
  if (answers.destination) score += 8;

  const agePoints: Record<string, number> = { "18-24": 12, "25-34": 14, "35-44": 10, "45+": 6 };
  score += agePoints[answers.ageBand] ?? 0;

  const educationPoints: Record<string, number> = {
    secondary: 5,
    diploma: 8,
    bachelor: 12,
    postgraduate: 14,
  };
  score += educationPoints[answers.education] ?? 0;
  if (["bachelor", "postgraduate"].includes(answers.education)) strengths.push("Strong academic foundation");

  const experiencePoints: Record<string, number> = { none: 2, "1-2": 7, "3-5": 11, "6+": 13 };
  score += experiencePoints[answers.experience] ?? 0;
  if (["3-5", "6+"].includes(answers.experience)) strengths.push("Relevant professional experience");

  const languagePoints: Record<string, number> = { not_tested: 3, basic: 5, intermediate: 9, advanced: 13 };
  score += languagePoints[answers.language] ?? 0;
  if (answers.language === "advanced") strengths.push("Competitive language readiness");
  if (["not_tested", "basic"].includes(answers.language)) nextSteps.push("Create a language testing or evidence plan");

  const fundsPoints: Record<string, number> = { uncertain: 3, partial: 7, ready: 12 };
  score += fundsPoints[answers.funds] ?? 0;
  if (answers.funds === "ready") strengths.push("Financial preparation appears well advanced");
  if (answers.funds !== "ready") nextSteps.push("Confirm the destination-specific funds requirement");

  const passportPoints: Record<string, number> = { under_6: 1, "6-12": 6, over_12: 10 };
  score += passportPoints[answers.passportValidity] ?? 0;
  if (answers.passportValidity === "under_6") nextSteps.push("Review passport renewal timing before applying");

  const normalizedScore = Math.min(100, score);
  if (!nextSteps.length) nextSteps.push("Validate route-specific criteria with a document review");
  nextSteps.push("Check current government guidance before making an application");

  if (normalizedScore >= 78) {
    return {
      score: normalizedScore,
      label: "Promising starting point",
      summary: "Your answers suggest a potentially competitive foundation for further route-specific assessment.",
      strengths,
      nextSteps,
    };
  }

  if (normalizedScore >= 56) {
    return {
      score: normalizedScore,
      label: "Potential with preparation",
      summary: "Your profile may have viable options, with a few areas that deserve focused preparation before choosing a route.",
      strengths,
      nextSteps,
    };
  }

  return {
    score: normalizedScore,
    label: "Tailored review recommended",
    summary: "A personal consultation would help identify realistic pathways, alternatives, and the most valuable next steps.",
    strengths,
    nextSteps,
  };
}
