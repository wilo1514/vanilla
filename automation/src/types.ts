export type BuyerSegment =
  | "extract_house"
  | "flavor_house"
  | "specialty_distributor"
  | "premium_food_manufacturer"
  | "chocolatier"
  | "pastry_chef"
  | "bakery"
  | "luxury_hospitality"
  | "private_label"
  | "gourmet_retail"
  | "unknown";

export type ContactRole =
  | "commercial_buyer"
  | "technical_buyer"
  | "culinary_buyer"
  | "decision_maker"
  | "indirect_contact"
  | "unknown_contact";

export type ContactRouteType =
  | "email"
  | "contact_form"
  | "supplier_portal"
  | "phone"
  | "website_only"
  | "needs_review";

export type OutreachStatus =
  | "ready_for_draft"
  | "needs_manual_review"
  | "do_not_contact";

export type Priority = "A" | "B" | "C" | "HOLD";

export interface ImportedRow {
  source_file: string;
  source_sheet: string;
  row_number: number;
  company_name: string;
  normalized_company_name: string;
  website?: string | null;
  domain?: string | null;
  phone?: string | null;
  public_email?: string | null;
  contact_form_url?: string | null;
  supplier_portal_url?: string | null;
  notes?: string | null;
  spreadsheet_segment?: string | null;
  spreadsheet_priority?: Priority | null;
  spreadsheet_score?: number | null;
  recommended_role?: string | null;
  headquarters?: string | null;
}

export interface NormalizedContact extends ImportedRow {
  buyer_segment: BuyerSegment;
  contact_role: ContactRole;
  contact_route_type: ContactRouteType;
  email_status: "valid" | "invalid" | "missing";
  contact_status: OutreachStatus;
  lead_score: number;
  priority: Priority;
}

export interface ScoreBreakdown {
  segment_score: number;
  role_score: number;
  location_score: number;
  email_route_score: number;
  premium_fit_score: number;
  spreadsheet_priority_score: number;
  total: number;
  priority: Priority;
}

export interface ClaimGuardResult {
  risk_status: "SAFE" | "NEEDS REVIEW";
  claims_used: string[];
  blocked_terms: string[];
}
