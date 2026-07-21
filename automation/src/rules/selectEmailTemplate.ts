import { BuyerSegment, ContactRole, Priority } from "../types.js";

export function selectEmailTemplate(input: {
  buyer_segment: BuyerSegment;
  contact_role: ContactRole;
  priority: Priority;
  pipeline_stage?: string | null;
}): string | null {
  if (input.priority === "HOLD") return null;
  if (input.pipeline_stage === "followup_technical_docs") return "followup_technical_docs";
  if (input.pipeline_stage === "breakup_permission") return "breakup_permission";

  switch (input.buyer_segment) {
    case "extract_house":
      return "extract_house_intro";
    case "flavor_house":
      return "flavor_house_intro";
    case "specialty_distributor":
      return "distributor_intro";
    case "premium_food_manufacturer":
    case "private_label":
      return "manufacturer_intro";
    case "chocolatier":
    case "pastry_chef":
    case "bakery":
    case "luxury_hospitality":
    case "gourmet_retail":
      return "chef_chocolatier_intro";
    default:
      return input.contact_role === "technical_buyer" ? "followup_technical_docs" : "manufacturer_intro";
  }
}
