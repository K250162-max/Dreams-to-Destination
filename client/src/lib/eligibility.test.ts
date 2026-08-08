import { describe, expect, it } from "vitest";
import { calculateEligibility } from "./eligibility";

describe("calculateEligibility", () => {
  it("returns a promising result for a well-prepared profile", () => {
    const result = calculateEligibility({
      goal: "study",
      destination: "canada",
      ageBand: "25-34",
      education: "postgraduate",
      experience: "3-5",
      language: "advanced",
      funds: "ready",
      passportValidity: "over_12",
    });

    expect(result.score).toBeGreaterThanOrEqual(78);
    expect(result.label).toBe("Promising starting point");
    expect(result.strengths.length).toBeGreaterThan(1);
  });

  it("qualifies a lower-scoring result and returns practical next steps", () => {
    const result = calculateEligibility({
      goal: "work",
      destination: "germany",
      ageBand: "45+",
      education: "secondary",
      experience: "1-2",
      language: "not_tested",
      funds: "uncertain",
      passportValidity: "under_6",
    });

    expect(result.label).toBe("Tailored review recommended");
    expect(result.nextSteps).toContain("Review passport renewal timing before applying");
    expect(result.nextSteps).toContain("Check current government guidance before making an application");
  });
});

