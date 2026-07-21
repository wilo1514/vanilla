import { ContactRouteType, OutreachStatus } from "../types.js";
import { isValidEmail } from "./extractEmailAndContactRoutes.js";

export function canContact(input: {
  email?: string | null;
  route_type: ContactRouteType;
  is_suppressed?: boolean;
  unsubscribed?: boolean;
  bounced?: boolean;
  has_lawful_footer?: boolean;
}): { allowed: boolean; outreach_status: OutreachStatus; reason: string } {
  if (input.is_suppressed) return { allowed: false, outreach_status: "do_not_contact", reason: "suppressed" };
  if (input.unsubscribed) return { allowed: false, outreach_status: "do_not_contact", reason: "unsubscribed" };
  if (input.bounced) return { allowed: false, outreach_status: "do_not_contact", reason: "bounced" };
  if (input.email && !isValidEmail(input.email)) return { allowed: false, outreach_status: "do_not_contact", reason: "invalid_email" };
  if (!input.has_lawful_footer) return { allowed: false, outreach_status: "do_not_contact", reason: "missing_lawful_footer" };
  if (input.route_type === "email" && input.email && isValidEmail(input.email)) {
    return { allowed: true, outreach_status: "ready_for_draft", reason: "valid_email_route" };
  }
  if (input.route_type === "contact_form" || input.route_type === "supplier_portal") {
    return { allowed: false, outreach_status: "needs_manual_review", reason: "form_or_portal_only" };
  }
  return { allowed: false, outreach_status: "needs_manual_review", reason: "no_valid_email" };
}
