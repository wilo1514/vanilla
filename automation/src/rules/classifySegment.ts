import { BuyerSegment } from "../types.js";
import { normalizeText } from "./normalizeText.js";

export function classifySegment(...values: unknown[]): BuyerSegment {
  const text = normalizeText(values.join(" ")).toLowerCase();

  if (/\bextract|extraction|vanilla extract|processor|processing\b/.test(text)) return "extract_house";
  if (/\bflavo(u)?r|fragrance|aroma|taste\b/.test(text)) return "flavor_house";
  if (/\bdistributor|wholesale|importer|trader|specialty foods|ingredients distributor\b/.test(text)) return "specialty_distributor";
  if (/\bmanufacturer|food production|ice cream|beverage|dairy|frozen dessert|confectionery\b/.test(text)) return "premium_food_manufacturer";
  if (/\bchocolate|chocolatier|cacao|cocoa|couverture\b/.test(text)) return "chocolatier";
  if (/\bpastry|patisserie|chef\b/.test(text)) return "pastry_chef";
  if (/\bbakery|bakeries|baked goods\b/.test(text)) return "bakery";
  if (/\bhotel|resort|hospitality|fine dining|restaurant\b/.test(text)) return "luxury_hospitality";
  if (/\bprivate label|co-pack|copack|retail brand\b/.test(text)) return "private_label";
  if (/\bgourmet market|specialty retail|retail\b/.test(text)) return "gourmet_retail";

  return "unknown";
}
