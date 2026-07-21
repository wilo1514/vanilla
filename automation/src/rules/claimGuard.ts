import { ClaimGuardResult } from "../types.js";

const approvedClaims = [
  "Single-origin Ecuadorian Vanilla Tahitensis beans",
  "Certified organic under applicable programs",
  "Estate-grown",
  "Estate-cured",
  "Lot-documented",
  "Independently analyzed for selected harvests",
  "Built for professional buyers",
  "Vanilla. Perfected.",
  "Request the current lot sheet",
  "Request technical documentation",
  "Request a sample kit",
  "Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 +/- 847 mg/kg vanillin.",
  "Our August 2025 / Harvest 2 sample was independently analyzed and reported at 8,273 ± 847 mg/kg vanillin."
];

const blockedPatterns = [
  /highest in the world/i,
  /best in the world/i,
  /guaranteed vanillin/i,
  /all lots (have|contain|show)/i,
  /superior to Madagascar/i,
  /superior to Tahiti/i,
  /traditional premium origins average a fraction/i,
  /carbon neutral/i,
  /sustainable(?!.*proof)/i,
  /medicinal/i,
  /therapeutic/i,
  /health benefits/i,
  /pesticide free/i,
  /chemical free/i
];

export function claimGuard(content: string): ClaimGuardResult {
  const blocked_terms = blockedPatterns
    .filter((pattern) => pattern.test(content))
    .map((pattern) => pattern.source);

  const claims_used = approvedClaims.filter((claim) => content.includes(claim));

  return {
    risk_status: blocked_terms.length > 0 ? "NEEDS REVIEW" : "SAFE",
    claims_used,
    blocked_terms
  };
}
