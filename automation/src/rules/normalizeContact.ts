import { ImportedRow, NormalizedContact } from "../types.js";
import { classifyRole } from "./classifyRole.js";
import { classifySegment } from "./classifySegment.js";
import { canContact } from "./canContact.js";
import { detectContactRoutes, isValidEmail } from "./extractEmailAndContactRoutes.js";
import { normalizeCompanyName, toDomain, toWebsite } from "./normalizeText.js";
import { scoreLead } from "./scoreLead.js";

export function normalizeContact(row: ImportedRow, suppressedEmails = new Set<string>()): NormalizedContact {
  const website = toWebsite(row.website);
  const domain = row.domain ?? toDomain(website);
  const routes = detectContactRoutes({
    publicEmail: row.public_email,
    contactUrl: row.contact_form_url,
    supplierRoute: row.supplier_portal_url,
    website,
    phone: row.phone
  });
  const buyer_segment = classifySegment(row.spreadsheet_segment, row.notes, row.company_name);
  const contact_role = classifyRole(row.recommended_role, row.notes);
  const email_status = routes.email ? (isValidEmail(routes.email) ? "valid" : "invalid") : "missing";
  const allowed = canContact({
    email: routes.email,
    route_type: routes.route_type,
    is_suppressed: routes.email ? suppressedEmails.has(routes.email.toLowerCase()) : false,
    has_lawful_footer: true
  });
  const score = scoreLead({
    buyer_segment,
    contact_role,
    contact_route_type: routes.route_type,
    headquarters: row.headquarters,
    notes: row.notes,
    category: row.spreadsheet_segment,
    spreadsheet_priority: row.spreadsheet_priority,
    spreadsheet_score: row.spreadsheet_score
  });

  return {
    ...row,
    normalized_company_name: row.normalized_company_name || normalizeCompanyName(row.company_name),
    website,
    domain,
    public_email: routes.email,
    contact_form_url: routes.contact_form_url,
    supplier_portal_url: routes.supplier_portal_url,
    buyer_segment,
    contact_role,
    contact_route_type: routes.route_type,
    email_status,
    contact_status: allowed.outreach_status,
    lead_score: score.total,
    priority: score.priority
  };
}
