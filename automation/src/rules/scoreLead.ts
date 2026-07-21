import { BuyerSegment, ContactRole, ContactRouteType, Priority, ScoreBreakdown } from "../types.js";
import { normalizeText } from "./normalizeText.js";

const segmentScores: Record<BuyerSegment, number> = {
  extract_house: 35,
  flavor_house: 35,
  specialty_distributor: 32,
  premium_food_manufacturer: 30,
  chocolatier: 24,
  pastry_chef: 22,
  bakery: 18,
  luxury_hospitality: 18,
  private_label: 25,
  gourmet_retail: 20,
  unknown: 5
};

const roleScores: Record<ContactRole, number> = {
  commercial_buyer: 30,
  technical_buyer: 28,
  culinary_buyer: 22,
  decision_maker: 20,
  indirect_contact: 8,
  unknown_contact: 5
};

const routeScores: Record<ContactRouteType, number> = {
  email: 10,
  contact_form: 4,
  supplier_portal: 5,
  phone: 3,
  website_only: 1,
  needs_review: 0
};

export function priorityFromScore(score: number): Priority {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "HOLD";
}

function locationScore(value?: string | null): number {
  const text = normalizeText(value).toUpperCase();
  if (/\b(NY|NEW YORK|NJ|NEW JERSEY|IL|ILLINOIS)\b/.test(text)) return 10;
  if (/\b(CA|CALIFORNIA|FL|FLORIDA|TX|TEXAS)\b/.test(text)) return 8;
  if (/\b(WA|WASHINGTON|OR|OREGON)\b/.test(text)) return 6;
  if (/\bUSA|UNITED STATES|US\b/.test(text)) return 5;
  return text ? 2 : 0;
}

function premiumFitScore(...values: unknown[]): number {
  const text = normalizeText(values.join(" ")).toLowerCase();
  let score = 0;
  if (/\bpremium|luxury|gourmet|professional|high-end|prestige\b/.test(text)) score += 10;
  if (/\borganic|certified\b/.test(text)) score += 8;
  if (/\bspecialty|origin|traceable|single-origin\b/.test(text)) score += 8;
  if (/\bvanilla|tahitensis|bean|extract\b/.test(text)) score += 8;
  return Math.min(score, 10);
}

function spreadsheetPriorityScore(priority?: Priority | null, spreadsheetScore?: number | null): number {
  if (typeof spreadsheetScore === "number" && Number.isFinite(spreadsheetScore)) {
    return Math.max(0, Math.min(10, Math.round(spreadsheetScore / 10)));
  }
  if (priority === "A") return 10;
  if (priority === "B") return 7;
  if (priority === "C") return 4;
  return 0;
}

export function scoreLead(input: {
  buyer_segment: BuyerSegment;
  contact_role: ContactRole;
  contact_route_type: ContactRouteType;
  headquarters?: string | null;
  notes?: string | null;
  category?: string | null;
  spreadsheet_priority?: Priority | null;
  spreadsheet_score?: number | null;
}): ScoreBreakdown {
  const breakdown = {
    segment_score: segmentScores[input.buyer_segment],
    role_score: roleScores[input.contact_role],
    location_score: locationScore(input.headquarters),
    email_route_score: routeScores[input.contact_route_type],
    premium_fit_score: premiumFitScore(input.notes, input.category),
    spreadsheet_priority_score: spreadsheetPriorityScore(input.spreadsheet_priority, input.spreadsheet_score),
    total: 0,
    priority: "HOLD" as Priority
  };
  breakdown.total =
    breakdown.segment_score +
    breakdown.role_score +
    breakdown.location_score +
    breakdown.email_route_score +
    breakdown.premium_fit_score +
    breakdown.spreadsheet_priority_score;
  breakdown.priority = priorityFromScore(breakdown.total);
  return breakdown;
}
