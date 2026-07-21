import { ContactRole } from "../types.js";
import { normalizeText } from "./normalizeText.js";

export function classifyRole(...values: unknown[]): ContactRole {
  const text = normalizeText(values.join(" ")).toLowerCase();

  if (/\bprocurement|purchasing|sourcing|buyer|category manager|trading desk\b/.test(text)) return "commercial_buyer";
  if (/\br&d|research|product development|innovation|formulation|technical\b/.test(text)) return "technical_buyer";
  if (/\bchef|pastry|chocolatier|culinary\b/.test(text)) return "culinary_buyer";
  if (/\bfounder|owner|ceo|president|managing director|director\b/.test(text)) return "decision_maker";
  if (/\bsales|marketing|support|customer service\b/.test(text)) return "indirect_contact";

  return "unknown_contact";
}
